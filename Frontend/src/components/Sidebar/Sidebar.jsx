import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import subjectAtom from '../../atom/SubjectAtom.js';
import './Sidebar.css'; 

const Sidebar = () => {
  const navigate = useNavigate();
  const Subjects = useRecoilValue(subjectAtom);

  console.log('Subjects:', Subjects);

  return (
    <aside className="sidebar">
      <div className="classes-section">
        <h3>Classes</h3>
        {Subjects && Subjects.length > 0 ? (
          <ul>
            {Subjects.map((subject) => (
              <li key={subject._id} onClick={() => navigate(`/subject/${subject._id}`)}>
                {subject.sname}
              </li>
            ))}
          </ul>
        ) : (
          <p>No classes available</p>
        )}
      </div>
      <div className="ebooks-section">
        <h3>eBooks</h3>
        <ul>
          <li key="ebook-1" onClick={() => console.log('eBook Clicked')}>
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
