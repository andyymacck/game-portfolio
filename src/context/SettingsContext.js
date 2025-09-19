import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const SettingsContext = createContext(null);

const LS_KEYS = { muteAudio: 'gp.muteAudio', psxDither: 'gp.psxDither', psxDitherTexture: 'gp.psxDitherTexture' };

export function SettingsProvider({ children }) {
  const [muteAudio, setMuteAudio] = useState(() => {
    const saved = localStorage.getItem(LS_KEYS.muteAudio);
    return saved !== null ? saved === 'true' : false;
  });
  // Always-on PSX dither and texture
  const [psxDither, setPsxDither] = useState(true);
  const [psxDitherTexture, setPsxDitherTexture] = useState(true);

  useEffect(() => {
    localStorage.setItem(LS_KEYS.muteAudio, String(muteAudio));
  }, [muteAudio]);

  useEffect(() => { localStorage.setItem(LS_KEYS.psxDither, 'true'); }, []);
  useEffect(() => { localStorage.setItem(LS_KEYS.psxDitherTexture, 'true'); }, []);

  const value = useMemo(() => ({ muteAudio, setMuteAudio, psxDither, psxDitherTexture }), [muteAudio, psxDither, psxDitherTexture]);

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
