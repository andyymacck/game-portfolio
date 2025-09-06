import React, { useState } from 'react';
import SFX from '../utils/sfx';
import './Components.css';
import assets from '../assetsMap';

/* HackathonCard: unified PS1 grey styling (matches about/awards) with:
   - Collapsible (details/summary) entries for individual jams
   - Image preview area (optional)
   - Download link for attached summary/file
   - Graceful empty states
*/

const HACKATHON_PLACEHOLDER = assets.hackathon.placeholder;

const jamData = [
  {
    id: 'toyz-cars-uefn',
    title: 'Hackathon Project: Toyz Cars UEFN Final',
    author: 'By Andrew Mackay, Athabasca University',
    tech: ['UEFN', 'Unreal Engine', 'Fortnite'],
    writeup: [
      'For this hackathon, I developed a racing experience in Unreal Editor for Fortnite (UEFN) while exploring both gameplay design principles and engine-specific workflows. Working with my teammate Wole, we imported Toyz assets, built a racetrack, and implemented the core racing mechanics to create a playable prototype within the event’s timeframe. Along the way, I gained practical insight into UEFN’s version control system—its asset locking, in-editor syncing, and live testing—while also troubleshooting issues such as strict asset naming conventions that temporarily blocked progress.',
      'Although time limited our scope, I designed additional features including post-race teleporters for social areas, a dynamic weather system triggered by gameplay events, cinematic cutscenes, and a proposal for Epic to enable deep linking between Fortnite islands. These plans reflect the potential for the project to grow into a more immersive, modular experience.',
      'Ultimately, the hackathon reinforced the importance of prioritizing core mechanics before polish, while also showing the strengths and constraints of UEFN compared to other engines. The project stands as a proof of concept racing game and provided valuable lessons in both rapid prototyping and cross-engine design thinking.'
    ],
  image: assets.hackathon.image,
  // Replace with your provided document (pdf/zip). A temporary .txt is created for now.
  file: assets.hackathon.download
  }
];

const HackathonCard = () => {
  const [openId, setOpenId] = useState(null);

  const toggle = (id) => {
    setOpenId(prev => {
      const next = prev === id ? null : id;
      SFX.play(next ? 'open' : 'close');
      return next;
    });
  };

  console.log('Hackathon image path:', assets.hackathon.image); // Debug log
  console.log('Process.env.PUBLIC_URL:', process.env.PUBLIC_URL); // Debug log

  return (
    <div className="awards-card hackathon-card">
      <div className="hackathon-list">
        {jamData.map(jam => (
          <div key={jam.id} className={`hackathon-entry ${openId === jam.id ? 'open' : ''}`}>            
            <button className="hackathon-toggle" onMouseOver={()=>SFX.play('hover-pop')} onClick={() => { SFX.play('click-soft'); toggle(jam.id);} } aria-expanded={openId === jam.id}>
              <span className="hackathon-title">{jam.title}</span>
              <span className="hackathon-indicator">{openId === jam.id ? '-' : '+'}</span>
            </button>
            
            {/* Simple image display - test with multiple fallback paths */}
            {jam.image && (
              <div className="hackathon-image-wrapper">
                <img
                  src={`${process.env.PUBLIC_URL}/toyz-cars.jpg`}
                  alt={jam.title}
                  onError={(e) => {
                    console.log('Primary image failed, trying fallback...');
                    if (e.target.src.includes('toyz-cars.jpg')) {
                      e.target.src = `${process.env.PUBLIC_URL}/certificates/udemy-placeholder.svg`;
                    }
                  }}
                  onLoad={() => console.log('Image loaded successfully!')}
                />
              </div>
            )}
            
            <div className="hackathon-panel" style={{maxHeight: openId === jam.id ? '2000px' : '0'}}>
              <div className="hackathon-inner">
                {jam.author && (
                  <p className="hackathon-author">{jam.author}</p>
                )}
                {Array.isArray(jam.writeup) && jam.writeup.length > 0 ? (
                  jam.writeup.map((p, i) => (
                    <p key={i} className="hackathon-desc">{p}</p>
                  ))
                ) : (
                  jam.desc && <p className="hackathon-desc">{jam.desc}</p>
                )}
                {jam.tech && (
                  <div className="hackathon-tech">
                    {jam.tech.map(t => <span key={t}>{t}</span>)}
                  </div>
                )}
                {jam.file && (
                  <a className="hackathon-download" href={jam.file} download onMouseOver={()=>SFX.play('hover')} onClick={()=>SFX.play('click')}>
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
