/** tab_fase.js — Tab "Fase Bulan": Bulan baru, kuartal pertama, purnama, kuartal terakhir sepanjang tahun, lengkap dengan jam tepatnya. */
(function () {
  const { $, card, fmtDT, fmtD } = UI;
  const p = UI.add({ id: "fase", label: "Fase Bulan", icon: "🌓" });
  p.innerHTML = "<div class='card'><h2>Fase Bulan</h2><div class='grid'><label>Tahun (Masehi)<input id='fy' type='number' step='1'></label></div></div><div id='fout'></div>";
  const EMOJI = ["🌑", "🌓", "🌕", "🌗"];
  let lastY = null;
  function draw() {
    const L = UI.L(), A = new AstroEvents(), y = +$("fy").value || L.y;
    const ref = A.jd.kmjd(L.d, L.mo, L.y, 12, L.tz), ms = A.moonState(ref), [em, nm] = UI.faseNama(ms.elongasi);
    const list = A.phasesBetween(A.jd.kmjd(1, 1, y, 0, L.tz), A.jd.kmjd(1, 1, y + 1, 0, L.tz));
    const nxt = list.findIndex(x => x.jd >= ref);
    const body = "<table><tr><th>Tanggal</th><th>Fase</th><th>Jam lokal (zona " + L.tz + ")</th><th>UT</th></tr>" + list.map((f, i) =>
      "<tr" + (i === nxt ? " class='hl'" : "") + "><td class='num'>" + fmtD(f.jd, L.tz) + "</td><td>" + EMOJI[f.fase] + " " + f.nama + (i === nxt ? " <span class='tag'>berikutnya</span>" : "") + "</td><td class='num'><b>" + fmtDT(f.jd, L.tz, true).split(" ")[1] + "</b></td><td class='num'>" + fmtDT(f.jd, 0, true).split(" ")[1] + "</td></tr>").join("") + "</table>";
    $("fout").innerHTML =
      "<div class='card'><h2>Bulan pada tanggal terpilih</h2><div class='big'>" + em + " " + nm + "</div><div class='bar'><i style='width:" + Math.min(100, ms.iluminasi).toFixed(1) + "%'></i></div><span class='note'>Iluminasi " + ms.iluminasi.toFixed(1) + " % · umur " + ms.umur.toFixed(2) + " hari · elongasi " + ms.elongasi.toFixed(1) + "°</span></div>" +
      card("Fase tahun " + y + " <small>(" + list.length + " fase)</small>", body, "Waktu dari saat elongasi tampak Bulan–Matahari tepat 0°, 90°, 180°, 270° (ELPMPP02 + VSOP87D, ΔT otomatis). Ketelitian ± beberapa detik.");
  }
  $("fy").onchange = draw;
  UI.onRender("fase", () => { const y = UI.L().y; if (y !== lastY) { $("fy").value = y; lastY = y; } draw(); });
})();
