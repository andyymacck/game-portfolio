import React, { createContext, useCallback, useContext, useState } from 'react';
import InitialLoader from '../components/InitialLoader';

const LoaderContext = createContext(null);

export const LoaderProvider = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [label, setLabel] = useState('Booting...');

  const showLoader = useCallback((opts) => {
    if (!opts) opts = {};
    const lbl = typeof opts === 'string' ? opts : opts.label || 'Loading...';
    setLabel(lbl);
    setVisible(true);
  }, []);

  const hideLoader = useCallback(() => {
    setVisible(false);
  }, []);

  return (
    <LoaderContext.Provider value={{ showLoader, hideLoader }}>
      {children}
      <InitialLoader visible={visible} label={label} />
    </LoaderContext.Provider>
  );
};

export const useLoader = () => {
  const ctx = useContext(LoaderContext);
  if (!ctx) throw new Error('useLoader must be used within LoaderProvider');
  return ctx;
};

export default LoaderContext;
