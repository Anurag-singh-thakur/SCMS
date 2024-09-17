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
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import './stram.css';
import '@stream-io/video-react-sdk/dist/css/styles.css';

const apiKey = 'j7gdbzr5dj23';

function Stream() {
  const callId = uuidv4(); 
  const user = useRecoilValue(userAtom);  
  const [videoClient, setVideoClient] = useState(null);
  const [token, setToken] = useState('');
  const [call, setCall] = useState(null);
  const navigate = useNavigate();

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

  useEffect(() => {
    if (token) {
      const client = new StreamVideoClient({
        apiKey,
        user: {
          id: user?._id,
          name: user?.username,
          image: 'http://res.cloudinary.com/dybgs03yy/image/upload/v1725439344/scagutwwdrziyy7c2isd.png'
        },
        tokenProvider: () => Promise.resolve(token),
      });
      setVideoClient(client);

      // Cleanup: Use disconnectUser() when component unmounts
      return () => {
        if (client) client.disconnectUser();
      };
    }
  }, [token, user]);

  useEffect(() => {
    if (videoClient && !call) {
      const callInstance = videoClient.call('default', callId);
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

  // Monitor call state and navigate to "/" when the call ends
  useEffect(() => {
    if (call && call.state === 'ended') {
      navigate('/'); // Navigate to home when call ends
    }
  }, [call, navigate]);

  // Show Loader while waiting for video client or call setup
  if (!videoClient || !call) return <Loader />;

  return (
    <StreamVideo client={videoClient}>
      <StreamCall className="str-video" call={call}>
        <MyUILayout call={call} />
      </StreamCall>
    </StreamVideo>
  );
}

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

export const ShareLink = ({ callId }) => {
  const shareLink = `${window.location.origin}/meeting/${callId}`;

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink).then(() => {
      alert('Link copied to clipboard!');
    });
  };

  return (
    <div style={{
      position: 'fixed', 
      right: '20px',     
      bottom: '20px',    
      zIndex: 1000,      
      backgroundColor: '#fff',
      padding: '10px',
      boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
      borderRadius: '8px',
    }}>
      <button onClick={copyLink} style={{
        backgroundColor: '#4CAF50', 
        color: 'white', 
        padding: '10px 20px', 
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
      }}>
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
          borderRadius: '4px'
        }}
      />
    </div>
  );
};

export default Stream;
