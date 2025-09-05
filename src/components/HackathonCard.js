import React, { useState } from 'react';
import './Components.css';

/* HackathonCard: unified PS1 grey styling (matches about/awards) with:
   - Collapsible (details/summary) entries for individual jams
   - Image preview area (optional)
   - Download link for attached summary/file
   - Graceful empty states
*/

const jamData = [
  {
    id: 'quantum-shift',
    title: 'Game Jam Winner – Hackathon 2024',
    role: 'Lead Gameplay Programmer',
    tech: ['Unity', 'C#', 'ShaderGraph', 'DOTween'],
    desc: 'Built a reversible time mechanic with layered puzzle interactions and optimized object pooling under 48h constraints.',
    image: null,
    file: '/downloads/sample-summary.txt'
  },
  {
    id: 'ar-edu',
    title: 'AR Innovation Award – Tech Fest 2024',
    role: 'AR Systems Engineer',
    tech: ['Unity', 'AR Foundation', 'Azure'],
    desc: 'Created an augmented reality learning module with spatial quizzes and cloud-synced progress.',
    image: null,
    file: null
  },
  {
    id: 'endless-runner',
    title: 'Best Mobile Game – Global Game Jam 2024',
    role: 'Systems + Performance',
    tech: ['Unity', 'C#', 'Profiler', 'Addressables'],
    desc: 'Implemented procedural segment generator and adaptive difficulty curve for sustained engagement.',
    image: null,
    file: null
  }
];

const HackathonCard = () => {
  const [openId, setOpenId] = useState(null);

  const toggle = (id) => {
    setOpenId(prev => (prev === id ? null : id));
  };

  return (
    <div className="awards-card hackathon-card">
      <h3 style={{marginTop: 0, fontSize: '1.3rem', textAlign: 'center'}}>Hackathon / Game Jam Highlights</h3>
      <div className="hackathon-list">
        {jamData.map(jam => (
          <div key={jam.id} className={`hackathon-entry ${openId === jam.id ? 'open' : ''}`}>            
            <button className="hackathon-toggle" onClick={() => toggle(jam.id)} aria-expanded={openId === jam.id}>
              <span className="hackathon-title">{jam.title}</span>
              <span className="hackathon-indicator">{openId === jam.id ? '-' : '+'}</span>
            </button>
            <div className="hackathon-panel" style={{maxHeight: openId === jam.id ? '500px' : '0'}}>
              <div className="hackathon-inner">
                <p className="hackathon-role"><strong>Role:</strong> {jam.role}</p>
                <p className="hackathon-desc">{jam.desc}</p>
                {jam.tech && (
                  <div className="hackathon-tech">
                    {jam.tech.map(t => <span key={t}>{t}</span>)}
                  </div>
                )}
                {jam.image && (
                  <div className="hackathon-image-wrapper">
                    <img src={jam.image} alt={jam.title} />
                  </div>
                )}
                {jam.file && (
                  <a className="hackathon-download" href={jam.file} download>
                    Download Summary
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
        {jamData.length === 0 && (
          <p className="hackathon-empty">No hackathon entries yet.</p>
        )}
      </div>
    </div>
  );
};

export default HackathonCard;
