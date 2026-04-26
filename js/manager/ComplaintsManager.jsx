// ============================================================
// SUSHI DEMURE — Manager complaints viewer (read-only)
// GET webhook contract (query params only — search is client-side):
//   - source: website | slack | voice — omit when "all"
//   - category: general | food | … — omit when "all"
//   - status: open | in_progress | resolved — omit when "all"
//   - all three "all" → no query string
// Default first load: source=all, category=all, status=all → no query params (load everything).
// Expected body: JSON array of { name, phone, complaint_text, category, source, status, created_at }
// Optional: if n8n caps rows, set COMPLAINTS_GET_EXTRA_QUERY e.g. "limit=500" (when your workflow supports it).
// ============================================================

/** Production “Get Complaints” webhook (GET + query params). */
const COMPLAINTS_READ_ENDPOINT =
  'https://n8n-zcwg.srv1592624.hstgr.cloud/webhook/f2194549-8f73-48f3-b8a9-11f596ea18c8';

/** Appended to every request after filter params, e.g. `limit=500` — empty = none. */
const COMPLAINTS_GET_EXTRA_QUERY = '';

/** Default rows per page (client-side pagination over the full fetched list). */
const DEFAULT_PAGE_SIZE = 10;

/** Session flag after successful manager login (tab-scoped). */
const MANAGER_SESSION_KEY = 'sushi_demure_manager_auth';

function getManagerAccessKey() {
  return String(typeof window !== 'undefined' && window.MANAGER_ACCESS_KEY != null ? window.MANAGER_ACCESS_KEY : '').trim();
}

function ManagerLogin({ onSuccess }) {
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const configured = getManagerAccessKey().length > 0;

  const submit = (e) => {
    e.preventDefault();
    setError('');
    const key = getManagerAccessKey();
    if (!key) {
      setError('Access key is not set. Edit js/manager/auth.config.js on the server.');
      return;
    }
    if (password === key) {
      sessionStorage.setItem(MANAGER_SESSION_KEY, '1');
      onSuccess();
      return;
    }
    setError('That access key is incorrect. Please try again.');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--dark)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(1.25rem,5vw,2.5rem)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 420,
          background: 'rgba(22, 43, 30, 0.85)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 28,
          padding: 'clamp(1.75rem,4vw,2.5rem)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.45)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.5rem,4vw,1.85rem)', fontWeight: 700, color: 'var(--cream)', lineHeight: 1.2 }}>
            Sushi Demure
          </div>
          <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, color: 'var(--pink)', letterSpacing: '0.22em', textTransform: 'uppercase', marginTop: 10 }}>
            Manager
          </div>
        </div>

        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'rgba(248,244,239,0.55)', textAlign: 'center', lineHeight: 1.6, margin: '0 0 24px' }}>
          Enter the access key to open the complaints dashboard.
        </p>

        <form onSubmit={submit} noValidate>
          <label htmlFor="mgr-access" style={{ display: 'block', fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'rgba(248,244,239,0.5)', marginBottom: 8, letterSpacing: '0.06em' }}>
            Access key
          </label>
          <input
            id="mgr-access"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError('');
            }}
            disabled={!configured}
            placeholder={configured ? '••••••••' : 'Not configured'}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              background: 'rgba(255,255,255,0.06)',
              border: `1px solid ${error ? 'rgba(229,144,122,0.45)' : 'rgba(255,255,255,0.12)'}`,
              borderRadius: 14,
              padding: '14px 16px',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: 15,
              color: 'var(--cream)',
              outline: 'none',
              marginBottom: 16,
            }}
            onFocus={(e) => { e.target.style.borderColor = 'var(--pink)'; }}
            onBlur={(e) => { e.target.style.borderColor = error ? 'rgba(229,144,122,0.45)' : 'rgba(255,255,255,0.12)'; }}
          />

          {error && (
            <p role="alert" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: '#e5907a', margin: '0 0 16px', lineHeight: 1.5 }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={!configured}
            style={{
              width: '100%',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: 15,
              fontWeight: 600,
              padding: '14px 20px',
              borderRadius: 24,
              border: 'none',
              background: configured ? 'var(--pink)' : 'rgba(255,255,255,0.1)',
              color: configured ? 'var(--dark)' : 'rgba(248,244,239,0.35)',
              cursor: configured ? 'pointer' : 'not-allowed',
              letterSpacing: '0.04em',
            }}
          >
            Sign in
          </button>
        </form>

        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'rgba(248,244,239,0.35)', textAlign: 'center', marginTop: 22, lineHeight: 1.5 }}>
          <a href="index.html" style={{ color: 'rgba(248,244,239,0.55)', textDecoration: 'none', borderBottom: '1px solid rgba(242,184,198,0.35)' }}>
            ← Back to website
          </a>
        </p>
      </div>
    </div>
  );
}

