import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Error() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const handleNavigate = () => {
    try {
      navigate('/');
    } catch (error) {
      window.location.href = '/';
    }
  };
  
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      textAlign: 'center',
    }}>
      <h1 style={{ color: 'red', fontSize: '3rem', marginBottom: '1rem' }}>404 Error</h1>
      <p>Page not found: {location?.pathname}</p>
      <button 
        className="btn btn-success"
        onClick={handleNavigate}
        style={{
          padding: '10px 20px',
          fontSize: '1.1rem',
          cursor: 'pointer',
          marginTop: '1rem',
        }}
      >
        Go Back Home
      </button>
    </div>
  );
}

export default Error;
