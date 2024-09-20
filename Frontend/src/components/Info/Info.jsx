import React, { useEffect, useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import { FaEdit, FaTrashAlt, FaTimes } from 'react-icons/fa';
import './Info.css';
import { useRecoilValue } from 'recoil';
import subjectAtom from '../../atom/SubjectAtom';
import Navbar2 from '../Navbar2/Navbar2.jsx';
import { useParams } from 'react-router-dom';
import usePreviewImg from '../../hooks/usePrevImg.jsx'; // Import the custom hook

const Info = () => {
  const subject = useRecoilValue(subjectAtom);
  const [subjectstudent, setSubjectStudent] = useState([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [newDetails, setNewDetails] = useState({
    stuId: '',
    name: '',
    profileImage: '',
  });

  const { id: subjectId } = useParams();
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg(newDetails.profileImage);

  // Update form when editing student details
  const handleEditClick = (stu) => {
    setNewDetails({
      stuId: stu._id,
      name: stu.username,
      profileImage: stu.profileImage || '',
    });
    setImgUrl(stu.profileImage || ''); // Set the image in the preview hook
    setIsPopupVisible(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDetails({ ...newDetails, [name]: value });
  };

  const handleSave = async () => {
    // Attach the base64 image from imgUrl to newDetails
    setNewDetails((prevDetails) => ({
      ...prevDetails,
      profileImage: imgUrl,
    }));

    try {
      const res = await fetch(`/api/s/updateUserDetails/${newDetails.stuId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ ...newDetails, profileImage: imgUrl }),
      });
      
      const data = await res.json();
      console.log('Response:', data);
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
        setSubjectStudent(data);
      } catch (error) {
        console.error(error);
      }
    };
    getSubjectStudent();
  }, [subjectId]);

  const handleDelete = () => {
    // Delete user logic here
  };

  const handleCreateClick = () => {
    console.log('Create button clicked');
  };

  const handleShareClick = () => {
    const shareableLink = `${window.location.origin}/join/${subject?._id}`;
    navigator.clipboard.writeText(shareableLink).then(() => {
      alert('Link copied to clipboard!');
    });
  };

  return (
    <>
      <div className="info-container">
        <Sidebar id="sidebar" />
        <div className="secondary-navbar-container">
          <Navbar2 onCreateClick={handleCreateClick} onShareClick={handleShareClick} subjectId={subject?._id} />

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
                    <button className="infobtn-edit" onClick={() => handleEditClick(stu)}>
                      <FaEdit />
                    </button>
                    <button className="infobtn-delete" onClick={handleDelete}>
                      <FaTrashAlt />
                    </button>
                  </div>
                </div>
              </div>
            ))
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
              {imgUrl && (
                <img src={imgUrl} alt="preview" className="image-preview" />
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
