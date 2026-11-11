/**
 * moon_distance.js — Bulan: jarak geosentris dari deret ELPMPP02 (data/moon_elp_distance.js).
 * Sumber Dart: core/astronomy/moon_distance.dart
 * Kelas: MoonDistance
 * Fungsi: moonGeocentricDistance
 */




// import semua data R001..R013, R101, R201, R301
class MoonDistance {
  r001 = MoonDataR001.elpMpp02MtR0;
  r002 = MoonDataR002.elpMpp02MtR0;
  r003 = MoonDataR003.elpMpp02MtR0;
  r004 = MoonDataR004.elpMpp02MtR0;
  r005 = MoonDataR005.elpMpp02MtR0;
  r006 = MoonDataR006.elpMpp02MtR0;
  r007 = MoonDataR007.elpMpp02MtR0;
  r008 = MoonDataR008.elpMpp02MtR0;
  r009 = MoonDataR009.elpMpp02MtR0;
  r010 = MoonDataR010.elpMpp02MtR0;
  r011 = MoonDataR011.elpMpp02MtR0;
  r012 = MoonDataR012.elpMpp02MtR0;
  r013 = MoonDataR013.elpMpp02MtR0;

  r101 = MoonDataR101.elpMpp02MtR1;
  r201 = MoonDataR201.elpMpp02MtR2;
  r301 = MoonDataR301.elpMpp02MtR3;

  mf = new MathFunction();
  julianDay = new JulianDay();

  // ═══════════════════════════════════════════════════════════════
  // ── CACHE ─────────────────────────────────────────────────────
  // Key cache: (jde, opt) — opt menentukan satuan output (KM/AU/ER/
  // R0/R1/dst), tapi seluruh series (r0,r1,r2,r3,abr) dihitung dari
  // jde yang sama. Karena opt mengubah HASIL AKHIR (konversi satuan
  // berbeda untuk KM vs AU vs R0 dst), key tetap menyertakan opt
  // agar aman.
  // ═══════════════════════════════════════════════════════════════
  _cacheJde ;
  _cacheOpt ;
  _cacheResult ;

