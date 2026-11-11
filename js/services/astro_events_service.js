/**
 * astro_events_service.js — TAMBAHAN (bukan port dari Dart): fase Bulan, solstis/ekuinoks, dan tithi.
 * Semuanya dihitung dengan pencarian akar (Newton) pada bujur tampak Matahari & Bulan dari
 * SunFunction (VSOP87D) dan MoonLongitude (ELPMPP02), sehingga presisi sama dengan modul lain.
 * Semua waktu berupa Julian Day UT; ubah ke zona lokal di sisi antarmuka.
 */
const TITHI_NAMA = ["Pratipada","Dwitiya","Tritiya","Caturthi","Panchami","Shashthi","Saptami","Ashtami","Navami","Dashami","Ekadashi","Dwadashi","Trayodashi","Caturdashi"];
const FASE_NAMA = ["Bulan Baru","Kuartal Pertama","Bulan Purnama","Kuartal Terakhir"];

class AstroEvents {
  constructor() { this.sn = new SunFunction(); this.mn = new MoonFunction(); this.dt = new DynamicalTime(); this.jd = new JulianDay(); }
  _n180(x) { x = ((x % 360) + 360) % 360; return x > 180 ? x - 360 : x; }
  sunLon(jd)  { return this.sn.sunGeocentricLongitude(jd, this.dt.deltaT(jd), "Appa"); }
  moonLon(jd) { return this.mn.ml.moonGeocentricLongitude(jd, this.dt.deltaT(jd), "Appa"); }
  /** Elongasi Bulan terhadap Matahari, 0–360° (0 = bulan baru, 180 = purnama). */
  elongation(jd) { return (((this.moonLon(jd) - this.sunLon(jd)) % 360) + 360) % 360; }
  _solve(f, jd, rate) {                                   // Newton dengan laju rata-rata (°/hari)
    for (let i = 0; i < 12; i++) { const d = f(jd) / rate; jd -= d; if (Math.abs(d) < 1e-7) break; }
    return jd;
  }

  // ───────── Fase Bulan ─────────
  /** k bulat = bulan baru, k+0.25 = kuartal pertama, k+0.5 = purnama, k+0.75 = kuartal terakhir (Meeus bab 49). */
  moonPhase(k) {
    const q = Math.round((k - Math.floor(k)) * 4) % 4, target = 90 * q;
    const jd0 = 2451550.09766 + 29.530588861 * k;
    const jd = this._solve(j => this._n180(this.elongation(j) - target), jd0, 12.19);
    return { jd, fase: q, nama: FASE_NAMA[q] };
  }
  /** Semua fase pada rentang [jdAwal, jdAkhir] (UT), terurut. */
  phasesBetween(jdAwal, jdAkhir) {
    const out = []; let k = Math.floor((jdAwal - 2451550.09766) / 29.530588861 * 4) / 4 - 0.25;
    for (; ; k += 0.25) {
      const p = this.moonPhase(k);
      if (p.jd > jdAkhir) break;
      if (p.jd >= jdAwal) out.push(p);
    }
    return out;
  }
  /** Keadaan Bulan sesaat: iluminasi (%), umur sejak bulan baru (hari), elongasi. */
  moonState(jd) {
    const dT = this.dt.deltaT(jd), e = this.elongation(jd);
    const nm = this.moonPhase(Math.round((jd - 2451550.09766) / 29.530588861)); // bulan baru terdekat
    const prev = nm.jd <= jd ? nm.jd : this.moonPhase(Math.round((jd - 2451550.09766) / 29.530588861) - 1).jd;
    return { elongasi: e, iluminasi: this.mn.moonGeocentricDiskIlluminatedFraction(jd, dT), umur: jd - prev, jarakKm: this.mn.md.moonGeocentricDistance(jd, dT, "KM") };
  }

  // ───────── Solstis & Ekuinoks ─────────
  /** Empat titik balik/ekuinoks tahun Masehi `tahun`: bujur Matahari 0°, 90°, 180°, 270°. */
  seasons(tahun) {
    const tgt = [0, 90, 180, 270], nama = ["Ekuinoks Maret","Solstis Juni","Ekuinoks September","Solstis Desember"], bln = [3, 6, 9, 12], tgl = [20.6, 21.4, 22.9, 21.8];
    return tgt.map((t, i) => {
      const jd0 = this.jd.kmjd(Math.floor(tgl[i]), bln[i], tahun, (tgl[i] % 1) * 24, 0);
      return { jd: this._solve(j => this._n180(this.sunLon(j) - t), jd0, 0.9856), nama: nama[i], bujurMatahari: t };
    });
  }

  // ───────── Tithi (hari lunar) ─────────
  /** Tithi 1–30 pada saat jd. 1–15 = Shukla (menuju purnama), 16–30 = Krishna (menuju bulan baru). */
  tithiNama(n) { const i = (n - 1) % 15; return i === 14 ? (n === 15 ? "Purnima" : "Amavasya") : TITHI_NAMA[i]; }
  tithiAt(jd) {
    const e = this.elongation(jd), n = Math.floor(e / 12) + 1;
    return { n, nama: this.tithiNama(n), paksha: n <= 15 ? "Shukla" : "Krishna", elongasi: e, bagian: (e % 12) / 12 };
  }
  /** Saat elongasi mencapai 12°·m (m = 0..30) terdekat dari jd0. */
  tithiBoundary(m, jd0) { return this._solve(j => this._n180(this.elongation(j) - 12 * (m % 30)), jd0, 12.19); }
  /** Awal dan akhir (JD UT) tithi yang berlaku pada jd. */
  tithiSpan(jd) {
    const t = this.tithiAt(jd), step = 12 / 12.19;
    const akhir = this.tithiBoundary(t.n, jd + (1 - t.bagian) * step);
    const awal  = this.tithiBoundary(t.n - 1, jd - t.bagian * step);
    return { ...t, awal, akhir };
  }
}
