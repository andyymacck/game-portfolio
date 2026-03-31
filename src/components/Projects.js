import React from 'react';

const projects = [
  {
    title: "Game 1",
    description: "A fun platformer I made with Unity",
    image: "game1.png",
    gameLink: "#",
    sourceLink: "#"
  },
  // Add more projects here
];

const Projects = () => {
  return (
    <section id="projects" className="bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Featured Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project, index) => (
            <div key={index} className="bg-white p-4 shadow rounded">
              <img src={project.image} alt={project.title} className="w-full h-48 object-cover rounded mb-2" />
              <h3 className="text-lg font-medium">{project.title}</h3>
              <p>{project.description}</p>
              <div className="flex space-x-2 mt-2">
                <a href={project.gameLink} className="bg-blue-500 text-white px-3 py-1 rounded">Play Game</a>
                <a href={project.sourceLink} className="bg-gray-500 text-white px-3 py-1 rounded">Source Code</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;