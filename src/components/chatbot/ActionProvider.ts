import { resume, projects } from './data';

class ActionProvider {
  createChatBotMessage: any;
  setState: any;
  constructor(createChatBotMessage: any, setStateFunc: any) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
  }

  greet() {
    const greetingMessage = this.createChatBotMessage('Hi, friend.');
    this.updateChatbotState(greetingMessage);
  }

  handleResume() {
    const message = this.createChatBotMessage(
      `Here is a summary of ${resume.name}'s resume: ${resume.title}. Skills: ${resume.skills.join(
        ', '
      )}. Experience: ${resume.experience[0].role} at ${
        resume.experience[0].company
      }. Education: ${resume.education[0].degree} from ${resume.education[0].institution}.`
    );
    this.updateChatbotState(message);
  }

  handleProjects() {
    const message = this.createChatBotMessage(
      `Here are some of ${resume.name}'s projects:`,
      {
        widget: 'projects',
      }
    );
    this.updateChatbotState(message);
  }

  handleSkills() {
    const message = this.createChatBotMessage(
      `Here are some of ${resume.name}'s skills: ${resume.skills.join(', ')}.`
    );
    this.updateChatbotState(message);
  }

  handleExperience() {
    const message = this.createChatBotMessage(
      `Here is ${resume.name}'s work experience: ${resume.experience[0].role} at ${resume.experience[0].company} from ${resume.experience[0].duration}. ${resume.experience[0].description}`
    );
    this.updateChatbotState(message);
  }

  handleEducation() {
    const message = this.createChatBotMessage(
      `Here is ${resume.name}'s education: ${resume.education[0].degree} from ${resume.education[0].institution} (${resume.education[0].duration}).`
    );
    this.updateChatbotState(message);
  }

  fallback() {
    const message = this.createChatBotMessage(
      "I'm sorry, I don't understand. I can answer questions about Omkar's resume, projects, skills, experience, and education."
    );
    this.updateChatbotState(message);
  }

  updateChatbotState(message: any) {
    this.setState((prevState: any) => ({
      ...prevState,
      messages: [...prevState.messages, message],
    }));
  }
}

export default ActionProvider;
