import React from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { styles } from '../styles';
import { SectionWrapper } from '../hoc';
import { fadeIn, textVariant } from '../utils/motion';

// Simple demo component to test
const SimpleDemo = ({ title }: { title: string }) => {
  return (
    <div className="relative z-0 bg-primary min-h-screen flex items-center justify-center">
      <div className="bg-tertiary p-8 rounded-xl">
        <h2 className="text-white text-3xl font-bold mb-4">{title}</h2>
        <p className="text-secondary mb-4">This is a live interactive demo for {title}.</p>
        <p className="text-white">The demo is working! You can interact with the features here.</p>
        <Link to="/projects" className="inline-block mt-4 bg-primary py-2 px-6 rounded-lg text-white font-medium">
          Back to Projects
        </Link>
      </div>
    </div>
  );
};

// Interactive Car Price Prediction Component
const InteractiveCarPricePrediction = () => {
  const [carData, setCarData] = React.useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    km_driven: '',
    fuel: '',
    seller_type: '',
    transmission: '',
    mileage: '',
    engine: '',
    max_power: '',
    seats: 5
  });

  const [prediction, setPrediction] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [availableOptions, setAvailableOptions] = React.useState({
    brands: ['Maruti', 'Hyundai', 'Honda', 'Tata', 'Toyota', 'Ford', 'Mahindra', 'Chevrolet', 'Renault', 'Nissan'],
    fuel: ['Petrol', 'Diesel', 'CNG', 'LPG', 'Electric'],
    seller_type: ['Individual', 'Dealer', 'Trustmark Dealer'],
    transmission: ['Manual', 'Automatic']
  });

  const [modelOptions] = React.useState({
    'Maruti': ['Swift', 'Alto', 'Baleno', 'Vitara Brezza', 'Wagon R', 'Dzire', 'Ertiga'],
    'Hyundai': ['i20', 'Creta', 'Verna', 'Grand i10', 'Elite i20', 'Santro', 'Venue'],
    'Honda': ['City', 'Amaze', 'Jazz', 'WR-V', 'Civic', 'Accord', 'CR-V'],
    'Tata': ['Nexon', 'Harrier', 'Altroz', 'Tiago', 'Safari', 'Hexa', 'Zest'],
    'Toyota': ['Innova', 'Corolla', 'Fortuner', 'Etios', 'Yaris', 'Camry', 'Prius'],
    'Ford': ['EcoSport', 'Figo', 'Aspire', 'Freestyle', 'Endeavour'],
    'Mahindra': ['XUV500', 'Scorpio', 'Bolero', 'XUV300', 'Thar'],
    'Chevrolet': ['Beat', 'Spark', 'Cruze', 'Trailblazer'],
    'Renault': ['Duster', 'Kwid', 'Captur', 'Lodgy'],
    'Nissan': ['Micra', 'Sunny', 'Terrano', 'X-Trail']
  });

  // Mock prediction function (in real app, this would call the Flask API)
  const predictPrice = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Validate required fields
      const requiredFields = ['brand', 'year', 'km_driven', 'fuel', 'seller_type', 'transmission', 'mileage', 'engine', 'max_power'];
      const missingFields = requiredFields.filter(field => !carData[field]);
      
      if (missingFields.length > 0) {
        setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
        setLoading(false);
        return;
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock prediction logic (in real app, this would be the API response)
      const age = new Date().getFullYear() - parseInt(carData.year);
      const kmDriven = parseInt(carData.km_driven);
      const mileage = parseFloat(carData.mileage);
      const engine = parseInt(carData.engine);
      const maxPower = parseFloat(carData.max_power);
      
      // Simple mock pricing formula
      let basePrice = 300000; // Base price in INR
      
      // Brand multipliers
      const brandMultipliers = {
        'Toyota': 1.4, 'Honda': 1.3, 'Hyundai': 1.2, 'Maruti': 1.0,
        'Tata': 0.9, 'Ford': 1.1, 'Mahindra': 0.95, 'Chevrolet': 0.8,
        'Renault': 0.85, 'Nissan': 0.9
      };
      
      basePrice *= brandMultipliers[carData.brand] || 1.0;
      
      // Age depreciation
      basePrice *= Math.pow(0.85, age);
      
      // KM driven impact
      basePrice *= (1 - (kmDriven / 500000));
      
      // Fuel type impact
      if (carData.fuel === 'Diesel') basePrice *= 1.1;
      else if (carData.fuel === 'Electric') basePrice *= 1.5;
      else if (['CNG', 'LPG'].includes(carData.fuel)) basePrice *= 0.95;
      
      // Transmission impact
      if (carData.transmission === 'Automatic') basePrice *= 1.15;
      
      // Engine and power impact
      basePrice *= (1 + (engine / 10000));
      basePrice *= (1 + (maxPower / 1000));
      
      // Add some randomness
      basePrice *= (0.9 + Math.random() * 0.2);
      
      // Generate mock SHAP explanations
      const mockExplanations = [
        {
          feature: 'Car Age',
          value: age,
          impact: age > 8 ? 'decreases' : 'neutral',
          contribution: age > 8 ? -15000 : 0,
          abs_contribution: Math.abs(age > 8 ? -15000 : 0)
        },
        {
          feature: 'Brand',
          value: carData.brand,
          impact: brandMultipliers[carData.brand] > 1 ? 'increases' : 'decreases',
          contribution: (brandMultipliers[carData.brand] - 1) * 50000,
          abs_contribution: Math.abs((brandMultipliers[carData.brand] - 1) * 50000)
        },
        {
          feature: 'Kilometers Driven',
          value: kmDriven,
          impact: kmDriven > 80000 ? 'decreases' : 'neutral',
          contribution: kmDriven > 80000 ? -20000 : 0,
          abs_contribution: Math.abs(kmDriven > 80000 ? -20000 : 0)
        },
        {
          feature: 'Fuel Type',
          value: carData.fuel,
          impact: carData.fuel === 'Diesel' ? 'increases' : carData.fuel === 'Electric' ? 'increases' : 'neutral',
          contribution: carData.fuel === 'Diesel' ? 25000 : carData.fuel === 'Electric' ? 100000 : 0,
          abs_contribution: Math.abs(carData.fuel === 'Diesel' ? 25000 : carData.fuel === 'Electric' ? 100000 : 0)
        },
        {
          feature: 'Transmission',
          value: carData.transmission,
          impact: carData.transmission === 'Automatic' ? 'increases' : 'neutral',
          contribution: carData.transmission === 'Automatic' ? 30000 : 0,
          abs_contribution: Math.abs(carData.transmission === 'Automatic' ? 30000 : 0)
        }
      ].sort((a, b) => b.abs_contribution - a.abs_contribution);
      
      const mockPrediction = {
        predicted_price: Math.max(50000, basePrice),
        predicted_price_formatted: `₹${Math.max(50000, basePrice).toLocaleString('en-IN')}`,
        model_used: 'Random Forest Regressor',
        explanations: mockExplanations,
        input_data: carData
      };
      
      setPrediction(mockPrediction);
    } catch (err) {
      setError('Failed to get price prediction. Please try again.');
      console.error('Prediction error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setCarData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear model when brand changes
    if (field === 'brand') {
      setCarData(prev => ({
        ...prev,
        model: ''
      }));
    }
  };

  const loadSampleData = () => {
    setCarData({
      brand: 'Toyota',
      model: 'Innova',
      year: 2018,
      km_driven: '65000',
      fuel: 'Diesel',
      seller_type: 'Dealer',
      transmission: 'Manual',
      mileage: '16.5',
      engine: '2494',
      max_power: '100.6',
      seats: 7
    });
  };

  return (
    <div className="relative z-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-white text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            🚗 Used Car Price Prediction
          </h1>
          <p className="text-blue-100 text-lg mb-4">
            Get accurate car price predictions using advanced machine learning models with SHAP explainability
          </p>
          <Link to="/projects" className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 py-2 px-4 rounded-lg text-white font-medium transition-all duration-300 shadow-lg hover:shadow-xl">
            ← Back to Projects
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 p-6 rounded-xl border border-blue-500/20 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white text-xl font-bold flex items-center gap-2">
                  <span className="text-2xl">🚙</span>
                  Car Details
                </h3>
                <button
                  onClick={loadSampleData}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 py-2 px-4 rounded-lg text-white text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Load Sample
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-cyan-300 block mb-2 font-medium">Brand *</label>
                  <select
                    value={carData.brand}
                    onChange={(e) => handleInputChange('brand', e.target.value)}
                    className="w-full bg-slate-800 border border-cyan-500/30 text-white p-3 rounded-lg outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                  >
                    <option value="">Select Brand</option>
                    {availableOptions.brands.map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="text-cyan-300 block mb-2 font-medium">Model</label>
                  <select
                    value={carData.model}
                    onChange={(e) => handleInputChange('model', e.target.value)}
                    className="w-full bg-slate-800 border border-cyan-500/30 text-white p-3 rounded-lg outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 disabled:opacity-50"
                    disabled={!carData.brand}
                  >
                    <option value="">Select Model</option>
                    {carData.brand && modelOptions[carData.brand]?.map(model => (
                      <option key={model} value={model}>{model}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="text-cyan-300 block mb-2 font-medium">Year *</label>
                  <input
                    type="number"
                    min="2000"
                    max={new Date().getFullYear()}
                    value={carData.year}
                    onChange={(e) => handleInputChange('year', e.target.value)}
                    className="w-full bg-slate-800 border border-cyan-500/30 text-white p-3 rounded-lg outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                  />
                </div>
                
                <div>
                  <label className="text-cyan-300 block mb-2 font-medium">Kilometers Driven *</label>
                  <input
                    type="number"
                    value={carData.km_driven}
                    onChange={(e) => handleInputChange('km_driven', e.target.value)}
                    placeholder="e.g., 50000"
                    className="w-full bg-slate-800 border border-cyan-500/30 text-white p-3 rounded-lg outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                  />
                </div>
                
                <div>
                  <label className="text-cyan-300 block mb-2 font-medium">Fuel Type *</label>
                  <select
                    value={carData.fuel}
                    onChange={(e) => handleInputChange('fuel', e.target.value)}
                    className="w-full bg-slate-800 border border-cyan-500/30 text-white p-3 rounded-lg outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                  >
                    <option value="">Select Fuel Type</option>
                    {availableOptions.fuel.map(fuel => (
                      <option key={fuel} value={fuel}>{fuel}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="text-cyan-300 block mb-2 font-medium">Seller Type *</label>
                  <select
                    value={carData.seller_type}
                    onChange={(e) => handleInputChange('seller_type', e.target.value)}
                    className="w-full bg-slate-800 border border-cyan-500/30 text-white p-3 rounded-lg outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                  >
                    <option value="">Select Seller Type</option>
                    {availableOptions.seller_type.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="text-cyan-300 block mb-2 font-medium">Transmission *</label>
                  <select
                    value={carData.transmission}
                    onChange={(e) => handleInputChange('transmission', e.target.value)}
                    className="w-full bg-slate-800 border border-cyan-500/30 text-white p-3 rounded-lg outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                  >
                    <option value="">Select Transmission</option>
                    {availableOptions.transmission.map(trans => (
                      <option key={trans} value={trans}>{trans}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="text-white block mb-2">Mileage (kmpl) *</label>
                  <input
                    type="number"
                    step="0.1"
                    value={carData.mileage}
                    onChange={(e) => handleInputChange('mileage', e.target.value)}
                    placeholder="e.g., 15.2"
                    className="w-full bg-black-100 text-white p-3 rounded-lg outline-none"
                  />
                </div>
                
                <div>
                  <label className="text-white block mb-2">Engine (CC) *</label>
                  <input
                    type="number"
                    value={carData.engine}
                    onChange={(e) => handleInputChange('engine', e.target.value)}
                    placeholder="e.g., 1498"
                    className="w-full bg-black-100 text-white p-3 rounded-lg outline-none"
                  />
                </div>
                
                <div>
                  <label className="text-white block mb-2">Max Power (bhp) *</label>
                  <input
                    type="number"
                    step="0.1"
                    value={carData.max_power}
                    onChange={(e) => handleInputChange('max_power', e.target.value)}
                    placeholder="e.g., 98.6"
                    className="w-full bg-black-100 text-white p-3 rounded-lg outline-none"
                  />
                </div>
                
                <div>
                  <label className="text-white block mb-2">Number of Seats</label>
                  <select
                    value={carData.seats}
                    onChange={(e) => handleInputChange('seats', parseInt(e.target.value))}
                    className="w-full bg-black-100 text-white p-3 rounded-lg outline-none"
                  >
                    <option value={4}>4 Seats</option>
                    <option value={5}>5 Seats</option>
                    <option value={7}>7 Seats</option>
                    <option value={8}>8 Seats</option>
                  </select>
                </div>
              </div>
              
              {error && (
                <div className="mt-4 p-3 bg-red-900/20 border border-red-500/50 rounded-lg">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}
              
              <button
                onClick={predictPrice}
                disabled={loading}
                className="w-full mt-6 bg-primary py-3 px-6 rounded-xl text-white font-bold disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Predicting Price...
                  </>
                ) : (
                  'Predict Price'
                )}
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {prediction ? (
              <>
                <div className="bg-tertiary p-6 rounded-xl">
                  <h3 className="text-white text-xl font-bold mb-4">Price Prediction</h3>
                  
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-green-400 mb-2">
                      {prediction.predicted_price_formatted}
                    </div>
                    <div className="text-secondary text-sm">Estimated Market Value</div>
                    <div className="text-secondary text-xs mt-2">Model: {prediction.model_used}</div>
                  </div>
                  
                  <div className="bg-black-100 p-4 rounded-lg">
                    <h4 className="text-white font-medium mb-3">Car Summary</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-secondary">Brand:</div>
                      <div className="text-white">{carData.brand} {carData.model}</div>
                      <div className="text-secondary">Age:</div>
                      <div className="text-white">{new Date().getFullYear() - carData.year} years</div>
                      <div className="text-secondary">Fuel:</div>
                      <div className="text-white">{carData.fuel}</div>
                      <div className="text-secondary">Transmission:</div>
                      <div className="text-white">{carData.transmission}</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-tertiary p-6 rounded-xl">
                  <h3 className="text-white text-xl font-bold mb-4">Feature Importance (SHAP)</h3>
                  <p className="text-secondary text-sm mb-4">
                    Understanding which factors most influenced the predicted price:
                  </p>
                  
                  <div className="space-y-3">
                    {prediction.explanations.map((explanation, index) => (
                      <div key={index} className="bg-black-100 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-white font-medium">{explanation.feature}</span>
                          <span className={`text-sm font-medium ${
                            explanation.impact === 'increases' ? 'text-green-400' :
                            explanation.impact === 'decreases' ? 'text-red-400' : 'text-gray-400'
                          }`}>
                            {explanation.impact === 'increases' ? '+' : explanation.impact === 'decreases' ? '-' : '='}
                            {explanation.contribution !== 0 ? `₹${Math.abs(explanation.contribution).toLocaleString('en-IN')}` : 'Neutral'}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-secondary text-sm">Value: {explanation.value}</div>
                          <div className={`w-2 h-2 rounded-full ${
                            explanation.impact === 'increases' ? 'bg-green-400' :
                            explanation.impact === 'decreases' ? 'bg-red-400' : 'bg-gray-400'
                          }`}></div>
                          <div className="text-secondary text-sm capitalize">{explanation.impact} price</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-tertiary p-6 rounded-xl text-center">
                <div className="text-6xl mb-4">🚗</div>
                <h3 className="text-white text-xl font-bold mb-2">Ready to Predict</h3>
                <p className="text-secondary">
                  Fill in the car details to get an accurate price prediction with AI explainability
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-8 bg-black-100 p-4 rounded-xl">
          <p className="text-secondary text-sm">
            <strong>Demo Note:</strong> This is a simulated ML model for demonstration. A production system would use 
            trained Random Forest, XGBoost, or deep learning models with real market data, advanced feature engineering, 
            and continuous model retraining. The SHAP explainability shows how each feature contributed to the final prediction.
          </p>
        </div>
      </div>
    </div>
  );
};

// Interactive Resume Scanner Component
const InteractiveResumeScanner = () => {
  const [resumeText, setResumeText] = React.useState('');
  const [jobDescription, setJobDescription] = React.useState('');
  const [analysisResult, setAnalysisResult] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Mock resume text for demo
  const sampleResume = `John Doe
Software Engineer

SKILLS:
• Python, JavaScript, React, Node.js
• Machine Learning, TensorFlow, scikit-learn
• AWS, Docker, Git, SQL
• Data Analysis, Statistics

EXPERIENCE:
Software Engineer at TechCorp (2021-2023)
• Developed web applications using React and Node.js
• Built machine learning models for data analysis
• Collaborated with cross-functional teams
• Managed deployment on AWS cloud infrastructure

EDUCATION:
MS Computer Science, Stanford University (2019-2021)
BS Mathematics, UC Berkeley (2015-2019)`;

  const analyzeResume = () => {
    if (!resumeText || !jobDescription) {
      alert('Please provide both resume and job description');
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      // Simulate AI analysis
      const resumeWords = resumeText.toLowerCase().split(/\W+/);
      const jobWords = jobDescription.toLowerCase().split(/\W+/);
      
      // Find matching skills
      const commonSkills = resumeWords.filter(word => 
        word.length > 2 && jobWords.includes(word)
      );
      
      const uniqueSkills = [...new Set(commonSkills)];
      const matchPercentage = Math.min(95, Math.max(45, (uniqueSkills.length / jobWords.length) * 100 + Math.random() * 20));
      
      // Extract skills from resume
      const techSkills = ['python', 'javascript', 'react', 'node.js', 'aws', 'docker', 'sql', 'tensorflow', 'machine learning'];
      const foundSkills = techSkills.filter(skill => 
        resumeText.toLowerCase().includes(skill.toLowerCase())
      );
      
      setAnalysisResult({
        matchPercentage: Math.round(matchPercentage),
        matchedSkills: uniqueSkills.slice(0, 8),
        extractedSkills: foundSkills,
        recommendations: [
          'Add more relevant keywords from the job description',
          'Highlight specific achievements with metrics',
          'Include recent certifications or training',
          'Tailor experience descriptions to match requirements'
        ],
        overallRating: matchPercentage > 75 ? 'Excellent' : matchPercentage > 60 ? 'Good' : 'Fair'
      });
      
      setLoading(false);
    }, 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (event) => {
        setResumeText(event.target?.result as string);
      };
      reader.readAsText(file);
    } else {
      alert('Please upload a .txt file for this demo');
    }
  };

  const loadSampleResume = () => {
    setResumeText(sampleResume);
    setJobDescription('Looking for a Software Engineer with experience in Python, React, Machine Learning, and AWS. Must have 2+ years of experience in web development and data analysis.');
  };

  return (
    <div className="relative z-0 bg-primary min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-white text-4xl font-bold mb-4">AI Resume Scanner</h1>
          <p className="text-secondary text-lg mb-4">
            Upload your resume and job description to get AI-powered compatibility analysis
          </p>
          <Link to="/projects" className="inline-block bg-tertiary py-2 px-4 rounded-lg text-white">
            ← Back to Projects
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div className="bg-tertiary p-6 rounded-xl">
              <h3 className="text-white text-xl font-bold mb-4">Upload Resume</h3>
              
              <div className="space-y-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                
                <div className="flex gap-4">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-primary py-2 px-4 rounded-lg text-white font-medium"
                  >
                    Upload .txt File
                  </button>
                  
                  <button
                    onClick={loadSampleResume}
                    className="bg-secondary py-2 px-4 rounded-lg text-white font-medium"
                  >
                    Load Sample Resume
                  </button>
                </div>
                
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your resume text here or upload a .txt file..."
                  className="w-full h-40 bg-black-100 text-white p-4 rounded-lg resize-none"
                />
              </div>
            </div>

            <div className="bg-tertiary p-6 rounded-xl">
              <h3 className="text-white text-xl font-bold mb-4">Job Description</h3>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
                className="w-full h-32 bg-black-100 text-white p-4 rounded-lg resize-none"
              />
            </div>

            <button
              onClick={analyzeResume}
              disabled={loading || !resumeText || !jobDescription}
              className="w-full bg-primary py-3 px-6 rounded-xl text-white font-bold disabled:opacity-50"
            >
              {loading ? 'Analyzing...' : 'Analyze Compatibility'}
            </button>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {analysisResult && (
              <>
                <div className="bg-tertiary p-6 rounded-xl">
                  <h3 className="text-white text-xl font-bold mb-4">Analysis Results</h3>
                  
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-secondary">Compatibility Score</span>
                      <span className={`text-2xl font-bold ${
                        analysisResult.matchPercentage > 75 ? 'text-green-400' :
                        analysisResult.matchPercentage > 60 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {analysisResult.matchPercentage}%
                      </span>
                    </div>
                    <div className="w-full bg-black-100 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-1000 ${
                          analysisResult.matchPercentage > 75 ? 'bg-green-400' :
                          analysisResult.matchPercentage > 60 ? 'bg-yellow-400' : 'bg-red-400'
                        }`}
                        style={{ width: `${analysisResult.matchPercentage}%` }}
                      />
                    </div>
                    <p className="text-secondary text-sm mt-2">
                      Overall Rating: {analysisResult.overallRating}
                    </p>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-white font-medium mb-3">Extracted Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.extractedSkills.map((skill: string, index: number) => (
                        <span key={index} className="bg-primary px-3 py-1 rounded-full text-white text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-white font-medium mb-3">Matched Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.matchedSkills.map((skill: string, index: number) => (
                        <span key={index} className="bg-green-600 px-3 py-1 rounded-full text-white text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-tertiary p-6 rounded-xl">
                  <h4 className="text-white font-medium mb-3">Recommendations</h4>
                  <ul className="space-y-2">
                    {analysisResult.recommendations.map((rec: string, index: number) => (
                      <li key={index} className="text-secondary flex items-start">
                        <span className="text-green-400 mr-2">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            {!analysisResult && (
              <div className="bg-tertiary p-6 rounded-xl text-center">
                <div className="text-6xl mb-4">📄</div>
                <h3 className="text-white text-xl font-bold mb-2">Ready to Analyze</h3>
                <p className="text-secondary">
                  Upload your resume and provide a job description to get started
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 bg-black-100 p-4 rounded-xl">
          <p className="text-secondary text-sm">
            <strong>Demo Note:</strong> This is a simulation of an AI resume scanner. In production, 
            this would use advanced NLP models like BERT or GPT for semantic analysis, 
            PDF parsing libraries, and machine learning for more sophisticated matching.
          </p>
        </div>
      </div>
    </div>
  );
};

// Interactive Traffic Surveillance Component
const InteractiveTrafficSurveillance = () => {
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [detections, setDetections] = React.useState([]);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [analysisResults, setAnalysisResults] = React.useState(null);
  const [thresholds, setThresholds] = React.useState({
    speedLimit: 50, // km/h
    pedestrianAlert: true,
    vehicleCount: true
  });
  const canvasRef = React.useRef(null);
  const imageRef = React.useRef(null);

  // Mock detection data for demonstration
  const mockDetections = [
    { type: 'car', confidence: 0.95, x: 100, y: 150, width: 120, height: 80, speed: 45 },
    { type: 'car', confidence: 0.88, x: 300, y: 180, width: 110, height: 75, speed: 65 }, // speeding
    { type: 'truck', confidence: 0.92, x: 50, y: 100, width: 150, height: 100, speed: 40 },
    { type: 'person', confidence: 0.87, x: 400, y: 220, width: 30, height: 80, speed: 5 },
    { type: 'motorcycle', confidence: 0.81, x: 250, y: 200, width: 60, height: 50, speed: 55 },
    { type: 'bicycle', confidence: 0.79, x: 350, y: 240, width: 40, height: 60, speed: 15 }
  ];

  const sampleImages = [
    '/api/placeholder/600/400?text=Traffic+Scene+1',
    '/api/placeholder/600/400?text=Traffic+Scene+2',
    '/api/placeholder/600/400?text=Traffic+Scene+3'
  ];

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        if (imageRef.current) {
          imageRef.current.src = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const loadSampleImage = (imageSrc) => {
    setSelectedFile({ name: 'sample-traffic-scene.jpg', type: 'image/jpeg' });
    if (imageRef.current) {
      imageRef.current.src = imageSrc;
    }
  };

  const analyzeTraffic = () => {
    if (!selectedFile && !imageRef.current?.src) {
      alert('Please upload an image or select a sample image first.');
      return;
    }

    setIsAnalyzing(true);
    setDetections([]);

    // Simulate AI analysis with progressive detection
    setTimeout(() => {
      const detectedObjects = mockDetections.map(detection => ({
        ...detection,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date()
      }));

      setDetections(detectedObjects);
      
      // Analyze violations
      const speedingVehicles = detectedObjects.filter(obj => 
        ['car', 'truck', 'motorcycle'].includes(obj.type) && obj.speed > thresholds.speedLimit
      );
      
      const pedestrians = detectedObjects.filter(obj => obj.type === 'person');
      const vehicles = detectedObjects.filter(obj => ['car', 'truck', 'motorcycle'].includes(obj.type));
      
      const summary = {
        totalDetections: detectedObjects.length,
        vehicles: vehicles.length,
        pedestrians: pedestrians.length,
        speedingViolations: speedingVehicles.length,
        averageSpeed: vehicles.length > 0 ? Math.round(vehicles.reduce((sum, v) => sum + v.speed, 0) / vehicles.length) : 0,
        violations: [
          ...speedingVehicles.map(v => ({
            type: 'Speeding',
            object: v.type,
            details: `${v.speed} km/h in ${thresholds.speedLimit} km/h zone`,
            severity: 'High'
          })),
          ...(pedestrians.length > 0 && thresholds.pedestrianAlert ? [{
            type: 'Pedestrian Alert',
            object: 'person',
            details: `${pedestrians.length} pedestrian(s) detected in traffic area`,
            severity: 'Medium'
          }] : [])
        ]
      };
      
      setAnalysisResults(summary);
      drawDetections(detectedObjects);
      setIsAnalyzing(false);
    }, 2500);
  };

  const drawDetections = (detectedObjects) => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext('2d');
    canvas.width = image.width || 600;
    canvas.height = image.height || 400;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    detectedObjects.forEach(detection => {
      // Draw bounding box
      ctx.strokeStyle = getDetectionColor(detection.type, detection.speed > thresholds.speedLimit);
      ctx.lineWidth = 3;
      ctx.strokeRect(detection.x, detection.y, detection.width, detection.height);
      
      // Draw label background
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(detection.x, detection.y - 25, detection.width, 25);
      
      // Draw label text
      ctx.fillStyle = 'white';
      ctx.font = '12px Arial';
      ctx.fillText(
        `${detection.type} (${Math.round(detection.confidence * 100)}%)`,
        detection.x + 5,
        detection.y - 8
      );
      
      // Draw speed if vehicle
      if (['car', 'truck', 'motorcycle'].includes(detection.type)) {
        ctx.fillStyle = detection.speed > thresholds.speedLimit ? '#ff4444' : '#44ff44';
        ctx.fillText(
          `${detection.speed} km/h`,
          detection.x + 5,
          detection.y + detection.height + 15
        );
      }
    });
  };

  const getDetectionColor = (type, isSpeeding) => {
    if (isSpeeding) return '#ff4444'; // Red for speeding
    const colors = {
      car: '#00ff00',
      truck: '#ffff00',
      motorcycle: '#ff8800',
      person: '#ff00ff',
      bicycle: '#00ffff'
    };
    return colors[type] || '#ffffff';
  };

  const getSeverityColor = (severity) => {
    const colors = {
      High: 'text-red-400',
      Medium: 'text-yellow-400',
      Low: 'text-green-400'
    };
    return colors[severity] || 'text-gray-400';
  };

  return (
    <div className="relative z-0 bg-primary min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-white text-4xl font-bold mb-4">AI Traffic Surveillance System</h1>
          <p className="text-secondary text-lg mb-4">
            Advanced computer vision system for traffic monitoring, violation detection, and smart city analytics
          </p>
          <Link to="/projects" className="inline-block bg-tertiary py-2 px-4 rounded-lg text-white">
            ← Back to Projects
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Controls Panel */}
          <div className="space-y-6">
            <div className="bg-tertiary p-6 rounded-xl">
              <h3 className="text-white text-xl font-bold mb-4">Upload Image</h3>
              <div className="space-y-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="w-full bg-black-100 text-white p-3 rounded-lg"
                />
                
                <div className="text-center text-secondary">or</div>
                
                <button
                  onClick={() => loadSampleImage('/api/placeholder/600/400?text=Traffic+Scene+Sample')}
                  className="w-full bg-secondary py-2 px-4 rounded-lg text-white"
                >
                  Load Sample Traffic Scene
                </button>
              </div>
            </div>

            <div className="bg-tertiary p-6 rounded-xl">
              <h3 className="text-white text-xl font-bold mb-4">Detection Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-white block mb-2">Speed Limit (km/h)</label>
                  <input
                    type="range"
                    min="30"
                    max="80"
                    value={thresholds.speedLimit}
                    onChange={(e) => setThresholds(prev => ({ ...prev, speedLimit: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                  <div className="text-secondary text-sm">{thresholds.speedLimit} km/h</div>
                </div>
                
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={thresholds.pedestrianAlert}
                    onChange={(e) => setThresholds(prev => ({ ...prev, pedestrianAlert: e.target.checked }))}
                    className="w-4 h-4"
                  />
                  <label className="text-white">Pedestrian Alerts</label>
                </div>
                
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={thresholds.vehicleCount}
                    onChange={(e) => setThresholds(prev => ({ ...prev, vehicleCount: e.target.checked }))}
                    className="w-4 h-4"
                  />
                  <label className="text-white">Vehicle Counting</label>
                </div>
              </div>
            </div>

            <button
              onClick={analyzeTraffic}
              disabled={isAnalyzing}
              className="w-full bg-primary py-3 px-6 rounded-xl text-white font-bold disabled:opacity-50"
            >
              {isAnalyzing ? 'Analyzing Traffic...' : 'Start Analysis'}
            </button>
          </div>

          {/* Image Display */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-tertiary p-6 rounded-xl">
              <h3 className="text-white text-xl font-bold mb-4">Traffic Scene Analysis</h3>
              <div className="relative">
                <img
                  ref={imageRef}
                  alt="Traffic scene"
                  className="w-full h-auto max-h-96 object-contain bg-black-100 rounded-lg"
                  style={{ display: selectedFile ? 'block' : 'none' }}
                  onLoad={() => drawDetections(detections)}
                />
                <canvas
                  ref={canvasRef}
                  className="absolute top-0 left-0 pointer-events-none"
                  style={{ display: selectedFile ? 'block' : 'none' }}
                />
                
                {!selectedFile && (
                  <div className="w-full h-64 bg-black-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4">🚗</div>
                      <p className="text-secondary">Upload an image or load a sample to begin analysis</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Analysis Results */}
            {analysisResults && (
              <div className="bg-tertiary p-6 rounded-xl">
                <h3 className="text-white text-xl font-bold mb-4">Detection Summary</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-black-100 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-400">{analysisResults.totalDetections}</div>
                    <div className="text-secondary text-sm">Total Objects</div>
                  </div>
                  
                  <div className="bg-black-100 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-400">{analysisResults.vehicles}</div>
                    <div className="text-secondary text-sm">Vehicles</div>
                  </div>
                  
                  <div className="bg-black-100 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-400">{analysisResults.pedestrians}</div>
                    <div className="text-secondary text-sm">Pedestrians</div>
                  </div>
                  
                  <div className="bg-black-100 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-yellow-400">{analysisResults.averageSpeed}</div>
                    <div className="text-secondary text-sm">Avg Speed (km/h)</div>
                  </div>
                </div>

                {analysisResults.violations.length > 0 && (
                  <div>
                    <h4 className="text-white font-bold mb-3">⚠️ Traffic Violations</h4>
                    <div className="space-y-2">
                      {analysisResults.violations.map((violation, index) => (
                        <div key={index} className="bg-black-100 p-3 rounded-lg flex justify-between items-center">
                          <div>
                            <div className="text-white font-medium">{violation.type}</div>
                            <div className="text-secondary text-sm">{violation.details}</div>
                          </div>
                          <div className={`font-bold ${getSeverityColor(violation.severity)}`}>
                            {violation.severity}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {analysisResults.violations.length === 0 && (
                  <div className="bg-green-900/20 border border-green-500/50 p-4 rounded-lg">
                    <div className="text-green-400 font-medium">✅ No Violations Detected</div>
                    <div className="text-green-300 text-sm">All traffic appears to be following regulations</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 bg-black-100 p-4 rounded-xl">
          <p className="text-secondary text-sm">
            <strong>Demo Note:</strong> This simulation uses mock object detection data. A production system would 
            integrate with TensorFlow.js COCO-SSD or YOLO models for real-time detection, combine with traffic cameras, 
            and include advanced analytics like license plate recognition and traffic flow optimization.
          </p>
        </div>
      </div>
    </div>
  );
};

// Interactive Job Matcher & Chatbot Component
const InteractiveJobMatcher = () => {
  const [currentStep, setCurrentStep] = React.useState('profile'); // profile, matching, results, chat
  const [profile, setProfile] = React.useState({
    name: '',
    skills: [],
    experience: '',
    location: '',
    jobType: '',
    salaryRange: '',
    preferences: []
  });
  const [skillInput, setSkillInput] = React.useState('');
  const [matchedJobs, setMatchedJobs] = React.useState([]);
  const [isMatching, setIsMatching] = React.useState(false);
  const [messages, setMessages] = React.useState([]);
  const [chatInput, setChatInput] = React.useState('');
  const [isTyping, setIsTyping] = React.useState(false);

  // Sample job database
  const jobDatabase = [
    {
      id: 1,
      title: 'Senior Software Engineer',
      company: 'TechCorp',
      location: 'San Francisco, CA',
      salary: '$120k - $160k',
      type: 'Full-time',
      skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS'],
      experience: 'Senior',
      description: 'Lead development of scalable web applications using modern JavaScript frameworks.',
      requirements: ['5+ years experience', 'Strong problem-solving skills', 'Team leadership experience']
    },
    {
      id: 2,
      title: 'Data Scientist',
      company: 'DataTech Inc',
      location: 'New York, NY',
      salary: '$100k - $140k',
      type: 'Full-time',
      skills: ['Python', 'Machine Learning', 'SQL', 'TensorFlow', 'Statistics'],
      experience: 'Mid-level',
      description: 'Analyze large datasets to derive business insights and build predictive models.',
      requirements: ['3+ years experience', 'PhD or MS in Data Science', 'Strong analytical skills']
    },
    {
      id: 3,
      title: 'Frontend Developer',
      company: 'StartupXYZ',
      location: 'Austin, TX',
      salary: '$80k - $110k',
      type: 'Full-time',
      skills: ['React', 'TypeScript', 'CSS', 'JavaScript', 'HTML'],
      experience: 'Junior',
      description: 'Build responsive user interfaces for our web applications.',
      requirements: ['2+ years experience', 'Portfolio of projects', 'Strong CSS skills']
    },
    {
      id: 4,
      title: 'DevOps Engineer',
      company: 'CloudSolutions',
      location: 'Seattle, WA',
      salary: '$110k - $150k',
      type: 'Full-time',
      skills: ['AWS', 'Docker', 'Kubernetes', 'Python', 'Linux'],
      experience: 'Senior',
      description: 'Manage cloud infrastructure and deployment pipelines.',
      requirements: ['4+ years experience', 'AWS certification preferred', 'Strong automation skills']
    },
    {
      id: 5,
      title: 'Product Manager',
      company: 'InnovateCorp',
      location: 'Remote',
      salary: '$90k - $130k',
      type: 'Full-time',
      skills: ['Product Strategy', 'Analytics', 'User Research', 'Agile', 'Communication'],
      experience: 'Mid-level',
      description: 'Drive product strategy and work with engineering teams to build great products.',
      requirements: ['3+ years PM experience', 'Strong analytical skills', 'Technical background preferred']
    },
    {
      id: 6,
      title: 'ML Engineer',
      company: 'AI Innovations',
      location: 'Boston, MA',
      salary: '$130k - $170k',
      type: 'Full-time',
      skills: ['Machine Learning', 'Python', 'TensorFlow', 'PyTorch', 'MLOps'],
      experience: 'Senior',
      description: 'Deploy and scale machine learning models in production environments.',
      requirements: ['4+ years ML experience', 'Strong software engineering skills', 'PhD preferred']
    }
  ];

  const addSkill = () => {
    if (skillInput.trim() && !profile.skills.includes(skillInput.trim())) {
      setProfile(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const calculateJobMatch = (job, userProfile) => {
    let score = 0;
    const factors = [];
    
    // Skill matching (40% weight)
    const skillMatch = userProfile.skills.filter(skill => 
      job.skills.some(jobSkill => 
        jobSkill.toLowerCase().includes(skill.toLowerCase()) || 
        skill.toLowerCase().includes(jobSkill.toLowerCase())
      )
    );
    const skillScore = (skillMatch.length / job.skills.length) * 40;
    score += skillScore;
    factors.push({ factor: 'Skills', score: Math.round(skillScore), details: `${skillMatch.length}/${job.skills.length} skills match` });
    
    // Experience level matching (25% weight)
    const expLevels = { 'Entry-level': 1, 'Junior': 2, 'Mid-level': 3, 'Senior': 4, 'Executive': 5 };
    const userExp = expLevels[userProfile.experience] || 2;
    const jobExp = expLevels[job.experience] || 3;
    const expScore = Math.max(0, 25 - Math.abs(userExp - jobExp) * 8);
    score += expScore;
    factors.push({ factor: 'Experience', score: Math.round(expScore), details: `${userProfile.experience} vs ${job.experience}` });
    
    // Location preference (20% weight)
    const locationScore = (job.location.includes('Remote') || userProfile.location === '' || 
                          job.location.toLowerCase().includes(userProfile.location.toLowerCase())) ? 20 : 5;
    score += locationScore;
    factors.push({ factor: 'Location', score: Math.round(locationScore), details: job.location });
    
    // Job type matching (15% weight)
    const typeScore = (userProfile.jobType === '' || job.type === userProfile.jobType) ? 15 : 5;
    score += typeScore;
    factors.push({ factor: 'Job Type', score: Math.round(typeScore), details: job.type });
    
    return { score: Math.round(Math.min(score, 100)), factors, matchedSkills: skillMatch };
  };

  const findMatches = () => {
    setIsMatching(true);
    
    setTimeout(() => {
      const matches = jobDatabase.map(job => ({
        ...job,
        match: calculateJobMatch(job, profile)
      })).sort((a, b) => b.match.score - a.match.score);
      
      setMatchedJobs(matches);
      setCurrentStep('results');
      setIsMatching(false);
      
      // Initialize chat
      setMessages([{
        id: 1,
        text: `Hi ${profile.name || 'there'}! I found ${matches.length} job opportunities for you. Your top match is "${matches[0].title}" at ${matches[0].company} with a ${matches[0].match.score}% compatibility score. Would you like to know more about any specific opportunity?`,
        sender: 'bot',
        timestamp: new Date()
      }]);
    }, 2000);
  };

  const sendChatMessage = () => {
    if (!chatInput.trim()) return;
    
    const userMessage = {
      id: messages.length + 1,
      text: chatInput,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsTyping(true);
    
    // Simple response logic
    setTimeout(() => {
      const input = chatInput.toLowerCase();
      let response = "I'd be happy to help you with more information about these opportunities!";
      
      if (input.includes('salary') || input.includes('pay') || input.includes('compensation')) {
        response = "The salary ranges vary by position and company. Your top matches offer competitive packages ranging from $80k to $170k based on experience and location.";
      } else if (input.includes('remote') || input.includes('work from home')) {
        const remoteJobs = matchedJobs.filter(job => job.location.includes('Remote'));
        response = `I found ${remoteJobs.length} remote opportunities in your matches. Would you like me to highlight those for you?`;
      } else if (input.includes('skill') || input.includes('requirement')) {
        response = "Most positions are looking for a mix of technical and soft skills. Based on your profile, you're already well-positioned for several roles. I can help you identify skill gaps if you'd like.";
      } else if (input.includes('apply') || input.includes('next step')) {
        response = "Great question! I recommend starting with your top 3 matches. I can help you tailor your application for each role and suggest ways to highlight relevant experience.";
      } else if (input.includes('company') || input.includes('culture')) {
        response = "Company culture is important! Based on the job descriptions and company sizes, I can share insights about work environment and growth opportunities at each company.";
      }
      
      const botResponse = {
        id: messages.length + 2,
        text: response,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1500);
  };

  const getMatchColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="relative z-0 bg-primary min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-white text-4xl font-bold mb-4">AI Job Matcher & Career Chatbot</h1>
          <p className="text-secondary text-lg mb-4">
            Find your perfect career match with AI-powered job recommendations and personalized career guidance
          </p>
          <Link to="/projects" className="inline-block bg-tertiary py-2 px-4 rounded-lg text-white">
            ← Back to Projects
          </Link>
        </div>

        {/* Step Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {['profile', 'matching', 'results'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep === step ? 'bg-primary text-white' :
                  (currentStep === 'matching' && step === 'profile') || 
                  (currentStep === 'results' && step !== 'results') ? 'bg-green-500 text-white' :
                  'bg-tertiary text-secondary'
                }`}>
                  {index + 1}
                </div>
                <span className={`ml-2 ${
                  currentStep === step ? 'text-white' : 'text-secondary'
                }`}>
                  {step === 'profile' ? 'Profile' : step === 'matching' ? 'Matching' : 'Results'}
                </span>
                {index < 2 && <div className="w-8 h-0.5 bg-tertiary mx-4" />}
              </div>
            ))}
          </div>
        </div>

        {/* Profile Setup Step */}
        {currentStep === 'profile' && (
          <div className="bg-tertiary rounded-xl p-6">
            <h2 className="text-white text-2xl font-bold mb-6">Create Your Professional Profile</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-white block mb-2">Full Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-black-100 text-white p-3 rounded-lg outline-none"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label className="text-white block mb-2">Experience Level</label>
                  <select
                    value={profile.experience}
                    onChange={(e) => setProfile(prev => ({ ...prev, experience: e.target.value }))}
                    className="w-full bg-black-100 text-white p-3 rounded-lg outline-none"
                  >
                    <option value="">Select experience level</option>
                    <option value="Entry-level">Entry-level (0-1 years)</option>
                    <option value="Junior">Junior (1-3 years)</option>
                    <option value="Mid-level">Mid-level (3-5 years)</option>
                    <option value="Senior">Senior (5+ years)</option>
                    <option value="Executive">Executive (10+ years)</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-white block mb-2">Preferred Location</label>
                  <input
                    type="text"
                    value={profile.location}
                    onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full bg-black-100 text-white p-3 rounded-lg outline-none"
                    placeholder="e.g., San Francisco, Remote"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-white block mb-2">Job Type</label>
                  <select
                    value={profile.jobType}
                    onChange={(e) => setProfile(prev => ({ ...prev, jobType: e.target.value }))}
                    className="w-full bg-black-100 text-white p-3 rounded-lg outline-none"
                  >
                    <option value="">Any job type</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Freelance">Freelance</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-white block mb-2">Salary Range</label>
                  <select
                    value={profile.salaryRange}
                    onChange={(e) => setProfile(prev => ({ ...prev, salaryRange: e.target.value }))}
                    className="w-full bg-black-100 text-white p-3 rounded-lg outline-none"
                  >
                    <option value="">Any salary range</option>
                    <option value="60k-90k">$60k - $90k</option>
                    <option value="90k-120k">$90k - $120k</option>
                    <option value="120k-150k">$120k - $150k</option>
                    <option value="150k+">$150k+</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-white block mb-2">Skills</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                      className="flex-1 bg-black-100 text-white p-3 rounded-lg outline-none"
                      placeholder="Add a skill..."
                    />
                    <button
                      onClick={addSkill}
                      className="bg-primary px-4 py-2 rounded-lg text-white"
                    >
                      Add
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-secondary px-3 py-1 rounded-full text-white text-sm flex items-center gap-2"
                      >
                        {skill}
                        <button
                          onClick={() => removeSkill(skill)}
                          className="text-red-400 hover:text-red-300"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setCurrentStep('matching')}
                disabled={!profile.name || profile.skills.length === 0 || !profile.experience}
                className="bg-primary py-3 px-8 rounded-xl text-white font-bold disabled:opacity-50"
              >
                Find My Matches
              </button>
            </div>
          </div>
        )}

        {/* Matching Step */}
        {currentStep === 'matching' && (
          <div className="bg-tertiary rounded-xl p-8 text-center">
            <div className="mb-6">
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-white text-2xl font-bold mb-4">Finding Your Perfect Matches</h2>
              <p className="text-secondary">
                Our AI is analyzing {jobDatabase.length} job opportunities against your profile...
              </p>
            </div>
            
            {!isMatching ? (
              <button
                onClick={findMatches}
                className="bg-primary py-3 px-8 rounded-xl text-white font-bold"
              >
                Start Matching Process
              </button>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-white">Analyzing job compatibility...</p>
              </div>
            )}
          </div>
        )}

        {/* Results Step */}
        {currentStep === 'results' && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Job Matches */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-white text-2xl font-bold mb-4">Your Job Matches ({matchedJobs.length})</h2>
              
              {matchedJobs.slice(0, 6).map((job) => (
                <div key={job.id} className="bg-tertiary p-6 rounded-xl">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-white text-xl font-bold">{job.title}</h3>
                      <p className="text-secondary">{job.company} • {job.location}</p>
                      <p className="text-green-400 font-medium">{job.salary}</p>
                    </div>
                    
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getMatchColor(job.match.score)}`}>
                        {job.match.score}%
                      </div>
                      <div className="text-secondary text-sm">Match</div>
                    </div>
                  </div>
                  
                  <p className="text-white mb-4">{job.description}</p>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="text-white font-medium mb-2">Required Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {job.skills.map((skill, index) => (
                          <span
                            key={index}
                            className={`px-2 py-1 rounded-full text-xs ${
                              job.match.matchedSkills.includes(skill)
                                ? 'bg-green-600 text-white'
                                : 'bg-black-100 text-secondary'
                            }`}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-white font-medium mb-2">Match Breakdown</h4>
                      <div className="space-y-1">
                        {job.match.factors.map((factor, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="text-secondary">{factor.factor}</span>
                            <span className={getMatchColor(factor.score)}>{factor.score}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Chat Interface */}
            <div className="bg-tertiary rounded-xl p-6">
              <h3 className="text-white text-xl font-bold mb-4">Career Assistant</h3>
              
              <div className="h-96 flex flex-col">
                <div className="flex-1 overflow-y-auto mb-4 space-y-3">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] p-3 rounded-lg ${
                        message.sender === 'user' ? 'bg-primary text-white' : 'bg-black-100 text-white'
                      }`}>
                        <p className="text-sm">{message.text}</p>
                        <div className="text-xs text-gray-400 mt-1">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-black-100 text-white p-3 rounded-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}} />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                    placeholder="Ask about salaries, skills, or next steps..."
                    className="flex-1 bg-black-100 text-white p-2 rounded-lg outline-none text-sm"
                    disabled={isTyping}
                  />
                  <button
                    onClick={sendChatMessage}
                    disabled={!chatInput.trim() || isTyping}
                    className="bg-primary text-white px-4 py-2 rounded-lg disabled:opacity-50 text-sm"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 bg-black-100 p-4 rounded-xl">
          <p className="text-secondary text-sm">
            <strong>Demo Note:</strong> This job matching system uses rule-based algorithms and keyword matching. 
            A production version would integrate with real job APIs, use advanced NLP for semantic matching, 
            and include features like application tracking, interview scheduling, and personalized recommendations.
          </p>
        </div>
      </div>
    </div>
  );
};

// Interactive Mental Health Chatbot Component
const InteractiveMentalHealthChatbot = () => {
  const [messages, setMessages] = React.useState([
    { id: 1, text: "Hello! I'm your AI mental health assistant. How are you feeling today?", sender: 'bot', timestamp: new Date(), emotion: null }
  ]);
  const [input, setInput] = React.useState('');
  const [isTyping, setIsTyping] = React.useState(false);
  const [emotionData, setEmotionData] = React.useState({ emotion: '', confidence: 0 });

  const emotionKeywords = {
    anxious: ['anxious', 'anxiety', 'worried', 'nervous', 'panic', 'stressed', 'overwhelmed'],
    sad: ['sad', 'depressed', 'down', 'hopeless', 'lonely', 'empty', 'worthless'],
    angry: ['angry', 'mad', 'furious', 'irritated', 'frustrated', 'rage'],
    happy: ['happy', 'good', 'great', 'excited', 'joyful', 'positive', 'amazing'],
    confused: ['confused', 'lost', 'unclear', 'uncertain', 'mixed', 'complicated']
  };

  const responses = {
    anxious: [
      "I understand you're feeling anxious. Try taking slow, deep breaths. Inhale for 4 counts, hold for 2, exhale for 6.",
      "Anxiety can be overwhelming. Let's try a grounding exercise: name 5 things you can see, 4 you can touch, 3 you can hear.",
      "When feeling anxious, focus on what you can control right now. What's one small thing you could do to feel better?"
    ],
    sad: [
      "I'm sorry you're feeling down. It's okay to not be okay sometimes. What's been weighing on your mind?",
      "Sadness is a valid emotion. Have you been able to take care of your basic needs like eating and sleeping?",
      "When we feel sad, self-compassion is important. What would you say to a good friend feeling this way?"
    ],
    angry: [
      "I can sense your frustration. Anger often signals that something important to us feels threatened. What triggered this feeling?",
      "It's natural to feel angry sometimes. Try taking a few deep breaths before we talk more about what's bothering you.",
      "Anger can be a powerful emotion. What would help you feel more in control right now?"
    ],
    happy: [
      "It's wonderful to hear you're feeling good! What's been going well for you?",
      "I'm glad you're in a positive space. It's important to recognize and celebrate these moments.",
      "Your positive energy is great to see! What's contributing to these good feelings?"
    ],
    confused: [
      "It sounds like you're working through some complex feelings. That's completely normal.",
      "When things feel unclear, sometimes it helps to break them down. What's the main thing on your mind?",
      "Confusion often means we're processing something important. Take your time to sort through your thoughts."
    ],
    default: [
      "I'm here to listen. Could you tell me more about what you're experiencing?",
      "Thank you for sharing with me. How have you been coping with these feelings?",
      "It takes courage to talk about how you're feeling. What support do you have in your life?"
    ]
  };

  const analyzeEmotion = (text) => {
    const words = text.toLowerCase().split(/\s+/);
    const emotionScores = {};
    
    Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
      emotionScores[emotion] = keywords.filter(keyword => 
        words.some(word => word.includes(keyword))
      ).length;
    });
    
    const topEmotion = Object.entries(emotionScores).reduce((a, b) => 
      emotionScores[a[0]] > emotionScores[b[0]] ? a : b
    );
    
    return {
      emotion: topEmotion[1] > 0 ? topEmotion[0] : 'neutral',
      confidence: Math.min(topEmotion[1] * 0.3 + Math.random() * 0.4, 1)
    };
  };

  const getResponse = (emotion) => {
    const responseList = responses[emotion] || responses.default;
    return responseList[Math.floor(Math.random() * responseList.length)];
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    
    const userMessage = {
      id: messages.length + 1,
      text: input,
      sender: 'user',
      timestamp: new Date(),
      emotion: null
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    
    // Analyze emotion
    const emotion = analyzeEmotion(input);
    setEmotionData(emotion);
    
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: getResponse(emotion.emotion),
        sender: 'bot',
        timestamp: new Date(),
        emotion: emotion
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const getEmotionColor = (emotion) => {
    const colors = {
      anxious: 'bg-yellow-500',
      sad: 'bg-blue-500',
      angry: 'bg-red-500',
      happy: 'bg-green-500',
      confused: 'bg-purple-500',
      neutral: 'bg-gray-500'
    };
    return colors[emotion] || colors.neutral;
  };

  return (
    <div className="relative z-0 bg-primary min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-white text-4xl font-bold mb-4">AI Mental Health Chatbot</h1>
          <p className="text-secondary text-lg mb-4">
            A supportive AI companion that recognizes emotions and provides mental health guidance
          </p>
          <Link to="/projects" className="inline-block bg-tertiary py-2 px-4 rounded-lg text-white">
            ← Back to Projects
          </Link>
        </div>

        <div className="bg-tertiary rounded-xl p-6 h-96 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto mb-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg ${
                  message.sender === 'user' ? 'bg-primary text-white' : 'bg-black-100 text-white'
                }`}>
                  <p>{message.text}</p>
                  {message.emotion && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getEmotionColor(message.emotion.emotion)}`} />
                      <span className="text-xs text-gray-300">
                        Detected: {message.emotion.emotion} ({Math.round(message.emotion.confidence * 100)}%)
                      </span>
                    </div>
                  )}
                  <div className="text-xs text-gray-400 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-black-100 text-white p-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}} />
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="How are you feeling today?"
              className="flex-1 bg-black-100 text-white p-3 rounded-lg outline-none"
              disabled={isTyping}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isTyping}
              className="bg-primary text-white px-6 py-3 rounded-lg disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>

        {/* Emotion Insights */}
        {emotionData.emotion && emotionData.emotion !== 'neutral' && (
          <div className="mt-6 bg-tertiary rounded-xl p-6">
            <h3 className="text-white text-xl font-bold mb-4">Emotion Insights</h3>
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-6 h-6 rounded-full ${getEmotionColor(emotionData.emotion)}`} />
              <div>
                <p className="text-white font-medium capitalize">{emotionData.emotion}</p>
                <p className="text-secondary text-sm">Confidence: {Math.round(emotionData.confidence * 100)}%</p>
              </div>
            </div>
            
            <div className="bg-black-100 p-4 rounded-lg">
              <h4 className="text-white font-medium mb-2">Coping Strategies:</h4>
              <ul className="text-secondary space-y-1">
                {emotionData.emotion === 'anxious' && (
                  <>
                    <li>• Practice deep breathing exercises</li>
                    <li>• Try progressive muscle relaxation</li>
                    <li>• Use grounding techniques (5-4-3-2-1 method)</li>
                  </>
                )}
                {emotionData.emotion === 'sad' && (
                  <>
                    <li>• Engage in gentle physical activity</li>
                    <li>• Connect with supportive people</li>
                    <li>• Practice self-compassion</li>
                  </>
                )}
                {emotionData.emotion === 'angry' && (
                  <>
                    <li>• Take time to cool down before reacting</li>
                    <li>• Express feelings through writing</li>
                    <li>• Identify the underlying need or concern</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        )}

        <div className="mt-6 bg-black-100 p-4 rounded-xl">
          <p className="text-secondary text-sm">
            <strong>Demo Note:</strong> This chatbot uses keyword-based emotion detection and pre-written responses. 
            A production version would use advanced NLP models for more nuanced understanding and personalized therapy techniques.
            Always seek professional help for serious mental health concerns.
          </p>
        </div>
      </div>
    </div>
  );
};

const ProjectsRouter = () => {
  return (
    <div className="relative z-0 bg-primary">
      <Routes>
        <Route path="/" element={<ProjectsHome />} />
        <Route path="/car-price-prediction" element={<InteractiveCarPricePrediction />} />
        <Route path="/resume-scanner" element={<InteractiveResumeScanner />} />
        <Route path="/mental-health-chatbot" element={<InteractiveMentalHealthChatbot />} />
        <Route path="/traffic-surveillance" element={<InteractiveTrafficSurveillance />} />
        <Route path="/job-matcher" element={<InteractiveJobMatcher />} />
        <Route path="/data-science-portfolio" element={<SimpleDemo title="Data Science Portfolio" />} />
        <Route path="*" element={<Navigate to="/projects" replace />} />
      </Routes>
    </div>
  );
};

const ProjectCard = ({ title, description, path }: { title: string; description: string; path: string }) => {
  return (
    <motion.div
      variants={{
        hidden: { y: 50, opacity: 0 },
        show: {
          y: 0,
          opacity: 1,
          transition: {
            type: "spring",
            duration: 0.75,
            delay: 0.5
          }
        }
      }}
      className='bg-tertiary p-5 rounded-2xl sm:w-[360px] w-full'
    >
      <div className='mt-5'>
        <h3 className='text-white font-bold text-[24px]'>{title}</h3>
        <p className='mt-2 text-secondary text-[14px]'>{description}</p>
      </div>
      
      <div className='mt-4 flex justify-end'>
        <Link 
          to={path} 
          className='bg-primary py-3 px-8 rounded-xl outline-none w-fit text-white font-bold shadow-md shadow-primary'
        >
          Try Demo
        </Link>
      </div>
    </motion.div>
  );
};

const ProjectsHomeComponent = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>My work</p>
        <h2 className={styles.sectionHeadText}>Projects.</h2>
      </motion.div>

      <div className='w-full flex'>
        <motion.p
          variants={fadeIn('', '', 0.1, 1)}
          className='mt-3 text-secondary text-[17px] max-w-3xl leading-[30px]'
        >
          The following projects showcase my skills and experience through real-world examples of my work. 
          Each project is briefly described with interactive demos that allow you to explore the functionality. 
          These projects reflect my ability to solve complex problems, work with different technologies, 
          and manage projects effectively.
        </motion.p>
      </div>

      <div className='mt-20 flex flex-wrap gap-7'>
        <ProjectCard 
          title="Used Car Price Prediction" 
          description="A machine learning model that predicts the market value of used cars based on various factors such as make, model, year, mileage, and condition." 
          path="/projects/car-price-prediction"
        />
        
        <ProjectCard 
          title="AI Resume Scanner" 
          description="An AI-powered tool that analyzes resumes against job descriptions to determine compatibility and highlight matching skills." 
          path="/projects/resume-scanner"
        />
        
        <ProjectCard 
          title="Mental Health Chatbot" 
          description="An AI chatbot that provides mental health support through natural conversation, recognizing emotional states and offering coping strategies." 
          path="/projects/mental-health-chatbot"
        />
        
        <ProjectCard 
          title="Traffic Surveillance System" 
          description="A computer vision system that detects and classifies vehicles, pedestrians, and other objects in traffic scenes for smart city applications." 
          path="/projects/traffic-surveillance"
        />
        
        <ProjectCard 
          title="Job Matcher & Chatbot" 
          description="An AI-powered job matching system with integrated chatbot that analyzes skills and provides personalized job recommendations using OpenAI embeddings." 
          path="/projects/job-matcher"
        />
        
        <ProjectCard 
          title="Data Science Portfolio" 
          description="Interactive showcase of data science and machine learning projects featuring predictive analytics, visualizations, and statistical modeling techniques." 
          path="/projects/data-science-portfolio"
        />
      </div>
    </>
  );
};

const ProjectsHome = SectionWrapper({ children: <ProjectsHomeComponent />, idName: 'projects' });

export default ProjectsRouter;
