// ============================================================
// SUSHI DEMURE — Complaint Support (website → n8n complaints webhook)
// ============================================================

const COMPLAINT_CATEGORY_KEYS = ['general', 'food', 'service', 'reservation', 'delivery', 'billing'];

function ComplaintSection({ t }) {
  const c = t.complaint;
  const [name, setName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [category, setCategory] = React.useState('general');
  const [details, setDetails] = React.useState('');
  const [detailError, setDetailError] = React.useState('');
  const [uiStatus, setUiStatus] = React.useState('idle');

  const inputShell = (hasError) => ({
    width: '100%',
    boxSizing: 'border-box',
    background: 'rgba(255,255,255,0.06)',
    border: hasError ? '1px solid #e5907a' : '1px solid rgba(255,255,255,0.1)',
    borderRadius: 14,
    padding: '12px 16px',
    fontFamily: 'DM Sans, sans-serif',
    fontSize: 14,
    color: 'var(--cream)',
    outline: 'none',
    transition: 'border 0.2s',
  });

  const resetForm = () => {
    setName('');
    setPhone('');
    setCategory('general');
    setDetails('');
    setDetailError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (uiStatus === 'submitting') return;
    const trimmedDetails = String(details).trim();
    if (!trimmedDetails) {
      setDetailError(c.validationDetails);
      return;
    }
    setDetailError('');
    setUiStatus('submitting');
    const res = await window.SushiServices.submitComplaint({
      name: String(name).trim(),
      phone: String(phone).trim(),
      complaint_text: trimmedDetails,
      category,
    });
    if (res.ok) {
      resetForm();
      setUiStatus('success');
    } else {
      setUiStatus('error');
    }
  };

  const goAnother = () => {
    setUiStatus('idle');
  };

  const labelStyle = {
    fontFamily: 'DM Sans, sans-serif',
    fontSize: 13,
    color: 'rgba(248,244,239,0.6)',
    letterSpacing: '0.04em',
    marginBottom: 6,
    display: 'block',
  };

  const hintStyle = {
    fontFamily: 'DM Sans, sans-serif',
    fontSize: 11,
    color: 'rgba(248,244,239,0.38)',
    marginTop: 4,
  };

  return (
    <section id="complaint" style={{ background: 'var(--dark)', padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 64, alignItems: 'center' }}>
          <div>
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--pink)', display: 'block', marginBottom: 16 }}>
              {c.kicker}
            </span>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem,3.5vw,3rem)', color: 'var(--cream)', margin: '0 0 20px', lineHeight: 1.2 }}>{c.title}</h2>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 16, color: 'rgba(248,244,239,0.65)', lineHeight: 1.8, marginBottom: 32 }}>{c.sub}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[c.bullet1, c.bullet2, c.bullet3].map((text, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--pink)', flexShrink: 0, marginTop: 6, opacity: 0.85 }} />
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'rgba(248,244,239,0.72)', lineHeight: 1.65 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 28, padding: 'clamp(1.75rem,3vw,2.75rem)' }}>
            {uiStatus === 'success' && (
              <div style={{ textAlign: 'center', padding: '1rem 0.5rem 0.25rem' }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(125,206,160,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 32 }}>✓</div>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 16, color: 'var(--cream)', lineHeight: 1.75, margin: '0 0 28px', maxWidth: 400, marginLeft: 'auto', marginRight: 'auto' }} role="status">
                  {c.success}
                </p>
                <button type="button" onClick={goAnother}
                  style={{ background: 'var(--pink)', color: 'var(--dark)', padding: '12px 28px', borderRadius: 28, border: 'none', fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 600, cursor: 'pointer', letterSpacing: '0.04em', transition: 'all 0.25s' }}
                  onMouseEnter={(e) => { e.target.style.background = '#f5c8d5'; }}
                  onMouseLeave={(e) => { e.target.style.background = 'var(--pink)'; }}>
                  {c.another}
                </button>
              </div>
            )}

            {uiStatus !== 'success' && (
              <form onSubmit={handleSubmit} dir={t.dir} noValidate>
                {uiStatus === 'error' && (
                  <div role="alert" style={{ marginBottom: 20, padding: '14px 16px', borderRadius: 14, background: 'rgba(229,144,122,0.12)', border: '1px solid rgba(229,144,122,0.35)' }}>
                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'rgba(248,244,239,0.92)', margin: 0, lineHeight: 1.6 }}>{c.error}</p>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div>
                    <label htmlFor="complaint-details" style={labelStyle}>{c.detailsLabel}</label>
                    <textarea
                      id="complaint-details"
                      name="complaint_details"
                      value={details}
                      onChange={(e) => {
                        setDetails(e.target.value);
                        if (detailError) setDetailError('');
                      }}
                      placeholder={c.detailsPh}
                      required
                      aria-required="true"
                      aria-invalid={detailError ? 'true' : 'false'}
                      aria-describedby={detailError ? 'complaint-details-err' : undefined}
                      rows={5}
                      disabled={uiStatus === 'submitting'}
                      style={{ ...inputShell(!!detailError), resize: 'vertical', minHeight: 120, lineHeight: 1.55 }}
                      onFocus={(e) => { e.target.style.borderColor = 'var(--pink)'; }}
                      onBlur={(e) => { e.target.style.borderColor = detailError ? '#e5907a' : 'rgba(255,255,255,0.1)'; }}
                    />
                    <span style={hintStyle}>{c.detailsHint}</span>
                    {detailError && (
                      <span id="complaint-details-err" style={{ display: 'block', fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: '#e5907a', marginTop: 8 }}>
                        {detailError}
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label htmlFor="complaint-name" style={labelStyle}>{c.nameLabel}</label>
                      <input
                        id="complaint-name"
                        name="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={c.namePh}
                        disabled={uiStatus === 'submitting'}
                        style={inputShell(false)}
                        onFocus={(e) => { e.target.style.borderColor = 'var(--pink)'; }}
                        onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                      />
                      <span style={hintStyle}>{c.nameHint}</span>
                    </div>
                    <div>
                      <label htmlFor="complaint-phone" style={labelStyle}>{c.phoneLabel}</label>
                      <input
                        id="complaint-phone"
                        name="phone"
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder={c.phonePh}
                        disabled={uiStatus === 'submitting'}
                        style={inputShell(false)}
                        onFocus={(e) => { e.target.style.borderColor = 'var(--pink)'; }}
                        onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                      />
                      <span style={hintStyle}>{c.phoneHint}</span>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="complaint-category" style={labelStyle}>{c.categoryLabel}</label>
                    <select
                      id="complaint-category"
                      name="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      disabled={uiStatus === 'submitting'}
                      style={{ ...inputShell(false), cursor: 'pointer', appearance: 'none', color: 'var(--cream)' }}
                      onFocus={(e) => { e.target.style.borderColor = 'var(--pink)'; }}
                      onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                    >
                      {COMPLAINT_CATEGORY_KEYS.map((key) => (
                        <option key={key} value={key} style={{ background: '#162b1e' }}>{c.categories[key]}</option>
                      ))}
                    </select>
                    <span style={hintStyle}>{c.categoryHint}</span>
                  </div>

                  <button
                    type="submit"
                    disabled={uiStatus === 'submitting'}
                    style={{
                      background: uiStatus === 'submitting' ? 'rgba(242,184,198,0.45)' : 'var(--pink)',
                      color: 'var(--dark)',
                      padding: '12px 28px',
                      borderRadius: 28,
                      border: 'none',
                      fontFamily: 'DM Sans, sans-serif',
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: uiStatus === 'submitting' ? 'default' : 'pointer',
                      letterSpacing: '0.04em',
                      transition: 'all 0.25s',
                      alignSelf: t.dir === 'rtl' ? 'flex-end' : 'flex-start',
                    }}
                    onMouseEnter={(e) => { if (uiStatus !== 'submitting') e.target.style.background = '#f5c8d5'; }}
                    onMouseLeave={(e) => { if (uiStatus !== 'submitting') e.target.style.background = 'var(--pink)'; }}
                  >
                    {uiStatus === 'submitting' ? c.submitting : c.submit}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { ComplaintSection });
