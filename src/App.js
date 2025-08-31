import React from 'react';
import './App.css';

function App() {
  return (
    <div className="portfolio-container">
      <header>
        <h1>Andy Mackay</h1>
        <p>Game Developer Portfolio</p>
      </header>
      <section className="showcase">
        <h2>Vertical Slices</h2>
        {/* Add your vertical slice components or video embeds here */}
        <div className="slice">
          <h3>Slice Title</h3>
          <video controls src="your-video.mp4" />
          <p>Description of this slice...</p>
        </div>
        {/* Repeat for more slices */}
      </section>
    </div>
  );
}

export default App;