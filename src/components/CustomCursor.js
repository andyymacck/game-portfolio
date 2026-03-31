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
  const variantRef = useRef('arrow');
  const hiddenRef = useRef(false);
  const [variant, setVariant] = useState('arrow'); // 'arrow' | 'hand'
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    document.body.classList.add('custom-cursor-enabled');
    return () => { document.body.classList.remove('custom-cursor-enabled'); };
  }, []);

  useEffect(() => {
    let rafId = null;
    let lastInteractiveCheck = 0;
    let cachedElement = null;
    const INTERACTIVE_CHECK_MS = 50; // reduce DOM matching frequency
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    const onMove = (e) => {
      // If a modal is open, freeze the custom cursor to reduce repaint churn
      if (document.body.classList.contains('modal-open')) {
        if (!hiddenRef.current) {
          hiddenRef.current = true;
          setHidden(true);
        }
        if (anim.current) { cancelAnimationFrame(anim.current); anim.current = null; }
        return;
      }
      
      pos.current.x = e.clientX;
      pos.current.y = e.clientY;
      
      // Throttle interactive detection; prefer event target to avoid elementFromPoint
      const now = performance.now();
      if (now - lastInteractiveCheck > INTERACTIVE_CHECK_MS) {
        lastInteractiveCheck = now;
        const evtTarget = (e.composedPath && e.composedPath()[0]) || e.target || cachedElement;
        cachedElement = evtTarget && evtTarget.nodeType === 1 ? evtTarget : cachedElement;
      }
      
      if (!anim.current) {
        const step = () => {
          // Simplified easing for better performance
          const dx = pos.current.x - cur.current.x;
          const dy = pos.current.y - cur.current.y;
          const dist = Math.hypot(dx, dy);
          
          // Snappier easing; no smoothing if user prefers reduced motion
          const ease = prefersReducedMotion ? 0.5 : (dist > 50 ? 0.35 : dist > 20 ? 0.22 : 0.12);
          
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
      if (cachedElement.closest && cachedElement.closest(SELECTOR_NATIVE_TEXT)) {
        document.body.classList.add('native-text-cursor');
        if (!hiddenRef.current) {
          hiddenRef.current = true;
          setHidden(true);
        }
        return;
      } else {
        document.body.classList.remove('native-text-cursor');
        if (hiddenRef.current) {
          hiddenRef.current = false;
          setHidden(false);
        }
      }

      // Hand over interactives with reduced checking frequency
      const overInteractive = !!(cachedElement.closest && cachedElement.closest(SELECTOR_INTERACTIVE));
      if (overInteractive) lastInteractive.current = now;
      
      // Simplified variant switching
      const nextVariant = (now - lastInteractive.current < 120) ? 'hand' : 'arrow';
      if (variantRef.current !== nextVariant) {
        variantRef.current = nextVariant;
        setVariant(nextVariant);
      }
    };

    const onLeave = () => {
      if (!hiddenRef.current) {
        hiddenRef.current = true;
        setHidden(true);
      }
    };
    const onEnter = () => {
      // If modal is open, keep it hidden
      if (document.body.classList.contains('modal-open')) { 
        if (!hiddenRef.current) { hiddenRef.current = true; setHidden(true); }
        return; 
      }
      if (hiddenRef.current) { hiddenRef.current = false; setHidden(false); }
    };

    // Use pointer events when available for better performance
    const eventName = window.PointerEvent ? 'pointermove' : 'mousemove';
    window.addEventListener(eventName, onMove, { passive: true });
    window.addEventListener('mouseleave', onLeave);
    window.addEventListener('mouseenter', onEnter);
    return () => {
      window.removeEventListener(eventName, onMove);
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
