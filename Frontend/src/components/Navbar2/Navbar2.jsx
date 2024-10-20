import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { RiChatSmile3Line } from "react-icons/ri";
import { FaShare } from "react-icons/fa6";
import { SiGooglemeet } from "react-icons/si";
import { IoIosAddCircleOutline } from "react-icons/io";
import { RiInformation2Line } from "react-icons/ri";
import './Navbar2.css'; 
import Create from '../Create/Create';
import { v4 as uuidv4 } from 'uuid'

const ImageModal = ({ imageSrc, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {imageSrc && <img src={imageSrc} alt="Notice" />}
      </div>
    </div>
  );
};


const Navbar2 = ({subtecher,userId}) => {
  const navigate = useNavigate();
  const { id: subjectId } = useParams();
  const [isCreateVisible, setIsCreateVisible] = useState(false);
  const [isShareVisible, setIsShareVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [shareableLink, setShareableLink] = useState('');

  const handleCloseCreate = () => {
    setIsCreateVisible(false);
  };

  const handleCreateButtonClick = () => {
    setIsCreateVisible(!isCreateVisible);
  };

  const handleShareButtonClick = () => {
    const link = `${window.location.origin}/join/${subjectId}`;
    setShareableLink(link);
    setIsShareVisible(true);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(shareableLink)
      .then(() => {
        alert('Link copied to clipboard!');
      })
      .catch((error) => {
        console.error('Failed to copy link:', error);
      });
  };
  const handleMeetButtonClick = () => {
    const callId = uuidv4(); 
    navigate(`/stream/${callId}`);  
  };
  const handleCloseModal = () => {
    setIsModalVisible(false);
  };
  return (
    <div id="navbar2">
      <button className="navbar2-btn" onClick={() => navigate(`/chat/${subjectId}`)}>
        <RiChatSmile3Line />
      </button>
      <button className="navbar2-btn" onClick={handleShareButtonClick}>
        <FaShare />
      </button>
      <button className="navbar2-btn" onClick={handleMeetButtonClick }>
        <SiGooglemeet />
      </button>
      {console.log(subtecher?._id,userId)}
      {subtecher === userId && (
        <button className="navbar2-btn" onClick={handleCreateButtonClick}>
          <IoIosAddCircleOutline />
        </button>
      )}
      <button className="navbar2-btn" onClick={() => navigate(`/info/${subjectId}`)}>
        <RiInformation2Line />
      </button>
      {isShareVisible && (
        <div className="share-popup">
          <div className="share-popup-content">
            <p>Share this link:</p>
            <input type="text" value={shareableLink} readOnly />
            <div className="share-popup-buttons">
              <button onClick={handleCopyToClipboard}>Copy</button>
              <button onClick={() => setIsShareVisible(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {isCreateVisible && <Create subjectId={subjectId} handleClose={handleCloseCreate} />}
      {isModalVisible && <ImageModal imageSrc={selectedImage} onClose={handleCloseModal} />}
    </div>

    
  );
};

export default Navbar2;
