/**
 * tab_adhika.js — Tab "Adhika & Kṣaya": mencari bulan kabisat (adhika) dan bulan terhapus (kṣaya) māsa pada rentang tahun,
 * lalu menganalisis pola dan mem-visualisasikannya (linimasa, frekuensi per māsa, selang antar adhika, per dekade, siklus Metonik 19 tahun).
 * Memakai Panchanga.lunarMonths (js/services/panchanga_service.js) dan Charts (charts.js).
 */
(function () {
  const { $, card, fmtDT } = UI;
  const p = UI.add({ id: "adhika", label: "Adhika & Kṣaya", icon: "📈" });
  p.innerHTML =
    "<div class='card'><h2>Pencarian adhika &amp; kṣaya māsa</h2><div class='grid'><label>Tahun awal (Masehi)<input id='ay1' type='number' step='1' value='2000'></label>" +
    "<label>Tahun akhir<input id='ay2' type='number' step='1' value='2100'></label></div><button id='ago'>Cari &amp; analisis</button><p class='note' id='aest'></p></div><div id='aout'></div>";

  const MAXTH = 500, MS = PN.MASA;
  const dayOf = (jd, tz) => fmtDT(jd, tz).split(" ")[0];
  const yr = jd => 2000 + (jd - 2451545) / 365.2425;
  const f1 = v => (Math.round(v * 10) / 10).toString().replace(".", ",");
  const f2 = v => (Math.round(v * 100) / 100).toString().replace(".", ",");
  const est = () => { const n = Math.min(MAXTH, Math.max(1, (+$("ay2").value) - (+$("ay1").value) + 1)); $("aest").textContent = n + " tahun ≈ " + Math.round(n * 12.37) + " bulan lunar ≈ " + Math.max(2, Math.round(n * 12.37 * 0.005)) + " detik (perkiraan kasar, bergantung perangkat; rentang maksimum " + MAXTH + " tahun)."; };
  $("ay1").onchange = $("ay2").onchange = est; est();

  let token = 0;
  function cari() {
    const my = ++token, tz = UI.L().tz;
    let y1 = Math.floor(+$("ay1").value), y2 = Math.floor(+$("ay2").value);
    if (!(y1 > 0) || !(y2 > 0)) { $("aout").innerHTML = UI.err("Isi tahun awal dan akhir dengan benar."); return; }
    if (y2 < y1) [y1, y2] = [y2, y1];
    if (y2 - y1 + 1 > MAXTH) y2 = y1 + MAXTH - 1;
    const P = new Panchanga(), J = P.A.jd, gen = P.lunarMonths(J.kmjd(1, 1, y1, 0, 0), J.kmjd(1, 1, y2 + 1, 0, 0)), items = [], perkiraan = (y2 - y1 + 1) * 12.37;
    let n = 0;
    $("aout").innerHTML = "<div class='card'>Menghitung bulan lunar… <span id='apct'>0%</span><div class='bar'><i id='abar' style='width:0%'></i></div></div>";
    (function tick() {
      if (my !== token) return;
      const t0 = performance.now();
      for (;;) {
        const r = gen.next();
        if (r.done) { tampil(items, n, y1, y2, tz); return; }
        n++; if (r.value.jenis !== "normal") items.push(r.value);
        if (performance.now() - t0 > 40) break;
      }
      const pc = Math.min(99, Math.round(n / perkiraan * 100));
      if ($("apct")) { $("apct").textContent = pc + "%"; $("abar").style.width = pc + "%"; }
      setTimeout(tick, 0);
    })();
  }

  function tampil(items, total, y1, y2, tz) {
    const ad = items.filter(m => m.jenis === "adhika"), ks = items.filter(m => m.jenis === "ksaya"), tahun = y2 - y1 + 1;
    const gy = m => +dayOf(m.awal, tz).split("/")[2];
    const tgl = m => dayOf(m.awal, tz), tglA = m => dayOf(m.akhir, tz);
    const perMasa = new Array(12).fill(0); ad.forEach(m => perMasa[m.idx]++);
    const sel = ad.slice(1).map((m, i) => (m.awal - ad[i].awal) / 365.2422), rataSel = sel.length ? sel.reduce((a, b) => a + b, 0) / sel.length : 0;
    const iMin = sel.length ? sel.indexOf(Math.min(...sel)) : -1, iMax = sel.length ? sel.indexOf(Math.max(...sel)) : -1;
    const top = perMasa.indexOf(Math.max(...perMasa)), nol = MS.filter((_, i) => perMasa[i] === 0);
    const metonik = new Array(19).fill(0); ad.forEach(m => metonik[((gy(m) % 19) + 19) % 19]++);
    const bin = tahun <= 50 ? 5 : tahun <= 150 ? 10 : 25, nb = Math.ceil(tahun / bin), perBin = new Array(nb).fill(0), lblBin = [];
    for (let b = 0; b < nb; b++) lblBin.push((y1 + b * bin) + "–" + Math.min(y2, y1 + (b + 1) * bin - 1));
    ad.forEach(m => { const b = Math.min(nb - 1, Math.floor((gy(m) - y1) / bin)); if (b >= 0) perBin[b]++; });

    // ── ringkasan ──
    const kpi = (v, l) => "<div class='kpi'><b>" + v + "</b><span>" + l + "</span></div>";
    let h = "<div class='kpis'>" + kpi(total.toLocaleString("id-ID"), "bulan lunar dianalisis (" + y1 + "–" + y2 + ")") + kpi(ad.length, "adhika māsa") + kpi(ks.length, "kṣaya māsa") + kpi(sel.length ? f2(rataSel) + " th" : "—", "rata-rata selang antar adhika") + "</div>";

    // ── grafik ──
    const rowsTl = MS.slice(), pts = [];
    ad.forEach(m => pts.push({ x: yr(m.awal + tz / 24), row: m.idx, kind: "a", tip: "Adhika " + m.nama + ": " + tgl(m) + " → " + tglA(m) }));
    ks.forEach(m => pts.push({ x: yr(m.awal + tz / 24), row: m.idx, kind: "k", tip: "Kṣaya (dua saṅkrānti " + m.sankranti.join(" + ") + "), māsa " + m.hilang + " terhapus: " + tgl(m) + " → " + tglA(m) }));
    const g = (t, sub, svg, note) => "<div class='card'><h2>" + t + (sub ? " <small>" + sub + "</small>" : "") + "</h2>" + svg + (note ? "<p class='note'>" + note + "</p>" : "") + "</div>";
    h += g("Linimasa kejadian", "● adhika · ◆ kṣaya", Charts.timeline({ x0: y1, x1: y2 + 1, rows: rowsTl, points: pts, title: "Linimasa adhika dan kṣaya" }), "Tiap titik = satu bulan lunar; baris = nama māsa (Caitra di atas). Arahkan kursor/ketuk titik untuk tanggalnya.");
    h += "<div class='charts'>" +
      g("Adhika per māsa", "", Charts.bar({ labels: MS, values: perMasa, hi: top, rot: -40, h: 250, title: "Jumlah adhika per māsa", yTitle: "jumlah" }), "Māsa terbanyak: <b>" + MS[top] + "</b> (" + perMasa[top] + "×). Disorot kuning.") +
      g("Selang antar adhika", "tahun", sel.length ? Charts.bar({ labels: ad.slice(1).map(gy), values: sel, colors: sel.map(v => v < 2.5 ? "var(--warn)" : "var(--ac)"), mean: rataSel, meanLabel: "rata-rata " + f2(rataSel), yTitle: "tahun", rot: -40, h: 250, fmt: f1, tips: sel.map((v, i) => f2(v) + " tahun: " + ad[i].nama + " " + tgl(ad[i]) + " → " + ad[i + 1].nama + " " + tgl(ad[i + 1])), title: "Selang antar adhika" }) : "<p class='note'>Butuh minimal dua adhika.</p>", "Kuning = selang pendek (< 2,5 tahun, ±28 bulan); selang lain ±32 atau ±35 bulan. Pola ini berulang mengikuti siklus 19 tahun.") +
      g("Adhika per " + bin + " tahun", "", Charts.bar({ labels: lblBin, values: perBin, rot: -40, h: 250, title: "Jumlah adhika per kurun", yTitle: "jumlah" }), "Rata-rata teoretis " + f1(bin * 7 / 19) + " per " + bin + " tahun (7 per 19 tahun).") +
      g("Posisi dalam siklus Metonik", "tahun mod 19", Charts.bar({ labels: metonik.map((_, i) => i), values: metonik, mean: ad.length / 19, meanLabel: "rata-rata " + f1(ad.length / 19), h: 250, title: "Adhika menurut tahun mod 19", yTitle: "jumlah" }), "Adhika cenderung menempati tahun-tahun tertentu dalam siklus 19 tahun; 7 dari 19 tahun memuat adhika.") + "</div>";

    // ── analisis teks ──
    const li = [];
    li.push("Dalam <b>" + tahun + " tahun</b> ditemukan <b>" + ad.length + " adhika māsa</b> — rata-rata 1 per <b>" + f2(tahun / (ad.length || 1)) + " tahun</b> (" + f2(ad.length / tahun * 19) + " per 19 tahun; teori Metonik: 7). Adhika menempati " + f2(ad.length / total * 100) + "% dari seluruh bulan lunar.");
    if (sel.length) li.push("Selang antar adhika: terpendek <b>" + f2(sel[iMin]) + " tahun</b> (" + tgl(ad[iMin]) + " → " + tgl(ad[iMin + 1]) + "), terpanjang <b>" + f2(sel[iMax]) + " tahun</b> (" + tgl(ad[iMax]) + " → " + tgl(ad[iMax + 1]) + "), rata-rata " + f2(rataSel) + " tahun.");
    li.push("Māsa yang paling sering adhika: <b>" + MS[top] + "</b> (" + perMasa[top] + "×, " + f1(perMasa[top] / (ad.length || 1) * 100) + "%)." + (nol.length ? " Tidak pernah adhika pada rentang ini: " + nol.join(", ") + "." : " Semua māsa pernah menjadi adhika."));
    li.push("Adhika pada Pauṣa/Māgha sangat jarang (" + ad.filter(m => m.idx === 9 || m.idx === 10).length + " kasus di rentang ini): pada Desember–Februari Bumi dekat perihelion sehingga Matahari bergerak paling cepat, bulan solar ≈ 29,3–29,9 hari — hampir selalu ada saṅkrānti di dalam satu bulan lunar (29,53 hari).");
    if (ks.length) {
      li.push("<b>" + ks.length + " kṣaya māsa</b>: " + ks.map(m => "<b>" + tgl(m) + "</b> (" + m.nama + "; saṅkrānti " + m.sankranti.join(" + ") + "; māsa <b>" + m.hilang + "</b> terhapus)").join("; ") + ". Kṣaya hanya muncul pada māsa " + [...new Set(ks.map(m => m.nama))].join(", ") + ", saat Matahari bergerak paling cepat dan bulan lunar terpendek.");
      const apit = ks.map(m => { const a = ad.filter(x => x.awal < m.awal && m.awal - x.awal < 440).pop(), b = ad.find(x => x.awal > m.awal && x.awal - m.awal < 440); return a && b ? 1 : 0; });
      li.push("Pada " + apit.reduce((a, b) => a + b, 0) + " dari " + ks.length + " kṣaya, terdapat adhika māsa <b>sebelum dan sesudahnya</b> dalam ±14 bulan — ciri khas tahun kṣaya.");
    } else li.push("Tidak ditemukan kṣaya māsa pada rentang ini (kejadian sangat langka: sekitar tiap 19–141 tahun).");
    h += card("Analisis", "<ul class='find'>" + li.map(x => "<li>" + x + "</li>").join("") + "</ul>",
      "Adhika = bulan lunar tanpa saṅkrānti (Matahari tetap di satu rāśi sidereal). Kṣaya = bulan lunar yang memuat dua saṅkrānti. Bulan lunar: bulan baru → bulan baru (skema amānta), rāśi dari ayanāṃśa Lahiri; tanggal menurut zona " + tz + ".");

    // ── tabel ──
    const baris = items.slice(0, 400).map((m, i) => "<tr" + (m.jenis === "ksaya" ? " class='hl'" : "") + "><td>" + (i + 1) + "</td><td><span class='tag" + (m.jenis === "ksaya" ? " warn" : "") + "'>" + (m.jenis === "ksaya" ? "Kṣaya" : "Adhika") + "</span></td><td><b>" + m.nama + "</b></td><td class='num'>" + tgl(m) + "</td><td class='num'>" + tglA(m) + "</td><td class='num'>" + f2(m.lama) + "</td><td>" + (m.jenis === "ksaya" ? "dua saṅkrānti (" + m.sankranti.join(", ") + "); " + m.hilang + " terhapus" : "tanpa saṅkrānti; sebelum nija " + m.nama) + "</td></tr>").join("");
    h += card("Daftar kejadian <small>(" + items.length + (items.length > 400 ? ", 400 pertama" : "") + ")</small>", "<table><tr><th>#</th><th>Jenis</th><th>Māsa</th><th>Bulan baru awal</th><th>Bulan baru akhir</th><th>Lama (hari)</th><th>Keterangan</th></tr>" + (baris || "<tr><td colspan='7'>Tidak ada.</td></tr>") + "</table>");
    $("aout").innerHTML = h;
  }
  $("ago").onclick = cari;
  UI.onRender("adhika", () => { if (!$("aout").innerHTML) cari(); });
})();
