import React, { useState, useEffect, useCallback } from 'react';
import './Components.css';

/* CertificatesCard
   Displays a list of course certificates with:
   - Course title
   - Toggle to preview certificate image
   - Optional external verification link
*/

const certificateData = [
  {
    id: 'unity-mastery',
    title: 'Complete C# Unity Game Developer 2D',
    provider: 'Udemy',
    image: '/certificates/udemy-placeholder.svg',
    verifyUrl: null,
    attachments: [
      { label: 'Design Notes', href: '/downloads/sample-summary.txt', type: 'text' }
    ],
    tags: ['Unity', 'C#', '2D']
  },
  {
    id: 'unreal-blueprints',
    title: 'Unreal Engine 5 Blueprints Developer',
    provider: 'Udemy',
    image: '/certificates/udemy-placeholder.svg',
    verifyUrl: null,
    attachments: [],
    tags: ['Unreal', 'Blueprints', 'UE5']
  }
];

const CertificatesCard = () => {
  const [openId, setOpenId] = useState(null);
  const [gridMode, setGridMode] = useState(false);
  const [lightbox, setLightbox] = useState({ open: false, src: null, title: '', scale: 1, x: 0, y: 0 });
  const [loaded, setLoaded] = useState({});
  const [providerFilter, setProviderFilter] = useState('All');
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = React.useRef({ startX: 0, startY: 0, originX: 0, originY: 0 });
  const lightboxImgWrapRef = React.useRef(null);
  const focusTrapRef = React.useRef(null);

  const toggle = (id) => setOpenId(prev => prev === id ? null : id);
  const toggleGrid = () => setGridMode(g => !g);

  const openLightbox = (src, title) => setLightbox({ open: true, src, title, scale: 1, x: 0, y: 0 });
  const closeLightbox = useCallback(() => setLightbox({ open: false, src: null, title: '', scale: 1, x: 0, y: 0 }), []);

  // Provider filter values
  const providers = React.useMemo(() => ['All', ...Array.from(new Set(certificateData.map(c => c.provider)))], []);

  const filteredCertificates = certificateData.filter(c => providerFilter === 'All' || c.provider === providerFilter);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (lightbox.open) {
        if (['+','='].includes(e.key)) setLightbox(l => ({ ...l, scale: Math.min(l.scale + 0.2, 4) }));
        if (['-','_'].includes(e.key)) setLightbox(l => ({ ...l, scale: Math.max(l.scale - 0.2, 1) }));
        if (e.key === '0') setLightbox(l => ({ ...l, scale: 1, x: 0, y: 0 }));
        const move = 40;
        if (e.key === 'ArrowLeft') setLightbox(l => ({ ...l, x: l.x + move }));
        if (e.key === 'ArrowRight') setLightbox(l => ({ ...l, x: l.x - move }));
        if (e.key === 'ArrowUp') setLightbox(l => ({ ...l, y: l.y + move }));
        if (e.key === 'ArrowDown') setLightbox(l => ({ ...l, y: l.y - move }));
        if (e.key === 'Tab') {
          // Focus trap
          const trap = focusTrapRef.current;
          if (trap) {
            const focusables = trap.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            const list = Array.from(focusables).filter(el => !el.disabled && el.offsetParent !== null);
            if (list.length) {
              const first = list[0];
              const last = list[list.length - 1];
              if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
              else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
            }
          }
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [closeLightbox, lightbox.open]);

  // Mouse drag for panning
  const onMouseDown = (e) => {
    if (!lightbox.open || lightbox.scale === 1) return;
    setIsDragging(true);
    dragRef.current.startX = e.clientX;
    dragRef.current.startY = e.clientY;
    dragRef.current.originX = lightbox.x;
    dragRef.current.originY = lightbox.y;
  };
  const onMouseMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    setLightbox(l => ({ ...l, x: dragRef.current.originX + dx, y: dragRef.current.originY + dy }));
  };
  const endDrag = () => setIsDragging(false);
  useEffect(() => {
    if (lightbox.open) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', endDrag);
      return () => { window.removeEventListener('mousemove', onMouseMove); window.removeEventListener('mouseup', endDrag); };
    }
  }, [lightbox.open, isDragging]);

  // Wheel zoom
  const onWheel = (e) => {
    if (!lightbox.open) return;
    e.preventDefault();
    setLightbox(l => {
      const delta = e.deltaY > 0 ? -0.15 : 0.15;
      const nextScale = Math.min(4, Math.max(1, l.scale + delta));
      return { ...l, scale: nextScale };
    });
  };

  const handleImageLoad = (id) => setLoaded(prev => ({ ...prev, [id]: true }));

  return (
    <div className="awards-card certificates-card">
      <div className="cert-header-bar">
        <h3 className="cert-heading">Course Certificates</h3>
        <button type="button" className="cert-grid-toggle" onClick={toggleGrid} aria-pressed={gridMode}>
          {gridMode ? 'List View' : 'Grid View'}
        </button>
      </div>
      <div className="cert-filter-bar" role="toolbar" aria-label="Certificate provider filter">
        {providers.map(p => (
          <button key={p} type="button" className={`cert-filter-btn ${providerFilter === p ? 'active' : ''}`} onClick={()=>setProviderFilter(p)} aria-pressed={providerFilter === p}>{p}</button>
        ))}
      </div>
      <div className={gridMode ? 'cert-grid' : 'cert-list'}>
        {filteredCertificates.map(cert => {
          const isOpen = openId === cert.id || gridMode; // grid forces visible
          return (
            <div key={cert.id} className={`cert-entry ${isOpen ? 'open' : ''} ${gridMode ? 'grid-item' : ''}`}>
              {!gridMode && (
                <button className="cert-toggle" onClick={() => toggle(cert.id)} aria-expanded={isOpen}>
                  <span className="cert-title">{cert.title}</span>
                  <span className="cert-indicator">{isOpen ? '−' : '+'}</span>
                </button>
              )}
              <div className="cert-panel" style={{maxHeight: isOpen ? '520px' : '0'}}>
                <div className="cert-inner">
                  {gridMode && <p className="cert-title grid-caption">{cert.title}</p>}
                  <p className="cert-provider"><strong>Provider:</strong> {cert.provider}</p>
                  {cert.verifyUrl && (
                    <p className="cert-verify"><a href={cert.verifyUrl} target="_blank" rel="noopener noreferrer">Verify Online</a></p>
                  )}
                  {cert.image && (
                    <div className={`cert-image-wrapper ${loaded[cert.id] ? 'loaded' : 'loading'}`} onClick={() => openLightbox(cert.image, cert.title)} role="button" tabIndex={0} onKeyDown={(e)=>{ if(e.key==='Enter'){openLightbox(cert.image, cert.title);} }}>
                      {!loaded[cert.id] && <div className="cert-skel" />}
                      <img src={cert.image} alt={cert.title + ' certificate'} loading="lazy" onLoad={()=>handleImageLoad(cert.id)} style={loaded[cert.id] ? {} : {opacity:0}} />
                      <div className="cert-zoom-hint">Click to enlarge</div>
                    </div>
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

      {lightbox.open && (
        <div className="cert-lightbox" role="dialog" aria-modal="true" onClick={closeLightbox} onWheel={onWheel} ref={focusTrapRef}>
          <div className="cert-lightbox-inner" onClick={(e)=>e.stopPropagation()}>
            <div className="cert-lightbox-toolbar">
              <button className="cert-lightbox-close" onClick={closeLightbox} aria-label="Close certificate preview">×</button>
              <div className="cert-lightbox-controls">
                <button onClick={()=>setLightbox(l=>({...l, scale: Math.max(1, l.scale - 0.2)}))} disabled={lightbox.scale<=1} aria-label="Zoom out">−</button>
                <button onClick={()=>setLightbox(l=>({...l, scale: Math.min(4, l.scale + 0.2)}))} aria-label="Zoom in">+</button>
                <button onClick={()=>setLightbox(l=>({...l, scale:1, x:0, y:0}))} aria-label="Reset zoom">Reset</button>
              </div>
            </div>
            <h4 className="cert-lightbox-title">{lightbox.title}</h4>
            <div
              className={`cert-lightbox-img-wrap ${isDragging ? 'dragging' : ''}`}
              ref={lightboxImgWrapRef}
              onMouseDown={onMouseDown}
              style={{ cursor: lightbox.scale>1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
            >
              <img
                src={lightbox.src}
                alt={lightbox.title + ' enlarged view'}
                style={{ transform: `translate(${lightbox.x}px, ${lightbox.y}px) scale(${lightbox.scale})`, transition: isDragging ? 'none' : 'transform 0.25s ease' }}
                draggable={false}
              />
            </div>
            <p className="cert-lightbox-hint">Scroll to zoom, drag to pan, +/- or 0 keys, arrows to pan.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificatesCard;
