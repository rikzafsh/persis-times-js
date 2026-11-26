/**
 * ui.js — Kerangka antarmuka bersama: formulir lokasi (dengan validasi, simpan otomatis, "Lokasi saya", tombol tanggal),
 * tema otomatis/terang/gelap, sistem tab (aksesibel, navigasi keyboard, indikator sibuk), dan pemformat.
 * Setiap tab mendaftar lewat UI.add({id,label,icon}) lalu (opsional) UI.onRender(id, fn).
 * fn dipanggil saat tab ditampilkan dan masukan lokasi/tanggal berubah. Hanya berkas app/* yang menyentuh DOM.
 */
const UI = (() => {
  const $ = id => document.getElementById(id);
  const pad = n => String(n).padStart(2, "0");
  // [lintang, bujur, zona (jam, waktu standar tanpa DST), ketinggian (m)]
  const KELOMPOK_KOTA = [
    ["Indonesia", { "Yogyakarta":[-7.7956,110.3695,7,100], "Jakarta":[-6.2088,106.8456,7,8], "Bandung":[-6.9175,107.6191,7,768], "Surabaya":[-7.2575,112.7521,7,5], "Makassar":[-5.1477,119.4327,8,10], "Jayapura":[-2.5337,140.7181,9,5],
      "Lubuklinggau":[-3.29667,102.86167,7,130], "Batang":[-6.90814,109.73037,7,5], "Ponorogo":[-7.8685,111.462,7,103], "Blitar":[-8.09824,112.16508,7,167], "Trenggalek":[-8.05,111.7167,7,110],
      "Tulungagung":[-8.06667,111.9,7,85], "Parepare":[-4.01667,119.62361,8,22], "Melak":[-0.2372,115.8132,8,30] }],
    ["Dunia · belahan utara", { "Makkah":[21.4225,39.8262,3,300], "New Delhi":[28.6139,77.209,5.5,216], "Kairo":[30.0444,31.2357,2,23], "Istanbul":[41.0082,28.9784,3,40], "London":[51.5074,-0.1278,0,11],
      "Oslo":[59.9139,10.7522,1,23], "Reykjavik":[64.1466,-21.9426,0,10], "Tromsø (Norwegia)":[69.6492,18.9553,1,10] }],
    ["Dunia · dekat khatulistiwa", { "Pontianak":[-0.0263,109.3425,7,1], "Kuala Lumpur":[3.139,101.6869,8,60], "Quito":[-0.1807,-78.4678,-5,2850] }],
    ["Dunia · belahan selatan", { "Cape Town":[-33.9249,18.4241,2,25], "Sydney":[-33.8688,151.2093,10,58], "Buenos Aires":[-34.6037,-58.3816,-3,25], "Christchurch":[-43.5321,172.6362,12,20],
      "Ushuaia":[-54.8019,-68.303,-3,10], "Stasiun McMurdo (Antartika)":[-77.8463,166.6762,12,10] }],
  ];
  const CITIES = Object.assign({}, ...KELOMPOK_KOTA.map(g => g[1]));
  const KUSTOM = "Kustom";
  const tabs = []; let active = null, timer = null;

  // ───────── penyimpanan setelan (aman bila localStorage tidak tersedia) ─────────
  const KEY = "persis-times-js:v1", FIELDS = ["city", "lat", "lon", "elev", "tz", "method", "iht"];
  const simpan = () => { try { const o = {}; FIELDS.forEach(k => { o[k] = $(k).value; }); o.tema = tema; localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {} };
  const muat = () => { try { return JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch (e) { return {}; } };

  /** Masukan saat ini; nama ganda (lat/gLat, lon/gLon, tz/tmZn) agar kode lama tetap cocok. */
  function L() {
    const [y, mo, d] = $("date").value.split("-").map(Number), lat = +$("lat").value, lon = +$("lon").value, tz = +$("tz").value;
    return { y, mo, d, lat, lon, tz, elev: +$("elev").value, gLat: lat, gLon: lon, tmZn: tz, method: PrayerMethod.predefined[+$("method").value] || PrayerMethod.persatuanIslam, iht: +$("iht").value || 0 };
  }
  /** Validasi masukan; mengembalikan pesan galat berbahasa Indonesia atau "" bila sah. */
  function cek() {
    const num = id => (String($(id).value).trim() === "" ? NaN : +$(id).value), num0 = id => (String($(id).value).trim() === "" ? 0 : +$(id).value);   // elev & iht kosong = 0
    const lat = num("lat"), lon = num("lon"), tz = num("tz"), el = num0("elev"), ih = num0("iht"), t = String($("date").value).split("-").map(Number);
    if (!(lat >= -90 && lat <= 90)) return "Lintang harus berupa angka antara −90 dan 90.";
    if (!(lon >= -180 && lon <= 180)) return "Bujur harus berupa angka antara −180 dan 180.";
    if (!(tz >= -14 && tz <= 14)) return "Zona waktu harus berupa angka antara −14 dan 14 jam.";
    if (!(el >= -500 && el <= 9000)) return "Ketinggian harus antara −500 dan 9000 meter.";
    if (!(ih >= 0 && ih <= 60)) return "Ihtiyat harus antara 0 dan 60 menit.";
    if (t.length !== 3 || t.some(x => !Number.isFinite(x)) || t[0] < 1 || t[0] > 9999) return "Tanggal tidak valid.";
    return "";
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

  // ───────── tema: otomatis → terang → gelap ─────────
  const TEMA = [["auto", "🌗", "otomatis"], ["light", "☀️", "terang"], ["dark", "🌙", "gelap"]]; let tema = "auto";
  function setTema(t) {
    tema = TEMA.some(x => x[0] === t) ? t : "auto";
    const el = document.documentElement; if (el && el.setAttribute) { if (tema === "auto") el.removeAttribute("data-theme"); else el.setAttribute("data-theme", tema); }
    const m = TEMA.find(x => x[0] === tema), b = $("theme"); if (b) { b.innerHTML = m[1] + " <span>" + m[2] + "</span>"; b.setAttribute("aria-label", "Tema tampilan: " + m[2] + ". Ketuk untuk mengganti."); }
  }

  // ───────── tab ─────────
  function add({ id, label, icon }) {
    const b = document.createElement("button"), p = document.createElement("section");
    b.type = "button"; b.textContent = (icon ? icon + " " : "") + label; b.setAttribute("role", "tab"); b.id = "tab-" + id; b.setAttribute("aria-controls", "panel-" + id); b.onclick = () => show(id);
    p.id = "panel-" + id; p.className = "panel"; p.setAttribute("role", "tabpanel"); p.setAttribute("aria-labelledby", "tab-" + id); p.hidden = true;
    $("tabs").appendChild(b); $("panels").appendChild(p);
    tabs.push({ id, b, p, dirty: true, render: null }); return p;
  }
  const onRender = (id, fn) => { tabs.find(t => t.id === id).render = fn; };
  function draw(t) {
    if (!t.dirty || !t.render) return;
    if (cek()) return;                                   // masukan tidak sah: tunda (pesan galat tampil di atas tab)
    t.dirty = false; t.p.classList.add("busy"); t.p.setAttribute("aria-busy", "true");
    setTimeout(() => {                                   // beri peramban kesempatan menggambar indikator sibuk
      try { t.render(t.p); } catch (e) { t.p.innerHTML = err(e); }
      t.p.classList.remove("busy"); t.p.removeAttribute("aria-busy");
    }, 20);
  }
  function show(id, fokus) {
    const t = tabs.find(x => x.id === id) || tabs[0]; active = t;
    tabs.forEach(x => { const on = x === t; x.p.hidden = !on; x.b.setAttribute("aria-selected", on ? "true" : "false"); x.b.tabIndex = on ? 0 : -1; });
    try { if (location.hash.slice(1) !== t.id) history.replaceState(null, "", "#" + t.id); } catch (e) {}
    try { t.b.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" }); if (fokus) t.b.focus(); } catch (e) {}
    draw(t);
  }
  function tombolTab(e) {                                // navigasi keyboard: ← → Home End
    const i = tabs.indexOf(active); let j = null;
    if (e.key === "ArrowRight") j = (i + 1) % tabs.length; else if (e.key === "ArrowLeft") j = (i - 1 + tabs.length) % tabs.length; else if (e.key === "Home") j = 0; else if (e.key === "End") j = tabs.length - 1;
    if (j != null) { if (e.preventDefault) e.preventDefault(); show(tabs[j].id, true); }
  }

  // ───────── formulir lokasi ─────────
  function ringkas() {
    const l = L(), kota = $("city").value, nama = kota === KUSTOM ? (isFinite(l.lat) ? l.lat.toFixed(3) + "°, " + l.lon.toFixed(3) + "°" : "lokasi kustom") : kota;
    $("locsum").textContent = nama + " · " + l.d + "/" + l.mo + "/" + l.y + " · " + l.method.name;
  }
  function galat(pesan) { const e = $("locerr"); if (!e) return; e.textContent = pesan; e.hidden = !pesan; }
  function refresh() {
    const m = cek(); galat(m);
    if (m) return;
    tabs.forEach(t => t.dirty = true); ringkas(); simpan(); if (active) draw(active);
  }
  const tunda = () => { clearTimeout(timer); timer = setTimeout(refresh, 250); };
  function isiKota() {
    const c = CITIES[$("city").value]; if (!c) return;
    $("lat").value = c[0]; $("lon").value = c[1]; $("tz").value = c[2]; $("elev").value = c[3];
  }
  function geser(n) {
    const [y, mo, d] = String($("date").value).split("-").map(Number); if (![y, mo, d].every(Number.isFinite)) return;
    const t = new Date(Date.UTC(y, mo - 1, d + n)); $("date").value = t.getUTCFullYear() + "-" + pad(t.getUTCMonth() + 1) + "-" + pad(t.getUTCDate()); refresh();
  }
  function hariIni() { const n = new Date(); $("date").value = n.getFullYear() + "-" + pad(n.getMonth() + 1) + "-" + pad(n.getDate()); }
  function lokasiSaya() {
    if (typeof navigator === "undefined" || !navigator.geolocation) { galat("Peramban ini tidak mendukung penentuan lokasi."); return; }
    $("geo").textContent = "Mencari lokasi…";
    navigator.geolocation.getCurrentPosition(p => {
      $("geo").textContent = "📍 Lokasi saya"; $("city").value = KUSTOM;
      $("lat").value = (+p.coords.latitude.toFixed(5)); $("lon").value = (+p.coords.longitude.toFixed(5));
      $("elev").value = Number.isFinite(p.coords.altitude) ? Math.round(p.coords.altitude) : 0; $("tz").value = -new Date().getTimezoneOffset() / 60; refresh();
    }, e => { $("geo").textContent = "📍 Lokasi saya"; galat("Lokasi tidak dapat ditentukan (" + (e && e.code === 1 ? "izin ditolak" : "gagal") + "). Isi lintang dan bujur secara manual."); }, { timeout: 15000, maximumAge: 600000 });
  }
  function aturUlang() {
    try { localStorage.removeItem(KEY); } catch (e) {}
    $("city").value = "Yogyakarta"; isiKota(); $("method").value = "0"; $("iht").value = 0; hariIni(); setTema("auto"); refresh();
  }

  function start() {
    const kk = document.createElement("option"); kk.value = KUSTOM; kk.textContent = "Kustom (isi manual)"; $("city").appendChild(kk);
    KELOMPOK_KOTA.forEach(([nama, kota]) => {
      const g = document.createElement("optgroup"); g.label = nama;
      Object.keys(kota).forEach(k => { const o = document.createElement("option"); o.value = k; o.textContent = k; g.appendChild(o); }); $("city").appendChild(g);
    });
    PrayerMethod.predefined.forEach((m, i) => { const o = document.createElement("option"); o.value = i; o.textContent = m.name; $("method").appendChild(o); });
    $("city").value = "Yogyakarta"; isiKota(); hariIni();
    const s = muat();                                     // pulihkan setelan terakhir
    if (s.city) { $("city").value = s.city; ["lat", "lon", "elev", "tz", "method", "iht"].forEach(k => { if (s[k] != null && s[k] !== "") $(k).value = s[k]; }); }
    setTema(s.tema || "auto");
    // kejadian
    $("city").onchange = () => { if ($("city").value !== KUSTOM) isiKota(); refresh(); };
    ["lat", "lon", "elev", "tz"].forEach(k => { $(k).onchange = () => { $("city").value = KUSTOM; refresh(); }; });
    ["date", "method", "iht"].forEach(k => { $(k).onchange = refresh; });
    ["lat", "lon", "elev", "tz", "iht"].forEach(k => { $(k).oninput = tunda; });
    $("apply").onclick = refresh; $("geo").onclick = lokasiSaya; $("dnow").onclick = () => { hariIni(); refresh(); }; $("reset").onclick = aturUlang;
    $("dprev").onclick = () => geser(-1); $("dnext").onclick = () => geser(1);
    $("theme").onclick = () => { setTema(TEMA[(TEMA.findIndex(x => x[0] === tema) + 1) % TEMA.length][0]); simpan(); };
    $("tabs").onkeydown = tombolTab;
    try { if (window.matchMedia && window.matchMedia("(max-width: 700px)").matches) $("locbox").open = false; } catch (e) {}
    galat(cek()); ringkas();
    let h = ""; try { h = location.hash.slice(1); } catch (e) {}
    show(h);
  }
  return { $, pad, CITIES, L, cek, hm, hms, sgn, dms, rows, card, err, fmtDT, fmtD, faseNama, add, onRender, show, refresh, start };
})();
