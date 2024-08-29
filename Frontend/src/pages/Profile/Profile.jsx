import React from 'react';
import './Profile.css';
import profile_image from '../../assets/profile_icon.png';
const Profile = () => {
  return (
    <div className="profile-container">
      <div className="profile-card">
        <img 
          src={profile_image}
          alt="Profile" 
          className="profile-image" 
        />
        <h1 className="profile-name">John Doe</h1>
        <div className="stats-container">
          <div className="stat-circle">
            <span className="stat-value">8.5</span>
            <span className="stat-label">Avg. Marks</span>
          </div>
          <div className="stat-circle">
            <span className="stat-value">92%</span>
            <span className="stat-label">Avg. Attendance</span>
          </div>
        </div>
        <div className="rating-row">
          <span className="rating-label">Rating:</span>
          <span className="rating-value">★★★★☆</span>
        </div>
      </div>
    </div>
  );
};

export default Profile;
