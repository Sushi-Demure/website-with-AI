// ============================================================
// SUSHI DEMURE — Contact Section + Footer
// ============================================================

function ContactSection({ t }) {
  return (
    <section id="contact" style={{ background: 'var(--dark-2)', padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--pink)', display: 'block', marginBottom: 12 }}>
            {t.contact.kicker}
          </span>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem,4vw,3.2rem)', color: 'var(--cream)', margin: '0 0 12px' }}>{t.contact.title}</h2>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 16, color: 'rgba(248,244,239,0.5)', margin: 0 }}>{t.contact.sub}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>

          {/* Contact card */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '2rem', display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, color: 'var(--cream)', marginBottom: 4 }}>
              {t.contact.infoCardTitle}
            </div>

            {/* Phone */}
            <a href="tel:+966537854826" style={{ display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none', group: true }}
              onMouseEnter={e => e.currentTarget.querySelector('span.label').style.color = 'var(--pink)'}
              onMouseLeave={e => e.currentTarget.querySelector('span.label').style.color = 'var(--cream)'}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(240,184,200,0.1)', border: '1px solid rgba(240,184,200,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>📞</div>
              <div>
                <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'rgba(248,244,239,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>{t.contact.phoneLabel}</div>
                <span className="label" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: 'var(--cream)', transition: 'color 0.2s' }}>{t.contact.phone}</span>
              </div>
            </a>

            {/* WhatsApp */}
            <a href="https://wa.me/966537854826" target="_blank" rel="noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none', background: 'rgba(37,211,102,0.08)', border: '1px solid rgba(37,211,102,0.2)', borderRadius: 14, padding: '12px 16px', transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(37,211,102,0.15)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(37,211,102,0.08)'}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#25d366', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>💬</div>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: '#25d366', fontWeight: 500 }}>{t.contact.whatsapp}</span>
            </a>

            {/* Instagram */}
            <a href="https://instagram.com/sushi_demure" target="_blank" rel="noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none', transition: 'opacity 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: 'linear-gradient(135deg,#f9a825,#e91e8c,#9c27b0)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>📷</div>
              <div>
                <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'rgba(248,244,239,0.4)', textTransform: t.lang === 'ar' ? 'none' : 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>{t.contact.instagramLabel}</div>
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: 'var(--cream)' }}>{t.contact.instagram}</span>
              </div>
            </a>

            {/* Hours */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 16 }}>
              <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'rgba(248,244,239,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{t.contact.hours}</div>
              <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: 'var(--cream)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: '#7dcea0' }}>●</span> {t.contact.hoursVal}
              </div>
            </div>
          </div>

          {/* Branches */}
          <div style={{ background: 'var(--green)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '2rem' }}>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, color: 'var(--cream)', marginBottom: 24 }}>{t.contact.branches}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {t.contact.branchList.map((branch, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 14, padding: '16px', display: 'flex', alignItems: 'center', gap: 14, border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(240,184,200,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>📍</div>
                  <div>
                    <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--cream)', fontWeight: 500 }}>{branch}</div>
                    <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'rgba(248,244,239,0.45)', marginTop: 3 }}>
                      {t.contact.openNow}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Map placeholder */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.12)', borderRadius: 20, overflow: 'hidden', minHeight: 280, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            {/* Fake map grid */}
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.07 }} xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="mapgrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M40 0 L0 0 L0 40" fill="none" stroke="#f8f4ef" strokeWidth="0.8"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#mapgrid)"/>
            </svg>
            <div style={{ textAlign: 'center', zIndex: 1 }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>🗺️</div>
              <div style={{ fontFamily: 'monospace', fontSize: 13, color: 'rgba(248,244,239,0.3)' }}>{t.contact.mapPlaceholder}</div>
              <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, color: 'rgba(248,244,239,0.2)', marginTop: 4 }}>{t.contact.mapEmbedHint}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Footer ───────────────────────────────────────────────────

function Footer({ t, lang, setLang }) {
  const scrollTo = (href) => {
    const el = document.querySelector(href);
    if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
  };

  const links = [
    { label: t.nav.home, href: '#home' },
    { label: t.nav.menu, href: '#menu' },
    { label: t.nav.reserve, href: '#reservation' },
    { label: t.nav.ai, href: '#chat' },
    { label: t.nav.contact, href: '#contact' },
  ];

  return (
    <footer style={{ background: 'var(--dark)', borderTop: '1px solid rgba(255,255,255,0.07)', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem) 2rem' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: 48, marginBottom: 48 }}>
          {/* Brand */}
          <div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, fontWeight: 700, color: 'var(--cream)', marginBottom: 6 }}>Sushi Demure</div>
            <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--pink)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 14 }}>سوشي ديميور</div>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'rgba(248,244,239,0.45)', lineHeight: 1.7, maxWidth: 240, marginBottom: 20 }}>
              {t.footer.brandLine}
            </p>
            <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'rgba(248,244,239,0.3)', lineHeight: 1.6 }}>{t.footer.delivery}</div>
          </div>

          {/* Quick links */}
          <div>
            <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'rgba(248,244,239,0.4)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 20 }}>{t.footer.links}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {links.map(l => (
                <a key={l.href} href={l.href} onClick={e => { e.preventDefault(); scrollTo(l.href); }}
                  style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'rgba(248,244,239,0.55)', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = 'var(--cream)'}
                  onMouseLeave={e => e.target.style.color = 'rgba(248,244,239,0.55)'}>
                  {l.label}
                </a>
              ))}
            </div>
          </div>

          {/* Social */}
          <div>
            <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'rgba(248,244,239,0.4)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 20 }}>{t.footer.social}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { icon: '📷', label: t.footer.socialInstagram, href: 'https://instagram.com/sushi_demure' },
                { icon: '🐦', label: t.footer.socialX, href: 'https://x.com/sushi_demure' },
                { icon: '💬', label: t.footer.socialWhatsApp, href: 'https://wa.me/966537854826' },
              ].map(s => (
                <a key={s.href} href={s.href} target="_blank" rel="noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'rgba(248,244,239,0.55)', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--cream)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(248,244,239,0.55)'}>
                  <span style={{ fontSize: 16 }}>{s.icon}</span> {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'rgba(248,244,239,0.4)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 20 }}>{t.footer.contact}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'rgba(248,244,239,0.55)' }}>{t.contact.phone}</div>
              <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'rgba(248,244,239,0.55)' }}>{t.contact.hoursVal}</div>
              {t.contact.branchList.map((b, i) => (
                <div key={i} style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'rgba(248,244,239,0.4)' }}>✦ {b}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 24, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
          <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'rgba(248,244,239,0.3)' }}>{t.footer.copy}</span>
          <button onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: 'var(--pink)', padding: '6px 16px', borderRadius: 20, fontFamily: 'DM Sans, sans-serif', fontSize: 13, cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => e.target.style.borderColor = 'var(--pink)'}
            onMouseLeave={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}>
            {t.nav.langLabel}
          </button>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { ContactSection, Footer });
