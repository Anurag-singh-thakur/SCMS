import React, { useState } from 'react';
import { TbMessageChatbotFilled } from "react-icons/tb";
import './ChatBoat.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Hey there! How can I help you?' },
  ]);
  const [inputValue, setInputValue] = useState('');

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      setMessages(prevMessages => {
        const newMessages = [...prevMessages, { type: 'user', text: inputValue }];
        setInputValue('');
        setTimeout(() => {
          setMessages(prevMessages => {
            if (prevMessages[prevMessages.length - 1]?.text === inputValue) {
              return [...prevMessages, { type: 'bot', text: 'This is a response from the chatbot' }];
            }
            return prevMessages;
          });
        }, 1000);
        return newMessages;
      });
    }
  };

  return (
    <div>
      <div className='chatBot-icon' onClick={togglePopup}>
        <TbMessageChatbotFilled />
      </div>
      {isOpen && (
        <div className='chatBot-popup'>
          <div className='chatBot-popup-header'>
            <h3>Chat with us</h3>
            <button className='close-btn' onClick={togglePopup}>×</button>
          </div>
          <div className='chatBot-popup-body'>
            <div className='messages-container'>
              {messages.map((message, index) => (
                <div key={index} className={`message ${message.type === 'user' ? 'user-message' : 'bot-message'}`}>
                  <p>{message.text}</p>
                </div>
              ))}
            </div>
            <div className='input-container'>
              <input
                type='text' id="chat"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder='Type your message...'
              />
              <button className='send-btn' onClick={handleSendMessage}>Send</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
