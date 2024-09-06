import React, { useState } from 'react';
import './Chat.css';
import Sidebar from '../Sidebar/Sidebar';

const Chat = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello!', sender: 'other' },
    { id: 2, text: 'Hi there! How are you?', sender: 'self' },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { id: messages.length + 1, text: newMessage, sender: 'self' }]);
      setNewMessage('');
    }
  };

  return (
    <div className="app-container">
      <Sidebar />
       
      <div className="chat-container">
        <div className="chat-header">Chat with [Name]</div>
        <div className="chat-messages">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`message ${msg.sender === 'self' ? 'message-self' : 'message-other'}`}
            >
              {msg.text}
            </div>
          ))}
        </div>
        <div className="chat-input">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
