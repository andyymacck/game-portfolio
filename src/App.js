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
        <div className="slices-grid">
          <div className="slice">
            <video controls>
              <source src="your-video-1.mp4" type="video/mp4" />
            </video>
            <div className="slice-content">
              <h3>Project One</h3>
              <p className="slice-description">A brief overview of the first vertical slice...</p>
              <details className="slice-details">
                <summary>Read More</summary>
                <p>Detailed description of the project, including technical specifications, challenges overcome, and key features implemented.</p>
              </details>
            </div>
          </div>

          <div className="slice">
            <video controls>
              <source src="your-video-2.mp4" type="video/mp4" />
            </video>
            <div className="slice-content">
              <h3>Project Two</h3>
              <p className="slice-description">A brief overview of the second vertical slice...</p>
              <details className="slice-details">
                <summary>Read More</summary>
                <p>Detailed description of the project, including technical specifications, challenges overcome, and key features implemented.</p>
              </details>
            </div>
          </div>

          <div className="slice">
            <video controls>
              <source src="your-video-3.mp4" type="video/mp4" />
            </video>
            <div className="slice-content">
              <h3>Project Three</h3>
              <p className="slice-description">A brief overview of the third vertical slice...</p>
              <details className="slice-details">
                <summary>Read More</summary>
                <p>Detailed description of the project, including technical specifications, challenges overcome, and key features implemented.</p>
              </details>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;