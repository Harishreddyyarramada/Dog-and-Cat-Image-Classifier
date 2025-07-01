import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css';

function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
  };

  const handleSubmit = async () => {
    if (!image) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', image); // must match Flask key

    try {
      const res = await axios.post('http://localhost:5000/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setResult(res.data);
      console.log(res.data);
    } catch (err) {
      alert("Error uploading image.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold">🐶🐱 Image Classifier</h1>
        <p className="lead text-muted">Upload an image to classify it as a <strong>Cat</strong> or <strong>Dog</strong>.</p>
      </div>

      <div className="card shadow-lg p-4">
        <div className="mb-3">
          <label className="form-label">Select an Image</label>
          <input type="file" className="form-control" onChange={handleImageChange} accept="image/*" />
        </div>

        {preview && (
          <div className="text-center my-3">
            <img src={preview} alt="Preview" className="img-thumbnail" style={{ maxHeight: '300px' }} />
          </div>
        )}

        <div className="d-grid gap-2">
          <button
            className="btn btn-primary btn-lg"
            onClick={handleSubmit}
            disabled={loading || !image}
          >
            {loading ? "Classifying..." : "Upload & Classify"}
          </button>
        </div>

        {result && (
          <div className="alert alert-success mt-4 text-center fs-5 fw-bold">
            Prediction: {result.prediction_label}<br />
            Confidence: {(result.prediction_score * 100).toFixed(2)}%
          </div>
        )}
      </div>

      <footer className="text-center mt-5 text-muted">
        Built with ❤️ using React, Flask & TensorFlow
      </footer>
    </div>
  );
}

export default App;
