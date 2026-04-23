// ============================================================
// SUSHI DEMURE — Navbar Component
// ============================================================

function Navbar({ t, lang, setLang, activeSection }) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { key: 'home', href: '#home' },
    { key: 'menu', href: '#menu' },
    { key: 'reserve', href: '#reservation' },
    { key: 'ai', href: '#chat' },
    { key: 'aiCall', href: '#voice' },
    { key: 'contact', href: '#contact' },
  ];

  const scrollTo = (href) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollTop !== undefined && window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
  };

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      background: scrolled ? 'rgba(14,28,20,0.97)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
      transition: 'all 0.4s ease',
      padding: '0 clamp(1rem,4vw,3rem)',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72 }}>
        {/* Logo */}
        <a href="#home" onClick={e => { e.preventDefault(); scrollTo('#home'); }} style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
            <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 700, color: '#f8f4ef', letterSpacing: '0.02em' }}>
              Sushi Demure
            </span>
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, color: 'var(--pink)', letterSpacing: '0.18em', textTransform: 'uppercase', marginTop: 2 }}>
              سوشي ديميور
            </span>
          </div>
        </a>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="desktop-nav">
          {navLinks.map(l => (
            <a key={l.key} href={l.href} onClick={e => { e.preventDefault(); scrollTo(l.href); }}
              style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'rgba(248,244,239,0.75)', textDecoration: 'none', letterSpacing: '0.04em', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = '#f8f4ef'}
              onMouseLeave={e => e.target.style.color = 'rgba(248,244,239,0.75)'}>
              {t.nav[l.key]}
            </a>
          ))}
        </div>

        {/* Right: Lang + CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }} className="desktop-nav">
          <button onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'var(--pink)', padding: '6px 14px', borderRadius: 20, fontFamily: 'DM Sans, sans-serif', fontSize: 13, cursor: 'pointer', transition: 'all 0.2s', letterSpacing: '0.04em' }}
            onMouseEnter={e => { e.target.style.background = 'rgba(240,184,200,0.1)'; e.target.style.borderColor = 'var(--pink)'; }}
            onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.borderColor = 'rgba(255,255,255,0.2)'; }}>
            {t.nav.langLabel}
          </button>
          <a href="#reservation" onClick={e => { e.preventDefault(); scrollTo('#reservation'); }}
            style={{ background: 'var(--pink)', color: 'var(--dark)', padding: '8px 20px', borderRadius: 24, fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 600, textDecoration: 'none', letterSpacing: '0.04em', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
            onMouseEnter={e => e.target.style.background = '#f5c8d5'}
            onMouseLeave={e => e.target.style.background = 'var(--pink)'}>
            {t.nav.bookNow}
          </a>
        </div>

        {/* Mobile hamburger */}
        <div style={{ display: 'none' }} className="mobile-nav-toggle">
          <button onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 8, display: 'flex', flexDirection: 'column', gap: 5 }}>
            {[0,1,2].map(i => (
              <span key={i} style={{ display: 'block', width: 24, height: 2, background: '#f8f4ef', borderRadius: 2,
                transform: menuOpen ? (i===0?'rotate(45deg) translate(5px,5px)':i===2?'rotate(-45deg) translate(5px,-5px)':'scaleX(0)') : 'none',
                transition: 'all 0.3s' }} />
            ))}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{ background: 'rgba(14,28,20,0.98)', backdropFilter: 'blur(12px)', padding: '1.5rem clamp(1rem,4vw,3rem) 2rem', borderTop: '1px solid rgba(255,255,255,0.08)' }} className="mobile-nav-panel">
          {navLinks.map(l => (
            <a key={l.key} href={l.href} onClick={e => { e.preventDefault(); scrollTo(l.href); }}
              style={{ display: 'block', fontFamily: 'DM Sans, sans-serif', fontSize: 18, color: '#f8f4ef', textDecoration: 'none', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {t.nav[l.key]}
            </a>
          ))}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 20, alignItems: 'stretch' }}>
            <button onClick={() => { setLang(lang === 'en' ? 'ar' : 'en'); setMenuOpen(false); }}
              style={{ width: '100%', minHeight: 50, background: 'transparent', border: '1px solid var(--pink)', color: 'var(--pink)', padding: '10px 14px', borderRadius: 24, fontFamily: 'DM Sans, sans-serif', fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', whiteSpace: 'nowrap' }}>
              {t.nav.langLabel}
            </button>
            <a href="#reservation" onClick={e => { e.preventDefault(); scrollTo('#reservation'); }}
              style={{ width: '100%', minHeight: 50, background: 'var(--pink)', color: 'var(--dark)', padding: '10px 14px', borderRadius: 24, fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', whiteSpace: 'nowrap' }}>
              {t.nav.bookNow}
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

Object.assign(window, { Navbar });
