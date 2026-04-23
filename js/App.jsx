// ============================================================
// SUSHI DEMURE — Main App
// ============================================================

function App() {
  const detectDefaultLang = () => {
    try {
      const locales = (navigator.languages && navigator.languages.length)
        ? navigator.languages
        : [navigator.language || 'en'];
      const arabCountryCodes = new Set([
        'SA', 'AE', 'QA', 'KW', 'BH', 'OM', 'YE', 'IQ', 'JO', 'LB', 'SY',
        'PS', 'EG', 'SD', 'LY', 'TN', 'DZ', 'MA', 'MR', 'SO', 'DJ', 'KM',
      ]);
      for (const locale of locales) {
        const raw = String(locale || '').trim();
        if (!raw) continue;
        if (/^ar([_-]|$)/i.test(raw)) return 'ar';
        const m = raw.match(/[-_]([A-Za-z]{2})$/);
        if (m && arabCountryCodes.has(m[1].toUpperCase())) return 'ar';
      }
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      if (/^Asia\/(Riyadh|Dubai|Qatar|Kuwait|Bahrain|Muscat|Aden|Baghdad|Amman|Beirut|Damascus)$/.test(tz)) {
        return 'ar';
      }
      if (/^Africa\/(Cairo|Khartoum|Tripoli|Tunis|Algiers|Casablanca|Nouakchott|Djibouti)$/.test(tz)) {
        return 'ar';
      }
    } catch {
      // Fallback below.
    }
    return 'en';
  };

  const saved = localStorage.getItem('sd_lang');
  const [lang, setLangState] = React.useState(saved || detectDefaultLang());

  const setLang = (l) => {
    setLangState(l);
    localStorage.setItem('sd_lang', l);
  };

  const t = window.TRANSLATIONS[lang];

  // Apply dir to document
  React.useEffect(() => {
    document.documentElement.dir = t.dir;
    document.documentElement.lang = t.lang;
  }, [lang]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--dark)' }} dir={t.dir}>
      <Navbar t={t} lang={lang} setLang={setLang} />
      <HeroSection t={t} />
      <FeaturedSection t={t} />
      <AboutSection t={t} />
      <WhyUsSection t={t} />
      <AISectionBlock t={t} />
      <MenuSection t={t} />
      <ReservationSection t={t} />
      <ChatWidget t={t} />
      <VoiceSection t={t} />
      <ContactSection t={t} />
      <Footer t={t} lang={lang} setLang={setLang} />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
