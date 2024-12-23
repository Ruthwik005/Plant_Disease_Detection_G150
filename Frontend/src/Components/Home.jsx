import './Home.css';
import SignUp from './SignUp.jsx';
import LogIn from './LogIn.jsx';
import MyNavbar from './Navbar';
import { useCallback,useState ,useEffect} from 'react';
import { Routes, Route, useNavigate ,Link} from 'react-router-dom';
import { NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import ContactForm from './ContactForm.jsx';
import axios from 'axios';
import Button from './Button.jsx';
function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
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

      if (response.data.success) {
        setUserData(response.data.username);
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
   

    <div>
      <header>
        <nav className="h-navbar">
          <a href="/" className="h-logo">
            <span className="material-symbols-outlined">eco</span>Groot<span>.</span>
          </a>
          <ul className={`h-menu-links ${menuOpen ? "active" : ""}`}>
            <span
              id="close-menu-btn"
              className="material-symbols-outlined"
              onClick={() => setMenuOpen(false)}
            >
              close
            </span>
            {[
              { text: "Home", id: "home-section" },
              { text: "About Us", id: "about-us-container" },
              { text: "Tutorials", id: "how" },
              { text: "Testimonials", id: "testimonial-container" },
              { text: "Contact Us", id: "contact-container" },
            ].map(({ text, id }, index) => (
              <li key={index}>
                <Link to={`#${id}`} onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}>
                  {text}
                </Link>
              </li>
            ))}
            <li>
              {/* <a href="/Signup" className="signup">
                SignUp
              </a> */}
              {userData ? (
              <nav className="nav">
                <span className="username" style={{fontSize:'20px'}}>{userData}</span>
                <LinkContainer to="/profile">
                  <a className="nav-link">Profile</a>
                </LinkContainer>
                <a className="nav-link text-danger" onClick={handleLogout}>
                  Logout
                </a>
              </nav>
            ) : (
              <Link to="/signup" className="nav-link">Sign Up</Link>
            )}
            </li>
          </ul>
          <span
            id="menu-btn"
            className="material-symbols-outlined"
            onClick={() => setMenuOpen(true)}
          >
            menu
          </span>
        </nav>
      </header>


      <section id = "home-section" className="h-hero-section">
        <div className="h-content">
          <h1>"Preserve Nature, Boost Productivity"</h1>
          <p>
            Combining AI and agriculture to deliver sustainable, efficient
            disease detection for healthier yields.
          </p>
          <Button />
        </div>
        <div className="h-image-content large-screen-only">
          <div className="h-image-container">
            <img
              src="https://res.cloudinary.com/dgsr46f8t/image/upload/v1732371915/Remove_background_project_wazekw.png"
              alt="Background"
              className="h-background-image"
            />
            <img
              src="https://res.cloudinary.com/dgsr46f8t/image/upload/v1732377277/file_1_wyzjpu.png"
              alt="Overlay"
              className="h-overlay-image"
            />
          </div>
        </div>
      </section>

      <section id = "about-us-container" className="about-us-container">
        <h1>About Us</h1>
        <p>
          At <strong>Groot</strong>, we are committed to revolutionizing
          agriculture through the power of technology. Our platform harnesses
          cutting-edge artificial intelligence to detect plant diseases instantly
          from simple images. Join us in transforming the way we care for plants,
          one leaf at a time.
        </p>
        <div className="mission-points">
          <div className="points-container">
            {[
              "🌱 Preserve Nature: Helping plants thrive by identifying issues early.",
              "🤝 Support Farmers and Gardeners: Providing accessible, accurate insights.",
              "💡 Boost Productivity: Minimizing losses and maximizing yields.",
            ].map((point, idx) => (
              <div className="mission-point" key={idx}>{point}</div>
            ))}
          </div>
          <img
            src="https://res.cloudinary.com/dgsr46f8t/image/upload/v1732435581/-pwC5LXyQJ2KLxAR2wcCA_ml46fg.jpg"
            alt="Mission"
            className="mission-image"
          />
        </div>
      </section>

      <section id = "how" className="how">
        <h1 className="h1">How it works?</h1>
        <div className="tut-content">
          <video controls>
            <source
              src="https://res.cloudinary.com/dgsr46f8t/video/upload/v1732387114/WhatsApp_Video_2024-11-24_at_00.01.32_8136a6c4_nkzwa0.mp4"
              type="video/mp4"
            />
          </video>
        </div>
      </section>
      <hr/>
      <section id = "testimonial-container" className="testimonial-container">
        <h1>Our users say</h1>
        <div className="testimonial">
          <img
            src="https://res.cloudinary.com/dgsr46f8t/image/upload/v1732430218/IzBd-cyFv13ryq8vRpNV__hblqlp.jpg"
            alt="Testimonial"
            className="test-image"
          />
          <p className="test-para">
            "Groot has been a game-changer for my plant care routine. I’ve seen
            noticeable improvements in my plant health just by following the
            suggested actions. Highly recommended!" -<strong> Sarah T.</strong>
          </p>
        </div>
      </section>
      <hr/>
     <ContactForm/>
      <div className="f-container">
      <h1>Frequently Asked Questions</h1>

      <details>
         <summary>How does this website diagnose plant diseases?</summary>
         <div>
            <p>The website uses a Convolutional Neural Network (CNN)-based model trained on leaf images to identify potential plant diseases. By uploading a clear image of the affected leaf, our model can analyze and provide a diagnosis, helping you understand the possible disease and suggesting treatments.</p>
         </div>
      </details>

      <details>
         <summary>What kind of images do I need to upload for accurate diagnosis?</summary>
         <div>
            <p>For best results, please upload a clear, high-resolution image of a single leaf showing visible signs of the disease. Make sure the leaf is well-lit and in focus. Avoid multiple leaves in the same image, as this can reduce accuracy.</p>
         </div>
      </details>
      <details>
         <summary>What kind of images do I need to upload for accurate diagnosis?</summary>
         <div>
            <p>For best results, please upload a clear, high-resolution image of a single leaf showing visible signs of the disease. Make sure the leaf is well-lit and in focus. Avoid multiple leaves in the same image, as this can reduce accuracy.</p>
         </div>
      </details>

      <details>
         <summary>Is the diagnosis provided by this website accurate?</summary>
         <div>
            <p>Our model has been trained on a diverse set of leaf images to ensure high accuracy. However, we recommend consulting an agricultural expert or plant pathologist for confirmation, especially for critical cases. The website is a tool to assist in the initial diagnosis process.</p>
         </div>
      </details>

      <details>
         <summary>How can I access my previous diagnoses?</summary>
         <div>
            <p>All your previous diagnoses are stored in your profile page, accessible after you log in. This allows you to keep track of past diagnoses and see how treatments may have worked over time.</p>
         </div>
      </details>
      <details>
         <summary>What should I do if my plant's disease is not listed?</summary>
         <div>
            <p>We are continually updating our database to include a wider range of plant diseases. If your plant's condition is not identified, you can use the feedback section to let us know. We recommend consulting with an expert in such cases for accurate advice.</p>
         </div>
      </details>

   </div>



      <footer className="follow-us">
        <h2>Follow Us</h2>
        <div className="social-links">
          {["facebook", "twitter", "instagram", "linkedin"].map((platform) => (
            <a
              href="/"
              key={platform}
              className={`social-icon ${platform}`}
              title={`Follow us on ${platform}`}
            >
              <i className={`fab fa-${platform}`}></i>
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}

export default Home;




