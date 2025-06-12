/**
 * Model loader for plant disease classification using TensorFlow.js
 */
import * as tf from '@tensorflow/tfjs';

// Original class names from the model
const ORIGINAL_CLASS_NAMES = [
  "Corn leaf blight",
  "Tomato Septoria leaf spot",
  "Squash Powdery mildew leaf",
  "Raspberry leaf",
  "Blueberry leaf",
  "Corn rust leaf",
  "Potato leaf early blight",
  "Peach leaf",
  "Tomato leaf late blight",
  "Tomato leaf bacterial spot",
  "Potato leaf late blight",
  "Strawberry leaf",
  "Apple Scab Leaf",
  "Apple leaf",
  "Tomato mold leaf",
  "Apple rust leaf",
  "Tomato Early blight leaf",
  "Tomato leaf yellow virus",
  "Bell_pepper leaf spot",
  "grape leaf",
  "Corn Gray leaf spot",
  "Soyabean leaf",
  "grape leaf black rot",
  "Tomato leaf",
  "Bell_pepper leaf",
  "Cherry leaf",
  "Tomato leaf mosaic virus",
  "Tomato two spotted spider mites leaf"
];

// Mapped class names (simplified and grouped)
const CLASS_NAMES = [
  "Blight", // Corn leaf blight
  "Leaf Spot", // Tomato Septoria leaf spot
  "Powdery Mildew", // Squash Powdery mildew leaf
  "Healthy", // Raspberry leaf
  "Healthy", // Blueberry leaf
  "Rust", // Corn rust leaf
  "Blight", // Potato leaf early blight
  "Healthy", // Peach leaf
  "Blight", // Tomato leaf late blight
  "Bacterial Spot", // Tomato leaf bacterial spot
  "Blight", // Potato leaf late blight
  "Healthy", // Strawberry leaf
  "Scab", // Apple Scab Leaf
  "Healthy", // Apple leaf
  "Mold", // Tomato mold leaf
  "Rust", // Apple rust leaf
  "Blight", // Tomato Early blight leaf
  "Yellow Virus", // Tomato leaf yellow virus
  "Leaf Spot", // Bell_pepper leaf spot
  "Healthy", // grape leaf
  "Leaf Spot", // Corn Gray leaf spot
  "Healthy", // Soyabean leaf
  "Black Rot", // grape leaf black rot
  "Healthy", // Tomato leaf
  "Healthy", // Bell_pepper leaf
  "Healthy", // Cherry leaf
  "Mosaic Virus", // Tomato leaf mosaic virus
  "Spider Mites" // Tomato two spotted spider mites leaf
];

// Mapping from original class index to mapped class
const CLASS_MAPPING = {};
ORIGINAL_CLASS_NAMES.forEach((name, index) => {
  CLASS_MAPPING[index] = CLASS_NAMES[index];
});

class PlantDiseaseModel {
  constructor() {
    this.model = null;
    this.isModelLoaded = false;
    this.modelPath = 'models/plant_disease/model/model.json';
  }

  /**
   * Check if model files exist
   * @returns {Promise<boolean>} - Whether the model exists
   */
  async checkModelExists() {
    try {
      // Try to fetch the model.json file to check if it exists
      const response = await fetch(this.modelPath, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      console.error('Error checking model existence:', error);
      return false;
    }
  }

  /**
   * Load the TensorFlow.js model
   * @param {string} modelPath - Path to the model.json file
   */
  async loadModel(modelPath = 'models/plant_disease/model/model.json') {
    try {
      this.modelPath = modelPath;
            
      // Check if model exists first
      const modelExists = await this.checkModelExists();
      
      if (!modelExists) {
        console.error('Model file not found at path:', modelPath);
        // Try with absolute path from root
        const absolutePath = '/' + modelPath;
        try {
          const absoluteCheck = await fetch(absolutePath, { method: 'HEAD' });
          if (absoluteCheck.ok) {
            this.modelPath = absolutePath;
          } else {
            return false;
          }
        } catch (e) {
          console.error('Failed with absolute path too:', e);
          return false;
        }
      }
      
      this.model = await tf.loadLayersModel(this.modelPath);
      this.isModelLoaded = true;
      return true;
    } catch (error) {
      console.error('Error loading plant disease model:', error);
      console.error('Error details:', error.message);
      return false;
    }
  }

  /**
   * Preprocess the image for the model
   * @param {HTMLImageElement} image - The image element to process
   * @returns {tf.Tensor} - Processed tensor ready for prediction
   */
  preprocessImage(image) {
    return tf.tidy(() => {
      // Convert the image to a tensor
      const imageTensor = tf.browser.fromPixels(image)
        .resizeNearestNeighbor([224, 224]) // Resize to model input size
        .toFloat()
        .div(tf.scalar(255.0))  // Normalize to [0,1]
        .expandDims();          // Add batch dimension
      
      return imageTensor;
    });
  }

  /**
   * Make a prediction on an image
   * @param {HTMLImageElement} image - The image to classify
   * @returns {Object} - Prediction result with class name and confidence
   */
  async predict(image) {
    if (!this.isModelLoaded) {
      throw new Error('Model not loaded yet. Call loadModel() first.');
    }

    return tf.tidy(() => {
      // Preprocess the image
      const processedImg = this.preprocessImage(image);
      
      // Run the inference
      const predictions = this.model.predict(processedImg);
      
      // Get the index with highest probability
      const predictionArray = predictions.dataSync();
      const topPredictionIndex = predictionArray.indexOf(Math.max(...predictionArray));
      
      // Get the mapped class name
      const mappedClassName = CLASS_MAPPING[topPredictionIndex];
      const originalClassName = ORIGINAL_CLASS_NAMES[topPredictionIndex];
      
      // Group predictions by mapped class
      const groupedPredictions = {};
      
      // Initialize with 0
      [...new Set(CLASS_NAMES)].forEach(className => {
        groupedPredictions[className] = 0;
      });
      
      // Sum probabilities for each mapped class
      predictionArray.forEach((confidence, index) => {
        const mappedClass = CLASS_MAPPING[index];
        groupedPredictions[mappedClass] += confidence;
      });
      
      // Convert to array and sort
      const groupedPredictionsArray = Object.entries(groupedPredictions)
        .map(([className, confidence]) => ({ className, confidence }))
        .sort((a, b) => b.confidence - a.confidence);
      
      return {
        className: mappedClassName,
        originalClassName: originalClassName,
        confidence: predictionArray[topPredictionIndex],
        allPredictions: Array.from(predictionArray).map((confidence, index) => ({
          className: CLASS_MAPPING[index],
          originalClassName: ORIGINAL_CLASS_NAMES[index],
          confidence
        })).sort((a, b) => b.confidence - a.confidence),
        groupedPredictions: groupedPredictionsArray
      };
    });
  }
}

// Export singleton instance
const plantDiseaseModel = new PlantDiseaseModel();
export default plantDiseaseModel; 