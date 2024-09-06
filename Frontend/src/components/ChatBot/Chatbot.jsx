import React, { useState } from 'react';
import { TbMessageChatbotFilled } from "react-icons/tb";
import {marked} from 'marked'; 
import './ChatBoat.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Hey there! How can I help you?' },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async () => {
    if (inputValue.trim()) {
      const userMessage = inputValue.trim();
      setMessages(prevMessages => [
        ...prevMessages, 
        { type: 'user', text: userMessage }
      ]);
      setInputValue('');
      setIsLoading(true);
  
      try {
        const response = await fetch('/api/generate/ai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: userMessage }),
        });
  
        const data = await response.json();
        console.log(data);
        if (data.error) {
          setMessages(prevMessages => [
            ...prevMessages, 
            { type: 'bot', text: data.error }
          ]);
        } else {
          setMessages(prevMessages => [
            ...prevMessages,
            { type: 'bot', text: data.text }
          ]);
        }
        
      } catch (error) {
        console.error('Error:', error);
        setMessages(prevMessages => [
          ...prevMessages, 
          { type: 'bot', text: 'Oops, something went wrong. Please try again later.' }
        ]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const parseText = (text) => {
    return { __html: marked(text) };
  };

  return (
    <div>
      <div className='chatBot-icon' onClick={togglePopup}>
        <TbMessageChatbotFilled />
      </div>
      {isOpen && (
        <div className='chatBot-popup'>
          <div className='chatBot-popup-header'>
            <h3>Chat bot</h3>
            <button className='close-btn' onClick={togglePopup}>×</button>
          </div>
          <div className='chatBot-popup-body'>
            <div className='messages-container'>
              {messages.map((message, index) => (
                <div key={index} className={`message ${message.type === 'user' ? 'user-message' : 'bot-message'}`}>
                  <p dangerouslySetInnerHTML={parseText(message.text)} />
                </div>
              ))}
            </div>
            <div className='input-container'>
              <input
                type='text'
                id="chat"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder='Type your message...'
                disabled={isLoading}
              />
              <button className='send-btn' onClick={handleSendMessage} disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