  moonGeocentricDistance(jd, deltaT, opt) {
    const jde = jd + deltaT / 86400.0;

    // ✅ Cek cache: jde DAN opt harus sama
    if (this._cacheJde == jde && this._cacheOpt == opt && this._cacheResult != null) {
      return this._cacheResult;
    }

    const t = this.julianDay.jc(jde);
    const t1 = Math.pow(t, 1.0);
    const t2 = Math.pow(t, 2.0);
    const t3 = Math.pow(t, 3.0);
    const t4 = Math.pow(t, 4.0);

    let r001sum = 0.0;
    for (let i = 0; i < 1000; i++) {
      r001sum +=
          this.r001[i][0] *
          Math.sin(
            this.r001[i][1] +
                this.r001[i][2] * t1 +
                this.r001[i][3] * t2 +
                this.r001[i][4] * t3 +
                this.r001[i][5] * t4,
          );
    }

    let r002sum = 0.0;
    for (let i = 0; i < 1000; i++) {
      r002sum +=
          this.r002[i][0] *
          Math.sin(
            this.r002[i][1] +
                this.r002[i][2] * t1 +
                this.r002[i][3] * t2 +
                this.r002[i][4] * t3 +
                this.r002[i][5] * t4,
          );
    }

    let r003sum = 0.0;
    for (let i = 0; i < 1000; i++) {
      r003sum +=
          this.r003[i][0] *
          Math.sin(
            this.r003[i][1] +
                this.r003[i][2] * t1 +
                this.r003[i][3] * t2 +
                this.r003[i][4] * t3 +
                this.r003[i][5] * t4,
          );
    }

    let r004sum = 0.0;
    for (let i = 0; i < 1000; i++) {
      r004sum +=
          this.r004[i][0] *
          Math.sin(
            this.r004[i][1] +
                this.r004[i][2] * t1 +
                this.r004[i][3] * t2 +
                this.r004[i][4] * t3 +
                this.r004[i][5] * t4,
          );
    }

    let r005sum = 0.0;
    for (let i = 0; i < 1000; i++) {
      r005sum +=
          this.r005[i][0] *
          Math.sin(
            this.r005[i][1] +
                this.r005[i][2] * t1 +
                this.r005[i][3] * t2 +
                this.r005[i][4] * t3 +
                this.r005[i][5] * t4,
          );
    }

    let r006sum = 0.0;
    for (let i = 0; i < 1000; i++) {
      r006sum +=
          this.r006[i][0] *
          Math.sin(
            this.r006[i][1] +
                this.r006[i][2] * t1 +
                this.r006[i][3] * t2 +
                this.r006[i][4] * t3 +
                this.r006[i][5] * t4,
          );
    }

    let r007sum = 0.0;
    for (let i = 0; i < 1000; i++) {
      r007sum +=
          this.r007[i][0] *
          Math.sin(
            this.r007[i][1] +
                this.r007[i][2] * t1 +
                this.r007[i][3] * t2 +
                this.r007[i][4] * t3 +
                this.r007[i][5] * t4,
          );
    }

    let r008sum = 0.0;
    for (let i = 0; i < 1000; i++) {
      r008sum +=
          this.r008[i][0] *
          Math.sin(
            this.r008[i][1] +
                this.r008[i][2] * t1 +
                this.r008[i][3] * t2 +
                this.r008[i][4] * t3 +
                this.r008[i][5] * t4,
          );
    }

    let r009sum = 0.0;
    for (let i = 0; i < 1000; i++) {
      r009sum +=
          this.r009[i][0] *
          Math.sin(
            this.r009[i][1] +
                this.r009[i][2] * t1 +
                this.r009[i][3] * t2 +
                this.r009[i][4] * t3 +
                this.r009[i][5] * t4,
          );
    }

    let r010sum = 0.0;
    for (let i = 0; i < 1000; i++) {
      r010sum +=
          this.r010[i][0] *
          Math.sin(
            this.r010[i][1] +
                this.r010[i][2] * t1 +
                this.r010[i][3] * t2 +
                this.r010[i][4] * t3 +
                this.r010[i][5] * t4,
          );
    }

    let r011sum = 0.0;
    for (let i = 0; i < 1000; i++) {
      r011sum +=
          this.r011[i][0] *
          Math.sin(
            this.r011[i][1] +
                this.r011[i][2] * t1 +
                this.r011[i][3] * t2 +
                this.r011[i][4] * t3 +
                this.r011[i][5] * t4,
          );
    }

    let r012sum = 0.0;
    for (let i = 0; i < 1000; i++) {
      r012sum +=
          this.r012[i][0] *
          Math.sin(
            this.r012[i][1] +
                this.r012[i][2] * t1 +
                this.r012[i][3] * t2 +
                this.r012[i][4] * t3 +
                this.r012[i][5] * t4,
          );
    }

    let r013sum = 0.0;
    for (let i = 0; i < 819; i++) {
      r013sum +=
          this.r013[i][0] *
          Math.sin(
            this.r013[i][1] +
                this.r013[i][2] * t1 +
                this.r013[i][3] * t2 +
                this.r013[i][4] * t3 +
                this.r013[i][5] * t4,
          );
    }

    let r101sum = 0.0;
    for (let i = 0; i < 1165; i++) {
      r101sum +=
          this.r101[i][0] *
          Math.sin(
            this.r101[i][1] +
                this.r101[i][2] * t1 +
                this.r101[i][3] * t2 +
                this.r101[i][4] * t3 +
                this.r101[i][5] * t4,
          );
    }

    let r201sum = 0.0;
    for (let i = 0; i < 210; i++) {
      r201sum +=
          this.r201[i][0] *
          Math.sin(
            this.r201[i][1] +
                this.r201[i][2] * t1 +
                this.r201[i][3] * t2 +
                this.r201[i][4] * t3 +
                this.r201[i][5] * t4,
          );
    }

    let r301sum = 0.0;
    for (let i = 0; i < 2; i++) {
      r301sum +=
          this.r301[i][0] *
          Math.sin(
            this.r301[i][1] +
                this.r301[i][2] * t1 +
                this.r301[i][3] * t2 +
                this.r301[i][4] * t3 +
                this.r301[i][5] * t4,
          );
    }

    const r0 =
        r001sum +
        r002sum +
        r003sum +
        r004sum +
        r005sum +
        r006sum +
        r007sum +
        r008sum +
        r009sum +
        r010sum +
        r011sum +
        r012sum +
        r013sum;

    const r1 = r101sum;
    const r2 = r201sum;
    const r3 = r301sum;

    const rp = r0 + r1 * t1 + r2 * t2 + r3 * t3;
    const abr = 0.0708 * Math.cos(this.mf.rad(225.0 + 477198.9 * t));

    const r = r0 + r1 * t1 + r2 * t2 + r3 * t3 + abr;

    const rKM = r;
    const rAU = r / 149597870.7;
    const rER = r / 6371.0;

    let result;
    switch (opt) {
      case "R0":
        result = r0;
        break;
      case "R1":
        result = r1;
        break;
      case "R2":
        result = r2;
        break;
      case "R3":
        result = r3;
        break;
      case "Rp":
        result = rp;
        break;
      case "R":
        result = r;
        break;
      case "KM":
        result = rKM;
        break;
      case "AU":
        result = rAU;
        break;
      case "ER":
        result = rER;
        break;
      default:
        result = rKM;
    }

    // ✅ Simpan ke cache sebelum return
    this._cacheJde = jde;
    this._cacheOpt = opt;
    this._cacheResult = result;
    return result;
  }
}

