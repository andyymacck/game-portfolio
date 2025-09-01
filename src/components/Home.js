import React from 'react';

const Home = () => {
  return (
    <div className="home-container">
      <div className="scanline-layer">
        <div className="scanline blue slow"></div>
        <div className="scanline cyan fast"></div>
      </div>
      <header>
        <h1 data-text="Andy Mackay">Andy Mackay</h1>
        <p>Game Developer Portfolio</p>
      </header>

      <div className="content-wrapper">
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
            <div className="preview-container">
              <div className="thumbnail-view">
                <img 
                  src="/images/game-thumbnail.jpg" 
                  alt="Game Preview" 
                  className="game-thumbnail"
                />
                <button className="play-preview-btn" onClick={() => document.querySelector('.preview-container').classList.add('show-game')}>
                  <span className="play-icon">▶</span>
                  Play Game
                </button>
              </div>
              <div className="game-view">
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
                <button className="close-btn" onClick={() => document.querySelector('.preview-container').classList.remove('show-game')}>✕</button>
              </div>
            </div>
          </div>
          <div className="game-footer">
            <div className="game-controls">
              <div className="control-info">
                <p>Controls:</p>
                <span>WASD - Move</span>
                <span>Space - Jump</span>
                <span>Mouse - Look</span>
              </div>
            </div>
            <a href="/downloads/game.zip" className="download-btn" download>
              <span className="download-icon">↓</span>
              Download Game
            </a>
          </div>
        </div>
      </section>

      {/* Showcase Section */}
      <section className="showcase">
        <h2>Vertical Slices</h2>
        <div className="slices-grid">
          <div className="slice">
            <div className="video-preview">
              <div className="video-thumbnail">
                <img src="/images/project1-thumb.jpg" alt="Project One Thumbnail" />
                <button 
                  className="play-overlay" 
                  onClick={() => document.getElementById('video-modal-1').classList.add('show')}
                >
                  <span className="play-icon">▶</span>
                </button>
              </div>
              <div id="video-modal-1" className="video-modal">
                <div className="modal-content">
                  <div className="loading-overlay">
                    <div className="loading-spinner"></div>
                    <p>Loading Video...</p>
                  </div>
                  <video controls>
                    <source src="/videos/project1.mp4" type="video/mp4" />
                  </video>
                  <button 
                    className="close-btn"
                    onClick={() => {
                      const modal = document.getElementById('video-modal-1');
                      const video = modal.querySelector('video');
                      video.pause();
                      video.currentTime = 0;
                      modal.classList.remove('show');
                    }}
                  >✕</button>
                </div>
              </div>
            </div>
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
            <div className="video-preview">
              <div className="video-thumbnail">
                <img src="/images/project2-thumb.jpg" alt="Project Two Thumbnail" />
                <button 
                  className="play-overlay" 
                  onClick={() => document.getElementById('video-modal-2').classList.add('show')}
                >
                  <span className="play-icon">▶</span>
                </button>
              </div>
              <div id="video-modal-2" className="video-modal">
                <div className="modal-content">
                  <div className="loading-overlay">
                    <div className="loading-spinner"></div>
                    <p>Loading Video...</p>
                  </div>
                  <video controls>
                    <source src="/videos/project2.mp4" type="video/mp4" />
                  </video>
                  <button 
                    className="close-btn"
                    onClick={() => {
                      const modal = document.getElementById('video-modal-2');
                      const video = modal.querySelector('video');
                      video.pause();
                      video.currentTime = 0;
                      modal.classList.remove('show');
                    }}
                  >✕</button>
                </div>
              </div>
            </div>
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
            <div className="video-preview">
              <div className="video-thumbnail">
                <img src="/images/project3-thumb.jpg" alt="Project Three Thumbnail" />
                <button 
                  className="play-overlay" 
                  onClick={() => document.getElementById('video-modal-3').classList.add('show')}
                >
                  <span className="play-icon">▶</span>
                </button>
              </div>
              <div id="video-modal-3" className="video-modal">
                <div className="modal-content">
                  <div className="loading-overlay">
                    <div className="loading-spinner"></div>
                    <p>Loading Video...</p>
                  </div>
                  <video controls>
                    <source src="/videos/project3.mp4" type="video/mp4" />
                  </video>
                  <button 
                    className="close-btn"
                    onClick={() => {
                      const modal = document.getElementById('video-modal-3');
                      const video = modal.querySelector('video');
                      video.pause();
                      video.currentTime = 0;
                      modal.classList.remove('show');
                    }}
                  >✕</button>
                </div>
              </div>
            </div>
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
    </div>
  );
};

export default Home;
