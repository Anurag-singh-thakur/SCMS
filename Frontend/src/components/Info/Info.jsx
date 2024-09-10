import React, { useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import { FaEdit, FaTrashAlt, FaTimes } from 'react-icons/fa';
import "./Info.css";
import { RiChatSmile3Line } from "react-icons/ri";
import { SiGooglemeet } from "react-icons/si";
import { IoIosAddCircleOutline } from "react-icons/io";
import { RiInformation2Line } from "react-icons/ri";
import info_profile_image from '../../assets/profile_icon.png';

const Info = () => {
  const [userDetails, setUserDetails] = useState({
    name: 'User Name',
    position: 'Developer',
    profileImage: info_profile_image
  });

  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [newDetails, setNewDetails] = useState({
    name: userDetails.name,
    position: userDetails.position,
    profileImage: userDetails.profileImage
  });

  const handleEditClick = () => {
    setIsPopupVisible(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDetails({ ...newDetails, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const imageUrl = URL.createObjectURL(file);
    setNewDetails({ ...newDetails, profileImage: imageUrl });
  };

  const handleSave = () => {
    setUserDetails(newDetails);
    setIsPopupVisible(false);
  };

  const handleDelete = () => {
    setUserDetails(null);
  };

  return (
    <>
      <div className="info-container">
        <Sidebar id="sidebar" />
        <div className="secondary-navbar-container">
          <div className="secondary-navbar">
            <button className=" btn-chat"> <RiChatSmile3Line /></button>
            <button className=" btn-meet"><SiGooglemeet /></button>
            <button className=" btn-add"><IoIosAddCircleOutline /></button>
            <button className=" btn-info"><RiInformation2Line /></button>
          </div>
          {userDetails ? (
            <div className="card-container">
              <div className="card">
                <div className="info-wrapper">
                  <div className="info-card-image">
                    <img src={userDetails.profileImage} alt="profile" />
                  </div>
                  <div className="info-card-title">
                    <h2>{userDetails.name}</h2>
                    <p>Position: {userDetails.position}</p>
                  </div>
                </div>
                <div className="infoitems">
                  <button className="infobtn-edit" onClick={handleEditClick}>
                    <FaEdit />
                  </button>
                  <button className="infobtn-delete" onClick={handleDelete}>
                    <FaTrashAlt />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <p>No profile found. User deleted.</p>
          )}
        </div>
      </div>

      {isPopupVisible && (
        <div className="popup">
          <div className="popup-content">
            <FaTimes className="popup-close" onClick={() => setIsPopupVisible(false)} />
            <div className="image-section">
              <input type="file" accept="image/*" onChange={handleImageChange} />
              {newDetails.profileImage && (
                <img
                  src={newDetails.profileImage}
                  alt="preview"
                  className="image-preview"
                />
              )}
            </div>
            <div className="form-section">
              <label>
                Name:
                <input
                  type="text"
                  name="name"
                  value={newDetails.name}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Position:
                <input
                  type="text"
                  name="position"
                  value={newDetails.position}
                  onChange={handleInputChange}
                />
              </label>
              <div className="popup-buttons">
                <button onClick={handleSave}>Save</button>
                <button onClick={() => setIsPopupVisible(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Info;
