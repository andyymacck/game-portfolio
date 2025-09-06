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
    const onMove = (e) => {
      // If a modal is open, freeze the custom cursor to reduce repaint churn
      if (document.body.classList.contains('modal-open')) {
        setHidden(true);
        if (anim.current) { cancelAnimationFrame(anim.current); anim.current = null; }
        return;
      }
      pos.current.x = e.clientX;
      pos.current.y = e.clientY;
      if (!anim.current) {
        const step = () => {
          // Dynamic smoothing: faster on big jumps, slower on micro-moves
          const dx = pos.current.x - cur.current.x;
          const dy = pos.current.y - cur.current.y;
          const dist = Math.hypot(dx, dy);
          let ease;
          if (dist > 80) ease = 0.22;
          else if (dist > 40) ease = 0.16;
          else if (dist > 15) ease = 0.1;
          else ease = 0.075; // very smooth when close
          cur.current.x += dx * ease;
          cur.current.y += dy * ease;
          if (ref.current) {
            ref.current.style.transform = `translate(${cur.current.x}px, ${cur.current.y}px)`;
          }
          if (Math.abs(cur.current.x - pos.current.x) > 0.1 || Math.abs(cur.current.y - pos.current.y) > 0.1) {
            anim.current = requestAnimationFrame(step);
          } else {
            anim.current = null;
          }
        };
        anim.current = requestAnimationFrame(step);
      }

      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (!el) return;
      // Show native cursor for text fields and hide custom
      if (el.closest(SELECTOR_NATIVE_TEXT)) {
        document.body.classList.add('native-text-cursor');
        setHidden(true);
        return;
      } else {
        document.body.classList.remove('native-text-cursor');
        setHidden(false);
      }

      // Hand over interactives
      const now = performance.now();
      const overInteractive = !!el.closest(SELECTOR_INTERACTIVE);
      if (overInteractive) lastInteractive.current = now;
      // Add a brief intent delay before switching to hand to reduce rapid toggling
  if (now - lastInteractive.current < 85) {
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
