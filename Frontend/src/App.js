import { useState, useEffect, createContext } from 'react';
import SignUp from './Components/SignUp.jsx';
import LogIn from './Components/LogIn.jsx';
import Error from './Components/Error.jsx';
import Home from './Components/Home.jsx';
import Profile from './Components/Profile.jsx';
import OTPVerification from './Components/OTPVerification.jsx';
import UploadAndDiagnosis from './Components/UploadAndDiagnosis.jsx';
import ForgotPassword from './Components/ForgotPassword.jsx';
import ResetPassword from './Components/ResetPassword.jsx';
import useAuth from './hooks/useAuth.js';
import Api from './Flask/Api.jsx';
import OAuthSuccess from './Components/OAuthSuccess.js';
import { Navigate, Routes, Route, useLocation } from 'react-router-dom';
import axios from 'axios';

export const IsLoggedInContext = createContext();
export const SetIsLoggedInContext = createContext();

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8080/api/check-auth', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setIsLoggedIn(response.data.IsloggedIn);
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, [location.pathname]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <IsLoggedInContext.Provider value={isLoggedIn}>
      <SetIsLoggedInContext.Provider value={setIsLoggedIn}>
        {/* <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={isLoggedIn ? <Home /> : <Navigate to="/signup" state={{ from: location }} replace/>} />
          <Route path="/login" element={isLoggedIn ? <Home /> : <Navigate to="/login" state={{ from: location }} replace/>} />
          <Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/login" state={{ from: location }} replace />} />
          <Route path="/otpverification" element={isLoggedIn ? <Home /> : <Navigate to="/otpverification" state={{ from: location }} replace/>} />
          <Route path="/oauth" element={<OAuthSuccess />} />
          <Route path = "/upload-and-diagnosis" element={<Api />} />
          <Route path="/forgot-password" element={isLoggedIn ? <Home /> : <Navigate to="/forgot-password" state={{ from: location }} replace/>} />
          <Route path="/reset-password" element={isLoggedIn ? <Home /> : <Navigate to="/reset-password" state={{ from: location }} replace/>} />
          <Route path="*" element={<Error />} />
        </Routes> */}
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/signup" element={isLoggedIn ? <Navigate to="/" replace /> : <SignUp />} />
          <Route path="/login" element={isLoggedIn ? <Navigate to="/" replace /> : <LogIn />} />
          
          <Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/login" replace />} />
          <Route path="/otpverification" element={isLoggedIn ? <Home /> : <Navigate to="/otpverification" replace />} />
          <Route path="/oauth" element={<OAuthSuccess />} />
          <Route path="/upload-and-diagnosis" element={<Api/>}/>
          <Route path="/forgot-password" element={isLoggedIn ? <Navigate to="/" replace /> : <ForgotPassword />} />
          <Route path="/reset-password" element={isLoggedIn ? <Navigate to="/" replace /> : <ResetPassword />} />
          <Route path="*" element={<Error />} />
        </Routes>

      </SetIsLoggedInContext.Provider>  
    </IsLoggedInContext.Provider>
  );
}

export default App;
