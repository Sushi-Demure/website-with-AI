// ============================================================
// SUSHI DEMURE — Hero + About + Why Us + AI Section
// ============================================================

function HeroSection({ t }) {
  const { setOpen: setOrderOpen } = window.useOrderCart();
  const [heroIn, setHeroIn] = React.useState(false);

  React.useEffect(() => {
    const id = setTimeout(() => setHeroIn(true), 120);
    return () => clearTimeout(id);
  }, []);

  const scrollTo = (href) => {
    const el = document.querySelector(href);
    if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
  };

  return (
    <section id="home" style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden', background: 'var(--dark)' }}>
      {/* Hero background image */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <img src="https://picsum.photos/seed/sushihero/1800/1000" alt="" style={{ width:'100%', height:'100%', objectFit:'cover', opacity: 0.18, animation:'heroPan 18s ease-in-out infinite alternate', transformOrigin:'center' }} />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg, rgba(15,31,23,0.97) 0%, rgba(15,31,23,0.75) 50%, rgba(30,61,42,0.85) 100%)' }}/>
      </div>

      {/* Subtle grid pattern */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.03, zIndex: 1 }}>
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs><pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <circle cx="30" cy="30" r="1" fill="#f8f2ea"/>
          </pattern></defs>
          <rect width="100%" height="100%" fill="url(#grid)"/>
        </svg>
      </div>

      {/* Pink glow top-right */}
      <div style={{ position:'absolute', top:'-10%', right:'-5%', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle, rgba(242,184,198,0.12) 0%, transparent 70%)', zIndex:1, pointerEvents:'none', animation:'heroGlowPulse 9s ease-in-out infinite' }}/>
      {/* Green glow bottom-left */}
      <div style={{ position:'absolute', bottom:'-10%', left:'-5%', width:600, height:600, borderRadius:'50%', background:'radial-gradient(circle, rgba(30,61,42,0.5) 0%, transparent 70%)', zIndex:1, pointerEvents:'none', animation:'heroGlowPulse 11s ease-in-out infinite reverse' }}/>

      <div style={{ maxWidth:1280, margin:'0 auto', padding:'0 clamp(1.5rem,5vw,4rem)', width:'100%', paddingTop:140, paddingBottom:100, position:'relative', zIndex:2 }}>
        <div style={{ maxWidth:800 }}>
          {/* Eyebrow */}
          <div style={{ display:'inline-flex', alignItems:'center', gap:12, marginBottom:32, background:'rgba(242,184,198,0.08)', border:'1px solid rgba(242,184,198,0.2)', borderRadius:32, padding:'6px 18px', opacity: heroIn ? 1 : 0, transform: heroIn ? 'none' : 'translateY(18px)', transition:'all 700ms cubic-bezier(0.22,1,0.36,1)' }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background:'var(--pink)', display:'inline-block' }}/>
            <span style={{ fontFamily:'DM Sans,sans-serif', fontSize:12, letterSpacing:'0.2em', textTransform:'uppercase', color:'var(--pink)', fontWeight:500 }}>
              {t.hero.locationsLine}
            </span>
          </div>

          {/* Headline */}
          <h1 style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(3.2rem,7.5vw,6.5rem)', fontWeight:700, color:'var(--cream)', lineHeight:1.05, margin:'0 0 28px', textWrap:'pretty' }}>
            <span style={{ display:'block', opacity: heroIn ? 1 : 0, transform: heroIn ? 'none' : 'translateY(26px)', transition:'all 860ms cubic-bezier(0.22,1,0.36,1) 80ms' }}>{t.hero.tagline}</span>
            <span style={{ display:'block', color:'var(--pink)', fontStyle:'italic', opacity: heroIn ? 1 : 0, transform: heroIn ? 'none' : 'translateY(26px)', transition:'all 860ms cubic-bezier(0.22,1,0.36,1) 180ms' }}>{t.hero.tagline2}</span>
          </h1>

          <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:'clamp(1rem,1.8vw,1.2rem)', color:'rgba(248,242,234,0.65)', maxWidth:540, lineHeight:1.8, marginBottom:52, opacity: heroIn ? 1 : 0, transform: heroIn ? 'none' : 'translateY(22px)', transition:'all 760ms cubic-bezier(0.22,1,0.36,1) 260ms' }}>
            {t.hero.sub}
          </p>

          {/* CTAs */}
          <div style={{ display:'flex', flexWrap:'wrap', gap:14, opacity: heroIn ? 1 : 0, transform: heroIn ? 'none' : 'translateY(22px)', transition:'all 760ms cubic-bezier(0.22,1,0.36,1) 340ms' }}>
            <button onClick={() => scrollTo('#reservation')}
              style={{ background:'var(--pink)', color:'#0f1f17', padding:'15px 36px', borderRadius:40, border:'none', fontFamily:'DM Sans,sans-serif', fontSize:15, fontWeight:700, cursor:'pointer', letterSpacing:'0.04em', transition:'all 0.25s', boxShadow:'0 8px 40px rgba(242,184,198,0.3)' }}
              onMouseEnter={e => { e.target.style.transform='translateY(-3px)'; e.target.style.boxShadow='0 14px 48px rgba(242,184,198,0.4)'; }}
              onMouseLeave={e => { e.target.style.transform='none'; e.target.style.boxShadow='0 8px 40px rgba(242,184,198,0.3)'; }}>
              {t.hero.cta1}
            </button>
            <button
              type="button"
              onClick={() => { setOrderOpen(true); scrollTo('#menu'); }}
              style={{ background:'rgba(242,184,198,0.12)', color:'var(--pink)', padding:'15px 36px', borderRadius:40, border:'1.5px solid rgba(242,184,198,0.35)', fontFamily:'DM Sans,sans-serif', fontSize:15, fontWeight:600, cursor:'pointer', letterSpacing:'0.04em', transition:'all 0.25s', backdropFilter:'blur(8px)' }}
              onMouseEnter={e => { e.target.style.background='rgba(242,184,198,0.2)'; e.target.style.borderColor='var(--pink)'; }}
              onMouseLeave={e => { e.target.style.background='rgba(242,184,198,0.12)'; e.target.style.borderColor='rgba(242,184,198,0.35)'; }}
            >
              {t.hero.orderNow}
            </button>
            <button onClick={() => scrollTo('#chat')}
              style={{ background:'rgba(242,184,198,0.08)', color:'var(--pink)', padding:'15px 36px', borderRadius:40, border:'1.5px solid rgba(242,184,198,0.35)', fontFamily:'DM Sans,sans-serif', fontSize:15, fontWeight:500, cursor:'pointer', letterSpacing:'0.04em', transition:'all 0.25s', backdropFilter:'blur(8px)' }}
              onMouseEnter={e => { e.target.style.background='rgba(242,184,198,0.15)'; e.target.style.borderColor='var(--pink)'; }}
              onMouseLeave={e => { e.target.style.background='rgba(242,184,198,0.08)'; e.target.style.borderColor='rgba(242,184,198,0.35)'; }}>
              {t.hero.cta2}
            </button>
            <button onClick={() => scrollTo('#menu')}
              style={{ background:'rgba(255,255,255,0.05)', color:'var(--cream)', padding:'15px 36px', borderRadius:40, border:'1.5px solid rgba(255,255,255,0.12)', fontFamily:'DM Sans,sans-serif', fontSize:15, cursor:'pointer', letterSpacing:'0.04em', transition:'all 0.25s', backdropFilter:'blur(8px)' }}
              onMouseEnter={e => e.target.style.background='rgba(255,255,255,0.1)'}
              onMouseLeave={e => e.target.style.background='rgba(255,255,255,0.05)'}>
              {t.hero.cta3}
            </button>
          </div>

          {/* Scroll hint */}
          <div style={{ marginTop:80, display:'flex', alignItems:'center', gap:14, opacity: heroIn ? 0.35 : 0, transform: heroIn ? 'none' : 'translateY(18px)', transition:'all 760ms cubic-bezier(0.22,1,0.36,1) 460ms' }}>
            <div style={{ width:1, height:52, background:'linear-gradient(to bottom, var(--pink), transparent)' }}/>
            <span style={{ fontFamily:'DM Sans,sans-serif', fontSize:11, letterSpacing:'0.2em', textTransform:'uppercase', color:'var(--cream)' }}>{t.hero.scroll}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Featured Dishes ──────────────────────────────────────────

