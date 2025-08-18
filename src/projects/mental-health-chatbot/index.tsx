import React, { useState, useRef, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import { styles } from '../../styles';
import { SectionWrapper } from '../../hoc';
import { fadeIn, textVariant } from '../../utils/motion';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  sentiment?: 'positive' | 'negative' | 'neutral';
  tags?: string[];
}

interface EmotionData {
  emotion: string;
  score: number;
}

const predefinedResponses: Record<string, string[]> = {
  greeting: [
    "Hello! I'm here to support you. How are you feeling today?",
    "Hi there! I'm your mental health assistant. How can I help you today?",
    "Welcome! I'm here to listen and provide support. How are you doing?"
  ],
  anxiety: [
    "It sounds like you're experiencing anxiety. Try taking slow, deep breaths. Inhale for 4 counts, hold for 2, and exhale for 6 counts.",
    "Anxiety can be challenging. Consider grounding yourself by naming 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste.",
    "When feeling anxious, it can help to focus on the present moment. Try the 5-4-3-2-1 technique or a brief mindfulness exercise."
  ],
  depression: [
    "I'm sorry you're feeling down. Remember that it's okay to not be okay sometimes. Would you like to talk more about what's troubling you?",
    "Depression can make everything feel overwhelming. Try setting one small, achievable goal for today. What's one tiny step you could take?",
    "When feeling depressed, self-care becomes even more important. Have you been able to get enough rest, nutrition, and water today?"
  ],
  stress: [
    "Stress can be overwhelming. Consider taking a short break to do something calming, like a brief walk or listening to soothing music.",
    "When stressed, our bodies tense up. Try progressively tensing and relaxing each muscle group, starting from your toes and working up to your head.",
    "For stress management, the STOP technique can help: Stop, Take a breath, Observe how you're feeling, and Proceed mindfully."
  ],
  sleep: [
    "Sleep difficulties are common with mental health challenges. Try establishing a consistent sleep schedule and a calming bedtime routine.",
    "For better sleep, consider limiting screen time before bed and creating a comfortable sleep environment that's cool, dark, and quiet.",
    "If racing thoughts keep you awake, try jotting them down in a journal before bed to help clear your mind."
  ],
  gratitude: [
    "Practicing gratitude can shift our focus to positive aspects of life. Can you think of three things you're grateful for today, no matter how small?",
    "Even in difficult times, finding moments of gratitude can help. What's something that brought you a moment of joy recently?",
    "Gratitude practices have been shown to improve mental wellbeing. Consider keeping a daily gratitude journal to note positive moments."
  ],
  resources: [
    "If you're in crisis, please reach out to a crisis helpline immediately. In the US, you can text HOME to 741741 to reach the Crisis Text Line.",
    "Remember that professional help is available. Consider reaching out to a therapist, counselor, or your primary care provider about your mental health.",
    "Many mental health apps offer tools for managing anxiety, depression, and stress. Apps like Headspace, Calm, or Woebot might be helpful supplements to professional care."
  ],
  unknown: [
    "I'm here to listen. Could you tell me more about what you're experiencing?",
    "Thank you for sharing. How long have you been feeling this way?",
    "I appreciate you opening up. What kinds of things have helped you cope in the past?",
    "That sounds difficult. What support systems do you have in your life right now?"
  ]
};

const keywordMap: Record<string, string> = {
  'anxious': 'anxiety',
  'anxiety': 'anxiety',
  'nervous': 'anxiety',
  'panic': 'anxiety',
  'worry': 'anxiety',
  'worried': 'anxiety',
  'stressed': 'stress',
  'stress': 'stress',
  'overwhelmed': 'stress',
  'pressure': 'stress',
  'depressed': 'depression',
  'depression': 'depression',
  'sad': 'depression',
  'hopeless': 'depression',
  'unmotivated': 'depression',
  'tired': 'sleep',
  'insomnia': 'sleep',
  'sleep': 'sleep',
  'awake': 'sleep',
  'rest': 'sleep',
  'grateful': 'gratitude',
  'gratitude': 'gratitude',
  'thankful': 'gratitude',
  'appreciate': 'gratitude',
  'hello': 'greeting',
  'hi': 'greeting',
  'hey': 'greeting',
  'help': 'resources',
  'resource': 'resources',
  'support': 'resources',
  'crisis': 'resources',
  'emergency': 'resources'
};

const MentalHealthChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI mental health assistant. How are you feeling today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [emotionAnalysis, setEmotionAnalysis] = useState<EmotionData[]>([]);
  const [showEmotionInsights, setShowEmotionInsights] = useState(false);
  const [suggestedResponses, setSuggestedResponses] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Generate suggested responses based on conversation context
  useEffect(() => {
    if (messages.length > 1 && messages[messages.length - 1].sender === 'bot') {
      const lastUserMessage = messages.filter(m => m.sender === 'user').pop();
      const lastBotMessage = messages.filter(m => m.sender === 'bot').pop();
      
      if (lastUserMessage && lastBotMessage) {
        const suggestions = generateSuggestedResponses(lastUserMessage.text, lastBotMessage.text);
        setSuggestedResponses(suggestions);
      }
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const analyzeMessage = (message: string): string => {
    // Convert to lowercase for easier matching
    const lowerMessage = message.toLowerCase();
    
    // Check for keywords in the message
    const words = lowerMessage.match(/\b(\w+)\b/g) || [];
    
    // Find matching categories based on keywords
    const categories = words
      .map(word => keywordMap[word])
      .filter(Boolean);
    
    // Count occurrences of each category
    const categoryCounts: Record<string, number> = {};
    categories.forEach(category => {
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });
    
    // Find the most frequent category
    let maxCount = 0;
    let dominantCategory = 'unknown';
    
    Object.entries(categoryCounts).forEach(([category, count]) => {
      if (count > maxCount) {
        maxCount = count;
        dominantCategory = category;
      }
    });
    
    return dominantCategory;
  };

  const getResponse = (category: string): string => {
    const responses = predefinedResponses[category] || predefinedResponses.unknown;
    const randomIndex = Math.floor(Math.random() * responses.length);
    return responses[randomIndex];
  };
  
  const analyzeEmotion = (text: string): EmotionData[] => {
    // Simulate AI emotion analysis
    const emotions: EmotionData[] = [];
    const lowerText = text.toLowerCase();
    
    // Check for anxiety indicators
    if (lowerText.includes('anxious') || lowerText.includes('anxiety') || 
        lowerText.includes('worry') || lowerText.includes('nervous') ||
        lowerText.includes('panic')) {
      emotions.push({ emotion: 'anxiety', score: 0.8 });
    }
    
    // Check for depression indicators
    if (lowerText.includes('sad') || lowerText.includes('depression') || 
        lowerText.includes('depressed') || lowerText.includes('hopeless') ||
        lowerText.includes('empty')) {
      emotions.push({ emotion: 'depression', score: 0.75 });
    }
    
    // Check for stress indicators
    if (lowerText.includes('stress') || lowerText.includes('stressed') || 
        lowerText.includes('overwhelmed') || lowerText.includes('pressure')) {
      emotions.push({ emotion: 'stress', score: 0.7 });
    }
    
    // Check for happiness indicators
    if (lowerText.includes('happy') || lowerText.includes('joy') || 
        lowerText.includes('excited') || lowerText.includes('good')) {
      emotions.push({ emotion: 'happiness', score: 0.9 });
    }
    
    // If no emotions detected, add a neutral emotion
    if (emotions.length === 0) {
      emotions.push({ emotion: 'neutral', score: 0.5 });
    }
    
    return emotions;
  };

  const determineSentiment = (emotions: EmotionData[]): 'positive' | 'negative' | 'neutral' => {
    const positiveEmotions = ['happiness', 'relief', 'gratitude', 'contentment'];
    const negativeEmotions = ['anxiety', 'depression', 'stress', 'fear'];
    
    let positiveScore = 0;
    let negativeScore = 0;
    
    emotions.forEach(emotion => {
      if (positiveEmotions.includes(emotion.emotion)) {
        positiveScore += emotion.score;
      } else if (negativeEmotions.includes(emotion.emotion)) {
        negativeScore += emotion.score;
      }
    });
    
    if (positiveScore > negativeScore && positiveScore > 0.3) {
      return 'positive';
    } else if (negativeScore > positiveScore && negativeScore > 0.3) {
      return 'negative';
    } else {
      return 'neutral';
    }
  };
  
  const extractTags = (text: string): string[] => {
    const tags: string[] = [];
    const lowerText = text.toLowerCase();
    
    // Mental health conditions
    if (lowerText.includes('anxiety') || lowerText.includes('anxious')) tags.push('anxiety');
    if (lowerText.includes('depress')) tags.push('depression');
    if (lowerText.includes('stress')) tags.push('stress');
    if (lowerText.includes('sleep') || lowerText.includes('insomnia')) tags.push('sleep');
    
    // Coping mechanisms
    if (lowerText.includes('meditat') || lowerText.includes('mindful')) tags.push('mindfulness');
    if (lowerText.includes('exercise') || lowerText.includes('workout')) tags.push('exercise');
    if (lowerText.includes('therapy')) tags.push('therapy');
    
    // Support systems
    if (lowerText.includes('family') || lowerText.includes('friend') || lowerText.includes('support')) {
      tags.push('support-system');
    }
    
    return tags;
  };
  
  const generateSuggestedResponses = (userMessage: string, botMessage: string): string[] => {
    const suggestions: string[] = [];
    const lowerUserMsg = userMessage.toLowerCase();
    const lowerBotMsg = botMessage.toLowerCase();
    
    // If bot mentioned coping strategies
    if (lowerBotMsg.includes('breathing') || lowerBotMsg.includes('breath')) {
      suggestions.push("I've tried breathing exercises before but they don't always work for me.");
      suggestions.push("Can you explain how breathing helps with anxiety?");
    }
    
    // If bot mentioned professional help
    if (lowerBotMsg.includes('professional') || lowerBotMsg.includes('therapist')) {
      suggestions.push("How do I find a good therapist?");
      suggestions.push("I'm nervous about talking to a professional.");
    }
    
    // If user mentioned feeling anxious
    if (lowerUserMsg.includes('anxious') || lowerUserMsg.includes('anxiety')) {
      suggestions.push("What are some quick ways to reduce anxiety in the moment?");
      suggestions.push("How can I tell if my anxiety is normal or something more serious?");
    }
    
    // If user mentioned feeling depressed
    if (lowerUserMsg.includes('sad') || lowerUserMsg.includes('depress')) {
      suggestions.push("What's the difference between sadness and depression?");
      suggestions.push("Are there natural ways to improve my mood?");
    }
    
    // General follow-ups
    if (suggestions.length < 2) {
      suggestions.push("Can you tell me more about that?");
      suggestions.push("What other mental health topics can you help with?");
      suggestions.push("How can I improve my mental well-being daily?");
    }
    
    // Limit to 3 suggestions
    return suggestions.slice(0, 3);
  };

  const handleSendMessage = (e: React.FormEvent | string) => {
    let messageText: string;
    
    if (typeof e === 'string') {
      messageText = e;
    } else {
      e.preventDefault();
      messageText = input;
    }
    
    if (!messageText.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    setSuggestedResponses([]);
    
    // Analyze emotion
    const emotions = analyzeEmotion(messageText);
    setEmotionAnalysis(emotions);

    // Determine sentiment
    const sentiment = determineSentiment(emotions);
    const updatedUserMessage = {...userMessage, sentiment};
    setMessages(prev => prev.map(msg => msg.id === userMessage.id ? updatedUserMessage : msg));
    
    // Simulate AI processing time
    setTimeout(() => {
      const category = analyzeMessage(messageText);
      const responseText = getResponse(category);
      const tags = extractTags(messageText);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'bot',
        timestamp: new Date(),
        tags
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      <motion.div variants={textVariant() as Variants}>
        <p className={styles.sectionSubText}>Project Demo</p>
        <h2 className={styles.sectionHeadText}>AI Mental Health Chatbot</h2>
      </motion.div>

      <motion.div
        variants={fadeIn('', '', 0.1, 1)}
        className='mt-4 text-secondary text-[17px] max-w-3xl leading-[30px]'
      >
        <p>
          This AI-powered chatbot provides mental health support through natural conversation. 
          It can recognize emotional states and offer appropriate coping strategies and resources.
          Try discussing feelings of anxiety, stress, depression, or ask for mental health resources.
        </p>
      </motion.div>

      <motion.div
        variants={fadeIn('up', 'spring', 0.5, 0.75)}
        className='mt-10 bg-black-100 rounded-xl p-8 w-full max-w-4xl'
      >
        <div className='flex flex-col h-[600px]'>
          <div className='text-center mb-4'>
            <button 
              onClick={() => setShowEmotionInsights(!showEmotionInsights)}
              className='text-sm bg-tertiary hover:bg-primary px-3 py-1 rounded-full transition-colors'
            >
              {showEmotionInsights ? 'Hide AI Insights' : 'Show AI Insights'}
            </button>
          </div>
          
          <div className='flex flex-1'>
            <div className={`overflow-y-auto mb-4 pr-2 ${showEmotionInsights ? 'w-3/4 mr-2' : 'w-full'}`}>
              <div className='space-y-4'>
                {messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[80%] rounded-xl p-4 ${message.sender === 'user' 
                        ? 'bg-primary text-white' 
                        : 'bg-tertiary text-white'}`}
                    >
                      <p>{message.text}</p>
                      {message.tags && message.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {message.tags.map((tag, index) => (
                            <span key={index} className="text-xs bg-gray-600 px-2 py-1 rounded-full">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className='flex justify-between items-center'>
                        <p className='text-xs mt-1 opacity-70'>
                          {formatTime(message.timestamp)}
                        </p>
                        {message.sentiment && message.sender === 'user' && (
                          <span 
                            className={`ml-2 inline-block w-2 h-2 rounded-full ${message.sentiment === 'positive' ? 'bg-green-500' : message.sentiment === 'negative' ? 'bg-red-500' : 'bg-gray-500'}`}
                            title={`Detected mood: ${message.sentiment}`}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className='flex justify-start'>
                    <div className='bg-tertiary text-white rounded-xl p-4'>
                      <div className='flex space-x-2'>
                        <div className='w-2 h-2 rounded-full bg-gray-400 animate-bounce' style={{ animationDelay: '0ms' }}></div>
                        <div className='w-2 h-2 rounded-full bg-gray-400 animate-bounce' style={{ animationDelay: '150ms' }}></div>
                        <div className='w-2 h-2 rounded-full bg-gray-400 animate-bounce' style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </div>
            
            {showEmotionInsights && (
              <div className="w-1/4 bg-tertiary rounded-lg p-4 overflow-auto h-full">
                <h3 className="text-xl font-bold mb-3">AI Insights</h3>
                {emotionAnalysis.length > 0 ? (
                  <div>
                    <h4 className="text-md font-semibold mb-2">Detected Emotions:</h4>
                    {emotionAnalysis.map((emotion, index) => (
                      <div key={index} className="mb-2">
                        <div className="flex justify-between items-center">
                          <span className="capitalize">{emotion.emotion}</span>
                          <span>{Math.round(emotion.score * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                          <div 
                            className="bg-primary h-2.5 rounded-full" 
                            style={{ width: `${emotion.score * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                    <div className="mt-4">
                      <h4 className="text-md font-semibold mb-2">Coping Strategies:</h4>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        {emotionAnalysis[0]?.emotion === 'anxiety' && (
                          <>
                            <li>Practice deep breathing exercises</li>
                            <li>Try the 5-4-3-2-1 grounding technique</li>
                            <li>Progressive muscle relaxation</li>
                          </>
                        )}
                        {emotionAnalysis[0]?.emotion === 'depression' && (
                          <>
                            <li>Set small, achievable daily goals</li>
                            <li>Spend time in nature or sunlight</li>
                            <li>Connect with supportive people</li>
                          </>
                        )}
                        {emotionAnalysis[0]?.emotion === 'stress' && (
                          <>
                            <li>Take short breaks throughout the day</li>
                            <li>Practice time management techniques</li>
                            <li>Engage in physical activity</li>
                          </>
                        )}
                        {emotionAnalysis[0]?.emotion === 'happiness' && (
                          <>
                            <li>Practice gratitude journaling</li>
                            <li>Savor positive experiences</li>
                            <li>Share your joy with others</li>
                          </>
                        )}
                        {emotionAnalysis[0]?.emotion === 'neutral' && (
                          <>
                            <li>Mindfulness meditation</li>
                            <li>Regular physical activity</li>
                            <li>Maintain social connections</li>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">Share how you're feeling for AI analysis</p>
                )}
              </div>
            )}
          </div>
          
          {suggestedResponses.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {suggestedResponses.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSendMessage(suggestion)}
                  className="bg-tertiary hover:bg-primary text-sm text-white px-3 py-1.5 rounded-full transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
          
          <form onSubmit={handleSendMessage} className='flex gap-2'>
            <input
              type='text'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='Type your message here...'
              className='bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium flex-1'
              disabled={isTyping}
            />
            <button
              type='submit'
              disabled={!input.trim() || isTyping}
              className='bg-tertiary py-3 px-8 rounded-xl outline-none w-fit text-white font-bold shadow-md shadow-primary disabled:opacity-50'
            >
              Send
            </button>
          </form>
          
          <div className='mt-4 text-center text-xs text-secondary'>
            <p>
              Note: This is a demonstration using predefined responses and simple keyword matching. 
              A production version would use advanced NLP models like GPT-4 for more nuanced understanding and responses.
            </p>
            <p className='mt-1'>
              This is not a substitute for professional mental health support. 
              If you're in crisis, please contact a mental health professional or crisis hotline.
            </p>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default SectionWrapper({ children: <MentalHealthChatbot />, idName: 'mental-health-chatbot' });
