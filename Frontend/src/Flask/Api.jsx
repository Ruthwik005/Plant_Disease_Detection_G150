import React, { useState } from 'react';
import axios from 'axios';
import './Api.css';

function Api() {
    const [file, setFile] = useState(null);
    const [result, setResult] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [blipDescription, setBlipDescription] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setImagePreview(URL.createObjectURL(selectedFile));
            setError(null);
            setResult({});
            setBlipDescription('');
            setErrorMessage('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!file) {
            setError('Please select a file first');
            setErrorMessage('Please select an image file before uploading.');
            return;
        }
    
        setLoading(true);
        setError(null);
        setBlipDescription('');
    
        try {
            // Step 1: Upload image to Cloudinary
            const cloudinaryFormData = new FormData();
            cloudinaryFormData.append('image', file);
    
            const uploadResponse = await axios.post('http://localhost:8080/upload-to-cloudinary', cloudinaryFormData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            const { url: imageUrl } = uploadResponse.data;
            console.log(imageUrl);
            // Step 2: Send image to Flask for prediction (use a fresh FormData object)
            const flaskFormData = new FormData();
            flaskFormData.append('image', file);
            console.log(2);
            const predictionResponse = await axios.post('http://127.0.0.1:5000/api/predict', flaskFormData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                // timeout: 60000,
            });
    
            const predictionData = predictionResponse.data;
            console.log(4);
            // Step 3: Prepare data for MongoDB storage
            const token = localStorage.getItem('token');
            const diagnosisData = {
                imageUrl, // Cloudinary URL
                diseaseName: predictionData.disease_name || null,
                blipDescription: predictionData.description || null, 
                isLeafImage: !predictionData.error,
                token: token || null, 
            };
            console.log(5);
            // Step 4: Save data to MongoDB
            if (token) {
                await axios.post('http://localhost:8080/upload-and-diagnose', diagnosisData);
            }
    
            // Update UI based on prediction result
            if (!predictionData.error) {
                setResult({
                    ...predictionData,
                    image_url: imageUrl,
                });
                setErrorMessage('');
            } else {
                setBlipDescription(predictionData.description || 'No description available');
                setResult({});
            }
            console.log(6);
        } catch (error) {
            console.error('Error processing image:', error);
    
            if (error.response?.status === 400) {
                setBlipDescription(error.response.data.description || 'Invalid image.');
                setError(error.response.data.error || 'Invalid image.');
            } else if (error.response?.data?.error) {
                setErrorMessage(error.response.data.error);
                setError(error.response.data.error || 'Server error occurred. Please try again later.');
            } else if (error.request) {
                setError('No response from server. Please try again later.');
            } else {
                setError('Error uploading image. Please try again later.');
            }
            setResult(null);
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <div className="main">
            <h1 className="main-heading">Plant Disease Detector</h1>

            <form onSubmit={handleSubmit} className="form" style={{padding:'30px',height:'auto'}}>
                <input type="file" className="choose" onChange={handleFileChange} /><br />
                <br />
                <button type="submit" className="upload" disabled={loading}>Upload</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>

            {/* Display BLIP description for non-leaf images */}
            {blipDescription && (
                <div className="blip-description">
                    <img src={imagePreview} alt="Uploaded" className="preview-img" />
                    <p>{blipDescription}</p>
                </div>
            )}

            {/* Display prediction results for leaf images */}
            {result && Object.keys(result).length > 0 && (
                <div className="container result">
                    <h2 className="prediction-result">Prediction Result</h2>
                    <img src={imagePreview} alt="Uploaded" className="preview-img" />
                    <ul>
                        {Object.entries(result).map(([key, value]) => (
                            <li key={key}>
                                <strong>{key}:</strong>{' '}
                                {typeof value === 'string' ? (
                                    value
                                ) : (
                                    <pre>{JSON.stringify(value, null, 2)}</pre>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {loading && <p>Loading...</p>}
        </div>
    );
}

export default Api;
