// ============================================================
// SUSHI DEMURE — Menu Section
// ============================================================

function MenuSection({ t }) {
  const data = window.MENU_DATA || [];
  const ALL_CAT_KEY = '__all__';
  const [activeKey, setActiveKey] = React.useState(ALL_CAT_KEY);
  const [search, setSearch] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);
  const PAGE_SIZE = isMobile ? 6 : 12;

  const catEn = window.TRANSLATIONS.en.menu.categories;
  const catAr = window.TRANSLATIONS.ar.menu.categories;
  const categoryOptions = React.useMemo(() => ([
    { key: ALL_CAT_KEY, label: t.menu.all },
    ...catEn.map((enCat, idx) => ({
      key: enCat,
      label: t.lang === 'ar' ? (catAr[idx] || enCat) : enCat,
    })),
  ]), [t.menu.all, t.lang, catEn, catAr]);

  const filtered = data.filter(item => {
    const catMatch = activeKey === ALL_CAT_KEY || item.category === activeKey;
    const name = t.lang === 'ar' ? item.nameAr : item.nameEn;
    const searchMatch = !search || name.toLowerCase().includes(search.toLowerCase());
    return catMatch && searchMatch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const pagedItems = filtered.slice(startIdx, startIdx + PAGE_SIZE);

  React.useEffect(() => {
    setPage(1);
  }, [activeKey, search, t.lang]);

  React.useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  React.useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const tagLabel = (tag) => {
    if (!tag) return null;
    if (tag === 'popular') return { label: t.menu.popular, bg: 'rgba(240,184,200,0.2)', color: 'var(--pink)' };
    if (tag === 'new') return { label: t.menu.new, bg: 'rgba(100,200,130,0.15)', color: '#7dcea0' };
    if (tag === 'spicy') return { label: t.menu.spicy, bg: 'rgba(220,80,60,0.15)', color: '#e5907a' };
    return null;
  };

  return (
    <section id="menu" style={{ background: 'var(--dark)', padding: 'clamp(4rem,8vw,7rem) 0' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 clamp(1.5rem,5vw,4rem)' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--pink)', display: 'block', marginBottom: 12 }}>
            {t.lang === 'ar' ? 'استكشف' : 'Explore'}
          </span>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem,4vw,3.2rem)', color: 'var(--cream)', margin: '0 0 12px' }}>{t.menu.title}</h2>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 16, color: 'rgba(248,244,239,0.5)', margin: 0 }}>{t.menu.sub}</p>
        </div>

        {/* Search */}
        <div style={{ maxWidth: 400, margin: '0 auto 32px', position: 'relative' }}>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder={t.lang === 'ar' ? 'ابحث في القائمة...' : 'Search menu...'}
            style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 32, padding: '12px 20px 12px 44px', fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--cream)', outline: 'none' }}
            dir={t.dir}
          />
          <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', opacity: 0.4, fontSize: 16 }}>🔍</span>
        </div>

        {/* Category tabs — scrollable */}
        <div style={{ overflowX: 'auto', paddingBottom: 8, marginBottom: 40, scrollbarWidth: 'none' }}>
          <div style={{ display: 'flex', gap: 8, width: 'max-content' }}>
            {categoryOptions.map(cat => (
              <button key={cat.key} onClick={() => setActiveKey(cat.key)}
                style={{ padding: '8px 18px', borderRadius: 24, border: activeKey === cat.key ? 'none' : '1px solid rgba(255,255,255,0.12)', background: activeKey === cat.key ? 'var(--pink)' : 'transparent', color: activeKey === cat.key ? 'var(--dark)' : 'rgba(248,244,239,0.6)', fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: activeKey === cat.key ? 600 : 400, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s', letterSpacing: '0.02em' }}>
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Items grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'rgba(248,244,239,0.3)', fontFamily: 'DM Sans, sans-serif', fontSize: 16 }}>
            {t.lang === 'ar' ? 'لا توجد نتائج' : 'No items found'}
          </div>
        ) : (
          <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
            {pagedItems.map(item => {
              const tag = tagLabel(item.tag);
              return (
                <div key={item.id} style={{ background: 'var(--dark-2)', borderRadius: 18, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)', transition: 'all 0.3s', cursor: 'default' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.3)'; e.currentTarget.style.borderColor = 'rgba(240,184,200,0.2)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}>
                  {/* Image */}
                  <div style={{ width: '100%', aspectRatio: '16/9', background: 'linear-gradient(135deg, var(--green) 0%, var(--dark) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                    {item.img
                      ? <img
                          src={item.img}
                          alt={t.lang==='ar'?item.nameAr:item.nameEn}
                          style={{ width:'100%', height:'100%', objectFit:'cover', position:'absolute', inset:0 }}
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = 'img/logo.jpg';
                          }}
                        />
                      : <div style={{ textAlign: 'center', opacity: 0.25 }}><div style={{ fontSize: 28, marginBottom: 4 }}>🍣</div><span style={{ fontFamily: 'monospace', fontSize: 10, color: 'var(--cream)' }}>dish photo</span></div>
                    }
                    {tag && (
                      <span style={{ position: 'absolute', top: 10, right: t.lang==='ar'?'auto':10, left: t.lang==='ar'?10:'auto', background: tag.bg, color: tag.color, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontFamily: 'DM Sans, sans-serif', fontWeight: 500 }}>
                        {tag.label}
                      </span>
                    )}
                  </div>
                  {/* Content */}
                  <div style={{ padding: '1.1rem 1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                      <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 17, color: 'var(--cream)', margin: 0, flex: 1, lineHeight: 1.3 }}>
                        {t.lang === 'ar' ? item.nameAr : item.nameEn}
                      </h3>
                      <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, fontWeight: 600, color: 'var(--pink)', marginStart: 12, whiteSpace: 'nowrap' }}>
                        {item.price} {t.menu.sar}
                      </span>
                    </div>
                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'rgba(248,244,239,0.5)', margin: '0 0 14px', lineHeight: 1.6 }}>
                      {t.lang === 'ar' ? item.descAr : item.descEn}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, color: 'rgba(248,244,239,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        {item.category}
                      </span>
                      <button style={{ background: 'rgba(240,184,200,0.12)', color: 'var(--pink)', border: '1px solid rgba(240,184,200,0.2)', padding: '5px 16px', borderRadius: 20, fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s', letterSpacing: '0.04em' }}
                        onMouseEnter={e => { e.target.style.background = 'var(--pink)'; e.target.style.color = 'var(--dark)'; }}
                        onMouseLeave={e => { e.target.style.background = 'rgba(240,184,200,0.12)'; e.target.style.color = 'var(--pink)'; }}>
                        {t.menu.addToCart}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {totalPages > 1 && (
            <div style={{ marginTop: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{
                  background: currentPage === 1 ? 'rgba(255,255,255,0.04)' : 'rgba(240,184,200,0.12)',
                  color: currentPage === 1 ? 'rgba(248,244,239,0.35)' : 'var(--pink)',
                  border: currentPage === 1 ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(240,184,200,0.2)',
                  padding: '8px 14px',
                  borderRadius: 22,
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                }}
              >
                {t.lang === 'ar' ? 'السابق' : 'Previous'}
              </button>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'rgba(248,244,239,0.6)', letterSpacing: '0.04em' }}>
                {t.lang === 'ar'
                  ? `الصفحة ${currentPage} من ${totalPages}`
                  : `Page ${currentPage} of ${totalPages}`}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                style={{
                  background: currentPage === totalPages ? 'rgba(255,255,255,0.04)' : 'rgba(240,184,200,0.12)',
                  color: currentPage === totalPages ? 'rgba(248,244,239,0.35)' : 'var(--pink)',
                  border: currentPage === totalPages ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(240,184,200,0.2)',
                  padding: '8px 14px',
                  borderRadius: 22,
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                }}
              >
                {t.lang === 'ar' ? 'التالي' : 'Next'}
              </button>
            </div>
          )}
          </>
        )}
      </div>
    </section>
  );
}

Object.assign(window, { MenuSection });
