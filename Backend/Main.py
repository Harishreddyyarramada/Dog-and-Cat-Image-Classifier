from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.vgg16 import preprocess_input
import numpy as np
import os

app = Flask(__name__)
CORS(app)

# Load the trained model
model = load_model('model.h5')

# Upload folder
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Image preprocessing
def preprocess(img_path):
    img = image.load_img(img_path, target_size=(224, 224))  # for VGG16
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = preprocess_input(img_array)
    return img_array

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    img_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(img_path)

    try:
        processed_img = preprocess(img_path)
        prediction = model.predict(processed_img)
        print(prediction)
        label = "Dog 🐶" if prediction[0][0] > 0.5 else "Cat 🐱"
        confidence = float(prediction[0][0])
        return jsonify({
            'prediction_label': label,
            'prediction_score': confidence
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)
