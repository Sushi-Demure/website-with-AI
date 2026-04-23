# Sushi Demure — Integration reference

Use this file when wiring n8n, Retell, or debugging the website vs Slack.

---

## Production URLs & keys

| Item | Value |
|------|--------|
| **n8n — Chat (production webhook)** | `https://n8n-zcwg.srv1592624.hstgr.cloud/webhook/60368766-417f-4f43-8aec-c7828cb84368` |
| **n8n — Website reservation (production webhook)** | `https://n8n-zcwg.srv1592624.hstgr.cloud/webhook/91c29aa5-e239-431f-b5e0-41270ec950c8` |
| **Retell AI — Public key** | `public_key_3c5ba26e49b46112b6dbb` |
| **Retell AI — Agent ID** | `agent_714b199204c6cc01cd77ebc37d` |

**Code locations**

- Webhooks: `js/core/services.js`
- Retell (web call + SDK): `js/components/ChatVoice.jsx`

---

## Reservation JSON (website → n8n)

The website must POST **only** structured fields (no full sentences, no `query` wrapper unless your workflow expects it).

**Contract (example):**

```json
{
  "name": "Ali",
  "date": "2026-04-25",
  "time": "20:00",
  "guests": 2,
  "phone": "+966537854826",
  "special_request": "Window seat",
  "preferred_table": "Table 2"
}
```

**Rules**

- **Required:** `name`, `date`, `time`, `guests` (number), `phone`
- **Optional:** `special_request`, `preferred_table` — send `""` if empty (never omit if your n8n node expects strings)
- `guests` must be a **number**, not a string

**Frontend → JSON (implemented in `js/core/services.js`)**

| Form / source | JSON key | Notes |
|---------------|----------|--------|
| `name`, `date`, `time`, `guests`, `phone` | same | Required before submit (UI validates). `guests` 1–50. |
| `preferred_table` | `preferred_table` | Optional table number / label (e.g. `Table 2`). Empty string if blank → n8n can auto-assign per your prompt. |
| `request` + optional `seating`, `occasion`, `language` | `special_request` | Free-text plus a second line with `Seating area: … · Occasion: … · Preferred language: …` when any of those are set. Fits the 7-field contract while keeping area/occasion/language for staff. |

---

## Chat JSON (website → n8n)

Current payload in `sendChatMessage`:

```json
{
  "message": "<user text>",
  "lang": "en" | "ar",
  "history": [ { "role": "user|ai", "content": "..." }, ... ]
}
```

Ensure your chat webhook accepts this shape, or adjust `services.js` to match your workflow.

---

## Retell (voice)

- Browser calls `POST https://api.retellai.com/v2/create-web-call` with `Authorization: Bearer <public_key>` and body `{ "agent_id": "<id>" }`.
- **Security note:** Public key in frontend is normal for Retell web; still rotate if leaked and monitor usage.

---

## Slack works but browser times out — checklist

1. From the **same PC** as the browser: `curl -v -X POST` to the reservation URL with the JSON above.  
   - Timeout → n8n host / DNS / firewall / VPS asleep — not a React bug.  
2. n8n instance **running**, workflow **active**, webhook path matches production.  
3. If only browser fails: VPN, ISP, ad-block, corporate proxy.  
4. **CORS:** wrong CORS often shows a CORS error in console; pure **timeout** is connectivity to host.

---

## Alignment with your restaurant assistant (system prompt)

Use this as a **cross-check** between website, n8n agent, and booking tool.

### Reservations

- [ ] Required before any booking tool call: `name`, `date`, `time`, guests count, `phone`
- [ ] Optional: `special_request`, `preferred_table` — never block submit if missing
- [ ] Website form: already requires name, phone, date, time, guests before submit
- [ ] Agent: ask only for missing required fields; do not re-ask known fields
- [ ] Agent: optional table question only after required fields collected
- [ ] Agent: confirm summary → user must clearly confirm → then call booking tool
- [ ] Tool input: structured fields only (matches table above)

### After tool response

- [ ] `success === true` → short confirmation (include table if returned)
- [ ] `success === false` → do not confirm; offer another table / time as per your copy rules

### Complaints / FAQ / escalation

- [ ] Short answers; escalate on angry / VIP / impossible booking / refund — per your prompt

---

## Changing URLs later

Edit **`js/core/services.js`** constants `N8N_RESERVATION_WEBHOOK_URL` and `N8N_CHAT_WEBHOOK_URL`, then hard-refresh the browser (Ctrl+Shift+R).
