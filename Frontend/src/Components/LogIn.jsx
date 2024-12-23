import React, { useState, useEffect } from 'react';
import { handleSuccess, handleError } from '../utils.js';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import axios from 'axios';
import './LogIn.css';

function LogIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Google Login function
  const loginWithGoogle = () => {
    window.open("http://localhost:8080/auth/google", "_self");
  };
  

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = { email, password };

    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      console.log(data);
      const { success, message, token, username } = data;
      if (response.ok && success && token) {
        handleSuccess(message);
        localStorage.setItem("token", token);
        localStorage.setItem("LoggedInUser",  username );
        localStorage.setItem("IsLoggedIn", true);

        setTimeout(() => {
          window.location.reload()
          navigate('/'); // Redirect after successful login
        }, 1000);
      } else {
        setError(data.error || 'Invalid credentials');
      } 
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred. Please try again later.');
    }
  };
  useEffect(() => {
    // If the user is already logged in (for example after a Google login), redirect them to the home page.
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/'); // Or wherever you want to redirect users when already logged in
    }
  }, [navigate]);

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="login-heading">Log In</h1>
        {error && <p className="error-text" style={{ color: 'red' }}>{error}</p>}
        <form className="l-form-container" onSubmit={handleSubmit}>
          <div className="l-form-group">
            <label htmlFor="email" className="l-lables">Email</label>
            <input
              type="email"
              id="email"
              className="l-input"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="l-lables">Password</label>
            <input
              type="password"
              id="password"
              className="l-input"
              placeholder="Enter your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="remember-forgot-container">
            <Link to="/forgot-password" className="l-forgot">Forgot Password?</Link>
          </div>
          <button type="submit" className="l-log-in-btn ">Log In</button>
          <div className="l-social-container">
            <button type="button" className="l-social-btn" onClick={loginWithGoogle}>
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6WwgH7Nl5_AW9nDCnR2Ozb_AU3rkIbSJdAg&s" alt="Google" className="social-icon" />
              Google
            </button>
          </div>
          <div className="text-center">
            <Link to="/signup" className="l-link-button">Don't have an account? Sign up</Link>
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
}

export default LogIn;