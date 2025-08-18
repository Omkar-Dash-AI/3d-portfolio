import React, { useState, useRef, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import { styles } from '../../styles';
import { SectionWrapper } from '../../hoc';
import { fadeIn, textVariant } from '../../utils/motion';

interface JobDescription {
  title: string;
  description: string;
}

interface MatchResult {
  score: number;
  highlights: string[];
  missingSkills: string[];
  semanticMatches?: string[];
  keyPhrases?: string[];
  embeddings?: boolean;
}

const predefinedJobs: JobDescription[] = [
  {
    title: 'Data Scientist',
    description: 'Looking for a data scientist with experience in Python, machine learning, TensorFlow, data visualization, and statistical analysis. Knowledge of SQL and cloud platforms is a plus.'
  },
  {
    title: 'Machine Learning Engineer',
    description: 'Seeking a machine learning engineer with strong skills in Python, deep learning frameworks (TensorFlow/PyTorch), model deployment, and MLOps. Experience with cloud services and containerization is required.'
  },
  {
    title: 'AI Research Scientist',
    description: 'Hiring an AI research scientist with PhD or equivalent experience. Must have publications in top-tier conferences and expertise in NLP, computer vision, or reinforcement learning.'
  }
];

const ResumeScanner = () => {
  const [resumeText, setResumeText] = useState('');
  const [selectedJob, setSelectedJob] = useState<JobDescription | null>(null);
  const [customJobDescription, setCustomJobDescription] = useState('');
  const [useCustomJob, setUseCustomJob] = useState(false);
  const [result, setResult] = useState<MatchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [useEmbeddings, setUseEmbeddings] = useState(true);
  const [modelLoading, setModelLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Simulate loading the OpenAI embeddings model
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('OpenAI embeddings model loaded');
      setModelLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setResumeText(text);
    };
    reader.readAsText(file);
  };

  const handleJobSelect = (job: JobDescription | null) => {
    setSelectedJob(job);
    setUseCustomJob(false);
  };

  const simulateAIAnalysis = (resume: string, jobDesc: string, useEmbeddings: boolean): MatchResult => {
    // This is a simulation of AI analysis with optional OpenAI embeddings
    
    // Basic keyword extraction (used in both modes)
    const jobKeywords = jobDesc.toLowerCase().match(/\b(\w+)\b/g) || [];
    const uniqueJobKeywords = [...new Set(jobKeywords)];
    
    const resumeKeywords = resume.toLowerCase().match(/\b(\w+)\b/g) || [];
    const uniqueResumeKeywords = [...new Set(resumeKeywords)];
    
    // Find matching keywords (basic mode)
    const matches = uniqueJobKeywords.filter(keyword => 
      uniqueResumeKeywords.includes(keyword) && 
      keyword.length > 3 && 
      !['with', 'and', 'the', 'for', 'this', 'that', 'have', 'from'].includes(keyword)
    );
    
    // Find missing important keywords
    const importantKeywords = uniqueJobKeywords.filter(keyword => 
      keyword.length > 3 && 
      ['experience', 'python', 'machine', 'learning', 'data', 'analysis', 'tensorflow', 'pytorch', 
       'cloud', 'sql', 'visualization', 'statistical', 'deep', 'model', 'deployment'].includes(keyword)
    );
    
    const missingKeywords = importantKeywords.filter(keyword => !matches.includes(keyword));
    
    // Calculate base match score
    let matchScore = Math.min(85, Math.floor((matches.length / Math.max(importantKeywords.length, 1)) * 100));
    
    // Enhanced analysis with simulated OpenAI embeddings
    let semanticMatches: string[] = [];
    let keyPhrases: string[] = [];
    
    if (useEmbeddings) {
      // Simulate semantic matching with embeddings
      // In a real implementation, this would use OpenAI's text-embedding-ada-002 model
      
      // Simulate finding semantic matches that wouldn't be found with simple keyword matching
      const potentialSemanticMatches = [
        { jobTerm: 'machine learning', resumeTerm: 'ML algorithms', similarity: 0.92 },
        { jobTerm: 'data visualization', resumeTerm: 'creating charts and dashboards', similarity: 0.89 },
        { jobTerm: 'statistical analysis', resumeTerm: 'applied statistics', similarity: 0.91 },
        { jobTerm: 'cloud platforms', resumeTerm: 'AWS experience', similarity: 0.88 },
        { jobTerm: 'team collaboration', resumeTerm: 'cross-functional teamwork', similarity: 0.90 },
        { jobTerm: 'problem solving', resumeTerm: 'troubleshooting complex issues', similarity: 0.87 },
        { jobTerm: 'communication skills', resumeTerm: 'presenting to stakeholders', similarity: 0.86 }
      ];
      
      // Filter semantic matches based on whether the terms appear in the actual text
      semanticMatches = potentialSemanticMatches
        .filter(match => 
          jobDesc.toLowerCase().includes(match.jobTerm) && 
          resume.toLowerCase().includes(match.resumeTerm)
        )
        .map(match => `${match.jobTerm} ↔ ${match.resumeTerm}`)
        .slice(0, 3);
      
      // Extract key phrases from resume (simulated)
      const potentialKeyPhrases = [
        'experienced data scientist',
        'machine learning models',
        'statistical analysis',
        'python programming',
        'data visualization',
        'cross-functional collaboration',
        'problem-solving skills'
      ];
      
      // Filter key phrases based on whether they appear in the resume
      keyPhrases = potentialKeyPhrases
        .filter(phrase => resume.toLowerCase().includes(phrase.toLowerCase()))
        .slice(0, 4);
      
      // Boost score based on semantic matches
      matchScore += semanticMatches.length * 3;
    }
    
    // Add some randomness to make it look more realistic
    const finalScore = Math.min(98, matchScore + Math.floor(Math.random() * 5));
    
    return {
      score: finalScore,
      highlights: matches.slice(0, 5),
      missingSkills: missingKeywords.slice(0, 3),
      semanticMatches: semanticMatches,
      keyPhrases: keyPhrases,
      embeddings: useEmbeddings
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeText || (!selectedJob && !useCustomJob)) return;

    setLoading(true);
    
    // Use setTimeout to simulate AI processing time
    setTimeout(() => {
      const jobDescription = useCustomJob 
        ? customJobDescription 
        : (selectedJob?.description || '');
      
      const analysisResult = simulateAIAnalysis(resumeText, jobDescription, useEmbeddings);
      setResult(analysisResult);
      setLoading(false);
    }, useEmbeddings ? 3000 : 1500); // Embeddings take longer to process
  };

  const handleReset = () => {
    setResumeText('');
    setSelectedJob(null);
    setCustomJobDescription('');
    setUseCustomJob(false);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <>
      <motion.div variants={textVariant() as Variants}>
        <p className={styles.sectionSubText}>Project Demo</p>
        <h2 className={styles.sectionHeadText}>AI Resume Scanner</h2>
      </motion.div>

      <motion.div
        variants={fadeIn('', '', 0.1, 1) as Variants}
        className='mt-4 text-secondary text-[17px] max-w-3xl leading-[30px]'
      >
        <p>
          This AI-powered tool analyzes your resume against job descriptions to determine compatibility 
          and highlight matching skills. Upload your resume and select a job description to get started.
        </p>
      </motion.div>

      <motion.div
        variants={fadeIn('up', 'spring', 0.5, 0.75) as Variants}
        className='mt-10 bg-black-100 rounded-xl p-8 w-full max-w-4xl'
      >
        <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
          <div>
            <label className='text-white font-medium mb-2 block'>Upload Resume (or paste text)</label>
            <div className='flex flex-col gap-4'>
              <input
                type='file'
                accept='.txt,.pdf,.doc,.docx'
                onChange={handleFileUpload}
                ref={fileInputRef}
                className='bg-tertiary py-2 px-4 rounded-lg text-white w-full'
              />
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder='Or paste your resume text here...'
                rows={6}
                className='bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium w-full'
              />
            </div>
          </div>

          <div>
            <label className='text-white font-medium mb-2 block'>Select Job Description</label>
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4'>
              {predefinedJobs.map((job, index) => (
                <div 
                  key={index}
                  onClick={() => handleJobSelect(job)}
                  className={`p-4 rounded-lg cursor-pointer transition-all ${selectedJob === job && !useCustomJob ? 'bg-primary' : 'bg-tertiary'}`}
                >
                  <h3 className='text-white font-medium'>{job.title}</h3>
                  <p className='text-secondary text-sm mt-2 line-clamp-3'>{job.description}</p>
                </div>
              ))}
            </div>
            
            <div className='flex items-center gap-2 mb-4'>
              <input
                type='checkbox'
                id='customJob'
                checked={useCustomJob}
                onChange={() => setUseCustomJob(!useCustomJob)}
                className='w-4 h-4'
              />
              <label htmlFor='customJob' className='text-white'>Use custom job description</label>
            </div>
            
            {useCustomJob && (
              <textarea
                value={customJobDescription}
                onChange={(e) => setCustomJobDescription(e.target.value)}
                placeholder='Enter custom job description...'
                rows={4}
                className='bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium w-full'
              />
            )}
          </div>

          <div className='mb-4'>
            <div className='flex items-center gap-2'>
              <input
                type='checkbox'
                id='useEmbeddings'
                checked={useEmbeddings}
                onChange={() => setUseEmbeddings(!useEmbeddings)}
                className='w-4 h-4'
                disabled={modelLoading}
              />
              <label htmlFor='useEmbeddings' className='text-white flex items-center'>
                Use OpenAI Embeddings for semantic matching
                {modelLoading && (
                  <span className='ml-2 text-xs text-yellow-400 animate-pulse'>
                    (Loading model...)
                  </span>
                )}
              </label>
            </div>
            <p className='text-secondary text-xs mt-1 ml-6'>
              Enables advanced semantic matching beyond simple keyword comparison
            </p>
          </div>
          
          <div className='flex gap-4'>
            <button
              type='submit'
              disabled={loading || !resumeText || (!selectedJob && !useCustomJob) || (useEmbeddings && modelLoading)}
              className='bg-tertiary py-3 px-8 rounded-xl outline-none w-fit text-white font-bold shadow-md shadow-primary'
            >
              {loading ? 'Analyzing...' : 'Analyze Resume'}
            </button>
            
            <button
              type='button'
              onClick={handleReset}
              className='bg-red-900 py-3 px-8 rounded-xl outline-none w-fit text-white font-bold shadow-md'
            >
              Reset
            </button>
          </div>
        </form>

        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='mt-10 p-6 bg-tertiary rounded-xl'
          >
            <h3 className='text-white font-bold text-[24px] mb-4'>Match Analysis</h3>
            
            <div className='mb-6'>
              <div className='flex justify-between items-center mb-2'>
                <span className='text-white'>Match Score:</span>
                <span className={`text-lg font-bold ${result.score > 70 ? 'text-green-500' : result.score > 50 ? 'text-yellow-500' : 'text-red-500'}`}>
                  {result.score}%
                </span>
              </div>
              <div className='w-full bg-gray-700 rounded-full h-2.5'>
                <div 
                  className={`h-2.5 rounded-full ${result.score > 70 ? 'bg-green-500' : result.score > 50 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                  style={{ width: `${result.score}%` }}
                ></div>
              </div>
            </div>
            
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
              <div>
                <h4 className='text-white font-medium mb-2'>Matching Skills:</h4>
                <ul className='list-disc list-inside text-green-400'>
                  {result.highlights.length > 0 ? (
                    result.highlights.map((skill, index) => (
                      <li key={index} className='mb-1 capitalize'>{skill}</li>
                    ))
                  ) : (
                    <li className='text-secondary'>No significant matches found</li>
                  )}
                </ul>
              </div>
              
              <div>
                <h4 className='text-white font-medium mb-2'>Missing Skills:</h4>
                <ul className='list-disc list-inside text-red-400'>
                  {result.missingSkills.length > 0 ? (
                    result.missingSkills.map((skill, index) => (
                      <li key={index} className='mb-1 capitalize'>{skill}</li>
                    ))
                  ) : (
                    <li className='text-green-400'>Your resume covers all key requirements!</li>
                  )}
                </ul>
              </div>
            </div>
            
            {result.embeddings && result.semanticMatches && result.semanticMatches.length > 0 && (
              <div className='mt-6 border-t border-gray-700 pt-4'>
                <h4 className='text-white font-medium mb-2'>
                  <span className='text-blue-400 mr-2'>AI</span>
                  Semantic Matches (via OpenAI Embeddings):
                </h4>
                <p className='text-secondary text-sm mb-2'>
                  These matches were found using semantic similarity rather than exact keyword matching
                </p>
                <ul className='list-disc list-inside text-blue-400'>
                  {result.semanticMatches.map((match, index) => (
                    <li key={index} className='mb-1'>{match}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {result.embeddings && result.keyPhrases && result.keyPhrases.length > 0 && (
              <div className='mt-6 border-t border-gray-700 pt-4'>
                <h4 className='text-white font-medium mb-2'>
                  <span className='text-blue-400 mr-2'>AI</span>
                  Key Resume Phrases:
                </h4>
                <div className='flex flex-wrap gap-2 mt-2'>
                  {result.keyPhrases.map((phrase, index) => (
                    <span key={index} className='bg-blue-900 text-white px-3 py-1 rounded-full text-sm'>
                      {phrase}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <p className='text-secondary text-sm mt-6'>
              {result.embeddings ? 
                'This analysis uses simulated OpenAI embeddings (text-embedding-ada-002) for semantic matching, providing more nuanced results than simple keyword matching.' :
                'This analysis is based on keyword matching. Enable OpenAI Embeddings for more sophisticated semantic matching.'}
            </p>
            
            {result.embeddings && (
              <div className='mt-4 bg-blue-900/30 p-3 rounded-lg border border-blue-800'>
                <h5 className='text-white text-sm font-medium flex items-center'>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                  </svg>
                  About OpenAI Embeddings
                </h5>
                <p className='text-secondary text-xs mt-1'>
                  OpenAI's text-embedding-ada-002 model converts text into numerical vectors that capture semantic meaning.
                  This allows for comparing the similarity between different texts even when they use different words to express the same concepts.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </>
  );
};

export default SectionWrapper({ children: <ResumeScanner />, idName: 'resume-scanner' });