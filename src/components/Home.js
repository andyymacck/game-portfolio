import React from 'react';
import SFX from '../utils/sfx';
import HackathonCard from './HackathonCard';
import CertificatesCard from './CertificatesCard';
import './Home.css';
import './Components.css';
import './_mobile.css';
import VideoModalPortal from './VideoModalPortal';
import assets from '../assetsMap';

const Home = () => {
  const [activeSlice, setActiveSlice] = React.useState(null);
  const [openSliceDetails, setOpenSliceDetails] = React.useState(null); // track which slice's Read More is open
  const [portal, setPortal] = React.useState({ open: false, src: '', poster: '' });
  const [showFeatured, setShowFeatured] = React.useState(false);
  const featuredVideoRef = React.useRef(null);
  const [showS1, setShowS1] = React.useState(false); // in-place preview for ShooterBear
  const s1VideoRef = React.useRef(null);
  const s1PreviewRef = React.useRef(null);
  const [showS2, setShowS2] = React.useState(false);
  const s2VideoRef = React.useRef(null);
  const s2PreviewRef = React.useRef(null);
  const [showS3, setShowS3] = React.useState(false);
  const s3VideoRef = React.useRef(null);
  const s3PreviewRef = React.useRef(null);
  // PDF file sizes + existence flags (lazy HEAD fetch)
  const [s1GddSize, setS1GddSize] = React.useState(null);
  const [s2GddSize, setS2GddSize] = React.useState(null);
  const [s1PdfExists, setS1PdfExists] = React.useState(true);
  const [s2PdfExists, setS2PdfExists] = React.useState(true);
  // Determine if featured download is an external URL (e.g., Google Drive)
  const isFeaturedExternal = !!(assets.featured.download && /^https?:\/\//.test(assets.featured.download));
  const featuredLinkProps = isFeaturedExternal
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : { download: true };
  const bootFX = (el) => {
    if (!el) return;
    el.classList.add('crt-boot', 'chroma-bleed');
    setTimeout(() => el.classList.remove('chroma-bleed'), 200);
    setTimeout(() => el.classList.remove('crt-boot'), 280);
  };
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
    }
    setShowFeatured(false);
    // Optional: if you want to fully stop the iframe, uncomment below
    // const frame = pc?.querySelector('.game-frame');
    // if (frame) { const src = frame.getAttribute('src'); frame.setAttribute('src', src); }
  }, []);

  // Close ShooterBear in-place preview if open
  const closeS1Preview = React.useCallback((playSound = true) => {
    if (playSound) SFX.play('close');
    setShowS1(false);
    setActiveSlice(null);
    try {
      if (s1VideoRef.current) {
        s1VideoRef.current.pause();
        s1VideoRef.current.currentTime = 0;
      }
      s1PreviewRef.current?.classList.remove('crt-boot','chroma-bleed');
    } catch {}
  }, []);

  const closeS2Preview = React.useCallback((playSound = true) => {
    if (playSound) SFX.play('close');
    setShowS2(false);
    setActiveSlice(null);
    try {
      if (s2VideoRef.current) {
        s2VideoRef.current.pause();
        s2VideoRef.current.currentTime = 0;
      }
      s2PreviewRef.current?.classList.remove('crt-boot','chroma-bleed');
    } catch {}
  }, []);

  const closeS3Preview = React.useCallback((playSound = true) => {
    if (playSound) SFX.play('close');
    setShowS3(false);
    setActiveSlice(null);
    try {
      if (s3VideoRef.current) {
        s3VideoRef.current.pause();
        s3VideoRef.current.currentTime = 0;
      }
      s3PreviewRef.current?.classList.remove('crt-boot','chroma-bleed');
    } catch {}
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
  // Close in-place previews
    closeS1Preview();
    closeS2Preview();
    closeS3Preview();
  // Close global portal video if open
  if (portal.open) setPortal({ open: false, src: '', poster: '' });
      // Restore body state
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      setActiveSlice(null);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [closeFeaturedGame, closeS1Preview, closeS2Preview, closeS3Preview, portal.open]);

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
      // Close in-place previews if clicking outside their containers
      if (showS1 && s1PreviewRef.current && !s1PreviewRef.current.contains(target)) closeS1Preview();
      if (showS2 && s2PreviewRef.current && !s2PreviewRef.current.contains(target)) closeS2Preview();
      if (showS3 && s3PreviewRef.current && !s3PreviewRef.current.contains(target)) closeS3Preview();
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [showS1, showS2, showS3, closeS1Preview, closeS2Preview, closeS3Preview]);
  // Fetch PDF sizes for slice GDDs (non-blocking) + detect missing
  React.useEffect(() => {
    const fetchSize = (url, setSize, setExists) => {
      if (!url) { setExists(false); return; }
      fetch(url, { method: 'HEAD' })
        .then(r => {
          if (!r.ok) { setExists(false); return; }
          setExists(true);
          const len = r.headers.get('content-length');
            if (len) {
              const bytes = parseInt(len, 10);
              if (Number.isFinite(bytes)) {
                const thresh = 1024;
                if (bytes < thresh) { setSize(bytes + ' B'); return; }
                const units = ['KB','MB','GB'];
                let u = -1; let b = bytes;
                do { b /= thresh; ++u; } while (b >= thresh && u < units.length - 1);
                setSize(b.toFixed(b < 10 ? 1 : 0) + ' ' + units[u]);
              }
            }
        })
        .catch(()=> setExists(false));
    };
    fetchSize(assets.slices.s1.gdd, setS1GddSize, setS1PdfExists);
    fetchSize(assets.slices.s2.gdd, setS2GddSize, setS2PdfExists);
  }, []);
  const renderPdfLink = (href, label, size, exists, sliceId) => {
    if (!href) return null;
    if (!exists) {
      return (
        <span style={{display:'inline-block',marginTop:'0.75rem',fontSize:'0.65rem',opacity:0.7,color:'#ffb3b3'}} aria-label={`${label} PDF missing. Add file at public/downloads/${sliceId}-gdd.pdf`}>
          ({label} PDF missing – place file in downloads/{sliceId}-gdd.pdf)
        </span>
      );
    }
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onMouseOver={() => SFX.play('hover')}
        onClick={() => SFX.play('click')}
        className="slice-gdd-link"
        aria-label={`${label} PDF opens in new tab${size ? ', file size ' + size : ''}`}
        style={{
          fontSize:'0.7rem',
          textTransform:'uppercase',
          letterSpacing:'0.6px',
          background:'rgba(255,255,255,0.06)',
          border:'1px solid rgba(255,255,255,0.25)',
          padding:'0.45rem 0.75rem',
          borderRadius:'6px',
          textDecoration:'none',
          color:'#e3f6ff',
          display:'inline-flex',
          alignItems:'center',
          gap:'0.4rem',
          marginTop:'0.75rem'
        }}
      >
        <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
          <path d="M14 2v6h6" />
          <path d="M8 13h8" />
          <path d="M8 17h5" />
        </svg>
        {label}
        <span style={{opacity:0.8}}>{`(PDF${size? ', ' + size : ''})`}</span>
      </a>
    );
  };

  // (Markdown ingestion removed per updated requirements)
  return (
    <div className="home-container">
      <VideoModalPortal
        open={portal.open}
        src={portal.src}
        poster={portal.poster}
        onClose={() => setPortal({ open: false, src: '', poster: '' })}
      />
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
            <div className="about-content">
              <p>Hello, Welcome to my Game Dev Portfolio!<br /></p>
              <p>My name is Andrew but my friends call me Andy. I am a game developer with both a Bachelor's in Computing and Information Systems, and a Diploma in Arts and Sciences. I separate myself from others by being immersed in the cross‑section of the art of programming, and system design while having a keen interest in all things that go into making games.</p>
              <p>With depth of knowledge and experience in C#, C++, and game design principles, I am highly fixated on creating interesting and impactful gameplay mechanics while optimizing performance and maintaining solid system design principles. I thrive in collaborative environments and enjoy tackling complex technical challenges with like minded people.</p>
            </div>
            <div className="tech-stack">
              <span>Game Development</span>
              <span>Technical Design</span>
              <span>Technical Art</span>
              <span>Unity</span>
              <span>Unreal Engine</span>
              <span>C#</span>
              <span>C++</span>
            </div>
          </div>
        </section>
        {/* Showcase Section */}
        <section className="showcase">
          <h2>Vertical Slices</h2>
          <div className={`slices-grid ${activeSlice ? 'slice-activating' : ''}`}>
            {/* Slice 3 (moved to first position) */}
            <div className={`slice ${activeSlice === 's3' ? 'activating' : ''}`}>
              <div ref={s3PreviewRef} className={`preview-container ${showS3 ? 'show-game' : ''}`}>
                <div className="thumbnail-view">
                  <img className="game-thumbnail" src={assets.slices.s3.thumb} alt="Project Three Thumbnail" />
                  <button
                    className="play-preview-btn minimal"
                    aria-label="Play Slice 3 Preview"
                    onMouseOver={() => SFX.play('hover')}
                    onClick={() => {
                      SFX.play('open');
                      setActiveSlice('s3');
                      closeFeaturedGame();
                      closeOthers('');
                      if (portal.open) setPortal({ open: false, src: '', poster: '' });
                      setShowS3(true);
                      // boot flash and chroma bleed on activation
                      setTimeout(() => { bootFX(s3PreviewRef.current); try { s3VideoRef.current && s3VideoRef.current.play(); } catch {} }, 30);
                    }}
                  >
                    <span className="play-icon">▶</span>
                  </button>
                </div>
                <div className="game-view">
                  <button
                    className="close-btn"
                    aria-label="Close Slice 3 Preview"
                    onMouseOver={() => SFX.play('hover')}
                    onClick={() => closeS3Preview()}
                  >
                    ×
                  </button>
                  <video
                    ref={s3VideoRef}
                    className="game-frame"
                    src={assets.slices.s3.video}
                    poster={assets.slices.s3.thumb}
                    controls
                    playsInline
                    preload="metadata"
                    onPlay={() => bootFX(s3PreviewRef.current)}
                    onSeeked={() => bootFX(s3PreviewRef.current)}
                  />
                </div>
              </div>
              <h3>Modern Platformer (Unreal/C++)</h3>
              <p className="slice-description">
                An Unreal slice combining a modular C++ Collectathon based quest system, behavior‑tree AI, melee combo Blueprints, and
                traversal mechanics like wall‑jumps which mirror games like Sm64 and Spyro the Dragon.
              </p>
              <details
                className="slice-details"
                open={openSliceDetails === 's3'}
                onToggle={(e) => {
                  if (e.target.open) {
                    setOpenSliceDetails('s3');
                  } else if (openSliceDetails === 's3') {
                    setOpenSliceDetails(null);
                  }
                  SFX.play(e.target.open ? 'click' : 'click-soft');
                }}
              >
                <summary>Read More</summary>
                <div>
 
                    <pre><code>{`void UQuestSystem::StartQuest(int32 TotalCoins)
{
    bIsQuestActive = true;
    CoinsRequired = TotalCoins;
    UE_LOG(LogTemp, Log, TEXT("Quest started: Collect %d coins!"), CoinsRequired);
}

void UQuestSystem::CompleteQuest()
{
    bIsQuestActive = false;
    OnQuestCompleted.Broadcast();   // decoupled event
    if (QuestCompleteWidget)
    {
        QuestCompleteWidget->AddToViewport();
        UGameplayStatics::SetGamePaused(GetWorld(), true);
    }
}
`}</code></pre>
                    <ul>
                      <li>Quests are initiated with flexible parameters (e.g., coins required).</li>
                      <li>Completion triggers a broadcast event, ensuring UI and progression logic remain decoupled.</li>
                      <li>The QuestComplete widget displays a victory screen and reconfigures input, pausing the game cleanly.</li>
                      <li>This ensures progression is modular, with quests extendable to other objectives.</li>
                    </ul>
                    <h4>Enemy & AI Logic (C++)</h4>
                    <p>Enemies are defined as modular actors with clean health, ragdoll death, and AI binding:</p>
                    <pre><code>{`void AEnemy::TakeDamage(float DamageAmount)
{
    CurrentHealth -= DamageAmount;
    if (CurrentHealth <= 0.0f)
    {
        Die();
    }
}

void AEnemy::Die()
{
    GetMesh()->SetCollisionProfileName(TEXT("Ragdoll"));
    GetMesh()->SetSimulatePhysics(true);
    GetCharacterMovement()->DisableMovement();
    GetCapsuleComponent()->SetCollisionEnabled(ECollisionEnabled::NoCollision);
    SetLifeSpan(10.0f); // cleanup
}

`}</code></pre>
                    <ul>
                      <li>Each enemy is autonomous, running behavior trees driven by blackboards.</li>
                      <li>Death flow is handled seamlessly: AI unpossesses, mesh becomes a ragdoll, and cleanup ensures no leftover references.</li>
                      <li>This encapsulation allows for varied enemy types without rewriting death or AI logic.</li>
                    </ul>
                    <h4>Combat System (Blueprints)</h4>
                    <p>The Blueprint combo graph handles multi-hit melee strings:</p>
                    <ul>
                      <li>Input increments an Attack Counter.</li>
                      <li>A Switch on Int selects the correct montage.</li>
                      <li>Each montage chains into the next via timed execution nodes.</li>
                      <li>If no follow-up occurs, the combo resets automatically.</li>
                      <li>This gives responsive, timing-based combat, closer to character action games than basic input spamming.</li>
                    </ul>
                    <h4>Traversal Mechanics (Blueprints)</h4>
                    <p>Movement is enhanced with mechanics like wall jumps:</p>
                    <ul>
                      <li>Each tick performs a line trace ahead of the player.</li>
                      <li>If a wall is detected while falling, a Wall Jump flag is set.</li>
                      <li>Movement velocity is smoothly adjusted using VInterpTo Constant, creating a fluid jump arc.</li>
                      <li>This adds platforming depth, giving traversal more weight and skill expression.</li>
                    </ul>
                    <h4>Design Integration</h4>
                    <ul>
                      <li>The event-driven quest and AI systems (C++) form the structural backbone, while the Blueprint systems handle expressive combat and traversal.</li>
                      <li>Events decouple quest completion from UI updates, allowing new systems (like achievements or narrative triggers) to hook in easily.</li>
                      <li>AI controllers cleanly integrate with behavior trees, making enemy design scalable.</li>
                      <li>Combat Blueprints prioritize responsiveness — chaining animations and resetting states automatically.</li>
                      <li>Movement Blueprints bring tactile depth with mechanics like wall jumping, balancing structure with player freedom.</li>
                    </ul>
                    <h4>Blueprint Visuals</h4>
                    <div style={{display:'flex',gap:'1rem',flexWrap:'wrap',justifyContent:'center',marginTop:'1rem'}}>
                      <div style={{display:'flex',flexDirection:'column',alignItems:'center',maxWidth:'400px',width:'100%'}}>
                        <img src={process.env.PUBLIC_URL + '/unreal/WallJumpBP.JPG'} alt="Wall Jump Blueprint" style={{maxWidth:'400px',width:'100%',borderRadius:'8px',boxShadow:'0 2px 12px rgba(0,0,0,0.15)'}} />
                        <p style={{fontSize:'0.95rem',marginTop:'0.5rem',color:'#3a3a3a',textAlign:'center'}}>
                          <span style={{fontWeight:'bold',color:'#222',fontSize:'1rem'}}>Wall Jump system Blueprint</span><br />
                          <span style={{fontSize:'0.9rem',color:'#444',fontWeight:'normal'}}>Runs every Tick → checks if the character is falling.<br />
                          Performs a Line Trace in the character’s forward direction to detect nearby walls.<br />
                          If a wall is detected, sets a Wall Jump flag that modifies character movement.<br />
                          Uses VInterpTo Constant to smoothly adjust velocity, giving the jump a controlled, polished arc rather than a raw velocity snap.</span>
                        </p>
                      </div>
                      <img src={process.env.PUBLIC_URL + '/unreal/fightingbp.JPG'} alt="Fighting Blueprint" style={{maxWidth:'400px',width:'100%',borderRadius:'8px',boxShadow:'0 2px 12px rgba(0,0,0,0.15)'}} />
                      <p style={{fontSize:'0.95rem',marginTop:'0.5rem',color:'#3a3a3a',textAlign:'center'}}>
                        <span style={{fontWeight:'bold',color:'#222',fontSize:'1rem'}}>Combo Attack System</span><br />
                        <span style={{fontSize:'0.9rem',color:'#444',fontWeight:'normal'}}>An Attack Event increments an Attack Counter.<br />
                        A Switch on Int node branches based on the counter, picking the correct attack montage (Attack 1, 2, 3, etc.).<br />
                        Each montage plays through an AnimMontage node, with sections chained together to allow fluid combo progression.<br />
                        Reset Combo logic ensures the system doesn’t get stuck and resets back to the first attack if no further input happens in time.</span>
                      </p>
                    </div>
                </div>
              </details>
            </div>
            {/* Slice 2 (unchanged in middle) */}
            <div className={`slice ${activeSlice === 's2' ? 'activating' : ''}`}>
              <div ref={s2PreviewRef} className={`preview-container ${showS2 ? 'show-game' : ''}`}>
                <div className="thumbnail-view">
                  <img className="game-thumbnail" src={assets.slices.s2.thumb} alt="Project Two Thumbnail" />
                  <button
                    className="play-preview-btn minimal"
                    aria-label="Play Slice 2 Preview"
                    onMouseOver={() => SFX.play('hover')}
                    onClick={() => {
                      SFX.play('open');
                      setActiveSlice('s2');
                      closeFeaturedGame();
                      closeOthers('');
                      if (portal.open) setPortal({ open: false, src: '', poster: '' });
                      setShowS2(true);
                      setTimeout(() => { bootFX(s2PreviewRef.current); try { s2VideoRef.current && s2VideoRef.current.play(); } catch {} }, 30);
                    }}
                  >
                    <span className="play-icon">▶</span>
                  </button>
                </div>
                <div className="game-view">
                  <button
                    className="close-btn"
                    aria-label="Close Slice 2 Preview"
                    onMouseOver={() => SFX.play('hover')}
                    onClick={() => closeS2Preview()}
                  >
                    ×
                  </button>
                  <video
                    ref={s2VideoRef}
                    className="game-frame"
                    src={assets.slices.s2.video}
                    poster={assets.slices.s2.thumb}
                    controls
                    playsInline
                    preload="metadata"
                    onPlay={() => bootFX(s2PreviewRef.current)}
                    onSeeked={() => bootFX(s2PreviewRef.current)}
                  />
                </div>
              </div>
              <h3>Vertical Slice 2 — Bananaman (Unity)</h3>
              <p className="slice-description">
                A heavily architected scalable MVC event based Unity 2.5D platformer slice inspired by games like Klonoa and Kirby 64. Players movement follows a spline system,
                systems communicate via events (collectibles approval queue, screen fades, teleports), and the HUD UI is fully integrated to display different kinds of collectables, and health and magic.
              </p>
              <details
                className="slice-details"
                open={openSliceDetails === 's2'}
                onToggle={(e) => {
                  if (e.target.open) {
                    setOpenSliceDetails('s2');
                  } else if (openSliceDetails === 's2') {
                    setOpenSliceDetails(null);
                  }
                  SFX.play(e.target.open ? 'click' : 'click-soft');
                }}
              >
                <summary>Read More</summary>
                <div>
                    <h4>Approval-Based Collectibles</h4>
                    <p>Collectibles are first queued for approval, then confirmed through a callback:</p>
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
                    <ul>
                      <li>Events handle communication.</li>
                      <li>Managers coordinate systems.</li>
                      <li>Views react to changes without pulling state.</li>
                    </ul>
                    <p>This separation of roles means that introducing new gameplay features whether it’s a boss encounter, a new collectible type, or an alternate UI—requires minimal impact on existing code, keeping the system both scalable and maintainable.</p>
                    <div style={{marginTop:'0.5rem'}}>
                      {renderPdfLink(assets.slices.s2.gdd, 'View Slice 2 GDD', s2GddSize, s2PdfExists, 'slice2')}
                    </div>
                    {/* Markdown toggle removed */}
                </div>
              </details>
            </div>
            {/* Slice 1 (moved to last position) */}
            <div className={`slice ${activeSlice === 's1' ? 'activating' : ''}`}>
              <div ref={s1PreviewRef} className={`preview-container ${showS1 ? 'show-game' : ''}`}>
                <div className="thumbnail-view">
                  <img className="game-thumbnail" src={assets.slices.s1.thumb} alt="Project One Thumbnail" />
                  <button
                    className="play-preview-btn minimal"
                    aria-label="Play Slice 1 Preview"
                    onMouseOver={() => SFX.play('hover')}
                    onClick={() => {
                      SFX.play('open');
                      setActiveSlice('s1');
                      // close any other preview experiences
                      closeFeaturedGame();
                      closeOthers('');
                      // close global video portal if open
                      if (portal.open) setPortal({ open: false, src: '', poster: '' });
                      // reveal in-place preview
                      setShowS1(true);
                      // start playback shortly after render with boot effect
                      setTimeout(() => {
                        bootFX(s1PreviewRef.current);
                        try { s1VideoRef.current && s1VideoRef.current.play(); } catch {}
                      }, 30);
                    }}
                  >
                    <span className="play-icon">▶</span>
                  </button>
                </div>
                <div className="game-view">
                  <button
                    className="close-btn"
                    aria-label="Close ShooterBear Preview"
                    onMouseOver={() => SFX.play('hover')}
                    onClick={closeS1Preview}
                  >
                    ×
                  </button>
                  <video
                    ref={s1VideoRef}
                    className="game-frame"
                    src={assets.slices.s1.video}
                    poster={assets.slices.s1.thumb}
                    controls
                    playsInline
                    preload="metadata"
                    onPlay={() => bootFX(s1PreviewRef.current)}
                    onSeeked={() => bootFX(s1PreviewRef.current)}
                  />
                </div>
              </div>
              <h3>Gears Style Shooter (Unreal/C++)</h3>
              <p className="slice-description">
                A Third‑person shooter prototype in Unreal Engine 5 using C++ and Blueprints. Its highly modular core features make future implementation of additional features more seamless. features responsive
                movement and smooth aiming, hitscan and automatic fire, enemy patrol/aggro/combat ranges, headshot damage, Hit points widgets,
                as well as ragdoll death.
              </p>
              <details
                className="slice-details"
                open={openSliceDetails === 's1'}
                onToggle={(e) => {
                  if (e.target.open) {
                    setOpenSliceDetails('s1');
                  } else if (openSliceDetails === 's1') {
                    setOpenSliceDetails(null);
                  }
                  SFX.play(e.target.open ? 'click' : 'click-soft');
                }}
              >
                <summary>Read More</summary>
                <div>
                    
                    <h4>Player Features (AMainPlayer)</h4>
                    <h5 style={{marginTop:'0.5rem'}}>Movement & Camera</h5>
                    <p>Standard third-person movement:</p>
                    <pre><code>{`void AMainPlayer::MoveForward(float value);
void AMainPlayer::MoveRight(float value);
void AMainPlayer::TurnAtRate(float rate);
void AMainPlayer::LookUpAtRate(float rate);`}</code></pre>
                    <p>Camera zooms when aiming:</p>
                    <pre><code>{`if (BAiming) {
    CameraCurrentFOV = FMath::FInterpTo(CameraCurrentFOV, CameraZoomFOV, DeltaTime, ZoomInterpAsSpeed);
} else {
    CameraCurrentFOV = FMath::FInterpTo(CameraCurrentFOV, CameraDefaultFOV, DeltaTime, ZoomInterpAsSpeed);
}`}</code></pre>

                    <h5>Shooting System</h5>
                    <p>Fire from a “BarrelSocket” with beam traces:</p>
                    <pre><code>{`FHitResult BeamHitResult;
bool bBeamEnd = GetBeamEndLocation(socketTransform.GetLocation(), BeamHitResult);`}</code></pre>
                    <p>Damage enemies and apply headshot multipliers:</p>
                    <pre><code>{`if (Enemy && BeamHitResult.BoneName.ToString() == Enemy->GetHeadBone())
{
    UGameplayStatics::ApplyPointDamage(Enemy, weaponDamage * 2.f, direction, BeamHitResult, GetController(), this, UDamageType::StaticClass());
}`}</code></pre>
                    <p>Automatic fire implementation:</p>
                    <pre><code>{`void AMainPlayer::StartFireTimer()
{
    if (ShouldFire) {
        Shooting();
        ShouldFire = false;
        GetWorldTimerManager().SetTimer(autoFireTimer, this, &AMainPlayer::AutoFireReset, automaticFireRate);
    }
}`}</code></pre>

                    <h5>Damage & Hit Effects</h5>
                    <p>Player takes damage with visual/audio feedback:</p>
                    <pre><code>{`if (ImpactNiagaraSystem)
{
    UNiagaraFunctionLibrary::SpawnSystemAtLocation(GetWorld(), ImpactNiagaraSystem, SpawnLocation, FRotator::ZeroRotator);
}`}</code></pre>

                    <h4>Enemy Features (ABaseEnemy)</h4>
                    <h5>AI & Behavior</h5>
                    <p>Patrols between points using a behavior tree (EnemyController):</p>
                    <pre><code>{`EnemyController->GetBlackboardComponent()->SetValueAsVector(FName("PatrolPoint"), WorldPatrolPoint);
EnemyController->RunBehaviorTree(behaviorTree);`}</code></pre>
                    <p>Detects player using aggro sphere and combat range sphere:</p>
                    <pre><code>{`void ABaseEnemy::AggroSphereOverlap(...);
void ABaseEnemy::CombatRangeOverlap(...);`}</code></pre>

                    <h5>Combat</h5>
                    <p>Attack combos with montages:</p>
                    <pre><code>{`void ABaseEnemy::playAttackMontage(FName section, float playRate);
FName ABaseEnemy::GetAttackSectionName();`}</code></pre>
                    <p>Damage player on collision with weapon hitboxes:</p>
                    <pre><code>{`void ABaseEnemy::OnLeftHandOverlap(...);
void ABaseEnemy::OnRightHandOverlap(...);`}</code></pre>

                    <h5>Hit Reaction & Stun</h5>
                    <p>Random chance to get stunned on bullet hit:</p>
                    <pre><code>{`const float stunned = FMath::FRandRange(0.f, 1.f);
if (stunned <= stunnedChance) {
    playHitMontage(FName("hitReactFront"));
    setStunned(true);
}`}</code></pre>

                    <h5>Death & Ragdoll</h5>
                    <p>Enemy ragdolls on death:</p>
                    <pre><code>{`GetMesh()->SetCollisionProfileName(TEXT("Ragdoll"));
GetMesh()->SetSimulatePhysics(true);
SetLifeSpan(5.0f);`}</code></pre>

                    <h4>Animation System (UShooterAnimInstance)</h4>
                    <p>Updates character animation based on speed, aiming, acceleration:</p>
                    <pre><code>{`Speed = MainPlayer->GetVelocity().Size();
bIsInAir = MainPlayer->GetCharacterMovement()->IsFalling();
bAiming = MainPlayer->GetAiming();
MovementOffsetYaw = UKismetMathLibrary::NormalizedDeltaRotator(MovementRotation, AimRotation).Yaw;`}</code></pre>

                    <h4>Blueprint Visuals</h4>
                    <div style={{display:'flex',gap:'1rem',flexWrap:'wrap',justifyContent:'center',marginTop:'1rem'}}>
                      <div style={{display:'flex',flexDirection:'column',alignItems:'center',maxWidth:'400px',width:'100%'}}>
                        <img src={process.env.PUBLIC_URL + '/unreal/EnemyBp.JPG'} alt="Enemy AI Blueprint" style={{maxWidth:'400px',width:'100%',borderRadius:'8px',boxShadow:'0 2px 12px rgba(0,0,0,0.15)'}} />
                        <p style={{fontSize:'0.95rem',marginTop:'0.5rem',color:'#3a3a3a',textAlign:'center'}}>
                          <span style={{fontWeight:'bold',color:'#222',fontSize:'1rem'}}>Enemy AI Behavior Blueprint</span><br />
                          <span style={{fontSize:'0.9rem',color:'#444',fontWeight:'normal'}}>Behavior Tree–driven patrol switching, aggro and combat range detection via overlap spheres, attack combo montages, hit reactions with stun chance, and ragdoll death cleanup.</span>
                        </p>
                      </div>
                    </div>
                    <div style={{marginTop:'0.75rem'}}>
                      {renderPdfLink(assets.slices.s1.gdd, 'View Slice 1 GDD', s1GddSize, s1PdfExists, 'slice1')}
                    </div>
                    {/* Markdown toggle removed */}
                </div>
              </details>
            </div>
          </div>
        </section>
        {/* Featured Game Section */}
        <section className="featured-game">
          <h2>Featured Game</h2>
          <div className="game-card">
            <div className="corner-glow cg1" />
            <div className="corner-glow cg2" />
            <div className="game-info">
              <h3>Andys Adventure/ Touchy RPG</h3>
              <p>
                This project is top down 2D action-adventure built in Unity, highly inspired by A Link to the Past, mixed with a bit of StarDew Valley.
                It features multi directional character movement, attacks, and interaction systems, a variety of enemies with different AI behaviors,
                and several boss fights that showcases simplified yet advanced programming logic.
              </p>
            </div>
            <div className="game-preview">
              <div className={`preview-container ${showFeatured ? 'show-game' : ''}`}>
                {assets.featured.video ? (
                  <>
                    <div className="thumbnail-view">
                      <img className="game-thumbnail" src={assets.featured.thumb} alt="Featured Game Thumbnail" />
                      <button
                        className="play-preview-btn minimal"
                        aria-label="Play Featured Game"
                        onMouseOver={() => SFX.play('hover')}
                        onClick={() => {
                          SFX.play('open');
                          setShowFeatured(true);
                          setTimeout(() => bootFX(document.querySelector('.featured-game .preview-container')), 20);
                          setTimeout(() => { try { featuredVideoRef.current && featuredVideoRef.current.play(); } catch {} }, 60);
                        }}
                      >
                        <span className="play-icon">▶</span>
                      </button>
                    </div>
                    <div className="game-view">
                      <video
                        ref={featuredVideoRef}
                        className="game-frame"
                        src={assets.featured.video}
                        poster={assets.featured.thumb}
                        controls
                        playsInline
                        preload="metadata"
                        onPlay={() => bootFX(document.querySelector('.featured-game .preview-container'))}
                        onSeeked={() => bootFX(document.querySelector('.featured-game .preview-container'))}
                      />
                      <button
                        className="close-btn"
                        onMouseOver={() => SFX.play('hover-pop')}
                        onClick={() => {
                          SFX.play('close');
                          try { featuredVideoRef.current?.pause(); featuredVideoRef.current.currentTime = 0; } catch {}
                          closeFeaturedGame();
                        }}
                        aria-label="Close Featured Game"
                      >
                        ✕
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="thumbnail-view" style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'1rem',textAlign:'center'}}>
                    <img className="game-thumbnail" src={assets.featured.thumb} alt="Featured Game Thumbnail" />
                    <div style={{marginTop:'0.75rem',fontSize:'0.75rem',opacity:0.75,lineHeight:1.4}}>
                      <strong>Gameplay clip temporarily unavailable.</strong><br />
                      Optimizing media for faster loading — coming back soon.
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* Featured Read More (below video) */}
            <details
              className="slice-details"
              open={openSliceDetails === 'featured'}
              onToggle={(e) => {
                if (e.target.open) {
                  setOpenSliceDetails('featured');
                } else if (openSliceDetails === 'featured') {
                  setOpenSliceDetails(null);
                }
                SFX.play(e.target.open ? 'click' : 'click-soft');
              }}
              style={{marginTop:'0.75rem'}}
            >
              <summary>Read More</summary>
              <div>
                <h4>Directional Combat System</h4>
                <p>Player attacks align with facing direction, with animations + hit detection via BoxCastAll:</p>
                <pre><code>{`if (dir.normalized == Vector2.right) {
    attackAnimator.SetTrigger("Attack");
    playerAttackSprite.flipX = false;
}
RaycastHit2D[] hits = Physics2D.BoxCastAll(transform.position + offset, boxSize, 0f, transform.right, 0f);`}</code></pre>
                <p>Gives Zelda-like melee combat with precise hitboxes.</p>

                <h4>Game Summary</h4>
                <p>
                  This project is a 2D action-adventure built in Unity, featuring a player character with movement, combat, and interaction systems,
                  a variety of enemies with AI behaviors, and several boss fights that showcase advanced programming logic.
                </p>

                <h4>Player Systems</h4>
                <p>
                  Sprite flipping & animation syncing via a dedicated renderer. World interactions triggered by a PlayerInteraction component,
                  letting the player activate objects, puzzles, and events:
                </p>
                <pre><code>{`if (interactable != null && Input.GetKeyDown(KeyCode.E)) {
    interactable.Interact();
}`}</code></pre>

                <h4>Enemy AI</h4>
                <p>
                  Standard enemies extend a shared EnemyAI base class, defining pursuit, attack, and patrol logic. Ranged enemies shoot projectiles when in range.
                  Polymorphic design allows adding new enemy types with minimal changes:
                </p>
                <pre><code>{`if (Vector3.Distance(transform.position, player.transform.position) < attackRange) {
    ShootProjectile();
}`}</code></pre>

                <h4>Boss Design & Programming Logic</h4>
                <p>
                  Each boss builds on the shared EnemyAI state machine and overrides its Attack/Move methods to create distinct mechanics.
                  This modular design lets you scale new bosses without rewriting the framework.
                </p>

                <h4>Giant Bee Boss</h4>
                <p>Chases the player and performs dash attacks when in range. Cooldowns prevent spamming; dash damage is applied only on contact.</p>
                <pre><code>{`if (Vector3.Distance(transform.position, player.transform.position) < minDistanceToDash) {
    StartCoroutine(DashAttack());
}

IEnumerator DashAttack() {
    Vector2 dir = (player.transform.position - transform.position).normalized;
    rb.velocity = dir * dashSpeed;
    yield return new WaitForSeconds(dashDuration);
    rb.velocity = Vector2.zero;
}`}</code></pre>
                <p>Fast, aggressive melee boss that pressures the player into dodging.</p>

                <h4>Slime Boss</h4>
                <p>Alternates between invulnerable spawn phases and vulnerable idle phases. Minion counts scale with remaining HP.</p>
                <pre><code>{`float hpRatio = attackUnit.currentHP / attackUnit.unit.maxHP;
if (hpRatio > 0.5f) {
    Spawn(2);
} else if (hpRatio > 0.25f) {
    Spawn(4);
} else {
    Spawn(5);
}`}</code></pre>
                <p>Dynamic fight where the boss becomes harder as it weakens.</p>

                <h4>Final Boss</h4>
                <p>Combines teleportation and burst‑fire projectiles. Teleport avoids repeating the same location; bursts create pattern‑based difficulty.</p>
                <pre><code>{`if (teleportCoolDown < 0) {
    int nextLocationIndex = Random.Range(0, teleportLocations.Length - 1);
    transform.position = teleportLocations[nextLocationIndex].transform.position;
}

IEnumerator BurstFire() {
    for (int i = 0; i < 3; i++) {
        Vector2 dir = (player.transform.position - transform.position).normalized;
        Instantiate(projectilePrefab, transform.position, Quaternion.identity)
            .GetComponent<Bullet>().SetUpBullet(dir, player);
        yield return new WaitForSeconds(0.5f);
    }
}`}</code></pre>
                <p>Epic final encounter mixing ranged pressure and unpredictability.</p>

                <h4>Why This Stands Out</h4>
                <ul>
                  <li>Bosses aren’t just “tougher enemies” — each is defined by programming logic that creates a unique playstyle.</li>
                  <li>The AI state machine ensures consistency, while individual scripts extend behaviors.</li>
                  <li>Difficulty naturally escalates: dash pressure → minion waves → teleport & bullet hell.</li>
                </ul>

                <p style={{marginTop:'0.5rem'}}>Together, these bosses show off strong AI architecture, modular design, and gameplay variety — a highlight achievement in this project.</p>
              </div>
            </details>
            <div className="game-footer">
              <div className="game-extra"></div>
              <div className="game-footer-row">
                <div className="game-controls">
                  <div className="control-info">
                    <p>Controls:</p>
                    <span>WASD - Move</span>
                    <span>Space - Jump</span>
                    <span>Mouse - Look</span>
                  </div>
                </div>
                {assets.featured.download ? (
                  <a href={assets.featured.download} className="download-btn" {...featuredLinkProps} onMouseOver={() => SFX.play('hover')} onClick={() => SFX.play('click')}>
                    <span className="download-icon">↓</span>
                    Download Game
                  </a>
                ) : (
                  <div style={{fontSize:'0.65rem',opacity:0.7,padding:'0.5rem 0.75rem',border:'1px dashed rgba(255,255,255,0.25)',borderRadius:'6px'}}>
                    External download link coming soon
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
        {/* Work Experience Section */}
        <section className="work-experience">
          <h2>Work Experience</h2>
          <div className="experience-card">
            {/* Education Row */}
            <div className="education-section">
              <h3>Education</h3>
              <div className="education-grid">
                <div className="education-item">
                  <p className="degree">Bachelor of Science in Computing and Information Systems</p>
                  <p className="school">Athabasca University</p>
                  <p className="duration">2021–2025</p>
                </div>
                <div className="education-item">
                  <p className="degree">Technical Diploma in Liberal Arts and Sciences</p>
                  <p className="school">George Brown College</p>
                  <p className="duration">2017–2019</p>
                </div>
              </div>
            </div>
            <div className="experience-entry">
              <h3>Toyz Electronics (A Carnegie Mellon Startup) – Intern Developer</h3>
              <p className="experience-meta">September 2024 – March 2025 (7 months)</p>
              <ul>
                <li>Developed a unified data schema for cross-platform retention and synchronization via Azure PlayFab.</li>
                <li>Resolved Android CI/CD issues in Unity/C#, integrating PlayFab and troubleshooting Gradle, SDK/NDK, and async build errors.</li>
                <li>Built UI menu systems from the ground up, along with scene transitions and functional point scoring systems within the custom racergame</li> 
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
          <h2>Additional Credentials</h2>
          <CertificatesCard />
        </section>
      </div>
    </div>
  );
};

export default Home;
