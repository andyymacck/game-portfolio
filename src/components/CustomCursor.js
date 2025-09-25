import React, { useEffect, useRef, useState } from 'react';

// DOM-based custom cursor to avoid browser cursor flicker over animated layers
const SELECTOR_INTERACTIVE = [
  'a', 'button', '[role="button"]',
  '.hamburger-menu', '.nav-menu a',
  '.hackathon-toggle', '.cert-toggle',
  '.play-preview-btn', '.play-overlay',
  '.submit-btn', '.cert-grid-toggle',
  '.cert-filter-btn', '.cert-attachment-link',
  '.hackathon-download', '.download-btn'
].join(',');

const SELECTOR_NATIVE_TEXT = ['input', 'textarea', '[contenteditable="true"]'].join(',');

export default function CustomCursor() {
  const ref = useRef(null);
  const anim = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const cur = useRef({ x: 0, y: 0 });
  const lastInteractive = useRef(0);
  const [variant, setVariant] = useState('arrow'); // 'arrow' | 'hand'
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    document.body.classList.add('custom-cursor-enabled');
    return () => { document.body.classList.remove('custom-cursor-enabled'); };
  }, []);

  useEffect(() => {
    let rafId = null;
    let lastElementCheck = 0;
    let cachedElement = null;
    
    const onMove = (e) => {
      // If a modal is open, freeze the custom cursor to reduce repaint churn
      if (document.body.classList.contains('modal-open')) {
        setHidden(true);
        if (anim.current) { cancelAnimationFrame(anim.current); anim.current = null; }
        return;
      }
      
      pos.current.x = e.clientX;
      pos.current.y = e.clientY;
      
      // Throttle element detection to reduce DOM queries
      const now = performance.now();
      if (now - lastElementCheck > 16) { // ~60fps throttling
        lastElementCheck = now;
        cachedElement = document.elementFromPoint(e.clientX, e.clientY);
      }
      
      if (!anim.current) {
        const step = () => {
          // Simplified easing for better performance
          const dx = pos.current.x - cur.current.x;
          const dy = pos.current.y - cur.current.y;
          const dist = Math.hypot(dx, dy);
          
          // Reduced easing complexity
          const ease = dist > 50 ? 0.25 : dist > 20 ? 0.15 : 0.08;
          
          cur.current.x += dx * ease;
          cur.current.y += dy * ease;
          
          if (ref.current) {
            // Use translate3d for hardware acceleration
            ref.current.style.transform = `translate3d(${cur.current.x}px, ${cur.current.y}px, 0)`;
          }
          
          // Higher threshold to reduce animation frames
          if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
            anim.current = requestAnimationFrame(step);
          } else {
            anim.current = null;
          }
        };
        anim.current = requestAnimationFrame(step);
      }

      if (!cachedElement) return;
      
      // Show native cursor for text fields and hide custom
      if (cachedElement.closest(SELECTOR_NATIVE_TEXT)) {
        document.body.classList.add('native-text-cursor');
        setHidden(true);
        return;
      } else {
        document.body.classList.remove('native-text-cursor');
        setHidden(false);
      }

      // Hand over interactives with reduced checking frequency
      const overInteractive = !!cachedElement.closest(SELECTOR_INTERACTIVE);
      if (overInteractive) lastInteractive.current = now;
      
      // Simplified variant switching
      if (now - lastInteractive.current < 100) {
        setVariant('hand');
      } else {
        setVariant('arrow');
      }
    };

    const onLeave = () => setHidden(true);
    const onEnter = () => {
      // If modal is open, keep it hidden
      if (document.body.classList.contains('modal-open')) { setHidden(true); return; }
      setHidden(false);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseleave', onLeave);
    window.addEventListener('mouseenter', onEnter);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('mouseenter', onEnter);
      if (anim.current) cancelAnimationFrame(anim.current);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`retro-cursor ${variant} ${hidden ? 'hidden' : ''}`}
      aria-hidden="true"
    />
  );
}
