import React from 'react';
import ReactDOM from 'react-dom';
import SFX from '../utils/sfx';

function VideoModalContent({ src, poster, onClose }) {
  const contentRef = React.useRef(null);
  const videoRef = React.useRef(null);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  React.useEffect(() => {
    document.body.classList.add('modal-open');
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.classList.remove('modal-open'); document.body.style.overflow = prevOverflow; };
  }, []);

  const onBackdrop = (e) => {
    if (e.target.classList.contains('video-modal')) onClose();
  };

  return (
    <div className="video-modal show" role="dialog" aria-modal="true" onMouseDown={onBackdrop}>
      <div ref={contentRef} className={`modal-content ${ready ? 'video-ready' : ''}`}>
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>Loading Video...</p>
        </div>
        <div className="video-frame">
          <video
            ref={videoRef}
            controls
            preload="auto"
            playsInline
            poster={poster}
            onLoadedData={() => setReady(true)}
            onCanPlayThrough={() => setReady(true)}
            onWaiting={() => setReady(false)}
          >
            <source src={src} type="video/mp4" />
          </video>
        </div>
  <button className="close-btn" onMouseOver={() => SFX.play('hover-pop')} onClick={() => { try { videoRef.current?.pause(); videoRef.current.currentTime = 0; } catch(e){} SFX.play('close'); onClose(); }} aria-label="Close video">✕</button>
      </div>
    </div>
  );
}

export default function VideoModalPortal({ open, src, poster, onClose }) {
  const elRef = React.useRef(null);
  if (!elRef.current) {
    elRef.current = document.createElement('div');
    elRef.current.setAttribute('data-portal', 'video-modal');
    elRef.current.style.position = 'relative';
    elRef.current.style.zIndex = 2000;
  }

  React.useEffect(() => {
    document.body.appendChild(elRef.current);
    return () => { try { document.body.removeChild(elRef.current); } catch(e){} };
  }, []);

  if (!open) return null;
  return ReactDOM.createPortal(
    <VideoModalContent src={src} poster={poster} onClose={onClose} />,
    elRef.current
  );
}
