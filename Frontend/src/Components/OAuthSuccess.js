import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleSuccess, handleError } from '../utils.js';

function OAuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const storeOAuthData = () => {
      const params = new URLSearchParams(window.location.search);
      const status = params.get('status');
      const token = params.get('token');
      const username = params.get('username');

      if (status == 'success') {
        try {
          // Store the JWT token and user details in localStorage
          localStorage.setItem('token', token);
          localStorage.setItem('LoggedInUser',  username);
          localStorage.setItem('IsLoggedIn', 'true');

          // Clear URL query parameters
          const cleanUrl = window.location.origin;
          window.history.replaceState(null, null, cleanUrl);

          // Notify and redirect
          handleSuccess('Google login successful!');
          navigate('/'); // Redirect to home or dashboard
        } catch (error) {
          console.error('Error storing OAuth data:', error);
          handleError('Failed to complete Google login. Try again.');
        }
      } else {
        handleError('Invalid Google login response.');
        navigate('/login'); // Redirect back to login
      }
    };

    storeOAuthData();
  }, [navigate]);

  return (
    <div>
      <p>Processing your login...</p>
    </div>
  );
}

export default OAuthSuccess;
