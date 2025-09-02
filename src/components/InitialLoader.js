import React, { useEffect, useState } from 'react';

const InitialLoader = ({ visible, label = 'Booting...', onHidden }) => {
  const [mount, setMount] = useState(visible);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (visible) {
      setMount(true);
      setExiting(false);
    } else if (mount) {
      // start exit animation
      setExiting(true);
      const t = setTimeout(() => {
        setMount(false);
        setExiting(false);
        if (onHidden) onHidden();
      }, 520); // match CSS exit duration
      return () => clearTimeout(t);
    }
  }, [visible, mount, onHidden]);

  if (!mount) return null;

  return (
    <div className={`initial-loader ${exiting ? 'exiting' : 'entering'}`} role="status" aria-live="polite">
      {/* reuse the project's existing loading-overlay + loading-spinner styles */}
      <div className="loading-overlay">
        <div className="loading-spinner" aria-hidden="true"></div>
        <p>{label}</p>
      </div>
    </div>
  );
};

export default InitialLoader;
