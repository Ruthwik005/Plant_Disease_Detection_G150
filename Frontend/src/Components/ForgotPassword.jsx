import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ForgotPassword.css';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const response = await axios.post('http://localhost:8080/forgot-password', 
                { email },
                { withCredentials: true }
            );

            if (response.data) {
                setMessage(response.data.message || 'An email has been sent with OTP.');
                // Navigate immediately but let the message show
                navigate('/otpverification', { 
                    state: { email },
                    replace: true 
                });
            } else {
                setError('Failed to send OTP');
            }
        } catch (err) {
            console.error('Error during password reset:', err);
            setError(err.response?.data?.message || 'An error occurred. Please try again.');
        }
    }, [email, navigate]);

    return (
        <div className="forgot-password-container">
            <div className="forgot-password-box">
                <h2>Forgot Password</h2>
                <p className="info-text">Enter your email address to receive a password reset OTP.</p>

                <form onSubmit={handleSubmit} className="forgot-password-form">
                    <div className="form-group">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="email-input"
                            required
                        />
                    </div>

                    <button type="submit" className="submit-button">
                        Send OTP
                    </button>
                </form>

                {message && <p className="success-message">{message}</p>}
                {error && <p className="error-message">{error}</p>}
            </div>
        </div>
    );
}

export default ForgotPassword;
