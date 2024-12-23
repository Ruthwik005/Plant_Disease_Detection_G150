import React, { useEffect, useState } from "react";
import axios from 'axios';
import "./Profile.css";

function Profile() {
  const [diagnosisHistory, setDiagnosisHistory] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const username = localStorage.getItem("LoggedInUser"); // Retrieve username from localStorage
   // Retrieve token from localStorage

  const fetchHistory = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setErrorMessage('User not authenticated.');
      return;
    }

    try {
      const response = await axios.get('http://localhost:8080/diagnosis-history', {
        headers: { token: token }, 
      });
      

      if (response.data.success) {
        setDiagnosisHistory(response.data.history);
        setErrorMessage('');
      } else {
        setErrorMessage('Failed to fetch diagnosis history.');
      }
    } catch (error) {
      console.error('Error fetching history:', error);
      setErrorMessage('Error fetching history. Please try again.');
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="Profile">
      <div className="card">
        <div className="image"></div>
        <div className="card-info">
          <span>{username}</span>
        </div>
      </div>

      <div className="info">
        <div className="info-card" style={{height:'80vh',overflow:'scroll'}}>
          <h2>Upload History</h2>
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          {diagnosisHistory.length > 0 ? (
            diagnosisHistory.map((historyItem, index) => (
              <div key={index} className="history-item">
                <h3>Disease: {historyItem.diseaseName}</h3>
                <img 
                  src={historyItem.imageUrl} 
                  alt={historyItem.diseaseName} 
                  className="history-image" 
                  style={{height:'50px',width:'50px'}}
                />
                <p>{historyItem.diseaseName} </p>
                <p className="one-line-description">{historyItem.blipDescription} </p>
                <p>Diagnosis Date: {new Date(historyItem.createdAt).toLocaleDateString()}</p>
              </div>
            ))
          ) : (
            <p>No diagnosis history found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
