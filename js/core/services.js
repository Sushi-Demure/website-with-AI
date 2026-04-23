// ============================================================
// SUSHI DEMURE — API Services
// Production webhooks + payload contract: see /INTEGRATION.md
// ============================================================

// ── Reservation Service ──────────────────────────────────────

/**
 * Submit a reservation to n8n (production webhook).
 * POST body must match n8n / booking tool:
 *   name, date, time, guests (number), phone, special_request, preferred_table
 * Optional fields: empty string if not provided.
 */
function buildReservationSpecialRequest(payload) {
  const main = String(payload.request || '').trim();
  const bits = [];
  if (String(payload.seating || '').trim()) bits.push(`Seating area: ${String(payload.seating).trim()}`);
  if (String(payload.occasion || '').trim()) bits.push(`Occasion: ${String(payload.occasion).trim()}`);
  if (String(payload.language || '').trim()) bits.push(`Preferred language: ${String(payload.language).trim()}`);
  const extraLine = bits.join(' · ');
  if (main && extraLine) return `${main}\n${extraLine}`;
  if (main) return main;
  if (extraLine) return extraLine;
  return '';
}

async function submitReservation(payload) {
  const N8N_RESERVATION_WEBHOOK_URL = 'https://n8n-zcwg.srv1592624.hstgr.cloud/webhook/91c29aa5-e239-431f-b5e0-41270ec950c8';

  const guestsNum = parseInt(String(payload.guests).trim(), 10);
  const rawTable = String(payload.preferred_table || '').trim();
  const wantsAutoTable = !rawTable || /^(auto[\s-]?assign|none|no|skip|n\/a)$/i.test(rawTable);
  const body = {
    name: String(payload.name || '').trim(),
    date: String(payload.date || '').trim(),
    time: String(payload.time || '').trim(),
    guests: Number.isFinite(guestsNum) && guestsNum > 0 ? guestsNum : 1,
    phone: String(payload.phone || '').trim(),
    special_request: buildReservationSpecialRequest(payload),
    preferred_table: wantsAutoTable ? '' : rawTable,
  };

  try {
    const res = await fetch(N8N_RESERVATION_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    let data = null;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        /* n8n or proxy may return HTML/plain text on errors */
      }
    }
    if (!res.ok) {
      console.error('Reservation HTTP', res.status, text?.slice(0, 500));
      return {
        status: 'error',
        httpStatus: res.status,
        detail: (text && text.trim()) ? text.trim().slice(0, 400) : `HTTP ${res.status}`,
      };
    }
    if (text && data === null) {
      return {
        status: 'error',
        detail: text.trim().slice(0, 400),
      };
    }
    const dataObj = data || {};
    // Normalise n8n response → { status, confirmationNumber, alternatives }
    if (dataObj.success === false || dataObj.status === 'unavailable') {
      return {
        status: 'unavailable',
        alternatives: dataObj.alternatives || [
          { date: payload.date, time: '18:30', available: true },
          { date: payload.date, time: '19:00', available: true },
          { date: payload.date, time: '21:00', available: true },
        ],
      };
    }
    return {
      status: 'success',
      confirmationNumber: dataObj.confirmationNumber || dataObj.booking_id || dataObj.confirmation_id
        || ('SD-' + Math.floor(10000 + Math.random() * 90000)),
      message: dataObj.message,
      table_available: dataObj.table_available,
      assigned_table: dataObj.assigned_table,
      requested_table: dataObj.requested_table,
      preferred_table: dataObj.preferred_table,
      seating_area: dataObj.seating_area,
      occasion: dataObj.occasion,
      preferred_language: dataObj.preferred_language,
      special_request: dataObj.special_request,
      name: dataObj.name,
      date: dataObj.date,
      time: dataObj.time,
      guests: dataObj.guests,
      phone: dataObj.phone,
    };
  } catch (err) {
    console.error('Reservation error:', err);
    const msg = err && err.message ? String(err.message) : 'Network error';
    const isAr = String(payload.lang || '') === 'ar';
    const networkHint = isAr
      ? 'تعذّر الوصول إلى خادم الحجز (شبكة، DNS، جدار ناري، أو CORS). راجع تبويب Network في المتصفح وملف INTEGRATION.md.'
      : 'Could not reach the booking server (network, DNS, firewall, or CORS). Check the browser Network tab and INTEGRATION.md.';
    return {
      status: 'error',
      detail: /failed to fetch|networkerror|load failed/i.test(msg) ? networkHint : msg,
      networkError: true,
    };
  }
}

