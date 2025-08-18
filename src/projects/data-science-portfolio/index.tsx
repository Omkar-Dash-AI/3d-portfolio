import React, { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import { styles } from '../../styles';
import { SectionWrapper } from '../../hoc';
import { fadeIn, textVariant } from '../../utils/motion';

interface AnalyticsResult {
  title: string;
  value: string;
  trend: 'up' | 'down' | 'neutral';
  description: string;
}

interface DataVisualization {
  title: string;
  description: string;
  type: 'bar' | 'line' | 'pie';
  data: { label: string; value: number; color?: string }[];
}

const DataSciencePortfolio = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'analysis' | 'modeling' | 'visualization'>('overview');
  const [analysisResults, setAnalysisResults] = useState<AnalyticsResult[]>([]);
  const [visualizations, setVisualizations] = useState<DataVisualization[]>([]);
  const [loading, setLoading] = useState(false);

  // Initialize demo data
  useEffect(() => {
    setVisualizations([
      {
        title: "Sales Performance by Region",
        description: "Quarterly sales data across different regions showing growth trends",
        type: "bar",
        data: [
          { label: "North", value: 85, color: "#3B82F6" },
          { label: "South", value: 92, color: "#10B981" },
          { label: "East", value: 78, color: "#F59E0B" },
          { label: "West", value: 88, color: "#EF4444" }
        ]
      },
      {
        title: "Customer Engagement Over Time",
        description: "Monthly active users and engagement metrics trending upward",
        type: "line",
        data: [
          { label: "Jan", value: 1200 },
          { label: "Feb", value: 1350 },
          { label: "Mar", value: 1580 },
          { label: "Apr", value: 1720 },
          { label: "May", value: 1950 },
          { label: "Jun", value: 2100 }
        ]
      },
      {
        title: "Market Share Distribution",
        description: "Current market share breakdown by product category",
        type: "pie",
        data: [
          { label: "Product A", value: 35, color: "#8B5CF6" },
          { label: "Product B", value: 28, color: "#06B6D4" },
          { label: "Product C", value: 22, color: "#84CC16" },
          { label: "Others", value: 15, color: "#6B7280" }
        ]
      }
    ]);

    setAnalysisResults([
      {
        title: "Revenue Growth",
        value: "+23.5%",
        trend: "up",
        description: "Quarterly revenue increase compared to last year"
      },
      {
        title: "Customer Retention",
        value: "87.2%",
        trend: "up",
        description: "Customer retention rate showing strong loyalty"
      },
      {
        title: "Conversion Rate",
        value: "4.8%",
        trend: "neutral",
        description: "Website conversion rate remains stable"
      },
      {
        title: "Churn Rate",
        value: "2.1%",
        trend: "down",
        description: "Monthly churn rate decreased significantly"
      }
    ]);
  }, []);

  const runAnalysis = () => {
    setLoading(true);
    
    setTimeout(() => {
      // Simulate updated analysis
      setAnalysisResults([
        {
          title: "Predictive Revenue",
          value: "$2.4M",
          trend: "up",
          description: "Forecasted revenue for next quarter using ARIMA model"
        },
        {
          title: "Customer Lifetime Value",
          value: "$1,847",
          trend: "up",
          description: "Average CLV calculated using regression analysis"
        },
        {
          title: "Market Opportunity",
          value: "32%",
          trend: "up",
          description: "Untapped market potential identified through clustering"
        },
        {
          title: "Risk Score",
          value: "Low (0.23)",
          trend: "down",
          description: "Business risk assessment using ensemble methods"
        }
      ]);
      setLoading(false);
    }, 2000);
  };

  const renderBarChart = (viz: DataVisualization) => (
    <div className="space-y-3">
      {viz.data.map((item, idx) => (
        <div key={idx} className="flex items-center space-x-3">
          <div className="w-16 text-sm text-secondary">{item.label}</div>
          <div className="flex-1 bg-tertiary rounded-full h-6 relative overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(item.value / Math.max(...viz.data.map(d => d.value))) * 100}%` }}
              transition={{ duration: 1, delay: idx * 0.1 }}
              className="h-full rounded-full"
              style={{ backgroundColor: item.color || '#3B82F6' }}
            />
            <span className="absolute right-2 top-0 h-full flex items-center text-xs text-white font-medium">
              {item.value}
            </span>
          </div>
        </div>
      ))}
    </div>
  );

  const renderLineChart = (viz: DataVisualization) => (
    <div className="relative h-48">
      <svg className="w-full h-full">
        {viz.data.map((point, idx) => {
          const x = (idx / (viz.data.length - 1)) * 100;
          const y = 100 - ((point.value - Math.min(...viz.data.map(d => d.value))) / 
                          (Math.max(...viz.data.map(d => d.value)) - Math.min(...viz.data.map(d => d.value)))) * 80;
          
          return (
            <g key={idx}>
              <motion.circle
                cx={`${x}%`}
                cy={`${y}%`}
                r="4"
                fill="#3B82F6"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
              />
              <text x={`${x}%`} y="95%" textAnchor="middle" className="text-xs fill-secondary">
                {point.label}
              </text>
            </g>
          );
        })}
        <motion.polyline
          fill="none"
          stroke="#3B82F6"
          strokeWidth="2"
          points={viz.data.map((point, idx) => {
            const x = (idx / (viz.data.length - 1)) * 100;
            const y = 100 - ((point.value - Math.min(...viz.data.map(d => d.value))) / 
                            (Math.max(...viz.data.map(d => d.value)) - Math.min(...viz.data.map(d => d.value)))) * 80;
            return `${x},${y}`;
          }).join(' ')}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2 }}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );

  const renderPieChart = (viz: DataVisualization) => {
    const total = viz.data.reduce((sum, item) => sum + item.value, 0);
    let cumulativeValue = 0;

    return (
      <div className="flex items-center space-x-6">
        <div className="relative w-40 h-40">
          <svg className="w-full h-full transform -rotate-90">
            {viz.data.map((segment, idx) => {
              const percentage = segment.value / total;
              const startAngle = (cumulativeValue / total) * 360;
              const endAngle = ((cumulativeValue + segment.value) / total) * 360;
              cumulativeValue += segment.value;

              const radius = 60;
              const centerX = 80;
              const centerY = 80;

              const x1 = centerX + radius * Math.cos((startAngle * Math.PI) / 180);
              const y1 = centerY + radius * Math.sin((startAngle * Math.PI) / 180);
              const x2 = centerX + radius * Math.cos((endAngle * Math.PI) / 180);
              const y2 = centerY + radius * Math.sin((endAngle * Math.PI) / 180);

              const largeArcFlag = percentage > 0.5 ? 1 : 0;

              return (
                <motion.path
                  key={idx}
                  d={`M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                  fill={segment.color || '#3B82F6'}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.2 }}
                />
              );
            })}
          </svg>
        </div>
        <div className="space-y-2">
          {viz.data.map((segment, idx) => (
            <div key={idx} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: segment.color || '#3B82F6' }}
              />
              <span className="text-sm text-secondary">
                {segment.label}: {segment.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <motion.div variants={textVariant() as Variants}>
        <p className={styles.sectionSubText}>Project Demo</p>
        <h2 className={styles.sectionHeadText}>Data Science Portfolio</h2>
      </motion.div>

      <motion.div
        variants={fadeIn('', '', 0.1, 1) as Variants}
        className='mt-4 text-secondary text-[17px] max-w-3xl leading-[30px]'
      >
        <p>
          Explore interactive data science projects showcasing machine learning models, 
          statistical analysis, and data visualizations. This portfolio demonstrates 
          real-world applications of data science techniques and methodologies.
        </p>
      </motion.div>

      {/* Navigation Tabs */}
      <motion.div
        variants={fadeIn('up', 'spring', 0.3, 0.75) as Variants}
        className='mt-10'
      >
        <div className='flex flex-wrap gap-4 mb-8'>
          {[
            { key: 'overview', label: 'Overview' },
            { key: 'analysis', label: 'Predictive Analysis' },
            { key: 'modeling', label: 'ML Models' },
            { key: 'visualization', label: 'Visualizations' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-6 py-3 rounded-xl font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-primary text-white'
                  : 'bg-tertiary text-secondary hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className='bg-black-100 rounded-xl p-6'>
          {activeTab === 'overview' && (
            <div className='space-y-6'>
              <h3 className='text-white font-bold text-[24px]'>Portfolio Overview</h3>
              <div className='grid md:grid-cols-2 gap-6'>
                <div className='space-y-4'>
                  <h4 className='text-white font-medium text-lg'>Key Skills Demonstrated</h4>
                  <div className='space-y-2'>
                    {[
                      'Machine Learning (Scikit-learn, TensorFlow)',
                      'Statistical Analysis (Pandas, NumPy)',
                      'Data Visualization (Matplotlib, Seaborn)',
                      'Big Data Processing (Apache Spark)',
                      'Deep Learning (Neural Networks)',
                      'Time Series Forecasting'
                    ].map((skill, idx) => (
                      <div key={idx} className='flex items-center space-x-2'>
                        <div className='w-2 h-2 bg-primary rounded-full'></div>
                        <span className='text-secondary'>{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className='space-y-4'>
                  <h4 className='text-white font-medium text-lg'>Project Categories</h4>
                  <div className='grid grid-cols-2 gap-3'>
                    {[
                      { name: 'Classification', count: 8 },
                      { name: 'Regression', count: 6 },
                      { name: 'Clustering', count: 4 },
                      { name: 'Time Series', count: 5 },
                      { name: 'NLP', count: 3 },
                      { name: 'Computer Vision', count: 4 }
                    ].map((category, idx) => (
                      <div key={idx} className='bg-tertiary p-3 rounded-lg text-center'>
                        <div className='text-white font-bold'>{category.count}</div>
                        <div className='text-secondary text-sm'>{category.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analysis' && (
            <div className='space-y-6'>
              <div className='flex justify-between items-center'>
                <h3 className='text-white font-bold text-[24px]'>Predictive Analysis Dashboard</h3>
                <button
                  onClick={runAnalysis}
                  disabled={loading}
                  className='bg-primary py-2 px-6 rounded-lg text-white font-medium disabled:opacity-50'
                >
                  {loading ? 'Running Analysis...' : 'Run Analysis'}
                </button>
              </div>
              
              <div className='grid md:grid-cols-2 gap-6'>
                {analysisResults.map((result, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className='bg-tertiary p-6 rounded-xl'
                  >
                    <div className='flex justify-between items-start mb-3'>
                      <h4 className='text-white font-medium'>{result.title}</h4>
                      <span className={`text-2xl ${
                        result.trend === 'up' ? '📈' : 
                        result.trend === 'down' ? '📉' : '📊'
                      }`}></span>
                    </div>
                    <div className={`text-3xl font-bold mb-2 ${
                      result.trend === 'up' ? 'text-green-400' :
                      result.trend === 'down' ? 'text-red-400' : 'text-blue-400'
                    }`}>
                      {result.value}
                    </div>
                    <p className='text-secondary text-sm'>{result.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'modeling' && (
            <div className='space-y-6'>
              <h3 className='text-white font-bold text-[24px]'>Machine Learning Models</h3>
              <div className='grid gap-6'>
                {[
                  {
                    name: 'Customer Churn Prediction',
                    algorithm: 'Random Forest',
                    accuracy: '94.2%',
                    features: 'Customer demographics, usage patterns, support tickets'
                  },
                  {
                    name: 'Sales Forecasting',
                    algorithm: 'LSTM Neural Network',
                    accuracy: '89.7%',
                    features: 'Historical sales data, seasonality, economic indicators'
                  },
                  {
                    name: 'Recommendation Engine',
                    algorithm: 'Collaborative Filtering',
                    accuracy: '87.3%',
                    features: 'User behavior, product ratings, item similarity'
                  }
                ].map((model, idx) => (
                  <div key={idx} className='bg-tertiary p-6 rounded-xl'>
                    <div className='flex justify-between items-start mb-4'>
                      <div>
                        <h4 className='text-white font-bold text-lg'>{model.name}</h4>
                        <p className='text-primary'>{model.algorithm}</p>
                      </div>
                      <div className='text-right'>
                        <div className='text-green-400 font-bold text-xl'>{model.accuracy}</div>
                        <div className='text-secondary text-sm'>Accuracy</div>
                      </div>
                    </div>
                    <p className='text-secondary'>
                      <span className='text-white font-medium'>Key Features: </span>
                      {model.features}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'visualization' && (
            <div className='space-y-8'>
              <h3 className='text-white font-bold text-[24px]'>Data Visualizations</h3>
              {visualizations.map((viz, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.2 }}
                  className='bg-tertiary p-6 rounded-xl'
                >
                  <h4 className='text-white font-bold text-lg mb-2'>{viz.title}</h4>
                  <p className='text-secondary mb-6'>{viz.description}</p>
                  
                  {viz.type === 'bar' && renderBarChart(viz)}
                  {viz.type === 'line' && renderLineChart(viz)}
                  {viz.type === 'pie' && renderPieChart(viz)}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default SectionWrapper({ children: <DataSciencePortfolio />, idName: 'data-science-portfolio' });
