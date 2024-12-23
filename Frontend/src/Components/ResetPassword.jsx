import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import './ResetPassword.css';

function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setMessage('');
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/reset-password',
        {
          email,
          newPassword
        },
        { withCredentials: true }
      );

      if (response.data && !response.data.error) {
        setMessage('Password reset successful!');
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 2000);
      } else {
        setError(response.data.message || 'Failed to reset password');
      }
    } catch (err) {
      console.error('Error resetting password:', err);
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    }
  };

  if (!email) {
    return null;
  }

  return (
    <div className="reset-password-container">
      <div className="reset-password-box">
        <h2>Reset Password</h2>
        <p className="info-text">Enter a new password for your account</p>

        <form onSubmit={handleSubmit} className="reset-password-form">
          <div className="form-group">
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
              className="password-input"
              required
              minLength="6"
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              className="password-input"
              required
              minLength="6"
            />
          </div>

          <button type="submit" className="reset-button">
            Reset Password
          </button>
        </form>

        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}

export default ResetPassword;
