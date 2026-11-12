/**
 * tab_tithi.js — Tab "Tithi & Pañcāṅga": lima aṅga (tithi, vāra, nakṣatra, yoga, karaṇa), māsa, śakavarṣa,
 * lagna-rāśi, dan muhūrta untuk tanggal terpilih, serta kalender beberapa hari. Dinilai pada saat Matahari terbit.
 * Memakai Panchanga (js/services/panchanga_service.js).
 */
(function () {
  const { $, card, fmtDT, fmtD } = UI;
  const p = UI.add({ id: "tithi", label: "Tithi & Pañcāṅga", icon: "🪔" });
  p.innerHTML = "<div id='pdet'></div><div class='card'><h2>Kalender Pañcāṅga</h2><div class='grid'><label>Jumlah hari<select id='tn'><option value='7' selected>7 hari</option><option value='15'>15 hari</option><option value='30'>30 hari (±4 dtk)</option></select></label></div></div><div id='tout'></div>";

  const hmOf = (jd, tz) => fmtDT(jd, tz).split(" ")[1];
  const dayOf = (jd, tz) => fmtDT(jd, tz).split(" ")[0];
  // jam berakhir: hanya jam bila hari sama dengan acuan, selain itu "d/mm jj:mm"
  const endAt = (jd, ref, tz) => { const d = dayOf(jd, tz); return d === dayOf(ref, tz) ? hmOf(jd, tz) : d.split("/").slice(0, 2).join("/") + " " + hmOf(jd, tz); };
  const hh = d => { const m = Math.round(d * 1440); return Math.floor(m / 60) + " j " + (m % 60) + " m"; };

  function sun(L, y, mo, d) {                                  // JD terbit & terbenam hari y-mo-d (lokal)
    const ws = new WaktuSalat(), a = ws.syuruk(d, mo, y, L.lon, L.lat, L.elev, L.tz), b = ws.magrib(d, mo, y, L.lon, L.lat, L.elev, L.tz), J = new JulianDay();
    return [J.kmjd(d, mo, y, a.isNormal ? a.time : 6, L.tz), J.kmjd(d, mo, y, b.isNormal ? b.time : 18, L.tz)];
  }
  function draw() {
    const L = UI.L(), A = new AstroEvents(), P = new Panchanga(A), tz = L.tz, N = +$("tn").value || 7;
    const day = i => { const t = new Date(Date.UTC(L.y, L.mo - 1, L.d + i)); return [t.getUTCFullYear(), t.getUTCMonth() + 1, t.getUTCDate(), t.getUTCDay()]; };

    // ── 1. Detail hari terpilih ──
    const [y0, m0, d0, w0] = day(0), [y1, m1, d1] = day(1);
    const [sr, ss] = sun(L, y0, m0, d0), [sr2] = sun(L, y1, m1, d1);
    const T = P.tithi(sr), K = P.nakshatra(sr), Y = P.yoga(sr), R = P.karana(sr), M = P.masa(sr);
    const nx = (s, f) => { const q = f.call(P, s.akhir + 1e-4); return q.nama + " <small>→ " + endAt(q.akhir, sr, tz) + "</small>"; };
    const baris = (a, now, s, nxt) => "<tr><td><b>" + a + "</b></td><td>" + now + "</td><td class='num'><b>" + endAt(s.akhir, sr, tz) + "</b></td><td>" + nxt + "</td></tr>";
    const aksi = "<table><tr><th>Aṅga</th><th>Saat terbit</th><th>Berakhir</th><th>Berikutnya</th></tr>" +
      baris("Tithi", T.n + " · " + T.nama + " <span class='tag'>" + T.paksha + "</span>", T, nx(T, P.tithi)) +
      "<tr><td><b>Vāra</b></td><td>" + PN.VARA[w0] + "</td><td class='num'>—</td><td>" + PN.VARA[(w0 + 1) % 7] + "</td></tr>" +
      baris("Nakṣatra", K.n + " · " + K.nama + " <small>pada " + K.pada + "</small>", K, nx(K, P.nakshatra)) +
      baris("Yoga", Y.n + " · " + Y.nama, Y, nx(Y, P.yoga)) +
      baris("Karaṇa", R.nama, R, nx(R, P.karana)) + "</table>";
    const sSun = Math.floor(P.sidSun(sr) / 30), sMoon = Math.floor(P.sidMoon(sr) / 30);
    const masaRows = "<table class='kv'><tr><td>Māsa (amānta)</td><td>" + M.nama + (M.adhika ? " <span class='tag warn'>Adhika</span>" : "") + "</td></tr>" +
      "<tr><td>Māsa (pūrṇimānta)</td><td>" + M.namaPurnimanta + "</td></tr><tr><td>Pakṣa</td><td>" + T.paksha + "</td></tr>" +
      "<tr><td>Śakavarṣa</td><td>" + P.sakaYear(M.idx, m0, y0) + "</td></tr><tr><td>Sūrya-rāśi (sidereal)</td><td>" + PN.RASI[sSun] + "</td></tr>" +
      "<tr><td>Candra-rāśi (sidereal)</td><td>" + PN.RASI[sMoon] + "</td></tr>" +
      "<tr><td>Bulan lunar</td><td class='num'>" + fmtDT(M.awal, tz) + " → " + fmtDT(M.akhir, tz) + "</td></tr><tr><td>Ayanāṃśa Lahiri</td><td class='num'>" + P.ayanamsa(sr).toFixed(4) + "°</td></tr></table>";
    const lg = P.lagnaSpans(sr, L.lat, L.lon, 24), l0 = P.lagna(sr, L.lat, L.lon);
    const lagnaTbl = "<table><tr><th>Lagna-rāśi</th><th>Mulai</th><th>Berakhir</th><th>Lama</th></tr>" + lg.map(x => "<tr" + (x.awal <= sr && sr < x.akhir ? " class='hl'" : "") + "><td><b>" + x.nama + "</b></td><td class='num'>" + endAt(x.awal, sr, tz) + "</td><td class='num'>" + endAt(x.akhir, sr, tz) + "</td><td class='num'>" + hh(x.akhir - x.awal) + "</td></tr>").join("") + "</table>";
    const mh = P.muhurta(sr, ss, sr2, w0), per = (n, a, tag, cls) => "<tr><td><b>" + n + "</b> " + (tag ? "<span class='tag " + (cls || "") + "'>" + tag + "</span>" : "") + "</td><td class='num'>" + hmOf(a.awal, tz) + " – " + hmOf(a.akhir, tz) + "</td></tr>";
    const muhTbl = "<table class='kv'>" + per("Brahma muhūrta", mh.brahma, "baik") + per("Abhijit muhūrta", mh.abhijit, mh.abhijit.catatan ? "Rabu: dihindari" : "baik", mh.abhijit.catatan ? "warn" : "") +
      per("Rāhu kāla", mh.rahu, "hindari", "warn") + per("Yamagaṇḍa", mh.yamaganda, "hindari", "warn") + per("Gulika kāla", mh.gulika, "hindari", "warn") + "</table>";
    const m30 = (t, a) => "<table><tr><th>" + t + "</th><th>Waktu</th></tr>" + a.map((x, i) => "<tr><td>" + (i + 1) + ". " + x.nama + "</td><td class='num'>" + hmOf(x.awal, tz) + " – " + hmOf(x.akhir, tz) + "</td></tr>").join("") + "</table>";
    $("pdet").innerHTML =
      "<div class='card'><h2>Pañcāṅga " + fmtD(sr, tz) + " <small>(terbit " + hmOf(sr, tz) + ", terbenam " + hmOf(ss, tz) + ", zona " + tz + ")</small></h2><div class='wrap'>" + aksi + "</div><p class='note'>Aṅga dinilai pada saat Matahari terbit. Lama tithi ini " + hh(T.akhir - T.awal) + "; mulai " + fmtDT(T.awal, tz, true) + ", berakhir <b>" + fmtDT(T.akhir, tz, true) + "</b>.</p></div>" +
      card("Māsa, Śakavarṣa &amp; rāśi", masaRows, "Māsa amānta: bulan lunar bulan-baru ke bulan-baru, bernama menurut rāśi sidereal Matahari saat bulan baru; tanpa saṅkrānti di dalamnya = adhika.") +
      card("Lagna-rāśi <small>(ascendant sidereal, saat terbit: <b>" + l0.nama + "</b>)</small>", lagnaTbl, "Rāśi yang sedang terbit di ufuk timur, dihitung untuk lintang/bujur terpilih selama 24 jam sejak Matahari terbit.") +
      card("Muhūrta", muhTbl + "<details style='margin-top:10px'><summary>30 muhūrta (siang " + hh(mh.lamaSiang / 24) + ", malam " + hh(mh.lamaMalam / 24) + ")</summary><div class='grid'><div>" + m30("Siang (15)", mh.siang) + "</div><div>" + m30("Malam (15)", mh.malam) + "</div></div></details>",
        "Bagian siang 1/8 untuk Rāhu/Yamagaṇḍa/Gulika menurut hari (tradisi India Selatan); Brahma muhūrta = 96–48 menit sebelum terbit.");

    // ── 2. Kalender N hari ──
    const rows = []; let prev = null;
    for (let i = 0; i < N; i++) {
      const [y, mo, d, w] = day(i), [s] = i ? sun(L, y, mo, d) : [sr];
      const t = i ? P.tithi(s) : T, k = i ? P.nakshatra(s) : K, yg = i ? P.yoga(s) : Y, r = i ? P.karana(s) : R, ms = i ? P.masa(s) : M;
      const skip = prev && ((t.n - prev + 30) % 30) === 2 ? (prev % 30) + 1 : null, ulang = prev && t.n === prev; prev = t.n;
      const em = t.n === 15 ? "🌕 " : t.n === 30 ? "🌑 " : "", ek = x => "<br><small>→ " + endAt(x.akhir, s, tz) + "</small>";
      rows.push("<tr" + (t.n === 15 || t.n === 30 ? " class='hl'" : "") + "><td class='num'>" + fmtD(s, tz) + "<br><small>" + PN.VARA[w] + " · " + hmOf(s, tz) + "</small></td>" +
        "<td>" + em + "<b>" + t.n + " · " + t.nama + "</b> <small>" + t.paksha + "</small>" + ek(t) + (skip ? "<br><small class='tag warn'>tithi " + skip + " terlewat (kṣaya)</small>" : "") + (ulang ? "<br><small class='tag'>vṛddhi</small>" : "") + "</td>" +
        "<td>" + k.nama + " <small>p" + k.pada + "</small>" + ek(k) + "</td><td>" + yg.nama + ek(yg) + "</td><td>" + r.nama + ek(r) + "</td>" +
        "<td>" + ms.nama + (ms.adhika ? " <small class='tag warn'>adhika</small>" : "") + "<br><small>Śaka " + P.sakaYear(ms.idx, mo, y) + "</small></td></tr>");
    }
    $("tout").innerHTML = card("Pañcāṅga harian <small>(" + N + " hari, saat Matahari terbit)</small>", "<table><tr><th>Tanggal</th><th>Tithi</th><th>Nakṣatra</th><th>Yoga</th><th>Karaṇa</th><th>Māsa</th></tr>" + rows.join("") + "</table>",
      "“→” = jam berakhir (zona " + tz + "; ditambah tanggal bila bukan hari yang sama). Purnima berakhir tepat saat purnama, Amāvāsyā saat bulan baru. Zodiak sidereal: ayanāṃśa Lahiri.");
  }
  $("tn").onchange = draw;
  UI.onRender("tithi", draw);
})();
