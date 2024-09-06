import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RiChatSmile3Line } from "react-icons/ri";
import { FaShare } from "react-icons/fa6";
import { SiGooglemeet } from "react-icons/si";
import { IoIosAddCircleOutline } from "react-icons/io";
import { RiInformation2Line } from "react-icons/ri";
import './Navbar2.css'; 

const Navbar2 = ({ onCreateClick, onShareClick }) => {
  const navigate = useNavigate();

  return (
    <div id="navbar2">
      <button id="chat-button" onClick={() => navigate('/chat')}>
        <RiChatSmile3Line />
      </button>
      <button id="share-button" onClick={onShareClick}>
        <FaShare />
      </button>
      <button id="meet-button" onClick={() => alert('Video call functionality not implemented yet')}>
        <SiGooglemeet />
      </button>
      <button id="create-button" onClick={onCreateClick}>
        <IoIosAddCircleOutline />
      </button>
      <button id="info-button" onClick={() => navigate('/info')}>
        <RiInformation2Line />
      </button>
    </div>
  );
};

export default Navbar2;
