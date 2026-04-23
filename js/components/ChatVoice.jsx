// ============================================================
// SUSHI DEMURE — Chat Widget + Voice Section
// ============================================================

function ChatWidget({ t }) {
  const makeTimestamp = () => new Date().toISOString();
  const formatTimestamp = (iso) => {
    try {
      const d = new Date(iso);
      const locale = t.lang === 'ar' ? 'ar-SA' : 'en-US';
      const time = new Intl.DateTimeFormat(locale, {
        hour: 'numeric',
        minute: '2-digit',
      }).format(d);
      return time;
    } catch {
      return '';
    }
  };

  const [open, setOpen] = React.useState(false);
  const [messages, setMessages] = React.useState([
    { role: 'ai', text: t.chat.welcome, ts: makeTimestamp() }
  ]);
  const [input, setInput] = React.useState('');
  const [typing, setTyping] = React.useState(false);
  const bottomRef = React.useRef(null);
  const inlineInputRef = React.useRef(null);
  const floatingInputRef = React.useRef(null);

  React.useEffect(() => {
    if (bottomRef.current) bottomRef.current.scrollTop = bottomRef.current.scrollHeight;
  }, [messages, typing]);

  // Reset welcome message when language changes
  React.useEffect(() => {
    setMessages([{ role: 'ai', text: t.chat.welcome, ts: makeTimestamp() }]);
  }, [t.lang]);

  const send = async (text) => {
    const msg = (text || input).trim();
    if (!msg) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: msg, ts: makeTimestamp() }]);
    setTyping(true);
    try {
      const res = await window.SushiServices.sendChatMessage(msg, messages, t.lang);
      setMessages(prev => [...prev, { role: 'ai', text: res.reply, ts: makeTimestamp() }]);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: t.lang === 'ar' ? 'عذراً، حدث خطأ. حاول مرة أخرى.' : 'Sorry, something went wrong. Please try again.', ts: makeTimestamp() }]);
    } finally {
      setTyping(false);
    }
  };

  const autoResizeTextarea = (el) => {
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  };

  React.useEffect(() => {
    autoResizeTextarea(inlineInputRef.current);
    autoResizeTextarea(floatingInputRef.current);
  }, [input, open]);

  const handleInput = (e) => {
    setInput(e.target.value);
    autoResizeTextarea(e.target);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const goToVoice = () => {
    const el = document.querySelector('#voice');
    if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
  };

  const Bubble = ({ msg }) => {
    const isUser = msg.role === 'user';
    const isRtl = t.dir === 'rtl';
    const containerAlign = isUser
      ? (isRtl ? 'flex-start' : 'flex-end')
      : (isRtl ? 'flex-end' : 'flex-start');

    return (
      <div style={{ display: 'flex', justifyContent: containerAlign, marginBottom: 10 }}>
        {isUser ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: containerAlign, maxWidth: '75%' }}>
            <div style={{
              display: 'inline-block',
              padding: '8px 14px',
              borderRadius: isRtl ? '18px 18px 18px 4px' : '18px 18px 4px 18px',
              background: 'var(--pink)',
              color: 'var(--dark)',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: 14,
              lineHeight: 1.4,
              textAlign: isRtl ? 'right' : 'left',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}>
              {msg.text}
            </div>
            {msg.ts && (
              <div style={{
                marginTop: 3,
                fontFamily: 'DM Sans, sans-serif',
                fontSize: 10,
                lineHeight: 1,
                opacity: 0.42,
                color: 'rgba(248,244,239,0.7)',
              }}>
                {formatTimestamp(msg.ts)}
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'flex-end', maxWidth: '85%' }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--green)', border: '1px solid rgba(240,184,200,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, marginInlineEnd: 8, flexShrink: 0 }}>✦</div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', maxWidth: 'calc(100% - 36px)' }}>
              <div style={{
                display: 'inline-block',
                padding: '10px 14px',
                borderRadius: '18px 18px 18px 4px',
                background: 'rgba(255,255,255,0.07)',
                color: 'var(--cream)',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: 14,
                lineHeight: 1.6,
                textAlign: isRtl ? 'right' : 'left',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}>
                {msg.text}
              </div>
              {msg.ts && (
                <div style={{
                  marginTop: 3,
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: 10,
                  lineHeight: 1,
                  opacity: 0.42,
                  color: 'rgba(248,244,239,0.7)',
                }}>
                  {formatTimestamp(msg.ts)}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Dedicated chat section */}
      <section id="chat" style={{ background: 'var(--dark)', padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px,1fr))', gap: 64, alignItems: 'start' }}>
            {/* Left — info */}
            <div>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--pink)', display: 'block', marginBottom: 16 }}>
                {t.lang === 'ar' ? 'مساعد ذكي' : 'AI Assistant'}
              </span>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem,3.5vw,3rem)', color: 'var(--cream)', margin: '0 0 20px', lineHeight: 1.2 }}>{t.chat.title}</h2>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 16, color: 'rgba(248,244,239,0.6)', lineHeight: 1.8, marginBottom: 32 }}>{t.chat.sub}</p>
              {/* Quick actions for section */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {t.chat.quickActions.map((a, i) => (
                  <button key={i} onClick={() => { setOpen(true); setTimeout(() => send(a), 100); }}
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(248,244,239,0.75)', padding: '8px 18px', borderRadius: 24, fontFamily: 'DM Sans, sans-serif', fontSize: 13, cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.target.style.borderColor = 'var(--pink)'; e.target.style.color = 'var(--pink)'; }}
                    onMouseLeave={e => { e.target.style.borderColor = 'rgba(255,255,255,0.12)'; e.target.style.color = 'rgba(248,244,239,0.75)'; }}>
                    {a}
                  </button>
                ))}
              </div>
            </div>

            {/* Inline chat window */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: 480 }}>
              {/* Chat header */}
              <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--green)', border: '1px solid rgba(240,184,200,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>✦</div>
                <div>
                  <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 600, color: 'var(--cream)' }}>Demure AI</div>
                  <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: '#7dcea0' }}>● {t.lang === 'ar' ? 'متصل' : 'Online'}</div>
                </div>
              </div>
              {/* Messages */}
              <div ref={bottomRef} style={{ flex: 1, overflowY: 'auto', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 4, scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }} dir={t.dir}>
                {messages.map((m, i) => <Bubble key={i} msg={m} />)}
                {typing && (
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', opacity: 0.7, paddingInlineStart: 36 }}>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {[0,1,2].map(i => (
                        <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--pink)', animation: `bounce 1.2s ${i*0.2}s infinite` }}/>
                      ))}
                    </div>
                    <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'rgba(248,244,239,0.5)' }}>{t.chat.typing}</span>
                  </div>
                )}
              </div>
              {/* Input */}
              <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: 10 }} dir={t.dir}>
                <textarea ref={inlineInputRef} value={input} onChange={handleInput} onKeyDown={handleKey}
                  placeholder={t.chat.placeholder} dir={t.dir}
                  rows={1}
                  style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, padding: '10px 16px', fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--cream)', outline: 'none', resize: 'none', overflowY: 'auto', minHeight: 42, maxHeight: 120, lineHeight: 1.4 }}
                  onFocus={e => e.target.style.borderColor = 'var(--pink)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
                <button onClick={() => send()} disabled={!input.trim() || typing}
                  style={{ background: input.trim() && !typing ? 'var(--pink)' : 'rgba(255,255,255,0.06)', color: input.trim() && !typing ? 'var(--dark)' : 'rgba(255,255,255,0.3)', border: 'none', borderRadius: '50%', width: 42, height: 42, cursor: input.trim() && !typing ? 'pointer' : 'default', fontSize: 16, flexShrink: 0, transition: 'all 0.2s' }}>
                  →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating chat button */}
      <button onClick={goToVoice} aria-label="Open voice assistant"
        style={{ position: 'fixed', bottom: 24, right: t.dir === 'rtl' ? 'auto' : 92, left: t.dir === 'rtl' ? 92 : 'auto', zIndex: 900, width: 56, height: 56, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.18)', cursor: 'pointer', boxShadow: '0 8px 32px rgba(0,0,0,0.25)', fontSize: 22, transition: 'all 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--cream)' }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.07)'; e.currentTarget.style.borderColor = 'var(--pink)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'; }}>
        🎙️
      </button>

      {/* Floating chat button */}
      <button onClick={() => setOpen(!open)} aria-label="Open chat"
        style={{ position: 'fixed', bottom: 24, right: t.dir === 'rtl' ? 'auto' : 24, left: t.dir === 'rtl' ? 24 : 'auto', zIndex: 900, width: 56, height: 56, borderRadius: '50%', background: 'var(--pink)', border: 'none', cursor: 'pointer', boxShadow: '0 8px 32px rgba(240,184,200,0.35)', fontSize: 22, transition: 'all 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
        {open ? '✕' : '💬'}
      </button>

      {/* Floating chat window */}
      {open && (
        <div style={{ position: 'fixed', bottom: 90, right: t.dir === 'rtl' ? 'auto' : 24, left: t.dir === 'rtl' ? 24 : 'auto', zIndex: 900, width: 340, background: 'var(--dark-2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, boxShadow: '0 24px 80px rgba(0,0,0,0.5)', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: 440 }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>✦</div>
              <div>
                <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 600, color: 'var(--cream)' }}>Demure AI</div>
                <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, color: '#7dcea0' }}>● {t.lang === 'ar' ? 'متصل' : 'Online'}</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 16, padding: 4 }}>✕</button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '14px 12px', scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }} dir={t.dir}>
            {messages.map((m, i) => <Bubble key={i} msg={m} />)}
            {typing && (
              <div style={{ display: 'flex', gap: 4, paddingInlineStart: 8, paddingTop: 4 }}>
                {[0,1,2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--pink)', animation: `bounce 1.2s ${i*0.2}s infinite` }}/>)}
              </div>
            )}
          </div>
          <div style={{ padding: '10px 12px', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexWrap: 'wrap', gap: 6, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            {t.chat.quickActions.slice(0,3).map((a,i) => (
              <button key={i} onClick={() => send(a)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(248,244,239,0.65)', padding: '4px 12px', borderRadius: 20, fontFamily: 'DM Sans, sans-serif', fontSize: 11, cursor: 'pointer' }}>{a}</button>
            ))}
          </div>
          <div style={{ padding: '10px 12px', display: 'flex', gap: 8 }} dir={t.dir}>
            <textarea ref={floatingInputRef} value={input} onChange={handleInput} onKeyDown={handleKey}
              placeholder={t.chat.placeholder} dir={t.dir}
              rows={1}
              style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '8px 14px', fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--cream)', outline: 'none', resize: 'none', overflowY: 'auto', minHeight: 36, maxHeight: 120, lineHeight: 1.4 }}
              onFocus={e => e.target.style.borderColor = 'var(--pink)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
            <button onClick={() => send()} disabled={!input.trim() || typing}
              style={{ background: input.trim() && !typing ? 'var(--pink)' : 'rgba(255,255,255,0.06)', color: input.trim() && !typing ? 'var(--dark)' : 'rgba(255,255,255,0.3)', border: 'none', borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', fontSize: 14, flexShrink: 0, transition: 'all 0.2s' }}>→</button>
          </div>
        </div>
      )}
    </>
  );
}

// ── Voice AI Section (Retell AI) ──────────────────────────────
// Agent + public key: documented in /INTEGRATION.md
const RETELL_AGENT_ID  = 'agent_714b199204c6cc01cd77ebc37d';
const RETELL_PUBLIC_KEY = 'public_key_3c5ba26e49b46112b6dbb';

function VoiceSection({ t }) {
  const [voiceState, setVoiceState] = React.useState('idle');
  const [voiceNote, setVoiceNote] = React.useState('');
  const [voiceTranscript, setVoiceTranscript] = React.useState([]);
  const retellRef = React.useRef(null);
  const isStartingRef = React.useRef(false);
  const sdkReadyRef = React.useRef(null);
  const transcriptRef = React.useRef([]);

  const upsertTranscriptTurn = React.useCallback((role, text) => {
    const msg = String(text || '').trim();
    if (!msg) return;
    const prev = transcriptRef.current;
    const last = prev[prev.length - 1];

    // Retell sends many partial updates; keep one row per speaker turn and update it.
    if (last && last.role === role) {
      const nextText = msg.length >= last.text.length ? msg : last.text;
      if (nextText !== last.text) {
        const updated = [...prev];
        updated[updated.length - 1] = { ...last, text: nextText, ts: Date.now() };
        transcriptRef.current = updated;
      } else {
        transcriptRef.current = prev;
      }
    } else {
      const item = { role, text: msg, ts: Date.now() };
      transcriptRef.current = [...prev.slice(-7), item];
    }
    setVoiceTranscript(transcriptRef.current);
  }, []);

  const parseTranscriptItems = React.useCallback((update, fallbackRole = null) => {
    const out = [];
    const u = update || {};
    const normRole = (raw) => {
      const r = String(raw || '').toLowerCase();
      if (/agent|assistant|ai|bot/.test(r)) return 'ai';
      if (/user|human|caller|customer|client/.test(r)) return 'you';
      if (fallbackRole === 'ai' || fallbackRole === 'you') return fallbackRole;
      return null;
    };
    const add = (roleRaw, textRaw) => {
      const role = normRole(roleRaw);
      const text = String(textRaw || '').trim();
      if (role && text) out.push({ role, text });
    };

    // Common shapes
    add(u.role || u.speaker || u.source || u.participant, u.transcript || u.text || u.message || u.content);

    // transcript object shape
    if (u.transcript && typeof u.transcript === 'object') {
      add(
        u.transcript.role || u.transcript.speaker || u.transcript.source || u.transcript.participant,
        u.transcript.text || u.transcript.content || u.transcript.transcript
      );
    }

    // messages array shape
    if (Array.isArray(u.messages)) {
      u.messages.forEach((m) => add(m.role || m.speaker || m.source || m.participant, m.text || m.content || m.transcript || m.message));
    }

    // utterances array shape
    if (Array.isArray(u.utterances)) {
      u.utterances.forEach((m) => add(m.role || m.speaker || m.source || m.participant, m.text || m.content || m.transcript || m.message));
    }

    // chunks/parts nested shape
    if (Array.isArray(u.parts)) {
      u.parts.forEach((m) => add(m.role || m.speaker || m.source || m.participant, m.text || m.content || m.transcript || m.message));
    }

    // Deep-scan fallback for unknown payload shapes.
    const seen = new Set();
    const walk = (node, depth = 0) => {
      if (!node || depth > 4) return;
      if (Array.isArray(node)) {
        node.forEach((x) => walk(x, depth + 1));
        return;
      }
      if (typeof node !== 'object') return;
      const roleGuess = node.role || node.speaker || node.source || node.participant || node.type || node.channel;
      [
        node.text, node.transcript, node.message, node.content, node.final_transcript,
        node.partial_transcript, node.user_transcript, node.agent_transcript,
      ].forEach((txt) => {
        const t = String(txt || '').trim();
        if (!t) return;
        const key = `${String(roleGuess || fallbackRole || '')}::${t}`;
        if (seen.has(key)) return;
        seen.add(key);
        add(roleGuess, t);
      });
      Object.values(node).forEach((v) => walk(v, depth + 1));
    };
    walk(u);

    return out;
  }, []);

  const teardownCall = React.useCallback((nextState = 'ended', note = '') => {
    try {
      if (retellRef.current) retellRef.current.stopCall();
    } catch (e) {
      console.warn('Retell stopCall warning:', e);
    } finally {
      retellRef.current = null;
      isStartingRef.current = false;
      transcriptRef.current = [];
      setVoiceTranscript([]);
      setVoiceState(nextState);
      setVoiceNote(note);
    }
  }, []);

  const ensureMicPermission = React.useCallback(async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('Microphone API unavailable');
    }
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((track) => track.stop());
  }, []);

  const ensureRetellSdk = React.useCallback(async () => {
    if (window.RetellWebClient) return window.RetellWebClient;
    if (!sdkReadyRef.current) {
      sdkReadyRef.current = new Promise((resolve, reject) => {
        // index.html loads RetellWebClient as a module and assigns window.RetellWebClient.
        let tries = 0;
        const check = () => {
          if (window.RetellWebClient) return resolve(true);
          tries += 1;
          if (tries > 40) return reject(new Error('Failed to load Retell SDK'));
          setTimeout(check, 100);
        };
        check();
      });
    }
    try {
      await sdkReadyRef.current;
    } catch (e) {
      // Allow a clean retry on next click if SDK loading fails once.
      sdkReadyRef.current = null;
      throw e;
    }
    if (!window.RetellWebClient) {
      throw new Error('Retell SDK unavailable');
    }
    return window.RetellWebClient;
  }, []);

  // Load Retell SDK once
  React.useEffect(() => {
    ensureRetellSdk().catch((e) => console.error('Retell SDK preload error:', e));
    return () => { teardownCall('idle'); };
  }, [ensureRetellSdk, teardownCall]);

  const startCall = async () => {
    if (isStartingRef.current || voiceState === 'connecting') return;
    if (retellRef.current) return;
    try {
      isStartingRef.current = true;
      setVoiceNote('');
      setVoiceState('connecting');
      const RetellWebClientCtor = await ensureRetellSdk();

      // Get access token from Retell
      const resp = await fetch('https://api.retellai.com/v2/create-web-call', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RETELL_PUBLIC_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ agent_id: RETELL_AGENT_ID }),
      });
      const data = await resp.json().catch(() => null);
      if (!resp.ok) {
        const apiMsg = data && typeof data.message === 'string' ? data.message : '';
        throw new Error(apiMsg ? `Retell token request failed (${resp.status}): ${apiMsg}` : `Retell token request failed (${resp.status})`);
      }
      const accessToken = data && (data.access_token || data.accessToken);
      if (!accessToken) throw new Error('Missing Retell access token');
      await ensureMicPermission();

      const client = new RetellWebClientCtor();
      retellRef.current = client;
      transcriptRef.current = [];
      setVoiceTranscript([]);
      client.on('call_started',  () => { setVoiceState('active'); setVoiceNote(''); });
      client.on('agent_start_talking', () => { setVoiceState('active'); setVoiceNote(''); });
      client.on('agent_stop_talking',  () => { setVoiceState('listening'); setVoiceNote(''); });
      const consumeTranscriptPayload = (payload, fallbackRole = null) => {
        const items = parseTranscriptItems(payload, fallbackRole);
        if (!items.length) return;
        items.forEach((it) => {
          upsertTranscriptTurn(it.role, it.text);
        });
      };

      client.on('update', (update) => consumeTranscriptPayload(update, null));
      client.on('transcript', (payload) => consumeTranscriptPayload(payload, null));
      client.on('metadata', (payload) => consumeTranscriptPayload(payload, null));
      client.on('call_ended',    () => {
        retellRef.current = null;
        isStartingRef.current = false;
        setVoiceState('ended');
        setVoiceNote('');
      });
      client.on('error',         (e) => {
        console.error('Retell runtime error:', e);
        retellRef.current = null;
        isStartingRef.current = false;
        setVoiceState('ended');
        setVoiceNote(t.lang === 'ar' ? 'انقطع الاتصال. حاول مرة أخرى.' : 'Connection dropped. Please try again.');
      });
      await client.startCall({ accessToken, sampleRate: 24000 });
      isStartingRef.current = false;
      setVoiceState('listening');
    } catch (err) {
      console.error('Retell start error:', err);
      const msg = String(err && err.message ? err.message : '');
      const micDenied = /denied|NotAllowedError|Permission/i.test(msg);
      const micUnavailable = /Microphone API unavailable|secure context|insecure|getUserMedia/i.test(msg);
      const sdkIssue = /Retell SDK|load/i.test(msg);
      const domainNotAllowed = /public key is not allowed for this domain/i.test(msg);
      isStartingRef.current = false;
      retellRef.current = null;
      setVoiceState('ended');
      setVoiceNote(
        micDenied
          ? (t.lang === 'ar' ? 'تم رفض إذن الميكروفون.' : 'Microphone permission was denied.')
          : micUnavailable
            ? (t.lang === 'ar' ? 'الميكروفون يحتاج HTTPS أو localhost.' : 'Microphone requires HTTPS or localhost.')
            : domainNotAllowed
              ? (t.lang === 'ar' ? 'مفتاح Retell غير مسموح لهذا الدومين.' : 'Retell public key is not allowed for this domain.')
            : sdkIssue
              ? (t.lang === 'ar' ? 'تعذّر تحميل خدمة الصوت.' : 'Unable to load voice service.')
          : (t.lang === 'ar' ? 'تعذّر بدء الجلسة الصوتية.' : 'Unable to start voice session.')
      );
    }
  };

  const endCall = () => {
    teardownCall('idle');
  };

  const stateConfig = {
    idle:       { label: t.voice.idle,       ring: 'rgba(240,184,200,0.15)', dot: 'var(--pink)',  pulse: false },
    connecting: { label: t.voice.connecting, ring: 'rgba(240,184,200,0.25)', dot: '#f5c878',      pulse: true  },
    listening:  { label: t.voice.listening,  ring: 'rgba(125,206,160,0.25)', dot: '#7dcea0',      pulse: true  },
    active:     { label: t.voice.active,     ring: 'rgba(100,180,255,0.2)',  dot: '#a0c8f5',      pulse: true  },
    ended:      { label: t.voice.ended,      ring: 'rgba(255,255,255,0.08)', dot: 'rgba(255,255,255,0.3)', pulse: false },
  };

  const cfg = stateConfig[voiceState];
  const voiceStatusLabel = voiceNote || cfg.label;
  const isCallLive = voiceState === 'connecting' || voiceState === 'listening' || voiceState === 'active';

  return (
    <section id="voice" style={{ background: 'var(--green)', padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 64, alignItems: 'center' }}>
          {/* Text */}
          <div>
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--pink)', display: 'block', marginBottom: 16 }}>
              {t.lang === 'ar' ? 'صوتي' : 'Voice AI'}
            </span>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem,3.5vw,3rem)', color: 'var(--cream)', margin: '0 0 20px', lineHeight: 1.2 }}>{t.voice.title}</h2>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 16, color: 'rgba(248,244,239,0.65)', lineHeight: 1.8, marginBottom: 32 }}>{t.voice.sub}</p>
            {/* States legend */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {Object.entries(stateConfig).map(([s, c]) => (
                <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 12, opacity: voiceState === s ? 1 : 0.4, transition: 'opacity 0.3s' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: c.dot, flexShrink: 0 }}/>
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--cream)', textTransform: 'capitalize' }}>{s}</span>
                  {voiceState === s && <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'rgba(248,244,239,0.5)' }}>— {c.label}</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Voice card */}
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 28, padding: '3rem 2rem', textAlign: 'center' }}>
            {/* Orb */}
            <div style={{ position: 'relative', width: 140, height: 140, margin: '0 auto 32px' }}>
              {cfg.pulse && (
                <>
                  <div style={{ position: 'absolute', inset: -20, borderRadius: '50%', border: `1px solid ${cfg.ring}`, animation: 'ripple 2s ease-out infinite' }}/>
                  <div style={{ position: 'absolute', inset: -10, borderRadius: '50%', border: `1px solid ${cfg.ring}`, animation: 'ripple 2s 0.5s ease-out infinite' }}/>
                </>
              )}
              <button onClick={voiceState === 'idle' || voiceState === 'ended' ? startCall : endCall}
                style={{ width: 140, height: 140, borderRadius: '50%', background: `radial-gradient(circle at 35% 35%, ${cfg.dot}, rgba(0,0,0,0.3))`, border: `2px solid ${cfg.ring}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, transition: 'all 0.4s', boxShadow: `0 0 48px ${cfg.ring}`, position: 'relative', zIndex: 1 }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                🎙️
              </button>
            </div>

            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: 'rgba(248,244,239,0.7)', marginBottom: 24, minHeight: 24 }}>{voiceStatusLabel}</p>

            {/* ── RETELL AI — Live Integration ──
                Agent ID: agent_714b199204c6cc01cd77ebc37d
                SDK: retell-client-js-sdk (loaded dynamically)
                startCall() calls /v2/create-web-call then RetellWebClient.startCall()
            ────────────────────────────────── */}
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(240,184,200,0.15)', borderRadius: 14, padding: '14px 16px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: voiceState === 'active' || voiceState === 'listening' ? '#7dcea0' : 'rgba(255,255,255,0.2)', display: 'inline-block', flexShrink: 0 }}/>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'rgba(248,244,239,0.5)' }}>
                {voiceState === 'idle' || voiceState === 'ended'
                  ? (t.lang === 'ar' ? 'مساعد ديميور الصوتي — جاهز' : 'Demure Voice Assistant — Ready')
                  : (t.lang === 'ar' ? 'جلسة نشطة — Retell AI' : 'Active session — Retell AI')}
              </span>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 14, padding: '12px 14px', marginBottom: 24, textAlign: t.dir === 'rtl' ? 'right' : 'left' }}>
              <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(248,244,239,0.45)', marginBottom: 10 }}>{t.voice.transcriptTitle}</div>
              <div style={{ maxHeight: 112, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {voiceTranscript.length === 0 ? (
                  <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'rgba(248,244,239,0.45)' }}>{t.voice.transcriptEmpty}</div>
                ) : (
                  voiceTranscript.map((m, i) => (
                    <div key={`${m.ts}-${i}`} style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, lineHeight: 1.5, color: 'rgba(248,244,239,0.75)' }}>
                      <span style={{ color: m.role === 'you' ? 'var(--pink)' : '#9bc5ff', fontWeight: 600 }}>{m.role === 'you' ? t.voice.transcriptYou : t.voice.transcriptAI}:</span> {m.text}
                    </div>
                  ))
                )}
              </div>
            </div>

            <button onClick={voiceState === 'idle' || voiceState === 'ended' ? startCall : endCall}
              style={{ background: 'var(--pink)', color: 'var(--dark)', padding: '12px 28px', borderRadius: 28, border: 'none', fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all 0.25s', letterSpacing: '0.04em' }}
              onMouseEnter={e => e.target.style.background = '#f5c8d5'}
              onMouseLeave={e => e.target.style.background = 'var(--pink)'}>
              {isCallLive ? t.voice.endCta : t.voice.cta}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { ChatWidget, VoiceSection });
