/**
 * ui.js — Kerangka antarmuka bersama: formulir lokasi, sistem tab, dan pemformat.
 * Setiap tab mendaftar lewat UI.add({id,label,icon}) lalu (opsional) UI.onRender(id, fn).
 * fn dipanggil saat tab ditampilkan dan masukan lokasi/tanggal berubah. Hanya berkas app/* yang menyentuh DOM.
 */
const UI = (() => {
  const $ = id => document.getElementById(id);
  const pad = n => String(n).padStart(2, "0");
  const CITIES = { "Yogyakarta":[-7.7956,110.3695,7,100], "Jakarta":[-6.2088,106.8456,7,8], "Bandung":[-6.9175,107.6191,7,768], "Surabaya":[-7.2575,112.7521,7,5],
    "Makassar":[-5.1477,119.4327,8,10], "Jayapura":[-2.5337,140.7181,9,5], "Makkah":[21.4225,39.8262,3,300], "New Delhi":[28.6139,77.209,5.5,216], "Kuala Lumpur":[3.139,101.6869,8,60] };
  const tabs = []; let active = null;

  /** Masukan saat ini; nama ganda (lat/gLat, lon/gLon, tz/tmZn) agar kode lama tetap cocok. */
  function L() {
    const [y, mo, d] = $("date").value.split("-").map(Number), lat = +$("lat").value, lon = +$("lon").value, tz = +$("tz").value;
    return { y, mo, d, lat, lon, tz, elev: +$("elev").value, gLat: lat, gLon: lon, tmZn: tz, method: PrayerMethod.predefined[+$("method").value] || PrayerMethod.persatuanIslam, iht: +$("iht").value || 0 };
  }
  const hm = h => { if (h == null) return "—"; let t = Math.round(h * 3600); t = ((t % 86400) + 86400) % 86400; return pad(Math.floor(t / 3600)) + ":" + pad(Math.floor(t % 3600 / 60)); };
  const dms = x => { const s = x < 0 ? "−" : ""; x = Math.abs(x); const d = Math.floor(x), m = Math.floor((x - d) * 60), sc = ((x - d) * 60 - m) * 60; return s + d + "° " + pad(m) + "′ " + sc.toFixed(1).padStart(4, "0") + "″"; };
  /** jam desimal → hh:mm:ss */
  const hms = h => { if (h == null || Number.isNaN(h)) return "—"; let t = Math.round(h * 3600); t = ((t % 86400) + 86400) % 86400; return pad(Math.floor(t / 3600)) + ":" + pad(Math.floor(t % 3600 / 60)) + ":" + pad(t % 60); };
  /** jam desimal → "+15 m 54 d" (bertanda, menit & detik) */
  const sgn = h => { const s = Math.round(Math.abs(h) * 3600); return (h < 0 ? "−" : "+") + Math.floor(s / 60) + " m " + (s % 60) + " d"; };
  const rows = a => "<table class='kv'>" + a.map(r => "<tr><td>" + r[0] + "</td><td>" + r[1] + "</td></tr>").join("") + "</table>";
  const card = (t, b, extra) => "<div class='card'><h2>" + t + "</h2><div class='wrap'>" + b + "</div>" + (extra ? "<p class='note'>" + extra + "</p>" : "") + "</div>";
  const err = e => "<div class='card'><span class='tag warn'>Galat</span> " + (e && e.message || e) + "</div>";
  /** JD (UT) → "d/mm/yyyy hh:mm[:ss]" pada zona tz */
  const fmtDT = (jd, tz, sec) => {
    if (jd == null) return "—";
    const d = new Date((jd - 2440587.5) * 864e5 + tz * 36e5 + (sec ? 0 : 30000));
    return d.getUTCDate() + "/" + pad(d.getUTCMonth() + 1) + "/" + d.getUTCFullYear() + " " + pad(d.getUTCHours()) + ":" + pad(d.getUTCMinutes()) + (sec ? ":" + pad(d.getUTCSeconds()) : "");
  };
  const fmtD = (jd, tz) => { const d = new Date((jd - 2440587.5) * 864e5 + tz * 36e5), H = ["Min","Sen","Sel","Rab","Kam","Jum","Sab"]; return H[d.getUTCDay()] + ", " + d.getUTCDate() + "/" + pad(d.getUTCMonth() + 1) + "/" + d.getUTCFullYear(); };
  const FASE8 = [["🌑","Bulan Baru"],["🌒","Sabit Awal"],["🌓","Kuartal Pertama"],["🌔","Cembung Awal"],["🌕","Purnama"],["🌖","Cembung Akhir"],["🌗","Kuartal Akhir"],["🌘","Sabit Akhir"]];
  const faseNama = e => FASE8[Math.floor((((e % 360) + 360) % 360 + 22.5) / 45) % 8];

  function add({ id, label, icon }) {
    const b = document.createElement("button"), p = document.createElement("section");
    b.textContent = (icon ? icon + " " : "") + label; b.setAttribute("role", "tab"); b.onclick = () => show(id);
    p.className = "panel"; p.setAttribute("role", "tabpanel"); p.hidden = true;
    $("tabs").appendChild(b); $("panels").appendChild(p);
    tabs.push({ id, b, p, dirty: true, render: null }); return p;
  }
  const onRender = (id, fn) => { tabs.find(t => t.id === id).render = fn; };
  function draw(t) {
    if (!t.dirty || !t.render) return; t.dirty = false;
    try { t.render(t.p); } catch (e) { t.p.innerHTML = err(e); }
  }
  function show(id) {
    const t = tabs.find(x => x.id === id) || tabs[0]; active = t;
    tabs.forEach(x => { x.p.hidden = x !== t; x.b.setAttribute("aria-selected", x === t ? "true" : "false"); });
    try { if (location.hash.slice(1) !== t.id) history.replaceState(null, "", "#" + t.id); } catch (e) {}
    draw(t);
  }
  function refresh() { tabs.forEach(t => t.dirty = true); summary(); if (active) draw(active); }
  function summary() {
    const l = L(); $("locsum").textContent = $("city").value + " · " + l.d + "/" + l.mo + "/" + l.y + " · " + l.method.name;
  }
  function start() {
    Object.keys(CITIES).forEach(k => { const o = document.createElement("option"); o.textContent = k; $("city").appendChild(o); });
    PrayerMethod.predefined.forEach((m, i) => { const o = document.createElement("option"); o.value = i; o.textContent = m.name; $("method").appendChild(o); });
    const setCity = () => { const c = CITIES[$("city").value] || CITIES.Yogyakarta; $("lat").value = c[0]; $("lon").value = c[1]; $("tz").value = c[2]; $("elev").value = c[3]; };
    $("city").onchange = () => { setCity(); refresh(); }; setCity();
    const n = new Date(); $("date").value = n.getFullYear() + "-" + pad(n.getMonth() + 1) + "-" + pad(n.getDate());
    $("apply").onclick = refresh;
    ["date", "method"].forEach(i => $(i).onchange = refresh);
    summary();
    let h = ""; try { h = location.hash.slice(1); } catch (e) {}
    show(h);
  }
  return { $, pad, CITIES, L, hm, hms, sgn, dms, rows, card, err, fmtDT, fmtD, faseNama, add, onRender, show, refresh, start };
})();