// “Our Story” / art column — local brand asset
const ART_SECTION_IMAGE = 'img/ArtSection.png';

// HungerStation / Delivery Hero menu imagery (order: Sushi Demure, Special Volcano, Ocean Roll, Sushi Cake)
const FEATURED = [
  { nameEn: 'Sushi Demure', nameAr: 'سوشي ديميور', descEn: 'Special maki with choice of filling, Japanese mayo, and sriracha.', descAr: 'ماكي مميّزة بحشوٍ اختياري ومايونيز ياباني وسيراتشا.', tagEn: 'Signature', tagAr: 'توقيع', price: 55, calories: 50, color: '#2d5a40', img: 'https://images.deliveryhero.io/image/menu-import-gateway-prd/regions/ME/chains/HS-SUSHI/5539d9d18d366867e1583f3b18046036.png?quality=75&webp=true&width=1440' },
  { nameEn: 'Special Volcano', nameAr: 'سبيشال فولكينو', descEn: 'Shrimp, avocado, cucumber, bang bang sauce, and crunchy cornflakes.', descAr: 'روبيان، أفوكادو، خيار، صلصة بانج بانج، وذرة رقائق مقرمشة.', tagEn: 'Best Seller', tagAr: 'الأكثر طلباً', price: 30, calories: 33, color: '#3a4a2d', img: 'https://images.deliveryhero.io/image/menu-import-gateway-prd/regions/ME/chains/HS-SUSHI/35afc2d1621505913d3465c3cf603d63.png?quality=75&webp=true&width=1440' },
  { nameEn: 'Ocean Roll', nameAr: 'أوشن رول', descEn: 'Crispy shrimp tempura with Japanese eel sauce; rich smoky taste.', descAr: 'روبيان تمبورا مقرمش بصلصة الأنقليس اليابانية؛ نكهة غنية مائلة للدخان.', tagEn: 'Premium', tagAr: 'فاخر', price: 28, calories: 61, color: '#2d3a5a', img: 'https://images.deliveryhero.io/image/menu-import-gateway-prd/regions/ME/chains/HS-SUSHI/777b800259064f521d6e81cceca1b432.jpg?quality=75&webp=true&width=1440' },
  { nameEn: 'Sushi Cake 3 Persons', nameAr: 'كيكة السوشي (٣ أشخاص)', descEn: 'Sushi cake signature item, first time in Riyadh.', descAr: 'كيكة سوشي مميّزة، تُقدَّم لأول مرة في الرياض.', tagEn: 'New', tagAr: 'جديد', price: 299, calories: 1590, color: '#5a2d45', img: 'https://images.deliveryhero.io/image/menu-import-gateway-prd/regions/ME/chains/HS-SUSHI/4a11cb3698ac3d65404c1e3f8b43ebd0.png?quality=75&webp=true&width=1440' },
];

