/**
 * tab_salat.js — Tab "Waktu Salat": jadwal (hisab berdetik + jadwal ber-ihtiyat) dengan imsak, keterangan kriteria menurut metode,
 * waktu astronomis (twilight, terbit/terbenam, Bulan), istiwa/tafawut/sepertiga malam, grafik perubahan harian, dan arah kiblat.
 * Memakai JadwalLengkap (js/services/jadwal_service.js), WaktuPelengkap, ArahKiblat, dan Charts.
 */
(function () {
  const { $, card, rows, hms, sgn, dms } = UI;
  const p = UI.add({ id: "salat", label: "Waktu Salat", icon: "🕌" });
  p.innerHTML =
    "<div class='card'><h2>Pengaturan</h2><div class='grid'><label>Imsak (menit sebelum Subuh)<input id='imsakmin' type='number' min='0' max='120' step='1' value='10'></label></div></div>" +
    "<div id='sm-jad'></div><div id='sm-krit'></div><div id='sm-astro'></div><div id='sm-pel'></div>" +
    "<div class='card'><h2>Grafik perubahan harian</h2><div class='grid'>" +
    "<label>Periode<select id='gperiode'><option value='7'>7 hari</option><option value='14'>14 hari</option><option value='30' selected>30 hari</option><option value='60'>60 hari</option><option value='90'>90 hari</option><option value='180'>180 hari</option><option value='365'>365 hari</option></select></label>" +
    "<label>Kelompok waktu<select id='ggrup'></select></label>" +
    "<label>Tampilan<select id='gmode'><option value='delta' selected>Selisih terhadap hari pertama (menit)</option><option value='panel'>Panel per waktu (skala sendiri)</option><option value='abs'>Jam mutlak (satu grafik)</option></select></label></div><div id='gout' style='margin-top:12px'></div></div>" +
    "<div id='sm-qbl'></div>";

  const NAMA = { imsak: "Imsak", subuh: "Subuh", syuruk: "Syuruk", duha: "Duha", zuhur: "Zuhur", asar: "Asar", magrib: "Magrib", isya: "Isya", nisfu: "Tengah malam", sepertigaPertama: "Akhir ⅓ malam pertama", sepertigaTerakhir: "Awal ⅓ malam terakhir",
    fajarAstro: "Fajar astronomis", fajarNaut: "Fajar nautis", fajarSipil: "Fajar sipil", senjaSipil: "Senja sipil", senjaNaut: "Senja nautis", senjaAstro: "Senja astronomis", bulanTerbit: "Bulan terbit", bulanTransit: "Bulan transit", bulanTerbenam: "Bulan terbenam", lamaSiang: "Lama siang", lamaMalam: "Lama malam" };
  const GRUP = { salat: ["Waktu salat", ["imsak", "subuh", "syuruk", "duha", "zuhur", "asar", "magrib", "isya"]],
    twilight: ["Fajar & senja (astronomis, nautis, sipil)", ["fajarAstro", "fajarNaut", "fajarSipil", "syuruk", "magrib", "senjaSipil", "senjaNaut", "senjaAstro"]],
    bulan: ["Bulan terbit, transit, terbenam (lebih lambat)", ["bulanTerbit", "bulanTransit", "bulanTerbenam"]],
    malam: ["Malam: Magrib sampai Subuh", ["magrib", "isya", "sepertigaPertama", "nisfu", "sepertigaTerakhir", "subuh"]],
    siang: ["Lama siang & malam", ["lamaSiang", "lamaMalam"]] };
  Object.keys(GRUP).forEach(k => { const o = document.createElement("option"); o.value = k; o.textContent = GRUP[k][0]; $("ggrup").appendChild(o); });

  const imsak = () => { const v = parseInt($("imsakmin").value, 10); return Number.isFinite(v) ? Math.min(120, Math.max(0, v)) : 10; };
  const nilai = x => x && x.isNormal ? hms(x.time) : "<small>" + (STATUS_KET[x && x.status] || "—") + "</small>";
  const jam = h => h == null ? "<small>tidak ada pada tanggal ini</small>" : hms(h);
  const durasi = h => h == null ? "<small>tidak dapat dihitung</small>" : (h >= 24 - 1e-9 ? "24:00:00" : hms(h));   // 24 jam tidak boleh tampil 00:00:00

  function draw() {
    const L = UI.L(), J = new JadwalLengkap(), n = imsak(), I = L.iht, R = J.hitung(L.d, L.mo, L.y, L, { imsakMenit: n, iht: I }), K = J.kriteria(L.d, L.mo, L.y, L, { imsakMenit: n, iht: I }), M = L.method;
    const ring = { imsak: 0, subuh: 1, syuruk: 2, duha: 3, zuhur: 4, asar: 5, magrib: 6, isya: 7, nisfuLail: 8 };
    const NM = [["Imsak", "imsak"], ["Subuh", "subuh"], ["Syuruk", "syuruk"], ["Duha", "duha"], ["Zuhur", "zuhur"], ["Asar", "asar"], ["Magrib", "magrib"], ["Isya", "isya"], ["Nisfu lail", "nisfuLail"]];

    // ── jadwal ──
    $("sm-jad").innerHTML = card("Jadwal salat <small>(" + M.name + ", zona " + L.tz + ")</small>",
      "<table><tr><th>Waktu</th><th>Jadwal<br><small>hisab + ihtiyat " + I + " m</small></th><th>Hisab<br><small>mentah, berdetik</small></th><th>Kriteria</th></tr>" +
      NM.map(([l, k]) => "<tr><td><b>" + l + "</b></td><td class='num big'>" + nilai(R.jadwal[k]) + "</td><td class='num'>" + nilai(R.hisab[k]) + "</td><td><small>" + K[ring[k]].nilai + "</small></td></tr>").join("") + "</table>",
      "Jadwal = menit hisab dibulatkan ke bawah + ihtiyat (seperti pustaka asli), sehingga detiknya selalu :00. Imsak = Subuh − " + n + " menit." + (R.ramadan != null ? " Isya Ummul Qura " + (R.ramadan ? "memakai interval Ramadan" : "memakai interval biasa") + " (Ramadan menurut kalender Ummul Qura bawaan peramban)." : ""));

    // ── kriteria ──
    $("sm-krit").innerHTML = "<details class='card' open><summary><span>📐 Kriteria penentuan: " + M.name + "</span><small>Subuh " + String(M.hmSubuh).replace(".", ",").replace("-", "−") + "°, Isya " + (M.isyaBerbasisInterval ? "+" + M.isyaMenitSetelahMagrib + " menit" : String(M.hmIsya).replace(".", ",").replace("-", "−") + "°") + "</small></summary><div class='wrap'><table style='margin-top:10px'><tr><th>Waktu</th><th>Kriteria</th></tr>" +
      K.map(k => "<tr><td><b>" + k.nama + "</b></td><td>" + k.kriteria + "</td></tr>").join("") + "</table></div></details>";

    // ── waktu astronomis ──
    const A = R.astro, H = R.hisab, mt = (a, b, c) => "<tr><td>" + a + (b ? "<br><small>" + b + "</small>" : "") + "</td><td class='num'>" + c + "</td></tr>";
    $("sm-astro").innerHTML = card("Waktu astronomis",
      "<table class='kv'>" +
      mt("Fajar astronomis", "Matahari −18°", jam(A.fajarAstro)) + mt("Fajar nautis", "Matahari −12°", jam(A.fajarNaut)) + mt("Fajar sipil", "Matahari −6°", jam(A.fajarSipil)) +
      mt("<b>Matahari terbit</b> (sunrise)", "tepi atas menyentuh ufuk", nilai(H.syuruk)) + mt("<b>Transit Matahari</b> (istiwa)", "kulminasi", nilai(H.zuhur)) + mt("<b>Matahari terbenam</b> (sunset)", "tepi atas menyentuh ufuk", nilai(H.magrib)) +
      mt("Senja sipil", "Matahari −6°", jam(A.senjaSipil)) + mt("Senja nautis", "Matahari −12°", jam(A.senjaNaut)) + mt("Senja astronomis", "Matahari −18°", jam(A.senjaAstro)) +
      mt("Lama siang", "terbit → terbenam", durasi(A.lamaSiang)) + mt("Lama malam", "terbenam → terbit", durasi(A.lamaMalam)) +
      mt("<b>Bulan terbit</b> (moonrise)", "", jam(A.bulanTerbit)) + mt("<b>Bulan transit</b>", "Bulan di meridian", jam(A.bulanTransit)) + mt("<b>Bulan terbenam</b> (moonset)", "", jam(A.bulanTerbenam)) + "</table>",
      "Fajar/senja memakai sudut Matahari di bawah ufuk (−6° sipil, −12° nautis, −18° astronomis). Bulan bisa tidak terbit/terbenam pada satu tanggal karena rata-rata terbit ±50 menit lebih lambat tiap hari. Semua jam zona " + L.tz + ".");

    // ── istiwa, tafawut, sepertiga malam ──
    const WP = new WaktuPelengkap(), is = WP.istiwa(L.d, L.mo, L.y, L.lon, L.lat, L.tz), ml = WP.sepertigaMalam(L.d, L.mo, L.y, L.lon, L.lat, L.elev, L.tz, M);
    $("sm-pel").innerHTML = card("Istiwa, tafawut &amp; sepertiga malam", rows([
      ["Istiwa (Matahari berkulminasi)", "<b>" + hms(is.jam) + "</b>"], ["Tinggi Matahari saat istiwa", is.tinggi.toFixed(2) + "°"],
      ["Tafawut (perata waktu, e)", sgn(is.tafawut)], ["Koreksi waktu daerah (KWD)", sgn(is.kwd)],
      ["Lama malam (Magrib → Subuh)", ml ? hms(ml.lama) : "—"], ["Akhir sepertiga malam pertama", ml ? hms(ml.akhirSepertigaPertama) : "—"],
      ["Tengah malam (nisfu lail)", ml ? hms(ml.tengahMalam) : "—"], ["Awal sepertiga malam terakhir", ml ? hms(ml.awalSepertigaTerakhir) : "—"]]),
      "Istiwa = 12 − e − KWD (zuhur tanpa ihtiyat). Tafawut = selisih waktu hakiki terhadap waktu pertengahan (e), positif bila Matahari lebih cepat.");

    // ── kiblat ──
    const ak = new ArahKiblat(), bs = ak.arahQiblatSpherical(L.lon, L.lat), bv = ak.arahQiblaVincenty(L.lon, L.lat, "PtoQ");
    const kompas = b => "<svg viewBox='-60 -60 120 120' width='112' height='112' role='img' aria-label='Arah kiblat " + b.toFixed(1) + "°'><circle r='52' fill='none' stroke='var(--line)' stroke-width='2'/><text y='-40' text-anchor='middle' font-size='11' fill='var(--mut)'>U</text><g transform='rotate(" + b + ")'><path d='M0 -44 L7 4 L0 -3 L-7 4 Z' fill='var(--ac)'/><circle r='3' fill='var(--ac)'/></g></svg>";
    $("sm-qbl").innerHTML = "<div class='card'><h2>Arah kiblat</h2><div class='split'><div class='wrap'>" + rows([["Bola (spherical)", dms(bs)], ["Koreksi elipsoid", dms(ak.arahQiblaWithEllipsoidCorrection(L.lon, L.lat))], ["Vincenty", dms(bv)], ["Jarak (Vincenty)", (ak.arahQiblaVincenty(L.lon, L.lat, "Dist") / 1000).toFixed(1) + " km"]]) + "</div>" + kompas(bv) + "</div><p class='note'>Dihitung dari utara sejati searah jarum jam.</p></div>";
    grafik();
  }

  // ── grafik perubahan harian (dihitung bertahap agar halaman tetap responsif) ──
  let token = 0;
  function grafik() {
    const my = ++token, L = UI.L(), N = +$("gperiode").value || 30, key = $("ggrup").value in GRUP ? $("ggrup").value : "salat", keys = GRUP[key][1], mode = $("gmode").value || "delta", n = imsak(), J = new JadwalLengkap();
    const data = keys.map(() => []), labels = []; let i = 0;
    $("gout").innerHTML = "<div class='note'>Menghitung… <span id='gpct'>0%</span><div class='bar'><i id='gbar' style='width:0%'></i></div></div>";
    (function tick() {
      if (my !== token) return;
      const t0 = performance.now();
      while (i < N) {
        const t = new Date(Date.UTC(L.y, L.mo - 1, L.d + i)), r = J.nilai(t.getUTCDate(), t.getUTCMonth() + 1, t.getUTCFullYear(), L, keys, { imsakMenit: n });
        keys.forEach((k, x) => data[x].push(r[k])); labels.push(t.getUTCDate() + "/" + (t.getUTCMonth() + 1)); i++;
        if (performance.now() - t0 > 40) break;
      }
      if (i < N) { const pc = Math.round(i / N * 100); if ($("gpct")) { $("gpct").textContent = pc + "%"; $("gbar").style.width = pc + "%"; } setTimeout(tick, 0); return; }
      selesai();
    })();
    function selesai() {
      const series = keys.map((k, x) => {                         // lepas lompatan lewat tengah malam agar garis menyambung
        let prev = null;
        const abs = data[x].map(v => { if (v == null) return null; if (!k.startsWith("lama") && prev != null) { while (v - prev > 12) v -= 24; while (prev - v > 12) v += 24; } prev = v; return v; });
        const first = abs.find(v => v != null);
        return { name: NAMA[k], abs, pts: mode === "delta" ? abs.map(v => v == null ? null : (v - first) * 60) : abs };
      });
      const ring = series.map((s, x) => {
        const fm = h => keys[x].startsWith("lama") ? durasi(h) : hms(h);
        const v = s.abs.filter(a => a != null), a = v[0], b = v[v.length - 1];
        return "<tr><td><span style='color:" + Charts.palette[x % Charts.palette.length] + "'>●</span> <b>" + s.name + "</b></td><td class='num'>" + (v.length ? fm(a) : "—") + "</td><td class='num'>" + (v.length ? fm(b) : "—") + "</td><td class='num'>" + (v.length > 1 ? sgn(b - a) : "—") + "</td></tr>";
      }).join("");
      const ket = mode === "delta" ? "Selisih (menit) terhadap hari pertama; garis nol = hari pertama." : mode === "panel" ? "Tiap waktu memakai skala sumbu sendiri agar perubahannya terlihat; jam zona " + L.tz + " (hisab mentah)." : "Jam pada zona " + L.tz + " (hisab mentah, tanpa ihtiyat; lompatan lewat tengah malam disambung).";
      const pal = x => Charts.palette[x % Charts.palette.length], judul = "Perubahan " + GRUP[key][0].toLowerCase() + " selama " + N + " hari";
      let grafikHtml;
      if (mode === "panel") {
        grafikHtml = "<div class='charts'>" + series.map((s, x) => "<div class='card' style='padding:10px 12px'><h2 style='margin-bottom:4px'><span style='color:" + pal(x) + "'>●</span> " + s.name + "</h2>" + Charts.lines({ labels, series: [{ name: s.name, color: pal(x), pts: s.abs }], mode: "abs", h: 170, title: s.name }) + "</div>").join("") + "</div>";
      } else {
        grafikHtml = Charts.lines({ labels, series: series.map(s => ({ name: s.name, pts: s.pts })), mode: mode === "delta" ? "delta" : "abs", h: 330, yUnit: mode === "delta" ? "menit" : null, tip: mode === "delta" ? v => (v >= 0 ? "+" : "−") + Math.abs(v).toFixed(2) + " menit" : null, title: judul }) +
          "<div style='margin:8px 0;font-size:13px'>" + series.map((s, x) => "<span style='margin-right:12px;white-space:nowrap'><span style='color:" + pal(x) + "'>●</span> " + s.name + "</span>").join("") + "</div>";
      }
      $("gout").innerHTML = grafikHtml + "<div class='wrap'><table><tr><th>Waktu</th><th>Hari pertama</th><th>Hari terakhir</th><th>Perubahan</th></tr>" + ring + "</table></div><p class='note'>" + ket + " Garis terputus = waktu tidak ada pada hari itu; “(+1)” = hari berikutnya.</p>";
    }
  }

  $("imsakmin").onchange = draw;
  ["gperiode", "ggrup", "gmode"].forEach(id => { $(id).onchange = grafik; });
  UI.onRender("salat", draw);
})();
