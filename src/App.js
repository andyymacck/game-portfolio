import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Navigation from './components/Navigation';
import Home from './components/Home';
import Contact from './components/Contact';
import { LoaderProvider, useLoader } from './contexts/LoaderContext';

function AppContent() {
  const location = useLocation();
  const { showLoader, hideLoader } = useLoader();

  // initial boot
  React.useEffect(() => {
    showLoader('Booting...');
    const t = setTimeout(() => hideLoader(), 1200);
    return () => clearTimeout(t);
  }, [showLoader, hideLoader]);

  // show loader when navigating to /contact
  React.useEffect(() => {
    if (location.pathname === '/contact') {
      showLoader('Loading Contact...');
      const t = setTimeout(() => hideLoader(), 900);
      return () => clearTimeout(t);
    }
  }, [location, showLoader, hideLoader]);

  return (
    <div className='portfolio-container'>
      <Navigation />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/contact' element={<Contact />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <LoaderProvider>
        <AppContent />
      </LoaderProvider>
    </Router>
  );
}

export default App;
