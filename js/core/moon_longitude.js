/**
 * moon_longitude.js — Bulan: bujur ekliptika dari deret ELPMPP02 (data/moon_elp_longitude.js).
 * Sumber Dart: core/astronomy/moon_longitude.dart
 * Kelas: MoonLongitude
 * Fungsi: moonGeocentricLongitude
 */
class MoonLongitude {
  l001 = MoonDataL001.elpMpp02MtL0;
  l002 = MoonDataL002.elpMpp02MtL0;
  l003 = MoonDataL003.elpMpp02MtL0;
  l004 = MoonDataL004.elpMpp02MtL0;
  l005 = MoonDataL005.elpMpp02MtL0;
  l006 = MoonDataL006.elpMpp02MtL0;
  l007 = MoonDataL007.elpMpp02MtL0;
  l008 = MoonDataL008.elpMpp02MtL0;
  l009 = MoonDataL009.elpMpp02MtL0;
  l010 = MoonDataL010.elpMpp02MtL0;
  l011 = MoonDataL011.elpMpp02MtL0;
  l012 = MoonDataL012.elpMpp02MtL0;
  l013 = MoonDataL013.elpMpp02MtL0;

  l101 = MoonDataL101.elpMpp02MtL1;
  l201 = MoonDataL201.elpMpp02MtL2;
  l301 = MoonDataL301.elpMpp02MtL3;

  mf = new MathFunction();
  nt = new NutationAndObliquity();
  julianDay = new JulianDay();

  // ═══════════════════════════════════════════════════════════════
  // ── CACHE ─────────────────────────────────────────────────────
  // Key cache HARUS menyertakan (jd, deltaT, opt) karena:
  // - jde = jd + deltaT/86400 menentukan nilai L0..L3
  // - opt ("True"/"Appa"/dst) menentukan POST-PROCESSING (nutasi,
  //   aberasi) yang diterapkan ke L0..L3, sehingga hasil akhir
  //   berbeda walau jde sama.
  // Karena computeEphemeris memanggil dengan opt="Appa" berulang
  // untuk jd yang sama, cache 1-slot berbasis (jde, opt) sudah
  // cukup efektif.
  // ═══════════════════════════════════════════════════════════════
  _cacheJde ;
  _cacheOpt ;
  _cacheResult ;

