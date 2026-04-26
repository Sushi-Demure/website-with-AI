// ============================================================
// SUSHI DEMURE — Phone number validation (Saudi + international)
// Use isValidPhone for required fields; isValidPhoneOptional when empty is OK.
// ============================================================

(function (g) {
  function digitsOnly(s) {
    return String(s || '').replace(/\D/g, '');
  }

  function isSaudiMobile(d) {
    if (d.length === 10 && /^05\d{8}$/.test(d)) return true;
    if (d.length === 9 && /^5\d{8}$/.test(d)) return true;
    if (d.length === 12 && /^9665\d{8}$/.test(d)) return true;
    if (d.length === 14 && /^009665\d{8}$/.test(d)) return true;
    return false;
  }

  function isInternationalE164(d) {
    if (d.length < 8 || d.length > 15) return false;
    if (d[0] === '0') return false;
    return /^[1-9]\d{7,14}$/.test(d);
  }

  function isValidPhone(value) {
    const t = String(value || '').trim();
    if (!t) return false;
    let d = digitsOnly(t);
    while (d.length > 2 && d.startsWith('00')) d = d.slice(2);
    if (isSaudiMobile(d)) return true;
    if (isInternationalE164(d)) return true;
    return false;
  }

  function isValidPhoneOptional(value) {
    if (!String(value || '').trim()) return true;
    return isValidPhone(value);
  }

  g.SushiPhoneValidation = { isValidPhone, isValidPhoneOptional, digitsOnly };
})(typeof window !== 'undefined' ? window : globalThis);
