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
      </div>
    </div>
  );
};

export default Contact;