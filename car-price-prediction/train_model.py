"""
Used Car Price Prediction - Model Training Pipeline
This script handles data preprocessing, model training, and evaluation.
"""

import pandas as pd
import numpy as np
import joblib
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
import xgboost as xgb
import warnings
warnings.filterwarnings('ignore')

def create_sample_dataset():
    """Create a sample used car dataset for demonstration"""
    np.random.seed(42)
    
    brands = ['Maruti', 'Hyundai', 'Honda', 'Tata', 'Toyota', 'Ford', 'Mahindra', 'Chevrolet', 'Renault', 'Nissan']
    models = {
        'Maruti': ['Swift', 'Alto', 'Baleno', 'Vitara Brezza', 'Wagon R'],
        'Hyundai': ['i20', 'Creta', 'Verna', 'Grand i10', 'Elite i20'],
        'Honda': ['City', 'Amaze', 'Jazz', 'WR-V', 'Civic'],
        'Tata': ['Nexon', 'Harrier', 'Altroz', 'Tiago', 'Safari'],
        'Toyota': ['Innova', 'Corolla', 'Fortuner', 'Etios', 'Yaris']
    }
    
    fuel_types = ['Petrol', 'Diesel', 'CNG', 'LPG', 'Electric']
    seller_types = ['Individual', 'Dealer', 'Trustmark Dealer']
    transmissions = ['Manual', 'Automatic']
    
    data = []
    for i in range(5000):
        brand = np.random.choice(brands)
        if brand in models:
            model = np.random.choice(models[brand])
        else:
            model = f"{brand} Model {np.random.randint(1, 6)}"
        
        year = np.random.randint(2005, 2024)
        age = 2024 - year
        km_driven = np.random.randint(5000, 200000)
        fuel_type = np.random.choice(fuel_types)
        seller_type = np.random.choice(seller_types)
        transmission = np.random.choice(transmissions)
        mileage = np.random.uniform(10, 25)
        engine = np.random.randint(800, 2500)
        max_power = np.random.uniform(50, 200)
        seats = np.random.choice([4, 5, 7, 8])
        
        # Create realistic price based on features
        base_price = 300000  # Base price in INR
        
        # Brand multiplier
        brand_multipliers = {
            'Toyota': 1.4, 'Honda': 1.3, 'Hyundai': 1.2, 'Maruti': 1.0,
            'Tata': 0.9, 'Ford': 1.1, 'Mahindra': 0.95, 'Chevrolet': 0.8,
            'Renault': 0.85, 'Nissan': 0.9
        }
        
        price = base_price * brand_multipliers.get(brand, 1.0)
        
        # Age depreciation
        price *= (0.85 ** age)
        
        # KM driven impact
        price *= (1 - (km_driven / 500000))
        
        # Fuel type impact
        if fuel_type == 'Diesel':
            price *= 1.1
        elif fuel_type == 'Electric':
            price *= 1.5
        elif fuel_type in ['CNG', 'LPG']:
            price *= 0.95
        
        # Transmission impact
        if transmission == 'Automatic':
            price *= 1.15
        
        # Engine and power impact
        price *= (1 + (engine / 10000))
        price *= (1 + (max_power / 1000))
        
        # Add some noise
        price *= np.random.uniform(0.9, 1.1)
        
        car_name = f"{brand} {model}"
        
        data.append({
            'name': car_name,
            'brand': brand,
            'model': model,
            'year': year,
            'km_driven': km_driven,
            'fuel': fuel_type,
            'seller_type': seller_type,
            'transmission': transmission,
            'mileage': round(mileage, 2),
            'engine': engine,
            'max_power': round(max_power, 2),
            'seats': seats,
            'selling_price': int(price)
        })
    
    return pd.DataFrame(data)

def preprocess_data(df):
    """Preprocess the dataset"""
    print("Starting data preprocessing...")
    
    # Handle missing values
    df = df.copy()
    
    # Fill missing numeric values with median
    numeric_columns = ['mileage', 'engine', 'max_power', 'km_driven']
    for col in numeric_columns:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors='coerce')
            df[col].fillna(df[col].median(), inplace=True)
    
    # Fill missing categorical values with mode
    categorical_columns = ['fuel', 'seller_type', 'transmission']
    for col in categorical_columns:
        if col in df.columns:
            df[col].fillna(df[col].mode()[0], inplace=True)
    
    # Create age feature
    current_year = 2024
    df['age'] = current_year - df['year']
    
    # Encode categorical variables
    label_encoders = {}
    categorical_features = ['brand', 'fuel', 'seller_type', 'transmission']
    
    for feature in categorical_features:
        if feature in df.columns:
            le = LabelEncoder()
            df[feature + '_encoded'] = le.fit_transform(df[feature])
            label_encoders[feature] = le
    
    # Select features for training
    feature_columns = [
        'age', 'km_driven', 'mileage', 'engine', 'max_power', 'seats',
        'brand_encoded', 'fuel_encoded', 'seller_type_encoded', 'transmission_encoded'
    ]
    
    # Ensure all feature columns exist
    for col in feature_columns:
        if col not in df.columns:
            print(f"Warning: Column {col} not found in dataset")
    
    feature_columns = [col for col in feature_columns if col in df.columns]
    
    X = df[feature_columns]
    y = df['selling_price']
    
    # Scale numeric features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    X_scaled = pd.DataFrame(X_scaled, columns=feature_columns)
    
    print(f"Dataset shape: {X_scaled.shape}")
    print(f"Target shape: {y.shape}")
    
    return X_scaled, y, label_encoders, scaler, feature_columns

