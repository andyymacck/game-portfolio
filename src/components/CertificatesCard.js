import React, { useState, useEffect, useCallback } from 'react';
import SFX from '../utils/sfx';
import assets from '../assetsMap';
import pub from '../utils/pub';
import './Components.css';

/* CertificatesCard
   Displays a list of course certificates with:
   - Course title
   - Toggle to preview certificate image
   - Optional external verification link
*/

const certificateData = [
  {
    id: 'cpp-ue4-unit1',
    title: 'Learn C++ For UE4',
    provider: 'Udemy',
    image: `${process.env.PUBLIC_URL}/UdemyCertCpp.jpg`,
    verifyUrl: 'https://www.udemy.com/course/learn-cpp-for-ue4-unit-1/learn/lecture/11004214?start=60#overview',
    attachments: [],
    tags: ['C++', 'Unreal Engine', 'UE4']
  }
];

console.log('Certificate image path:', `${process.env.PUBLIC_URL}/UdemyCertCpp.jpg`); // Debug log

const CertificatesCard = () => {
  const [openId, setOpenId] = useState(null);
  const [expandedImage, setExpandedImage] = useState({ open: false, certId: null, scale: 1, x: 0, y: 0 });
  const [loaded, setLoaded] = useState({});
  const [providerFilter, setProviderFilter] = useState('All');
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = React.useRef({ startX: 0, startY: 0, originX: 0, originY: 0 });
  const lightboxImgWrapRef = React.useRef(null);
  const focusTrapRef = React.useRef(null);

  const toggle = (id) => {
    setOpenId(prev => {
      const next = prev === id ? null : id;
      SFX.play(next ? 'open' : 'close');
      return next;
    });
  };

  const expandImage = (certId) => setExpandedImage({ open: true, certId, scale: 1, x: 0, y: 0 });
  const closeExpandedImage = useCallback(() => setExpandedImage({ open: false, certId: null, scale: 1, x: 0, y: 0 }), []);

  // Provider filter values
  const providers = React.useMemo(() => ['All', ...Array.from(new Set(certificateData.map(c => c.provider)))], []);

  const filteredCertificates = certificateData.filter(c => providerFilter === 'All' || c.provider === providerFilter);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') closeExpandedImage();
      if (expandedImage.open) {
        if (['+','='].includes(e.key)) setExpandedImage(l => ({ ...l, scale: Math.min(l.scale + 0.2, 4) }));
        if (['-','_'].includes(e.key)) setExpandedImage(l => ({ ...l, scale: Math.max(l.scale - 0.2, 1) }));
        if (e.key === '0') setExpandedImage(l => ({ ...l, scale: 1, x: 0, y: 0 }));
        const move = 40;
        if (e.key === 'ArrowLeft') setExpandedImage(l => ({ ...l, x: l.x + move }));
        if (e.key === 'ArrowRight') setExpandedImage(l => ({ ...l, x: l.x - move }));
        if (e.key === 'ArrowUp') setExpandedImage(l => ({ ...l, y: l.y + move }));
        if (e.key === 'ArrowDown') setExpandedImage(l => ({ ...l, y: l.y - move }));
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [closeExpandedImage, expandedImage.open]);

  // Disable body scroll when overlay is open
  useEffect(() => {
    if (expandedImage.open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [expandedImage.open]);

  // Close overlay on scroll attempt
  useEffect(() => {
    if (!expandedImage.open) return;
    
    const handleScroll = (e) => {
      // Close on any scroll attempt when overlay is open
      e.preventDefault();
      SFX.play('close');
      closeExpandedImage();
    };

    // Listen for wheel events on the document
    document.addEventListener('wheel', handleScroll, { passive: false });
    
    return () => {
      document.removeEventListener('wheel', handleScroll);
    };
  }, [expandedImage.open, closeExpandedImage]);

  // Mouse drag for panning
  const onMouseDown = (e) => {
    if (!expandedImage.open || expandedImage.scale === 1) return;
    setIsDragging(true);
    dragRef.current.startX = e.clientX;
    dragRef.current.startY = e.clientY;
    dragRef.current.originX = expandedImage.x;
    dragRef.current.originY = expandedImage.y;
  };
  const onMouseMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    setExpandedImage(l => ({ ...l, x: dragRef.current.originX + dx, y: dragRef.current.originY + dy }));
  };
  const endDrag = () => setIsDragging(false);
  useEffect(() => {
    if (expandedImage.open) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', endDrag);
      return () => { window.removeEventListener('mousemove', onMouseMove); window.removeEventListener('mouseup', endDrag); };
    }
  }, [expandedImage.open, isDragging]);

  // Wheel zoom
  const onWheel = (e) => {
    if (!expandedImage.open) return;
    e.preventDefault();
    setExpandedImage(l => {
      const delta = e.deltaY > 0 ? -0.15 : 0.15;
      const nextScale = Math.min(4, Math.max(1, l.scale + delta));
      return { ...l, scale: nextScale };
    });
  };

  const handleImageLoad = (id) => setLoaded(prev => ({ ...prev, [id]: true }));

  return (
    <div className="awards-card certificates-card">
      <div className="cert-filter-bar" role="toolbar" aria-label="Certificate provider filter">
        {providers.map(p => (
          <button key={p} type="button" className={`cert-filter-btn ${providerFilter === p ? 'active' : ''}`} onMouseOver={()=>SFX.play('hover-pop')} onClick={()=>{ SFX.play('click-soft'); setProviderFilter(p); }} aria-pressed={providerFilter === p}>{p}</button>
        ))}
      </div>
      <div className="cert-list">
        {filteredCertificates.map(cert => {
          const isOpen = openId === cert.id;
          console.log('Rendering cert:', cert.id, 'isOpen:', isOpen, 'hasImage:', !!cert.image);
          return (
            <div key={cert.id} className={`cert-entry ${isOpen ? 'open' : ''}`}>
              <button className="cert-toggle" onMouseOver={()=>SFX.play('hover-pop')} onClick={() => { SFX.play('click-soft'); toggle(cert.id); }} aria-expanded={isOpen}>
                <span className="cert-title">{cert.title}</span>
                <span className="cert-indicator">{isOpen ? '−' : '+'}</span>
              </button>
              
              {/* Certificate image displayed when panel is open */}
              {cert.image && isOpen && (
                <div className={`cert-image-wrapper cert-image-fixed ${loaded[cert.id] ? 'loaded' : 'loading'}`} onMouseOver={()=>SFX.play('hover')} onClick={() => { SFX.play('open'); expandImage(cert.id); }} role="button" tabIndex={0} onKeyDown={(e)=>{ if(e.key==='Enter'){ SFX.play('open'); expandImage(cert.id);} }}>
                  {!loaded[cert.id] && <div className="cert-skel" />}
                  <img 
                    src={cert.image} 
                    alt={cert.title + ' certificate'} 
                    loading="lazy" 
                    onLoad={()=>{console.log('Certificate image loaded successfully!'); handleImageLoad(cert.id);}} 
                    onError={(e)=>{ 
                      console.log('Certificate image failed to load:', e.target.src);
                      e.currentTarget.onerror=null; 
                      e.currentTarget.src = `${process.env.PUBLIC_URL}/certificates/udemy-placeholder.svg`; 
                    }} 
                    style={loaded[cert.id] ? {} : {opacity:0}} 
                  />
                  <div className="cert-zoom-hint">Click to enlarge</div>
                </div>
              )}
              
              <div className="cert-panel" style={{maxHeight: isOpen ? '520px' : '0'}}>
                <div className="cert-inner">
                  <p className="cert-provider"><strong>Provider:</strong> {cert.provider}</p>
                  {cert.verifyUrl && (
                    <p className="cert-verify"><a href={cert.verifyUrl} target="_blank" rel="noopener noreferrer">Verify Online</a></p>
                  )}
                  {cert.attachments && cert.attachments.length > 0 && (
                    <div className="cert-attachments">
                      {cert.attachments.map(a => (
                        <a key={a.label} href={a.href} className="cert-attachment-link" target="_blank" rel="noopener noreferrer">{a.label}</a>
                      ))}
                    </div>
                  )}
                  {cert.tags && cert.tags.length > 0 && (
                    <div className="cert-tags">{cert.tags.map(t => <span key={t}>{t}</span>)}</div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {filteredCertificates.length === 0 && (
          <p className="cert-empty">No certificates added yet.</p>
        )}
      </div>
      
      {/* Certificate image overlay modal - appears outside card */}
      {expandedImage.open && (
        <div className="cert-lightbox" onClick={(e) => {
          if (e.target === e.currentTarget) {
            SFX.play('close');
            closeExpandedImage();
          }
        }}>
          <div className="cert-lightbox-inner" onClick={(e) => e.stopPropagation()}>
            <button className="cert-lightbox-close" onMouseOver={()=>SFX.play('hover-pop')} onClick={()=>{ SFX.play('close'); closeExpandedImage(); }} aria-label="Close certificate view">×</button>
            <h3 className="cert-lightbox-title">
              {filteredCertificates.find(c => c.id === expandedImage.certId)?.title}
            </h3>
            <div className="cert-expanded-controls">
              <button onMouseOver={()=>SFX.play('hover-pop')} onClick={()=>{ SFX.play('click-soft'); setExpandedImage(l=>({...l, scale: Math.max(1, l.scale - 0.2)})); }} disabled={expandedImage.scale<=1} aria-label="Zoom out">−</button>
              <button onMouseOver={()=>SFX.play('hover-pop')} onClick={()=>{ SFX.play('click-soft'); setExpandedImage(l=>({...l, scale: Math.min(4, l.scale + 0.2)})); }} aria-label="Zoom in">+</button>
              <button onMouseOver={()=>SFX.play('hover-pop')} onClick={()=>{ SFX.play('click-soft'); setExpandedImage(l=>({...l, scale:1, x:0, y:0})); }} aria-label="Reset zoom">Reset</button>
            </div>
            <div 
              className={`cert-lightbox-img-wrap ${isDragging ? 'dragging' : ''}`}
              onMouseDown={onMouseDown}
              onWheel={onWheel}
              style={{ cursor: expandedImage.scale>1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
            >
              <img
                src={filteredCertificates.find(c => c.id === expandedImage.certId)?.image}
                alt="Certificate enlarged view"
                style={{ 
                  transform: `translate(${expandedImage.x}px, ${expandedImage.y}px) scale(${expandedImage.scale})`, 
                  transition: isDragging ? 'none' : 'transform 0.25s ease' 
                }}
                draggable={false}
              />
            </div>
            <p className="cert-expanded-hint">Scroll to zoom, drag to pan, +/- or 0 keys, arrows to pan, ESC to close.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificatesCard;
