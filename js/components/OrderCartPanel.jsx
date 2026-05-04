// ============================================================
// SUSHI DEMURE — Order cart drawer / modal + checkout flow
// ============================================================

function OrderCartPanel({ t }) {
  const {
    lines,
    inc,
    dec,
    removeLine,
    clearCart,
    open,
    setOpen,
    cartTotal,
    buildItemsString,
  } = window.useOrderCart();

  const [step, setStep] = React.useState('cart');
  const [name, setName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [orderType, setOrderType] = React.useState('pickup');
  const [address, setAddress] = React.useState('');
  const [notes, setNotes] = React.useState('');
  const [fieldError, setFieldError] = React.useState('');
  const [submitError, setSubmitError] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [successMsg, setSuccessMsg] = React.useState('');
  const [isNarrow, setIsNarrow] = React.useState(typeof window !== 'undefined' && window.innerWidth < 768);

  React.useEffect(() => {
    const onResize = () => setIsNarrow(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  React.useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const resetForm = React.useCallback(() => {
    setName('');
    setPhone('');
    setOrderType('pickup');
    setAddress('');
    setNotes('');
    setFieldError('');
    setSubmitError('');
  }, []);

  const handleClose = () => {
    setOpen(false);
    setStep('cart');
    setSubmitting(false);
    setSubmitError('');
    setFieldError('');
    if (step === 'success') {
      resetForm();
    }
  };

  const goBrowseMenu = () => {
    setOpen(false);
    setStep('cart');
    const el = document.getElementById('menu');
    if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
  };

  const inputBase = {
    width: '100%',
    boxSizing: 'border-box',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 14,
    padding: '12px 14px',
    fontFamily: 'DM Sans, sans-serif',
    fontSize: 14,
    color: 'var(--cream)',
    outline: 'none',
  };

  const labelStyle = {
    display: 'block',
    fontFamily: 'DM Sans, sans-serif',
    fontSize: 12,
    color: 'rgba(248,244,239,0.55)',
    marginBottom: 8,
    letterSpacing: '0.06em',
    textTransform: t.lang === 'ar' ? 'none' : 'uppercase',
  };

  const lineName = (line) => (t.lang === 'ar' ? line.nameAr : line.nameEn);

  const validateDetails = () => {
    setFieldError('');
    if (!lines.length) {
      setFieldError(t.order.validationItems);
      return false;
    }
    if (!String(name).trim()) {
      setFieldError(t.order.validationName);
      return false;
    }
    const pv = window.SushiPhoneValidation;
    if (!pv || !pv.isValidOrderPhone(phone)) {
      setFieldError(t.order.phoneInvalid);
      return false;
    }
    if (orderType === 'delivery' && !String(address).trim()) {
      setFieldError(t.order.addressRequired);
      return false;
    }
    return true;
  };

  const onContinueFromCart = () => {
    setFieldError('');
    if (!lines.length) {
      setFieldError(t.order.validationItems);
      return;
    }
    setStep('details');
  };

  const onGoReview = () => {
    if (!validateDetails()) return;
    setStep('review');
  };

  const onConfirmOrder = async () => {
    setSubmitError('');
    if (!validateDetails()) {
      setStep('details');
      return;
    }
    const pv = window.SushiPhoneValidation;
    const cleaned = pv && pv.cleanPhoneForOrder ? pv.cleanPhoneForOrder(phone) : String(phone).replace(/\D/g, '');
    const itemsStr = buildItemsString();
    const payload = {
      name: String(name).trim(),
      phone: cleaned,
      items: itemsStr,
      order_type: orderType === 'delivery' ? 'delivery' : 'pickup',
      address: orderType === 'delivery' ? String(address).trim() : '',
      notes: String(notes).trim(),
    };

    const svc = window.SushiServices;
    if (!svc || typeof svc.submitOrder !== 'function') {
      setSubmitError(t.order.configureWebhook);
      return;
    }

    setSubmitting(true);
    try {
      const res = await svc.submitOrder(payload);
      if (res && res.ok === true) {
        const msg = (res.message && String(res.message).trim()) || t.order.successDefault;
        setSuccessMsg(msg);
        clearCart();
        resetForm();
        setStep('success');
      } else {
        const raw = res && res.error ? String(res.error) : '';
        const err = raw === '__ORDER_WEBHOOK_UNSET__' ? t.order.configureWebhook : (raw || t.order.configureWebhook);
        setSubmitError(err);
      }
    } catch (e) {
      setSubmitError(e && e.message ? String(e.message) : 'Error');
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  const panelWidth = isNarrow ? '100%' : 420;
  const panelMaxH = isNarrow ? '100vh' : 'calc(100vh - 48px)';

  return (
    <div
      role="presentation"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1100,
        background: 'rgba(8, 14, 12, 0.72)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        justifyContent: isNarrow ? 'stretch' : (t.dir === 'rtl' ? 'flex-start' : 'flex-end'),
        alignItems: isNarrow ? 'stretch' : 'stretch',
        padding: isNarrow ? 0 : 16,
      }}
      onClick={handleClose}
      onKeyDown={(e) => {
        if (e.key === 'Escape') handleClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-cart-title"
        dir={t.dir}
        style={{
          width: panelWidth,
          maxWidth: '100%',
          height: isNarrow ? '100%' : panelMaxH,
          marginTop: isNarrow ? 0 : 'auto',
          marginBottom: isNarrow ? 0 : 'auto',
          background: 'var(--dark-2)',
          border: isNarrow ? 'none' : '1px solid rgba(255,255,255,0.1)',
          borderRadius: isNarrow ? 0 : 22,
          boxShadow: isNarrow ? 'none' : '0 24px 80px rgba(0,0,0,0.55)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            flexShrink: 0,
            padding: '18px 20px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          <h2 id="order-cart-title" style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: 'var(--cream)', margin: 0 }}>
            {step === 'success' ? t.order.successTitle : t.order.title}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            aria-label={t.order.close}
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.12)',
              background: 'rgba(255,255,255,0.06)',
              color: 'var(--cream)',
              cursor: 'pointer',
              fontSize: 20,
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {step === 'cart' && (
            <>
              {!lines.length ? (
                <p style={{ fontFamily: 'DM Sans, sans-serif', color: 'rgba(248,244,239,0.5)', textAlign: 'center', padding: '2rem 0' }}>
                  {t.order.empty}
                </p>
              ) : (
                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                  {lines.map((line) => (
                    <li
                      key={line.id}
                      style={{
                        padding: '14px 0',
                        borderBottom: '1px solid rgba(255,255,255,0.06)',
                        fontFamily: 'DM Sans, sans-serif',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
                        <span style={{ color: 'var(--cream)', fontWeight: 500, flex: 1 }}>{lineName(line)}</span>
                        <span style={{ color: 'var(--pink)', fontWeight: 600, whiteSpace: 'nowrap' }}>
                          {(line.price * line.qty).toFixed(0)} {t.menu.sar}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <button
                            type="button"
                            onClick={() => dec(line.id)}
                            style={{
                              width: 34,
                              height: 34,
                              borderRadius: 10,
                              border: '1px solid rgba(255,255,255,0.15)',
                              background: 'rgba(255,255,255,0.06)',
                              color: 'var(--cream)',
                              cursor: 'pointer',
                              fontSize: 18,
                            }}
                          >
                            −
                          </button>
                          <span style={{ minWidth: 28, textAlign: 'center', color: 'var(--cream)' }}>{line.qty}</span>
                          <button
                            type="button"
                            onClick={() => inc(line.id)}
                            style={{
                              width: 34,
                              height: 34,
                              borderRadius: 10,
                              border: '1px solid rgba(255,255,255,0.15)',
                              background: 'rgba(255,255,255,0.06)',
                              color: 'var(--cream)',
                              cursor: 'pointer',
                              fontSize: 18,
                            }}
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeLine(line.id)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'rgba(242,184,198,0.85)',
                            cursor: 'pointer',
                            fontSize: 13,
                            textDecoration: 'underline',
                            fontFamily: 'DM Sans, sans-serif',
                          }}
                        >
                          {t.order.remove}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: 'rgba(248,244,239,0.7)' }}>{t.order.total}</span>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: 'var(--pink)' }}>
                  {cartTotal.toFixed(0)} {t.menu.sar}
                </span>
              </div>
              {fieldError && (
                <p style={{ color: '#e5907a', fontSize: 13, marginTop: 12, fontFamily: 'DM Sans, sans-serif' }}>{fieldError}</p>
              )}
            </>
          )}

          {step === 'details' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <label style={labelStyle}>{t.order.customerName}</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.order.customerNamePh}
                  style={inputBase}
                  autoComplete="name"
                />
              </div>
              <div>
                <label style={labelStyle}>{t.order.phone}</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t.order.phonePh}
                  style={inputBase}
                  autoComplete="tel"
                />
              </div>
              <div>
                <span style={labelStyle}>{t.order.orderType}</span>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {['pickup', 'delivery'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setOrderType(type)}
                      style={{
                        padding: '10px 18px',
                        borderRadius: 22,
                        border: orderType === type ? 'none' : '1px solid rgba(255,255,255,0.12)',
                        background: orderType === type ? 'var(--pink)' : 'transparent',
                        color: orderType === type ? 'var(--dark)' : 'rgba(248,244,239,0.65)',
                        fontFamily: 'DM Sans, sans-serif',
                        fontSize: 13,
                        fontWeight: orderType === type ? 600 : 400,
                        cursor: 'pointer',
                      }}
                    >
                      {type === 'pickup' ? t.order.pickup : t.order.delivery}
                    </button>
                  ))}
                </div>
              </div>
              {orderType === 'delivery' && (
                <div>
                  <label style={labelStyle}>{t.order.address}</label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder={t.order.addressPh}
                    rows={3}
                    style={{ ...inputBase, resize: 'vertical', minHeight: 88 }}
                  />
                </div>
              )}
              <div>
                <label style={labelStyle}>{t.order.notes}</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t.order.notesPh}
                  rows={2}
                  style={{ ...inputBase, resize: 'vertical', minHeight: 72 }}
                />
              </div>
              {fieldError && (
                <p style={{ color: '#e5907a', fontSize: 13, margin: 0, fontFamily: 'DM Sans, sans-serif' }}>{fieldError}</p>
              )}
            </div>
          )}

          {step === 'review' && (
            <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'rgba(248,244,239,0.85)', lineHeight: 1.7 }}>
              <p style={{ color: 'rgba(248,244,239,0.55)', marginTop: 0, marginBottom: 16 }}>{t.order.reviewIntro}</p>
              <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: 16, border: '1px solid rgba(255,255,255,0.08)' }}>
                <div><strong style={{ color: 'var(--pink)' }}>{t.order.name}:</strong> {String(name).trim()}</div>
                <div><strong style={{ color: 'var(--pink)' }}>{t.order.phone}:</strong> {window.SushiPhoneValidation ? window.SushiPhoneValidation.cleanPhoneForOrder(phone) : phone}</div>
                <div><strong style={{ color: 'var(--pink)' }}>{t.order.type}:</strong> {orderType === 'delivery' ? t.order.delivery : t.order.pickup}</div>
                {orderType === 'delivery' && (
                  <div><strong style={{ color: 'var(--pink)' }}>{t.order.addressLabel}:</strong> {String(address).trim()}</div>
                )}
                <div style={{ marginTop: 8 }}><strong style={{ color: 'var(--pink)' }}>{t.order.items}:</strong> {buildItemsString()}</div>
                {String(notes).trim() ? (
                  <div><strong style={{ color: 'var(--pink)' }}>{t.order.notesLabel}:</strong> {String(notes).trim()}</div>
                ) : null}
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <strong style={{ color: 'var(--pink)' }}>{t.order.total}:</strong>{' '}
                  {lines.reduce((s, l) => s + l.price * l.qty, 0).toFixed(0)} {t.menu.sar}
                </div>
              </div>
              {submitError && (
                <p style={{ color: '#e5907a', fontSize: 13, marginTop: 14 }}>{submitError}</p>
              )}
            </div>
          )}

          {step === 'success' && (
            <div style={{ textAlign: 'center', padding: '1rem 0 0.5rem' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>✓</div>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 16, color: 'var(--cream)', lineHeight: 1.7, margin: 0 }}>
                {successMsg}
              </p>
            </div>
          )}
        </div>

        <div
          style={{
            flexShrink: 0,
            padding: '16px 20px 22px',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            flexDirection: isNarrow ? 'column' : 'row',
            gap: 10,
            flexWrap: 'wrap',
            justifyContent: 'flex-end',
          }}
        >
          {step === 'cart' && (
            <>
              <button
                type="button"
                onClick={goBrowseMenu}
                style={{
                  padding: '12px 20px',
                  borderRadius: 24,
                  border: '1px solid rgba(255,255,255,0.15)',
                  background: 'transparent',
                  color: 'var(--cream)',
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: 14,
                  cursor: 'pointer',
                  order: isNarrow ? 2 : 0,
                }}
              >
                {t.order.browseMenu}
              </button>
              <button
                type="button"
                onClick={onContinueFromCart}
                disabled={!lines.length}
                style={{
                  padding: '12px 24px',
                  borderRadius: 24,
                  border: 'none',
                  background: lines.length ? 'var(--pink)' : 'rgba(242,184,198,0.25)',
                  color: lines.length ? 'var(--dark)' : 'rgba(15,31,23,0.5)',
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: lines.length ? 'pointer' : 'not-allowed',
                }}
              >
                {t.order.checkout}
              </button>
            </>
          )}

          {step === 'details' && (
            <>
              <button
                type="button"
                onClick={() => { setStep('cart'); setFieldError(''); }}
                style={{
                  padding: '12px 20px',
                  borderRadius: 24,
                  border: '1px solid rgba(255,255,255,0.15)',
                  background: 'transparent',
                  color: 'var(--cream)',
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: 14,
                  cursor: 'pointer',
                }}
              >
                {t.order.back}
              </button>
              <button
                type="button"
                onClick={onGoReview}
                style={{
                  padding: '12px 24px',
                  borderRadius: 24,
                  border: 'none',
                  background: 'var(--pink)',
                  color: 'var(--dark)',
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {t.order.reviewOrder}
              </button>
            </>
          )}

          {step === 'review' && (
            <>
              <button
                type="button"
                disabled={submitting}
                onClick={() => { setStep('details'); setSubmitError(''); }}
                style={{
                  padding: '12px 20px',
                  borderRadius: 24,
                  border: '1px solid rgba(255,255,255,0.15)',
                  background: 'transparent',
                  color: 'var(--cream)',
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: 14,
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  opacity: submitting ? 0.6 : 1,
                }}
              >
                {t.order.back}
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={onConfirmOrder}
                style={{
                  padding: '12px 24px',
                  borderRadius: 24,
                  border: 'none',
                  background: submitting ? 'rgba(242,184,198,0.5)' : 'var(--pink)',
                  color: 'var(--dark)',
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: submitting ? 'wait' : 'pointer',
                }}
              >
                {submitting ? t.order.submitting : t.order.confirmSend}
              </button>
            </>
          )}

          {step === 'success' && (
            <button
              type="button"
              onClick={() => {
                setStep('cart');
                setOpen(false);
              }}
              style={{
                width: isNarrow ? '100%' : 'auto',
                padding: '12px 24px',
                borderRadius: 24,
                border: 'none',
                background: 'var(--pink)',
                color: 'var(--dark)',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {t.order.orderMore}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { OrderCartPanel });