function buildComplaintsUrl(source, category, status) {
  const p = new URLSearchParams();
  if (source !== 'all') p.set('source', source);
  if (category !== 'all') p.set('category', category);
  if (status !== 'all') p.set('status', status);
  const extra = String(COMPLAINTS_GET_EXTRA_QUERY || '').trim();
  if (extra) {
    const frag = extra.startsWith('?') ? extra.slice(1) : extra;
    new URLSearchParams(frag).forEach((v, k) => p.set(k, v));
  }
  const qs = p.toString();
  return qs ? `${COMPLAINTS_READ_ENDPOINT}?${qs}` : COMPLAINTS_READ_ENDPOINT;
}

function rowLooksLikeComplaint(row) {
  if (!row || typeof row !== 'object' || Array.isArray(row)) return false;
  return ['complaint_text', 'category', 'created_at', 'status', 'source', 'phone', 'name', '_id', 'id'].some(
    (k) => Object.prototype.hasOwnProperty.call(row, k),
  );
}

/** Mongo / JSON export style: { "0": {...}, "1": {...} } */
function arrayFromNumericKeyedObject(obj) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return null;
  const keys = Object.keys(obj);
  if (keys.length === 0) return null;
  if (!keys.every((k) => /^\d+$/.test(k))) return null;
  return keys
    .sort((a, b) => Number(a) - Number(b))
    .map((k) => obj[k])
    .filter((r) => r && typeof r === 'object');
}

/** Concatenate every array on the object whose elements look like complaints (no double-count same ref). */
function mergeComplaintArraysFromObject(obj) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return [];
  const seen = new Set();
  const out = [];
  const pushUnique = (arr) => {
    arr.forEach((item) => {
      if (!item || typeof item !== 'object') return;
      const id = item._id ?? item.id;
      const sig = id != null ? `id:${String(id)}` : `h:${String(item.created_at)}|${String(item.phone)}|${String(item.complaint_text).slice(0, 80)}`;
      if (seen.has(sig)) return;
      seen.add(sig);
      out.push(item);
    });
  };
  for (const v of Object.values(obj)) {
    if (!Array.isArray(v) || v.length === 0) continue;
    const first = v[0];
    if (first && typeof first === 'object' && rowLooksLikeComplaint(first)) {
      pushUnique(v.filter((r) => r && typeof r === 'object'));
    }
  }
  return out;
}

/**
 * Normalize API payload to a flat array of complaint objects.
 * Contract: prefer top-level array; also supports { data }, numeric-key maps, and merged arrays.
 */
function normalizeComplaintsList(raw) {
  if (Array.isArray(raw)) {
    return raw.filter((r) => r && typeof r === 'object');
  }
  if (!raw || typeof raw !== 'object') return [];

  const fromNumeric = arrayFromNumericKeyedObject(raw);
  if (fromNumeric && fromNumeric.length) return fromNumeric;

  const tryKeys = ['data', 'complaints', 'items', 'results', 'records', 'rows', 'list', 'payload', 'body', 'response'];
  for (const key of tryKeys) {
    if (!(key in raw)) continue;
    const v = raw[key];
    if (Array.isArray(v)) {
      const arr = v.filter((r) => r && typeof r === 'object');
      if (arr.length) return arr;
    } else if (v && typeof v === 'object') {
      const inner = normalizeComplaintsList(v);
      if (inner.length) return inner;
    }
  }

  for (const v of Object.values(raw)) {
    if (!Array.isArray(v) || v.length === 0) continue;
    const first = v[0];
    if (first && typeof first === 'object' && rowLooksLikeComplaint(first)) {
      return v.filter((r) => r && typeof r === 'object');
    }
  }

  if (rowLooksLikeComplaint(raw)) return [raw];

  const merged = mergeComplaintArraysFromObject(raw);
  return merged;
}

