/**
 * tab_hilal.js — Tab "Hijriah & Hilal" (tanggal Hijriah + hisab awal bulan) dan tab "Peta Hilal" (visibilitas hilal dunia).
 * Memakai HisabAwalBulanService dan PetaVisibilitasService (js/services/), membaca lokasi dari formulir utama.
 */
(function () {
  const $ = id => document.getElementById(id);
  const BULAN = ["Al-Muharram","Shafar","Rabiul Awwal","Rabiul Akhir","Jumadal Ula","Jumadal Akhirah","Rajab","Syaban","Ramadhan","Syawwal","Zulqadah","Zulhijjah"];
  const P1 = UI.add({ id: "hijriah", label: "Hijriah & Hilal", icon: "🌙" }), P2 = UI.add({ id: "peta", label: "Peta Hilal", icon: "🗺️" });
  P1.innerHTML = "<div id='hcal'></div>" +
    "<div class='card'><h2>Perbandingan kalender Hijriah &amp; Jawa</h2><div class='grid'>" +
    "<label>Jumlah hari (mulai tanggal terpilih)<input id='kcn' type='number' step='1' min='1' max='90' value='30'></label></div>" +
    "<button id='kcgo'>Bandingkan kalender</button><div id='kcout' class='wrap' style='margin-top:10px'></div></div>" +
    "<div class='card'><h2>Hisab awal bulan Hijriah &amp; visibilitas hilal</h2><div class='grid'>" +
    "<label>Bulan yang dihisab<select id='hb'></select></label>" +
    "<label>Tahun Hijriah<input id='ht' type='number' step='1'></label>" +
    "<label>Tambah hari (ke Magrib)<input id='hd' type='number' step='1' value='0'></label></div>" +
    "<button id='hgo'>Hisab awal bulan</button></div><div id='hout'></div>";
  P2.innerHTML = "<div class='card'><h2>Peta visibilitas hilal dunia <small>(kriteria Odeh)</small></h2><div class='grid'>" +
    "<label>Bulan Hijriah<select id='pb'></select></label><label>Tahun Hijriah<input id='pt' type='number' step='1'></label><label>Tambah hari<input id='pd' type='number' step='1' value='0'></label>" +
    "<label>Resolusi<select id='mres'><option value='10'>10° (cepat, ±3 dtk)</option><option value='5'>5° (halus, ±10 dtk)</option></select></label>" +
    "<label>Magrib yang dipakai<select id='mmode'><option value='1'>Pertama setelah ijtimak</option><option value='0'>Hari ijtimak lokal (+ tambah hari)</option></select></label></div>" +
    "<button id='mgo'>Gambar peta</button><div class='wrap'><canvas id='mc' width='720' height='360' style='width:100%;max-width:720px;margin-top:10px;border:1px solid var(--line);border-radius:8px'></canvas></div>" +
    "<div id='mleg' style='margin-top:8px;font-size:13px'></div></div>";
  BULAN.forEach((n, i) => { const o = document.createElement("option"); o.value = i + 1; o.textContent = (i + 1) + ". " + n; $("hb").appendChild(o); });
  // bulan Hijriah berikutnya (perkiraan dari Intl; cadangan: Jumadal Akhirah 1448)
  let hb = 6, ht = 1448;
  try {
    const p = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", { month: "numeric", year: "numeric" }).formatToParts(new Date());
    const m = +p.find(x => x.type === "month").value, y = +p.find(x => x.type === "year").value;
    hb = m === 12 ? 1 : m + 1; ht = m === 12 ? y + 1 : y;
  } catch (e) {}
  $("hb").value = hb; $("ht").value = ht;
  BULAN.forEach((n, i) => { const o = document.createElement("option"); o.value = i + 1; o.textContent = (i + 1) + ". " + n; $("pb").appendChild(o); });
  $("pb").value = hb; $("pt").value = ht;

  const pad = n => String(n).padStart(2, "0");
  const fmtJD = (jd, tz) => {            // JD → "tgl bulan tahun, jj:mm:dd (zona)"
    if (jd == null) return "—";
    const d = new Date((jd - 2440587.5) * 864e5 + tz * 36e5);
    return d.getUTCDate() + "/" + pad(d.getUTCMonth() + 1) + "/" + d.getUTCFullYear() + " " + pad(d.getUTCHours()) + ":" + pad(d.getUTCMinutes()) + ":" + pad(d.getUTCSeconds());
  };
  const deg = x => x.toFixed(3) + "°";
  const ok = v => v === 1 ? "✔ memenuhi" : "✘ belum";
  const rows = a => "<table class='kv'>" + a.map(r => "<tr><td>" + r[0] + "</td><td>" + r[1] + "</td></tr>").join("") + "</table>";
  const card = (t, b) => "<div class='card'><h2>" + t + "</h2><div class='wrap'>" + b + "</div></div>";
  const loc = () => ({ gLon: +$("lon").value, gLat: +$("lat").value, tmZn: +$("tz").value, elev: +$("elev").value });

  $("hgo").onclick = () => {
    const L = loc(), blnH = +$("hb").value, thnH = +$("ht").value, tbhHari = +$("hd").value || 0;
    $("hout").innerHTML = card("Menghitung…", "");
    setTimeout(() => {
      try {
        const r = new HisabAwalBulanService().hitung({ blnH, thnH, ...L, pres: 1010, temp: 10, tbhHari, optKriteria: 1 });
        const v = new PetaVisibilitasService().hitung({ blnH, thnH, gLon: L.gLon, gLat: L.gLat, tmZn: L.tmZn, tbhHari });
        const h = r.hilal, z = "zona " + L.tmZn;
        $("hout").innerHTML =
          card("1 " + BULAN[blnH - 1] + " " + thnH + " H — data hilal <small>(" + z + ")</small>", rows([
            ["Ijtimak geosentris", fmtJD(r.geojdIjtimak, L.tmZn)], ["Ijtimak toposentris", fmtJD(r.topojdIjtimak, L.tmZn)],
            ["Matahari terbenam", fmtJD(r.sunsetJD, L.tmZn)], ["Bulan terbenam", fmtJD(r.moonsetJD, L.tmZn)],
            ["Elongasi geosentris / toposentris", deg(h.elongationGeo) + " / " + deg(h.elongationTopo)],
            ["Tinggi hilal geosentris", deg(r.moonGeo.altitude)], ["Tinggi hilal toposentris (observed, pusat)", deg(r.moonTopo.altitudeObservedCenter)],
            ["Lebar sabit geo / topo (°)", h.crescentWidthGeo.toFixed(3) + " / " + h.crescentWidthTopo.toFixed(3)],
            ["Iluminasi (geosentris)", r.moonGeo.diskIlluminationFraction.toFixed(3) + " %"], ["Nilai q Odeh", h.qOdeh.toFixed(3)],
            ["Waktu terbaik rukyat (jam lokal)", h.bestTime == null ? "—" : pad(Math.floor(h.bestTime)) + ":" + pad(Math.floor((h.bestTime % 1) * 60))]])) +
          card("Status kriteria di lokasi ini", rows([["MABIMS (elongasi ≥ 6,4°, tinggi ≥ 3°)", ok(r.imkanMabimsStatus)], ["Turki / KHGT (elongasi ≥ 8°, tinggi ≥ 5°)", ok(r.imkanTurkiStatus)], ["Wujudul Hilal (hilal di atas ufuk)", ok(r.wujudHilalStatus)]])) +
          card("Visibilitas hilal (kriteria empiris)", rows([["Odeh", v.zonaOdeh + " (q " + v.qOdeh.toFixed(2) + ")"], ["Yallop", v.zonaYallop + " (q′ " + v.qYallop.toFixed(3) + ")"], ["SAAO", v.saaoStatus], ["Maunder", v.maunderVisible ? "Terlihat" : "Tidak terlihat"], ["Bruin", v.bruinVisible ? "Terlihat" : "Tidak terlihat"], ["ARCV / DAZ", deg(v.arcv) + " / " + deg(v.daz)]]));
      } catch (e) { $("hout").innerHTML = card("Gagal", "<p>" + e.message + "</p>"); }
    }, 20);
  };

  // ---- peta: tiap titik grid dihitung bertahap agar halaman tidak membeku ----
  const WARNA = { A: "#2e9e5b", B: "#9ad06a", C: "#f0c93e", D: "#c9ccd1" };
  let token = 0;
  $("mgo").onclick = () => {
    const mode = $("mmode").value !== "0", my = ++token, step = +$("mres").value || 10, blnH = +$("pb").value, thnH = +$("pt").value, tbhHari = +$("pd").value || 0;
    const cv = $("mc"), g = cv.getContext("2d"), W = cv.width, H = cv.height;
    const css = getComputedStyle(document.documentElement);
    g.fillStyle = css.getPropertyValue("--card") || "#fff"; g.fillRect(0, 0, W, H);
    const X = lon => (lon + 180) / 360 * W, Y = lat => (90 - lat) / 180 * H;
    const svc = new PetaVisibilitasService(), pre = svc.preHitung({ blnH, thnH });
    const lats = []; for (let la = 60; la >= -60; la -= step) lats.push(la);
    let i = 0;
    const row = () => {
      if (my !== token) return;
      const la = lats[i++];
      for (let lo = -180; lo < 180; lo += step) {
        try {
          const a = { blnH, thnH, gLon: lo + step / 2, gLat: la - step / 2, tmZn: Math.round((lo + step / 2) / 15), tbhHari, jdIjtimak: pre.jdIjtimak, deltaT: pre.deltaT };
          let v = svc.hitung(a);
          if (mode && v.sunsetJD < v.geojdIjtimak) v = svc.hitung({ ...a, tbhHari: tbhHari + 1 });   // Magrib sebelum ijtimak → ambil hari berikutnya
          g.fillStyle = WARNA[v.zonaOdeh[0]] || WARNA.D;
        } catch (e) { g.fillStyle = WARNA.D; }
        g.fillRect(X(lo), Y(la), X(lo + step) - X(lo) + 0.5, Y(la - step) - Y(la) + 0.5);
      }
      g.strokeStyle = "rgba(120,130,125,.35)"; g.lineWidth = 1;   // grafik garis lintang/bujur
      g.beginPath(); for (let lo = -180; lo <= 180; lo += 30) { g.moveTo(X(lo), 0); g.lineTo(X(lo), H); }
      for (let a = -60; a <= 60; a += 30) { g.moveTo(0, Y(a)); g.lineTo(W, Y(a)); } g.stroke();
      $("mleg").innerHTML = i < lats.length ? "Menghitung… " + Math.round(i / lats.length * 100) + "%" : legend(pre);
      if (i < lats.length) setTimeout(row, 0); else mark(g, X, Y);
    };
    row();
  };
  function mark(g, X, Y) {            // tandai lokasi pada formulir
    const L = loc(); g.fillStyle = "#d33"; g.beginPath(); g.arc(X(L.gLon), Y(L.gLat), 4, 0, 6.2832); g.fill();
    g.strokeStyle = "#fff"; g.lineWidth = 1.5; g.stroke();
  }
  function legend(pre) {
    const jd = new JulianDay();
    return ["A|Mata telanjang", "B|Alat optik, mungkin mata", "C|Alat optik saja", "D|Tidak terlihat"].map(s => { const [k, t] = s.split("|"); return "<span style='display:inline-block;width:11px;height:11px;background:" + WARNA[k] + ";margin-right:4px;border-radius:2px'></span>" + k + " " + t; }).join(" &nbsp; ") +
      "<br><small>Ijtimak geosentris: " + fmtJD(pre.jdIjtimak, 0) + " UT. Zona waktu tiap sel = bujur/15. Mode “pertama setelah ijtimak” memajukan sel yang Magribnya mendahului ijtimak ke hari berikutnya. Garis kisi tiap 30°; titik merah = lokasi Anda. Peta tanpa garis pantai (tidak ada data peta di pustaka).</small>";
  }

  // ---- perbandingan berbagai kalender: kolom = tanggal Masehi, baris = varian kalender ----
  const KAL_NAMA = ["MABIMS", "Ummul Qura", "Wujudul Hilal", "Aritmetis I", "Aritmetis II", "Aritmetis III", "Aritmetis IV", "Mataraman"];
  const cjdnOf = (d, m, y) => Math.floor(new JulianDay().kmjd(d, m, y) + 0.5);
  function awalBulanTabel(fn, y0, y1) {        // daftar awal bulan hisab [{c: CJDN, m, y}] untuk tahun Hijriah y0..y1
    const out = [];
    for (let y = y0; y <= y1; y++) for (let m = 1; m <= 12; m++) out.push({ c: Math.floor(fn(m, y) + 0.5), m, y });
    return out.sort((a, b) => a.c - b.c);
  }
  function tglDariTabel(tb, c) {              // tanggal Hijriah untuk CJDN c; null bila di luar cakupan
    let k = -1; for (let i = 0; i < tb.length; i++) if (tb[i].c <= c) k = i; else break;
    if (k < 0 || k === tb.length - 1) return null;
    return { d: c - tb[k].c + 1, m: tb[k].m, y: tb[k].y };
  }
  function hitungBanding() {
    const L = UI.L(), n = Math.max(1, Math.min(90, Math.floor(+$("kcn").value) || 30)), jdn = new JulianDay();
    const c0 = cjdnOf(L.d, L.mo, L.y), tgl = [];
    for (let i = 0; i < n; i++) {
      const dt = new Date((c0 + i - 2440588) * 864e5);    // CJDN → tanggal Masehi (UTC)
      tgl.push({ c: c0 + i, d: dt.getUTCDate(), m: dt.getUTCMonth() + 1, y: dt.getUTCFullYear() });
    }
    const hY = c => jdn.cjdnkh(c, { hCalE: 2, hCalL: 2, optResult: "THNH" });
    const y0 = hY(c0) - 1, y1 = hY(c0 + n) + 1, cal = new CalendarService();
    const tbl = [cal.abqMabims.bind(cal), cal.abqUmmulQura.bind(cal), cal.abqWujudulHilal.bind(cal)].map(f => awalBulanTabel(f, y0, y1));
    const hijriah = [0, 1, 2].map(i => tgl.map(t => tglDariTabel(tbl[i], t.c)));
    const aritmetis = [1, 2, 3, 4].map(l => tgl.map(t => ({
      d: jdn.cjdnkh(t.c, { hCalE: 2, hCalL: l, optResult: "TGLH" }), m: jdn.cjdnkh(t.c, { hCalE: 2, hCalL: l, optResult: "BLNH" }), y: jdn.cjdnkh(t.c, { hCalE: 2, hCalL: l, optResult: "THNH" }) })));
    const jawa = [tgl.map(t => { const j = jd2jawa(t.c - 0.5); return { d: j.tanggalJawa, m: j.bulanJawa, y: j.tahunJawa }; })];
    const data = [...hijriah, ...aritmetis, ...jawa];
    const HARI = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    let h = "<table style='font-size:12px;white-space:nowrap'><thead><tr><th style='text-align:left;position:sticky;left:0;background:var(--card,#fff)'>Kalender</th>" +
      tgl.map(t => "<th style='text-align:center'>" + HARI[(t.c + 1) % 7] + "<br>" + t.d + "/" + pad(t.m) + "/" + String(t.y).slice(-2) + "</th>").join("") + "</tr></thead><tbody>";
    data.forEach((r, i) => {
      h += "<tr><td style='position:sticky;left:0;background:var(--card,#fff);font-weight:600'>" + KAL_NAMA[i] + "</td>" + r.map(x => x ?
        "<td style='text-align:center" + (x.d === 1 ? ";background:rgba(46,158,91,.22);font-weight:700" : "") + "'>" + x.d + "/" + x.m + "/" + x.y + "</td>" : "<td style='text-align:center'>—</td>").join("") + "</tr>";
    });
    return h + "</tbody></table><p class='note'>Format tanggal/bulan/tahun (bulan berupa nomor; Jawa: 1 = Sura). Sel hijau = tanggal 1 (awal bulan). Hijriah hisab (MABIMS, Ummul Qura, Wujudul Hilal) memakai kriteria &amp; lokasi bawaan tiap kalender, bukan lokasi di formulir. Aritmetis I–IV = pola tahun kabisat 1–4 (epoch Jumat, 16 Juli 622 M); Mataraman = kalender Jawa Sultan Agungan. Kolom: tanggal Masehi (dd/mm/yy), dari tanggal terpilih.</p>";
  }
  $("kcgo").onclick = () => {
    $("kcout").innerHTML = "Menghitung…";
    setTimeout(() => { try { $("kcout").innerHTML = hitungBanding(); } catch (e) { $("kcout").innerHTML = "<p>" + e.message + "</p>"; } }, 20);
  };
  // tanggal Hijriah pada tanggal terpilih (tiga kriteria)
  UI.onRender("hijriah", () => {
    const L = UI.L(), c = new CalendarService(), f = s => String(s).split("|").pop().trim();
    $("hcal").innerHTML = card("Tanggal Hijriah <small>(" + L.d + "/" + L.mo + "/" + L.y + ")</small>", rows([["MABIMS", f(c.serviceKalenderHijriahMABIMS(L.d, L.mo, L.y))], ["Ummul Qura", f(c.serviceKalenderHijriahUQ(L.d, L.mo, L.y))], ["Wujudul Hilal", f(c.serviceKalenderHijriahWH(L.d, L.mo, L.y))]]));
  });
})();
