// ============================================================
// SUSHI DEMURE — Reservation Section
// ============================================================

function ReservationSection({ t }) {
  const pad2 = (n) => String(n).padStart(2, '0');
  const getLocalDateIso = () => {
    const d = new Date();
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
  };
  const getLocalTimeHm = () => {
    const d = new Date();
    return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
  };
  const parseTimeToMinutes = (value) => {
    const raw = String(value || '').trim();
    if (!raw) return null;
    const m24 = raw.match(/^(\d{1,2}):(\d{2})$/);
    if (m24) {
      const hh = Number(m24[1]);
      const mm = Number(m24[2]);
      if (Number.isFinite(hh) && Number.isFinite(mm) && hh >= 0 && hh <= 23 && mm >= 0 && mm <= 59) {
        return (hh * 60) + mm;
      }
    }
    const m12 = raw.match(/^(\d{1,2}):(\d{2})\s*([AP]M)$/i);
    if (m12) {
      let hh = Number(m12[1]) % 12;
      const mm = Number(m12[2]);
      const ap = String(m12[3]).toUpperCase();
      if (ap === 'PM') hh += 12;
      if (Number.isFinite(hh) && Number.isFinite(mm) && hh >= 0 && hh <= 23 && mm >= 0 && mm <= 59) {
        return (hh * 60) + mm;
      }
    }
    return null;
  };
  const isPastTimeForToday = (dateValue, timeValue) => {
    if (!dateValue || !timeValue) return false;
    if (dateValue !== getLocalDateIso()) return false;
    const selectedMin = parseTimeToMinutes(timeValue);
    const nowMin = parseTimeToMinutes(getLocalTimeHm());
    if (selectedMin === null || nowMin === null) return false;
    return selectedMin < nowMin;
  };

  const [form, setForm] = React.useState({
    name: '', phone: '', date: '', time: '', guests: '',
    request: '', language: '', seating: '', occasion: '',
    preferred_table: '',
  });
  const [errors, setErrors] = React.useState({});
  const [status, setStatus] = React.useState('idle'); // idle | review | loading | success | unavailable | error
  const [result, setResult] = React.useState(null);
  const f = t.reservation.form;
  const review = t.reservation.review;
  const todayIso = getLocalDateIso();
  const minTimeForSelectedDate = form.date === todayIso ? getLocalTimeHm() : undefined;

  const isAutoTableIntent = (s) => {
    const x = String(s || '').trim();
    return !x || /^(auto[\s-]?assign|none|no|skip|n\/a)$/i.test(x);
  };

  const summarySpecialDisplay = () => {
    const r = String(form.request || '').trim();
    return r || review.specialNone;
  };

  const summaryTableDisplay = () => {
    if (isAutoTableIntent(form.preferred_table)) return review.tableAutoAssign;
    return String(form.preferred_table).trim();
  };

  const extrasSummaryLine = () => {
    const bits = [];
    if (form.seating) bits.push(`${t.reservation.summary.seating}: ${form.seating}`);
    if (form.occasion) bits.push(`${t.reservation.summary.occasion}: ${form.occasion}`);
    if (form.language) bits.push(`${t.reservation.summary.language}: ${form.language}`);
    return bits.join(' · ');
  };

  const successReceipt = React.useMemo(() => {
    if (status !== 'success' || !result) return null;
    const r = result;
    const str = (v) => (v === undefined || v === null ? '' : String(v).trim());
    const pick = (formKey, ...serverKeys) => {
      for (const sk of serverKeys) {
        const v = r[sk];
        if (v !== undefined && v !== null && str(v) !== '') return str(v);
      }
      return str(form[formKey]);
    };
    const reqText = str(form.request);
    const specialLocal = reqText || review.specialNone;
    const specialFromServer = r.special_request !== undefined && r.special_request !== null;
    const special = specialFromServer ? (str(r.special_request) || specialLocal) : specialLocal;
    const rawPt = str(form.preferred_table);
    const autoPt = !rawPt || /^(auto[\s-]?assign|none|no|skip|n\/a)$/i.test(rawPt);
    const requestedTable = str(r.requested_table) || (!autoPt ? rawPt : '');
    return {
      name: pick('name', 'name'),
      date: pick('date', 'date'),
      time: pick('time', 'time'),
      guests: r.guests != null && str(r.guests) !== '' ? str(r.guests) : str(form.guests),
      phone: pick('phone', 'phone'),
      special,
      seating: str(r.seating_area) || str(form.seating),
      occasion: str(r.occasion) || str(form.occasion),
      language: str(r.preferred_language) || str(form.language),
      assignedTable: str(r.assigned_table),
      requestedTable,
      message: str(r.message),
      tableAvailable: r.table_available === true,
    };
  }, [status, result, form, review]);

  const v = t.reservation.validate;
  const validate = () => {
    const e = {};
    const datePastMsg = t.lang === 'ar' ? 'لا يمكن اختيار تاريخ سابق.' : 'Past date is not allowed.';
    const timePastMsg = t.lang === 'ar' ? 'لا يمكن اختيار وقت سابق لليوم.' : 'Past time is not allowed for today.';
    const phoneTrim = String(form.phone || '').trim();
    if (!phoneTrim) e.phone = v.phone;
    else if (window.SushiPhoneValidation && !window.SushiPhoneValidation.isValidPhone(form.phone)) e.phone = v.phoneInvalid;
    if (!form.name.trim()) e.name = v.name;
    if (!form.date) e.date = v.date;
    else if (form.date < todayIso) e.date = datePastMsg;
    if (!form.time) e.time = v.time;
    else if (isPastTimeForToday(form.date, form.time)) e.time = timePastMsg;
    if (!form.guests && form.guests !== 0) e.guests = v.guests;
    else {
      const n = parseInt(String(form.guests).trim(), 10);
      if (!Number.isFinite(n) || n < 1) e.guests = v.guestsInvalid;
      else if (n > 50) e.guests = v.guestsLarge;
    }
    return e;
  };

  const goToReview = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setStatus('review');
  };

  const confirmBooking = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); setStatus('review'); return; }
    setStatus('loading');
    try {
      const res = await window.SushiServices.submitReservation({ ...form, lang: t.lang });
      setResult(res);
      setStatus(res.status);
    } catch {
      setStatus('error');
    }
  };

  const reset = () => {
    setForm({ name:'',phone:'',date:'',time:'',guests:'',request:'',language:'',seating:'',occasion:'',preferred_table:'' });
    setStatus('idle'); setResult(null); setErrors({});
  };

  const selectAlt = (alt) => {
    setForm(f => ({ ...f, date: alt.date, time: alt.time }));
    setStatus('idle');
  };

  const inp = (key, type='text', ph='', inputExtra = {}) => (
    <div style={{ display:'flex', flexDirection:'column', gap: 6 }}>
      <label style={{ fontFamily:'DM Sans,sans-serif', fontSize:13, color:'rgba(248,244,239,0.6)', letterSpacing:'0.04em' }}>{f[key]}</label>
      <input type={type} value={form[key]} onChange={e => {
        const nextValue = e.target.value;
        setForm((p) => {
          if (key === 'date') {
            const next = { ...p, [key]: nextValue };
            if (nextValue === getLocalDateIso() && isPastTimeForToday(nextValue, next.time)) {
              next.time = getLocalTimeHm();
            }
            return next;
          }
          if (key === 'time' && isPastTimeForToday(p.date, nextValue)) {
            const corrected = getLocalTimeHm();
            // Ensure the visible native input value is corrected immediately.
            e.target.value = corrected;
            return { ...p, [key]: corrected };
          }
          return { ...p, [key]: nextValue };
        });
      }}
        placeholder={f[key+'Ph'] || ph} dir={t.dir}
        min={inputExtra.min}
        max={inputExtra.max}
        style={{ background:'rgba(255,255,255,0.05)', border: errors[key] ? '1px solid #e5907a' : '1px solid rgba(255,255,255,0.1)', borderRadius:12, padding:'12px 16px', fontFamily:'DM Sans,sans-serif', fontSize:14, color:'var(--cream)', outline:'none', transition:'border 0.2s', width:'100%', boxSizing:'border-box' }}
        onFocus={e => e.target.style.borderColor='var(--pink)'}
        onBlur={e => e.target.style.borderColor = errors[key]?'#e5907a':'rgba(255,255,255,0.1)'}
      />
      {errors[key] && <span style={{ fontFamily:'DM Sans,sans-serif', fontSize:12, color:'#e5907a' }}>{errors[key]}</span>}
    </div>
  );

  const sel = (key, options) => (
    <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
      <label style={{ fontFamily:'DM Sans,sans-serif', fontSize:13, color:'rgba(248,244,239,0.6)', letterSpacing:'0.04em' }}>{f[key]}</label>
      <select value={form[key]} onChange={e => setForm(p=>({...p,[key]:e.target.value}))} dir={t.dir}
        style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:12, padding:'12px 16px', fontFamily:'DM Sans,sans-serif', fontSize:14, color: form[key]?'var(--cream)':'rgba(248,244,239,0.35)', outline:'none', width:'100%', boxSizing:'border-box', appearance:'none', cursor:'pointer' }}>
        <option value="" style={{background:'#1a2e22'}}>{t.reservation.selectPlaceholder}</option>
        {options.map(o => <option key={o} value={o} style={{background:'#1a2e22'}}>{o}</option>)}
      </select>
    </div>
  );

  const trustBadges = [
    { icon:'⚡', label: t.reservation.trust1 },
    { icon:'🎯', label: t.reservation.trust2 },
    { icon:'✓', label: t.reservation.trust3 },
    { icon:'🌐', label: t.reservation.trust4 },
  ];

  return (
    <section id="reservation" style={{ background:'var(--dark-2)', padding:'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)' }}>
      <div style={{ maxWidth:1280, margin:'0 auto' }}>
        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:48 }}>
          <span style={{ fontFamily:'DM Sans,sans-serif', fontSize:12, letterSpacing:'0.22em', textTransform:'uppercase', color:'var(--pink)', display:'block', marginBottom:12 }}>
            {t.reservation.sectionKicker}
          </span>
          <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(2rem,4vw,3.2rem)', color:'var(--cream)', margin:'0 0 12px' }}>{t.reservation.title}</h2>
          <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:16, color:'rgba(248,244,239,0.5)', margin:'0 0 32px' }}>{t.reservation.sub}</p>
          {/* Trust badges */}
          <div style={{ display:'flex', flexWrap:'wrap', justifyContent:'center', gap:12 }}>
            {trustBadges.map((b,i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:8, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:24, padding:'6px 16px' }}>
                <span style={{ fontSize:14 }}>{b.icon}</span>
                <span style={{ fontFamily:'DM Sans,sans-serif', fontSize:12, color:'rgba(248,244,239,0.65)', letterSpacing:'0.04em' }}>{b.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:32, alignItems:'start' }}>
          {/* Form card */}
          <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:24, padding:'clamp(1.5rem,3vw,2.5rem)', gridColumn: (status === 'idle' || status === 'review') ? 'auto' : '1/-1', maxWidth: (status !== 'idle' && status !== 'review') ? 600 : 'none', margin: (status !== 'idle' && status !== 'review') ? '0 auto' : '0' }}>

            {/* IDLE — Form */}
            {status === 'idle' && (
              <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
                <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:12, color:'rgba(248,244,239,0.45)', margin:0, letterSpacing:'0.06em', textTransform:'uppercase' }}>{f.requiredSection}</p>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                  {inp('name','text')} {inp('phone','tel')}
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                  {inp('date','date', '', { min: todayIso })} {inp('time','time', '', { min: minTimeForSelectedDate })}
                </div>
                {inp('guests','number', '', { min: 1, max: 50 })}
                <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:12, color:'rgba(248,244,239,0.45)', margin:0, letterSpacing:'0.06em', textTransform:'uppercase' }}>{f.optionalSection}</p>
                {sel('seating', f.seatingOptions)}
                {sel('occasion', f.occasionOptions)}
                {sel('language', f.langOptions)}
                {inp('preferred_table','text')}
                <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                  <label style={{ fontFamily:'DM Sans,sans-serif', fontSize:13, color:'rgba(248,244,239,0.6)' }}>{f.request}</label>
                  <textarea value={form.request} onChange={e => setForm(p=>({...p,request:e.target.value}))}
                    placeholder={f.requestPh} dir={t.dir} rows={3}
                    style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:12, padding:'12px 16px', fontFamily:'DM Sans,sans-serif', fontSize:14, color:'var(--cream)', outline:'none', resize:'vertical', width:'100%', boxSizing:'border-box' }}
                    onFocus={e => e.target.style.borderColor='var(--pink)'}
                    onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.1)'}
                  />
                </div>
                <button onClick={goToReview}
                  style={{ background:'var(--pink)', color:'var(--dark)', padding:'14px', borderRadius:14, border:'none', fontFamily:'DM Sans,sans-serif', fontSize:15, fontWeight:600, cursor:'pointer', letterSpacing:'0.04em', transition:'all 0.25s', marginTop:4 }}
                  onMouseEnter={e => e.target.style.background='#f5c8d5'}
                  onMouseLeave={e => e.target.style.background='var(--pink)'}>
                  {f.reviewNext}
                </button>
              </div>
            )}

            {/* REVIEW — same flow as Slack: summary then explicit confirm before calling n8n */}
            {status === 'review' && (
              <div style={{ display:'flex', flexDirection:'column', gap:20 }} dir={t.dir}>
                <h3 style={{ fontFamily:'Playfair Display,serif', fontSize:22, color:'var(--cream)', margin:0 }}>{review.title}</h3>
                <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:14, color:'rgba(248,244,239,0.6)', margin:0, lineHeight:1.7 }}>{review.intro}</p>
                <div style={{ background:'rgba(255,255,255,0.04)', borderRadius:14, padding:'1.25rem', border:'1px solid rgba(255,255,255,0.08)', textAlign: t.lang==='ar'?'right':'left' }}>
                  <div style={{ fontFamily:'DM Sans,sans-serif', fontSize:12, fontWeight:600, color:'rgba(248,244,239,0.45)', marginBottom:14, textTransform:'uppercase', letterSpacing:'0.08em' }}>{t.reservation.summary.title}</div>
                  {[
                    ['name', form.name],
                    ['date', form.date],
                    ['time', form.time],
                    ['guests', String(form.guests)],
                    ['phone', form.phone],
                  ].map(([k, val]) => (
                    <div key={k} style={{ display:'flex', justifyContent:'space-between', gap:16, padding:'8px 0', borderBottom:'1px solid rgba(255,255,255,0.06)', flexWrap:'wrap' }}>
                      <span style={{ fontFamily:'DM Sans,sans-serif', fontSize:13, color:'rgba(248,244,239,0.5)' }}>{t.reservation.summary[k]}</span>
                      <span style={{ fontFamily:'DM Sans,sans-serif', fontSize:14, color:'var(--cream)', fontWeight:500 }}>{val}</span>
                    </div>
                  ))}
                  <div style={{ display:'flex', justifyContent:'space-between', gap:16, padding:'8px 0', borderBottom:'1px solid rgba(255,255,255,0.06)', flexWrap:'wrap' }}>
                    <span style={{ fontFamily:'DM Sans,sans-serif', fontSize:13, color:'rgba(248,244,239,0.5)' }}>{t.reservation.summary.specialRequest}</span>
                    <span style={{ fontFamily:'DM Sans,sans-serif', fontSize:14, color:'var(--cream)', fontWeight:500 }}>{summarySpecialDisplay()}</span>
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', gap:16, padding:'8px 0', borderBottom:'1px solid rgba(255,255,255,0.06)', flexWrap:'wrap' }}>
                    <span style={{ fontFamily:'DM Sans,sans-serif', fontSize:13, color:'rgba(248,244,239,0.5)' }}>{review.tableLabel}</span>
                    <span style={{ fontFamily:'DM Sans,sans-serif', fontSize:14, color:'var(--cream)', fontWeight:500 }}>{summaryTableDisplay()}</span>
                  </div>
                  {extrasSummaryLine() && (
                    <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:12, color:'rgba(248,244,239,0.45)', margin:'12px 0 0', lineHeight:1.6 }}>
                      <strong style={{ color:'rgba(248,244,239,0.55)' }}>{review.alsoIncluded}:</strong> {extrasSummaryLine()}
                    </p>
                  )}
                </div>
                <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:15, color:'var(--cream)', margin:0, fontWeight:500 }}>{review.confirmQuestion}</p>
                <div style={{ display:'flex', flexWrap:'wrap', gap:12 }}>
                  <button type="button" onClick={confirmBooking}
                    style={{ flex:'1 1 160px', background:'var(--pink)', color:'var(--dark)', padding:'14px 20px', borderRadius:14, border:'none', fontFamily:'DM Sans,sans-serif', fontSize:15, fontWeight:600, cursor:'pointer' }}
                    onMouseEnter={e => e.target.style.background='#f5c8d5'}
                    onMouseLeave={e => e.target.style.background='var(--pink)'}>
                    {review.confirmFinal}
                  </button>
                  <button type="button" onClick={() => setStatus('idle')}
                    style={{ flex:'1 1 160px', background:'transparent', color:'var(--cream)', padding:'14px 20px', borderRadius:14, border:'1px solid rgba(255,255,255,0.2)', fontFamily:'DM Sans,sans-serif', fontSize:15, cursor:'pointer' }}>
                    {review.backToEdit}
                  </button>
                </div>
              </div>
            )}

            {/* LOADING */}
            {status === 'loading' && (
              <div style={{ textAlign:'center', padding:'4rem 2rem' }}>
                <div style={{ width:56, height:56, border:'3px solid rgba(240,184,200,0.2)', borderTopColor:'var(--pink)', borderRadius:'50%', animation:'spin 1s linear infinite', margin:'0 auto 24px' }}/>
                <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:16, color:'rgba(248,244,239,0.6)' }}>{f.submitting}</p>
              </div>
            )}

            {/* SUCCESS — receipt uses n8n echo + assigned_table when present */}
            {status === 'success' && successReceipt && (() => {
              const s = successReceipt;
              const sc = t.reservation.success;
              const sum = t.reservation.summary;
              const tableLabel = (code) => {
                const c = String(code || '').trim();
                if (!c) return '';
                if (/^table\s+/i.test(c)) return c;
                return `${t.reservation.tablePrefix} ${c}`;
              };
              const prefTiles = [
                [sum.seating, s.seating],
                [sum.occasion, s.occasion],
                [sum.language, s.language],
              ].filter(([, v]) => v);
              return (
              <div style={{ textAlign:'center', padding:'3rem 1.5rem' }}>
                <div style={{ width:80, height:80, borderRadius:'50%', background:'rgba(125,206,160,0.15)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 24px', fontSize:36 }}>🎉</div>
                <h3 style={{ fontFamily:'Playfair Display,serif', fontSize:28, color:'var(--cream)', margin:'0 0 12px' }}>{sc.title}</h3>
                <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:15, color:'rgba(248,244,239,0.6)', marginBottom: s.message ? 12 : 24, lineHeight:1.7 }}>{sc.sub}</p>
                {s.message && (
                  <div style={{ maxWidth: 420, margin:'0 auto 20px', padding:'12px 18px', borderRadius:14, background:'rgba(240,184,200,0.08)', border:'1px solid rgba(240,184,200,0.18)' }}>
                    <span style={{ fontFamily:'DM Sans,sans-serif', fontSize:10, letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(248,244,239,0.4)', display:'block', marginBottom:6 }}>{sc.serverMessage}</span>
                    <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:14, color:'rgba(248,244,239,0.85)', margin:0, lineHeight:1.6 }}>{s.message}</p>
                  </div>
                )}
                {result?.confirmationNumber && (
                  <div style={{ background:'rgba(240,184,200,0.1)', border:'1px solid rgba(240,184,200,0.25)', borderRadius:14, padding:'16px 24px', marginBottom:28, display:'inline-block' }}>
                    <span style={{ fontFamily:'DM Sans,sans-serif', fontSize:13, color:'rgba(248,244,239,0.5)', display:'block', marginBottom:4 }}>{sc.confNum}</span>
                    <span style={{ fontFamily:'Playfair Display,serif', fontSize:24, color:'var(--pink)', fontWeight:700 }}>{result.confirmationNumber}</span>
                  </div>
                )}
                <div style={{ background:'rgba(255,255,255,0.04)', borderRadius:18, padding:'clamp(1.1rem,2.5vw,1.75rem)', marginBottom:24, textAlign: t.lang==='ar'?'right':'left', border:'1px solid rgba(255,255,255,0.06)', maxWidth:520, marginLeft:'auto', marginRight:'auto' }}>
                  <div style={{ fontFamily:'DM Sans,sans-serif', fontSize:12, fontWeight:600, color:'rgba(248,244,239,0.5)', marginBottom:16, textTransform:'uppercase', letterSpacing:'0.1em' }}>{sum.title}</div>
                  {[
                    ['name', s.name],
                    ['date', s.date],
                    ['time', s.time],
                    ['guests', s.guests],
                    ['phone', s.phone],
                  ].map(([k, val]) => (
                    <div key={k} style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', gap:16, padding:'10px 0', borderBottom:'1px solid rgba(255,255,255,0.06)', flexWrap:'wrap' }}>
                      <span style={{ fontFamily:'DM Sans,sans-serif', fontSize:13, color:'rgba(248,244,239,0.5)' }}>{sum[k]}</span>
                      <span style={{ fontFamily:'DM Sans,sans-serif', fontSize:14, color:'var(--cream)', fontWeight:500 }}>{val}</span>
                    </div>
                  ))}
                  <div style={{ padding:'14px 0 10px', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
                    <span style={{ fontFamily:'DM Sans,sans-serif', fontSize:13, color:'rgba(248,244,239,0.5)', display:'block', marginBottom:8 }}>{sum.specialRequest}</span>
                    <span style={{ fontFamily:'DM Sans,sans-serif', fontSize:14, color:'var(--cream)', lineHeight:1.65, whiteSpace:'pre-wrap', wordBreak:'break-word' }}>{s.special}</span>
                  </div>
                  {s.assignedTable ? (
                    <div style={{ marginTop:14, padding:'18px 16px', borderRadius:14, background:'linear-gradient(145deg, rgba(240,184,200,0.14) 0%, rgba(125,206,160,0.1) 100%)', border:'1px solid rgba(240,184,200,0.22)' }}>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:14 }}>
                        <div style={{ textAlign: t.lang==='ar'?'right':'left' }}>
                          <div style={{ fontFamily:'DM Sans,sans-serif', fontSize:11, letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(248,244,239,0.45)', marginBottom:6 }}>{sc.assignedTable}</div>
                          {s.tableAvailable && (
                            <span style={{ fontFamily:'DM Sans,sans-serif', fontSize:12, color:'#8fd9a8' }}>✓ {sc.tableConfirmed}</span>
                          )}
                        </div>
                        <span style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(1.5rem,4vw,2rem)', color:'var(--pink)', fontWeight:700, letterSpacing:'0.02em' }}>{tableLabel(s.assignedTable)}</span>
                      </div>
                      {s.requestedTable && s.requestedTable !== s.assignedTable && (
                        <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:12, color:'rgba(248,244,239,0.45)', margin:'12px 0 0', lineHeight:1.5 }}>
                          {sc.requestedTable}: <span style={{ color:'rgba(248,244,239,0.75)' }}>{s.requestedTable}</span>
                        </p>
                      )}
                    </div>
                  ) : (
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', gap:16, padding:'10px 0 0', flexWrap:'wrap' }}>
                      <span style={{ fontFamily:'DM Sans,sans-serif', fontSize:13, color:'rgba(248,244,239,0.5)' }}>{review.tableLabel}</span>
                      <span style={{ fontFamily:'DM Sans,sans-serif', fontSize:14, color:'var(--cream)', fontWeight:500 }}>{summaryTableDisplay()}</span>
                    </div>
                  )}
                  {prefTiles.length > 0 && (
                    <div style={{ marginTop:22 }}>
                      <div style={{ fontFamily:'DM Sans,sans-serif', fontSize:11, letterSpacing:'0.14em', textTransform:'uppercase', color:'rgba(248,244,239,0.38)', marginBottom:12 }}>{sc.preferencesSection}</div>
                      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(140px, 1fr))', gap:10 }}>
                        {prefTiles.map(([label, val]) => (
                          <div key={label} style={{ background:'rgba(0,0,0,0.22)', borderRadius:12, padding:'12px 14px', border:'1px solid rgba(255,255,255,0.07)', textAlign: t.lang==='ar'?'right':'left' }}>
                            <div style={{ fontFamily:'DM Sans,sans-serif', fontSize:11, color:'rgba(248,244,239,0.42)', marginBottom:6 }}>{label}</div>
                            <div style={{ fontFamily:'DM Sans,sans-serif', fontSize:14, color:'var(--cream)', fontWeight:500 }}>{val}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <button onClick={reset} style={{ background:'transparent', border:'1px solid rgba(255,255,255,0.2)', color:'var(--cream)', padding:'10px 24px', borderRadius:24, fontFamily:'DM Sans,sans-serif', fontSize:14, cursor:'pointer' }}>{f.newBooking}</button>
              </div>
              );
            })()}

            {/* UNAVAILABLE */}
            {status === 'unavailable' && (
              <div style={{ padding:'2rem 1rem' }}>
                <div style={{ textAlign:'center', marginBottom:28 }}>
                  <div style={{ fontSize:40, marginBottom:16 }}>😔</div>
                  <h3 style={{ fontFamily:'Playfair Display,serif', fontSize:24, color:'var(--cream)', margin:'0 0 8px' }}>{t.reservation.unavailable.title}</h3>
                  <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:15, color:'rgba(248,244,239,0.6)' }}>{t.reservation.unavailable.sub}</p>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:12, marginBottom:24 }}>
                  {result?.alternatives?.map((alt, i) => (
                    <button key={i} onClick={() => selectAlt(alt)}
                      style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(240,184,200,0.2)', borderRadius:14, padding:'14px 20px', display:'flex', justifyContent:'space-between', alignItems:'center', cursor:'pointer', transition:'all 0.2s' }}
                      onMouseEnter={e => { e.currentTarget.style.background='rgba(240,184,200,0.1)'; e.currentTarget.style.borderColor='var(--pink)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor='rgba(240,184,200,0.2)'; }}>
                      <div style={{ textAlign: t.lang==='ar'?'right':'left' }}>
                        <div style={{ fontFamily:'DM Sans,sans-serif', fontSize:15, color:'var(--cream)', fontWeight:500 }}>{alt.time}</div>
                        <div style={{ fontFamily:'DM Sans,sans-serif', fontSize:13, color:'rgba(248,244,239,0.5)' }}>{alt.date}</div>
                      </div>
                      <span style={{ background:'rgba(240,184,200,0.15)', color:'var(--pink)', padding:'5px 14px', borderRadius:20, fontFamily:'DM Sans,sans-serif', fontSize:12, fontWeight:500 }}>{t.reservation.unavailable.select}</span>
                    </button>
                  ))}
                </div>
                <button onClick={reset} style={{ width:'100%', background:'transparent', border:'1px solid rgba(255,255,255,0.15)', color:'rgba(248,244,239,0.6)', padding:'10px', borderRadius:12, fontFamily:'DM Sans,sans-serif', fontSize:14, cursor:'pointer' }}>{f.edit}</button>
              </div>
            )}

            {/* ERROR */}
            {status === 'error' && (
              <div style={{ textAlign:'center', padding:'3rem 1.5rem' }}>
                <div style={{ fontSize:48, marginBottom:20 }}>⚠️</div>
                <h3 style={{ fontFamily:'Playfair Display,serif', fontSize:24, color:'var(--cream)', margin:'0 0 12px' }}>{t.reservation.error.title}</h3>
                <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:15, color:'rgba(248,244,239,0.6)', marginBottom: result?.detail || result?.httpStatus ? 12 : 28 }}>{t.reservation.error.sub}</p>
                {(result?.httpStatus != null || result?.detail) && (
                  <pre style={{
                    fontFamily: 'ui-monospace, monospace',
                    fontSize: 11,
                    color: 'rgba(248,244,239,0.45)',
                    textAlign: 'left',
                    direction: 'ltr',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    maxHeight: 120,
                    overflow: 'auto',
                    margin: '0 auto 20px',
                    padding: 12,
                    maxWidth: '100%',
                    boxSizing: 'border-box',
                    background: 'rgba(0,0,0,0.25)',
                    borderRadius: 10,
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}>
                    {result.httpStatus != null ? `HTTP ${result.httpStatus}\n` : ''}{result.detail || ''}
                  </pre>
                )}
                <div style={{ display:'flex', gap:12, justifyContent:'center' }}>
                  <button onClick={() => setStatus('review')} style={{ background:'var(--pink)', color:'var(--dark)', padding:'11px 24px', borderRadius:24, border:'none', fontFamily:'DM Sans,sans-serif', fontSize:14, fontWeight:600, cursor:'pointer' }}>{t.reservation.error.retry}</button>
                  <button onClick={reset} style={{ background:'transparent', border:'1px solid rgba(255,255,255,0.2)', color:'var(--cream)', padding:'11px 24px', borderRadius:24, fontFamily:'DM Sans,sans-serif', fontSize:14, cursor:'pointer' }}>{f.newBooking}</button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar — form + review */}
          {(status === 'idle' || status === 'review') && (
            <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
              <div style={{ background:'var(--green)', borderRadius:20, padding:'1.75rem', border:'1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontFamily:'Playfair Display,serif', fontSize:18, color:'var(--cream)', marginBottom:16 }}>
                  {t.contact.hours}
                </div>
                {[{ day: t.reservation.dailyLabel, time: t.reservation.hoursRange }].map((h,i) => (
                  <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
                    <span style={{ fontFamily:'DM Sans,sans-serif', fontSize:13, color:'rgba(248,244,239,0.6)' }}>{h.day}</span>
                    <span style={{ fontFamily:'DM Sans,sans-serif', fontSize:13, color:'var(--cream)', fontWeight:500 }}>{h.time}</span>
                  </div>
                ))}
              </div>
              <div style={{ background:'rgba(255,255,255,0.03)', borderRadius:20, padding:'1.75rem', border:'1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontFamily:'Playfair Display,serif', fontSize:18, color:'var(--cream)', marginBottom:16 }}>
                  {t.contact.branches}
                </div>
                {t.contact.branchList.map((b,i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 0', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
                    <span style={{ color:'var(--pink)', fontSize:12 }}>✦</span>
                    <span style={{ fontFamily:'DM Sans,sans-serif', fontSize:14, color:'rgba(248,244,239,0.7)' }}>{b}</span>
                  </div>
                ))}
              </div>
              <div style={{ background:'rgba(240,184,200,0.07)', borderRadius:20, padding:'1.5rem', border:'1px solid rgba(240,184,200,0.15)' }}>
                <div style={{ fontFamily:'DM Sans,sans-serif', fontSize:13, color:'var(--pink)', marginBottom:8, textTransform:'uppercase', letterSpacing:'0.1em' }}>
                  {t.reservation.needHelpTitle}
                </div>
                <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:13, color:'rgba(248,244,239,0.6)', margin:'0 0 14px', lineHeight:1.6 }}>
                  {t.reservation.needHelpBody}
                </p>
                <a href="https://wa.me/966537854826" target="_blank" rel="noreferrer"
                  style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(37,211,102,0.15)', color:'#25d366', padding:'8px 16px', borderRadius:20, fontFamily:'DM Sans,sans-serif', fontSize:13, textDecoration:'none', border:'1px solid rgba(37,211,102,0.2)' }}>
                  <span>💬</span> {t.reservation.whatsappCta}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { ReservationSection });