// ── Chat Service ─────────────────────────────────────────────

/** Chat → n8n production webhook. Payload: message + stable session_id. */
function getStableChatSessionId() {
  const STORAGE_KEY = 'sushi_demure_chat_session_id';
  try {
    const existing = window.localStorage.getItem(STORAGE_KEY);
    if (existing && String(existing).trim()) return existing;
    const generated = `web-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    window.localStorage.setItem(STORAGE_KEY, generated);
    return generated;
  } catch {
    // If localStorage is blocked, keep a process-level fallback for this tab.
    if (!window.__sushiDemureChatSessionId) {
      window.__sushiDemureChatSessionId = `web-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    }
    return window.__sushiDemureChatSessionId;
  }
}

function sanitizeChatReply(text) {
  const raw = String(text || '');
  return raw
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => {
      let s = line.trim();
      // Remove leading bullet/dash markers like "- " or "• ".
      s = s.replace(/^[-•]\s+/, '');
      // Remove markdown emphasis markers around labels/words.
      s = s.replace(/\*\*(.*?)\*\*/g, '$1');
      s = s.replace(/\*(.*?)\*/g, '$1');
      return s;
    })
    .join('\n')
    .trim();
}

async function sendChatMessage(message, history, lang) {
  const N8N_CHAT_WEBHOOK_URL = 'https://n8n-zcwg.srv1592624.hstgr.cloud/webhook/60368766-417f-4f43-8aec-c7828cb84368';
  const fallback = 'Sorry, there was a connection error. Please try again or contact us directly.';

  try {
    const session_id = getStableChatSessionId();
    const res = await fetch(N8N_CHAT_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        session_id,
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const reply = data && typeof data.reply === 'string' ? sanitizeChatReply(data.reply) : '';
    if (!reply) throw new Error('Missing reply in webhook response');
    return { reply };
  } catch (err) {
    console.error('Chat error:', err);
    return { reply: fallback };
  }
}

// ── Complaints Service ─────────────────────────────────────

/** Complaints → n8n (dedicated webhook only — not chat / reservation). */
async function submitComplaint(payload) {
  const N8N_COMPLAINT_WEBHOOK_URL =
    'https://n8n-zcwg.srv1592624.hstgr.cloud/webhook/e296fd84-f0b3-41fa-b822-65ff4f3fa5b9';

  const allowed = new Set(['general', 'food', 'service', 'reservation', 'delivery', 'billing']);
  let category = String(payload.category || 'general').trim().toLowerCase();
  if (!allowed.has(category)) category = 'general';

  const body = {
    name: String(payload.name || '').trim(),
    phone: String(payload.phone || '').trim(),
    complaint_text: String(payload.complaint_text || '').trim(),
    category,
    source: 'website',
  };

  try {
    const res = await fetch(N8N_COMPLAINT_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    if (!res.ok) {
      console.error('Complaint HTTP', res.status, text.slice(0, 300));
      return { ok: false };
    }
    let data = null;
    try {
      data = text.trim() ? JSON.parse(text) : null;
    } catch (parseErr) {
      console.error('Complaint JSON parse error:', parseErr, text.slice(0, 200));
      return { ok: false };
    }
    if (!data || data.success !== true) {
      console.error('Complaint unexpected response', text.slice(0, 300));
      return { ok: false };
    }
    return { ok: true, message: typeof data.message === 'string' ? data.message : undefined };
  } catch (err) {
    console.error('Complaint error:', err);
    return { ok: false };
  }
}

window.SushiServices = { submitReservation, sendChatMessage, submitComplaint };
