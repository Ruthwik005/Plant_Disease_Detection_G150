import React, { useState, useCallback, useEffect } from 'react';
import { handleSuccess, handleError } from '../utils.js';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import axios from 'axios';
import './SignUp.css';

function SignUp() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();

  const loginWithGoogle = useCallback(() => {
    window.open("http://localhost:8080/auth/google", "_self");
  }, []);


  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = { username, email, password};

    if (username.trim() === '') {
      setUsernameError('Username is required');
      return;
    }
    setUsernameError('');

    try {
      const response = await axios.post(
        'http://localhost:8080/signup',
        formData, // Axios automatically handles JSON.stringify
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true, // Equivalent to fetch's 'credentials: include'
        }
      );

    
      const data = await response;
      const { success, message, error: responseError } = data;

      if (response.status === 201) {
        handleSuccess(response.status.message);
        setTimeout(() => {
          try {
            navigate('/login');
          } catch (error) {
            console.error('Navigation error:', error);
            window.location.href = '/login';
          }
        }, 1000);
      } else {
        setApiError(responseError || 'Registration failed');
      }
    } catch (error) {
      console.error('Error:', error);
      setApiError('An error occurred. Please try again later.');
    }
  };
 

  return (
    <div className="signup-page">
      <div className="signup-container">
        <h1 className="signup-heading">Sign Up</h1>
        {usernameError && <p className="error-text">{usernameError}</p>}
        {apiError && <p className="error-text">{apiError}</p>}
        
        <form className="s-form-container" onSubmit={handleSubmit}>
          <div className="s-form-group">
            <label htmlFor="username" className="labels">Username</label>
            <input
              type="text"
              id="username"
              className="input"
              placeholder="Enter your username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onBlur={() => {
                if (!username.trim()) setUsernameError('Username is required');
                else setUsernameError('');
              }}
            />
          </div>

          <div className="s-form-group">
            <label htmlFor="email" className="labels">Email</label>
            <input
              type="email"
              id="email"
              className="input"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="s-form-group">
            <label htmlFor="password" className="labels">Password</label>
            <input
              type="password"
              id="password"
              className="input"
              placeholder="Enter your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="signup-btn">Sign Up</button>

          <div className="social-container">
            <button type="button" className="s-social-btn" onClick={loginWithGoogle}>
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6WwgH7Nl5_AW9nDCnR2Ozb_AU3rkIbSJdAg&s" alt="Google" className="s-social-icon" />
              Google
            </button>
          </div>

          <div className="login-link">
            Already have an account? <Link to="/login">Log In</Link>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default SignUp;
