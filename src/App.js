import React from 'react';
import './App.css';

function App() {
  return (
    <div className="portfolio-container">
      <header>
        <h1 data-text="Andy Mackay">Andy Mackay</h1>
        <p>Game Developer Portfolio</p>
      </header>

      {/* About Me Section */}
      <section className="about-me">
        <h2>About Me</h2>
        <div className="about-card">
          <p>I'm a passionate game developer with a strong foundation in both Unity and Unreal Engine. My journey in game development started with modding existing games, which evolved into creating my own unique gaming experiences.</p>
          <p>With expertise in C#, C++, and game design principles, I focus on crafting engaging gameplay mechanics and optimizing performance. I thrive in collaborative environments and enjoy tackling complex technical challenges.</p>
          <div className="tech-stack">
            <span>Unity</span>
            <span>Unreal Engine</span>
            <span>C#</span>
            <span>C++</span>
            <span>Game Design</span>
          </div>
        </div>
      </section>

      {/* Featured Game Section */}
      <section className="featured-game">
        <h2>Featured Game</h2>
        <div className="game-card">
          <div className="game-info">
            <h3>Game Title</h3>
            <p>A brief description of your featured game. Explain the core mechanics and what makes it unique.</p>
          </div>
          <div className="game-preview">
            <div className="thumbnail-container">
              <img 
                src="/images/game-thumbnail.jpg" 
                alt="Game Preview" 
                className="game-thumbnail"
              />
              <div className="thumbnail-overlay">
                <button className="play-btn">
                  <span className="play-icon">▶</span>
                  Play Game
                </button>
                <a href="/downloads/game.zip" className="download-btn" download>
                  <span className="download-icon">↓</span>
                  Download
                </a>
              </div>
            </div>
            <div className="game-container hidden">
              <div className="loading-overlay">
                <div className="loading-spinner"></div>
                <p>Loading Game...</p>
              </div>
              <iframe 
                src="/webgl-builds/game/index.html" 
                title="Featured Unity WebGL Game"
                allow="autoplay; fullscreen"
                className="game-frame"
              ></iframe>
              <button className="close-btn">✕</button>
            </div>
          </div>
          <div className="game-controls">
            <div className="control-info">
              <p>Controls:</p>
              <span>WASD - Move</span>
              <span>Space - Jump</span>
              <span>Mouse - Look</span>
            </div>
          </div>
        </div>
      </section>

      {/* Showcase Section */}
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

      {/* Work Experience Section */}
<section className="work-experience">
  <h2>Work Experience</h2>
  <div className="experience-card">
    <div className="experience-entry">
      <h3>Software Engineering Intern – Company A</h3>
      <p>Worked on Unity mobile development, fixing UI bugs and implementing gameplay features with C# and TextMesh Pro.</p>
    </div>
    <div className="experience-entry">
      <h3>Web Developer – Company B</h3>
      <p>Developed an ASP.NET Core + Angular shopping app with CRUD functionality and REST API integration.</p>
    </div>
    <div className="experience-entry">
      <h3>Gameplay Programmer – Project X</h3>
      <p>Built a 2.5D platformer prototype with waypoint-based moving platforms, collision detection, and animated UI menus.</p>
    </div>
  </div>
</section>

      {/* Hackathon Experience Section */}
<section className="work-experience">
  <h2>Hackathon Experience</h2>
  <div className="experience-card">
    <div className="experience-entry">
      <h3>Game Jam Winner – Hackathon 2024</h3>
      <p>Led a team of 4 to create a innovative puzzle game using Unity and C#, winning first place in the game development category.</p>
    </div>
    <div className="experience-entry">
      <h3>AR Innovation Award – Tech Fest 2024</h3>
      <p>Developed an augmented reality educational game using Unity AR Foundation and Azure Cloud Services.</p>
    </div>
    <div className="experience-entry">
      <h3>Best Mobile Game – Global Game Jam 2024</h3>
      <p>Created a mobile-optimized endless runner with procedural level generation and custom shader effects.</p>
    </div>
  </div>
</section>


    </div>
  );
}

export default App;
