import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RiChatSmile3Line } from "react-icons/ri";
import { FaShare } from "react-icons/fa6";
import { SiGooglemeet } from "react-icons/si";
import { IoIosAddCircleOutline } from "react-icons/io";
import { RiInformation2Line } from "react-icons/ri";
import './Navbar2.css'; 

const Navbar2 = ({ onCreateClick, onShareClick,subjectId }) => {
  const navigate = useNavigate();

  return (
    <div id="navbar2">
      <button className="navbar2-btn" onClick={() => navigate(`/chat/${subjectId}`)}>
        <RiChatSmile3Line />
      </button>
      <button className="navbar2-btn" onClick={onShareClick}>
        <FaShare />
      </button>
      <button className="navbar2-btn" onClick={() => navigate('/stream')}>
        <SiGooglemeet />
      </button>
      <button className="navbar2-btn" onClick={onCreateClick}>
        <IoIosAddCircleOutline />
      </button>
      <button className="navbar2-btn" onClick={() => navigate(`/info/${subjectId}`)}>
        <RiInformation2Line />
      </button>
    </div>
  );
};

export default Navbar2;
