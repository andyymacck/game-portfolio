import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await fetch("https://formspree.io/f/your-formspree-id", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      setSubmitStatus('success');
      setFormData({ name: "", email: "", message: "" });
      
      // Reset status after 5 seconds
      setTimeout(() => setSubmitStatus(null), 5000);
    } catch (err) {
      console.error(err);
      setSubmitStatus('error');
      
      // Reset status after 5 seconds
      setTimeout(() => setSubmitStatus(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-section">
      <div className="grain"></div>
      <div className="scanline" style={{animation: 'scanline 6s linear infinite'}}></div>
      <div className="scanline" style={{animation: 'scanline 8s linear infinite', opacity: 0.4}}></div>
      <div className="scanline-overlay"></div>
      <div className="contact-card">
        <h2>Contact Me</h2>
        {submitStatus === 'success' && (
          <div className="status-message success">
            Message sent successfully!
          </div>
        )}
        {submitStatus === 'error' && (
          <div className="status-message error">
            Failed to send message. Please try again.
          </div>
        )}
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <input 
              type="text" 
              placeholder="Your Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
              className="cyber-input"
            />
            <div className="input-glow"></div>
          </div>
          <div className="form-group">
            <input 
              type="email" 
              placeholder="Your Email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
              className="cyber-input"
            />
            <div className="input-glow"></div>
          </div>
          <div className="form-group">
            <textarea 
              placeholder="Your Message"
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              required
              className="cyber-textarea"
              rows="5"
            />
            <div className="input-glow"></div>
          </div>
          <button 
            type="submit" 
            className="submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="loading-spinner"></span>
                Sending...
              </>
            ) : (
              <>
                Send Message
                <span className="btn-glow"></span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;