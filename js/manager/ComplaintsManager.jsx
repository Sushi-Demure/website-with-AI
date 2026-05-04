// ============================================================
// SUSHI DEMURE — Manager dashboard: Complaints + Orders (read-only)
//
// Complaints GET (unchanged): COMPLAINTS_READ_ENDPOINT + query params:
//   source | category | status — omit each when "all"
// Expected: JSON array of { name, phone, complaint_text, category, source, status, created_at }
//
// Orders GET (separate): GET_ORDERS_URL + optional query params:
//   source | order_type | status — omit when "all"
// Expected rows: { name, phone, items, order_type, address, notes, source, status, created_at }
// Orders tab lists only rows with order signals (items / line_items / pickup|delivery / order_id).
// Complaint-only documents from the same URL are ignored — use the complaints webhook for those.
// Last-opened tab is stored in localStorage under MANAGER_VIEW_KEY.
//
// Optional: COMPLAINTS_GET_EXTRA_QUERY / ORDERS_GET_EXTRA_QUERY e.g. "limit=500"
// ============================================================

/** Production “Get Complaints” webhook (GET + query params). */
const COMPLAINTS_READ_ENDPOINT =
  'https://n8n-zcwg.srv1592624.hstgr.cloud/webhook/f2194549-8f73-48f3-b8a9-11f596ea18c8';

/** Appended to every request after filter params, e.g. `limit=500` — empty = none. */
const COMPLAINTS_GET_EXTRA_QUERY = '';

/** GET list of food orders — dedicated endpoint (not the complaints webhook). */
const GET_ORDERS_URL =
  'https://n8n-zcwg.srv1592624.hstgr.cloud/webhook/eb119305-a8a8-4576-9318-826393f90ee8';

/** Appended to orders GET after filter params — empty = none. */
const ORDERS_GET_EXTRA_QUERY = '';

/** Default rows per page (client-side pagination over the full fetched list). */
const DEFAULT_PAGE_SIZE = 10;

/** Session flag after successful manager login (tab-scoped). */
const MANAGER_SESSION_KEY = 'sushi_demure_manager_auth';
const MANAGER_LANG_KEY = 'sushi_demure_manager_lang';
/** Remember last dashboard tab: "complaints" | "orders". */
const MANAGER_VIEW_KEY = 'sushi_demure_manager_view';

const MANAGER_I18N = {
  en: {
    manager: 'Manager',
    loginIntro: 'Enter the access key to open the complaints dashboard.',
    accessKey: 'Access key',
    accessKeyNotSet: 'Access key is not set. Edit js/manager/auth.config.js on the server.',
    accessKeyWrong: 'That access key is incorrect. Please try again.',
    signIn: 'Sign in',
    backToSite: 'Back to website',
    signOut: 'Sign out',
    mainSite: 'Main site',
    operations: 'Operations',
    title: 'Manager Complaints',
    subtitle: 'Review submitted complaints and track customer issues.',
    source: 'Source',
    category: 'Category',
    status: 'Status',
    all: 'All',
    website: 'Website',
    slack: 'Slack',
    voice: 'Voice',
    general: 'General',
    food: 'Food',
    service: 'Service',
    reservation: 'Reservation',
    delivery: 'Delivery',
    billing: 'Billing',
    open: 'Open',
    inProgress: 'In Progress',
    resolved: 'Resolved',
    searchLabel: 'Search (name, phone, text)',
    searchPlaceholder: 'Filter loaded results...',
    perPage: 'Per page',
    loadedPrefix: 'Loaded',
    records: 'records from the server',
    record: 'record from the server',
    matchesSuffix: 'after search',
    loading: 'Loading complaints...',
    loadError: 'Sorry, complaints could not be loaded right now.',
    empty: 'No complaints found for the selected filters.',
    submitted: 'Submitted',
    showing: 'Showing',
    of: 'of',
    page: 'Page',
    previous: 'Previous',
    next: 'Next',
    tabComplaints: 'Complaints',
    tabOrders: 'Orders',
    ordersTitle: 'Orders',
    ordersSubtitle: 'Review pickup and delivery requests from the website and other channels.',
    orderSource: 'Source',
    orderTypeFilter: 'Order type',
    orderStatus: 'Order status',
    pickup: 'Pickup',
    deliveryOrder: 'Delivery',
    newOrder: 'New',
    preparing: 'Preparing',
    completed: 'Completed',
    cancelled: 'Cancelled',
    searchOrders: 'Search (name, phone, items, address)',
    searchOrdersPlaceholder: 'Filter loaded orders…',
    loadingOrders: 'Loading orders…',
    ordersLoadError: 'Sorry, orders could not be loaded right now.',
    ordersEmpty: 'No orders found for the selected filters.',
    ordersEmptyWrongShape:
      'The server returned records without order fields (items, pickup/delivery, or order id). Point this URL at an n8n workflow that returns food orders, or use a separate orders webhook.',
    itemsLabel: 'Items',
    addressLabel: 'Address',
    notesLabel: 'Notes',
    phone: 'Phone',
    orderPlaced: 'Placed',
    sourceUnknown: 'unknown',
  },
  ar: {
    manager: 'المدير',
    loginIntro: 'أدخل رمز الوصول لفتح لوحة الشكاوى.',
    accessKey: 'رمز الوصول',
    accessKeyNotSet: 'رمز الوصول غير مضبوط. عدّل js/manager/auth.config.js على الخادم.',
    accessKeyWrong: 'رمز الوصول غير صحيح. حاول مرة أخرى.',
    signIn: 'تسجيل الدخول',
    backToSite: 'العودة للموقع',
    signOut: 'تسجيل الخروج',
    mainSite: 'الرئيسية',
    operations: 'العمليات',
    title: 'الشكاوى',
    subtitle: 'راجع الشكاوى المرسلة وتابع مشاكل العملاء.',
    source: 'المصدر',
    category: 'الفئة',
    status: 'الحالة',
    all: 'الكل',
    website: 'الموقع',
    slack: 'سلاك',
    voice: 'المساعد الصوتي',
    general: 'عام',
    food: 'الطعام',
    service: 'الخدمة',
    reservation: 'الحجز',
    delivery: 'التوصيل',
    billing: 'الدفع والفاتورة',
    open: 'مفتوحة',
    inProgress: 'قيد المعالجة',
    resolved: 'محلولة',
    searchLabel: 'بحث (الاسم، الهاتف، النص)',
    searchPlaceholder: 'فلترة النتائج المحمّلة...',
    perPage: 'لكل صفحة',
    loadedPrefix: 'تم تحميل',
    records: 'سجلات من الخادم',
    record: 'سجل من الخادم',
    matchesSuffix: 'مطابقة بعد البحث',
    loading: 'جاري تحميل الشكاوى...',
    loadError: 'تعذّر تحميل الشكاوى حالياً.',
    empty: 'لا توجد شكاوى تطابق الفلاتر المحددة.',
    submitted: 'تاريخ الإرسال',
    showing: 'عرض',
    of: 'من',
    page: 'الصفحة',
    previous: 'السابق',
    next: 'التالي',
    tabComplaints: 'الشكاوى',
    tabOrders: 'الطلبات',
    ordersTitle: 'الطلبات',
    ordersSubtitle: 'مراجعة طلبات الاستلام والتوصيل من الموقع والقنوات الأخرى.',
    orderSource: 'المصدر',
    orderTypeFilter: 'نوع الطلب',
    orderStatus: 'حالة الطلب',
    pickup: 'استلام',
    deliveryOrder: 'توصيل',
    newOrder: 'جديد',
    preparing: 'قيد التحضير',
    completed: 'مكتمل',
    cancelled: 'ملغى',
    searchOrders: 'بحث (الاسم، الهاتف، الأصناف، العنوان)',
    searchOrdersPlaceholder: 'فلترة الطلبات المحمّلة…',
    loadingOrders: 'جاري تحميل الطلبات…',
    ordersLoadError: 'تعذّر تحميل الطلبات حالياً.',
    ordersEmpty: 'لا توجد طلبات تطابق الفلاتر المحددة.',
    ordersEmptyWrongShape:
      'الخادم أعاد سجلات ليست طلبات طعام (لا أصناف ولا استلام/توصيل). صِل عنوان الطلبات بمسار n8n يعيد طلبات الطعام فقط.',
    itemsLabel: 'الأصناف',
    addressLabel: 'العنوان',
    notesLabel: 'ملاحظات',
    phone: 'الجوال',
    orderPlaced: 'تاريخ الطلب',
    sourceUnknown: 'غير معروف',
  },
};

