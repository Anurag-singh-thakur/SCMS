import { AiFillFileImage } from "react-icons/ai"; 
import React, { useEffect, useRef, useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import { FaEdit, FaTrashAlt, FaTimes } from 'react-icons/fa';
import './Info.css';
import { useRecoilState, useRecoilValue } from 'recoil';
import subjectAtom from '../../atom/SubjectAtom';
import Navbar2 from '../Navbar2/Navbar2.jsx';
import { useParams } from 'react-router-dom';
import usePreviewImg from '../../hooks/usePrevImg.jsx'; // Import the custom hook
import userAtom from '../../atom/UserAtom.js';

const Info = () => {
  const [user, setUser] = useRecoilState(userAtom);
  const subject = useRecoilValue(subjectAtom);
  const [subjectstudent, setSubjectStudent] = useState([]);
  const [subtecher, setSubtecher] = useState({});
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [newDetails, setNewDetails] = useState({
    stuId: '',
    username: '',  // Changed 'name' to 'username'
    image: '',
  });
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
      fileInputRef.current.click();  
  };
  const { id: subjectId } = useParams();
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg(newDetails.image);

  // Update form when editing student details
  const handleEditClick = (stu) => {
    setNewDetails({
      stuId: stu._id,
      username: stu.username,   
      image: stu.image || '',
    });
    setImgUrl(stu.image || '');  
    setIsPopupVisible(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDetails({ ...newDetails, [name]: value });
  };

  const handleSave = async () => {
    try {
      const updatedDetails = { 
        ...newDetails, 
        username: newDetails.username,
        image: imgUrl,
      };
      console.log("updatedDetails:", updatedDetails);
  
      const res = await fetch(`/api/s/updateUserDetails/${newDetails.stuId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updatedDetails),
      });
  
      const data = await res.json();
      console.log('Response:', data);
  
      // Update local Recoil user state
      setUser((prev) => ({
        ...prev,
        username: newDetails.username,  
        image: imgUrl,
      }));
  
      console.log(user,"user line 76");
  
      // Update students or teacher list in the local state
      if (newDetails.stuId === subtecher[0]?._id) {
        setSubtecher([{ ...subtecher[0], ...data.updatedUser }]);  // Corrected the use of updatedUser
      } 
      else {
        setSubjectStudent((prev) =>
          prev.map((stu) => 
            stu._id === newDetails.stuId ? { ...stu, ...data.updatedUser } : stu // Return in map function
          )
        );
      }
  
      // Close the popup after a successful save
      setIsPopupVisible(false);
    } catch (error) {
      console.error('Error updating details:', error);
    }
  };
  
  useEffect(() => {
    const getSubjectStudent = async () => {
      try {
        const res = await fetch(`/api/s/getpartsubject/${subjectId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        const data = await res.json();
        setSubtecher(data.teacher || {});
        setSubjectStudent(data.students || []);
      } catch (error) {
        console.error(error);
      }
    };
    getSubjectStudent();
  }, [subjectId]);

  const handleDelete = () => {
    // Delete user logic here
  };

  return (
    <>
      <div className="info-container">
        <Sidebar id="sidebar" />
        <div className="secondary-navbar-container">
          <Navbar2 subtecher={subtecher[0]?.username} userId={user?.username}/>
          {/* Display teacher details */}
          <div className="card-container">
                <div className="card">
                  <div className="info-wrapper">
                    <div className="info-card-image">
                      <img className="info-card-image" src={subtecher[0]?.image || 'https://via.placeholder.com/150'} alt="profile" />
                    </div>
                    <div className="info-card-title">
                      <h3 style={{ color: 'black' }}>{subtecher[0]?.username}👑</h3>
                    </div>
                  </div>
                  <div className="infoitems">
                    {user?._id === subtecher[0]?._id && (
                      <div className="infobtn-group">
                        <button className="infobtn-edit" onClick={() => handleEditClick(subtecher[0])}>
                          <FaEdit />
                        </button>
                        <button className="infobtn-delete" onClick={handleDelete}>
                          <FaTrashAlt />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
          </div>

          {subjectstudent && subjectstudent.length > 0 ? (
            subjectstudent.map((stu) => (
              <div className="card-container" key={stu._id}>
                <div className="card">
                  <div className="info-wrapper">
                    <div className="info-card-image">
                      <img className="info-card-image" src={stu.image || 'https://via.placeholder.com/150'} alt="profile" />
                    </div>
                    <div className="info-card-title">
                      <h3 style={{ color: 'black' }}>{stu.username}</h3>
                    </div>
                  </div>
                  <div className="infoitems">
                    {user?._id === stu?._id && (
                        <button className="infobtn-edit" onClick={() => handleEditClick(stu)}>
                      <FaEdit />
                      </button>
                    )}
                    {(user?._id === stu?._id || user?._id === subtecher[0]?._id) && (
                      <button className="infobtn-delete" onClick={handleDelete}>
                        <FaTrashAlt />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p></p>
          )}
        </div>
      </div>

      {isPopupVisible && (
        <div className="popup">
          <div className="popup-content">
            <FaTimes className="popup-close" onClick={() => setIsPopupVisible(false)} />
            <div className="image-section">
              <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  ref={fileInputRef}
                  style={{ display: 'none' }} 
              />
              <img
                src={ imgUrl || 'https://via.placeholder.com/150'}
                alt="preview"
                className="image-preview"
              />
              <button onClick={handleButtonClick}><AiFillFileImage /></button>
           </div>
            <div className="form-section">
              <label className="label-info">
                Username:  {/* Changed 'Name' to 'Username' */}
                <input
                  type="text"
                  name="username"  // Changed 'name' to 'username'
                  value={newDetails.username}  // Updated 'name' to 'username'
                  onChange={handleInputChange}
                />
              </label>
              <div className="popup-buttons">
                <button onClick={handleSave} style={{ backgroundColor: '#4CAF50', color: 'white' }}>Save</button>
                <button onClick={() => setIsPopupVisible(false)} style={{ backgroundColor: '#f44336', color: 'white' }}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Info;

