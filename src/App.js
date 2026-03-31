import React, { useEffect, useState } from 'react';
import { useSettings } from './context/SettingsContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import './components/Components.css';
import Navigation from './components/Navigation';
import Home from './components/Home';
import Contact from './components/Contact';
import CustomCursor from './components/CustomCursor';
import SFX from './utils/sfx';

function App() {
  const [online, setOnline] = useState(true);
  const { muteAudio } = useSettings();

  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    update();
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);

  // Apply mute to all media elements whenever setting changes
  useEffect(() => {
  // sync SFX mute
  SFX.setMuted(!!muteAudio);
    const applyMute = () => {
      document.querySelectorAll('audio, video').forEach((el) => {
        try { el.muted = !!muteAudio; } catch {}
      });
    };
    applyMute();
    // Observe new media nodes being added
    const obs = new MutationObserver(applyMute);
    obs.observe(document.body, { childList: true, subtree: true });
    return () => obs.disconnect();
  }, [muteAudio]);

  // Always enable PSX dither + texture
  useEffect(() => {
    document.body.classList.add('psx-dither');
    document.body.classList.add('psx-dither-texture');
    return () => {
      document.body.classList.remove('psx-dither');
      document.body.classList.remove('psx-dither-texture');
    };
  }, []);

  // Prime/resume WebAudio on first user gesture so sounds can play on hover
  useEffect(() => {
    const onFirst = () => {
      SFX.resume();
      window.removeEventListener('pointerdown', onFirst, true);
      window.removeEventListener('mousedown', onFirst, true);
      window.removeEventListener('touchstart', onFirst, true);
      window.removeEventListener('keydown', onFirst, true);
    };
    // Capture phase to catch earliest gesture
    window.addEventListener('pointerdown', onFirst, true);
    window.addEventListener('mousedown', onFirst, true);
    window.addEventListener('touchstart', onFirst, true);
    window.addEventListener('keydown', onFirst, true);
    return () => {
      window.removeEventListener('pointerdown', onFirst, true);
      window.removeEventListener('mousedown', onFirst, true);
      window.removeEventListener('touchstart', onFirst, true);
      window.removeEventListener('keydown', onFirst, true);
    };
  }, []);

  return (
    <Router basename={process.env.PUBLIC_URL}> {/* Ensures routes work when deployed under /game-portfolio */}
      {/* Keep navigation outside transformed container so it's truly fixed to viewport */}
      <Navigation />
  {/* DOM-based retro cursor to prevent flicker */}
  <CustomCursor />
      <div className='portfolio-container'>
        {/* Online/Offline toast */}
        <div className={`net-toast ${online ? 'online' : 'offline'}`} role="status" aria-live="polite">
          {online ? 'Online' : 'Offline mode: some features may be limited'}
        </div>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/contact' element={<Contact />} />
          {/* Fallback to home for unknown paths (helps on gh-pages refresh) */}
          <Route path='*' element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
