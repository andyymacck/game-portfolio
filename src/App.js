import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import './components/Components.css';
import Navigation from './components/Navigation';
import Home from './components/Home';
import Contact from './components/Contact';

function App() {
  return (
    <Router basename={process.env.PUBLIC_URL}> {/* Ensures routes work when deployed under /game-portfolio */}
      <div className='portfolio-container'>
        <Navigation />
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
