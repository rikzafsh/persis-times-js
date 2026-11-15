/**
 * jadwal_service.js — TAMBAHAN (bukan port dari Dart): jadwal waktu lengkap satu hari.
 *  • waktu salat (hisab berdetik dan jadwal ber-ihtiyat) + imsak,
 *  • waktu astronomis: fajar/senja astronomis (−18°), nautis (−12°), sipil (−6°), terbit/terbenam Matahari, transit,
 *    Bulan terbit/transit/terbenam, lama siang & malam,
 *  • keterangan kriteria tiap waktu menurut metode terpilih.
 * Memakai WaktuSalat, SunFunction, MoonFunction hasil port. Jam = jam desimal pada zona waktu tmZn.
 *
 * Definisi (sesuai kode pustaka Dart):
 *  hisab  = nilai mentah berdetik;   jadwal = menit hisab dibulatkan ke bawah + ihtiyat (ihtiyathShalat).
 *  Imsak  = Subuh − n menit (n bisa diatur, bawaan 10).
 */
const STATUS_KET = {
  up: "Matahari selalu di atas ufuk", down: "Matahari selalu di bawah ufuk",
  bright: "Langit tidak cukup gelap (senja tak berakhir)", dark: "Matahari tidak mencapai sudut ini", invalid: "Tidak dapat dihitung",
};

class JadwalLengkap {
  constructor() {
    this.ws = new WaktuSalat(); this.wp = new WaktuPelengkap(); this.mo = new MoonFunction(); this.sn = new SunFunction();
    this.dt = new DynamicalTime(); this.jd = new JulianDay();
  }
  /** Malam Ramadan? (bulan Hijriah 9 pada hari berikutnya menurut kalender Ummul Qura bawaan peramban). */
  ramadan(d, mo, y) {
    try {
      const t = new Date(Date.UTC(y, mo - 1, d + 1)), p = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", { month: "numeric", timeZone: "UTC" }).formatToParts(t).find(x => x.type === "month");
      return +p.value === 9;
    } catch (e) { return false; }
  }
  _mod24(x) { return ((x % 24) + 24) % 24; }

  /**
   * Nilai mentah (hisab) beberapa waktu sekaligus — hemat untuk grafik. keys ⊂ DAFTAR (di bawah).
   * Hasil: { key: jam desimal | null }  (lama siang/malam dalam jam).
   */
  nilai(d, mo, y, L, keys, opt = {}) {
    const { lon, lat, elev, tz } = L, method = L.method || PrayerMethod.persatuanIslam, n = opt.imsakMenit == null ? 10 : opt.imsakMenit, c = {}, ws = this.ws;
    const v = sv => (sv && sv.isNormal ? sv.time : null);
    const m = (k, f) => (k in c ? c[k] : (c[k] = f()));
    const G = {
      subuh: () => m("subuh", () => v(ws.subuh(d, mo, y, lon, lat, tz, method.hmSubuh))),
      imsak: () => { const s = G.subuh(); return s == null ? null : s - n / 60; },
      syuruk: () => m("syuruk", () => v(ws.syuruk(d, mo, y, lon, lat, elev, tz))),
      duha: () => { const s = G.syuruk(); return s == null ? null : s + 0.25; },
      zuhur: () => m("zuhur", () => v(ws.zuhur(d, mo, y, lon, tz))),
      asar: () => m("asar", () => v(ws.asar(d, mo, y, lon, lat, tz))),
      magrib: () => m("magrib", () => v(ws.magrib(d, mo, y, lon, lat, elev, tz))),
      isya: () => m("isya", () => {
        if (method.isyaBerbasisInterval) { const mg = G.magrib(); if (mg == null) return null; const r = opt.ramadan == null ? this.ramadan(d, mo, y) : opt.ramadan; return mg + (r ? (method.isyaMenitSetelahMagribRamadan ?? method.isyaMenitSetelahMagrib) : method.isyaMenitSetelahMagrib) / 60; }
        return v(ws.isya(d, mo, y, lon, lat, tz, method.hmIsya));
      }),
      nisfu: () => { const mg = G.magrib(), s = G.subuh(); return mg == null || s == null ? null : this._mod24(mg + this._mod24(s - mg) / 2); },
      sepertigaPertama: () => { const mg = G.magrib(), s = G.subuh(); return mg == null || s == null ? null : this._mod24(mg + this._mod24(s - mg) / 3); },
      sepertigaTerakhir: () => { const mg = G.magrib(), s = G.subuh(); return mg == null || s == null ? null : this._mod24(mg + 2 * this._mod24(s - mg) / 3); },
      fajarAstro: () => v(ws.subuh(d, mo, y, lon, lat, tz, -18)), fajarNaut: () => v(ws.subuh(d, mo, y, lon, lat, tz, -12)), fajarSipil: () => v(ws.subuh(d, mo, y, lon, lat, tz, -6)),
      senjaSipil: () => v(ws.isya(d, mo, y, lon, lat, tz, -6)), senjaNaut: () => v(ws.isya(d, mo, y, lon, lat, tz, -12)), senjaAstro: () => v(ws.isya(d, mo, y, lon, lat, tz, -18)),
      bulanTerbit: () => this._bulan(d, mo, y, L, "RISE"), bulanTransit: () => this._bulan(d, mo, y, L, "TRANSIT"), bulanTerbenam: () => this._bulan(d, mo, y, L, "SET"),
      lamaSiang: () => { const a = G.syuruk(), b = G.magrib(); return a == null || b == null ? null : this._mod24(b - a); },
      lamaMalam: () => { const s = G.lamaSiang(); return s == null ? null : 24 - s; },
    };
    const out = {}; keys.forEach(k => { out[k] = G[k](); }); return out;
  }
  _bulan(d, mo, y, L, tipe) { const r = this.mo.moonTransitRiseSet(d, mo, y, L.lon, L.lat, L.elev, L.tz, tipe, 3); return r === 0 || r == null || Number.isNaN(r) ? null : r; }

