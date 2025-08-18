import { resume, projects } from './data';

class MessageParser {
  actionProvider: any;
  state: any;
  constructor(actionProvider: any, state: any) {
    this.actionProvider = actionProvider;
    this.state = state;
  }

  parse(message: string) {
    const lowerCaseMessage = message.toLowerCase();

    if (lowerCaseMessage.includes('hello')) {
      this.actionProvider.greet();
    } else if (lowerCaseMessage.includes('resume')) {
      this.actionProvider.handleResume();
    } else if (lowerCaseMessage.includes('projects')) {
      this.actionProvider.handleProjects();
    } else if (lowerCaseMessage.includes('skills')) {
      this.actionProvider.handleSkills();
    } else if (lowerCaseMessage.includes('experience')) {
      this.actionProvider.handleExperience();
    } else if (lowerCaseMessage.includes('education')) {
      this.actionProvider.handleEducation();
    } else {
      this.actionProvider.fallback();
    }
  }
}

export default MessageParser;