  moonGeocentricLongitude(jd, deltaT, opt) {
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

    let l001sum = 0.0;
    for (let aa = 0; aa < 1000; aa++) {
      l001sum +=
          this.l001[aa][0] *
          Math.sin(
            this.l001[aa][1] +
                this.l001[aa][2] * t1 +
                this.l001[aa][3] * t2 +
                this.l001[aa][4] * t3 +
                this.l001[aa][5] * t4,
          );
    }

    let l002sum = 0.0;
    for (let bb = 0; bb < 1000; bb++) {
      l002sum +=
          this.l002[bb][0] *
          Math.sin(
            this.l002[bb][1] +
                this.l002[bb][2] * t1 +
                this.l002[bb][3] * t2 +
                this.l002[bb][4] * t3 +
                this.l002[bb][5] * t4,
          );
    }

    let l003sum = 0.0;
    for (let cc = 0; cc < 1000; cc++) {
      l003sum +=
          this.l003[cc][0] *
          Math.sin(
            this.l003[cc][1] +
                this.l003[cc][2] * t1 +
                this.l003[cc][3] * t2 +
                this.l003[cc][4] * t3 +
                this.l003[cc][5] * t4,
          );
    }

    let l004sum = 0.0;
    for (let dd = 0; dd < 1000; dd++) {
      l004sum +=
          this.l004[dd][0] *
          Math.sin(
            this.l004[dd][1] +
                this.l004[dd][2] * t1 +
                this.l004[dd][3] * t2 +
                this.l004[dd][4] * t3 +
                this.l004[dd][5] * t4,
          );
    }

    let l005sum = 0.0;
    for (let ee = 0; ee < 1000; ee++) {
      l005sum +=
          this.l005[ee][0] *
          Math.sin(
            this.l005[ee][1] +
                this.l005[ee][2] * t1 +
                this.l005[ee][3] * t2 +
                this.l005[ee][4] * t3 +
                this.l005[ee][5] * t4,
          );
    }

    let l006sum = 0.0;
    for (let ff = 0; ff < 1000; ff++) {
      l006sum +=
          this.l006[ff][0] *
          Math.sin(
            this.l006[ff][1] +
                this.l006[ff][2] * t1 +
                this.l006[ff][3] * t2 +
                this.l006[ff][4] * t3 +
                this.l006[ff][5] * t4,
          );
    }

    let l007sum = 0.0;
    for (let gg = 0; gg < 1000; gg++) {
      l007sum +=
          this.l007[gg][0] *
          Math.sin(
            this.l007[gg][1] +
                this.l007[gg][2] * t1 +
                this.l007[gg][3] * t2 +
                this.l007[gg][4] * t3 +
                this.l007[gg][5] * t4,
          );
    }

    let l008sum = 0.0;
    for (let hh = 0; hh < 1000; hh++) {
      l008sum +=
          this.l008[hh][0] *
          Math.sin(
            this.l008[hh][1] +
                this.l008[hh][2] * t1 +
                this.l008[hh][3] * t2 +
                this.l008[hh][4] * t3 +
                this.l008[hh][5] * t4,
          );
    }

    let l009sum = 0.0;
    for (let ii = 0; ii < 1000; ii++) {
      l009sum +=
          this.l009[ii][0] *
          Math.sin(
            this.l009[ii][1] +
                this.l009[ii][2] * t1 +
                this.l009[ii][3] * t2 +
                this.l009[ii][4] * t3 +
                this.l009[ii][5] * t4,
          );
    }

    let l010sum = 0.0;
    for (let jj = 0; jj < 1000; jj++) {
      l010sum +=
          this.l010[jj][0] *
          Math.sin(
            this.l010[jj][1] +
                this.l010[jj][2] * t1 +
                this.l010[jj][3] * t2 +
                this.l010[jj][4] * t3 +
                this.l010[jj][5] * t4,
          );
    }

    let l011sum = 0.0;
    for (let kk = 0; kk < 1000; kk++) {
      l011sum +=
          this.l011[kk][0] *
          Math.sin(
            this.l011[kk][1] +
                this.l011[kk][2] * t1 +
                this.l011[kk][3] * t2 +
                this.l011[kk][4] * t3 +
                this.l011[kk][5] * t4,
          );
    }

    let l012sum = 0.0;
    for (let ll = 0; ll < 1000; ll++) {
      l012sum +=
          this.l012[ll][0] *
          Math.sin(
            this.l012[ll][1] +
                this.l012[ll][2] * t1 +
                this.l012[ll][3] * t2 +
                this.l012[ll][4] * t3 +
                this.l012[ll][5] * t4,
          );
    }

    let l013sum = 0.0;
    for (let mm = 0; mm < 337; mm++) {
      l013sum +=
          this.l013[mm][0] *
          Math.sin(
            this.l013[mm][1] +
                this.l013[mm][2] * t1 +
                this.l013[mm][3] * t2 +
                this.l013[mm][4] * t3 +
                this.l013[mm][5] * t4,
          );
    }

    let l101sum = 0.0;
    for (let nn = 0; nn < 1199; nn++) {
      l101sum +=
          this.l101[nn][0] *
          Math.sin(
            this.l101[nn][1] +
                this.l101[nn][2] * t1 +
                this.l101[nn][3] * t2 +
                this.l101[nn][4] * t3 +
                this.l101[nn][5] * t4,
          );
    }

    let l201sum = 0.0;
    for (let qq = 0; qq < 219; qq++) {
      l201sum +=
          this.l201[qq][0] *
          Math.sin(
            this.l201[qq][1] +
                this.l201[qq][2] * t1 +
                this.l201[qq][3] * t2 +
                this.l201[qq][4] * t3 +
                this.l201[qq][5] * t4,
          );
    }

    let l301sum = 0.0;
    for (let rr = 0; rr < 2; rr++) {
      l301sum +=
          this.l301[rr][0] *
          Math.sin(
            this.l301[rr][1] +
                this.l301[rr][2] * t1 +
                this.l301[rr][3] * t2 +
                this.l301[rr][4] * t3 +
                this.l301[rr][5] * t4,
          );
    }

    const l0 =
        l001sum +
        l002sum +
        l003sum +
        l004sum +
        l005sum +
        l006sum +
        l007sum +
        l008sum +
        l009sum +
        l010sum +
        l011sum +
        l012sum +
        l013sum;
    const l1 = l101sum;
    const l2 = l201sum;
    const l3 = l301sum;
    const l = l0 + l1 * t1 + l2 * t2 + l3 * t3;

    // MoonMeanLongitude
    const w0 = 3.81034409083088;
    const w1 = 8399.68473007193;
    const w2 = -0.0000331895204255009;
    const w3 = 3.11024944910606E-08;
    const w4 = -2.03282376489228E-10;
    const w = w0 + w1 * t1 + w2 * t2 + w3 * t3 + w4 * t4;

    // Presesi
    const p1 = 5029.0966 - 0.29965;
    const p2 = 1.112;
    const p3 = 0.000077;
    const p4 = -0.00002353;
    const p = p1 * t1 + p2 * t2 + p3 * t3 + p4 * t4;

    // TrueGeocentricEclipticLongitude
    const moonTrueLon = this.mf.mod(this.mf.deg(w) + l / 3600.0 + p / 3600.0, 360.0);
    const nutation = this.nt.nutationInLongitude(jd, deltaT);

    // Aberasi
    const abr = -0.00019524 - 0.00001059 * Math.sin(this.mf.rad(225 + 477198.9 * t));

    // ApparentGeocentricEclipticLongitude
    const moonAppaLon = moonTrueLon + nutation + abr;

    let result;
    switch (opt) {
      case "L0":
        result = l0;
        break;
      case "L1":
        result = l1;
        break;
      case "L2":
        result = l2;
        break;
      case "L3":
        result = l3;
        break;
      case "L":
        result = l;
        break;
      case "True":
        result = moonTrueLon;
        break;
      case "Appa":
        result = moonAppaLon;
        break;
      default:
        result = moonAppaLon;
    }

    // ✅ Simpan ke cache sebelum return
    this._cacheJde = jde;
    this._cacheOpt = opt;
    this._cacheResult = result;
    return result;
  }
}