function getManagerAccessKey() {
  return String(typeof window !== 'undefined' && window.MANAGER_ACCESS_KEY != null ? window.MANAGER_ACCESS_KEY : '').trim();
}

function ManagerLogin({ onSuccess, lang, setLang }) {
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const configured = getManagerAccessKey().length > 0;
  const tt = MANAGER_I18N[lang] || MANAGER_I18N.en;

  const submit = (e) => {
    e.preventDefault();
    setError('');
    const key = getManagerAccessKey();
    if (!key) {
      setError(tt.accessKeyNotSet);
      return;
    }
    if (password === key) {
      sessionStorage.setItem(MANAGER_SESSION_KEY, '1');
      onSuccess();
      return;
    }
    setError(tt.accessKeyWrong);
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
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
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
            {tt.manager}
          </div>
        </div>

        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'rgba(248,244,239,0.55)', textAlign: 'center', lineHeight: 1.6, margin: '0 0 24px' }}>
          {tt.loginIntro}
        </p>

        <form onSubmit={submit} noValidate>
          <label htmlFor="mgr-access" style={{ display: 'block', fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'rgba(248,244,239,0.5)', marginBottom: 8, letterSpacing: '0.06em' }}>
            {tt.accessKey}
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
            {tt.signIn}
          </button>
        </form>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, marginTop: 22 }}>
          <button
            type="button"
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'var(--pink)',
              padding: '6px 14px',
              borderRadius: 20,
              fontFamily: 'DM Sans, sans-serif',
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            {lang === 'en' ? 'العربية' : 'English'}
          </button>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'rgba(248,244,239,0.35)', textAlign: 'center', lineHeight: 1.5, margin: 0 }}>
          <a href="index.html" style={{ color: 'rgba(248,244,239,0.55)', textDecoration: 'none', borderBottom: '1px solid rgba(242,184,198,0.35)' }}>
            {lang === 'ar' ? '→' : '←'} {tt.backToSite}
          </a>
          </p>
        </div>
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

