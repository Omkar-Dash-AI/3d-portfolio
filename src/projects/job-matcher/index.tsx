import React, { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import { styles } from '../../styles';
import { SectionWrapper } from '../../hoc';
import { fadeIn, textVariant } from '../../utils/motion';

interface JobMatch {
  title: string;
  company: string;
  location: string;
  matchScore: number;
  matchReason: string[];
  salary: string;
  requirements: string[];
}

interface UserProfile {
  skills: string;
  experience: string;
  location: string;
  interests: string;
}

const JobMatcher = () => {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    skills: '',
    experience: '',
    location: '',
    interests: ''
  });
  const [matches, setMatches] = useState<JobMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<{text: string, sender: 'user' | 'bot'}[]>([
    { text: "Hello! I'm your AI job matching assistant. I can help you find jobs that match your skills and interests. Let's start by filling out your profile!", sender: 'bot' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Simulate AI-powered job matching
  const findJobMatches = () => {
    setLoading(true);
    
    setTimeout(() => {
      const mockJobs: JobMatch[] = [
        {
          title: "Machine Learning Engineer",
          company: "TechCorp AI",
          location: userProfile.location || "San Francisco, CA",
          matchScore: 95,
          matchReason: [
            "Perfect match for Python and ML skills",
            "Experience level aligns with requirements",
            "Location preference matches"
          ],
          salary: "$120,000 - $160,000",
          requirements: ["Python", "TensorFlow", "Machine Learning", "Data Analysis"]
        },
        {
          title: "Data Scientist",
          company: "Analytics Pro",
          location: userProfile.location || "Remote",
          matchScore: 88,
          matchReason: [
            "Strong alignment with data analysis skills",
            "Python expertise highly valued",
            "Flexible remote work option"
          ],
          salary: "$100,000 - $140,000",
          requirements: ["Python", "SQL", "Statistics", "Data Visualization"]
        },
        {
          title: "AI Research Scientist",
          company: "FutureTech Labs",
          location: userProfile.location || "Boston, MA",
          matchScore: 82,
          matchReason: [
            "Research interests align with role",
            "Strong technical background match",
            "Innovation-focused position"
          ],
          salary: "$130,000 - $180,000",
          requirements: ["PhD preferred", "Deep Learning", "Research Experience", "Publications"]
        },
        {
          title: "Backend Developer",
          company: "StartupXYZ",
          location: userProfile.location || "New York, NY",
          matchScore: 75,
          matchReason: [
            "Programming skills transferable",
            "Growth opportunity in startup",
            "Technical challenge alignment"
          ],
          salary: "$85,000 - $120,000",
          requirements: ["Python", "Flask", "APIs", "Database Design"]
        }
      ];

      setMatches(mockJobs);
      setLoading(false);
      
      // Add bot response
      setChatMessages(prev => [...prev, {
        text: `Great! I found ${mockJobs.length} job matches for you based on your profile. The top match is "${mockJobs[0].title}" at ${mockJobs[0].company} with a ${mockJobs[0].matchScore}% compatibility score!`,
        sender: 'bot'
      }]);
    }, 2000);
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    // Add user message
    setChatMessages(prev => [...prev, { text: chatInput, sender: 'user' }]);
    
    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "That's great! Your experience in that area will definitely help you stand out to employers.",
        "I understand. Let me help you find opportunities that match your career goals.",
        "Based on what you've told me, I think you'd be a great fit for technical roles. Have you considered machine learning positions?",
        "That skill set is in high demand right now! Let me run a search for positions that value those competencies.",
        "Interesting background! Many companies are looking for professionals with your combination of skills."
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setChatMessages(prev => [...prev, { text: randomResponse, sender: 'bot' }]);
    }, 1000);

    setChatInput('');
  };

  const handleProfileChange = (field: keyof UserProfile, value: string) => {
    setUserProfile(prev => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <motion.div variants={textVariant() as Variants}>
        <p className={styles.sectionSubText}>Project Demo</p>
        <h2 className={styles.sectionHeadText}>AI Job Matcher & Chatbot</h2>
      </motion.div>

      <motion.div
        variants={fadeIn('', '', 0.1, 1) as Variants}
        className='mt-4 text-secondary text-[17px] max-w-3xl leading-[30px]'
      >
        <p>
          This demo showcases an AI-powered job matching system with an integrated chatbot.
          Fill out your profile to find personalized job recommendations, or chat with the AI assistant
          to get career advice and guidance.
        </p>
      </motion.div>

      <div className='mt-10 flex flex-col lg:flex-row gap-8'>
        {/* Profile Section */}
        <motion.div
          variants={fadeIn('right', 'spring', 0.3, 0.75) as Variants}
          className='bg-black-100 rounded-xl p-6 flex-1'
        >
          <h3 className='text-white font-bold text-[24px] mb-6'>Your Profile</h3>
          
          <div className='space-y-4'>
            <div>
              <label className='text-white font-medium mb-2 block'>Skills & Technologies</label>
              <textarea
                value={userProfile.skills}
                onChange={(e) => handleProfileChange('skills', e.target.value)}
                placeholder='e.g., Python, Machine Learning, TensorFlow, Data Analysis...'
                className='bg-tertiary py-3 px-4 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium w-full h-20 resize-none'
              />
            </div>
            
            <div>
              <label className='text-white font-medium mb-2 block'>Experience Level</label>
              <select
                value={userProfile.experience}
                onChange={(e) => handleProfileChange('experience', e.target.value)}
                className='bg-tertiary py-3 px-4 text-white rounded-lg outline-none border-none font-medium w-full'
              >
                <option value=''>Select experience level</option>
                <option value='entry'>Entry Level (0-2 years)</option>
                <option value='mid'>Mid Level (2-5 years)</option>
                <option value='senior'>Senior Level (5+ years)</option>
                <option value='lead'>Lead/Manager Level</option>
              </select>
            </div>
            
            <div>
              <label className='text-white font-medium mb-2 block'>Preferred Location</label>
              <input
                type='text'
                value={userProfile.location}
                onChange={(e) => handleProfileChange('location', e.target.value)}
                placeholder='e.g., San Francisco, CA or Remote'
                className='bg-tertiary py-3 px-4 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium w-full'
              />
            </div>
            
            <div>
              <label className='text-white font-medium mb-2 block'>Career Interests</label>
              <textarea
                value={userProfile.interests}
                onChange={(e) => handleProfileChange('interests', e.target.value)}
                placeholder='e.g., AI research, startup environment, remote work...'
                className='bg-tertiary py-3 px-4 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium w-full h-20 resize-none'
              />
            </div>
            
            <button
              onClick={findJobMatches}
              disabled={loading || !userProfile.skills}
              className='bg-tertiary py-3 px-8 rounded-xl outline-none w-full text-white font-bold shadow-md shadow-primary disabled:opacity-50'
            >
              {loading ? 'Finding Matches...' : 'Find Job Matches'}
            </button>
          </div>
        </motion.div>

        {/* Chat Section */}
        <motion.div
          variants={fadeIn('left', 'spring', 0.5, 0.75) as Variants}
          className='bg-black-100 rounded-xl p-6 flex-1'
        >
          <h3 className='text-white font-bold text-[24px] mb-6'>AI Career Assistant</h3>
          
          <div className='bg-tertiary rounded-lg p-4 h-64 overflow-y-auto mb-4'>
            {chatMessages.map((message, index) => (
              <div key={index} className={`mb-3 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block p-2 rounded-lg max-w-[80%] ${
                  message.sender === 'user' 
                    ? 'bg-primary text-white' 
                    : 'bg-secondary text-black'
                }`}>
                  {message.text}
                </div>
              </div>
            ))}
          </div>
          
          <form onSubmit={handleChatSubmit} className='flex gap-2'>
            <input
              type='text'
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder='Ask me about career advice...'
              className='bg-tertiary py-2 px-4 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium flex-1'
            />
            <button
              type='submit'
              className='bg-primary py-2 px-4 rounded-lg text-white font-medium'
            >
              Send
            </button>
          </form>
        </motion.div>
      </div>

      {/* Job Matches Results */}
      {matches.length > 0 && (
        <motion.div
          variants={fadeIn('up', 'spring', 0.7, 0.75) as Variants}
          className='mt-10'
        >
          <h3 className='text-white font-bold text-[24px] mb-6'>Job Matches for You</h3>
          
          <div className='grid gap-6 md:grid-cols-2'>
            {matches.map((job, index) => (
              <div key={index} className='bg-tertiary p-6 rounded-xl'>
                <div className='flex justify-between items-start mb-4'>
                  <div>
                    <h4 className='text-white font-bold text-[20px]'>{job.title}</h4>
                    <p className='text-secondary'>{job.company} • {job.location}</p>
                  </div>
                  <div className='text-right'>
                    <div className={`text-[24px] font-bold ${
                      job.matchScore >= 90 ? 'text-green-400' :
                      job.matchScore >= 80 ? 'text-blue-400' :
                      job.matchScore >= 70 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {job.matchScore}%
                    </div>
                    <p className='text-secondary text-sm'>match</p>
                  </div>
                </div>
                
                <p className='text-gradient font-medium mb-3'>{job.salary}</p>
                
                <div className='mb-3'>
                  <h5 className='text-white font-medium mb-2'>Why this matches you:</h5>
                  <ul className='text-secondary text-sm space-y-1'>
                    {job.matchReason.map((reason, idx) => (
                      <li key={idx} className='flex items-start'>
                        <span className='text-green-400 mr-2'>✓</span>
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className='mb-4'>
                  <h5 className='text-white font-medium mb-2'>Key Requirements:</h5>
                  <div className='flex flex-wrap gap-2'>
                    {job.requirements.map((req, idx) => (
                      <span key={idx} className='bg-black-200 px-2 py-1 rounded text-xs text-secondary'>
                        {req}
                      </span>
                    ))}
                  </div>
                </div>
                
                <button className='bg-primary py-2 px-6 rounded-lg text-white font-medium w-full'>
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </>
  );
};

export default SectionWrapper({ children: <JobMatcher />, idName: 'job-matcher' });
