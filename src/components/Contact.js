import React, { useState, useEffect } from 'react';
import './Components.css';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "", botcheck: "" }); // botcheck = honeypot
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
  const [errorDetail, setErrorDetail] = useState("");
  const [ready, setReady] = useState(false); // delay heavy animations to avoid refresh flicker

  // Defer animation start until after first paint + slight delay
  useEffect(() => {
    let raf1 = requestAnimationFrame(() => {
      let raf2 = requestAnimationFrame(() => {
        // Small timeout ensures browser finished rasterizing static layers
        const t = setTimeout(() => setReady(true), 40);
        // cleanup timer on unmount
        return () => clearTimeout(t);
      });
      // store nested frame id so we can cancel if needed
      (window.__contactRafIds ||= []).push(raf2);
    });
    (window.__contactRafIds ||= []).push(raf1);
    return () => {
      if (window.__contactRafIds) {
        window.__contactRafIds.forEach(id => cancelAnimationFrame(id));
        window.__contactRafIds = [];
      }
    };
  }, []);

  const ACCESS_KEY = process.env.REACT_APP_WEB3FORMS_KEY || ""; // Put your key in .env as REACT_APP_WEB3FORMS_KEY

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorDetail("");

    // Basic offline check
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setSubmitStatus('error');
      setErrorDetail('You appear to be offline.');
      setIsSubmitting(false);
      return;
    }

    // Honeypot: if bot filled the hidden field, short‑circuit as a silent success
    if (formData.botcheck && formData.botcheck.trim().length > 0) {
      setSubmitStatus('success');
      setFormData({ name: "", email: "", message: "", botcheck: "" });
      setIsSubmitting(false);
      return;
    }

    try {
      if (!ACCESS_KEY) {
        setSubmitStatus('error');
        setErrorDetail('Missing access key. Create .env file with REACT_APP_WEB3FORMS_KEY=your_key');
        setIsSubmitting(false);
        return;
      }

      const payload = {
        access_key: ACCESS_KEY,
        name: formData.name,
        email: formData.email,
        message: formData.message,
        botcheck: formData.botcheck || "",
        replyto: formData.email, // Helps the service set Reply-To header
        subject: `Portfolio Contact from ${formData.name}`,
        to: "andyymackay@gmail.com"
      };

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      let result = {};
      try {
        result = await response.json();
      } catch (jsonErr) {
        // Non-JSON or empty response
        result = { success: false, message: 'Invalid response from server.' };
      }

      // Debug log (will show in browser console only)
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.log('Web3Forms response:', result);
      }

      if (response.ok && result.success) {
  setSubmitStatus('success');
  setFormData({ name: "", email: "", message: "", botcheck: "" });
      } else {
        setSubmitStatus('error');
        // Provide clearer guidance for common cases
        let msg = result.message || `Status ${response.status}`;
        if (/invalid access key/i.test(msg)) {
          msg = 'Invalid access key. Copy the exact key from Web3Forms dashboard. If you regenerated it, update the .env value and rebuild.';
        }
        setErrorDetail(msg);
      }
    } catch (error) {
      console.error('Form submission error:', error);
  setSubmitStatus('error');
  setErrorDetail(error.message || 'Unexpected error');
    } finally {
      setIsSubmitting(false);
      // Reset status after 8 seconds (longer so user can read details)
      setTimeout(() => {
        setSubmitStatus(null);
        setErrorDetail("");
      }, 8000);
    }
  };

  const openMailClient = () => {
    const subject = encodeURIComponent(`Portfolio Contact from ${formData.name || 'Your Name'}`);
    const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`);
    window.location.href = `mailto:andyymackay@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
  <div className={"contact-section" + (ready ? " ready" : "")}>                    
      <div className="contact-scanline-layer">
  <div className="contact-scanline fuzz" style={{ top: '15%' }} />
  <div className="contact-scanline blue" style={{ top: '40%' }} />
  <div className="contact-scanline fuzz" style={{ top: '70%' }} />
      </div>
      <div className="contact-card">
        <h2>Contact Me</h2>
        {submitStatus === 'success' && (
          <div className="form-message success">
            Message sent successfully! I'll get back to you soon.
          </div>
        )}
        {submitStatus === 'error' && (
          <div className="form-message error">
            Failed to send message. Please try again.
            {errorDetail && (
              <div className="error-detail">{errorDetail}</div>
            )}
            <button type="button" className="fallback-mail-btn" onClick={openMailClient}>
              Open Email App Instead
            </button>
          </div>
        )}
        <form onSubmit={handleSubmit} className="contact-form" noValidate>
          {/* Honeypot field (hidden from users) */}
          <div style={{ position: 'absolute', left: '-5000px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden' }} aria-hidden="true">
            <label htmlFor="botcheck">Do not fill this field</label>
            <input
              id="botcheck"
              name="botcheck"
              type="text"
              tabIndex="-1"
              autoComplete="off"
              value={formData.botcheck}
              onChange={(e) => setFormData({ ...formData, botcheck: e.target.value })}
            />
          </div>
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
              rows="3"
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
        
        {/* Social Media Links */}
        <div className="social-links">
          <a 
            href="https://www.linkedin.com/in/andrew-mackay-68b205132/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="social-link linkedin"
            aria-label="LinkedIn Profile"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
          <a 
            href="https://github.com/andyymacck" 
            target="_blank" 
            rel="noopener noreferrer"
            className="social-link github"
            aria-label="GitHub Profile"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Contact;