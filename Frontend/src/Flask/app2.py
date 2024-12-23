import os
import json
from flask import Flask, request, jsonify
from PIL import Image, UnidentifiedImageError
import torchvision.transforms.functional as TF
import CNN
import numpy as np
import torch
from flask_cors import CORS
from transformers import BlipProcessor, BlipForConditionalGeneration

# Initialize Flask app and enable CORS
app = Flask(__name__, static_folder='static')
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"
# Ensure the uploads folder exists
os.makedirs('static/uploads', exist_ok=True)

# Load disease and supplement info from JSON file
with open('./Frontend/src/Flask/info.json', 'r') as file:
    disease_data = json.load(file)

# Load the trained CNN model
model = CNN.CNN(39)
model.load_state_dict(torch.load("./Frontend/src/Flask/plant_disease_model_1_latest.pt", weights_only=True))
model.eval()

blipp_model_path = r"C:/Users/chama/OneDrive/Desktop/PDDD/Frontend/src/Flask/blip-image-captioning-base"
# Load BLIP model and processor
blip_processor = BlipProcessor.from_pretrained(blipp_model_path)
blip_model = BlipForConditionalGeneration.from_pretrained(blipp_model_path)

def validate_leaf_image(image_path):
    """Validate if the image is a leaf using BLIP."""
    try:
        image = Image.open(image_path).convert('RGB')
        inputs = blip_processor(image, return_tensors="pt")
        
        # Ensure the inputs are on the same device as the model
        device = "cuda" if torch.cuda.is_available() else "cpu"
        blip_model.to(device)
        inputs = {key: value.to(device) for key, value in inputs.items()}

        output = blip_model.generate(**inputs)
        caption = blip_processor.decode(output[0], skip_special_tokens=True)

        # Check if the caption contains indications of a leaf image
        keywords = ["leaf", "leaves", "plant", "foliage"]
        if any(keyword in caption.lower() for keyword in keywords):
            return True, caption
        return False, caption
    except Exception as e:
        # Log error details for debugging
        return False, f"Validation error: {str(e)}"


def prediction(image_path):
    """Process the uploaded image and predict the disease."""
    try:
        image = Image.open(image_path)
        image = image.resize((224, 224))  # Resize the image for the model
        input_data = TF.to_tensor(image)  # Convert image to tensor
        input_data = input_data.view((-1, 3, 224, 224))  # Reshape for model input
        output = model(input_data)  # Get model output
        output = output.detach().numpy()  # Convert output to NumPy
        index = np.argmax(output)  # Get the predicted class index
        return index
    except Exception as e:
        raise ValueError(f"Prediction failed: {str(e)}")

@app.route('/api/predict', methods=['POST'])
def predict():
    """Handle image upload and prediction."""
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400

    # Save the uploaded image
    image = request.files['image']
    filename = image.filename

    # Validate file extension
    allowed_extensions = {'jpg', 'jpeg', 'png'}
    extension = filename.rsplit('.', 1)[-1].lower()
    if extension not in allowed_extensions:
        return jsonify({'error': f"Unsupported image format. Allowed formats: {', '.join(allowed_extensions)}"}), 400

    file_path = os.path.join('static/uploads', filename)
    try:
        image.save(file_path)
        # Verify if the file is an actual image
        Image.open(file_path).verify()
    except (UnidentifiedImageError, IOError):
        return jsonify({'error': 'Invalid image file provided'}), 400

    # Validate the image with BLIP
    is_leaf, caption = validate_leaf_image(file_path)
    if not is_leaf: # Remove non-leaf images
        return jsonify({'error': 'Invalid image. Not a leaf.', 'description': caption}), 200

    # Perform prediction
    try:
        pred = prediction(file_path)
    except ValueError as e:
        return jsonify({'error': str(e)}), 500

    # Fetch prediction details from the JSON data
    try:
        pred_str = str(pred)
        if pred_str in disease_data:
            prediction_details = disease_data[pred_str]

            # Dynamically construct the response, excluding empty fields
            response = {key: value for key, value in prediction_details.items() if value}

            return jsonify(response), 200
        else:
            return jsonify({'error': 'Prediction index not found in data'}), 404
    except Exception as e:
        return jsonify({'error': f"Error fetching prediction details: {str(e)}"}), 500

if __name__ == '__main__':
    # Run the Flask app with appropriate host and port
    app.run(debug=True, host='0.0.0.0', port=5000)
