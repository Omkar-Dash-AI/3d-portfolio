import React, { useState, useRef, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import { styles } from '../../styles';
import { SectionWrapper } from '../../hoc';
import { fadeIn, textVariant } from '../../utils/motion';

// YOLO model configuration
const YOLO_CONFIG = {
  modelName: 'YOLOv5',
  version: '6.1',
  inputSize: 640,
  confidence: 0.25,
  iouThreshold: 0.45,
  classNames: [
    'person', 'bicycle', 'car', 'motorcycle', 'bus', 'truck',
    'traffic light', 'fire hydrant', 'stop sign', 'parking meter'
  ]
};

interface DetectedObject {
  id: number;
  class: string;
  confidence: number;
  bbox: [number, number, number, number]; // [x, y, width, height] normalized
  color: string;
}

interface AnalysisResult {
  objects: DetectedObject[];
  vehicleCount: number;
  personCount: number;
  timestamp: string;
  processingTime?: number;
  modelInfo?: {
    name: string;
    version: string;
    fps: number;
  };
}

// Predefined colors for bounding boxes
const colors = [
  '#FF3838', '#FF9D97', '#FF701F', '#FFB21D', '#CFD231', '#48F90A',
  '#92CC17', '#3DDB86', '#1A9334', '#00D4BB', '#2C99A8', '#00C2FF',
  '#344593', '#6473FF', '#0018EC', '#8438FF', '#520085', '#CB38FF',
  '#FF95C8', '#FF37C7'
];

// Sample video frames (in a real app, these would be actual video frames)
const sampleFrames = [
  '/src/assets/traffic-frames/frame1.jpg',
  '/src/assets/traffic-frames/frame2.jpg',
  '/src/assets/traffic-frames/frame3.jpg',
];

// Simulated YOLO detection results for each frame
const simulatedDetections: Record<string, DetectedObject[]> = {
  '/src/assets/traffic-frames/frame1.jpg': [
    { id: 1, class: 'car', confidence: 0.92, bbox: [0.3, 0.4, 0.15, 0.1], color: colors[0] },
    { id: 2, class: 'car', confidence: 0.88, bbox: [0.5, 0.45, 0.12, 0.08], color: colors[1] },
    { id: 3, class: 'person', confidence: 0.85, bbox: [0.2, 0.5, 0.05, 0.1], color: colors[2] },
    { id: 4, class: 'truck', confidence: 0.79, bbox: [0.7, 0.42, 0.18, 0.12], color: colors[3] },
  ],
  '/src/assets/traffic-frames/frame2.jpg': [
    { id: 1, class: 'car', confidence: 0.94, bbox: [0.32, 0.41, 0.15, 0.1], color: colors[0] },
    { id: 2, class: 'car', confidence: 0.89, bbox: [0.52, 0.46, 0.12, 0.08], color: colors[1] },
    { id: 3, class: 'person', confidence: 0.82, bbox: [0.21, 0.51, 0.05, 0.1], color: colors[2] },
    { id: 4, class: 'truck', confidence: 0.81, bbox: [0.72, 0.43, 0.18, 0.12], color: colors[3] },
    { id: 5, class: 'motorcycle', confidence: 0.76, bbox: [0.4, 0.48, 0.08, 0.06], color: colors[4] },
    { id: 6, class: 'person', confidence: 0.78, bbox: [0.6, 0.52, 0.04, 0.09], color: colors[5] },
  ],
  '/src/assets/traffic-frames/frame3.jpg': [
    { id: 1, class: 'car', confidence: 0.91, bbox: [0.33, 0.42, 0.15, 0.1], color: colors[0] },
    { id: 2, class: 'car', confidence: 0.87, bbox: [0.53, 0.47, 0.12, 0.08], color: colors[1] },
    { id: 3, class: 'bus', confidence: 0.89, bbox: [0.15, 0.4, 0.25, 0.15], color: colors[6] },
    { id: 4, class: 'person', confidence: 0.84, bbox: [0.22, 0.52, 0.05, 0.1], color: colors[2] },
    { id: 5, class: 'person', confidence: 0.81, bbox: [0.61, 0.53, 0.04, 0.09], color: colors[5] },
    { id: 6, class: 'bicycle', confidence: 0.73, bbox: [0.45, 0.5, 0.07, 0.05], color: colors[7] },
    { id: 7, class: 'car', confidence: 0.85, bbox: [0.8, 0.45, 0.14, 0.09], color: colors[8] },
  ]
};

const TrafficSurveillance = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(0.5);
  const [loading, setLoading] = useState<boolean>(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [modelLoading, setModelLoading] = useState(true);
  const [useYOLO, setUseYOLO] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  
  // Simulate loading the YOLO model
  useEffect(() => {
    console.log('Loading YOLO model...');
    const timer = setTimeout(() => {
      console.log('YOLO model loaded successfully');
      setModelLoading(false);
      setModelLoaded(true);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  // Handle file upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageDataUrl = event.target?.result as string;
      setUploadedImage(imageDataUrl);
      setSelectedImage(null); // Clear any selected sample image
      setAnalysisResult(null); // Clear previous results
    };
    reader.readAsDataURL(file);
  };

  // Handle sample image selection
  const handleSampleSelect = (imagePath: string) => {
    setSelectedImage(imagePath);
    setUploadedImage(null); // Clear any uploaded image
    setAnalysisResult(null); // Clear previous results
  };

  // Simulate YOLO object detection
  const runObjectDetection = () => {
    if (!selectedImage && !uploadedImage) return;
    
    setLoading(true);
    
    // Simulate processing time (longer for YOLO, shorter for basic detection)
    const processingTime = useYOLO ? (Math.random() * 300 + 700) : (Math.random() * 200 + 300);
    
    setTimeout(() => {
      let detections: DetectedObject[] = [];
      
      if (selectedImage) {
        // Use predefined detections for sample images
        detections = simulatedDetections[selectedImage] || [];
      } else {
        // For uploaded images, generate random detections
        const objectCount = useYOLO ? 
          (5 + Math.floor(Math.random() * 5)) : // 5-10 objects with YOLO (more accurate)
          (3 + Math.floor(Math.random() * 5)); // 3-7 objects with basic detection
          
        const objectClasses = useYOLO ? 
          YOLO_CONFIG.classNames.slice(0, 6) : // Use YOLO classes
          ['car', 'person', 'truck', 'bus', 'motorcycle', 'bicycle'];
        
        for (let i = 0; i < objectCount; i++) {
          const classIndex = Math.floor(Math.random() * objectClasses.length);
          // YOLO has higher confidence on average
          const confidence = useYOLO ? 
            (0.75 + (Math.random() * 0.24)) : // 0.75-0.99 for YOLO
            (0.7 + (Math.random() * 0.29));  // 0.7-0.99 for basic detection
          
          detections.push({
            id: i + 1,
            class: objectClasses[classIndex],
            confidence,
            bbox: [
              0.1 + (Math.random() * 0.7), // x: 0.1-0.8
              0.1 + (Math.random() * 0.7), // y: 0.1-0.8
              0.05 + (Math.random() * 0.2), // width: 0.05-0.25
              0.05 + (Math.random() * 0.15)  // height: 0.05-0.2
            ],
            color: colors[i % colors.length]
          });
        }
      }
      
      // Filter by confidence threshold
      const filteredDetections = detections.filter(obj => obj.confidence >= confidenceThreshold);
      
      // Count vehicles and persons
      const vehicleCount = filteredDetections.filter(obj => 
        ['car', 'truck', 'bus', 'motorcycle'].includes(obj.class)
      ).length;
      
      const personCount = filteredDetections.filter(obj => obj.class === 'person').length;
      
      // Calculate simulated FPS based on processing time
      const fps = Math.round(1000 / processingTime * 10) / 10;
      
      // Set analysis result
      setAnalysisResult({
        objects: filteredDetections,
        vehicleCount,
        personCount,
        timestamp: new Date().toLocaleString(),
        processingTime: Math.round(processingTime),
        modelInfo: useYOLO ? {
          name: YOLO_CONFIG.modelName,
          version: YOLO_CONFIG.version,
          fps: fps
        } : {
          name: 'Basic Detector',
          version: '1.0',
          fps: fps
        }
      });
      
      setLoading(false);
    }, processingTime);
  };

  // Draw bounding boxes on canvas when analysis result changes
  useEffect(() => {
    if (!analysisResult || (!imageRef.current && !canvasRef.current)) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    
    const image = imageRef.current;
    if (!image) return;
    
    // Wait for image to load
    const drawDetections = () => {
      // Set canvas dimensions to match image
      canvas.width = image.width;
      canvas.height = image.height;
      
      // Draw image on canvas
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      
      // Draw bounding boxes
      analysisResult.objects.forEach(obj => {
        const [x, y, width, height] = obj.bbox;
        
        // Convert normalized coordinates to pixel values
        const boxX = x * canvas.width;
        const boxY = y * canvas.height;
        const boxWidth = width * canvas.width;
        const boxHeight = height * canvas.height;
        
        // Draw bounding box
        ctx.strokeStyle = obj.color;
        ctx.lineWidth = 3;
        ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);
        
        // Draw label background
        ctx.fillStyle = obj.color;
        const label = `${obj.class} ${Math.round(obj.confidence * 100)}%`;
        const textMetrics = ctx.measureText(label);
        const labelHeight = 20;
        ctx.fillRect(boxX, boxY - labelHeight, textMetrics.width + 10, labelHeight);
        
        // Draw label text
        ctx.fillStyle = '#ffffff';
        ctx.font = '14px Arial';
        ctx.fillText(label, boxX + 5, boxY - 5);
      });
    };
    
    if (image.complete) {
      drawDetections();
    } else {
      image.onload = drawDetections;
    }
  }, [analysisResult]);

  return (
    <>
      <motion.div variants={textVariant() as Variants}>
        <p className={styles.sectionSubText}>Project Demo</p>
        <h2 className={styles.sectionHeadText}>Traffic Surveillance System</h2>
      </motion.div>

      <motion.div
        variants={fadeIn('', '', 0.1, 1)}
        className='mt-4 text-secondary text-[17px] max-w-3xl leading-[30px]'
      >
        <p>
          This AI-powered traffic surveillance system uses computer vision to detect and classify 
          vehicles, pedestrians, and other objects in traffic scenes. The system demonstrates 
          object detection capabilities similar to those used in smart city applications.
        </p>
      </motion.div>

      <motion.div
        variants={fadeIn('up', 'spring', 0.5, 0.75)}
        className='mt-10 bg-black-100 rounded-xl p-8 w-full max-w-5xl'
      >
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='md:col-span-1'>
            <h3 className='text-white font-medium text-[20px] mb-4'>Controls</h3>
            
            <div className='mb-6'>
              <p className='text-white mb-2'>Upload Image</p>
              <input
                type='file'
                accept='image/*'
                onChange={handleImageUpload}
                className='bg-tertiary py-2 px-4 rounded-lg text-white w-full'
              />
            </div>
            
            <div className='mb-6'>
              <p className='text-white mb-2'>Or Select Sample</p>
              <div className='grid grid-cols-3 gap-2'>
                {sampleFrames.map((frame, index) => (
                  <div 
                    key={index}
                    onClick={() => handleSampleSelect(frame)}
                    className={`cursor-pointer border-2 rounded-md overflow-hidden ${selectedImage === frame ? 'border-primary' : 'border-transparent'}`}
                  >
                    <div className='bg-tertiary h-16 flex items-center justify-center text-white text-xs text-center p-1'>
                      Sample {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className='mb-4'>
              <div className='flex items-center gap-2 mb-2'>
                <input
                  type='checkbox'
                  id='useYOLO'
                  checked={useYOLO}
                  onChange={() => setUseYOLO(!useYOLO)}
                  className='w-4 h-4'
                  disabled={modelLoading}
                />
                <label htmlFor='useYOLO' className='text-white flex items-center'>
                  Use YOLO Object Detection
                  {modelLoading && (
                    <span className='ml-2 text-xs text-yellow-400 animate-pulse'>
                      (Loading model...)
                    </span>
                  )}
                </label>
              </div>
              <p className='text-secondary text-xs ml-6 mb-4'>
                {useYOLO ? 
                  `Using ${YOLO_CONFIG.modelName} v${YOLO_CONFIG.version} for more accurate detection` : 
                  'Using basic detection algorithm (less accurate but faster)'}
              </p>
            </div>
            
            <div className='mb-6'>
              <p className='text-white mb-2'>Confidence Threshold: {confidenceThreshold.toFixed(2)}</p>
              <input
                type='range'
                min='0'
                max='1'
                step='0.05'
                value={confidenceThreshold}
                onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
                className='w-full'
              />
            </div>
            
            <button
              onClick={runObjectDetection}
              disabled={loading || (!selectedImage && !uploadedImage) || (useYOLO && modelLoading)}
              className='bg-tertiary py-3 px-8 rounded-xl outline-none w-full text-white font-bold shadow-md shadow-primary disabled:opacity-50'
            >
              {loading ? 'Processing...' : 'Detect Objects'}
            </button>
          </div>
          
          <div className='md:col-span-2'>
            <h3 className='text-white font-medium text-[20px] mb-4'>Detection Results</h3>
            
            <div className='relative bg-tertiary rounded-lg overflow-hidden' style={{ minHeight: '300px' }}>
              {(selectedImage || uploadedImage) ? (
                <>
                  <img
                    ref={imageRef}
                    src={selectedImage || uploadedImage || ''}
                    alt='Traffic scene'
                    className='w-full h-auto'
                    style={{ display: analysisResult ? 'none' : 'block' }}
                  />
                  <canvas 
                    ref={canvasRef} 
                    className='w-full h-auto'
                    style={{ display: analysisResult ? 'block' : 'none' }}
                  />
                </>
              ) : (
                <div className='absolute inset-0 flex items-center justify-center text-white'>
                  <p>Please upload or select an image</p>
                </div>
              )}
            </div>
            
            {analysisResult && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className='mt-4 bg-tertiary p-4 rounded-lg'
              >
                <h4 className='text-white font-medium mb-2'>Analysis Summary</h4>
                <div className='grid grid-cols-2 gap-4 mb-4'>
                  <div className='bg-black-200 p-3 rounded-lg'>
                    <p className='text-secondary'>Vehicles Detected</p>
                    <p className='text-white text-2xl font-bold'>{analysisResult.vehicleCount}</p>
                  </div>
                  <div className='bg-black-200 p-3 rounded-lg'>
                    <p className='text-secondary'>Pedestrians Detected</p>
                    <p className='text-white text-2xl font-bold'>{analysisResult.personCount}</p>
                  </div>
                </div>
                
                {analysisResult.modelInfo && (
                  <div className='bg-tertiary/20 p-3 rounded-lg mb-4'>
                    <div className='flex justify-between items-center'>
                      <div>
                        <p className='text-secondary text-xs'>Detection Model</p>
                        <p className='text-white font-medium'>
                          {analysisResult.modelInfo.name} v{analysisResult.modelInfo.version}
                        </p>
                      </div>
                      <div className='text-right'>
                        <p className='text-secondary text-xs'>Processing Speed</p>
                        <p className='text-white font-medium'>
                          {analysisResult.modelInfo.fps} FPS
                        </p>
                      </div>
                    </div>
                    {analysisResult.processingTime && (
                      <p className='text-secondary text-xs mt-1'>
                        Processed in {analysisResult.processingTime}ms
                      </p>
                    )}
                  </div>
                )}
                
                <h4 className='text-white font-medium mb-2'>Detected Objects</h4>
                <div className='max-h-40 overflow-y-auto'>
                  <table className='w-full text-sm'>
                    <thead className='text-secondary'>
                      <tr>
                        <th className='text-left py-2'>Class</th>
                        <th className='text-left py-2'>Confidence</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analysisResult.objects.map((obj) => (
                        <tr key={obj.id} className='border-t border-gray-700'>
                          <td className='py-2 flex items-center'>
                            <span 
                              className='inline-block w-3 h-3 rounded-full mr-2'
                              style={{ backgroundColor: obj.color }}
                            />
                            <span className='capitalize'>{obj.class}</span>
                          </td>
                          <td className='py-2'>{(obj.confidence * 100).toFixed(1)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <p className='text-xs text-secondary mt-4'>
                  Analysis completed at {analysisResult.timestamp}
                </p>
              </motion.div>
            )}
          </div>
        </div>
        
        <div className='mt-8 text-secondary text-sm'>
          <p>
            This demo simulates object detection using a YOLO (You Only Look Once) model. 
            In a production environment, this would use an actual trained model running on a server 
            or via TensorFlow.js in the browser. The system could be extended to include vehicle counting, 
            speed estimation, and traffic flow analysis.
          </p>
          
          {modelLoaded && (
            <div className='mt-4 bg-blue-900/30 p-3 rounded-lg border border-blue-800'>
              <h5 className='text-white text-sm font-medium flex items-center'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                </svg>
                About YOLO Object Detection
              </h5>
              <p className='text-xs mt-1'>
                YOLO (You Only Look Once) is a real-time object detection algorithm that processes images in a single pass through a neural network, 
                making it extremely fast while maintaining high accuracy. {YOLO_CONFIG.modelName} can detect multiple object classes simultaneously 
                and is widely used in computer vision applications including autonomous vehicles, surveillance systems, and robotics.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default SectionWrapper({ children: <TrafficSurveillance />, idName: 'traffic-surveillance' });
