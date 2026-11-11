/**
 * moon_latitude.js — Bulan: lintang ekliptika dari deret ELPMPP02 (data/moon_elp_latitude.js).
 * Sumber Dart: core/astronomy/moon_latitude.dart
 * Kelas: MoonLatitude
 * Fungsi: moonGeocentricLatitude
 */
class MoonLatitude {
  julianDay = new JulianDay();
  b001 = MoonDataB001.elpMpp02MtB0;
  b002 = MoonDataB002.elpMpp02MtB0;
  b003 = MoonDataB003.elpMpp02MtB0;
  b004 = MoonDataB004.elpMpp02MtB0;
  b005 = MoonDataB005.elpMpp02MtB0;
  b006 = MoonDataB006.elpMpp02MtB0;
  b007 = MoonDataB007.elpMpp02MtB0;
  b008 = MoonDataB008.elpMpp02MtB0;

  b101 = MoonDataB101.elpMpp02MtB1;
  b201 = MoonDataB201.elpMpp02MtB2;

  mf = new MathFunction();
  jd = new JulianDay();

  // ═══════════════════════════════════════════════════════════════
  // ── CACHE ─────────────────────────────────────────────────────
  // Key cache: (jde, opt) — sama seperti MoonLongitude, karena
  // "Appa" vs "True" mengubah hasil akhir (ada/tidaknya term abr).
  // ═══════════════════════════════════════════════════════════════
  _cacheJde ;
  _cacheOpt ;
  _cacheResult ;

  moonGeocentricLatitude(jd, deltaT, opt) {
    const jde = jd + deltaT / 86400.0;

    // ✅ Cek cache: jde DAN opt harus sama
    if (this._cacheJde == jde && this._cacheOpt == opt && this._cacheResult != null) {
      return this._cacheResult;
    }

    // waktu Julian Century
    const t = this.julianDay.jc(jde);
    const t1 = Math.pow(t, 1.0);
    const t2 = Math.pow(t, 2.0);
    const t3 = Math.pow(t, 3.0);
    const t4 = Math.pow(t, 4.0);

    let b001sum = 0.0;
    for (let aa = 0; aa < 1000; aa++) {
      b001sum +=
          this.b001[aa][0] *
          Math.sin(
            this.b001[aa][1] +
                this.b001[aa][2] * t1 +
                this.b001[aa][3] * t2 +
                this.b001[aa][4] * t3 +
                this.b001[aa][5] * t4,
          );
    }

    let b002sum = 0.0;
    for (let bb = 0; bb < 1000; bb++) {
      b002sum +=
          this.b002[bb][0] *
          Math.sin(
            this.b002[bb][1] +
                this.b002[bb][2] * t1 +
                this.b002[bb][3] * t2 +
                this.b002[bb][4] * t3 +
                this.b002[bb][5] * t4,
          );
    }

    let b003sum = 0.0;
    for (let cc = 0; cc < 1000; cc++) {
      b003sum +=
          this.b003[cc][0] *
          Math.sin(
            this.b003[cc][1] +
                this.b003[cc][2] * t1 +
                this.b003[cc][3] * t2 +
                this.b003[cc][4] * t3 +
                this.b003[cc][5] * t4,
          );
    }

    let b004sum = 0.0;
    for (let dd = 0; dd < 1000; dd++) {
      b004sum +=
          this.b004[dd][0] *
          Math.sin(
            this.b004[dd][1] +
                this.b004[dd][2] * t1 +
                this.b004[dd][3] * t2 +
                this.b004[dd][4] * t3 +
                this.b004[dd][5] * t4,
          );
    }

    let b005sum = 0.0;
    for (let ee = 0; ee < 1000; ee++) {
      b005sum +=
          this.b005[ee][0] *
          Math.sin(
            this.b005[ee][1] +
                this.b005[ee][2] * t1 +
                this.b005[ee][3] * t2 +
                this.b005[ee][4] * t3 +
                this.b005[ee][5] * t4,
          );
    }

    let b006sum = 0.0;
    for (let ff = 0; ff < 1000; ff++) {
      b006sum +=
          this.b006[ff][0] *
          Math.sin(
            this.b006[ff][1] +
                this.b006[ff][2] * t1 +
                this.b006[ff][3] * t2 +
                this.b006[ff][4] * t3 +
                this.b006[ff][5] * t4,
          );
    }

    let b007sum = 0.0;
    for (let gg = 0; gg < 1000; gg++) {
      b007sum +=
          this.b007[gg][0] *
          Math.sin(
            this.b007[gg][1] +
                this.b007[gg][2] * t1 +
                this.b007[gg][3] * t2 +
                this.b007[gg][4] * t3 +
                this.b007[gg][5] * t4,
          );
    }

    let b008sum = 0.0;
    for (let hh = 0; hh < 380; hh++) {
      b008sum +=
          this.b008[hh][0] *
          Math.sin(
            this.b008[hh][1] +
                this.b008[hh][2] * t1 +
                this.b008[hh][3] * t2 +
                this.b008[hh][4] * t3 +
                this.b008[hh][5] * t4,
          );
    }

    let b101sum = 0.0;
    for (let ii = 0; ii < 516; ii++) {
      b101sum +=
          this.b101[ii][0] *
          Math.sin(
            this.b101[ii][1] +
                this.b101[ii][2] * t1 +
                this.b101[ii][3] * t2 +
                this.b101[ii][4] * t3 +
                this.b101[ii][5] * t4,
          );
    }

    let b201sum = 0.0;
    for (let jj = 0; jj < 52; jj++) {
      b201sum +=
          this.b201[jj][0] *
          Math.sin(
            this.b201[jj][1] +
                this.b201[jj][2] * t1 +
                this.b201[jj][3] * t2 +
                this.b201[jj][4] * t3 +
                this.b201[jj][5] * t4,
          );
    }

    const b0 =
        b001sum +
        b002sum +
        b003sum +
        b004sum +
        b005sum +
        b006sum +
        b007sum +
        b008sum;
    const b1 = b101sum;
    const b2 = b201sum;

    const b = b0 + b1 * t1 + b2 * t2;

    const abr = -0.00001754 * Math.sin(this.mf.rad(183.3 + 483202.0 * t));

    const moonLat = b / 3600.0 + abr;

    let result;
    switch (opt) {
      case "Appa":
        result = moonLat;
        break;
      case "True":
        result = b / 3600.0;
        break;
      default:
        result = moonLat;
    }

    // ✅ Simpan ke cache sebelum return
    this._cacheJde = jde;
    this._cacheOpt = opt;
    this._cacheResult = result;
    return result;
  }
}

