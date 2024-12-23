import React, { useState } from "react";
import './Home.css';
import axios from 'axios';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        user: "",
        email: "",
        feedback: "",
      });
      

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
  
  
    try {
      const response = await axios.post("http://localhost:8080/feedback", formData);
      console.log("Server Response:", response); // Debugging
  
      if (response.data.success) {
        setMessage("Thank you for reaching out! We'll get back to you soon.");
        setFormData({ user: "", email: "", feedback: "" }); // Reset form
      } else {
        setError(response.data.message || "Something went wrong!");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      setError("An error occurred. Please try again later.");
    }
  };
  

  return (
    <section id="contact-container" className="contact-container">
      <div className="contact-card">
        <form onSubmit={handleSubmit} className="form-section">
          <h2>Contact Us</h2>
          {["user", "email", "feedback"].map((field, idx) => (
            <div className="form-group" key={idx}>
                <label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                {field === "feedback" ? (
                <textarea
                    id={field}
                    name={field}
                    rows="5"
                    placeholder={`Your ${field}`}
                    required
                    value={formData[field]}
                    onChange={handleChange}
                />
                ) : (
                <input
                    type={field === "email" ? "email" : "text"}
                    id={field}
                    name={field}
                    placeholder={`Your ${field}`}
                    required
                    value={formData[field]}
                    onChange={handleChange}
                />
                )}
            </div>
            ))}

          <button type="submit" className="button">Send Message</button>
          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}
        </form>
        <div className="image-section">
          <img
            src="https://www.digitalsilk.com/wp-content/uploads/2023/11/contact-us-page-designs-hero.jpg"
            alt="Illustration of contacting support"
          />
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
