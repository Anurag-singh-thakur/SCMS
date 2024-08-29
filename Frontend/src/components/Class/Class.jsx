import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Class.css'; 
import Create from '../../components/Create/Create';
import { useRecoilState, useRecoilValue } from 'recoil';
import noticeAtom from '../../atom/NoticeAtom.js';
import userAtom from '../../atom/UserAtom.js';
import subjectAtom from '../../atom/SubjectAtom.js';
import { LuDelete } from "react-icons/lu";
import { FaShare } from "react-icons/fa6";
const Class = () => {
  const [isCreateVisible, setIsCreateVisible] = useState(false);
  const [isShareVisible, setIsShareVisible] = useState(false); // State for share button
  const navigate = useNavigate();
  const { id: subjectId } = useParams(); 
  const [Notice, SetNotice] = useRecoilState(noticeAtom);
  const user = useRecoilValue(userAtom);
  const [Subjects, setSubjects] = useRecoilState(subjectAtom);

  useEffect(() => {
    if (!subjectId) {
      navigate('/');
    }
    const getNotice = async () => {
      try {
        const response = await fetch(`/api/s/subject/${subjectId}`);
        const data = await response.json();
        SetNotice(data);
      } catch (error) {
        console.error(error);
      }
    };
    getNotice();
  }, [subjectId]);

  const handleDeleteNotice = async (noticeId) => {
    try {
      const response = await fetch(`/api/s/notice/${subjectId}/${noticeId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        SetNotice(Notice.filter((notice) => notice._id !== noticeId));
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const getsubject = async () => {
      try {
        const response = await fetch(`/api/s/${user._id}`);
        const data = await response.json();
        console.log(data, "datas");
        setSubjects(data);
      } catch (error) {
        console.error(error);
      }
    };
    getsubject();
  }, [user._id]);

  const handleCreateButtonClick = () => {
    setIsCreateVisible(!isCreateVisible);
  };

  const handleShareButtonClick = () => {
    setIsShareVisible(!isShareVisible);
    // Placeholder for share functionality
    alert('Share functionality not implemented yet');
  };

  const handleBookClick = (id) => {
    navigate(`/ebook/${id}`);  
  };

  return (
    <div className="class-container">
      <aside className="sidebar">
        <div className="classes-section">
          <h3>Classes</h3>
          {Subjects.map((subject) => (
            <ul key={subject._id}>
              <li onClick={() => navigate(`/subject/${subject._id}`)}>{subject.sname}</li>
            </ul>
          ))}
        </div>
        <div className="ebooks-section">
          <h3>eBooks</h3>
          <ul>
            <li onClick={() => handleBookClick('1')}>
              <div className="ebook-details">
                <div className="ebook-row">
                  <span className="ebook-name">Algebra</span>
                  <span className="ebook-subject">Maths</span>
                </div>
                <div className="ebook-row">
                  <span className="ebook-teacher">by Mr. Smith</span>
                  <span className="ebook-status">Free</span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </aside>
      <main className="content">
        {Notice.map((notice) => (
          <section key={notice._id} className="notice">
            <h2>{notice.NoticeText}</h2>
            <button className="delete-button" onClick={() => handleDeleteNotice(notice._id)}>
              <LuDelete />
            </button>
            <img className='noticeimage' src={notice.img} alt={notice.title} />
          </section>
        ))}
      </main>
      <div className="create">
        <button className='create-button' onClick={handleCreateButtonClick}>
          Create
        </button>
      </div>
      <div className="share">
        <button className='share-button' onClick={handleShareButtonClick}>
        <FaShare />
        </button>
      </div>
      {isCreateVisible && <Create subjectId={subjectId} />}  
    </div>
  );
}

export default Class;
