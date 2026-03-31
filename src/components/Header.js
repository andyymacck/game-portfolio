import React from 'react';

const Header = () => {
  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <h1 className="text-3xl font-bold">Your Name</h1>
        <nav>
          <a href="#projects" className="px-4">Projects</a>
          <a href="#contact" className="px-4">Contact</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;