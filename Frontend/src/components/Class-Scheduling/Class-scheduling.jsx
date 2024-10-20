import { handleToggleDescription,
    handleAddClick,
    handlePopupClose,
    handleSubjectChange,
    handleDescriptionChange,
    handleFormSubmit,
    getNextClassTime,
    deleteClass,
} from './function-class-sch.js';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdDelete } from "react-icons/md";
import usePreviewImg from '../../hooks/usePrevImg.jsx';
import './Class-scheduling.css';
import profileIcon from '../../assets/profile_icon.png';
import add_icon from '../../assets/add_icon_white.png';
import userAtom from '../../atom/UserAtom.js';
import subjectAtom from '../../atom/SubjectAtom.js';
import { useRecoilValue, useRecoilState } from 'recoil';
import upload_area from '../../assets/upload_area.png';
import Loader from '../Loader/Loader.jsx';

const Class = ({ onNextClassTime }) => {
    const [expanded, setExpanded] = useState({});
    const [showPopup, setShowPopup] = useState(false);
    const [newSubject, setNewSubject] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const navigate = useNavigate();

    const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
    const user = useRecoilValue(userAtom);
    const [subject, setSubject] = useRecoilState(subjectAtom);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const getSubjects = async () => {
            if (!user) return;
            try {
                const response = await fetch(`/api/s/${user._id}`, {
                    method: 'GET',
                    credentials: 'include',
                });
                const data = await response.json();
                console.log(data)
                setSubject(data);
            } catch (error) {
                console.error(error);
            } finally{
                setLoading(false);
            }
        };

        getSubjects();
    }, [setSubject, user]);

    useEffect(() => {
        if (onNextClassTime) {
            onNextClassTime(getNextClassTime(subject));
        }
    }, [onNextClassTime, subject]);

    const handleCardClick = (id) => {
        navigate(`/subject/${id}`);
    };

    return (
        <div className="class-container1">

            {loading && <Loader/>}
            <div className="class-cards">
                {subject && subject.length > 0 && subject.map((classItem) => {
                    const isExpanded = expanded[classItem._id];
                    return (
                        <div
                            key={classItem._id}
                            className="class-card"
                        >
                            <div className="subject-header">
                                <h3 onClick={() => handleCardClick(classItem._id)}>{classItem.sname}</h3>
                                {classItem && classItem.teacher === user.username && (
                                    <MdDelete
                                        className="delete-icon"
                                        onClick={() => deleteClass(classItem._id)}
                                    />
                                )}

                            </div>
                            <div className="class-info">
                                <img src={profileIcon} alt="Profile Icon" className="profile-icon" />
                                <div>
                                    <p className="teacher-name">{classItem.teacher}</p>
                                    <p
                                        className="subject-description"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleToggleDescription(classItem._id);
                                        }}
                                    >
                                        {isExpanded ? classItem.desc : `${classItem.desc?.slice(0, 7)}... `}
                                        {classItem.desc?.length > 7 && (
                                            <span className="show-more">
                                                {isExpanded ? ' Show less' : ' Show more'}
                                            </span>
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="add-icon" onClick={handleAddClick}>
                <img src={add_icon} alt="Add Icon" />
            </div>
            {showPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <span className="close-popup" onClick={handlePopupClose}>&times;</span>
                        <h3>Add New Subject</h3>
                        <form onSubmit={handleFormSubmit}>
                            <div className="form-row">
                                <div className="upload-area" onClick={() => document.getElementById('fileInput').click()}>
                                    <img src={upload_area} alt="Upload Area" className="upload-placeholder" />
                                </div>
                                <input
                                    id="fileInput"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    style={{ display: 'none' }}
                                    required
                                />
                                {imgUrl && <img src={imgUrl} alt="Cover Preview" className="cover-preview" />}
                            </div>
                            <input
                                type="text"
                                placeholder="Enter subject name"
                                value={newSubject}
                                onChange={handleSubjectChange}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Add the description here"
                                value={newDescription}
                                onChange={handleDescriptionChange}
                                required
                            />
                            <button className="add-subject-btn" type="submit">Add Subject</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Class;
