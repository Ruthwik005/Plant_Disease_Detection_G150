import React, { useEffect, useState, useCallback } from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function MyNavbar() {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  const getUser = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setUserData(null);
        return;
      }

      const response = await axios.get('http://localhost:8080/login/success', {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success && response.data.user) {
        setUserData(response.data.user.username);
        // localStorage.setItem('loggedInUser', response.data.user.username);
        // localStorage.setItem('IsloggedIn', 'true');
      } else {
        setUserData(null);
      }
    } catch (error) {
      console.log('User not logged in:', error);
      setUserData(null);
      // localStorage.removeItem('loggedInUser');
      // localStorage.removeItem('IsloggedIn');
    }
  }, []);

  useEffect(() => {
    getUser();
  }, [getUser]);

  const handleLogout = useCallback(async () => {
    try {
      await axios.get('http://localhost:8080/logout', { withCredentials: true });
      setUserData(null);
      localStorage.removeItem('LoggedInUser');
      localStorage.clear();
      try {
        navigate('/login');
      } catch (error) {
        console.error('Navigation error:', error);
        window.location.href = '/';
      }
    } catch (error) {
      console.log('Error logging out:', error);
    }
  }, [navigate]);

  const handleNavigation = useCallback((path) => {
    try {
      navigate(path);
    } catch (error) {
      console.error('Navigation error:', error);
      window.location.href = path;
    }
  }, [navigate]);

  return (
    <Navbar bg="light" expand="lg" className="mb-3">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand>Agro Shield</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {userData ? (
              <>
                <Nav.Link onClick={() => handleNavigation('/profile')}>Profile</Nav.Link>
                <Nav.Link onClick={() => handleNavigation('/uploadanddiagnosis')}>Upload & Diagnosis</Nav.Link>
                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link onClick={() => handleNavigation('/login')}>Login</Nav.Link>
                <Nav.Link onClick={() => handleNavigation('/signup')}>Sign Up</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MyNavbar;
