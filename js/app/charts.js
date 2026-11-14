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
    if (o.mean != null) { const y = T + ih - o.mean / mx.max * ih; s += "<line x1='" + L + "' x2='" + (W - R) + "' y1='" + y + "' y2='" + y + "' stroke='var(--warn)' stroke-dasharray='5 4'/>" + txt(W - R, y - 4, o.meanLabel || "rata-rata", { a: "end", s: 10, fill: "var(--warn)" }); }
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
  return { bar, timeline, scatter, nice };
})();
