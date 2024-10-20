import React, { useState } from 'react';
import './Quizes.css';

const Quizes = () => {
  const [joinQuizCode, setJoinQuizCode] = useState('');
  const [quizFormVisible, setQuizFormVisible] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [quizDetails, setQuizDetails] = useState({
    title: '',
    numOfQuestions: 1,
    questions: [
      { questionText: '', options: ['', '', '', ''], correctAnswer: '', points: 1 }
    ],
    startTime: '',
    endTime: '',
  });

  const handleQuizSettingSubmit = (e) => {
    e.preventDefault();
    console.log('Quiz Details Submitted:', quizDetails);
    const creatingQuiz = async () => {
      try {
        const response = await fetch('/api/q/quiz', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(quizDetails),
        });
        const data = await response.json();
        console.log('Quiz created successfully:', data);
      } catch (error) {
        console.log(error);
        return;
      } finally {
        setShowSettingsModal(false);
        setQuizFormVisible(true);
      }
    };
    creatingQuiz();
  };

  const handleJoinQuizCodeChange = (e) => {
    setJoinQuizCode(e.target.value);
  };

  const handleQuizSettingChange = (field, value) => {
    setQuizDetails({ ...quizDetails, [field]: value });
  };

  const handleQuizDetailChange = (index, field, value) => {
    const updatedQuestions = [...quizDetails.questions];
    updatedQuestions[index][field] = value;
    setQuizDetails({ ...quizDetails, questions: updatedQuestions });
  };

  const addQuestion = () => {
    setQuizDetails({
      ...quizDetails,
      questions: [...quizDetails.questions, { questionText: '', options: ['', '', '', ''], correctAnswer: '', points: 1 }]
    });
  };

  const removeQuestion = (index) => {
    const updatedQuestions = quizDetails.questions.filter((_, qIndex) => qIndex !== index);
    setQuizDetails({ ...quizDetails, questions: updatedQuestions });
  };

  const handleQuizSubmit = (e) => {
    e.preventDefault();

    const updatedQuizDetails = { ...quizDetails };

    updatedQuizDetails.questions = updatedQuizDetails.questions.map((question) => ({
      ...question,
      options: question.options.filter(option => option.trim() !== '') 
    }));
    console.log('Cleaned Quiz Details Submitted:', updatedQuizDetails);
    const submittingQuiz = async () => {
      try {
        const response = await fetch('/api/q/quiz', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedQuizDetails), // Submit the cleaned quiz details
        });
        const data = await response.json();
        console.log('Quiz created successfully:', data);
      } catch (error) {
        console.log('Error while submitting quiz:', error);
      } finally {
        setShowSettingsModal(false);
        setQuizFormVisible(true);
      }
    };

    submittingQuiz();
  };

  const handleSectionClick = (section) => {
    setActiveSection(section);
  };

  return (
    <div className="quiz-container">
      <h1>Quizes</h1>

      <div className="join-quiz">
        <h2>Join a Quiz</h2>
        <input
          type="text"
          placeholder="Enter Quiz Code"
          value={joinQuizCode}
          onChange={handleJoinQuizCodeChange}
        />
        <button onClick={() => console.log('Joining quiz with code:', joinQuizCode)}>Join Quiz</button>
      </div>

      <div className="create-quiz">
        <h2>Create a Quiz</h2>
        <button onClick={() => setShowSettingsModal(true)}>
          Create Quiz
        </button>

        {showSettingsModal && (
          <div className="modal">
            <div className="modal-content">
              <h3>Quiz Settings</h3>

              <div className="modal-sections">
                <div className="modal-left">
                  <button onClick={() => handleSectionClick('setTime')}>Set Time</button>
                  <button onClick={() => handleSectionClick('questions')}>
                    Question Count: {quizDetails.questions.length}
                  </button>
                </div>

                <div className="modal-right">
                  {activeSection === 'setTime' && (
                    <form onSubmit={handleQuizSettingSubmit}>
                      <label>
                        Quiz Start Time:
                        <input
                          type="datetime-local"
                          value={quizDetails.startTime}
                          onChange={(e) => handleQuizSettingChange('startTime', e.target.value)}
                        />
                      </label>
                      <label>
                        Quiz End Time:
                        <input
                          type="datetime-local"
                          value={quizDetails.endTime}
                          onChange={(e) => handleQuizSettingChange('endTime', e.target.value)}
                        />
                      </label>
                    </form>
                  )}

                  {activeSection === 'questions' && (
                    <form onSubmit={handleQuizSubmit}>
                      <label>
                        Quiz Title:
                        <input
                          type="text"
                          placeholder="Enter Quiz Title"
                          value={quizDetails.title}
                          onChange={(e) => handleQuizSettingChange('title', e.target.value)}
                        />
                      </label>
                      {quizDetails.questions.map((question, index) => (
                        <div key={index} className="question-block">
                          <h3>Question {index + 1}</h3>
                          <input
                            type="text"
                            placeholder="Enter Question Text"
                            value={question.questionText}
                            onChange={(e) => handleQuizDetailChange(index, 'questionText', e.target.value)}
                          />
                          <div className="options">
                            <h4>Options:</h4>
                            {question.options.map((option, optIndex) => (
                              <input
                                key={optIndex}
                                type="text"
                                placeholder={`Option ${optIndex + 1}`}
                                value={question.options[optIndex]}
                                onChange={(e) => {
                                  const updatedOptions = [...question.options];
                                  updatedOptions[optIndex] = e.target.value;
                                  handleQuizDetailChange(index, 'options', updatedOptions);
                                }}
                              />
                            ))}
                          </div>
                          <input
                            type="text"
                            placeholder="Enter Correct Answer"
                            value={question.correctAnswer}
                            onChange={(e) => handleQuizDetailChange(index, 'correctAnswer', e.target.value)}
                          />
                          <label>
                            Points:
                            <input
                              type="number"
                              placeholder="Points"
                              value={question.points}
                              onChange={(e) => handleQuizDetailChange(index, 'points', e.target.value)}
                            />
                          </label>
                          <button type="button" onClick={() => removeQuestion(index)}>Delete Question</button>
                        </div>
                      ))}

                      <button type="button" onClick={addQuestion}>Add Another Question</button>
                    </form>
                  )}
                </div>
              </div>

              <div className="modal-footer">
                <button onClick={handleQuizSettingSubmit}>Create</button>
                <button onClick={() => setShowSettingsModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {quizFormVisible && (
          <form onSubmit={handleQuizSubmit}>
            {/* Questions Form */}
          </form>
        )}
      </div>
    </div>
  );
};

export default Quizes;