  /** Seluruh jadwal satu hari: { hisab:{key:SalatValue}, jadwal:{key:SalatValue}, astro:{key:jam|null}, status:{key:kode} } */
  hitung(d, mo, y, L, opt = {}) {
    const { lon, lat, elev, tz } = L, method = L.method || PrayerMethod.persatuanIslam, iht = opt.iht == null ? (L.iht || 0) : opt.iht, n = opt.imsakMenit == null ? 10 : opt.imsakMenit, ws = this.ws;
    const sv = { subuh: ws.subuh(d, mo, y, lon, lat, tz, method.hmSubuh), syuruk: ws.syuruk(d, mo, y, lon, lat, elev, tz), zuhur: ws.zuhur(d, mo, y, lon, tz), asar: ws.asar(d, mo, y, lon, lat, tz), magrib: ws.magrib(d, mo, y, lon, lat, elev, tz) };
    const ok = x => x && x.isNormal, T = new Set(["subuh", "syuruk", "zuhur", "asar", "magrib"]);
    if (method.isyaBerbasisInterval) {
      const r = opt.ramadan == null ? this.ramadan(d, mo, y) : opt.ramadan, mnt = r ? (method.isyaMenitSetelahMagribRamadan ?? method.isyaMenitSetelahMagrib) : method.isyaMenitSetelahMagrib;
      sv.isya = ok(sv.magrib) ? new SalatValue({ time: sv.magrib.time + mnt / 60, status: SalatStatus.normal }) : sv.magrib;
    } else sv.isya = ws.isya(d, mo, y, lon, lat, tz, method.hmIsya);
    sv.duha = ws.duha(d, mo, y, lon, lat, elev, tz); sv.nisfuLail = ws.nisfuLail(d, mo, y, lon, lat, elev, tz, { prayerMethod: method });
    sv.imsak = ok(sv.subuh) ? new SalatValue({ time: sv.subuh.time - n / 60, status: SalatStatus.normal }) : sv.subuh;
    const hisab = {}, jadwal = {}, status = {};
    for (const k of ["imsak", "subuh", "syuruk", "duha", "zuhur", "asar", "magrib", "isya", "nisfuLail"]) {
      const x = sv[k]; hisab[k] = x; status[k] = x.status;
      if (!ok(x)) { jadwal[k] = x; continue; }
      // jadwal: menit dibulatkan ke bawah + ihtiyat (imsak: jadwal Subuh − n menit)
      jadwal[k] = k === "imsak" ? new SalatValue({ time: ws.ihtiyathShalat(sv.subuh.time, iht) - n / 60, status: SalatStatus.normal }) : new SalatValue({ time: ws.ihtiyathShalat(x.time, iht), status: SalatStatus.normal });
    }
    const astro = this.nilai(d, mo, y, L, ["fajarAstro", "fajarNaut", "fajarSipil", "senjaSipil", "senjaNaut", "senjaAstro", "bulanTerbit", "bulanTransit", "bulanTerbenam", "lamaSiang", "lamaMalam"], opt);
    return { hisab, jadwal, astro, status, ramadan: method.isyaBerbasisInterval ? (opt.ramadan == null ? this.ramadan(d, mo, y) : opt.ramadan) : null };
  }

