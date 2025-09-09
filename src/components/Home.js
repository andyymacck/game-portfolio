import React from 'react';
import SFX from '../utils/sfx';
import HackathonCard from './HackathonCard';
import CertificatesCard from './CertificatesCard';
import './Home.css';
import './Components.css';
import VideoModalPortal from './VideoModalPortal';
import assets from '../assetsMap';

const Home = () => {
  const [activeSlice, setActiveSlice] = React.useState(null);
  const [openSliceDetails, setOpenSliceDetails] = React.useState(null); // track which slice's Read More is open
  const [portal, setPortal] = React.useState({ open: false, src: '', poster: '' });
  // Helpers to toggle the loading mask based on video readiness/buffering
  const markReady = React.useCallback((mcId) => {
    const mc = document.getElementById(mcId);
    if (mc) mc.classList.add('video-ready');
  }, []);
  const markBuffering = React.useCallback((mcId) => {
    const mc = document.getElementById(mcId);
    if (mc) mc.classList.remove('video-ready');
  }, []);
  const closeOthers = React.useCallback((exceptId) => {
    const openModals = document.querySelectorAll('.video-modal.show');
    openModals.forEach((m) => {
      if (m.id !== exceptId) {
        const v = m.querySelector('video');
        if (v) { try { v.pause(); v.currentTime = 0; } catch {} }
        m.classList.remove('show');
      }
    });
  }, []);
  const closeFeaturedGame = React.useCallback(() => {
    const pc = document.querySelector('.preview-container');
    if (pc && pc.classList.contains('show-game')) {
      pc.classList.remove('show-game');
      // Optional: if you want to fully stop the iframe, uncomment below
      // const frame = pc.querySelector('.game-frame');
      // if (frame) { const src = frame.getAttribute('src'); frame.setAttribute('src', src); }
    }
  }, []);

  // Global ESC handler: close any open video modals and Featured Game
  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      // Close all open slice modals
      const openModals = document.querySelectorAll('.video-modal.show');
      openModals.forEach((m) => {
        const v = m.querySelector('video');
        if (v) { try { v.pause(); v.currentTime = 0; } catch {} }
        m.classList.remove('show');
      });
  // Close Featured Game preview
      closeFeaturedGame();
  // Close global portal video if open
  if (portal.open) setPortal({ open: false, src: '', poster: '' });
      // Restore body state
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      setActiveSlice(null);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [closeFeaturedGame, portal.open]);

  // Click-outside handler: clicking the dark overlay closes any open slice modal
  React.useEffect(() => {
    const onMouseDown = (e) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      if (target.classList.contains('video-modal') && target.classList.contains('show')) {
        const v = target.querySelector('video');
        if (v) { try { v.pause(); v.currentTime = 0; } catch {} }
        target.classList.remove('show');
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        setActiveSlice(null);
        SFX.play('close');
      }
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, []);
  return (
    <div className="home-container">
      {/* Subtle PS2-style pillar ambient layer */}
      <div className="ps2-pillar-field" aria-hidden="true">
        <span className="pillar p1" />
        <span className="pillar p2" />
        <span className="pillar p3" />
        <span className="pillar p4" />
        <span className="pillar p5" />
        <span className="pillar p6" />
      </div>
      <div className="scanline-layer">
        <div className="scanline blue slow"></div>
        <div className="scanline cyan fast"></div>
        <div className="scanline cyan medium"></div>
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

        {/* Showcase Section (moved above Featured Game) */}
        <section className="showcase">
          <h2>Vertical Slices</h2>
          <div className={`slices-grid ${activeSlice ? 'slice-activating' : ''}`}>
            <div className={`slice ${activeSlice === 's1' ? 'activating' : ''}`}>
              <div className="video-preview">
                <div className="video-thumbnail">
                  <img src={assets.slices.s1.thumb} alt="Project One Thumbnail" />
                  <button 
                    className="play-overlay" 
                    onMouseOver={() => SFX.play('hover')}
                    onClick={() => {
                      SFX.play('open');
                      setActiveSlice('s1');
                      // Portal will manage body/modal-open
                      closeFeaturedGame();
                      closeOthers('');
                      setPortal({ open: true, src: assets.slices.s1.video, poster: assets.slices.s1.thumb });
                    }}
                  >
                    <span className="play-icon">▶</span>
                  </button>
                </div>
                {/* Inline modal removed; portal is used */}
              </div>
              <div className="slice-content">
                <h3>Project One</h3>
                <p className="slice-description">A brief overview of the first vertical slice...</p>
                <details className="slice-details" open={openSliceDetails === 's1'} onToggle={(e)=>{
                  if (e.target.open) {
                    setOpenSliceDetails('s1');
                  } else if (openSliceDetails === 's1') {
                    setOpenSliceDetails(null);
                  }
                  SFX.play(e.target.open ? 'click' : 'click-soft');
                }}>
                  <summary>Read More</summary>
                  <p>Detailed description of the project, including technical specifications, challenges overcome, and key features implemented.</p>
                </details>
              </div>
            </div>

            <div className={`slice ${activeSlice === 's2' ? 'activating' : ''}`}>
              <div className="video-preview">
                <div className="video-thumbnail">
                  <img src={assets.slices.s2.thumb} alt="Project Two Thumbnail" />
                  <button 
                    className="play-overlay" 
                    onMouseOver={() => SFX.play('hover')}
                    onClick={() => {
                      SFX.play('open');
                      setActiveSlice('s2');
                      // Portal will manage body/modal-open
                      closeFeaturedGame();
                      closeOthers('');
                      setPortal({ open: true, src: assets.slices.s2.video, poster: assets.slices.s2.thumb });
                    }}
                  >
                    <span className="play-icon">▶</span>
                  </button>
                </div>
                {/* Inline modal removed; portal is used */}
              </div>
              <div className="slice-content">
                <h3>Project Two</h3>
                <p className="slice-description">A brief overview of the second vertical slice...</p>
                <details className="slice-details" open={openSliceDetails === 's2'} onToggle={(e)=>{
                  if (e.target.open) {
                    setOpenSliceDetails('s2');
                  } else if (openSliceDetails === 's2') {
                    setOpenSliceDetails(null);
                  }
                  SFX.play(e.target.open ? 'click' : 'click-soft');
                }}>
                  <summary>Read More</summary>
                  <div>
                    <h4>Approval-Based Collectibles</h4>
                    <p>Collectibles aren’t instantly consumed; they’re first queued for approval, then confirmed through a callback:</p>
                    <pre><code>{`public void Approve() {
      if (!m_isApproved) {
          m_callback(m_collectableItem);
          m_isApproved = true;
      }
  }`}</code></pre>
                    <p>This design prevents race conditions in multiplayer or physics-heavy scenarios, while also enabling flexible extensions (e.g., requiring a condition before approval).</p>

                    <h4>Coroutine-Driven Teleportation</h4>
                    <p>The teleport system coordinates fade → teleport → fade-in using coroutines and events:</p>
                    <pre><code>{`private IEnumerator TeleportCoroutine(PlayerController player, Transform destination) {
      m_isTeleporting = true;
      EventHub.Instance.Publish(new ScreenFadeEvent(true));
      yield return new WaitForSeconds(3f);
      EventHub.Instance.Publish(new TeleportEvent(destination.position));
      EventHub.Instance.Publish(new ScreenFadeEvent(false));
      m_isTeleporting = false;
  }`}</code></pre>
                    <p>By broadcasting each step as an event, unrelated systems (e.g., sound, camera shake, or particle FX) can hook into the same sequence without modifying this core code.</p>

                    <h4>Dynamic Collectible Bar Rendering</h4>
                    <p>The bar system dynamically instantiates icons based on counts, with offsets applied both per-icon and globally:</p>
                    <pre><code>{`Vector3 offset = new Vector3(m_offsetItem * i, 0f, 0f);
  Vector3 global = new Vector3(m_offsetGlobal.x, m_offsetGlobal.y, 0f);
  icon.transform.localPosition = global + offset;`}</code></pre>
                    <p>This makes health, ammo, or any resource visualization reusable with no additional code.</p>

                    <h4>Traversal on Splines</h4>
                    <p>Movement is guided by Catmull-Rom splines, a mathematical system that interpolates between waypoints for smooth motion. This allows levels to feel dynamic and cinematic—players traverse along arcs and curves rather than fixed axes, echoing the flow of Klonoa and Kirby 64.</p>
                    <pre><code>{`Vector3 pos = catmullRom.GetPointAt(t);
  transform.position = pos;`}</code></pre>

                    <h4>Design Cohesion</h4>
                    <p>At its core, the architecture prioritizes decoupling:</p>
                    <ul>
                      <li>Events handle communication.</li>
                      <li>Managers coordinate systems.</li>
                      <li>Views react to changes without pulling state.</li>
                    </ul>
                    <p>This separation of roles means that introducing new gameplay features—whether it’s a boss encounter, a new collectible type, or an alternate UI—requires minimal impact on existing code, keeping the system both scalable and maintainable.</p>
                    <p style={{marginTop:'1rem'}}>
                      <a href={assets.slices.s2.gdd} download onMouseOver={()=>SFX.play('hover')} onClick={()=>SFX.play('click')} style={{fontSize:'0.75rem', textTransform:'uppercase', letterSpacing:'0.6px', background:'rgba(0,186,255,0.12)', border:'1px solid rgba(0,186,255,0.4)', padding:'0.4rem 0.75rem', borderRadius:'6px', textDecoration:'none', color:'#00baff', display:'inline-block'}}>
                        Download Slice 2 GDD
                      </a>
                    </p>
                  </div>
                </details>
              </div>
            </div>

            <div className={`slice ${activeSlice === 's3' ? 'activating' : ''}`}>
              <div className="video-preview">
                <div className="video-thumbnail">
                  <img src={assets.slices.s3.thumb} alt="Project Three Thumbnail" />
                  <button 
                    className="play-overlay" 
                    onMouseOver={() => SFX.play('hover')}
                    onClick={() => {
                      SFX.play('open');
                      setActiveSlice('s3');
                      // Portal will manage body/modal-open
                      closeFeaturedGame();
                      closeOthers('');
                      setPortal({ open: true, src: assets.slices.s3.video, poster: assets.slices.s3.thumb });
                    }}
                  >
                    <span className="play-icon">▶</span>
                  </button>
                </div>
                {/* Inline modal removed; portal is used */}
              </div>
              <div className="slice-content">
                <h3>Project Three</h3>
                <p className="slice-description">A brief overview of the third vertical slice...</p>
                <details className="slice-details" open={openSliceDetails === 's3'} onToggle={(e)=>{
                  if (e.target.open) {
                    setOpenSliceDetails('s3');
                  } else if (openSliceDetails === 's3') {
                    setOpenSliceDetails(null);
                  }
                  SFX.play(e.target.open ? 'click' : 'click-soft');
                }}>
                  <summary>Read More</summary>
                  <p>Detailed description of the project, including technical specifications, challenges overcome, and key features implemented.</p>
                </details>
              </div>
            </div>
          </div>
        </section>

      {/* Global portal-driven video modal */}
      <VideoModalPortal
        open={portal.open}
        src={portal.src}
        poster={portal.poster}
        onClose={() => { setPortal({ open: false, src: '', poster: '' }); setActiveSlice(null); }}
      />

      {/* Featured Game Section (moved below Vertical Slices) */}
  <section className="featured-game">
        <h2>Featured Game</h2>
        <div className="game-card">
          <div className="corner-glow cg1" />
            <div className="corner-glow cg2" />
            <div className="game-info">
              <h3>Andys Adventure/ Touchy RPG</h3>
              <p>This project is a 2D action-adventure built in Unity, featuring a player character with movement, combat, and interaction systems, a variety of enemies with AI behaviors, and several boss fights that showcase advanced programming logic.</p>
            </div>
            <div className="game-preview">
              <div className="preview-container">
                <div className="thumbnail-view">
                  <img
                    src={assets.featured.thumb}
                    alt="Game Preview"
                    className="game-thumbnail"
                  />
                  <button className="play-preview-btn" onMouseOver={() => SFX.play('hover')} onClick={() => {
                    SFX.play('click');
                    // Close any open slice videos before opening the game preview
                    closeOthers('');
                    document.body.classList.remove('modal-open');
                    document.body.style.overflow = '';
                    setActiveSlice(null);
                    const container = document.querySelector('.preview-container');
                    if (container) container.classList.add('show-game');
                  }}>
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
                    src={assets.featured.webgl}
                    title="Featured Unity WebGL Game"
                    allow="autoplay; fullscreen"
                    className="game-frame"
                  ></iframe>
                  <button className="close-btn" onMouseOver={() => SFX.play('hover-pop')} onClick={() => {
                    SFX.play('close');
                    const container = document.querySelector('.preview-container');
                    if (container) container.classList.remove('show-game');
                  }}>✕</button>
                </div>
              </div>
            </div>
        <div className="game-footer">
        <div className="game-extra">
          <details className="slice-details" onToggle={(e)=> SFX.play(e.target.open ? 'click' : 'click-soft')}>
          <summary>Read More</summary>
          <div>
            <h4> Player Systems</h4>
            <p>Sprite flipping & animation syncing via PlayerRenderer.</p>
            <p>World interactions triggered by PlayerInteraction, letting the player activate objects, puzzles, and events.</p>
            <pre><code>{`if (interactable != null && Input.GetKeyDown(KeyCode.E)) {
  interactable.Interact();
}`}</code></pre>

            <h4>Enemy AI</h4>
            <p>Standard enemies extend a shared EnemyAI base class, defining pursuit, attack, and patrol logic.</p>
            <p>Ranged enemies shoot projectiles when in range.</p>
            <p>Polymorphic design allows adding new enemy types with minimal changes.</p>
            <pre><code>{`if (Vector3.Distance(transform.position, player.transform.position) < attackRange) {
  ShootProjectile();
}`}</code></pre>

            <h4> Boss Design & Programming Logic</h4>
            <p>The bosses are the centerpiece of the game, each defined by custom programming logic layered on top of the shared AI framework. This creates unique mechanics and escalating difficulty across encounters.</p>

            <h4>Giant Bee Boss</h4>
            <p>Chases the player and performs dash attacks when close.</p>
            <p>Dashes use coroutines for timed bursts of aggression.</p>
            <pre><code>{`IEnumerator DashAttack() {
  Vector2 dir = (player.transform.position - transform.position).normalized;
  rb.velocity = dir * dashSpeed;
  yield return new WaitForSeconds(dashDuration);
  rb.velocity = Vector2.zero;
}`}</code></pre>
            <p>➡ A fast, aggressive melee boss that forces players to master dodging.</p>

            <h4>Slime Boss</h4>
            <p>Alternates between invulnerable spawn phases and vulnerable idle phases.</p>
            <p>Spawns more minions as its health decreases, scaling difficulty naturally.</p>
            <pre><code>{`if (hpRatio > 0.5f) {
  Spawn(2);
} else if (hpRatio > 0.25f) {
  Spawn(4);
} else {
  Spawn(5);
}`}</code></pre>
            <p>➡ A dynamic fight that becomes more chaotic as the boss weakens.</p>

            <h4>Final Boss</h4>
            <p>Mixes teleportation with burst-fire projectiles.</p>
            <p>Teleports avoid repeating locations, adding unpredictability.</p>
            <p>Burst fire creates pattern-based bullet hell sequences.</p>
            <pre><code>{`IEnumerator BurstFire() {
  for (int i = 0; i < 3; i++) {
    Vector2 dir = (player.transform.position - transform.position).normalized;
    Instantiate(projectilePrefab, transform.position, Quaternion.identity)
      .GetComponent<Bullet>().SetUpBullet(dir, player);
    yield return new WaitForSeconds(0.5f);
  }
}`}</code></pre>
          </div>
          </details>
        </div>
              <div className="game-footer-row">
                <div className="game-controls">
                  <div className="control-info">
                    <p>Controls:</p>
                    <span>WASD - Move</span>
                    <span>Space - Jump</span>
                    <span>Mouse - Look</span>
                  </div>
                </div>
                <a href={assets.featured.download} className="download-btn" download onMouseOver={() => SFX.play('hover')} onClick={() => SFX.play('click')}>
                  <span className="download-icon">↓</span>
                  Download Game
                </a>
              </div>
            </div>
        </div>
      </section>

      {/* Work Experience Section */}
      <section className="work-experience">
        <h2>Work Experience</h2>
        <div className="experience-card">
          <div className="experience-entry">
            <h3>Toyz Electronics (A Carnegie Mellon Startup) – Intern Developer</h3>
            <p className="experience-meta">September 2024 – March 2025 (7 months)</p>
            <ul>
              <li>Developed a unified data schema for cross-platform retention and synchronization via Azure PlayFab.</li>
              <li>Resolved Android CI/CD issues in Unity/C#, integrating PlayFab and troubleshooting Gradle, SDK/NDK, and async build errors.</li>
              <li>Engineered and executed a manual migration plan from Unity to UEFN by adapting asset pipelines and rewriting scripts in Verse.</li>
            </ul>
          </div>
          <div className="experience-entry">
            <h3>Singularity X Studios – Video Game Intern Developer</h3>
            <p className="experience-meta">August 2024 – October 2024 (3 months)</p>
            <ul>
              <li>Built core gameplay systems from scratch in Unreal Engine 5 using C++ and Blueprints.</li>
              <li>Implemented health, attack, damage, and projectile features.</li>
              <li>Circumvented version control issues with adaptive, team-friendly workflows.</li>
              <li>Proposed and added features aligned with early project direction.</li>
            </ul>
          </div>
          <div className="experience-entry">
            <h3>ZombieCraft (Java/Kotlin) – Video Game Intern Developer</h3>
            <p className="experience-meta">February 2024 – April 2024 (3 months)</p>
            <ul>
              <li>Shipped new perks and supplementary mechanics; optimized codebase and fixed bugs for a Minecraft zombie survival game.</li>
              <li>Implemented gameplay features in Java and Kotlin within an Agile team.</li>
              <li>Conducted testing and troubleshooting to ensure smooth gameplay.</li>
            </ul>
          </div>
          <div className="experience-entry">
            <h3>TechnoConception – AI Web Application Intern Developer</h3>
            <p className="experience-meta">July 2023 – February 2024 (8 months)</p>
            <ul>
              <li>Assisted in building an AI-based web application using React, TailwindCSS, Next.js, and TypeScript.</li>
              <li>Gained hands-on experience with Git, Docker, Jira, and API integrations.</li>
              <li>Strengthened problem-solving and teamwork through real-world tickets and enhancements.</li>
              <li>Received direct mentorship from a senior engineer (20+ years) while delivering iterative improvements.</li>
            </ul>
          </div>
        </div>
      </section>

  {/* Hackathon / Game Jam Card */}
  <section className="hackathon-section">
        <h2>Hackathon / Game Jam Highlights</h2>
        <HackathonCard />
      </section>

      {/* Certificates Section */}
  <section className="certificates-section">
        <h2>Course Certificates</h2>
        <CertificatesCard />
      </section>
      </div>
    </div>
  );
};

export default Home;
