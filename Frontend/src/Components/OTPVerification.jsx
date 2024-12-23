// OTPVerification.jsx
import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import './OtpVerification.css';

function OTPVerification() {
  const location = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (!location.state?.email) {
      navigate('/forgot-password', { replace: true });
    } else {
      setEmail(location.state.email);
    }
  }, [location.state, navigate]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!email) return;

    setMessage('');
    setError('');

    try {
      const response = await axios.post('http://localhost:8080/verify-otp', 
        { email, otp: otp.trim() },
        { withCredentials: true }
      );

      if (response.data && !response.data.error) {
        setMessage('OTP verified successfully');
        navigate('/reset-password', { 
          state: { email },
          replace: true 
        });
      } else {
        setError(response.data.message || 'Invalid OTP');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setError(error.response?.data?.message || 'Failed to verify OTP. Please try again.');
    }
  }, [email, otp, navigate]);

  const handleOTPChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setOtp(value);
  };

  if (!email) {
    return null;
  }

  return (
    <div className="otp-verification-container">
      <div className="otp-verification-box">
        <h2>OTP Verification</h2>
        <p className="info-text">Please enter the OTP sent to your email: {email}</p>
        
        <form onSubmit={handleSubmit} className="otp-form">
          <div className="form-group">
            <input
              type="text"
              value={otp}
              onChange={handleOTPChange}
              placeholder="Enter OTP"
              className="otp-input"
              required
              maxLength="6"
              pattern="[0-9]*"
              inputMode="numeric"
            />
          </div>
          
          <button type="submit" className="verify-button">
            Verify OTP
          </button>
        </form>

        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}

export default OTPVerification;
