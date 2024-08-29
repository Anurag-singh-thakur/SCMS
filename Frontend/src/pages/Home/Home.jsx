import React, { useState } from 'react';
import './Home.css'; 
import ClassScheduling from '../../components/Class-Scheduling/Class-scheduling';

const Home = () => {
    const [nextClassTime, setNextClassTime] = useState('');

    const handleNextClassTime = (time) => {
        setNextClassTime(time);
    };

    return (
        <div className='home'>
            <div className="flashmessage">
                {nextClassTime && `Your next class will be at ${nextClassTime}`}
            </div>
            <ClassScheduling onNextClassTime={handleNextClassTime} />
        </div>
        
    );
}

export default Home;
