/**
 * charts.js — Grafik SVG ringan tanpa pustaka luar (warna memakai variabel CSS sehingga mengikuti tema terang/gelap).
 * Charts.bar({...})       → diagram batang (kategori) dengan garis rata-rata opsional
 * Charts.timeline({...})  → sebaran titik pada linimasa: sumbu-x waktu, sumbu-y baris kategori
 */
const Charts = (() => {
  const W = 640, esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/'/g, "&#39;");
  const svg = (h, inner, label) => "<svg viewBox='0 0 " + W + " " + h + "' role='img' aria-label='" + esc(label) + "' style='width:100%;height:auto;display:block'>" + inner + "</svg>";
  const txt = (x, y, t, o = {}) => "<text x='" + x + "' y='" + y + "' font-size='" + (o.s || 11) + "' fill='" + (o.fill || "var(--mut)") + "' text-anchor='" + (o.a || "middle") + "'" + (o.rot ? " transform='rotate(" + o.rot + " " + x + " " + y + ")'" : "") + ">" + esc(t) + "</text>";
  const nice = (max, n = 5) => {                              // langkah sumbu "bulat" dan nilai maksimum
    const raw = (max || 1) / n, p = Math.pow(10, Math.floor(Math.log10(raw))), f = raw / p, s = (f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10) * p;
    return { step: s, max: Math.ceil((max || 1) / s) * s };
  };
  const num = v => (Math.round(v * 100) / 100).toString();

  /** labels[], values[]; opsi: h, fmt(v), color, hi (indeks yang disorot), mean (garis), every (label tiap n), yTitle, tips[] */
  function bar(o) {
    const h = o.h || 230, L = 46, R = 12, T = 16, B = o.rot ? 56 : 40, n = o.values.length, iw = W - L - R, ih = h - T - B;
    const mx = nice(Math.max(...o.values, o.mean || 0, 1)), bw = iw / n, every = o.every || Math.max(1, Math.ceil(n / 14));
    let s = "";
    for (let v = 0; v <= mx.max + 1e-9; v += mx.step) {
      const y = T + ih - v / mx.max * ih;
      s += "<line x1='" + L + "' x2='" + (W - R) + "' y1='" + y + "' y2='" + y + "' stroke='var(--line)'/>" + txt(L - 6, y + 4, num(v), { a: "end" });
    }
    o.values.forEach((v, i) => {
      const x = L + i * bw + bw * 0.14, w = bw * 0.72, bh = v / mx.max * ih, y = T + ih - bh, c = o.hi === i ? "var(--warn)" : (o.colors ? o.colors[i] : (o.color || "var(--ac)"));
      s += "<rect x='" + x.toFixed(1) + "' y='" + y.toFixed(1) + "' width='" + w.toFixed(1) + "' height='" + Math.max(bh, 0).toFixed(1) + "' rx='2' fill='" + c + "'><title>" + esc((o.tips ? o.tips[i] : o.labels[i] + ": " + (o.fmt ? o.fmt(v) : num(v)))) + "</title></rect>";
      if (n <= 24 && v > 0) s += txt(x + w / 2, y - 4, o.fmt ? o.fmt(v) : num(v), { s: 10, fill: "var(--fg)" });
      if (i % every === 0) s += txt(x + w / 2, T + ih + (o.rot ? 12 : 16), o.labels[i], { s: 10, rot: o.rot, a: o.rot ? "end" : "middle" });
    });
    if (o.mean != null) { const y = T + ih - o.mean / mx.max * ih; s += "<line x1='" + L + "' x2='" + (W - R) + "' y1='" + y + "' y2='" + y + "' stroke='var(--warn)' stroke-dasharray='5 4'/>" + txt(W - R, T - 4, "┄ " + (o.meanLabel || "rata-rata"), { a: "end", s: 10, fill: "var(--warn)" }); }
    if (o.yTitle) s += txt(12, T + ih / 2, o.yTitle, { rot: -90, s: 10 });
    return svg(h, s, o.title || "grafik batang");
  }

  /** x0..x1 (tahun), rows[] (nama baris), points[{x,row,kind:'a'|'k',tip}] */
  function timeline(o) {
    const rowsN = o.rows.length, rh = 21, L = 88, R = 14, T = 12, B = 30, h = T + rowsN * rh + B, iw = W - L - R, span = o.x1 - o.x0 || 1;
    const X = x => L + (x - o.x0) / span * iw, steps = [1, 2, 5, 10, 20, 25, 50, 100], st = steps.find(s => span / s <= 12) || 100;
    let s = "";
    o.rows.forEach((r, i) => { const y = T + i * rh + rh / 2; s += "<line x1='" + L + "' x2='" + (W - R) + "' y1='" + y + "' y2='" + y + "' stroke='var(--line)'/>" + txt(L - 8, y + 4, r, { a: "end", s: 10.5 }); });
    for (let t = Math.ceil(o.x0 / st) * st; t <= o.x1; t += st) s += "<line x1='" + X(t) + "' x2='" + X(t) + "' y1='" + T + "' y2='" + (T + rowsN * rh) + "' stroke='var(--line)' stroke-dasharray='2 3'/>" + txt(X(t), T + rowsN * rh + 16, t, { s: 10 });
    o.points.forEach(p => {
      const cx = X(p.x).toFixed(1), cy = T + p.row * rh + rh / 2;
      s += p.kind === "k" ? "<path d='M" + cx + " " + (cy - 7) + " l7 7 l-7 7 l-7 -7z' fill='var(--bad)' stroke='var(--card)'><title>" + esc(p.tip) + "</title></path>"
                          : "<circle cx='" + cx + "' cy='" + cy + "' r='4.6' fill='var(--ac)' stroke='var(--card)' stroke-width='1'><title>" + esc(p.tip) + "</title></circle>";
    });
    return svg(h, s, o.title || "linimasa");
  }
  /** points[{x,y,c}] (c = indeks warna), y dalam jam desimal; xticks[{x,label}] */
  function scatter(o) {
    const h = 300, L = 48, R = 14, T = 14, B = 34, iw = W - L - R, ih = h - T - B, X = x => L + (x - o.x0) / (o.x1 - o.x0) * iw, Y = y => T + (1 - (y - o.y0) / (o.y1 - o.y0)) * ih;
    const col = o.colors || ["var(--ac)", "var(--bad)"];
    let s = "";
    for (let y = Math.ceil(o.y0); y <= o.y1; y += (o.y1 - o.y0 > 12 ? 2 : 1)) s += "<line x1='" + L + "' x2='" + (W - R) + "' y1='" + Y(y) + "' y2='" + Y(y) + "' stroke='var(--line)'/>" + txt(L - 6, Y(y) + 4, String(y).padStart(2, "0") + ":00", { a: "end", s: 10 });
    (o.xticks || []).forEach(t => { s += "<line x1='" + X(t.x) + "' x2='" + X(t.x) + "' y1='" + T + "' y2='" + (T + ih) + "' stroke='var(--line)' stroke-dasharray='2 3'/>" + txt(X(t.x), T + ih + 16, t.label, { s: 10 }); });
    o.points.forEach(p => { s += "<circle cx='" + X(p.x).toFixed(1) + "' cy='" + Y(p.y).toFixed(1) + "' r='1.9' fill='" + col[p.c] + "'><title>" + esc(p.tip || "") + "</title></circle>"; });
    return svg(h, s, o.title || "sebaran waktu");
  }

  /**
   * Garis waktu harian berblok (gaya Drik Panchang, tiap unsur satu warna): t0 (terbit) → t1 (terbit berikutnya).
   * o: {t0, t1, sunrise, sunset, tz, fmt(jd)→"hh:mm", hour12, rows:[{label, type, warna?, items, nama?}]}
   * type 'seg'    : blok berurutan [{a,b,nama,short?,tip}]; warna = [nuansa1, nuansa2] bergantian; jam pergantian di bawah blok
   * type 'vara'   : satu blok sepanjang jendela (nama hari)
   * type 'bar'    : blok berwarna per butir [{a,b,nama,warna,tip}] (mis. Caughaḍiyā)
   * type 'vbar'   : blok tinggi dengan nama diputar tegak [{a,b,nama,warna,tip}] (mis. 30 muhūrta)
   * type 'bracket': braket berlabel [{a,b,nama,warna,tip}]; label berdekatan disusun berundak
   */
  function dayline(o) {
    const Wd = 900, L = 106, R = 26, iw = Wd - L - R, axisY = 44, rows = o.rows, UP = { seg: 15, vara: 15, bar: 13, bracket: 16, vbar: 44 }, DN = { seg: 36, vara: 16, bar: 14, bracket: 20, vbar: 45 };
    const X = jd => L + (jd - o.t0) / (o.t1 - o.t0) * iw, tw = (t, fs) => String(t).length * 0.6 * fs;
    const fit = (t, w, fs) => { if (tw(t, fs) <= w - 4) return t; const k = Math.floor((w - 4) / (0.6 * fs)) - 1; return k >= 4 ? String(t).slice(0, k) + "…" : ""; };
    let yy = 100, prev = null; const ys = rows.map(r => { const u = UP[r.type] || 15; yy += (prev == null ? u : (DN[prev] + 10 + u)); prev = r.type; return yy; });
    const H = yy + (DN[prev] || 16) + 14, sep = "stroke='var(--card)' stroke-width='1.6'";
    let s = "";
    s += "<rect x='" + X(o.sunrise).toFixed(1) + "' y='" + (axisY - 20) + "' width='" + (X(o.sunset) - X(o.sunrise)).toFixed(1) + "' height='" + (H - axisY + 6) + "' fill='var(--ac2)'/>";
    s += "<line x1='" + L + "' x2='" + (Wd - R) + "' y1='" + axisY + "' y2='" + axisY + "' stroke='var(--mut)' stroke-width='1.4'/>";
    const lh0 = ((((o.t0 + 0.5 + o.tz / 24) % 1) + 1) % 1) * 24;
    for (let h = Math.ceil(lh0 - 1e-9); ; h++) {
      const jd = o.t0 + (h - lh0) / 24; if (jd > o.t1 + 1e-9) break;
      const hh = ((h % 24) + 24) % 24, lab = o.hour12 ? String((hh % 12) || 12) : String(hh);
      s += "<line x1='" + X(jd).toFixed(1) + "' x2='" + X(jd).toFixed(1) + "' y1='" + axisY + "' y2='" + (axisY + 5) + "' stroke='var(--mut)'/>" + txt(X(jd), axisY + 18, lab, { s: 11 });
    }
    const sun = (jd, lab) => { const x = X(jd); return "<path d='M" + (x - 9).toFixed(1) + " " + axisY + " A9 9 0 0 1 " + (x + 9).toFixed(1) + " " + axisY + " Z' fill='#f5a623' stroke='#b8740a' stroke-width='1.2'/>" + txt(x, axisY - 14, lab, { s: 11, fill: "var(--fg)" }); };
    s += sun(o.t0, o.fmt(o.t0)) + sun(o.sunset, o.fmt(o.sunset)) + sun(o.t1, o.fmt(o.t1));
    // garis putus-putus penghubung sumbu → blok (digambar di bawah blok agar tak mengiris blok baris lain)
    rows.forEach((r, i) => { if (r.type === "seg") r.items.forEach(it => { if (it.b < o.t1 - 1e-6) { const x = X(it.b).toFixed(1); s += "<line x1='" + x + "' x2='" + x + "' y1='" + (axisY + 24) + "' y2='" + (ys[i] - 15) + "' stroke='var(--mut)' stroke-width='.9' stroke-dasharray='3 3' opacity='.55'/>"; } }); });
    const stagger = (items, y, fs) => { const lv = []; return items.map(it => { const xa = X(Math.max(it.a, o.t0)), xb = X(Math.min(it.b, o.t1)), w = tw(it.nama, fs), cx = (xa + xb) / 2, x0 = cx - w / 2, x1 = cx + w / 2; let k = 0; while (lv[k] != null && x0 < lv[k] + 4) k++; lv[k] = x1; return { it, xa, xb, cx, y: y - k * 12 }; }); };
    const bracket = (it, xa, xb, by, cx, ly, fs) => "<path d='M" + xa.toFixed(1) + " " + (by - 5) + " V" + (by + 5) + " M" + xa.toFixed(1) + " " + by + " H" + xb.toFixed(1) + " M" + xb.toFixed(1) + " " + (by - 5) + " V" + (by + 5) + "' stroke='" + it.warna + "' stroke-width='1.6' fill='none'><title>" + esc(it.tip || it.nama) + "</title></path>" + txt(cx, ly, it.nama, { s: fs, fill: it.warna });
    rows.forEach((r, i) => {
      const y0 = ys[i], warna = r.warna || ["#3b6fd1", "#5b8def"];
      s += txt(L - 8, y0 + 4, r.label, { a: "end", s: 11.5, fill: "var(--fg)" });
      if (r.type === "seg") {
        r.items.forEach((it, k) => {
          const xa = X(Math.max(it.a, o.t0)), xb = X(Math.min(it.b, o.t1)), w = xb - xa; let lab = fit(it.nama, w, 11.5);
          if (it.short && lab.endsWith("…")) { const f2 = fit(it.short, w, 11.5); if (f2) lab = f2; }
          s += "<rect x='" + xa.toFixed(1) + "' y='" + (y0 - 15) + "' width='" + w.toFixed(1) + "' height='30' rx='3' fill='" + warna[k % warna.length] + "' " + sep + "><title>" + esc(it.tip || it.nama) + "</title></rect>" +
            txt((xa + xb) / 2, y0 + 4.5, lab, { s: 11.5, fill: "#fff" }).replace("<text ", "<text font-weight='600' ");
          if (it.b < o.t1 - 1e-6) s += txt(X(it.b), y0 + 29, o.fmt(it.b), { s: 11, fill: "var(--fg)" });
        });
      } else if (r.type === "vara") {
        s += "<rect x='" + L + "' y='" + (y0 - 15) + "' width='" + iw + "' height='30' rx='3' fill='" + warna[0] + "'><title>" + esc(r.tip || r.nama) + "</title></rect>" + txt(L + iw / 2, y0 + 5, r.nama, { s: 12.5, fill: "#fff" }).replace("<text ", "<text font-weight='600' ");
      } else if (r.type === "bar" || r.type === "vbar") {
        const hh = r.type === "bar" ? 26 : 88, y1 = y0 - hh / 2;
        r.items.forEach(it => {
          const xa = X(Math.max(it.a, o.t0)), xb = X(Math.min(it.b, o.t1)), w = xb - xa, cx = (xa + xb) / 2;
          s += "<rect x='" + xa.toFixed(1) + "' y='" + y1 + "' width='" + Math.max(0, w).toFixed(1) + "' height='" + hh + "' rx='3' fill='" + it.warna + "' " + sep + "><title>" + esc(it.tip || it.nama) + "</title></rect>";
          if (r.type === "bar") s += txt(cx, y0 + 4, fit(it.nama, w, 10), { s: 10, fill: "#fff" });
          else if (w >= 11) s += txt(cx, y0 + 3.5, it.nama.length > 14 ? it.nama.slice(0, 13) + "…" : it.nama, { s: 9.5, fill: "#fff", rot: -90 });
        });
      } else {
        s += "<line x1='" + L + "' x2='" + (Wd - R) + "' y1='" + y0 + "' y2='" + y0 + "' stroke='var(--line)'/>";
        stagger(r.items, y0 + 3, 10.5).forEach(g => { s += bracket(g.it, g.xa, g.xb, y0 + 12, g.cx, g.y, 10.5); });
      }
    });
    return svg(H, s, o.title || "Garis waktu harian").replace("viewBox='0 0 " + W + " " + H + "'", "viewBox='0 0 " + Wd + " " + H + "'");
  }
  const palette = ["#1f9d74", "#d98e04", "#3b7dd8", "#c0392b", "#8e5bd1", "#0e9aa7", "#7a8b2c", "#c2548a", "#6b7280"];
  /**
   * Grafik garis multi-seri. series[{name,color,pts:[nilai|null]}], labels[] (label sumbu-x per titik),
   * mode 'abs' (jam desimal → hh:mm) atau 'delta' (menit) atau 'num' (angka biasa); null memutus garis.
   */
  function lines(o) {
    const all0 = []; o.series.forEach(s => s.pts.forEach(v => { if (v != null) all0.push(v); }));
    const Lw = (o.mode || "abs") === "abs" && all0.length && (Math.max(...all0) >= 24 || Math.min(...all0) < 0) ? 76 : 54;   // ruang label "(+1)"
    const h = o.h || 320, L = Lw, R = 14, T = 14, B = 34, iw = W - L - R, ih = h - T - B, n = o.labels.length, mode = o.mode || "abs";
    const all = []; o.series.forEach(s => s.pts.forEach(v => { if (v != null) all.push(v); }));
    if (!all.length) return "<p class='note'>Tidak ada data untuk ditampilkan.</p>";
    let lo = Math.min(...all), hi = Math.max(...all), step;
    if (mode === "abs") { const r = hi - lo || 1; step = [0.25, 0.5, 1, 2, 3, 4, 6].find(s => r / s <= 8) || 6; lo = Math.floor(lo / step) * step; hi = Math.ceil(hi / step) * step; if (hi === lo) hi += step; }
    else { const nn = nice((hi - lo) || 1, 5); step = nn.step; lo = Math.floor(lo / step) * step; hi = Math.ceil(hi / step) * step; if (hi === lo) hi += step; }
    const X = i => L + (n > 1 ? i / (n - 1) : 0.5) * iw, Y = v => T + (1 - (v - lo) / (hi - lo)) * ih;
    const fmtY = mode === "abs" ? v => { const t = Math.round(v * 60), dd = Math.floor(t / 1440), hh = ((Math.floor(t / 60) % 24) + 24) % 24; return String(hh).padStart(2, "0") + ":" + String(((t % 60) + 60) % 60).padStart(2, "0") + (dd ? " (" + (dd > 0 ? "+" : "−") + Math.abs(dd) + ")" : ""); } : (o.yFmt || (v => num(v).replace("-", "−")));
    let s = "";
    for (let v = lo; v <= hi + 1e-9; v += step) s += "<line x1='" + L + "' x2='" + (W - R) + "' y1='" + Y(v).toFixed(1) + "' y2='" + Y(v).toFixed(1) + "' stroke='" + (mode === "delta" && Math.abs(v) < 1e-9 ? "var(--mut)" : "var(--line)") + "'/>" + txt(L - 6, Y(v) + 4, fmtY(v), { a: "end", s: 10 });
    if (o.yUnit) s += txt(L, 9, o.yUnit, { a: "start", s: 10 });
    const every = Math.max(1, Math.ceil(n / 9));
    for (let i = 0; i < n; i += every) s += "<line x1='" + X(i).toFixed(1) + "' x2='" + X(i).toFixed(1) + "' y1='" + T + "' y2='" + (T + ih) + "' stroke='var(--line)' stroke-dasharray='2 3'/>" + txt(X(i), T + ih + 16, o.labels[i], { s: 10 });
    const tips = n * o.series.length <= 500;
    o.series.forEach((se, k) => {
      const col = se.color || palette[k % palette.length]; let seg = [];
      const flush = () => { if (seg.length > 1) s += "<polyline fill='none' stroke='" + col + "' stroke-width='1.9' stroke-linejoin='round' points='" + seg.join(" ") + "'/>"; seg = []; };
      se.pts.forEach((v, i) => {
        if (v == null) { flush(); return; }
        seg.push(X(i).toFixed(1) + "," + Y(v).toFixed(1));
        if (n <= 45 || tips) s += "<circle cx='" + X(i).toFixed(1) + "' cy='" + Y(v).toFixed(1) + "' r='" + (n <= 45 ? 2.4 : 1.6) + "' fill='" + col + "'><title>" + esc(se.name + " · " + o.labels[i] + " · " + (o.tip ? o.tip(v) : fmtY(v))) + "</title></circle>";
      });
      flush();
    });
    return svg(h, s, o.title || "grafik garis");
  }
  return { bar, timeline, scatter, lines, dayline, palette, nice };
})();