def train_models(X, y):
    """Train multiple ML models and select the best one"""
    print("Training models...")
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    models = {
        'Linear Regression': LinearRegression(),
        'Random Forest': RandomForestRegressor(n_estimators=100, random_state=42),
        'XGBoost': xgb.XGBRegressor(n_estimators=100, random_state=42)
    }
    
    results = {}
    
    for name, model in models.items():
        print(f"Training {name}...")
        
        # Train model
        model.fit(X_train, y_train)
        
        # Predictions
        y_pred = model.predict(X_test)
        
        # Metrics
        r2 = r2_score(y_test, y_pred)
        rmse = np.sqrt(mean_squared_error(y_test, y_pred))
        mae = mean_absolute_error(y_test, y_pred)
        
        # Cross-validation
        cv_scores = cross_val_score(model, X, y, cv=5, scoring='r2')
        
        results[name] = {
            'model': model,
            'r2': r2,
            'rmse': rmse,
            'mae': mae,
            'cv_mean': cv_scores.mean(),
            'cv_std': cv_scores.std(),
            'predictions': y_pred,
            'actual': y_test
        }
        
        print(f"{name} - R²: {r2:.4f}, RMSE: {rmse:.2f}, MAE: {mae:.2f}")
        print(f"CV R² Score: {cv_scores.mean():.4f} (+/- {cv_scores.std() * 2:.4f})")
        print("-" * 50)
    
    # Select best model based on R² score
    best_model_name = max(results.keys(), key=lambda x: results[x]['r2'])
    best_model = results[best_model_name]['model']
    
    print(f"Best model: {best_model_name} with R² score: {results[best_model_name]['r2']:.4f}")
    
    return best_model, results, best_model_name

def save_model_artifacts(model, label_encoders, scaler, feature_columns, model_name):
    """Save all model artifacts"""
    print("Saving model artifacts...")
    
    # Save model
    joblib.dump(model, 'models/best_model.pkl')
    
    # Save encoders
    joblib.dump(label_encoders, 'models/label_encoders.pkl')
    
    # Save scaler
    joblib.dump(scaler, 'models/scaler.pkl')
    
    # Save feature columns
    joblib.dump(feature_columns, 'models/feature_columns.pkl')
    
    # Save model info
    model_info = {
        'model_name': model_name,
        'feature_columns': feature_columns,
        'training_date': pd.Timestamp.now().strftime('%Y-%m-%d %H:%M:%S')
    }
    joblib.dump(model_info, 'models/model_info.pkl')
    
    print("Model artifacts saved successfully!")

def create_visualizations(results):
    """Create model comparison visualizations"""
    print("Creating visualizations...")
    
    # Model comparison
    model_names = list(results.keys())
    r2_scores = [results[name]['r2'] for name in model_names]
    rmse_scores = [results[name]['rmse'] for name in model_names]
    
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 6))
    
    # R² Score comparison
    bars1 = ax1.bar(model_names, r2_scores, color=['skyblue', 'lightgreen', 'salmon'])
    ax1.set_title('Model Comparison - R² Score')
    ax1.set_ylabel('R² Score')
    ax1.set_ylim(0, 1)
    
    # Add value labels on bars
    for bar, score in zip(bars1, r2_scores):
        height = bar.get_height()
        ax1.text(bar.get_x() + bar.get_width()/2., height + 0.01,
                f'{score:.3f}', ha='center', va='bottom')
    
    # RMSE comparison
    bars2 = ax2.bar(model_names, rmse_scores, color=['skyblue', 'lightgreen', 'salmon'])
    ax2.set_title('Model Comparison - RMSE')
    ax2.set_ylabel('RMSE (INR)')
    
    # Add value labels on bars
    for bar, score in zip(bars2, rmse_scores):
        height = bar.get_height()
        ax2.text(bar.get_x() + bar.get_width()/2., height + 1000,
                f'{score:,.0f}', ha='center', va='bottom')
    
    plt.tight_layout()
    plt.savefig('models/model_comparison.png', dpi=300, bbox_inches='tight')
    plt.close()
    
    print("Visualizations saved!")

def main():
    """Main training pipeline"""
    print("=== Used Car Price Prediction Model Training ===")
    
    # Create directories
    import os
    os.makedirs('models', exist_ok=True)
    os.makedirs('data', exist_ok=True)
    
    # Create or load dataset
    print("Creating sample dataset...")
    df = create_sample_dataset()
    df.to_csv('data/used_cars_dataset.csv', index=False)
    print(f"Dataset created with {len(df)} records")
    
    # Preprocess data
    X, y, label_encoders, scaler, feature_columns = preprocess_data(df)
    
    # Train models
    best_model, results, best_model_name = train_models(X, y)
    
    # Save artifacts
    save_model_artifacts(best_model, label_encoders, scaler, feature_columns, best_model_name)
    
    # Create visualizations
    create_visualizations(results)
    
    print("=== Training Complete ===")
    print(f"Best model: {best_model_name}")
    print(f"Model saved to: models/best_model.pkl")

if __name__ == "__main__":
    main()