/** Parse HTTP body safely: single JSON, BOM strip, optional NDJSON lines, or outer [...] slice. */
function parseComplaintsResponseText(text) {
  const raw = String(text || '').replace(/^\uFEFF/, '').trim();
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    /* continue */
  }
  const lines = raw.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (lines.length > 1) {
    const merged = [];
    for (const line of lines) {
      try {
        const v = JSON.parse(line);
        if (Array.isArray(v)) merged.push(...v);
        else if (v && typeof v === 'object') merged.push(v);
      } catch {
        /* skip line */
      }
    }
    if (merged.length) return merged;
  }
  const lb = raw.indexOf('[');
  const rb = raw.lastIndexOf(']');
  if (lb >= 0 && rb > lb) {
    try {
      return JSON.parse(raw.slice(lb, rb + 1));
    } catch {
      /* fallthrough */
    }
  }
  return null;
}

function sortByCreatedDesc(list) {
  return [...list].sort((a, b) => {
    const ta = new Date(a.created_at || 0).getTime();
    const tb = new Date(b.created_at || 0).getTime();
    return tb - ta;
  });
}

function formatDateTime(iso) {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return String(iso || '—');
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(d);
  } catch {
    return String(iso || '—');
  }
}

function statusBadgeStyle(status) {
  const s = String(status || '').toLowerCase().replace(/\s+/g, '_');
  if (s === 'resolved') {
    return { bg: 'rgba(125,206,160,0.18)', border: 'rgba(125,206,160,0.35)', color: '#b8e6c8' };
  }
  if (s === 'in_progress' || s === 'inprogress') {
    return { bg: 'rgba(245,200,120,0.15)', border: 'rgba(245,200,120,0.35)', color: '#f5d4a0' };
  }
  if (s === 'open') {
    return { bg: 'rgba(229,144,122,0.14)', border: 'rgba(229,144,122,0.35)', color: '#f0c4b8' };
  }
  return { bg: 'rgba(255,255,255,0.06)', border: 'rgba(255,255,255,0.12)', color: 'rgba(248,244,239,0.75)' };
}

function Badge({ children, style }) {
  return (
    <span
      style={{
        display: 'inline-block',
        fontFamily: 'DM Sans, sans-serif',
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        padding: '4px 10px',
        borderRadius: 20,
        border: `1px solid ${style.border}`,
        background: style.bg,
        color: style.color,
      }}
    >
      {children}
    </span>
  );
}

