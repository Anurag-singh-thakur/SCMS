import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import subjectAtom from '../../atom/SubjectAtom.js';
import './Sidebar.css'; 
import userAtom from '../../atom/UserAtom.js';
import Loader from '../Loader/Loader.jsx';

const Sidebar = () => { 
  const navigate = useNavigate();
  const [Subjects, setSubjects] = useRecoilState(subjectAtom);
  const user = useRecoilValue(userAtom);
  const [loadingSubjects, setLoadingSubjects] = useState(true);

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
  return (
      <aside className="sidebar">
        <div className="classes-section">
          <h3>Classes</h3>
          {loadingSubjects ? (
            <Loader /> 
          ) : (
            Subjects.map((subject) => (
              <ul key={subject._id}>
                <li onClick={() => navigate(`/subject/${subject._id}`)}>{subject.sname}</li>
              </ul>
            ))
          )}
        </div>
        <div className="ebooks-section">
          <h3>eBooks</h3>
          <ul>
            <li key="ebook-1" onClick={() => navigate(`/ebook/1`)}>
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
  );
};

export default Sidebar;
