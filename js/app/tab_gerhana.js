/**
 * tab_gerhana.js — Tab "Gerhana": antarmuka demo: daftar gerhana Matahari & Bulan per rentang tahun Hijriah,
 * lengkap dengan ringkasan keterlihatannya di lokasi pada formulir utama.
 * Memakai SolarEclipseService dan LunarEclipseService (js/services/).
 */
(function () {
  const $ = id => document.getElementById(id);
  const root = UI.add({ id: "gerhana", label: "Gerhana", icon: "🌘" });
  root.innerHTML =
    "<div class='card'><h2>Gerhana Matahari &amp; Bulan</h2><div class='grid'>" +
    "<label>Tahun Hijriah awal<input id='gt1' type='number' step='1'></label>" +
    "<label>Tahun Hijriah akhir<input id='gt2' type='number' step='1'></label></div>" +
    "<button id='ggo'>Cari gerhana</button></div><div id='gout'></div>";
  let y = 1448;
  try { y = +new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", { year: "numeric" }).formatToParts(new Date()).find(p => p.type === "year").value; } catch (e) {}
  $("gt1").value = y; $("gt2").value = y;

  const pad = n => String(n).padStart(2, "0");
  const fmt = (jd, tz) => {                       // JD (UT) → tanggal & jam pada zona tz
    if (jd == null) return "—";
    const d = new Date((jd - 2440587.5) * 864e5 + tz * 36e5);
    return d.getUTCDate() + "/" + pad(d.getUTCMonth() + 1) + "/" + d.getUTCFullYear() + " " + pad(d.getUTCHours()) + ":" + pad(d.getUTCMinutes());
  };
  const dur = h => {                              // jam desimal → "j m" atau "m d"
    if (h == null || !(h > 0)) return "—";
    const sec = Math.round(h * 3600), m = Math.floor(sec / 60);
    return sec >= 3600 ? Math.floor(m / 60) + " j " + (m % 60) + " m" : m + " m " + (sec % 60) + " d";
  };
  const same = (a, b) => a.tahunHijri === b.tahunHijri && a.bulanHijri === b.bulanHijri;
  const title = s => s.charAt(0) + s.slice(1).toLowerCase();

  $("ggo").onclick = () => {
    const a = +$("gt1").value, b = Math.min(+$("gt2").value || a, a + 4);   // maksimum 5 tahun sekali jalan
    const g = { gLon: +$("lon").value, gLat: +$("lat").value, elev: +$("elev").value, tmZn: +$("tz").value, pres: 1010, temp: 25 };
    $("gout").innerHTML = "<div class='card'>Menghitung…</div>";
    setTimeout(() => {
      try {
        const S = new SolarEclipseService(), L = new LunarEclipseService(), r = { tahunAwalH: a, tahunAkhirH: b };
        const gs = S.solarEclipseGlobalRangeHijri({ ...r, timeScale: TimeScale.jdUT }), ls = L.lunarEclipseGlobalRangeHijri(r);
        const sl = S.solarEclipseLocalRangeHijri({ ...r, ...g, timeScale: TimeScale.jdUT }), ll = L.lunarEclipseLocalRangeHijri({ ...r, ...g, timeScale: TimeScale.jdUT });
        const f = (v, d) => v == null ? "—" : v.toFixed(d);          // aman untuk nilai null (mis. umbra pada gerhana penumbral)
        const loc = (e, alt, mag, extra) => !e ? "Tidak terjadi di lokasi ini" :
          (alt != null && alt < 0 ? "Puncak " + fmt(e, g.tmZn) + " — di bawah ufuk (tidak teramati)" : "Puncak " + fmt(e, g.tmZn) + ", tinggi " + f(alt, 1) + "°, magnitudo " + f(mag, 3) + (extra || ""));
        const solar = gs.filter(e => e.jenis && !/tidak/i.test(e.jenis)).map(e => {
          const l = sl.find(x => same(x, e));
          return "<tr><td>" + fmt(e.mxUT, 0) + " UT</td><td>" + title(e.jenis) + "</td><td>" + (e.magnitude ?? 0).toFixed(3) + "</td><td>" + dur(e.durasiTotalitas) + "</td><td>" + loc(l && l.mxUT, l && l.altMx, l && l.magnitude, l ? ", obskurasi " + f(l.obscuration, 0) + "%" : "") + "</td></tr>";
        });
        const lunar = ls.filter(e => e.jenis && !/tidak/i.test(e.jenis)).map(e => {
          const l = ll.find(x => same(x, e));
          return "<tr><td>" + fmt(e.mx, 0) + " UT</td><td>" + title(e.jenis) + "</td><td>—</td><td>" + dur(e.durasiTotal || e.durasiUmbral || e.durasiPenumbral) + "</td><td>" + loc(l && l.mx, l && l.altMx, l && (l.magnitudeUmbral ?? l.magnitudePenumbral), l && l.magnitudeUmbral == null ? " (penumbra)" : "") + "</td></tr>";
        });
        const tbl = (t, rows) => "<div class='card'><h2>" + t + " <small>(" + a + (b > a ? "–" + b : "") + " H)</small></h2><div class='wrap'><table><tr><td><b>Puncak</b></td><td><b>Jenis</b></td><td><b>Magnitudo</b></td><td><b>Durasi</b></td><td><b>Di lokasi Anda (zona " + g.tmZn + ")</b></td></tr>" + (rows.join("") || "<tr><td colspan='5'>Tidak ada gerhana.</td></tr>") + "</table></div></div>";
        $("gout").innerHTML = tbl("Gerhana Matahari", solar) + tbl("Gerhana Bulan", lunar) +
          "<p class='sub'>Magnitudo gerhana Matahari = global; durasi = totalitas/anularitas maksimum (gerhana Bulan: totalitas, atau durasi umbra/penumbra). “Tidak teramati” bila Matahari/Bulan di bawah ufuk saat puncak; pustaka asli tetap menghitung keadaan geometrisnya.</p>";
      } catch (e) { $("gout").innerHTML = "<div class='card'>Gagal: " + e.message + "</div>"; }
    }, 30);
  };
})();
