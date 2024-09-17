import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { StreamVideoClient, StreamCall, StreamTheme, SpeakerLayout, useCallStateHooks, CallControls } from '@stream-io/video-react-sdk';
import Loader from '../Loader/Loader';
import { useRecoilValue } from 'recoil';
import userAtom from '../../atom/UserAtom';
import { MyFloatingLocalParticipant, ShareLink } from './Stream';
import './stram.css';
import '@stream-io/video-react-sdk/dist/css/styles.css';

const apiKey = 'j7gdbzr5dj23';

const JoinMeeting = () => {
  const { callId } = useParams();  
  const navigate = useNavigate(); // Hook to programmatically navigate
  const [call, setCall] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState('');
  const [videoClient, setVideoClient] = useState(null);
  const user = useRecoilValue(userAtom);

  // Fetch the token when the component mounts
  useEffect(() => {
    const getToken = async () => {
      try {
        const res = await fetch('/api/c/stream/token', { credentials: 'include' });
        const data = await res.json();
        setToken(data.token);  // Ensure token is set once it's fetched
      } catch (error) {
        console.error('Error fetching token:', error);
        setError('Error fetching token');
      }
    };
    getToken();
  }, [user]);

  // Initialize StreamVideoClient once the token is available
  useEffect(() => {
    if (token && user) {
      const client = new StreamVideoClient({
        apiKey,
        tokenProvider: () => token,
      });
      setVideoClient(client);
    }
  }, [token, user]);

  // Use hooks from Stream SDK
  const { useLocalParticipant, useRemoteParticipants } = useCallStateHooks();
  const localParticipant = useLocalParticipant();
  const remoteParticipants = useRemoteParticipants();

  // Initialize the call once videoClient and token are available
  useEffect(() => {
    const initializeCall = async () => {
      if (!videoClient || !user || !token) throw new Error('Missing videoClient, user, or token');
      try {
        // Connect the user to the client
        await videoClient.connectUser({
          id: user._id,
          name: user.username,
          image: 'http://res.cloudinary.com/dybgs03yy/image/upload/v1725439344/scagutwwdrziyy7c2isd.png',
        }, token);

        // Create and join the call with options for audio and video
        const callInstance = videoClient.call('default', callId);
        await callInstance.join({
          create: true,
          audio: true, // Ensure audio is turned on
          video: true, // Ensure video is turned on
        });
        
        // Enable camera and microphone after joining
        await callInstance.camera.enable();
        await callInstance.microphone.enable();

        setCall(callInstance);
        setLoading(false);
      } catch (err) {
        console.error('Error joining call:', err);
        setError('Failed to join the call.');
        setLoading(false); // Stop loading on error
        navigate('/'); // Optionally redirect to home on error
      }
    };

    if (videoClient && token) {
      initializeCall();
    }

    return () => {
      if (call) call.leave();
      if (videoClient) videoClient.disconnectUser();
    };
  }, [videoClient, callId, user, token, navigate, call]);

  // Monitor the call state and navigate when the call ends
  useEffect(() => {
    if (call && call.state === 'ended') {
      navigate('/'); // Navigate to home when the call ends
    }
  }, [call, navigate]);

  // Show loader until call is ready or an error occurs
  if (loading) return <Loader />;
  if (error) return <div>{error}</div>;
  if (!call) return <div>Error initializing call...</div>;

  console.log('Call state:', call.state);
  if (!call.state) {
    return <Loader />;
  }

  return (
    <StreamCall call={call}>
      <StreamTheme style={{ position: 'relative' }}>
        <SpeakerLayout participantsBarPosition="bottom" />
        <CallControls />
        <MyFloatingLocalParticipant participant={localParticipant} />
        <ShareLink callId={call.cid.split(':')[1]} />
      </StreamTheme>
    </StreamCall>
  );
};

export default JoinMeeting;
