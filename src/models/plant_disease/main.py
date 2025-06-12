import os
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image

# Path to the saved model
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'model')

def load_disease_model():
    """
    Load the trained plant disease classification model
    """
    try:
        model = load_model(MODEL_PATH)
        print("Model loaded successfully")
        return model
    except Exception as e:
        print(f"Error loading model: {e}")
        return None

def preprocess_image(img_path, target_size=(224, 224)):
    """
    Preprocess the input image for model prediction
    """
    img = image.load_img(img_path, target_size=target_size)
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = img_array / 255.0  # Normalize
    return img_array

def predict_disease(model, img_path):
    """
    Predict plant disease from image
    """
    if model is None:
        return {"error": "Model not loaded"}
    
    try:
        processed_img = preprocess_image(img_path)
        predictions = model.predict(processed_img)
        
        # TODO: Add class labels and interpret predictions
        # This is a placeholder - update with actual class labels
        class_labels = ["disease_1", "disease_2", "disease_3", "healthy"]
        
        predicted_class = np.argmax(predictions[0])
        confidence = float(predictions[0][predicted_class])
        
        return {
            "disease": class_labels[predicted_class],
            "confidence": confidence,
            "status": "success"
        }
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    # Example usage
    model = load_disease_model()
    if model:
        # Replace with actual image path for testing
        result = predict_disease(model, "test_image.jpg")
        print(result) 