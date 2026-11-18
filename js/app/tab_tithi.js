/**
 * tab_tithi.js — Tab "Tiŧi & Pañcāṅga": aṅga (tiŧi, nakṣatꭉa, yoga, karaṇa, wāra + pawukon), māsa, šakawar̀ṣa,
 * lagna-rāšī, dan muhūr̀tta untuk tanggal terpilih (ejaan nama menurut daftar PN di panchanga_service.js), serta kalender beberapa hari. Dinilai pada saat Matahari terbit.
 * Memakai Panchanga (js/services/panchanga_service.js).
 */
(function () {
  const { $, card, fmtDT, fmtD } = UI;
  const p = UI.add({ id: "tithi", label: "Tiŧi & Pañcāṅga", icon: "🪔" });
  p.innerHTML = "<div class='card'><h2>Grafik harian 24 jam <small>(terbit → terbit berikutnya)</small></h2><div class='grid'><label>Rincian<select id='pgm'><option value='muhurta' selected>Pañcāṅga + lagna-rāšī + 30 muhūr̀tta 15×2 (tanpa waktu baik)</option><option value='panca'>Pañcāṅga saja</option><option value='lengkap'>Lengkap (+ lagna, caughaḍiyā, kāla, muhūrta baik)</option></select></label><label>Sumbu jam<select id='pgf'><option value='24' selected>24 jam</option><option value='12'>12 jam</option></select></label></div><div id='pgout' style='margin-top:12px'></div></div><div id='pdet'></div><div class='card'><h2>Kalender Pañcāṅga</h2><div class='grid'><label>Jumlah hari<select id='tn'><option value='7' selected>7 hari</option><option value='15'>15 hari</option><option value='30'>30 hari (±4 dtk)</option></select></label></div></div><div id='tout'></div>";

  const hmOf = (jd, tz) => fmtDT(jd, tz).split(" ")[1];
  const dayOf = (jd, tz) => fmtDT(jd, tz).split(" ")[0];
  // jam berakhir: hanya jam bila hari sama dengan acuan, selain itu "d/mm jj:mm"
  const endAt = (jd, ref, tz) => { const d = dayOf(jd, tz); return d === dayOf(ref, tz) ? hmOf(jd, tz) : d.split("/").slice(0, 2).join("/") + " " + hmOf(jd, tz); };
  const hh = d => { const m = Math.round(d * 1440); return Math.floor(m / 60) + " j " + (m % 60) + " m"; };

  function sun(L, y, mo, d) {                                  // JD terbit & terbenam hari y-mo-d (lokal)
    const ws = new WaktuSalat(), a = ws.syuruk(d, mo, y, L.lon, L.lat, L.elev, L.tz), b = ws.magrib(d, mo, y, L.lon, L.lat, L.elev, L.tz), J = new JulianDay();
    return [J.kmjd(d, mo, y, a.isNormal ? a.time : 6, L.tz), J.kmjd(d, mo, y, b.isNormal ? b.time : 18, L.tz)];
  }

  // ── grafik harian 24 jam (blok berwarna per unsur) ──
  const WARNA = { tithi: ["#3b6fd1", "#5b8def"], naks: ["#7b4fc9", "#9a73e0"], yoga: ["#0e8f8f", "#25b3b0"], karana: ["#c4691a", "#dd8730"], vara: ["#a0522d"], lagna: ["#b83b7a", "#d65f9b"], mSiang: ["#a87c0a", "#c29a1a"], mMalam: ["#454a96", "#646ab8"] };
  function grafikHarian(L, P, sr, ss, sr2, w0, mh, pw) {
    const tz = L.tz, h12 = $("pgf").value === "12", mode = $("pgm").value || "muhurta", denganLagna = mode !== "panca";
    const hm = jd => { const t = fmtDT(jd, tz).split(" ")[1]; if (!h12) return t; const [h, m] = t.split(":").map(Number); return String((h % 12) || 12).padStart(2, "0") + ":" + String(m).padStart(2, "0"); };
    const rentang = s => fmtDT(s.awalAsli, tz, true) + " → " + fmtDT(s.akhirAsli, tz, true);
    const el = (kunci, nama) => P.rangkaian(kunci, sr, sr2).map(s => ({ ...s, a: s.awal, b: s.akhir, nama: nama(s), tip: nama(s) + "\n" + rentang(s) }));
    const tithi = el("tithi", s => s.nama + ", " + s.paksha).map(s => ({ ...s, short: s.nama })), naks = el("nakshatra", s => s.nama), yoga = el("yoga", s => s.nama), karana = el("karana", s => s.nama);
    naks.forEach(s => { s.tip += "\npada " + s.pada + "\ndewata: " + PN.DEWATA[s.idx % 27] + "\nmaṇḍala: " + PN.MANDALA[s.idx % 27]; });
    const rows = [{ label: "tiŧi", type: "seg", warna: WARNA.tithi, items: tithi }, { label: "nakṣatꭉa", type: "seg", warna: WARNA.naks, items: naks }, { label: "yoga", type: "seg", warna: WARNA.yoga, items: yoga },
      { label: "karaṇa", type: "seg", warna: WARNA.karana, items: karana }, { label: "wāra", type: "vara", warna: WARNA.vara, nama: [pw.sadwara, pw.pancawara, pw.saptawara, "wuku " + pw.wuku].join(" · "),
        tip: "Sadwāra: " + pw.sadwara + "\nPañcawāra: " + pw.pancawara + "\nSaptawāra: " + pw.saptawara + "\nWuku: " + pw.wuku + " (ke-" + pw.noWuku + " dari 30, hari ke-" + (pw.hariKe + 1) + " dari 210)" }];
    let lagna = [], m30 = [];
    if (denganLagna) {
      lagna = P.lagnaSpans(sr, L.lat, L.lon, (sr2 - sr) * 24).map(x => ({ ...x, awalAsli: x.awal, akhirAsli: x.akhir, a: Math.max(x.awal, sr), b: Math.min(x.akhir, sr2) })).filter(x => x.b > x.a).map(x => ({ ...x, tip: x.nama + "\n" + rentang(x) }));
      rows.push({ label: "lagna-rāšī", type: "seg", warna: WARNA.lagna, items: lagna });
    }
    if (mode === "muhurta") {                                       // 30 muhūrta: 15 siang + 15 malam, tanpa penanda waktu baik/buruk
      m30 = [...mh.siang.map((x, i) => ({ ...x, malam: false, no: i + 1 })), ...mh.malam.map((x, i) => ({ ...x, malam: true, no: i + 1 }))];
      rows.push({ label: "muhūr̀tta", type: "vbar", items: m30.map((x, i) => ({ a: x.awal, b: x.akhir, nama: x.nama, warna: (x.malam ? WARNA.mMalam : WARNA.mSiang)[x.no % 2], tip: x.no + ". " + x.nama + " (" + (x.malam ? "malam" : "siang") + ")\n" + fmtDT(x.awal, tz, true) + " → " + fmtDT(x.akhir, tz, true) })) });
    }
    if (mode === "lengkap") {
      const caug = P.caughadiya(sr, ss, sr2, w0), Q = { baik: "#2e9e5b", netral: "#7b8794", buruk: "#c0392b" };
      const ctip = c => c.nama + " (" + (c.malam ? "malam" : "siang") + ", " + c.kualitas + ")\n" + hm(c.awal) + " – " + hm(c.akhir);
      const kl = (n, a) => ({ a: a.awal, b: a.akhir, nama: n, warna: "var(--bad)", tip: n + "\n" + hm(a.awal) + " – " + hm(a.akhir) }), bk = (n, a, b) => ({ a, b, nama: n, warna: "var(--ac)", tip: n + "\n" + hm(a) + " – " + hm(b) });
      rows.push({ label: "Caughaḍiyā", type: "bar", items: caug.map(c => ({ a: c.awal, b: c.akhir, nama: c.nama, warna: Q[c.kualitas], tip: ctip(c) })) });
      rows.push({ label: "Kāla", type: "bracket", items: [kl("Rāhu kāla", mh.rahu), kl("Yamagaṇḍa", mh.yamaganda), kl("Gulika", mh.gulika)] });
      rows.push({ label: "muhūr̀tta baik", type: "bracket", items: [bk(PN.MUHURTA_SIANG[7], mh.abhijit.awal, mh.abhijit.akhir), bk("Brahma", sr2 - 96 / 1440, sr2 - 48 / 1440)] });
    }
    const svg = Charts.dayline({ t0: sr, t1: sr2, sunrise: sr, sunset: ss, tz, fmt: hm, hour12: h12, rows, title: "Garis waktu pañcāṅga " + fmtD(sr, tz) });
    const tb = (a, arr) => arr.map(s => "<tr><td>" + a + "</td><td><b>" + s.nama + "</b></td><td class='num'>" + fmtDT(s.awalAsli, tz, true) + "</td><td class='num'>" + fmtDT(s.akhirAsli, tz, true) + "</td></tr>").join("");
    const chip = (w, n) => "<span style='margin-right:12px;white-space:nowrap'><span style='color:" + w[0] + "'>■</span><span style='color:" + w[w.length - 1] + "'>■</span> " + n + "</span>";
    const legenda = chip(WARNA.tithi, "tiŧi") + chip(WARNA.naks, "nakṣatꭉa") + chip(WARNA.yoga, "yoga") + chip(WARNA.karana, "karaṇa") + chip(WARNA.vara, "wāra (sadwāra · pañcawāra · saptawāra · wuku)") + (denganLagna ? chip(WARNA.lagna, "lagna-rāšī") : "") + (mode === "muhurta" ? chip(WARNA.mSiang, "muhūr̀tta siang") + chip(WARNA.mMalam, "muhūr̀tta malam") : "");
    $("pgout").innerHTML = "<p class='hint-scroll'>↔ geser ke samping untuk melihat seluruh grafik</p><div class='wrap'><div style='min-width:860px'>" + svg + "</div></div><div style='margin:6px 0;font-size:13px'>" + legenda + "</div>" +
      "<p class='note'>Latar hijau = siang (terbit " + hm(sr) + ", terbenam " + hm(ss) + "). Tiap blok = satu masa berlaku unsurnya; angka di bawah blok = saat unsur berganti (zona " + tz + "), nuansa warna bergantian agar blok bersebelahan terbedakan. Hari Hindu berjalan dari terbit ke terbit berikutnya." +
      " Wāra: pawukon menurut tanggal sipil hari terbit (Bali menggantinya pukul 00:00; di sini satu nilai untuk seluruh jendela). Nakṣatꭉa: arahkan kursor/ketuk untuk dewata dan maṇḍala." + (mode === "muhurta" ? " Muhūr̀tta 15×2: siang (terbit→terbenam) dan malam (terbenam→terbit) masing-masing dibagi 15 sama panjang dengan daftar nama yang sama; nama tertulis tegak." : "") +
      (mode === "lengkap" ? " Caughaḍiyā: hijau = baik, abu = netral, merah = buruk; Brahma muhūrta = menjelang terbit berikutnya." : "") + " Arahkan kursor/ketuk blok untuk waktu lengkapnya.</p>" +
      "<details style='margin-top:8px'><summary><b>Rincian waktu mulai &amp; berakhir</b></summary><div class='wrap'><table><tr><th>Aṅga</th><th>Nama</th><th>Mulai</th><th>Berakhir</th></tr>" + tb("tiŧi", tithi) + tb("nakṣatꭉa", naks) + tb("yoga", yoga) + tb("karaṇa", karana) + tb("wāra", [{ nama: [pw.sadwara, pw.pancawara, pw.saptawara, "wuku " + pw.wuku].join(" · "), awalAsli: sr, akhirAsli: sr2 }]) + (denganLagna ? tb("lagna", lagna) : "") +
      m30.map(x => "<tr><td>muhūr̀tta " + (x.malam ? "malam" : "siang") + "</td><td><b>" + x.no + ". " + x.nama + "</b></td><td class='num'>" + fmtDT(x.awal, tz, true) + "</td><td class='num'>" + fmtDT(x.akhir, tz, true) + "</td></tr>").join("") + "</table></div></details>";
  }

  function draw() {
    const L = UI.L(), A = new AstroEvents(), P = new Panchanga(A), tz = L.tz, N = +$("tn").value || 7;
    const day = i => { const t = new Date(Date.UTC(L.y, L.mo - 1, L.d + i)); return [t.getUTCFullYear(), t.getUTCMonth() + 1, t.getUTCDate(), t.getUTCDay()]; };

    // ── 1. Detail hari terpilih ──
    const [y0, m0, d0, w0] = day(0), [y1, m1, d1] = day(1);
    const [sr, ss] = sun(L, y0, m0, d0), [sr2] = sun(L, y1, m1, d1), pw = P.pawukon(y0, m0, d0), pw1 = P.pawukon(y1, m1, d1);
    const T = P.tithi(sr), K = P.nakshatra(sr), Y = P.yoga(sr), R = P.karana(sr), M = P.masa(sr);
    const nx = (s, f) => { const q = f.call(P, s.akhir + 1e-4); return q.nama + " <small>→ " + endAt(q.akhir, sr, tz) + "</small>"; };
    const baris = (a, now, s, nxt) => "<tr><td><b>" + a + "</b></td><td>" + now + "</td><td class='num'><b>" + endAt(s.akhir, sr, tz) + "</b></td><td>" + nxt + "</td></tr>";
    const dW = new Date(Date.UTC(L.y, L.mo - 1, L.d + 7 - (pw.hariKe % 7))), yW = dW.getUTCFullYear(), mW = dW.getUTCMonth() + 1, tW = dW.getUTCDate();   // hari pertama wuku berikutnya
    const wukuAkhir = sun(L, yW, mW, tW)[0], wukuNext = P.pawukon(yW, mW, tW).wuku;
    const hari = (a, now, nxt, akhir) => "<tr><td><b>" + a + "</b></td><td>" + now + "</td><td class='num'><b>" + endAt(akhir, sr, tz) + "</b></td><td>" + nxt + "</td></tr>";
    const aksi = "<table><tr><th>aṅga</th><th>saat terbit</th><th>berakhir</th><th>berikutnya</th></tr>" +
      baris("tiŧi", T.n + " · " + T.nama + " <span class='tag'>" + T.paksha + "</span>", T, nx(T, P.tithi)) +
      hari("wāra (saptawāra)", PN.VARA[w0], PN.VARA[(w0 + 1) % 7], sr2) + hari("sadwāra", pw.sadwara, pw1.sadwara, sr2) + hari("pañcawāra", pw.pancawara, pw1.pancawara, sr2) +
      hari("wuku", pw.wuku + " <small>(ke-" + pw.noWuku + ")</small>", wukuNext, wukuAkhir) +
      baris("nakṣatꭉa", K.n + " · " + K.nama + " <small>pada " + K.pada + "</small><br><small>dewata: " + PN.DEWATA[K.idx % 27] + " · maṇḍala: " + PN.MANDALA[K.idx % 27] + "</small>", K, nx(K, P.nakshatra)) +
      baris("yoga", Y.n + " · " + Y.nama, Y, nx(Y, P.yoga)) +
      baris("karaṇa", R.nama, R, nx(R, P.karana)) + "</table>";
    const sSun = Math.floor(P.sidSun(sr) / 30), sMoon = Math.floor(P.sidMoon(sr) / 30);
    const masaRows = "<table class='kv'><tr><td>Māsa (amānta)</td><td>" + M.nama + (M.adhika ? " <span class='tag warn'>Adhika</span>" : "") + "</td></tr>" +
      "<tr><td>Māsa (pūrṇimānta)</td><td>" + M.namaPurnimanta + "</td></tr><tr><td>Pakṣa</td><td>" + T.paksha + "</td></tr>" +
      "<tr><td>Šakawar̀ṣa</td><td>" + P.sakaYear(M.idx, m0, y0) + "</td></tr><tr><td>Rāšī Matahari (sidereal)</td><td>" + PN.RASI[sSun] + "</td></tr>" +
      "<tr><td>Rāšī Bulan (sidereal)</td><td>" + PN.RASI[sMoon] + "</td></tr>" +
      "<tr><td>Bulan lunar</td><td class='num'>" + fmtDT(M.awal, tz) + " → " + fmtDT(M.akhir, tz) + "</td></tr><tr><td>Ayanāṃśa Lahiri</td><td class='num'>" + P.ayanamsa(sr).toFixed(4) + "°</td></tr></table>";
    const lg = P.lagnaSpans(sr, L.lat, L.lon, 24), l0 = P.lagna(sr, L.lat, L.lon);
    const lagnaTbl = "<table><tr><th>Lagna-rāšī</th><th>Mulai</th><th>Berakhir</th><th>Lama</th></tr>" + lg.map(x => "<tr" + (x.awal <= sr && sr < x.akhir ? " class='hl'" : "") + "><td><b>" + x.nama + "</b></td><td class='num'>" + endAt(x.awal, sr, tz) + "</td><td class='num'>" + endAt(x.akhir, sr, tz) + "</td><td class='num'>" + hh(x.akhir - x.awal) + "</td></tr>").join("") + "</table>";
    const mh = P.muhurta(sr, ss, sr2, w0), per = (n, a, tag, cls) => "<tr><td><b>" + n + "</b> " + (tag ? "<span class='tag " + (cls || "") + "'>" + tag + "</span>" : "") + "</td><td class='num'>" + hmOf(a.awal, tz) + " – " + hmOf(a.akhir, tz) + "</td></tr>";
    const muhTbl = "<table class='kv'>" + per("Brahma muhūr̀tta", mh.brahma, "baik") + per("Muhūr̀tta " + PN.MUHURTA_SIANG[7], mh.abhijit, mh.abhijit.catatan ? "Rabu: dihindari" : "baik", mh.abhijit.catatan ? "warn" : "") +
      per("Rāhu kāla", mh.rahu, "hindari", "warn") + per("Yamagaṇḍa", mh.yamaganda, "hindari", "warn") + per("Gulika kāla", mh.gulika, "hindari", "warn") + "</table>";
    const m30 = (t, a) => "<table><tr><th>" + t + "</th><th>Waktu</th></tr>" + a.map((x, i) => "<tr><td>" + (i + 1) + ". " + x.nama + "</td><td class='num'>" + hmOf(x.awal, tz) + " – " + hmOf(x.akhir, tz) + "</td></tr>").join("") + "</table>";
    grafikHarian(L, P, sr, ss, sr2, w0, mh, pw);
    $("pdet").innerHTML =
      "<div class='card'><h2>Pañcāṅga " + fmtD(sr, tz) + " <small>(terbit " + hmOf(sr, tz) + ", terbenam " + hmOf(ss, tz) + ", zona " + tz + ")</small></h2><div class='wrap'>" + aksi + "</div><p class='note'>Aṅga dinilai pada saat Matahari terbit; wāra, sadwāra, dan pañcawāra berakhir pada Matahari terbit berikutnya, wuku pada Matahari terbit hari pertama wuku berikutnya. Lama tithi ini " + hh(T.akhir - T.awal) + "; mulai " + fmtDT(T.awal, tz, true) + ", berakhir <b>" + fmtDT(T.akhir, tz, true) + "</b>.</p></div>" +
      card("Māsa, Šakawar̀ṣa &amp; rāšī", masaRows, "Māsa amānta: bulan lunar bulan-baru ke bulan-baru, bernama menurut rāśi sidereal Matahari saat bulan baru; tanpa saṅkrānti di dalamnya = adhika.") +
      card("Lagna-rāšī <small>(ascendant sidereal, saat terbit: <b>" + l0.nama + "</b>)</small>", lagnaTbl, "Rāśi yang sedang terbit di ufuk timur, dihitung untuk lintang/bujur terpilih selama 24 jam sejak Matahari terbit.") +
      card("Muhūr̀tta", muhTbl + "<details style='margin-top:10px'><summary>30 muhūr̀tta — 15×2 (siang " + hh(mh.lamaSiang / 24) + ", malam " + hh(mh.lamaMalam / 24) + ")</summary><div class='grid'><div>" + m30("Siang (15)", mh.siang) + "</div><div>" + m30("Malam (15)", mh.malam) + "</div></div></details>",
        "Bagian siang 1/8 untuk Rāhu/Yamagaṇḍa/Gulika menurut hari (tradisi India Selatan); Brahma muhūrta = 96–48 menit sebelum terbit.");

    // ── 2. Kalender N hari ──
    const rows = []; let prev = null;
    for (let i = 0; i < N; i++) {
      const [y, mo, d, w] = day(i), [s] = i ? sun(L, y, mo, d) : [sr], pwd = P.pawukon(y, mo, d);
      const t = i ? P.tithi(s) : T, k = i ? P.nakshatra(s) : K, yg = i ? P.yoga(s) : Y, r = i ? P.karana(s) : R, ms = i ? P.masa(s) : M;
      const skip = prev && ((t.n - prev + 30) % 30) === 2 ? (prev % 30) + 1 : null, ulang = prev && t.n === prev; prev = t.n;
      const em = t.n === 15 ? "🌕 " : t.n === 30 ? "🌑 " : "", ek = x => "<br><small>→ " + endAt(x.akhir, s, tz) + "</small>";
      rows.push("<tr" + (t.n === 15 || t.n === 30 ? " class='hl'" : "") + "><td class='num'>" + fmtD(s, tz) + "<br><small>" + PN.VARA[w] + " · wuku " + pwd.wuku + " · " + hmOf(s, tz) + "</small></td>" +
        "<td>" + em + "<b>" + t.n + " · " + t.nama + "</b> <small>" + t.paksha + "</small>" + ek(t) + (skip ? "<br><small class='tag warn'>tithi " + skip + " terlewat (kṣaya)</small>" : "") + (ulang ? "<br><small class='tag'>vṛddhi</small>" : "") + "</td>" +
        "<td title='dewata: " + PN.DEWATA[k.idx % 27] + "&#10;maṇḍala: " + PN.MANDALA[k.idx % 27] + "'>" + k.nama + " <small>p" + k.pada + "</small>" + ek(k) + "</td><td>" + yg.nama + ek(yg) + "</td><td>" + r.nama + ek(r) + "</td>" +
        "<td>" + ms.nama + (ms.adhika ? " <small class='tag warn'>adhika</small>" : "") + "<br><small>Šaka " + P.sakaYear(ms.idx, mo, y) + "</small></td></tr>");
    }
    $("tout").innerHTML = card("Pañcāṅga harian <small>(" + N + " hari, saat Matahari terbit)</small>", "<table><tr><th>tanggal</th><th>tiŧi</th><th>nakṣatꭉa</th><th>yoga</th><th>karaṇa</th><th>māsa</th></tr>" + rows.join("") + "</table>",
      "“→” = jam berakhir (zona " + tz + "; ditambah tanggal bila bukan hari yang sama). Tiŧi 15 (Pañcadašī, Šukla) berakhir tepat saat purnama dan tiŧi 30 (Pañcadašī, Kr̥ṣṇa) saat bulan baru. Nakṣatꭉa: arahkan kursor/ketuk untuk déwatā dan maṇḍala. Zodiak sidereal: ayanāṃśa Lahiri.");
  }
  $("tn").onchange = $("pgm").onchange = $("pgf").onchange = draw;
  UI.onRender("tithi", draw);
})();
