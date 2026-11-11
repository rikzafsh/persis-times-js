/** tab_tithi.js — Tab "Tithi": hari lunar (elongasi/12°) lengkap dengan jam mulai dan berakhirnya, dinilai pada saat Matahari terbit. */
(function () {
  const { $, card, fmtDT, fmtD, hm } = UI;
  const p = UI.add({ id: "tithi", label: "Tithi", icon: "🪔" });
  p.innerHTML = "<div id='tnow'></div><div class='card'><h2>Kalender tithi</h2><div class='grid'><label>Jumlah hari<select id='tn'><option value='7'>7 hari</option><option value='15'>15 hari</option><option value='30' selected>30 hari</option></select></label></div></div><div id='tout'></div>";
  const nama = (A, n) => A.tithiNama(n) + " · " + (n <= 15 ? "Shukla" : "Krishna");
  function sunriseJD(A, L, y, mo, d) {
    const s = new WaktuSalat().syuruk(d, mo, y, L.lon, L.lat, L.elev, L.tz);
    return A.jd.kmjd(d, mo, y, s.isNormal ? s.time : 6, L.tz);
  }
  function draw() {
    const L = UI.L(), A = new AstroEvents(), N = +$("tn").value || 30, out = [];
    for (let i = 0; i < N; i++) {
      const t = new Date(Date.UTC(L.y, L.mo - 1, L.d + i)), y = t.getUTCFullYear(), mo = t.getUTCMonth() + 1, d = t.getUTCDate();
      const sr = sunriseJD(A, L, y, mo, d), sp = A.tithiSpan(sr);
      out.push({ jd: sr, sp });
    }
    const first = out[0], pct = ((first.jd - first.sp.awal) / (first.sp.akhir - first.sp.awal) * 100);
    $("tnow").innerHTML = "<div class='card'><h2>Tithi pada " + fmtD(first.jd, L.tz) + " <small>(saat Matahari terbit " + fmtDT(first.jd, L.tz).split(" ")[1] + ")</small></h2><div class='big'>" + first.sp.n + " · " + A.tithiNama(first.sp.n) + " <span class='tag'>" + first.sp.paksha + " paksha</span></div>" +
      "<div class='bar'><i style='width:" + pct.toFixed(1) + "%'></i></div><span class='note'>Mulai " + fmtDT(first.sp.awal, L.tz, true) + " → <b>berakhir " + fmtDT(first.sp.akhir, L.tz, true) + "</b> (zona " + L.tz + ") · lama " + ((first.sp.akhir - first.sp.awal) * 24).toFixed(2) + " jam</span></div>";
    const rows = out.map((o, i) => {
      const n = o.sp.n, prev = i ? out[i - 1].sp.n : null, skip = prev && ((n - prev + 30) % 30) === 2 ? ((prev % 30) + 1) : null;
      const ulang = prev && n === prev;
      const em = n === 15 ? "🌕 " : n === 30 ? "🌑 " : "";
      return "<tr" + (n === 15 || n === 30 ? " class='hl'" : "") + "><td class='num'>" + fmtD(o.jd, L.tz) + "</td><td class='num'>" + fmtDT(o.jd, L.tz).split(" ")[1] + "</td><td>" + em + "<b>" + n + " · " + A.tithiNama(n) + "</b> <small>" + o.sp.paksha + "</small>" + (skip ? "<br><small class='tag warn'>tithi " + skip + " (" + A.tithiNama(skip) + ") terlewat — kṣaya</small>" : "") + (ulang ? "<br><small class='tag'>berlanjut dari hari sebelumnya — vṛddhi</small>" : "") + "</td><td class='num'>" + fmtDT(o.sp.awal, L.tz) + "</td><td class='num'><b>" + fmtDT(o.sp.akhir, L.tz) + "</b></td></tr>";
    }).join("");
    $("tout").innerHTML = card("Tithi saat Matahari terbit <small>(" + N + " hari)</small>", "<table><tr><th>Tanggal</th><th>Terbit</th><th>Tithi</th><th>Mulai</th><th>Berakhir</th></tr>" + rows + "</table>",
      "Tithi n berlangsung saat elongasi tampak Bulan–Matahari 12°·(n−1) → 12°·n. Hari bertithi ditentukan oleh tithi yang berlaku saat Matahari terbit. Purnima berakhir tepat di purnama, Amavasya di bulan baru.");
  }
  $("tn").onchange = draw;
  UI.onRender("tithi", draw);
})();
