import React, { useState, useEffect } from 'react';
import './Create.css';
import usePreviewImg from '../../hooks/usePrevImg';
import uploadIcon from '../../assets/upload_area.png'; 
import { useRecoilState } from 'recoil';
import noticeAtom from '../../atom/NoticeAtom';

const Create = () => {
  const [textContent, setTextContent] = useState('');
  const { handleImageChange, imgUrl } = usePreviewImg();
  const [notice, setNotice] = useRecoilState(noticeAtom);
  const [selection, setSelection] = useState('notice'); // Default selection is 'notice'
  const [isPopupVisible, setPopupVisible] = useState(true);

  const handleClose = () => {
    setPopupVisible(false);
  }

  useEffect(() => {
    console.log('Notice updated:', notice);
  }, [notice]);  // Log the notice state whenever it changes

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!subjectId) {
      console.error('Subject ID not found');
      return;
    }

    if (!selection) {
      console.error('Please select either Assignment or Notice.');
      return;
    }

    try {
      const response = await fetch(`/api/s/subject/${subjectId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ textContent, imgUrl, type: selection })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      setNotice((prevNotice) => [...prevNotice, data]);
      console.log('Success:', data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Only render the popup if isPopupVisible is true
  if (!isPopupVisible) {
    return null;
  }

  return (
    <div className="create-container">
      <button className="close-button" onClick={handleClose}>
        &times;
      </button>
      <h2>Create</h2>
      <div className="form-group">
        <label htmlFor="text-content">Text Content:</label>
        <textarea
          id="text-content"
          value={textContent}
          onChange={(e) => setTextContent(e.target.value)}
          placeholder="Enter text content"
          rows="4"
        />
      </div>
      <div className="form-group">
        <label htmlFor="file-upload">Upload Files:</label>
        <div className="upload-wrapper">
          <input
            type="file"
            id="file-upload"
            accept=".jpg,.jpeg,.png"
            multiple
            onChange={handleImageChange}
            style={{ display: 'none' }}  
          />
          <img
            src={uploadIcon}
            alt="Upload"
            className="upload-icon"
            onClick={() => document.getElementById('file-upload').click()}  
          />
          {imgUrl && <img id="new" src={imgUrl} alt="Preview" />}
        </div>
      </div>
      <div className="form-group">
        <label>Select Type:</label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="type"
              value="assignment"
              checked={selection === 'assignment'}
              onChange={(e) => setSelection(e.target.value)}
            />
            Assignment
          </label>
          <label>
            <input
              type="radio"
              name="type"
              value="notice"
              checked={selection === 'notice'}
              onChange={(e) => setSelection(e.target.value)}
            />
            Notice
          </label>
        </div>
        <p className="radio-note">Please select only one option.</p>
      </div>
      <button className="submit-button" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
};

export default Create;