function FeaturedSection({ t }) {
  return (
    <section id="featured" style={{ background: 'var(--dark-2)', padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, letterSpacing: '0.22em', textTransform: t.lang === 'ar' ? 'none' : 'uppercase', color: 'var(--pink)', display: 'block', marginBottom: 12 }}>
            {t.featured.mostOrdered}
          </span>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem,4vw,3.2rem)', color: 'var(--cream)', margin: '0 0 12px' }}>{t.featured.title}</h2>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 16, color: 'rgba(248,244,239,0.5)', margin: 0 }}>{t.featured.sub}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
          {FEATURED.map((d, i) => (
            <div key={i} style={{ background: d.color, borderRadius: 20, padding: '2rem', position: 'relative', overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.3s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-6px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
              {/* Dish image */}
              <div style={{ width: '100%', aspectRatio: '4/3', background: 'rgba(0,0,0,0.3)', borderRadius: 14, marginBottom: 20, overflow: 'hidden', position: 'relative' }}>
                {d.img
                  ? <img src={d.img} alt={t.lang==='ar'?d.nameAr:d.nameEn} style={{ width:'100%', height:'100%', objectFit:'cover' }} loading="lazy" />
                  : <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100%', opacity:0.4 }}><span style={{ fontSize:32 }}>🍣</span></div>
                }
              </div>
              <span style={{ display: 'inline-block', background: 'rgba(240,184,200,0.2)', color: 'var(--pink)', padding: '3px 12px', borderRadius: 20, fontSize: 11, fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.1em', textTransform: t.lang === 'ar' ? 'none' : 'uppercase', marginBottom: 10 }}>
                {t.lang === 'ar' ? d.tagAr : d.tagEn}
              </span>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, color: 'var(--cream)', margin: '0 0 8px' }}>
                {t.lang === 'ar' ? d.nameAr : d.nameEn}
              </h3>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'rgba(248,244,239,0.6)', margin: '0 0 14px' }}>
                {t.lang === 'ar' ? d.descAr : d.descEn}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px 16px', fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'rgba(248,244,239,0.85)' }}>
                <span style={{ fontWeight: 600, color: 'var(--cream)' }}>{d.price} {t.menu.sar}</span>
                <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(248,244,239,0.25)' }} />
                <span style={{ color: 'rgba(248,244,239,0.6)' }}>{d.calories} {t.menu.caloriesUnit}</span>
              </div>
              {/* Corner deco */}
              <div style={{ position: 'absolute', bottom: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }}/>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── About Section ────────────────────────────────────────────

function AboutSection({ t }) {
  return (
    <section id="about" style={{ background: 'var(--dark)', padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px,1fr))', gap: 64, alignItems: 'center' }}>
        {/* Text */}
        <div>
          <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, letterSpacing: '0.22em', textTransform: t.lang === 'ar' ? 'none' : 'uppercase', color: 'var(--pink)', display: 'block', marginBottom: 16 }}>
            {t.about.kicker}
          </span>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem,3.5vw,3rem)', color: 'var(--cream)', margin: '0 0 24px', lineHeight: 1.2 }}>{t.about.title}</h2>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 16, color: 'rgba(248,244,239,0.65)', lineHeight: 1.8, marginBottom: 16 }}>{t.about.body}</p>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 16, color: 'rgba(248,244,239,0.65)', lineHeight: 1.8, marginBottom: 40 }}>{t.about.body2}</p>
          {/* Stats */}
          <div style={{ display: 'flex', gap: 40 }}>
            {[['stat1','stat1Label'],['stat2','stat2Label'],['stat3','stat3Label']].map(([s,l]) => (
              <div key={s}>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 36, color: 'var(--pink)', fontWeight: 700, lineHeight: 1 }}>{t.about[s]}</div>
                <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'rgba(248,244,239,0.5)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{t.about[l]}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Visual */}
        <div style={{ position: 'relative' }}>
          <div style={{ background: 'var(--green)', borderRadius: 24, aspectRatio: '4/5', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
            <img src={ART_SECTION_IMAGE} alt={t.about.imageAlt} style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center', position:'absolute', inset:0 }} />
            <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(14,28,20,0.5) 0%, rgba(14,28,20,0.12) 45%, rgba(14,28,20,0.2) 100%)' }}/>
            {/* Deco dots */}
            <div style={{ position: 'absolute', top: 24, right: 24, width: 60, height: 60, border: '1px solid rgba(240,184,200,0.2)', borderRadius: '50%' }}/>
            <div style={{ position: 'absolute', bottom: 24, left: 24, width: 40, height: 40, background: 'rgba(240,184,200,0.08)', borderRadius: '50%' }}/>
          </div>
          {/* Floating card */}
          <div style={{ position: 'absolute', bottom: -24, right: t.lang==='ar'?'auto':-24, left: t.lang==='ar'?-24:'auto', background: 'var(--dark-2)', borderRadius: 16, padding: '18px 24px', boxShadow: '0 20px 60px rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'var(--pink)', textTransform: t.lang === 'ar' ? 'none' : 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>
              {t.about.mottoLabel}
            </div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 16, color: 'var(--cream)', fontStyle: 'italic' }}>
              {t.about.motto}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Why Us Section ───────────────────────────────────────────

function WhyUsSection({ t }) {
  return (
    <section style={{ background: 'var(--green)', padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem,4vw,3.2rem)', color: 'var(--cream)', margin: '0 0 12px' }}>{t.why.title}</h2>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 16, color: 'rgba(248,244,239,0.55)', margin: 0 }}>{t.why.sub}</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 24 }}>
          {t.why.items.map((item, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '2rem', transition: 'all 0.3s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(240,184,200,0.3)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(240,184,200,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, color: 'var(--pink)', fontSize: 18 }}>✦</div>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, color: 'var(--cream)', margin: '0 0 10px' }}>{item.title}</h3>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'rgba(248,244,239,0.6)', margin: 0, lineHeight: 1.7 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── AI Section ───────────────────────────────────────────────

function AISectionBlock({ t }) {
  const scrollTo = (href) => {
    const el = document.querySelector(href);
    if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
  };

  return (
    <section style={{ background: 'var(--dark-2)', padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 64, alignItems: 'center' }}>
          {/* Left */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(240,184,200,0.1)', border: '1px solid rgba(240,184,200,0.2)', borderRadius: 20, padding: '5px 14px', marginBottom: 24 }}>
              <span style={{ color: 'var(--pink)', fontSize: 13 }}>✦</span>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'var(--pink)', letterSpacing: '0.12em', textTransform: t.lang === 'ar' ? 'none' : 'uppercase' }}>
                {t.aiSection.badge}
              </span>
            </div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem,3.5vw,3rem)', color: 'var(--cream)', margin: '0 0 20px', lineHeight: 1.2 }}>{t.aiSection.title}</h2>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 16, color: 'rgba(248,244,239,0.6)', lineHeight: 1.8, marginBottom: 36 }}>{t.aiSection.sub}</p>
            <button onClick={() => scrollTo('#chat')}
              style={{ background: 'var(--pink)', color: 'var(--dark)', padding: '13px 28px', borderRadius: 28, border: 'none', fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all 0.25s', letterSpacing: '0.04em' }}
              onMouseEnter={e => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.target.style.transform = 'none'}>
              {t.aiSection.cta}
            </button>
          </div>
          {/* Features grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { t1: t.aiSection.feat1Title, t2: t.aiSection.feat1Desc, icon: '📅' },
              { t1: t.aiSection.feat2Title, t2: t.aiSection.feat2Desc, icon: '💬' },
              { t1: t.aiSection.feat3Title, t2: t.aiSection.feat3Desc, icon: '🎙️' },
              { t1: t.aiSection.feat4Title, t2: t.aiSection.feat4Desc, icon: '🌐' },
            ].map((f, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '1.25rem' }}>
                <div style={{ fontSize: 22, marginBottom: 10 }}>{f.icon}</div>
                <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 600, color: 'var(--cream)', marginBottom: 6 }}>{f.t1}</div>
                <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'rgba(248,244,239,0.5)', lineHeight: 1.6 }}>{f.t2}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { HeroSection, FeaturedSection, AboutSection, WhyUsSection, AISectionBlock });
