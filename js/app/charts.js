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
   * Garis waktu harian berblok (gaya Drik Panchang, tiap unsur satu warna) untuk jendela 24 jam sembarang [t0, t1] (JD UT).
   * o: {t0, t1, tz, fmt(jd)→"hh:mm", hour12, idp, siang:[[terbit,terbenam],…], matahari:[{jd,jenis}], rows:[{label, type, warna?, items}]}
   * type 'seg'    : blok berurutan [{a,b,nama,short?,tip,endLabel?,akhirAsli?}]; nama di dalam blok, jam pergantian di bawah blok
   * type 'bar'    : blok rendah berwarna per butir [{a,b,nama,warna,tip}] (mis. Caughaḍiyā)
   * type 'vbar'   : blok tinggi dengan nama diputar tegak [{a,b,nama,warna,tip}] (mis. 30 muhūrta)
   * type 'bracket': braket berlabel [{a,b,nama,warna,tip}]; label berdekatan disusun berundak
   * Blok seg/bar/vbar diberi id "<idp>-<baris>-<butir>" agar dapat disorot; kursor waktu: elemen "<idp>-cur" dan "<idp>-curt".
   */
  function dayline(o) {
    const Wd = 900, L = 106, R = 26, iw = Wd - L - R, axisY = 44, rows = o.rows, idp = o.idp || "pb", UP = { seg: 15, bar: 13, bracket: 16, vbar: 44 }, DN = { seg: 36, bar: 14, bracket: 20, vbar: 45 };
    const X = jd => L + (jd - o.t0) / (o.t1 - o.t0) * iw, tw = (t, fs) => String(t).length * 0.6 * fs;
    const fit = (t, w, fs) => { if (tw(t, fs) <= w - 4) return t; const k = Math.floor((w - 4) / (0.6 * fs)) - 1; return k >= 4 ? String(t).slice(0, k) + "…" : ""; };
    let yy = 100, prev = null; const ys = rows.map(r => { const u = UP[r.type] || 15; yy += (prev == null ? u : (DN[prev] + 10 + u)); prev = r.type; return yy; });
    const H = yy + (DN[prev] || 16) + 14, sep = "stroke='var(--card)' stroke-width='1.6'";
    const siang = o.siang || [[o.sunrise, o.sunset]], ev = o.matahari || [{ jd: o.t0, jenis: "terbit" }, { jd: o.sunset, jenis: "terbenam" }, { jd: o.t1, jenis: "terbit" }];
    let s = ""; const hl = [], hlr = (i, k, x, y, w, h) => hl.push("<rect id='" + idp + "-h-" + i + "-" + k + "' x='" + x.toFixed(1) + "' y='" + y + "' width='" + Math.max(0, w).toFixed(1) + "' height='" + h + "' rx='3' fill='none' stroke='#ffc928' stroke-width='3.2' visibility='hidden' pointer-events='none'/>");
    siang.forEach(([a, b]) => { const xa = X(Math.max(a, o.t0)), xb = X(Math.min(b, o.t1)); if (xb > xa) s += "<rect x='" + xa.toFixed(1) + "' y='" + (axisY - 20) + "' width='" + (xb - xa).toFixed(1) + "' height='" + (H - axisY + 6) + "' fill='var(--ac2)'/>"; });
    s += "<line x1='" + L + "' x2='" + (Wd - R) + "' y1='" + axisY + "' y2='" + axisY + "' stroke='var(--mut)' stroke-width='1.4'/>";
    const lh0 = ((((o.t0 + 0.5 + o.tz / 24) % 1) + 1) % 1) * 24;
    for (let h = Math.ceil(lh0 - 1e-9); ; h++) {
      const jd = o.t0 + (h - lh0) / 24; if (jd > o.t1 + 1e-9) break;
      const hh = ((h % 24) + 24) % 24, lab = o.hour12 ? String((hh % 12) || 12) : String(hh);
      s += "<line x1='" + X(jd).toFixed(1) + "' x2='" + X(jd).toFixed(1) + "' y1='" + axisY + "' y2='" + (axisY + 5) + "' stroke='var(--mut)'/>" + txt(X(jd), axisY + 18, lab, { s: 11 });
    }
    const sun = (jd, lab) => { const x = X(jd); return "<path d='M" + (x - 9).toFixed(1) + " " + axisY + " A9 9 0 0 1 " + (x + 9).toFixed(1) + " " + axisY + " Z' fill='#f5a623' stroke='#b8740a' stroke-width='1.2'/>" + txt(x, axisY - 14, lab, { s: 11, fill: "var(--fg)" }); };
    ev.filter(e => e.jd >= o.t0 - 1e-6 && e.jd <= o.t1 + 1e-6).forEach(e => { s += sun(e.jd, o.fmt(e.jd)); });
    rows.forEach((r, i) => { if (r.type === "seg") r.items.forEach(it => { if (it.b < o.t1 - 1e-6 && it.b > o.t0 + 1e-6) { const x = X(it.b).toFixed(1); s += "<line x1='" + x + "' x2='" + x + "' y1='" + (axisY + 24) + "' y2='" + (ys[i] - 15) + "' stroke='var(--mut)' stroke-width='.9' stroke-dasharray='3 3' opacity='.55'/>"; } }); });
    const stagger = (items, y, fs) => { const lv = []; return items.map(it => { const xa = X(Math.max(it.a, o.t0)), xb = X(Math.min(it.b, o.t1)), w = tw(it.nama, fs), cx = (xa + xb) / 2, x0 = cx - w / 2, x1 = cx + w / 2; let k = 0; while (lv[k] != null && x0 < lv[k] + 4) k++; lv[k] = x1; return { it, xa, xb, cx, y: y - k * 12 }; }); };
    const bracket = (it, xa, xb, by, cx, ly, fs) => "<path d='M" + xa.toFixed(1) + " " + (by - 5) + " V" + (by + 5) + " M" + xa.toFixed(1) + " " + by + " H" + xb.toFixed(1) + " M" + xb.toFixed(1) + " " + (by - 5) + " V" + (by + 5) + "' stroke='" + it.warna + "' stroke-width='1.6' fill='none'><title>" + esc(it.tip || it.nama) + "</title></path>" + txt(cx, ly, it.nama, { s: fs, fill: it.warna });
    rows.forEach((r, i) => {
      const y0 = ys[i], warna = r.warna || ["#3b6fd1", "#5b8def"];
      s += txt(L - 8, y0 + 4, r.label, { a: "end", s: 11.5, fill: "var(--fg)" });
      if (r.type === "seg") {
        r.items.forEach((it, k) => {
          const xa = X(Math.max(it.a, o.t0)), xb = X(Math.min(it.b, o.t1)), w = xb - xa; if (w <= 0) return; let lab = fit(it.nama, w, 11.5);
          if (it.short && lab.endsWith("…")) { const f2 = fit(it.short, w, 11.5); if (f2) lab = f2; }
          s += "<rect id='" + idp + "-" + i + "-" + k + "' x='" + xa.toFixed(1) + "' y='" + (y0 - 15) + "' width='" + w.toFixed(1) + "' height='30' rx='3' fill='" + warna[k % warna.length] + "' " + sep + "><title>" + esc(it.tip || it.nama) + "</title></rect>" +
            txt((xa + xb) / 2, y0 + 4.5, lab, { s: 11.5, fill: "#fff" }).replace("<text ", "<text font-weight='600' pointer-events='none' ");
          hlr(i, k, xa, y0 - 15, w, 30);
          if (it.b < o.t1 - 1e-6) s += txt(X(it.b), y0 + 29, o.fmt(it.b), { s: 11, fill: "var(--fg)" });
          else if (it.endLabel) s += txt(xb, y0 + 29, "berakhir " + o.fmt(it.akhirAsli) + (it.akhirAsli > o.t1 + 1e-6 ? " (hari berikutnya)" : ""), { a: "end", s: 11, fill: "var(--fg)" });
        });
      } else if (r.type === "bar" || r.type === "vbar") {
        const hh = r.type === "bar" ? 26 : 88, y1 = y0 - hh / 2;
        r.items.forEach((it, k) => {
          const xa = X(Math.max(it.a, o.t0)), xb = X(Math.min(it.b, o.t1)), w = xb - xa, cx = (xa + xb) / 2; if (w <= 0) return;
          s += "<rect id='" + idp + "-" + i + "-" + k + "' x='" + xa.toFixed(1) + "' y='" + y1 + "' width='" + Math.max(0, w).toFixed(1) + "' height='" + hh + "' rx='3' fill='" + it.warna + "' " + sep + "><title>" + esc(it.tip || it.nama) + "</title></rect>";
          hlr(i, k, xa, y1, w, hh);
          if (r.type === "bar") s += txt(cx, y0 + 4, fit(it.nama, w, 10), { s: 10, fill: "#fff" }).replace("<text ", "<text pointer-events='none' ");
          else if (w >= 11) s += txt(cx, y0 + 3.5, it.nama.length > 14 ? it.nama.slice(0, 13) + "…" : it.nama, { s: 9.5, fill: "#fff", rot: -90 }).replace("<text ", "<text pointer-events='none' ");
        });
      } else {
        s += "<line x1='" + L + "' x2='" + (Wd - R) + "' y1='" + y0 + "' y2='" + y0 + "' stroke='var(--line)'/>";
        stagger(r.items, y0 + 3, 10.5).forEach(g => { s += bracket(g.it, g.xa, g.xb, y0 + 12, g.cx, g.y, 10.5); });
      }
    });
    s += hl.join("");
    // kursor waktu (digeser oleh slider)
    s += "<line id='" + idp + "-cur' x1='" + L + "' x2='" + L + "' y1='" + (axisY - 22) + "' y2='" + (H - 6) + "' stroke='#ffc928' stroke-width='2.4' pointer-events='none'/>" +
      "<text id='" + idp + "-curt' x='" + L + "' y='10' font-size='11' font-weight='700' fill='#ffc928' text-anchor='middle' pointer-events='none'></text>";
    return svg(H, s, o.title || "Garis waktu harian").replace("viewBox='0 0 " + W + " " + H + "'", "viewBox='0 0 " + Wd + " " + H + "'");
  }

  /**
   * Garis waktu satu bulan (sumbu = tanggal sipil lokal). o = {t0,t1 (JD UT), tz, rows, sel:[a,b], marks:[{jd,t}], title}.
   * rows[i] = {label, type:'seg'|'vseg', h (tinggi vseg), items:[{a,b,nama,warna,tip}]}; seg = label mendatar, vseg = label tegak.
   */
  function monthline(o) {
    const Wd = 900, L = 106, R = 16, iw = Wd - L - R, axisY = 62, sep = "stroke='var(--card)' stroke-width='1.6'";
    const X = jd => L + (jd - o.t0) / (o.t1 - o.t0) * iw, tw = (t, fs) => String(t).length * 0.6 * fs;
    const MON = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"], HR = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    let y = axisY + 36; const ys = o.rows.map(r => { const top = y; y += (r.type === "vseg" ? r.h : 30) + 10; return top; }), H = y + 4;
    const fit = (t, mx, fs, vert) => { t = String(t); const k = Math.floor((mx - 6) / (0.6 * fs)); return t.length <= k ? t : (k >= 4 ? t.slice(0, k - 1) + "…" : ""); };
    let g = "", s = "";
    if (o.sel) { const xa = X(Math.max(o.sel[0], o.t0)), xb = X(Math.min(o.sel[1], o.t1)); if (xb > xa) g += "<rect x='" + xa.toFixed(1) + "' y='" + (axisY - 16) + "' width='" + (xb - xa).toFixed(1) + "' height='" + (H - axisY + 10) + "' fill='#ffc928' opacity='.28'/>"; }
    g += "<line x1='" + L + "' x2='" + (Wd - R) + "' y1='" + axisY + "' y2='" + axisY + "' stroke='var(--mut)' stroke-width='1.4'/>";
    const n0 = Math.floor(o.t0 + 0.5 + o.tz / 24 + 1e-9); let firstLab = true;
    for (let n = n0; ; n++) {
      const jd = n - 0.5 - o.tz / 24; if (jd > o.t1) break;
      const dt = new Date((jd - 2440587.5) * 864e5 + o.tz * 36e5), a = Math.max(jd, o.t0), b = Math.min(jd + 1, o.t1);
      if (jd >= o.t0 - 1e-9) g += "<line x1='" + X(jd).toFixed(1) + "' x2='" + X(jd).toFixed(1) + "' y1='" + axisY + "' y2='" + (H - 4) + "' stroke='var(--line)' stroke-width='.8' opacity='.7'/>";
      if (X(b) - X(a) >= 12) {
        const cx = (X(a) + X(b)) / 2, dd = dt.getUTCDate();
        g += txt(cx, axisY + 14, String(dd), { s: 11, fill: "var(--fg)" }) + txt(cx, axisY + 26, HR[dt.getUTCDay()], { s: 8.5, fill: dt.getUTCDay() === 5 ? "var(--ac)" : "var(--mut)" });
        if (dd === 1 || firstLab) g += txt(X(a) + 2, axisY - 30, MON[dt.getUTCMonth()] + " " + dt.getUTCFullYear(), { s: 11.5, a: "start", fill: "var(--fg)" }).replace("<text ", "<text font-weight='700' ");
        firstLab = false;
      }
    }
    (o.marks || []).filter(m => m.jd >= o.t0 && m.jd <= o.t1).forEach(m => { g += "<text x='" + X(m.jd).toFixed(1) + "' y='" + (axisY - 8) + "' font-size='14' text-anchor='middle'><title>" + esc(m.tip || "") + "</title>" + m.t + "</text>"; });
    o.rows.forEach((r, i) => {
      const y0 = ys[i], h = r.type === "vseg" ? r.h : 30;
      s += txt(L - 8, y0 + h / 2 + 4, r.label, { a: "end", s: 11.5, fill: "var(--fg)" });
      r.items.forEach(it => {
        const xa = X(Math.max(it.a, o.t0)), xb = X(Math.min(it.b, o.t1)), w = xb - xa; if (w <= 0.5) return;
        s += "<rect x='" + xa.toFixed(1) + "' y='" + y0 + "' width='" + w.toFixed(1) + "' height='" + h + "' rx='3' fill='" + it.warna + "' " + sep + "><title>" + esc(it.tip || it.nama) + "</title></rect>";
        if (r.type === "vseg") { if (w >= 11) s += txt((xa + xb) / 2, y0 + h / 2 + 3.5, fit(it.nama, h, 9.5), { s: 9.5, fill: "#fff", rot: -90 }).replace("<text ", "<text pointer-events='none' "); }
        else { const lab = fit(it.nama, w, 11.5); if (lab) s += txt((xa + xb) / 2, y0 + 19, lab, { s: 11.5, fill: "#fff" }).replace("<text ", "<text font-weight='600' pointer-events='none' "); }
      });
    });
    return svg(H, g + s, o.title || "Garis waktu satu bulan").replace("viewBox='0 0 " + W + " " + H + "'", "viewBox='0 0 " + Wd + " " + H + "'");
  }

  /**
   * Grafik panjang unsur berurutan. o = {pts:[{x,y,tip,c}], xt:[{x,label}], x0,x1, mean, imax, imin, fmtY, yTitle, labMax, labMin, rot, title}.
   * Sumbu-y tidak dimulai dari nol agar selisih terlihat; titik terpanjang (merah) dan terpendek (hijau) diberi label.
   */
  function durasi(o) {
    const Wd = 900, L = 64, R = 20, T = 26, B = o.rot ? 54 : 40, h = o.h || 300, iw = Wd - L - R, ih = h - T - B, pts = o.pts, f = o.fmtY || num;
    const xs = pts.map(p => p.x), ys = pts.map(p => p.y), x0 = o.x0 != null ? o.x0 : Math.min(...xs), x1 = o.x1 != null ? o.x1 : Math.max(...xs);
    const mn = Math.min(...ys), mx = Math.max(...ys), pad = (mx - mn) * 0.18 || 1, st = nice(mx - mn + 2 * pad, 5).step, y0 = Math.floor((mn - pad) / st) * st, y1 = Math.ceil((mx + pad) / st) * st;
    const X = x => L + (x - x0) / ((x1 - x0) || 1) * iw, Y = v => T + ih - (v - y0) / ((y1 - y0) || 1) * ih;
    let s = "";
    for (let v = y0; v <= y1 + 1e-9; v += st) s += "<line x1='" + L + "' x2='" + (Wd - R) + "' y1='" + Y(v).toFixed(1) + "' y2='" + Y(v).toFixed(1) + "' stroke='var(--line)'/>" + txt(L - 6, Y(v) + 4, f(v), { a: "end" });
    (o.xt || []).forEach(t => { s += "<line x1='" + X(t.x).toFixed(1) + "' x2='" + X(t.x).toFixed(1) + "' y1='" + T + "' y2='" + (T + ih) + "' stroke='var(--line)' stroke-dasharray='2 3'/>" + txt(X(t.x), T + ih + (o.rot ? 12 : 16), t.label, { s: 10, rot: o.rot, a: o.rot ? "end" : "middle" }); });
    s += "<polyline fill='none' stroke='var(--mut)' stroke-opacity='.55' stroke-width='1.2' points='" + pts.map(p => X(p.x).toFixed(1) + "," + Y(p.y).toFixed(1)).join(" ") + "'/>";
    const r = pts.length > 150 ? 2.2 : pts.length > 60 ? 3 : 4;
    pts.forEach(p => { s += "<circle cx='" + X(p.x).toFixed(1) + "' cy='" + Y(p.y).toFixed(1) + "' r='" + r + "' fill='" + (p.c || "var(--ac)") + "'><title>" + esc(p.tip || "") + "</title></circle>"; });
    if (o.mean != null) s += "<line x1='" + L + "' x2='" + (Wd - R) + "' y1='" + Y(o.mean).toFixed(1) + "' y2='" + Y(o.mean).toFixed(1) + "' stroke='var(--warn)' stroke-width='1.6' stroke-dasharray='6 4'/>" + txt(Wd - R, Y(o.mean) - 5, "rata-rata " + f(o.mean), { a: "end", s: 10.5, fill: "var(--warn)" });
    const mark = (i, col, lab, above) => { if (i == null) return; const p = pts[i], x = X(p.x), y = Y(p.y), a = x > Wd - 150 ? "end" : x < L + 120 ? "start" : "middle";
      s += "<circle cx='" + x.toFixed(1) + "' cy='" + y.toFixed(1) + "' r='" + (r + 3.5) + "' fill='none' stroke='" + col + "' stroke-width='2.4'/>" + txt(x + (a === "end" ? 6 : a === "start" ? -6 : 0), y + (above ? -(r + 9) : r + 17), lab, { a, s: 11, fill: col }).replace("<text ", "<text font-weight='700' "); };
    mark(o.imax, "#d9534f", o.labMax || "terpanjang", true); mark(o.imin, "#1f9d74", o.labMin || "terpendek", false);
    if (o.yTitle) s += txt(14, T + ih / 2, o.yTitle, { rot: -90, s: 10.5 });
    return svg(h, s, o.title || "Grafik panjang unsur").replace("viewBox='0 0 " + W + " " + h + "'", "viewBox='0 0 " + Wd + " " + h + "'");
  }
  /** Posisi-x (satuan viewBox) suatu JD pada garis waktu harian berjendela [t0, t1]; konstanta sama dengan dayline(). */
  const dayX = (t0, t1, jd) => 106 + (jd - t0) / (t1 - t0) * (900 - 106 - 26);
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
  return { bar, timeline, scatter, lines, dayline, monthline, durasi, dayX, palette, nice };
})();
