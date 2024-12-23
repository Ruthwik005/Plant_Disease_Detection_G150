import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import './UploadAndDiagnosis.css'; // Import your CSS file for styling

function UploadAndDiagnosis() {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    try {
      navigate('/upload-and-diagnosis');
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback to window.location if navigation fails
    }
  

  return (
    <div>
      <div className="container1">
        <span className="protect">Protect Your Crop</span>
        <div id="up">Upload and Diagnose</div>
        <div className="upl">
          Upload plant images to diagnose diseases and safeguard your crops using our advanced CNN model.
        </div>
      </div>

      <div className="container2">
        <div className="img">
          <img
            className="imgs"
            src="https://cdn.wegic.ai/assets/onepage/ai/image/1dc4cd5e-92a3-435e-8acf-4df500346f62.jpeg"
            alt=""
          />
        </div>
        <div className="txt">
          <div className="how">How It Works</div>
          <div id="list">
            <div className="in">
              <span>01.</span> Capture clear images of the plant showing symptoms.
              <hr />
            </div>
            <div className="in">
              <span>02.</span> Upload the images to our diagnostic tool.
              <hr />
            </div>
            <div className="in">
              <span>03.</span> Receive accurate diagnosis and treatment suggestions.
            </div>
          </div>
        </div>
      </div>

      <div className="container3">
        <div className="why">
          <div className="b">Benefits of Our Diagnostic Tool</div>
          <div className="w">Why Use Agro Shield?</div>
          <div className="o">
            Our tool leverages cutting-edge technology to provide quick and accurate plant disease diagnoses.
          </div>
        </div>
      </div>

      <div className="con">
        <div className="features-container">
          <div className="feature">
            <div className="icon">🌿</div>
            <h3>High Accuracy</h3>
            <p>Utilizes a CNN model to ensure precise disease identification.</p>
          </div>
          <div className="feature">
            <div className="icon">👤</div>
            <h3>User-Friendly</h3>
            <p>Simple and intuitive interface for easy image uploads.</p>
          </div>
          <div className="feature">
            <div className="icon">📚</div>
            <h3>Comprehensive Database</h3>
            <p>Access detailed information on a wide range of plant diseases.</p>
          </div>
          <div className="feature">
            <div className="icon">💊</div>
            <h3>Expert Recommendations</h3>
            <p>Receive tailored treatment suggestions to mitigate disease impact.</p>
          </div>
        </div>
      </div>

      <div className="container4">
        <div className="i">
          <img
            src="https://cdn.wegic.ai/assets/onepage/ai/image/eb0800a8-8095-4542-90b1-9f21294d966b.jpeg"
            alt=""
          />
        </div>
        <div className="txts">
          <div className="q">Quick and Accurate Diagnoses</div>
          <div className="r">Ready to Protect Your Crops?</div>
          <div className="up">Upload your plant images now and get a quick diagnosis to prevent disease spread.</div>
          <button className="btn" onClick={handleButtonClick}>
            <div className="btn1">Upload Image</div>
          </button>
        </div>
      </div>
    </div>

      
  );
}}

export default UploadAndDiagnosis;
