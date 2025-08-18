import React, { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import { styles } from '../../styles';
import { SectionWrapper } from '../../hoc';
import { fadeIn, textVariant } from '../../utils/motion';

interface FormData {
  year: string;
  make: string;
  model: string;
  mileage: string;
  condition: string;
  fuelType: string;
  transmission: string;
  bodyType: string;
}

const initialFormData: FormData = {
  year: '',
  make: '',
  model: '',
  mileage: '',
  condition: 'Good',
  fuelType: 'Gasoline',
  transmission: 'Automatic',
  bodyType: 'Sedan'
};

interface ModelFeature {
  name: string;
  importance: number;
  description: string;
}

interface SimilarCar {
  make: string;
  model: string;
  year: string;
  price: string;
  similarity: number;
}

interface ModelInfo {
  name: string;
  accuracy: number;
  trainedOn: number;
  lastUpdated: string;
}

const CarPricePrediction = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [price, setPrice] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<{min: number, max: number} | null>(null);
  const [loading, setLoading] = useState(false);
  const [modelFeatures, setModelFeatures] = useState<ModelFeature[]>([]);
  const [similarCars, setSimilarCars] = useState<SimilarCar[]>([]);
  const [modelInfo, setModelInfo] = useState<ModelInfo>({
    name: 'CarValuePredictor v2.1',
    accuracy: 0.94, // 94% accuracy
    trainedOn: 1250000, // 1.25 million data points
    lastUpdated: '2023-12-15'
  });

  // Simulate loading ML model
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      console.log("ML model loaded");
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);
  
  // Simulate model feature importance calculation
  useEffect(() => {
    setModelFeatures([
      { name: 'Year', importance: 0.28, description: 'Newer cars retain more value' },
      { name: 'Mileage', importance: 0.25, description: 'Lower mileage means higher value' },
      { name: 'Condition', importance: 0.22, description: 'Better condition means higher value' },
      { name: 'Make/Model', importance: 0.15, description: 'Brand reputation affects value' },
      { name: 'Fuel Type', importance: 0.10, description: 'Electric/hybrid vehicles may command premium' }
    ]);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate ML prediction with a timeout
    setTimeout(() => {
      // Enhanced price calculation based on ML model simulation
      const basePrice = 20000;
      
      // Calculate age of the car
      const currentYear = new Date().getFullYear();
      const carAge = currentYear - parseInt(formData.year);
      
      // Age depreciation factor (non-linear)
      const ageDepreciation = Math.pow(0.93, carAge); // 7% depreciation per year, compounded
      
      // Mileage factor - exponential decay based on mileage
      const mileageValue = parseInt(formData.mileage);
      const mileageFactor = Math.exp(-mileageValue / 150000); // Exponential decay
      
      // Make factor - premium brands command higher prices
      const premiumBrands = ['bmw', 'mercedes', 'audi', 'lexus', 'tesla', 'porsche'];
      const midTierBrands = ['toyota', 'honda', 'mazda', 'subaru', 'volkswagen', 'hyundai', 'kia'];
      let makeFactor = 1.0;
      
      if (premiumBrands.includes(formData.make.toLowerCase())) {
        makeFactor = 1.4;
      } else if (midTierBrands.includes(formData.make.toLowerCase())) {
        makeFactor = 1.2;
      }
      
      // Condition factor
      const conditionFactor = 
        formData.condition === 'Excellent' ? 1.3 :
        formData.condition === 'Good' ? 1.1 :
        formData.condition === 'Fair' ? 0.9 : 0.7;
      
      // Fuel type factor
      const fuelTypeFactor = 
        formData.fuelType === 'Electric' ? 1.4 : 
        formData.fuelType === 'Hybrid' ? 1.25 :
        formData.fuelType === 'Diesel' ? 1.1 : 1.0;
      
      // Transmission factor
      const transmissionFactor = formData.transmission === 'Automatic' ? 1.08 : 0.95;
      
      // Body type factor
      const bodyTypeFactor = 
        formData.bodyType === 'SUV' ? 1.15 :
        formData.bodyType === 'Truck' ? 1.2 :
        formData.bodyType === 'Coupe' ? 1.1 :
        formData.bodyType === 'Convertible' ? 1.25 : 1.0;
      
      // Calculate final price with all factors
      const calculatedPrice = basePrice * ageDepreciation * mileageFactor * makeFactor * 
                             conditionFactor * fuelTypeFactor * transmissionFactor * bodyTypeFactor;
      
      // Set price range with confidence interval based on model accuracy
      const confidenceInterval = (1 - modelInfo.accuracy) * calculatedPrice;
      setPriceRange({
        min: Math.round(calculatedPrice - confidenceInterval),
        max: Math.round(calculatedPrice + confidenceInterval)
      });
      
      // Generate similar cars for comparison
      const similarCarsList: SimilarCar[] = [
        {
          make: formData.make,
          model: formData.model,
          year: (parseInt(formData.year) - 1).toString(),
          price: (calculatedPrice * 0.88).toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
          similarity: 92
        },
        {
          make: formData.make,
          model: formData.model,
          year: (parseInt(formData.year) + 1).toString(),
          price: (calculatedPrice * 1.15).toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
          similarity: 89
        },
        {
          make: formData.make === 'Toyota' ? 'Honda' : 'Toyota',
          model: formData.make === 'Toyota' ? 'Accord' : 'Camry',
          year: formData.year,
          price: (calculatedPrice * 0.95).toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
          similarity: 85
        }
      ];
      
      setSimilarCars(similarCarsList);
      setPrice(calculatedPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' }));
      setLoading(false);
    }, 2000);
  };

  return (
    <>
      <motion.div variants={textVariant() as Variants}>
        <p className={styles.sectionSubText}>Project Demo</p>
        <h2 className={styles.sectionHeadText}>Used Car Price Prediction</h2>
      </motion.div>

      <motion.div
        variants={fadeIn('', '', 0.1, 1) as Variants}
        className='mt-4 text-secondary text-[17px] max-w-3xl leading-[30px]'
      >
        <p>
          This demo uses a machine learning model to predict the price of a used car based on
          various factors like year, make, model, mileage, and condition. Enter the details
          below to get an estimated price.
        </p>
      </motion.div>

      <motion.div
        variants={fadeIn('up', 'spring', 0.5, 0.75) as Variants}
        className='mt-10 bg-black-100 rounded-xl p-8 w-full max-w-3xl'
      >
        <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
          <div className='flex flex-col sm:flex-row gap-4'>
            <div className='flex-1'>
              <label className='text-white font-medium mb-2 block'>Year</label>
              <input
                type='number'
                name='year'
                value={formData.year}
                onChange={handleChange}
                placeholder='2020'
                min='1990'
                max='2023'
                required
                className='bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium w-full'
              />
            </div>
            <div className='flex-1'>
              <label className='text-white font-medium mb-2 block'>Mileage</label>
              <input
                type='number'
                name='mileage'
                value={formData.mileage}
                onChange={handleChange}
                placeholder='30000'
                min='0'
                required
                className='bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium w-full'
              />
            </div>
          </div>

          <div className='flex flex-col sm:flex-row gap-4'>
            <div className='flex-1'>
              <label className='text-white font-medium mb-2 block'>Make</label>
              <input
                type='text'
                name='make'
                value={formData.make}
                onChange={handleChange}
                placeholder='Toyota'
                required
                className='bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium w-full'
              />
            </div>
            <div className='flex-1'>
              <label className='text-white font-medium mb-2 block'>Model</label>
              <input
                type='text'
                name='model'
                value={formData.model}
                onChange={handleChange}
                placeholder='Camry'
                required
                className='bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium w-full'
              />
            </div>
          </div>

          <div className='flex flex-col sm:flex-row gap-4'>
            <div className='flex-1'>
              <label className='text-white font-medium mb-2 block'>Condition</label>
              <select
                name='condition'
                value={formData.condition}
                onChange={handleChange}
                className='bg-tertiary py-4 px-6 text-white rounded-lg outline-none border-none font-medium w-full'
              >
                <option value='Excellent'>Excellent</option>
                <option value='Good'>Good</option>
                <option value='Fair'>Fair</option>
                <option value='Poor'>Poor</option>
              </select>
            </div>
            <div className='flex-1'>
              <label className='text-white font-medium mb-2 block'>Fuel Type</label>
              <select
                name='fuelType'
                value={formData.fuelType}
                onChange={handleChange}
                className='bg-tertiary py-4 px-6 text-white rounded-lg outline-none border-none font-medium w-full'
              >
                <option value='Gasoline'>Gasoline</option>
                <option value='Diesel'>Diesel</option>
                <option value='Hybrid'>Hybrid</option>
                <option value='Electric'>Electric</option>
              </select>
            </div>
          </div>
          
          <div className='flex flex-col sm:flex-row gap-4'>
            <div className='flex-1'>
              <label className='text-white font-medium mb-2 block'>Transmission</label>
              <select
                name='transmission'
                value={formData.transmission}
                onChange={handleChange}
                className='bg-tertiary py-4 px-6 text-white rounded-lg outline-none border-none font-medium w-full'
              >
                <option value='Automatic'>Automatic</option>
                <option value='Manual'>Manual</option>
              </select>
            </div>
            <div className='flex-1'>
              <label className='text-white font-medium mb-2 block'>Body Type</label>
              <select
                name='bodyType'
                value={formData.bodyType}
                onChange={handleChange}
                className='bg-tertiary py-4 px-6 text-white rounded-lg outline-none border-none font-medium w-full'
              >
                <option value='Sedan'>Sedan</option>
                <option value='SUV'>SUV</option>
                <option value='Truck'>Truck</option>
                <option value='Coupe'>Coupe</option>
                <option value='Convertible'>Convertible</option>
                <option value='Hatchback'>Hatchback</option>
                <option value='Wagon'>Wagon</option>
              </select>
            </div>
          </div>

          <button
            type='submit'
            disabled={loading}
            className='bg-tertiary py-3 px-8 rounded-xl outline-none w-fit text-white font-bold shadow-md shadow-primary'
          >
            {loading ? 'Calculating...' : 'Predict Price'}
          </button>
        </form>

        {price && (
          <div className='mt-10 p-6 bg-tertiary rounded-xl'>
            <h3 className='text-white font-bold text-[24px] mb-2'>Estimated Price:</h3>
            <p className='text-gradient text-[36px] font-bold'>{price}</p>
            {priceRange && (
              <p className='text-secondary text-[16px] mt-1'>
                Price Range: {priceRange.min.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} - {priceRange.max.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
              </p>
            )}
            
            <div className='mt-6 border-t border-gray-700 pt-4'>
              <h4 className='text-white font-medium mb-3'>Model Information</h4>
              <div className='grid grid-cols-2 gap-2 text-sm'>
                <div>
                  <p className='text-secondary'>Model Name:</p>
                  <p className='text-white'>{modelInfo.name}</p>
                </div>
                <div>
                  <p className='text-secondary'>Accuracy:</p>
                  <p className='text-white'>{(modelInfo.accuracy * 100).toFixed(1)}%</p>
                </div>
                <div>
                  <p className='text-secondary'>Trained On:</p>
                  <p className='text-white'>{modelInfo.trainedOn.toLocaleString()} vehicles</p>
                </div>
                <div>
                  <p className='text-secondary'>Last Updated:</p>
                  <p className='text-white'>{modelInfo.lastUpdated}</p>
                </div>
              </div>
            </div>
            
            <div className='mt-6 border-t border-gray-700 pt-4'>
              <h4 className='text-white font-medium mb-3'>Feature Importance</h4>
              <div className='space-y-2'>
                {modelFeatures.map((feature, index) => (
                  <div key={index} className='flex items-center'>
                    <div className='w-1/3 text-secondary text-sm'>{feature.name}:</div>
                    <div className='w-2/3 flex items-center'>
                      <div 
                        className='bg-blue-500 h-4 rounded' 
                        style={{ width: `${feature.importance * 100}%` }}
                      ></div>
                      <span className='ml-2 text-white text-sm'>{(feature.importance * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {similarCars.length > 0 && (
              <div className='mt-6 border-t border-gray-700 pt-4'>
                <h4 className='text-white font-medium mb-3'>Similar Vehicles</h4>
                <div className='space-y-3'>
                  {similarCars.map((car, index) => (
                    <div key={index} className='bg-black-200 p-3 rounded-lg flex justify-between items-center'>
                      <div>
                        <p className='text-white font-medium'>{car.year} {car.make} {car.model}</p>
                        <p className='text-secondary text-sm'>Similarity: {car.similarity}%</p>
                      </div>
                      <p className='text-gradient font-bold'>{car.price}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <p className='text-secondary text-[14px] mt-6'>
              This is an estimated price based on the provided information and our ML model. 
              Actual market prices may vary based on additional factors not captured in this model.
            </p>
          </div>
        )}
      </motion.div>
    </>
  );
};

export default () => SectionWrapper({ children: <CarPricePrediction />, idName: 'car-price-prediction' });
