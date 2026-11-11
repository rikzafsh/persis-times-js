/**
 * app_hisab.js — Antarmuka demo: hisab awal bulan Hijriah + peta visibilitas hilal.
 * Memakai HisabAwalBulanService dan PetaVisibilitasService (js/services/), membaca lokasi dari formulir utama.
 */
(function () {
  const $ = id => document.getElementById(id);
  const BULAN = ["Al-Muharram","Shafar","Rabiul Awwal","Rabiul Akhir","Jumadal Ula","Jumadal Akhirah","Rajab","Syaban","Ramadhan","Syawwal","Zulqadah","Zulhijjah"];
  const root = $("hisab");
  root.innerHTML =
    "<div class='card'><h2>Hisab awal bulan Hijriah &amp; visibilitas hilal</h2><div class='grid'>" +
    "<label>Bulan yang dihisab<select id='hb'></select></label>" +
    "<label>Tahun Hijriah<input id='ht' type='number' step='1'></label>" +
    "<label>Tambah hari (ke Magrib)<input id='hd' type='number' step='1' value='0'></label></div>" +
    "<button id='hgo'>Hisab awal bulan</button></div><div id='hout'></div>" +
    "<div class='card'><h2>Peta visibilitas hilal dunia <small>(kriteria Odeh)</small></h2><div class='grid'>" +
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
    const mode = $("mmode").value !== "0", my = ++token, step = +$("mres").value || 10, blnH = +$("hb").value, thnH = +$("ht").value, tbhHari = +$("hd").value || 0;
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
})();
