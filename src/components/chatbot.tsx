import React, { useState, useEffect } from 'react';
import Chatbot from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css';

import config from './chatbot/chatbotConfig';
import MessageParser from './chatbot/MessageParser';
import ActionProvider from './chatbot/ActionProvider';

const ChatbotComponent = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleScroll = () => {
    if (isOpen) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isOpen]);

  const toggleChatbot = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="chatbot-container">
      {isOpen && (
        <Chatbot
          config={config}
          messageParser={MessageParser}
          actionProvider={ActionProvider}
        />
      )}
      <button className="chatbot-toggle-button" onClick={toggleChatbot}>
        {isOpen ? 'Close' : 'Chat'}
      </button>
    </div>
  );
};

export default ChatbotComponent;
