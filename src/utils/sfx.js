// Tiny WebAudio SFX helper for subtle PS1-era UI palette
// Goal: avoid 8-bit chiptune harshness; prefer filtered, sample-like ticks and plucks
// Usage: import SFX from './utils/sfx'; SFX.play('hover')

const SFX = (() => {
  let ctx = null;
  let muted = false;
  let masterGain = null;     // master volume bus
  let masterLPF = null;      // master low-pass filter for PS1-ish smoothing
  const last = new Map();

  const ensureCtx = () => {
    if (!ctx) {
      try {
        ctx = new (window.AudioContext || window.webkitAudioContext)();
      } catch {}
    }
    if (ctx && !masterGain) {
      // Build master chain: voice -> masterGain -> masterLPF -> destination
      masterGain = ctx.createGain();
      masterGain.gain.value = 0.98;
      masterLPF = ctx.createBiquadFilter();
      masterLPF.type = 'lowpass';
      // Slightly bandwidth-limited top end to avoid 8-bit sharpness
      masterLPF.frequency.value = 5200; // Hz
      masterLPF.Q.value = 0.7;
      masterGain.connect(masterLPF).connect(ctx.destination);
    }
    return ctx;
  };

  // Utility: create a per-voice gain pre-routed to master bus
  const createVoiceGain = () => {
    const ac = ensureCtx();
    if (!ac) return null;
    const g = ac.createGain();
    // Initialize at near-zero to avoid clicks when scheduling envelopes
    g.gain.setValueAtTime(0.0001, ac.currentTime);
    g.connect(masterGain);
    return g;
  };

  // Shared ADSR envelope helper (times in seconds)
  // Returns a recommended stop time for the source node
  const applyADSR = (gainNode, t0, {
    a = 0.006, // attack
    d = 0.04,  // decay
    s = 0.12,  // sustain level (0..1) relative to peak
    r = 0.06,  // release
    peak = 1.0,
    base = 0.0001,
    amp = 0.03, // overall amplitude scalar
    hold = 0.02 // time to hold sustain before release kicks in
  } = {}) => {
    const g = gainNode.gain;
    const tA = t0 + a;
    const tD = tA + d;
    const tS = tD + Math.max(0, hold);
    const tR = tS + r;
    g.setValueAtTime(base, t0);
    g.exponentialRampToValueAtTime(Math.max(base, amp * peak), tA);
    g.exponentialRampToValueAtTime(Math.max(base, amp * Math.max(0.0001, s)), tD);
    g.setValueAtTime(Math.max(base, amp * Math.max(0.0001, s)), tS);
    g.exponentialRampToValueAtTime(base, tR);
    return tR + 0.01;
  };

  const throttle = (key, ms) => {
    const now = performance.now();
    const t = last.get(key) || 0;
    if (now - t < ms) return true;
    last.set(key, now);
    return false;
  };

  // Small random helpers for natural variation
  const rand = (min, max) => min + Math.random() * (max - min);
  const vary = (v, pct = 0.06) => v * rand(1 - pct, 1 + pct); // ±pct variation

  // PS1-ish palette building blocks
  // 1) Short filtered noise tick (for hover)
  const noiseTick = ({ dur = 0.035, gain = 0.022, center = 2200, q = 0.9 }) => {
    if (muted) return;
    const ac = ensureCtx();
    if (!ac) return;
    const t0 = ac.currentTime;
    const frames = Math.max(32, Math.floor(ac.sampleRate * dur));
    const buf = ac.createBuffer(1, frames, ac.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < frames; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / frames); // small decay
    const src = ac.createBufferSource();
    src.buffer = buf;
    const bp = ac.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.setValueAtTime(vary(center, 0.08), t0);
    bp.Q.setValueAtTime(vary(q, 0.1), t0);
    const g = createVoiceGain();
    const stopAt = applyADSR(g, t0, { a: 0.004, d: 0.03, s: 0.05, r: 0.02, amp: vary(gain, 0.1), peak: 1.0, hold: 0.005 });
    src.connect(bp).connect(g);
    src.start(t0);
    src.stop(stopAt);
  };

  // 2) Filtered pluck: layered sine + triangle through a lowpass with quick decay
  const pluck = ({ freq = 520, dur = 0.09, gain = 0.03, cutoff = 1600, q = 0.7, detune = 6 }) => {
    if (muted) return;
    const ac = ensureCtx();
    if (!ac) return;
    const t0 = ac.currentTime;
    const lp = ac.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(vary(cutoff, 0.08), t0);
    lp.Q.setValueAtTime(vary(q, 0.1), t0);
    const g = createVoiceGain();
    const stopAt = applyADSR(g, t0, { a: 0.006, d: 0.05, s: 0.18, r: 0.06, amp: vary(gain, 0.08), peak: 1.0, hold: Math.max(0, dur - 0.06) });
    const o1 = ac.createOscillator();
    o1.type = 'sine';
    o1.frequency.setValueAtTime(vary(freq, 0.03), t0);
    const o2 = ac.createOscillator();
    o2.type = 'triangle';
    o2.frequency.setValueAtTime(vary(freq, 0.03), t0);
    o2.detune.setValueAtTime(vary(detune, 0.15), t0); // slight detune for body
    o1.connect(lp);
    o2.connect(lp);
    lp.connect(g);
    o1.start(t0); o2.start(t0);
    o1.stop(stopAt); o2.stop(stopAt);
  };

  // 3) Gentle glide with filter sweep (open/close)
  const glide = ({ up = true, base = 300, spread = 140, gain = 0.028, seg = 0.08, cutoff0 = 1200, cutoff1 = 2200 }) => {
    if (muted) return;
    const ac = ensureCtx();
    if (!ac) return;
    const t0 = ac.currentTime;
    const o = ac.createOscillator();
    o.type = 'sine';
    const f0 = vary(base + (up ? 0 : spread), 0.03);
    const f1 = vary(base + (up ? spread : 0), 0.03);
    o.frequency.setValueAtTime(f0, t0);
    o.frequency.linearRampToValueAtTime(f1, t0 + seg);
    const lp = ac.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(up ? vary(cutoff0, 0.06) : vary(cutoff1, 0.06), t0);
    lp.frequency.linearRampToValueAtTime(up ? vary(cutoff1, 0.06) : vary(cutoff0, 0.06), t0 + seg);
    lp.Q.setValueAtTime(vary(0.8, 0.08), t0);
    const g = createVoiceGain();
    const stopAt = applyADSR(g, t0, { a: 0.008, d: 0.06, s: 0.15, r: 0.06, amp: vary(gain, 0.08), peak: 1.0, hold: Math.max(0, seg - 0.02) });
    o.connect(lp).connect(g);
    o.start(t0);
    o.stop(stopAt);
  };

  const api = {
    resume() {
      const ac = ensureCtx();
      if (ac && ac.state === 'suspended') ac.resume().catch(() => {});
    },
    setMuted(v) {
      muted = !!v;
      const ac = ensureCtx();
      if (!ac || !masterGain) return;
      const t = ac.currentTime;
      const target = muted ? 0.0001 : 0.95;
      try {
        masterGain.gain.cancelScheduledValues(t);
        masterGain.gain.setValueAtTime(masterGain.gain.value || target, t);
        masterGain.gain.linearRampToValueAtTime(target, t + 0.02);
      } catch {}
    },
    tone(opts = {}) {
      // Optionally adjust master filter tone
      const ac = ensureCtx();
      if (!ac || !masterLPF) return;
      const { cutoff, q } = opts;
      const t = ac.currentTime;
      if (typeof cutoff === 'number') masterLPF.frequency.linearRampToValueAtTime(Math.max(200, cutoff), t + 0.02);
      if (typeof q === 'number') masterLPF.Q.linearRampToValueAtTime(Math.max(0.0001, q), t + 0.02);
    },
    play(kind) {
      // Try to resume context opportunistically; if browser blocks, it's harmless
      try { api.resume(); } catch {}
      switch (kind) {
        case 'hover':
          if (throttle('hover', 100)) return; // avoid spam on mousemove
          // Short filtered noise tick
          noiseTick({ dur: 0.03, gain: 0.04, center: 2500, q: 1.0 }); // louder
          break;
        case 'hover-pop':
          if (throttle('hover-pop', 90)) return;
          // Softer, darker hover for non-CTA pop-outs
          noiseTick({ dur: 0.03, gain: 0.034, center: 1900, q: 0.9 });
          break;
        case 'click':
          if (throttle('click', 80)) return;
          // Perceptual pluck, slightly muffled
          pluck({ freq: 520, dur: 0.08, gain: 0.05, cutoff: 1800, q: 0.9, detune: 5 });
          break;
        case 'click-soft':
          if (throttle('click-soft', 80)) return;
          // A bit softer and lower; use for secondary toggles
          pluck({ freq: 470, dur: 0.075, gain: 0.042, cutoff: 1600, q: 0.85, detune: 4 });
          break;
        case 'open':
          if (throttle('open', 120)) return;
          // Soft rise with filter opening
          glide({ up: true, base: 300, spread: 150, gain: 0.05, seg: 0.08, cutoff0: 1200, cutoff1: 2400 });
          break;
        case 'close':
          if (throttle('close', 120)) return;
          // Gentle fall with filter closing
          glide({ up: false, base: 300, spread: 150, gain: 0.048, seg: 0.07, cutoff0: 1200, cutoff1: 2400 });
          break;
        default:
          // noop
          break;
      }
    }
  };

  return api;
})();

export default SFX;