function buildOrdersUrl(source, orderType, orderStatus) {
  const p = new URLSearchParams();
  if (source !== 'all') p.set('source', source);
  if (orderType !== 'all') p.set('order_type', orderType);
  if (orderStatus !== 'all') p.set('status', orderStatus);
  const extra = String(ORDERS_GET_EXTRA_QUERY || '').trim();
  if (extra) {
    const frag = extra.startsWith('?') ? extra.slice(1) : extra;
    new URLSearchParams(frag).forEach((v, k) => p.set(k, v));
  }
  const qs = p.toString();
  return qs ? `${GET_ORDERS_URL}?${qs}` : GET_ORDERS_URL;
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

function formatLineItemObject(it) {
  if (!it || typeof it !== 'object') return '';
  const q = it.qty ?? it.quantity ?? it.count ?? it.q ?? 1;
  const n = String(it.name ?? it.title ?? it.product_name ?? it.productName ?? it.label ?? it.sku ?? '').trim();
  if (!n) return '';
  const qn = Math.max(1, parseInt(String(q), 10) || 1);
  return `${qn} ${n}`;
}

/** Build a single "2 Sushi Demure, 1 Latte" string from various API shapes (string, array, line_items, …). */
function getOrderItemsDisplay(row) {
  if (!row || typeof row !== 'object') return '';
  if (typeof row.items === 'string') return String(row.items).trim();
  if (Array.isArray(row.items) && row.items.length) {
    const parts = row.items.map((it) => (typeof it === 'string' ? String(it).trim() : formatLineItemObject(it))).filter(Boolean);
    if (parts.length) return parts.join(', ');
  }
  const altKeys = ['line_items', 'order_items', 'products', 'cart', 'entries'];
  for (const k of altKeys) {
    const v = row[k];
    if (!Array.isArray(v) || !v.length) continue;
    const parts = v.map((it) => (typeof it === 'string' ? String(it).trim() : formatLineItemObject(it))).filter(Boolean);
    if (parts.length) return parts.join(', ');
  }
  return '';
}

/** Normalize pickup/delivery from common field names. */
function orderTypeFromRow(row) {
  if (!row || typeof row !== 'object') return '';
  const keys = ['order_type', 'type', 'fulfillment_type', 'delivery_mode', 'fulfillment'];
  for (const k of keys) {
    const raw = String(row[k] || '').trim().toLowerCase().replace(/[\s-]+/g, '_');
    if (raw === 'pickup' || raw === 'delivery') return raw;
    if (raw === 'dine_in' || raw === 'dinein') return 'pickup';
  }
  return '';
}

/** True if the row looks like a food order (not a bare complaint record). */
function hasOrderSignals(row) {
  if (!row || typeof row !== 'object' || Array.isArray(row)) return false;
  if (String(getOrderItemsDisplay(row) || '').trim() !== '') return true;
  const ot = orderTypeFromRow(row);
  if (ot === 'pickup' || ot === 'delivery') return true;
  const rid = row.order_id ?? row.orderId;
  if (rid != null && String(rid).trim() !== '') return true;
  return false;
}

function mergeOrderArraysFromObject(obj) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return [];
  const seen = new Set();
  const out = [];
  const pushUnique = (arr) => {
    arr.forEach((item) => {
      if (!item || typeof item !== 'object') return;
      const id = item._id ?? item.id;
      const sig = id != null ? `id:${String(id)}` : `h:${String(item.created_at)}|${String(item.phone)}|${String(item.items || '').slice(0, 80)}`;
      if (seen.has(sig)) return;
      seen.add(sig);
      out.push(item);
    });
  };
  for (const v of Object.values(obj)) {
    if (!Array.isArray(v) || v.length === 0) continue;
    const first = v[0];
    if (first && typeof first === 'object' && !Array.isArray(first)) {
      pushUnique(v.filter((r) => r && typeof r === 'object' && !Array.isArray(r)));
    }
  }
  return out;
}

/**
 * Normalize API payload to a flat array of document-like rows (orders webhook may mirror complaints shape).
 */
function normalizeOrdersList(raw) {
  if (Array.isArray(raw)) {
    return raw.filter((r) => r && typeof r === 'object');
  }
  if (!raw || typeof raw !== 'object') return [];

  const fromNumeric = arrayFromNumericKeyedObject(raw);
  if (fromNumeric && fromNumeric.length) return fromNumeric;

  const tryKeys = ['orders', 'order', 'json', 'data', 'results', 'records', 'rows', 'list', 'payload', 'body', 'response', 'items', 'documents', 'values'];
  for (const key of tryKeys) {
    if (!(key in raw)) continue;
    const v = raw[key];
    if (Array.isArray(v)) {
      const arr = v.filter((r) => r && typeof r === 'object');
      if (arr.length) return arr;
    } else if (v && typeof v === 'object') {
      const inner = normalizeOrdersList(v);
      if (inner.length) return inner;
    }
  }

  for (const v of Object.values(raw)) {
    if (!Array.isArray(v) || v.length === 0) continue;
    const first = v[0];
    if (first && typeof first === 'object' && !Array.isArray(first)) {
      return v.filter((r) => r && typeof r === 'object' && !Array.isArray(r));
    }
  }

  if (
    raw
    && typeof raw === 'object'
    && !Array.isArray(raw)
    && (raw._id != null
      || raw.id != null
      || raw.name != null
      || raw.phone != null
      || raw.items != null
      || raw.order_type != null
      || raw.complaint_text != null)
  ) {
    return [raw];
  }

  return mergeOrderArraysFromObject(raw);
}

/** Dedupe by Mongo id / id / loose signature. */
function dedupeRowsById(list) {
  const seen = new Set();
  return (list || []).filter((row) => {
    if (!row || typeof row !== 'object' || Array.isArray(row)) return false;
    const id = row._id ?? row.id;
    const sig = id != null
      ? `id:${String(id)}`
      : `noid:${String(row.created_at || '')}:${String(row.phone || '')}:${String(row.complaint_text || row.items || '').slice(0, 80)}`;
    if (seen.has(sig)) return false;
    seen.add(sig);
    return true;
  });
}

