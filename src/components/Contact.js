import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("https://formspree.io/f/your-formspree-id", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `name=${formData.name}&email=${formData.email}&message=${formData.message}`
    })
    .then(() => alert("Message sent!"))
    .catch((err) => console.error(err));
  };

  return (
    <section id="contact" className="bg-gray-800 text-white py-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Contact Me</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" 
            placeholder="Your Name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
            className="w-full p-2 border rounded"
          />
          <input 
            type="email" 
            placeholder="Your Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
            className="w-full p-2 border rounded"
          />
          <textarea 
            placeholder="Message"
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
            required
            className="w-full p-2 border rounded"
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Send</button>
        </form>
      </div>
    </section>
  );
};

export default Contact;