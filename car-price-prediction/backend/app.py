"""
Flask API Backend for Used Car Price Prediction
Provides prediction endpoint with SHAP explainability
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np
import shap
import os
import warnings
warnings.filterwarnings('ignore')

app = Flask(__name__)
CORS(app)

# Global variables to store loaded models
model = None
label_encoders = None
scaler = None
feature_columns = None
model_info = None
explainer = None

def load_model_artifacts():
    """Load all model artifacts"""
    global model, label_encoders, scaler, feature_columns, model_info, explainer
    
    try:
        base_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        models_path = os.path.join(base_path, 'models')
        
        model = joblib.load(os.path.join(models_path, 'best_model.pkl'))
        label_encoders = joblib.load(os.path.join(models_path, 'label_encoders.pkl'))
        scaler = joblib.load(os.path.join(models_path, 'scaler.pkl'))
        feature_columns = joblib.load(os.path.join(models_path, 'feature_columns.pkl'))
        model_info = joblib.load(os.path.join(models_path, 'model_info.pkl'))
        
        # Initialize SHAP explainer
        # For tree-based models, use TreeExplainer
        if 'Random Forest' in model_info['model_name'] or 'XGBoost' in model_info['model_name']:
            explainer = shap.TreeExplainer(model)
        else:
            # For linear models, use LinearExplainer or KernelExplainer
            explainer = shap.KernelExplainer(model.predict, shap.sample(pd.DataFrame(np.random.randn(100, len(feature_columns)), columns=feature_columns), 50))
        
        print("Model artifacts loaded successfully!")
        print(f"Model: {model_info['model_name']}")
        print(f"Features: {feature_columns}")
        
        return True
    except Exception as e:
        print(f"Error loading model artifacts: {e}")
        return False

def preprocess_input(data):
    """Preprocess input data for prediction"""
    try:
        # Create DataFrame from input
        df = pd.DataFrame([data])
        
        # Calculate age from year
        current_year = 2024
        df['age'] = current_year - df['year']
        
        # Encode categorical variables
        categorical_features = ['brand', 'fuel', 'seller_type', 'transmission']
        
        for feature in categorical_features:
            if feature in df.columns and feature in label_encoders:
                le = label_encoders[feature]
                try:
                    df[feature + '_encoded'] = le.transform(df[feature])
                except ValueError:
                    # Handle unseen categories by using the most frequent category
                    print(f"Warning: Unseen category in {feature}: {df[feature].values[0]}")
                    df[feature + '_encoded'] = le.transform([le.classes_[0]])
        
        # Select and reorder features
        X = df[feature_columns]
        
        # Scale features
        X_scaled = scaler.transform(X)
        X_scaled = pd.DataFrame(X_scaled, columns=feature_columns)
        
        return X_scaled
    except Exception as e:
        print(f"Error in preprocessing: {e}")
        raise

def get_feature_importance_explanation(input_data, shap_values):
    """Generate human-readable feature importance explanation"""
    feature_names = {
        'age': 'Car Age',
        'km_driven': 'Kilometers Driven',
        'mileage': 'Mileage (kmpl)',
        'engine': 'Engine Size (CC)',
        'max_power': 'Max Power (bhp)',
        'seats': 'Number of Seats',
        'brand_encoded': 'Brand',
        'fuel_encoded': 'Fuel Type',
        'seller_type_encoded': 'Seller Type',
        'transmission_encoded': 'Transmission'
    }
    
    explanations = []
    
    # Get top 5 features by absolute SHAP value
    feature_importance = [(abs(val), idx, val) for idx, val in enumerate(shap_values[0])]
    feature_importance.sort(reverse=True)
    
    for abs_val, idx, val in feature_importance[:5]:
        feature_name = feature_columns[idx]
        readable_name = feature_names.get(feature_name, feature_name)
        
        if val > 0:
            impact = "increases"
        else:
            impact = "decreases"
        
        explanations.append({
            'feature': readable_name,
            'value': float(input_data.iloc[0, idx]) if not feature_name.endswith('_encoded') else 'Categorical',
            'impact': impact,
            'contribution': float(val),
            'abs_contribution': float(abs_val)
        })
    
    return explanations

@app.route('/')
def home():
    """Health check endpoint"""
    if model is None:
        return jsonify({'status': 'error', 'message': 'Model not loaded'})
    
    return jsonify({
        'status': 'ok',
        'message': 'Used Car Price Prediction API',
        'model': model_info['model_name'] if model_info else 'Unknown',
        'version': '1.0'
    })

@app.route('/predict', methods=['POST'])
def predict():
    """Main prediction endpoint"""
    try:
        if model is None:
            return jsonify({'error': 'Model not loaded'}), 500
        
        # Get input data
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No input data provided'}), 400
        
        # Validate required fields
        required_fields = ['brand', 'year', 'km_driven', 'fuel', 'seller_type', 
                          'transmission', 'mileage', 'engine', 'max_power', 'seats']
        
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({'error': f'Missing required fields: {missing_fields}'}), 400
        
        # Preprocess input
        processed_data = preprocess_input(data)
        
        # Make prediction
        prediction = model.predict(processed_data)[0]
        
        # Calculate SHAP values for explainability
        try:
            if explainer:
                shap_values = explainer.shap_values(processed_data)
                if isinstance(shap_values, list):  # For tree models with multiple outputs
                    shap_values = shap_values[0]
                
                # Generate explanations
                explanations = get_feature_importance_explanation(processed_data, [shap_values[0]])
            else:
                explanations = []
        except Exception as e:
            print(f"Error calculating SHAP values: {e}")
            explanations = []
        
        # Format response
        response = {
            'predicted_price': float(prediction),
            'predicted_price_formatted': f"₹{prediction:,.0f}",
            'model_used': model_info['model_name'] if model_info else 'Unknown',
            'explanations': explanations,
            'input_data': data
        }
        
        return jsonify(response)
    
    except Exception as e:
        print(f"Prediction error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/model-info', methods=['GET'])
def get_model_info():
    """Get model information"""
    if model_info is None:
        return jsonify({'error': 'Model not loaded'}), 500
    
    return jsonify({
        'model_name': model_info['model_name'],
        'training_date': model_info['training_date'],
        'features': model_info['feature_columns'],
        'feature_count': len(model_info['feature_columns'])
    })

@app.route('/brands', methods=['GET'])
def get_brands():
    """Get available car brands"""
    if label_encoders is None or 'brand' not in label_encoders:
        return jsonify({'error': 'Brand encoder not available'}), 500
    
    brands = label_encoders['brand'].classes_.tolist()
    return jsonify({'brands': brands})

@app.route('/options', methods=['GET'])
def get_options():
    """Get all available options for categorical fields"""
    if label_encoders is None:
        return jsonify({'error': 'Encoders not loaded'}), 500
    
    options = {}
    for field, encoder in label_encoders.items():
        options[field] = encoder.classes_.tolist()
    
    return jsonify(options)

if __name__ == '__main__':
    # Load model artifacts on startup
    if load_model_artifacts():
        print("Starting Flask API server...")
        app.run(debug=True, host='0.0.0.0', port=5000)
    else:
        print("Failed to load model artifacts. Please train the model first.")
        print("Run: python train_model.py")