/**
 * Parse orders webhook JSON: flatten, keep only food-order-shaped rows, dedupe.
 * Returns whether the payload had documents that were all rejected (e.g. complaint-only list).
 */
function normalizeAndFilterFoodOrders(json) {
  const coarse = normalizeOrdersList(json);
  const foodRows = dedupeRowsById(
    coarse.filter((r) => r && typeof r === 'object' && !Array.isArray(r) && hasOrderSignals(r)),
  );
  return {
    foodRows,
    hadDocumentsButNoOrders: coarse.length > 0 && foodRows.length === 0,
  };
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

/** Map menu English name → image URL from `window.MENU_DATA` (same assets as main site). */
function buildMenuImageMap() {
  const data = typeof window !== 'undefined' && Array.isArray(window.MENU_DATA) ? window.MENU_DATA : [];
  const map = Object.create(null);
  for (const item of data) {
    const en = item && item.nameEn;
    const img = item && item.img ? String(item.img) : '';
    if (!en) continue;
    map[en] = img;
    const paren = en.indexOf('(');
    if (paren > 0) {
      const short = en.slice(0, paren).trim();
      if (short && map[short] == null) map[short] = img;
    }
  }
  if (map['Gyoza (6 pcs)'] && !map.Gyoza) map.Gyoza = map['Gyoza (6 pcs)'];
  return map;
}

/** Parse "2 Sushi Demure, 1 Matcha Latte" → [{ qty, name }, …] */
function parseOrderLineItems(itemsStr) {
  const s = String(itemsStr || '').trim();
  if (!s) return [];
  return s.split(',').map((p) => p.trim()).filter(Boolean).map((part) => {
    const m = part.match(/^(\d+)\s+(.+)$/);
    if (m) return { qty: parseInt(m[1], 10) || 1, name: m[2].trim() };
    return { qty: 1, name: part };
  });
}

function resolveItemImageUrl(rawName, map) {
  const name = String(rawName || '').trim();
  if (!name || !map) return '';
  if (map[name]) return map[name];
  const lower = name.toLowerCase();
  const keys = Object.keys(map);
  const exact = keys.find((k) => k.toLowerCase() === lower);
  if (exact) return map[exact];
  let best = '';
  let bestKeyLen = 0;
  for (const k of keys) {
    const kl = k.toLowerCase();
    if (kl.includes(lower) && k.length >= bestKeyLen) {
      best = map[k];
      bestKeyLen = k.length;
    }
    if (lower.includes(kl) && k.length >= bestKeyLen) {
      best = map[k];
      bestKeyLen = k.length;
    }
  }
  return best || '';
}

function orderStatusBadgeStyle(status) {
  const s = String(status || 'new').toLowerCase().replace(/\s+/g, '_');
  if (s === 'new') {
    return { bg: 'rgba(242,184,198,0.18)', border: 'rgba(242,184,198,0.4)', color: 'var(--pink)' };
  }
  if (s === 'preparing') {
    return { bg: 'rgba(245,200,120,0.15)', border: 'rgba(245,200,120,0.35)', color: '#f5d4a0' };
  }
  if (s === 'completed') {
    return { bg: 'rgba(125,206,160,0.18)', border: 'rgba(125,206,160,0.35)', color: '#b8e6c8' };
  }
  if (s === 'cancelled') {
    return { bg: 'rgba(180,180,190,0.12)', border: 'rgba(180,180,190,0.3)', color: 'rgba(248,244,239,0.55)' };
  }
  return { bg: 'rgba(255,255,255,0.06)', border: 'rgba(255,255,255,0.12)', color: 'rgba(248,244,239,0.75)' };
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

function OrderThumbCell({ name, qty, srcUrl }) {
  const [broke, setBroke] = React.useState(!srcUrl);
  React.useEffect(() => {
    setBroke(!srcUrl);
  }, [srcUrl]);
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        background: 'rgba(255,255,255,0.04)',
        borderRadius: 12,
        padding: '6px 10px',
        border: '1px solid rgba(255,255,255,0.08)',
        maxWidth: '100%',
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 10,
          overflow: 'hidden',
          background: 'rgba(30,61,42,0.55)',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {!broke && srcUrl ? (
          <img
            src={srcUrl}
            alt=""
            referrerPolicy="no-referrer"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={() => setBroke(true)}
          />
        ) : (
          <span style={{ fontSize: 22, lineHeight: 1, opacity: 0.85 }} aria-hidden>🍣</span>
        )}
      </div>
      <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'rgba(248,244,239,0.88)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        <strong style={{ color: 'var(--pink)', fontWeight: 600 }}>{qty}×</strong> {name}
      </span>
    </div>
  );
}

function OrderLineThumbnails({ itemsStr, imageMap }) {
  const lines = React.useMemo(() => parseOrderLineItems(itemsStr), [itemsStr]);
  if (!lines.length) return null;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', marginBottom: 14 }}>
      {lines.map((line, i) => (
        <OrderThumbCell
          key={`${i}-${line.name}`}
          name={line.name}
          qty={line.qty}
          srcUrl={resolveItemImageUrl(line.name, imageMap)}
        />
      ))}
    </div>
  );
}

function formatOrderStatusLabel(st, tt) {
  const s = String(st || 'new').toLowerCase().replace(/\s+/g, '_');
  if (s === 'new') return tt.newOrder;
  if (s === 'preparing') return tt.preparing;
  if (s === 'completed') return tt.completed;
  if (s === 'cancelled') return tt.cancelled;
  return String(st || '—');
}