  /** Keterangan kriteria tiap waktu menurut metode pada tanggal tertentu: [{nama, kriteria, nilai}] */
  kriteria(d, mo, y, L, opt = {}) {
    const { lat, elev, tz } = L, method = L.method || PrayerMethod.persatuanIslam, n = opt.imsakMenit == null ? 10 : opt.imsakMenit, iht = opt.iht == null ? (L.iht || 0) : opt.iht;
    const jd = this.jd.kmjd(d, mo, y, 12, tz), dT = this.dt.deltaT(jd), jde = jd + dT / 86400, f = x => (x < 0 ? "−" : "") + (Math.round(Math.abs(x) * 100) / 100).toString().replace(".", ",");
    const sd = this.sn.sunGeocentricSemidiameter(jde, 0), dip = 1.76 / 60 * Math.sqrt(elev), h0 = -(sd + 34.5 / 60 + dip), dek = this.sn.sunGeocentricDeclination(jde, 0);
    const zm = Math.abs(lat - dek), hAsar = Math.atan(1 / (Math.tan(zm * Math.PI / 180) + 1)) * 180 / Math.PI;
    const hor = "Tepi atas Matahari menyentuh ufuk: h = −(SD + 34,5′ + dip) = −(" + f(sd) + "° + 0,58° + " + f(dip) + "°) = " + f(h0) + "°";
    const isya = method.isyaBerbasisInterval ? method.isyaMenitSetelahMagrib + " menit setelah Magrib" + (method.isyaMenitSetelahMagribRamadan ? " (" + method.isyaMenitSetelahMagribRamadan + " menit pada Ramadan)" : "") : "Matahari " + f(method.hmIsya) + "° (sudut depresi " + f(-method.hmIsya) + "° di bawah ufuk)";
    return [
      { nama: "Imsak", kriteria: n + " menit sebelum Subuh (dapat diatur)", nilai: n + " menit" },
      { nama: "Subuh", kriteria: "Matahari " + f(method.hmSubuh) + "° (sudut depresi " + f(-method.hmSubuh) + "° di bawah ufuk)", nilai: f(method.hmSubuh) + "°" },
      { nama: "Syuruk (terbit)", kriteria: hor, nilai: f(h0) + "°" },
      { nama: "Duha", kriteria: "15 menit setelah Syuruk", nilai: "+15 menit" },
      { nama: "Zuhur", kriteria: "Istiwa: Matahari berkulminasi (12 − e − KWD), ditambah ihtiyat " + iht + " menit pada jadwal", nilai: "kulminasi" },
      { nama: "Asar", kriteria: "Panjang bayangan = tinggi benda + bayangan saat istiwa (cot h = tan|φ−δ| + 1)", nilai: "h = " + f(hAsar) + "°" },
      { nama: "Magrib", kriteria: hor.replace("terbit", "terbenam"), nilai: f(h0) + "°" },
      { nama: "Isya", kriteria: isya, nilai: method.isyaBerbasisInterval ? method.isyaMenitSetelahMagrib + " menit" : f(method.hmIsya) + "°" },
      { nama: "Nisfu lail", kriteria: "Tengah antara Magrib dan Subuh", nilai: "½ malam" },
      { nama: "Sepertiga malam", kriteria: "Malam (Magrib → Subuh) dibagi tiga: akhir ⅓ pertama = Magrib + ⅓, awal ⅓ terakhir = Magrib + ⅔", nilai: "⅓ · ⅔" },
      { nama: "Fajar/senja sipil", kriteria: "Matahari −6° (Matahari 6° di bawah ufuk)", nilai: "−6°" },
      { nama: "Fajar/senja nautis", kriteria: "Matahari −12°", nilai: "−12°" },
      { nama: "Fajar/senja astronomis", kriteria: "Matahari −18°", nilai: "−18°" },
      { nama: "Bulan terbit/terbenam", kriteria: "h = −34′ + 0,7275·π − 0,0353·√elevasi (π = paralaks horizontal Bulan); transit = Bulan di meridian", nilai: "tepi Bulan" },
      { nama: "Ihtiyat", kriteria: "Jadwal = menit hisab dibulatkan ke bawah + " + iht + " menit; kolom Hisab = nilai mentah berdetik", nilai: iht + " menit" },
    ];
  }
}
