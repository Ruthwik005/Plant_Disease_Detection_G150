import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleError } from '../utils.js';

const useAuth = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const checkToken = () => {
            const token = localStorage.getItem("token");
            if (token) {
                const decodedToken = JSON.parse(atob(token.split('.')[1]));
                const exp = decodedToken.exp * 1000; // Convert to milliseconds
                if (Date.now() >= exp) {
                    handleError('Your session has expired. Please log in again.');
                    localStorage.removeItem("token");
                    localStorage.removeItem("loggedInUser");
                    navigate('/home');
                }
            }
        };

        const intervalId = setInterval(checkToken, 60000); // Check every minute
        return () => clearInterval(intervalId);
    }, [navigate]);
};

export default useAuth;