function ManagerOrdersPanel({ lang, tt }) {
  const [orderSource, setOrderSource] = React.useState('all');
  const [orderTypeFilter, setOrderTypeFilter] = React.useState('all');
  const [orderStatusFilter, setOrderStatusFilter] = React.useState('all');
  const [search, setSearch] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(DEFAULT_PAGE_SIZE);
  const [rawRows, setRawRows] = React.useState([]);
  const [loadState, setLoadState] = React.useState('loading');
  const [ordersPayloadNonOrderShape, setOrdersPayloadNonOrderShape] = React.useState(false);

  const imageMap = React.useMemo(() => buildMenuImageMap(), []);

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
      setOrdersPayloadNonOrderShape(false);
      const url = buildOrdersUrl(orderSource, orderTypeFilter, orderStatusFilter);
      try {
        const res = await fetch(url, {
          method: 'GET',
          headers: { Accept: 'application/json' },
          cache: 'no-store',
        });
        const text = await res.text();
        if (!res.ok) {
          if (!cancelled) {
            setOrdersPayloadNonOrderShape(false);
            setRawRows([]);
            setLoadState('error');
          }
          return;
        }
        const json = parseComplaintsResponseText(text);
        if (json === null) {
          if (!cancelled) {
            setOrdersPayloadNonOrderShape(false);
            setRawRows([]);
            setLoadState('error');
          }
          return;
        }
        const { foodRows, hadDocumentsButNoOrders } = normalizeAndFilterFoodOrders(json);
        const srcQ = orderSource === 'all' ? null : String(orderSource).toLowerCase();
        const otQ = orderTypeFilter === 'all' ? null : String(orderTypeFilter).toLowerCase();
        const stQ = orderStatusFilter === 'all' ? null : String(orderStatusFilter).toLowerCase().replace(/\s+/g, '_');
        const filtered = foodRows.filter((row) => {
          const rSrc = String(row.source || 'unknown').toLowerCase();
          const rOt = orderTypeFromRow(row) || String(row.order_type || '').toLowerCase();
          const rSt = String(row.status || 'new').toLowerCase().replace(/\s+/g, '_');
          if (srcQ && rSrc !== srcQ) return false;
          if (otQ && rOt !== otQ) return false;
          if (stQ && rSt !== stQ) return false;
          return true;
        });
        const list = sortByCreatedDesc(filtered);
        if (!cancelled) {
          setOrdersPayloadNonOrderShape(hadDocumentsButNoOrders);
          setRawRows(list);
          setLoadState('ready');
        }
      } catch {
        if (!cancelled) {
          setOrdersPayloadNonOrderShape(false);
          setRawRows([]);
          setLoadState('error');
        }
      }
    };
    run();
    return () => { cancelled = true; };
  }, [orderSource, orderTypeFilter, orderStatusFilter]);

  React.useEffect(() => {
    setPage(1);
  }, [orderSource, orderTypeFilter, orderStatusFilter, search]);

  const filteredRows = React.useMemo(() => {
    const q = String(search).trim().toLowerCase();
    if (!q) return rawRows;
    return rawRows.filter((row) => {
      const blob = [
        row.name,
        row.phone,
        row.items,
        getOrderItemsDisplay(row),
        row.address,
        row.notes,
        row.source,
        row.order_type,
        orderTypeFromRow(row),
        row.status,
      ]
        .map((x) => String(x || '').toLowerCase())
        .join(' ');
      return blob.includes(q);
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
    <>
      <div style={{ marginBottom: 32 }}>
        <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--pink)', display: 'block', marginBottom: 12 }}>
          {tt.operations}
        </span>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.85rem,4vw,2.75rem)', color: 'var(--cream)', margin: '0 0 12px', lineHeight: 1.15 }}>
          {tt.ordersTitle}
        </h1>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 16, color: 'rgba(248,244,239,0.58)', maxWidth: 560, lineHeight: 1.65, margin: 0 }}>
          {tt.ordersSubtitle}
        </p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginBottom: 16, alignItems: 'flex-end' }}>
        <div style={{ flex: '1 1 160px', minWidth: 0 }}>
          <label style={{ display: 'block', fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'rgba(248,244,239,0.5)', marginBottom: 6, letterSpacing: '0.04em' }}>{tt.orderSource}</label>
          <select value={orderSource} onChange={(e) => setOrderSource(e.target.value)} style={sel}>
            <option value="all" style={{ background: '#162b1e' }}>{tt.all}</option>
            <option value="website" style={{ background: '#162b1e' }}>{tt.website}</option>
            <option value="slack" style={{ background: '#162b1e' }}>{tt.slack}</option>
            <option value="voice" style={{ background: '#162b1e' }}>{tt.voice}</option>
          </select>
        </div>
        <div style={{ flex: '1 1 160px', minWidth: 0 }}>
          <label style={{ display: 'block', fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'rgba(248,244,239,0.5)', marginBottom: 6, letterSpacing: '0.04em' }}>{tt.orderTypeFilter}</label>
          <select value={orderTypeFilter} onChange={(e) => setOrderTypeFilter(e.target.value)} style={sel}>
            <option value="all" style={{ background: '#162b1e' }}>{tt.all}</option>
            <option value="pickup" style={{ background: '#162b1e' }}>{tt.pickup}</option>
            <option value="delivery" style={{ background: '#162b1e' }}>{tt.deliveryOrder}</option>
          </select>
        </div>
        <div style={{ flex: '1 1 160px', minWidth: 0 }}>
          <label style={{ display: 'block', fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'rgba(248,244,239,0.5)', marginBottom: 6, letterSpacing: '0.04em' }}>{tt.orderStatus}</label>
          <select value={orderStatusFilter} onChange={(e) => setOrderStatusFilter(e.target.value)} style={sel}>
            <option value="all" style={{ background: '#162b1e' }}>{tt.all}</option>
            <option value="new" style={{ background: '#162b1e' }}>{tt.newOrder}</option>
            <option value="preparing" style={{ background: '#162b1e' }}>{tt.preparing}</option>
            <option value="completed" style={{ background: '#162b1e' }}>{tt.completed}</option>
            <option value="cancelled" style={{ background: '#162b1e' }}>{tt.cancelled}</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: 20, marginBottom: 28 }}>
        <div style={{ flex: '1 1 220px', minWidth: 0 }}>
          <label style={{ display: 'block', fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'rgba(248,244,239,0.5)', marginBottom: 6, letterSpacing: '0.04em' }}>{tt.searchOrders}</label>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={tt.searchOrdersPlaceholder}
            style={{ ...inp, maxWidth: 'min(100%, 480px)' }}
            onFocus={(e) => { e.target.style.borderColor = 'var(--pink)'; }}
            onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
          />
        </div>
        <div style={{ flex: '0 1 140px' }}>
          <label style={{ display: 'block', fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'rgba(248,244,239,0.5)', marginBottom: 6, letterSpacing: '0.04em' }}>{tt.perPage}</label>
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
          {tt.loadedPrefix} <strong style={{ color: 'rgba(248,244,239,0.75)', fontWeight: 600 }}>{rawRows.length}</strong> {rawRows.length === 1 ? tt.record : tt.records}
          {search.trim() ? ` · ${totalCount} ${tt.matchesSuffix}` : ''}.
        </p>
      )}

      {loadState === 'loading' && (
        <div style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
          <div style={{ width: 44, height: 44, border: '3px solid rgba(240,184,198,0.2)', borderTopColor: 'var(--pink)', borderRadius: '50%', animation: 'spin 0.9s linear infinite', margin: '0 auto 20px' }} />
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: 'rgba(248,244,239,0.55)' }}>{tt.loadingOrders}</p>
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
            {tt.ordersLoadError}
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
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: 'rgba(248,244,239,0.5)', margin: 0, lineHeight: 1.55 }}>
            {ordersPayloadNonOrderShape && !String(search).trim() ? tt.ordersEmptyWrongShape : tt.ordersEmpty}
          </p>
        </div>
      )}

      {loadState === 'ready' && filteredRows.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {paginatedRows.map((row, idx) => {
            const st = String(row.status || 'new').toLowerCase().replace(/\s+/g, '_');
            const stLabel = formatOrderStatusLabel(st, tt);
            const otEff = orderTypeFromRow(row) || String(row.order_type || '').toLowerCase();
            const src = String(row.source || tt.sourceUnknown);
            const globalIdx = (page - 1) * pageSize + idx;
            const isDelivery = otEff === 'delivery';
            const notesT = String(row.notes || '').trim();
            const itemsDisplay = getOrderItemsDisplay(row) || '—';
            const typeLabel = otEff === 'delivery' ? tt.deliveryOrder : otEff === 'pickup' ? tt.pickup : '—';
            return (
              <article
                key={row._id || row.id || `ord-${globalIdx}-${String(row.created_at || '')}-${String(row.phone || '')}`}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 24,
                  padding: '1.35rem clamp(1rem,3vw,1.5rem)',
                }}
              >
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14, marginBottom: 12 }}>
                  <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.15rem,2.5vw,1.35rem)', color: 'var(--cream)', margin: 0, fontWeight: 600 }}>
                    {row.name || '—'}
                  </h2>
                  <Badge style={orderStatusBadgeStyle(st)}>{stLabel}</Badge>
                </div>

                <OrderLineThumbnails itemsStr={getOrderItemsDisplay(row)} imageMap={imageMap} />

                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'rgba(248,244,239,0.82)', lineHeight: 1.65, margin: '0 0 10px', wordBreak: 'break-word' }}>
                  <strong style={{ color: 'var(--pink)' }}>{tt.itemsLabel}:</strong> {itemsDisplay}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 12 }}>
                  <div>
                    <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, color: 'rgba(248,244,239,0.45)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{tt.phone}</span>
                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'rgba(248,244,239,0.85)', margin: '4px 0 0' }}>{row.phone || '—'}</p>
                  </div>
                  <div>
                    <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, color: 'rgba(248,244,239,0.45)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{tt.orderTypeFilter}</span>
                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'rgba(248,244,239,0.85)', margin: '4px 0 0' }}>
                      {typeLabel}
                    </p>
                  </div>
                  <div>
                    <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, color: 'rgba(248,244,239,0.45)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{tt.orderSource}</span>
                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'rgba(248,244,239,0.85)', margin: '4px 0 0' }}>{src}</p>
                  </div>
                </div>

                {isDelivery && String(row.address || '').trim() ? (
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'rgba(248,244,239,0.78)', lineHeight: 1.6, margin: '0 0 10px', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    <strong style={{ color: 'var(--pink)' }}>{tt.addressLabel}:</strong> {String(row.address).trim()}
                  </p>
                ) : null}

                {notesT ? (
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'rgba(248,244,239,0.72)', lineHeight: 1.6, margin: '0 0 12px', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    <strong style={{ color: 'var(--pink)' }}>{tt.notesLabel}:</strong> {notesT}
                  </p>
                ) : null}

                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 10, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'rgba(248,244,239,0.4)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    {tt.orderPlaced}
                  </span>
                  <time dateTime={row.created_at || ''} style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'rgba(248,244,239,0.65)' }}>
                    {formatDateTime(row.created_at)}
                  </time>
                </div>
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
              {tt.showing} <strong style={{ color: 'var(--cream)', fontWeight: 600 }}>{rangeStart}</strong>
              {' – '}
              <strong style={{ color: 'var(--cream)', fontWeight: 600 }}>{rangeEnd}</strong>
              {' '}{tt.of}{' '}
              <strong style={{ color: 'var(--cream)', fontWeight: 600 }}>{totalCount}</strong>
              {totalPages > 1 ? ` · ${tt.page} ${page} ${tt.of} ${totalPages}` : ''}
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
                {tt.previous}
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
                {tt.next}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ManagerComplaintsApp({ onLogout, lang, setLang }) {
  const [managerView, setManagerViewState] = React.useState(() => {
    try {
      const v = localStorage.getItem(MANAGER_VIEW_KEY);
      if (v === 'orders' || v === 'complaints') return v;
    } catch {
      /* ignore */
    }
    return 'complaints';
  });

  const setManagerView = React.useCallback((v) => {
    if (v !== 'orders' && v !== 'complaints') return;
    setManagerViewState(v);
    try {
      localStorage.setItem(MANAGER_VIEW_KEY, v);
    } catch {
      /* ignore */
    }
  }, []);

  const [source, setSource] = React.useState('all');
  const [category, setCategory] = React.useState('all');
  const [status, setStatus] = React.useState('all');
  const [search, setSearch] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(DEFAULT_PAGE_SIZE);

  const [rawRows, setRawRows] = React.useState([]);
  const [loadState, setLoadState] = React.useState(() => {
    try {
      if (localStorage.getItem(MANAGER_VIEW_KEY) === 'orders') return 'idle';
    } catch {
      /* ignore */
    }
    return 'loading';
  });
  const tt = MANAGER_I18N[lang] || MANAGER_I18N.en;

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

  // Complaints GET only while this tab is active — no network when Orders tab is shown.
  React.useEffect(() => {
    if (managerView !== 'complaints') return undefined;
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
  }, [source, category, status, managerView]);

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
    <div style={{ minHeight: '100vh', background: 'var(--dark)' }} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <header style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(14,28,20,0.92)', backdropFilter: 'blur(12px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '16px clamp(1rem,4vw,2rem)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 700, color: 'var(--cream)' }}>Sushi Demure</div>
            <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, color: 'var(--pink)', letterSpacing: '0.18em', textTransform: 'uppercase', marginTop: 2 }}>{tt.manager}</div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10 }}>
            <button
              type="button"
              onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
              style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: 13,
                color: 'var(--pink)',
                background: 'transparent',
                padding: '8px 16px',
                borderRadius: 24,
                border: '1px solid rgba(255,255,255,0.15)',
                cursor: 'pointer',
              }}
            >
              {lang === 'en' ? 'العربية' : 'English'}
            </button>
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
                {tt.signOut}
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
              {lang === 'ar' ? '→' : '←'} {tt.mainSite}
            </a>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(2rem,5vw,3.5rem) clamp(1rem,4vw,2rem)' }}>
        <nav
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 12,
            marginBottom: 28,
            padding: '14px 18px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 20,
          }}
          aria-label="Dashboard"
        >
          <button
            type="button"
            onClick={() => setManagerView('complaints')}
            style={{
              padding: '12px 22px',
              borderRadius: 22,
              border: managerView === 'complaints' ? 'none' : '1px solid rgba(255,255,255,0.12)',
              background: managerView === 'complaints' ? 'var(--pink)' : 'transparent',
              color: managerView === 'complaints' ? 'var(--dark)' : 'rgba(248,244,239,0.75)',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: 15,
              fontWeight: managerView === 'complaints' ? 600 : 500,
              cursor: 'pointer',
              letterSpacing: '0.04em',
            }}
          >
            {tt.tabComplaints}
          </button>
          <button
            type="button"
            onClick={() => setManagerView('orders')}
            style={{
              padding: '12px 22px',
              borderRadius: 22,
              border: managerView === 'orders' ? 'none' : '1px solid rgba(255,255,255,0.12)',
              background: managerView === 'orders' ? 'var(--pink)' : 'transparent',
              color: managerView === 'orders' ? 'var(--dark)' : 'rgba(248,244,239,0.75)',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: 15,
              fontWeight: managerView === 'orders' ? 600 : 500,
              cursor: 'pointer',
              letterSpacing: '0.04em',
            }}
          >
            {tt.tabOrders}
          </button>
        </nav>

        {managerView === 'orders' && <ManagerOrdersPanel lang={lang} tt={tt} />}

        {managerView === 'complaints' && (
        <>
        <div style={{ marginBottom: 32 }}>
          <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--pink)', display: 'block', marginBottom: 12 }}>
            {tt.operations}
          </span>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.85rem,4vw,2.75rem)', color: 'var(--cream)', margin: '0 0 12px', lineHeight: 1.15 }}>
            {tt.title}
          </h1>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 16, color: 'rgba(248,244,239,0.58)', maxWidth: 560, lineHeight: 1.65, margin: 0 }}>
            {tt.subtitle}
          </p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginBottom: 16, alignItems: 'flex-end' }}>
          <div style={{ flex: '1 1 160px', minWidth: 0 }}>
            <label style={{ display: 'block', fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'rgba(248,244,239,0.5)', marginBottom: 6, letterSpacing: '0.04em' }}>{tt.source}</label>
            <select value={source} onChange={(e) => setSource(e.target.value)} style={sel}>
              <option value="website" style={{ background: '#162b1e' }}>{tt.website}</option>
              <option value="slack" style={{ background: '#162b1e' }}>{tt.slack}</option>
              <option value="voice" style={{ background: '#162b1e' }}>{tt.voice}</option>
              <option value="all" style={{ background: '#162b1e' }}>{tt.all}</option>
            </select>
          </div>
          <div style={{ flex: '1 1 160px', minWidth: 0 }}>
            <label style={{ display: 'block', fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'rgba(248,244,239,0.5)', marginBottom: 6, letterSpacing: '0.04em' }}>{tt.category}</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} style={sel}>
              <option value="all" style={{ background: '#162b1e' }}>{tt.all}</option>
              <option value="general" style={{ background: '#162b1e' }}>{tt.general}</option>
              <option value="food" style={{ background: '#162b1e' }}>{tt.food}</option>
              <option value="service" style={{ background: '#162b1e' }}>{tt.service}</option>
              <option value="reservation" style={{ background: '#162b1e' }}>{tt.reservation}</option>
              <option value="delivery" style={{ background: '#162b1e' }}>{tt.delivery}</option>
              <option value="billing" style={{ background: '#162b1e' }}>{tt.billing}</option>
            </select>
          </div>
          <div style={{ flex: '1 1 160px', minWidth: 0 }}>
            <label style={{ display: 'block', fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'rgba(248,244,239,0.5)', marginBottom: 6, letterSpacing: '0.04em' }}>{tt.status}</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} style={sel}>
              <option value="all" style={{ background: '#162b1e' }}>{tt.all}</option>
              <option value="open" style={{ background: '#162b1e' }}>{tt.open}</option>
              <option value="in_progress" style={{ background: '#162b1e' }}>{tt.inProgress}</option>
              <option value="resolved" style={{ background: '#162b1e' }}>{tt.resolved}</option>
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: 20, marginBottom: 28 }}>
          <div style={{ flex: '1 1 220px', minWidth: 0 }}>
            <label style={{ display: 'block', fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'rgba(248,244,239,0.5)', marginBottom: 6, letterSpacing: '0.04em' }}>{tt.searchLabel}</label>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={tt.searchPlaceholder}
              style={{ ...inp, maxWidth: 'min(100%, 480px)' }}
              onFocus={(e) => { e.target.style.borderColor = 'var(--pink)'; }}
              onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
            />
          </div>
          <div style={{ flex: '0 1 140px' }}>
            <label style={{ display: 'block', fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'rgba(248,244,239,0.5)', marginBottom: 6, letterSpacing: '0.04em' }}>{tt.perPage}</label>
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
            {tt.loadedPrefix} <strong style={{ color: 'rgba(248,244,239,0.75)', fontWeight: 600 }}>{rawRows.length}</strong> {rawRows.length === 1 ? tt.record : tt.records}
            {search.trim() ? ` · ${totalCount} ${tt.matchesSuffix}` : ''}.
          </p>
        )}

        {loadState === 'loading' && (
          <div style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
            <div style={{ width: 44, height: 44, border: '3px solid rgba(240,184,198,0.2)', borderTopColor: 'var(--pink)', borderRadius: '50%', animation: 'spin 0.9s linear infinite', margin: '0 auto 20px' }} />
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: 'rgba(248,244,239,0.55)' }}>{tt.loading}</p>
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
              {tt.loadError}
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
              {tt.empty}
            </p>
          </div>
        )}

        {loadState === 'ready' && filteredRows.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {paginatedRows.map((row, idx) => {
              const st = String(row.status || 'open').toLowerCase().replace(/\s+/g, '_');
              const stLabel = st === 'in_progress' ? tt.inProgress : st;
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
                      {tt.submitted}
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
                {tt.showing} <strong style={{ color: 'var(--cream)', fontWeight: 600 }}>{rangeStart}</strong>
                {' – '}
                <strong style={{ color: 'var(--cream)', fontWeight: 600 }}>{rangeEnd}</strong>
                {' '}{tt.of}{' '}
                <strong style={{ color: 'var(--cream)', fontWeight: 600 }}>{totalCount}</strong>
                {totalPages > 1 ? ` · ${tt.page} ${page} ${tt.of} ${totalPages}` : ''}
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
                  {tt.previous}
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
                  {tt.next}
                </button>
              </div>
            </div>
          </div>
        )}
        </>
        )}
      </main>
    </div>
  );
}

function ManagerRoot() {
  const [authed, setAuthed] = React.useState(
    () => sessionStorage.getItem(MANAGER_SESSION_KEY) === '1',
  );
  const [lang, setLang] = React.useState(() => {
    try {
      return localStorage.getItem(MANAGER_LANG_KEY) || 'en';
    } catch {
      return 'en';
    }
  });

  React.useEffect(() => {
    try {
      localStorage.setItem(MANAGER_LANG_KEY, lang);
    } catch {
      // Ignore storage errors.
    }
  }, [lang]);

  const onLogout = React.useCallback(() => {
    sessionStorage.removeItem(MANAGER_SESSION_KEY);
    setAuthed(false);
  }, []);

  if (!authed) {
    return <ManagerLogin onSuccess={() => setAuthed(true)} lang={lang} setLang={setLang} />;
  }
  return <ManagerComplaintsApp onLogout={onLogout} lang={lang} setLang={setLang} />;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<ManagerRoot />);
