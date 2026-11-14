/**
 * tab_rasydul.js — Tab "Rasydulqiblat":
 *  • harian   : setiap hari, jam saat Matahari tepat di arah kiblat / bayangan tongkat menuju kiblat di lokasi terpilih (RasydulHarian)
 *  • setahun  : grafik sebaran kedua peristiwa itu sepanjang tahun
 *  • tahunan  : rasydulqiblat global (Matahari di zenit Ka'bah) dan antipoda (nadir), serta rasydul Bulan — dari pustaka (ArahKiblat)
 */
(function () {
  const { $, card, fmtDT, fmtD, hms, dms } = UI;
  const p = UI.add({ id: "rasydul", label: "Rasydulqiblat", icon: "🧭" });
  p.innerHTML =
    "<div class='card'><h2>Rasydulqiblat</h2><div class='grid'>" +
    "<label>Arah kiblat (untuk harian)<select id='rqm'><option value='b'>Bola (spherical)</option><option value='e'>Koreksi elipsoid</option><option value='v'>Vincenty</option></select></label>" +
    "<label>Hari ditampilkan<select id='rqn'><option value='7'>7 hari</option><option value='15'>15 hari</option><option value='30'>30 hari</option></select></label>" +
    "<label>Tahun (grafik &amp; tahunan)<input id='rqt' type='number' step='1'></label>" +
    "<label>Jumlah tahun (tabel tahunan)<select id='rqk'><option value='1' selected>1 tahun</option><option value='3'>3 tahun</option><option value='5'>5 tahun</option><option value='10'>10 tahun</option></select></label></div></div>" +
    "<div id='rqd'></div><div id='rqs'></div><div id='rqy'></div>";

  const J = new JulianDay(), MON = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  const qibla = L => { const ak = new ArahKiblat(), m = $("rqm").value; return m === "v" ? ak.arahQiblaVincenty(L.lon, L.lat, "PtoQ") : m === "e" ? ak.arahQiblaWithEllipsoidCorrection(L.lon, L.lat) : ak.arahQiblatSpherical(L.lon, L.lat); };
  const cell = ev => ev.length ? ev.map(e => "<b>" + hms(e.jam) + "</b> <small>t " + e.tinggi.toFixed(1) + "°" + (e.tinggi > 85 ? " · dekat zenit (azimut kurang pasti)" : "") + "</small>").join("<br>") : "—";

  function harian(L, Q, R) {
    const N = +$("rqn").value || 7, rows = [];
    for (let i = 0; i < N; i++) {
      const t = new Date(Date.UTC(L.y, L.mo - 1, L.d + i)), ev = R.hari(t.getUTCDate(), t.getUTCMonth() + 1, t.getUTCFullYear(), L.lat, L.lon, L.tz, Q);
      rows.push("<tr><td class='num'>" + fmtD(J.kmjd(t.getUTCDate(), t.getUTCMonth() + 1, t.getUTCFullYear(), 12, L.tz), L.tz) + "</td><td>" + cell(ev.filter(e => e.jenis === 1)) + "</td><td>" + cell(ev.filter(e => e.jenis === 0)) + "</td></tr>");
    }
    $("rqd").innerHTML = card("Rasydulqiblat harian <small>(arah kiblat " + dms(Q) + ", zona " + L.tz + ")</small>",
      "<table><tr><th>Tanggal</th><th>Bayangan tongkat tegak menuju kiblat<br><small>azimut Matahari " + dms((Q + 180) % 360) + "</small></th><th>Matahari tepat di arah kiblat<br><small>azimut Matahari " + dms(Q) + "</small></th></tr>" + rows.join("") + "</table>",
      "Tegakkan tongkat/benang berbandul di tanah datar pada jam yang tertera: pada kolom pertama bayangannya menunjuk ke arah kiblat; pada kolom kedua Matahari berada di arah kiblat sehingga bayangan menunjuk ke arah sebaliknya. “t” = tinggi Matahari (tanpa refraksi); “—” = pada hari itu azimut tersebut tidak tercapai saat Matahari di atas ufuk. Tinggi 10°–60° paling mudah diukur.");
  }

  function setahun(L, Q, R, y) {
    const pts = []; const hari0 = Date.UTC(y, 0, 1), nd = (Date.UTC(y + 1, 0, 1) - hari0) / 864e5;
    for (let i = 0; i < nd; i++) {
      const t = new Date(hari0 + i * 864e5);
      R.hari(t.getUTCDate(), t.getUTCMonth() + 1, y, L.lat, L.lon, L.tz, Q).forEach(e => {
        if (e.tinggi > 0 && e.jam >= 0 && e.jam < 24) pts.push({ x: i + 1, y: e.jam, c: e.jenis === 1 ? 0 : 1, tip: t.getUTCDate() + "/" + (t.getUTCMonth() + 1) + " " + hms(e.jam) + " (tinggi " + e.tinggi.toFixed(1) + "°)" + (e.jenis === 1 ? " bayangan→kiblat" : " Matahari di kiblat") });
      });
    }
    const ys = pts.map(q => q.y), y0 = ys.length ? Math.max(0, Math.floor(Math.min(...ys)) - 1) : 5, y1 = ys.length ? Math.min(24, Math.ceil(Math.max(...ys)) + 1) : 19;
    const xt = []; for (let m = 0; m < 12; m++) xt.push({ x: (Date.UTC(y, m, 1) - hari0) / 864e5 + 1, label: MON[m] });
    const leg = "<span style='color:var(--ac)'>●</span> bayangan menuju kiblat &nbsp; <span style='color:var(--bad)'>●</span> Matahari tepat di arah kiblat";
    $("rqs").innerHTML = card("Sepanjang tahun " + y + " <small>" + leg + "</small>", pts.length ? Charts.scatter({ x0: 1, x1: nd, y0, y1, points: pts, xticks: xt, title: "Jam rasydulqiblat harian sepanjang tahun" }) : "<p class='note'>Tidak ada peristiwa pada tahun ini di lokasi ini.</p>",
      "Tiap titik = satu hari (jam zona " + L.tz + "). Kurva yang terputus menunjukkan musim saat Matahari tidak mencapai azimut tersebut.");
  }

  function tahunan(L, R, y0) {
    const ak = new ArahKiblat(), n = +$("rqk").value || 1, rows = [];
    const one = e => { const a = R.sunAltAz(e.jd, L.lat, L.lon); return "<b>" + fmtDT(e.jd, L.tz, true) + "</b><br><small>Makkah " + fmtDT(e.jd, 3, true).split(" ")[1] + " · " + (a.tinggi > 0 ? "☀ di lokasi Anda t " + a.tinggi.toFixed(1) + "°" : "🌙 Matahari di bawah ufuk") + "</small>"; };
    for (let y = y0; y < y0 + n; y++) rows.push("<tr><td><b>" + y + "</b></td><td>" + one(ak.rashdulQiblat(y, L.tz, 1)) + "</td><td>" + one(ak.rashdulQiblat(y, L.tz, 2)) + "</td><td>" + one(ak.antipodaKabah(y, L.tz, 1)) + "</td><td>" + one(ak.antipodaKabah(y, L.tz, 2)) + "</td></tr>");
    let bulan = "";
    try {
      const ev = ak.rashdulQiblatBulan(y0, L.tz);
      bulan = card("Rasydulqiblat Bulan <small>(" + y0 + ")</small>", "<table><tr><th>#</th><th>Waktu (zona " + L.tz + ")</th><th>Tinggi Bulan di Ka'bah</th><th>Deklinasi Bulan</th></tr>" + ev.map((e, i) => "<tr><td>" + (i + 1) + "</td><td class='num'>" + fmtDT(e.jd, L.tz, true) + "</td><td class='num'>" + e.tinggi.toFixed(2) + "°</td><td class='num'>" + dms(e.deklinasi) + "</td></tr>").join("") + "</table>",
        "Saat Bulan melintas hampir tepat di atas Ka'bah. Pada malam itu bayangan benda tegak (dengan cahaya Bulan) menuju kiblat bagi pengamat yang Bulannya di atas ufuk.");
    } catch (e) { bulan = ""; }
    $("rqy").innerHTML = card("Rasydulqiblat &amp; antipoda tahunan <small>(" + y0 + (n > 1 ? "–" + (y0 + n - 1) : "") + ")</small>",
      "<table><tr><th>Tahun</th><th>Rasydul 1<br><small>Matahari di zenit Ka'bah</small></th><th>Rasydul 2<br><small>Matahari di zenit Ka'bah</small></th><th>Antipoda 1<br><small>Matahari di nadir Ka'bah</small></th><th>Antipoda 2<br><small>Matahari di nadir Ka'bah</small></th></tr>" + rows.join("") + "</table>",
      "Rasydul 1 sekitar 27/28 Mei dan Rasydul 2 sekitar 15/16 Juli: Matahari tepat di atas Ka'bah (≈12:18 dan 12:27 waktu Makkah), sehingga bayangan benda tegak di seluruh wilayah yang sedang siang menunjuk ke Ka'bah. Antipoda: Matahari tepat di bawah Ka'bah, bayangan menunjuk menjauhi Ka'bah. Perhitungan pustaka asli (deklinasi Matahari = lintang Ka'bah).") + bulan;
  }

  let lastY = null;
  function draw() {
    const L = UI.L(), R = new RasydulHarian(), Q = qibla(L);
    if (L.y !== lastY || !$("rqt").value) { $("rqt").value = L.y; lastY = L.y; }
    const y0 = +$("rqt").value || L.y;
    harian(L, Q, R); setahun(L, Q, R, y0); tahunan(L, R, y0);
  }
  ["rqm", "rqn", "rqt", "rqk"].forEach(id => { $(id).onchange = draw; });
  UI.onRender("rasydul", draw);
})();
