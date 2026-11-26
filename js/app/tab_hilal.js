/**
 * tab_hilal.js — Tab "Hijriah & Hilal" (tanggal Hijriah + hisab awal bulan) dan tab "Peta Hilal" (visibilitas hilal dunia).
 * Memakai HisabAwalBulanService dan PetaVisibilitasService (js/services/), membaca lokasi dari formulir utama.
 */
(function () {
  const $ = id => document.getElementById(id);
  const BULAN = ["Al-Muharram","Shafar","Rabiul Awwal","Rabiul Akhir","Jumadal Ula","Jumadal Akhirah","Rajab","Syaban","Ramadhan","Syawwal","Zulqadah","Zulhijjah"];
  const P1 = UI.add({ id: "hijriah", label: "Hijriah & Hilal", icon: "🌙" }), P2 = UI.add({ id: "peta", label: "Peta Hilal", icon: "🗺️" });
  P1.innerHTML = "<div id='hcal'></div>" +
    "<div class='card'><h2>Perbandingan kalender Hijriah &amp; Jawa</h2><p class='note'>Satu bulan Hijriah penuh, dari tanggal 1 variasi paling awal sampai akhir bulan variasi paling akhir, berdasarkan tanggal terpilih.</p>" +
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
  const KAL_NAMA = ["MABIMS", "Ummul Qura", "Wujudul Hilal", "KHGT (Turki)", "Aritmetis I", "Aritmetis II", "Aritmetis III", "Aritmetis IV", "Mataraman"];
  const BULAN_JAWA = ["Sura","Sapar","Mulud","Bakda Mulud","Jumadilawal","Jumadilakir","Rejeb","Ruwah","Pasa","Sawal","Dulkangidah","Besar"];
  const HARI = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];                 // indeks = CJDN mod 7
  const cjdnOf = (d, m, y) => Math.floor(new JulianDay().kmjd(d, m, y) + 0.5);
  const masehi = c => { const dt = new Date((c - 2440588) * 864e5); return { d: dt.getUTCDate(), m: dt.getUTCMonth() + 1, y: dt.getUTCFullYear() }; };
  function tglDariTabel(tb, c) {              // tb: awal bulan hisab [{c, m, y}] terurut; null bila di luar cakupan
    let k = -1; for (let i = 0; i < tb.length; i++) if (tb[i].c <= c) k = i; else break;
    if (k < 0 || k === tb.length - 1) return null;
    return { d: c - tb[k].c + 1, m: tb[k].m, y: tb[k].y };
  }
  /** Hukum puasa pada satu hari: {k: "wajib"|"sunah"|"makruh"|"haram"|"", t: keterangan}. */
  function hukumPuasa(x, hari, panjangBln) {
    const d = x.d, m = x.m, sunah = [], haram = [];
    if (m === 10 && d === 1) haram.push("Idulfitri");
    if (m === 12 && d === 10) haram.push("Iduladha");
    if (m === 12 && d >= 11 && d <= 13) haram.push("Hari Tasyrik");
    if (haram.length) return { k: "haram", t: "Haram: " + haram.join(", ") };
    if (m === 9) return { k: "wajib", t: "Puasa wajib Ramadan" };
    if (m === 8 && panjangBln && d >= 16) return { k: "makruh", t: d === panjangBln ? "Makruh: Hari Syak (akhir Syaban)" : "Makruh: puasa setelah pertengahan Syaban" };
    if (hari === 0) sunah.push("Senin"); if (hari === 3) sunah.push("Kamis");
    if (d >= 13 && d <= 15) sunah.push("Ayyamulbid");
    if (m === 1 && d === 9) sunah.push("Tasua"); if (m === 1 && d === 10) sunah.push("Asyura");
    if (m === 10 && d >= 2 && d <= 7) sunah.push("Syawal");
    if (m === 12 && d >= 1 && d <= 7) sunah.push("Awal Zulhijah");
    if (m === 12 && d === 8) sunah.push("Tarwiah"); if (m === 12 && d === 9) sunah.push("Arafah");
    if (sunah.length) return { k: "sunah", t: "Sunah: " + sunah.join(", ") };
    if (hari === 4) return { k: "makruh", t: "Makruh: Jumat" };
    return { k: "", t: "" };
  }
  const WARNA_PS = { wajib: ["#3b82d6", "#fff"], sunah: ["#46b36b", "#fff"], makruh: ["#f2c744", "#222"], haram: ["#d9534f", "#fff"] };
  function hitungBanding() {
    const L = UI.L(), jdn = new JulianDay(), cal = new CalendarService(), c0 = cjdnOf(L.d, L.mo, L.y);
    const W0 = c0 - 75, W1 = c0 + 75, ar = (c, l, o) => jdn.cjdnkh(c, { hCalE: 2, hCalL: l, optResult: o });
    // bulan-bulan Hijriah yang perlu dihisab (jendela ± margin), cukup perkiraan dari Aritmetis II
    let k0 = 1e9, k1 = -1e9;
    for (let c = W0 - 35; c <= W1 + 35; c += 10) { const k = ar(c, 2, "THNH") * 12 + ar(c, 2, "BLNH") - 1; k0 = Math.min(k0, k); k1 = Math.max(k1, k); }
    const fns = [cal.abqMabims, cal.abqUmmulQura, cal.abqWujudulHilal, cal.abqTurki].map(f => f.bind(cal)), tbl = fns.map(f => {
      const t = []; for (let k = k0 - 1; k <= k1 + 1; k++) { const m = k % 12 + 1, y = Math.floor(k / 12); t.push({ c: Math.floor(f(m, y) + 0.5), m, y }); }
      return t.sort((a, b) => a.c - b.c);
    });
    const cs = []; for (let c = W0; c <= W1; c++) cs.push(c);
    const peta = [0, 1, 2, 3].map(i => cs.map(c => tglDariTabel(tbl[i], c)));
    [1, 2, 3, 4].forEach(l => peta.push(cs.map(c => ({ d: ar(c, l, "TGLH"), m: ar(c, l, "BLNH"), y: ar(c, l, "THNH") }))));
    peta.push(cs.map(c => { const j = jd2jawa(c - 0.5); return { d: j.tanggalJawa, m: j.bulanJawa, y: j.tahunJawa }; }));
    // bulan acuan = bulan yang paling banyak dipilih variasi pada tanggal terpilih
    const ci = c0 - W0, cnt = {}; peta.forEach(r => { const m = r[ci] && r[ci].m; if (m) cnt[m] = (cnt[m] || 0) + 1; });
    const mT = +Object.keys(cnt).sort((a, b) => cnt[b] - cnt[a])[0];
    // rentang: tanggal 1 paling awal … akhir bulan paling akhir (run bulan mT yang terdekat dengan tanggal terpilih)
    let cA = 1e9, cB = -1e9;
    peta.forEach(r => {
      let best = null, i = 0;
      while (i < r.length) {
        if (r[i] && r[i].m === mT) { let j = i; while (j + 1 < r.length && r[j + 1] && r[j + 1].m === mT && r[j + 1].y === r[i].y) j++;
          const dist = ci < i ? i - ci : ci > j ? ci - j : 0; if (!best || dist < best.dist) best = { i, j, dist }; i = j + 1; } else i++;
      }
      if (best) { cA = Math.min(cA, cs[best.i]); cB = Math.max(cB, cs[best.j]); }
    });
    const panjang = peta.map(r => { const o = {}; r.forEach(x => { if (x) { const k = x.y * 12 + x.m; o[k] = Math.max(o[k] || 0, x.d); } }); return o; });
    let h = "<table class='kcal'><thead><tr><th>Kalender</th>";
    for (let c = cA; c <= cB; c++) { const t = masehi(c); h += "<th title='" + HARI[c % 7] + ", " + t.d + "/" + pad(t.m) + "/" + t.y + "'>" + t.d + "/" + pad(t.m) + "</th>"; }
    h += "</tr></thead><tbody>";
    peta.forEach((r, v) => {
      h += "<tr><th>" + KAL_NAMA[v] + "</th>";
      for (let c = cA; c <= cB; c++) {
        const x = r[c - W0], t = masehi(c);
        if (!x) { h += "<td>—</td>"; continue; }
        const hk = hukumPuasa(x, c % 7, panjang[v][x.y * 12 + x.m]), w = WARNA_PS[hk.k], jv = v === 8;
        const tip = HARI[c % 7] + ", " + t.d + "/" + pad(t.m) + "/" + t.y + " M = " + x.d + " " + (jv ? BULAN_JAWA : BULAN)[x.m - 1] + " " + x.y + (jv ? " J" : " H") + " (" + KAL_NAMA[v] + ")" + (hk.t ? " — " + hk.t : "");
        h += "<td title='" + tip + "' style='" + (w ? "background:" + w[0] + ";color:" + w[1] + ";" : "") + (x.d === 1 ? "font-weight:700;border-left:2px solid #333;" : "") + "'>" + x.d + "</td>";
      }
      h += "</tr>";
    });
    const lg = [["wajib", "Puasa wajib (Ramadan)"], ["sunah", "Puasa sunah"], ["makruh", "Makruh"], ["haram", "Haram"]].map(a => "<span style='display:inline-block;width:12px;height:12px;background:" + WARNA_PS[a[0]][0] + ";border-radius:2px;margin:0 4px -1px 0'></span>" + a[1]).join(" &nbsp; ");
    return "<p style='font-size:13px;margin:0 0 6px'><b>" + (BULAN[mT - 1]) + "</b> — " + lg + "</p><div style='overflow-x:auto'>" + h + "</tbody></table></div>" +
      "<p class='note'>Sorot (atau ketuk) sel untuk tanggal lengkap dan keterangan. Kolom: tanggal/bulan Masehi. Garis tebal di kiri sel = tanggal 1. Mataraman memakai nomor bulan Jawa (Sura = Muharram). Hisab (MABIMS, Ummul Qura, Wujudul Hilal, KHGT) memakai kriteria &amp; lokasi bawaan tiap kalender, bukan lokasi di formulir; Aritmetis I–IV = pola kabisat 1–4 (epoch Jumat).<br>" +
      "Prioritas: haram &gt; wajib &gt; makruh Syaban (16 s.d. akhir, termasuk Hari Syak) &gt; sunah (Senin, Kamis, Ayyamulbid 13–15, Tasua, Asyura, Syawal 2–7, Zulhijah 1–9) &gt; Jumat (makruh bila tidak bertepatan puasa sunah). Haram: 1 Syawal, 10–13 Zulhijah. Penilaian dilakukan per variasi dengan tanggalnya sendiri.</p>";
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
