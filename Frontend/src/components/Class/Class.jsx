import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Class.css';
import Create from '../../components/Create/Create';
import { useRecoilState, useRecoilValue } from 'recoil';
import noticeAtom from '../../atom/NoticeAtom.js';
import userAtom from '../../atom/UserAtom.js';
import subjectAtom from '../../atom/SubjectAtom.js';
import assignmentAtom from '../../atom/AssignmentAtom.js';
import { LuDelete } from "react-icons/lu";
import Loader from '../../components/Loader/Loader';  
import Sidebar from '../Sidebar/Sidebar.jsx';
import Navbar2 from '../Navbar2/Navbar2.jsx';

const ImageModal = ({ imageSrc, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {imageSrc && <img src={imageSrc} alt="Notice" />}
      </div>
    </div>
  );
};

const Class = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  const [loadingNotices, setLoadingNotices] = useState(true);
  const [loadingAssignments, setLoadingAssignments] = useState(true);
  const [loadingSubjects, setLoadingSubjects] = useState(true);

  const [assignments, setAssignments] = useRecoilState(assignmentAtom);
  const [shareableLink, setShareableLink] = useState('');
  const navigate = useNavigate();
  const { id: subjectId } = useParams();
  const [Notice, SetNotice] = useRecoilState(noticeAtom);
  const user = useRecoilValue(userAtom);
  const [Subjects, setSubjects] = useRecoilState(subjectAtom);

  const [teacher, setTeacher] = useState('');

  useEffect(() => {
    if (!subjectId) {
      navigate('/');
    }
    const getNotice = async () => {
      setLoadingNotices(true); 
      try {
        const response = await fetch(`/api/s/subject/${subjectId}`);
        const data = await response.json();
        SetNotice(data.notice);
        setTeacher(data.teacher);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingNotices(false);  
      }
    };
    getNotice();
  }, [subjectId, SetNotice]);

  useEffect(() => {
    if (!subjectId) {
      navigate('/');
    }
    const getAssignments = async () => {
      setLoadingAssignments(true);   
      try {
        const response = await fetch(`/api/s/getassignment/${subjectId}`);
        const data = await response.json();
        setAssignments(data.assignment);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingAssignments(false); 
      }
    };
    getAssignments();
  }, [subjectId, setAssignments]);

  useEffect(() => {
    const getSubject = async () => {
      setLoadingSubjects(true);  
      try {
        const response = await fetch(`/api/s/${user._id}`);
        const data = await response.json();
        setSubjects(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingSubjects(false);  
      }
    };
    getSubject();
  }, [user._id]);

  const handleDeleteNotice = async (noticeId) => {
    try {
      const response = await fetch(`/api/s/notice/${subjectId}/${noticeId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (response.ok) {
        SetNotice(Notice.filter((notice) => notice._id !== noticeId));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteAssignment = async (assignmentId) => {
    try {
      const response = await fetch(`/api/s/assignment/${subjectId}/${assignmentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (response.ok) {
        setAssignments(assignments.filter((assignment) => assignment._id !== assignmentId));
      }
    } catch (error) {
      console.error(error);
    }
  }
  const handleNoticeClick = (imgSrc) => {
    setSelectedImage(imgSrc);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="class-container">
      <Sidebar/>
      <main className="content">
        {console.log(teacher,"tex")}
        <Navbar2 className="navbar2-class" subtecher={teacher} userId={user.username}/>


        <section className="notices-section">
          {loadingNotices ? (
            <Loader />  
          ) : (
            Notice && Array.isArray(Notice) && Notice.map((notice) => (
              <section key={notice._id} className="notice">
                <h2>{notice.NoticeText}</h2>
                {teacher === user.username && (
                  <button className="notice-delete-button" onClick={() => handleDeleteNotice(notice._id)}>
                    <LuDelete />
                  </button>
                )}
                {notice.img && <img className='noticeimage' src={notice.img} alt="Notice" onClick={() => handleNoticeClick(notice.img)} />}
              </section>
            ))
          )}
        </section>

        <section className="assignments-section">
          {loadingAssignments ? (
            <Loader /> 
          ) : (
            assignments && Array.isArray(assignments) && assignments.map((assignment) => (
              <div key={assignment._id} className="assignment-card">
                
                {teacher === user.username && (
                  <button className="assignment-delete-button" onClick={() => handleDeleteAssignment(assignment._id)}>
                    <LuDelete />
                  </button>
                )}
                {assignment.img && <img className="assignment-image" src={assignment.img} alt="Assignment" onClick={() => handleNoticeClick(assignment.img)}/>}
                <div className="assignment-text">
                  <h2>{assignment.AssignmentText}</h2>
                  <p className='assignment-description'>Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
                </div>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
};

export default Class;
