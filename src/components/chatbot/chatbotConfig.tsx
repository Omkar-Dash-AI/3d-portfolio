import React from 'react';
import { createChatBotMessage } from 'react-chatbot-kit';
import { projects } from './data';

const config = {
  initialMessages: [createChatBotMessage('Hello! How can I help you?', {})],
  botName: 'Chatbot',
  customStyles: {
    botMessageBox: {
      backgroundColor: '#376B7E',
    },
    chatButton: {
      backgroundColor: '#5ccc9d',
    },
  },
  widgets: [
    {
      widgetName: 'projects',
      widgetFunc: (props: any) => (
        <div>
          {projects.map((project) => (
            <div key={project.name}>
              <h4>{project.name}</h4>
              <p>{project.description}</p>
              <p>Technologies: {project.technologies.join(', ')}</p>
            </div>
          ))}
        </div>
      ),
      props: {},
      mapStateToProps: [],
    },
  ],
};

export default config;