function ManagerComplaintsApp({ onLogout }) {
  const [source, setSource] = React.useState('all');
  const [category, setCategory] = React.useState('all');
  const [status, setStatus] = React.useState('all');
  const [search, setSearch] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(DEFAULT_PAGE_SIZE);

  const [rawRows, setRawRows] = React.useState([]);
  const [loadState, setLoadState] = React.useState('loading');

  const inp = {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 14,
    padding: '10px 14px',
    fontFamily: 'DM Sans, sans-serif',
    fontSize: 14,
    color: 'var(--cream)',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
  };

  const sel = {
    ...inp,
    cursor: 'pointer',
    appearance: 'none',
  };

  React.useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoadState('loading');
      const url = buildComplaintsUrl(source, category, status);
      try {
        const res = await fetch(url, {
          method: 'GET',
          headers: { Accept: 'application/json' },
          cache: 'no-store',
        });
        const text = await res.text();
        if (!res.ok) {
          if (!cancelled) {
            setRawRows([]);
            setLoadState('error');
          }
          return;
        }
        const json = parseComplaintsResponseText(text);
        if (json === null) {
          if (!cancelled) {
            setRawRows([]);
            setLoadState('error');
          }
          return;
        }
        const list = sortByCreatedDesc(normalizeComplaintsList(json));
        if (!cancelled) {
          setRawRows(list);
          setLoadState('ready');
        }
      } catch {
        if (!cancelled) {
          setRawRows([]);
          setLoadState('error');
        }
      }
    };
    run();
    return () => { cancelled = true; };
  }, [source, category, status]);

  React.useEffect(() => {
    setPage(1);
  }, [source, category, status, search]);

  const filteredRows = React.useMemo(() => {
    const q = String(search).trim().toLowerCase();
    if (!q) return rawRows;
    return rawRows.filter((row) => {
      const name = String(row.name || '').toLowerCase();
      const phone = String(row.phone || '').toLowerCase();
      const text = String(row.complaint_text || '').toLowerCase();
      return name.includes(q) || phone.includes(q) || text.includes(q);
    });
  }, [rawRows, search]);

  const totalCount = filteredRows.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  React.useEffect(() => {
    setPage((p) => Math.min(Math.max(1, p), totalPages));
  }, [totalPages]);

  const paginatedRows = React.useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, page, pageSize]);

  const rangeStart = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, totalCount);

  const btnBase = {
    fontFamily: 'DM Sans, sans-serif',
    fontSize: 13,
    fontWeight: 600,
    padding: '8px 16px',
    borderRadius: 24,
    border: '1px solid rgba(255,255,255,0.14)',
    cursor: 'pointer',
    transition: 'all 0.2s',
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--dark)' }}>
      <header style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(14,28,20,0.92)', backdropFilter: 'blur(12px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '16px clamp(1rem,4vw,2rem)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 700, color: 'var(--cream)' }}>Sushi Demure</div>
            <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, color: 'var(--pink)', letterSpacing: '0.18em', textTransform: 'uppercase', marginTop: 2 }}>Manager</div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10 }}>
            {typeof onLogout === 'function' && (
              <button
                type="button"
                onClick={onLogout}
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: 13,
                  color: 'rgba(248,244,239,0.8)',
                  background: 'rgba(255,255,255,0.06)',
                  padding: '8px 16px',
                  borderRadius: 24,
                  border: '1px solid rgba(255,255,255,0.12)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--pink)'; e.currentTarget.style.color = 'var(--cream)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'rgba(248,244,239,0.8)'; }}
              >
                Sign out
              </button>
            )}
            <a
              href="index.html"
              style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: 13,
                color: 'rgba(248,244,239,0.7)',
                textDecoration: 'none',
                padding: '8px 16px',
                borderRadius: 24,
                border: '1px solid rgba(255,255,255,0.12)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--pink)'; e.currentTarget.style.color = 'var(--cream)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'rgba(248,244,239,0.7)'; }}
            >
              ← Main site
            </a>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(2rem,5vw,3.5rem) clamp(1rem,4vw,2rem)' }}>
        <div style={{ marginBottom: 32 }}>
          <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--pink)', display: 'block', marginBottom: 12 }}>
            Operations
          </span>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.85rem,4vw,2.75rem)', color: 'var(--cream)', margin: '0 0 12px', lineHeight: 1.15 }}>
            Manager Complaints
          </h1>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 16, color: 'rgba(248,244,239,0.58)', maxWidth: 560, lineHeight: 1.65, margin: 0 }}>
            Review submitted complaints and track customer issues.
          </p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginBottom: 16, alignItems: 'flex-end' }}>
          <div style={{ flex: '1 1 160px', minWidth: 0 }}>
            <label style={{ display: 'block', fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'rgba(248,244,239,0.5)', marginBottom: 6, letterSpacing: '0.04em' }}>Source</label>
            <select value={source} onChange={(e) => setSource(e.target.value)} style={sel}>
              <option value="website" style={{ background: '#162b1e' }}>Website</option>
              <option value="slack" style={{ background: '#162b1e' }}>Slack</option>
              <option value="voice" style={{ background: '#162b1e' }}>Voice</option>
              <option value="all" style={{ background: '#162b1e' }}>All</option>
            </select>
          </div>
          <div style={{ flex: '1 1 160px', minWidth: 0 }}>
            <label style={{ display: 'block', fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'rgba(248,244,239,0.5)', marginBottom: 6, letterSpacing: '0.04em' }}>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} style={sel}>
              <option value="all" style={{ background: '#162b1e' }}>All</option>
              <option value="general" style={{ background: '#162b1e' }}>General</option>
              <option value="food" style={{ background: '#162b1e' }}>Food</option>
              <option value="service" style={{ background: '#162b1e' }}>Service</option>
              <option value="reservation" style={{ background: '#162b1e' }}>Reservation</option>
              <option value="delivery" style={{ background: '#162b1e' }}>Delivery</option>
              <option value="billing" style={{ background: '#162b1e' }}>Billing</option>
            </select>
          </div>
          <div style={{ flex: '1 1 160px', minWidth: 0 }}>
            <label style={{ display: 'block', fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'rgba(248,244,239,0.5)', marginBottom: 6, letterSpacing: '0.04em' }}>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} style={sel}>
              <option value="all" style={{ background: '#162b1e' }}>All</option>
              <option value="open" style={{ background: '#162b1e' }}>Open</option>
              <option value="in_progress" style={{ background: '#162b1e' }}>In Progress</option>
              <option value="resolved" style={{ background: '#162b1e' }}>Resolved</option>
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: 20, marginBottom: 28 }}>
          <div style={{ flex: '1 1 220px', minWidth: 0 }}>
            <label style={{ display: 'block', fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'rgba(248,244,239,0.5)', marginBottom: 6, letterSpacing: '0.04em' }}>Search (name, phone, text)</label>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter loaded results…"
              style={{ ...inp, maxWidth: 'min(100%, 480px)' }}
              onFocus={(e) => { e.target.style.borderColor = 'var(--pink)'; }}
              onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
            />
          </div>
          <div style={{ flex: '0 1 140px' }}>
            <label style={{ display: 'block', fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'rgba(248,244,239,0.5)', marginBottom: 6, letterSpacing: '0.04em' }}>Per page</label>
            <select
              value={String(pageSize)}
              onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
              style={sel}
            >
              <option value="10" style={{ background: '#162b1e' }}>10</option>
              <option value="25" style={{ background: '#162b1e' }}>25</option>
              <option value="50" style={{ background: '#162b1e' }}>50</option>
            </select>
          </div>
        </div>

        {loadState === 'ready' && rawRows.length > 0 && (
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'rgba(248,244,239,0.45)', margin: '-8px 0 20px' }}>
            Loaded <strong style={{ color: 'rgba(248,244,239,0.75)', fontWeight: 600 }}>{rawRows.length}</strong> record{rawRows.length === 1 ? '' : 's'} from the server
            {search.trim() ? ` · ${totalCount} match${totalCount === 1 ? '' : 'es'} after search` : ''}.
          </p>
        )}

        {loadState === 'loading' && (
          <div style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
            <div style={{ width: 44, height: 44, border: '3px solid rgba(240,184,198,0.2)', borderTopColor: 'var(--pink)', borderRadius: '50%', animation: 'spin 0.9s linear infinite', margin: '0 auto 20px' }} />
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: 'rgba(248,244,239,0.55)' }}>Loading complaints...</p>
          </div>
        )}

        {loadState === 'error' && (
          <div
            role="alert"
            style={{
              padding: '22px 20px',
              borderRadius: 20,
              background: 'rgba(229,144,122,0.1)',
              border: '1px solid rgba(229,144,122,0.28)',
              maxWidth: 520,
            }}
          >
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: 'rgba(248,244,239,0.92)', margin: 0, lineHeight: 1.6 }}>
              Sorry, complaints could not be loaded right now.
            </p>
          </div>
        )}

        {loadState === 'ready' && filteredRows.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '3.5rem 1.5rem',
              borderRadius: 24,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: 'rgba(248,244,239,0.5)', margin: 0 }}>
              No complaints found for the selected filters.
            </p>
          </div>
        )}

        {loadState === 'ready' && filteredRows.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {paginatedRows.map((row, idx) => {
              const st = String(row.status || 'open').toLowerCase().replace(/\s+/g, '_');
              const stLabel = st === 'in_progress' ? 'In progress' : st;
              const cat = String(row.category || '—');
              const src = String(row.source || '—');
              const globalIdx = (page - 1) * pageSize + idx;
              return (
                <article
                  key={row._id || row.id || `row-${globalIdx}-${String(row.created_at || '')}-${String(row.phone || '')}`}
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 24,
                    padding: '1.35rem clamp(1rem,3vw,1.5rem)',
                  }}
                >
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14, marginBottom: 14 }}>
                    <div>
                      <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.15rem,2.5vw,1.35rem)', color: 'var(--cream)', margin: '0 0 6px', fontWeight: 600 }}>
                        {row.name || '—'}
                      </h2>
                      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'rgba(248,244,239,0.55)', margin: 0 }}>{row.phone || '—'}</p>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
                      <Badge style={{ bg: 'rgba(242,184,198,0.12)', border: 'rgba(242,184,198,0.28)', color: 'var(--pink)' }}>{cat}</Badge>
                      <Badge style={{ bg: 'rgba(255,255,255,0.06)', border: 'rgba(255,255,255,0.14)', color: 'rgba(248,244,239,0.8)' }}>{src}</Badge>
                      <Badge style={statusBadgeStyle(st)}>{stLabel || '—'}</Badge>
                    </div>
                  </div>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'rgba(248,244,239,0.82)', lineHeight: 1.65, margin: '0 0 14px', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {row.complaint_text || '—'}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 10, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'rgba(248,244,239,0.4)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                      Submitted
                    </span>
                    <time dateTime={row.created_at || ''} style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'rgba(248,244,239,0.65)' }}>
                      {formatDateTime(row.created_at)}
                    </time>
                  </div>
                  {/* Reserved: status action buttons when a PATCH/POST endpoint exists */}
                </article>
              );
            })}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 16,
                marginTop: 8,
                paddingTop: 22,
                borderTop: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'rgba(248,244,239,0.5)' }}>
                Showing <strong style={{ color: 'var(--cream)', fontWeight: 600 }}>{rangeStart}</strong>
                {' – '}
                <strong style={{ color: 'var(--cream)', fontWeight: 600 }}>{rangeEnd}</strong>
                {' of '}
                <strong style={{ color: 'var(--cream)', fontWeight: 600 }}>{totalCount}</strong>
                {totalPages > 1 ? ` · Page ${page} of ${totalPages}` : ''}
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  style={{
                    ...btnBase,
                    background: page <= 1 ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)',
                    color: page <= 1 ? 'rgba(248,244,239,0.25)' : 'var(--cream)',
                    cursor: page <= 1 ? 'default' : 'pointer',
                  }}
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  style={{
                    ...btnBase,
                    background: page >= totalPages ? 'rgba(255,255,255,0.04)' : 'var(--pink)',
                    color: page >= totalPages ? 'rgba(248,244,239,0.25)' : 'var(--dark)',
                    borderColor: page >= totalPages ? 'rgba(255,255,255,0.14)' : 'transparent',
                    cursor: page >= totalPages ? 'default' : 'pointer',
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function ManagerRoot() {
  const [authed, setAuthed] = React.useState(
    () => sessionStorage.getItem(MANAGER_SESSION_KEY) === '1',
  );

  const onLogout = React.useCallback(() => {
    sessionStorage.removeItem(MANAGER_SESSION_KEY);
    setAuthed(false);
  }, []);

  if (!authed) {
    return <ManagerLogin onSuccess={() => setAuthed(true)} />;
  }
  return <ManagerComplaintsApp onLogout={onLogout} />;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<ManagerRoot />);
