import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const JoinSubject = () => {
    const { id: subjectId } = useParams();
  
    useEffect(() => {
      const joinSubject = async () => {
        try {
  
          const response = await fetch(`/api/s/join/${subjectId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          });
  
          if (response.ok) {
            console.log('Joined subject successfully');
            window.location.href = '/';
          } else {
            console.error('Failed to join subject');
          }
        } catch (error) {
          console.error('Error joining subject:', error);
        }
      };
  
      joinSubject();
    }, [subjectId]);
  
    return <div>Joining...</div>;
};

export default JoinSubject;
  
