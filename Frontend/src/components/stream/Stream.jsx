import {
  CallingState,
  StreamCall,
  StreamVideo,
  StreamVideoClient,
  useCallStateHooks,
  ParticipantView,
  CallControls,
  StreamTheme,
  SpeakerLayout,
} from '@stream-io/video-react-sdk';
import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import userAtom from '../../atom/UserAtom';
import Loader from '../Loader/Loader';
import { useNavigate, useParams } from 'react-router-dom';
import './stram.css';
import '@stream-io/video-react-sdk/dist/css/styles.css';

const apiKey = 'j7gdbzr5dj23';

function Stream() {
  const { callId } = useParams(); // Get callId from the URL parameters
  const user = useRecoilValue(userAtom);
  const [videoClient, setVideoClient] = useState(null);
  const [token, setToken] = useState('');
  const [call, setCall] = useState(null);
  const navigate = useNavigate();

  // Fetch the token for the user
  useEffect(() => {
    const getToken = async () => {
      try {
        const res = await fetch('/api/c/stream/token', {
          credentials: 'include',
        });
        const data = await res.json();
        setToken(data.token);
      } catch (error) {
        console.error('Error fetching token:', error);
      }
    };

    getToken();
  }, [user]);

  // Initialize Stream Video Client when token is available
  useEffect(() => {
    if (token) {
      const client = new StreamVideoClient({
        apiKey,
        user: {
          id: user?._id,
          name: user?.username,
          image: user?.image,
        },
        tokenProvider: () => Promise.resolve(token),
      });
      setVideoClient(client);

      // Cleanup: Disconnect the video client when component unmounts
      return () => {
        if (client) client.disconnectUser();
      };
    }
  }, [token, user]);

  // Join the call and monitor the call state
  useEffect(() => {
    if (videoClient && !call) {
      const callInstance = videoClient.call('default', callId); // Use callId from params
      callInstance
        .join({ create: true })
        .then(() => setCall(callInstance))
        .catch((error) => {
          console.error('Error joining call:', error);
        });

      // Cleanup: Leave the call when component unmounts
      return () => {
        if (callInstance) callInstance.leave();
      };
    }
  }, [videoClient, callId, call]);

  // Detect if the call ends or user leaves the call, and navigate to '/'
  useEffect(() => {
    if (call) {
      const handleCallEnded = () => {
        navigate('/'); // Navigate to home when call ends or user leaves
      };

      // Check if call ends
      if (call.state === 'ENDED') {
        handleCallEnded();
      }

      // Listen for when the user leaves the call
      call.on('state_changed', (newState) => {
        if (newState === 'ENDED') {
          handleCallEnded();
        }
      });

      // Cleanup: remove event listener on unmount
      return () => {
        call.off('state_changed', handleCallEnded);
      };
    }
  }, [call, navigate]);

  // Display Loader while video client or call is being initialized
  if (!videoClient || !call) return <Loader />;

  return (
    <StreamVideo client={videoClient}>
      <StreamCall className="str-video" call={call}>
        <MyUILayout call={call} />
      </StreamCall>
    </StreamVideo>
  );
}

// Custom layout for Stream UI
export const MyUILayout = ({ call }) => {
  const { useCallCallingState, useLocalParticipant, useRemoteParticipants } = useCallStateHooks();

  const callingState = useCallCallingState();
  const localParticipant = useLocalParticipant();
  const remoteParticipants = useRemoteParticipants();

  if (callingState !== CallingState.JOINED) {
    return <Loader />;
  }

  return (
    <StreamTheme style={{ position: 'relative' }}>
      <SpeakerLayout participantsBarPosition="bottom" />
      <CallControls />
      <MyFloatingLocalParticipant participant={localParticipant} />
      {console.log(call, 'remoteParticipants')}
      <ShareLink callId={call.cid.split(':')[1]} />
    </StreamTheme>
  );
};

// Display floating local participant view
export const MyFloatingLocalParticipant = ({ participant }) => {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '15px',
        left: '15px',
        width: '240px',
        height: '135px',
        boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 10px 3px',
        borderRadius: '12px',
        zIndex: 1000,
      }}
    >
      {participant ? <ParticipantView muteAudio participant={participant} /> : null}
    </div>
  );
};

// Generate a shareable link for the call
export const ShareLink = ({ callId }) => {
  const shareLink = `${window.location.origin}/meeting/${callId}`;

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink).then(() => {
      alert('Link copied to clipboard!');
    });
  };

  return (
    <div
      style={{
        position: 'fixed',
        right: '20px',
        bottom: '20px',
        zIndex: 1000,
        backgroundColor: '#fff',
        padding: '10px',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
      }}
    >
      <button
        onClick={copyLink}
        style={{
          backgroundColor: '#4CAF50',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Copy Join Link
      </button>
      <input
        type="text"
        readOnly
        value={shareLink}
        style={{
          marginLeft: '10px',
          border: '1px solid #ddd',
          padding: '5px',
          borderRadius: '4px',
        }}
      />
    </div>
  );
};


export default Stream;  

