/** tab_musim.js — Tab "Musim": solstis dan ekuinoks (bujur tampak Matahari 0°, 90°, 180°, 270°), lama tiap musim. */
(function () {
  const { $, card, fmtDT, fmtD } = UI;
  const p = UI.add({ id: "musim", label: "Solstis & Ekuinoks", icon: "🌍" });
  p.innerHTML = "<div class='card'><h2>Solstis &amp; Ekuinoks</h2><div class='grid'><label>Tahun (Masehi)<input id='sy' type='number' step='1'></label></div></div><div id='sout'></div>";
  const KET = ["Matahari melintasi ekuator ke utara · siang = malam", "Matahari di titik terjauh utara (titik balik utara)", "Matahari melintasi ekuator ke selatan · siang = malam", "Matahari di titik terjauh selatan (titik balik selatan)"];
  let lastY = null;
  function draw() {
    const L = UI.L(), A = new AstroEvents(), y = +$("sy").value || L.y, s = A.seasons(y), next = A.seasons(y + 1)[0];
    const body = "<table><tr><th>Peristiwa</th><th>Waktu lokal (zona " + L.tz + ")</th><th>UT</th><th>Deklinasi</th><th>Lama musim</th></tr>" + s.map((e, i) => {
      const n = i < 3 ? s[i + 1] : next, dT = A.dt.deltaT(e.jd), dc = A.sn.sunGeocentricDeclination(e.jd, dT);
      return "<tr><td><b>" + e.nama + "</b><br><small>" + KET[i] + "</small></td><td class='num'>" + fmtD(e.jd, L.tz) + "<br><b>" + fmtDT(e.jd, L.tz, true).split(" ")[1] + "</b></td><td class='num'>" + fmtDT(e.jd, 0, true) + "</td><td class='num'>" + dc.toFixed(3) + "°</td><td class='num'>" + (n.jd - e.jd).toFixed(2) + " hari</td></tr>";
    }).join("") + "</table>";
    $("sout").innerHTML = card("Tahun " + y, body, "“Lama musim” = selisih ke peristiwa berikutnya (bukan sama panjang karena orbit Bumi elips). Nama peristiwa mengikuti belahan utara.");
  }
  $("sy").onchange = draw;
  UI.onRender("musim", () => { const y = UI.L().y; if (y !== lastY) { $("sy").value = y; lastY = y; } draw(); });
})();
