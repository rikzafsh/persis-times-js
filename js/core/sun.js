/**
 * sun.js — Matahari: VSOP87D → bujur, lintang, jarak, RA, deklinasi, waktu sideris, equation of time, ghurub.
 * Sumber Dart: core/astronomy/sun_function.dart
 * Kelas: SunFunction
 * Fungsi: earthHeliocentricLongitude, earthHeliocentricLatitude, earthRadiusVector, sunGeocentricLongitude, sunGeocentricLatitude, sunGeocentricDistance, sunAberration, sunGeocentricRightAscension, sunGeocentricDeclination, greenwichMeanSiderialTime, greenwichApparentSiderialTime, localApparentSiderialTime, sunGeocentricGreenwichHourAngle, sunGeocentricLocalHourAngle …
 */
// ═══════════════════════════════════════════════════════════════════
// PATCH: SunFunction dengan MEMOIZATION CACHE
// ═══════════════════════════════════════════════════════════════════
//
// IDE: earthHeliocentricLongitude, earthHeliocentricLatitude, dan
// earthRadiusVector adalah method PALING MAHAL (1080, 348, dan 997
// suku cosine). Method2 lain (sunGeocentricLongitude, Latitude,
// RightAscension, Declination, GreenwichHourAngle, equationOfTime,
// Distance, Semidiameter, Parallax) SEMUANYA memanggil 1 atau lebih
// dari 3 method dasar ini -- dengan (jd, deltaT) yang SAMA dalam
// satu iterasi.
//
// SOLUSI: cache hasil 3 method dasar ini berdasarkan key (jd, deltaT).
// Cache di-reset otomatis ketika (jd, deltaT) baru muncul -> aman
// untuk dipakai lintas instance / lintas pemanggilan (cache size
// kecil, cukup simpan nilai TERAKHIR saja karena pemanggilan selalu
// berurutan untuk (jd, deltaT) yang sama sebelum pindah ke jd lain).
//
// CARA PAKAI:
// 1. Copy 3 method earthHeliocentricLongitude/Latitude/earthRadiusVector
//    yang sudah dimodifikasi ini ke dalam class SunFunction Anda,
//    MENGGANTIKAN versi lama.
// 2. Tidak ada perubahan apapun di method lain (sunGeocentricLongitude,
//    dst) -- mereka tetap memanggil method2 ini seperti biasa, tapi
//    sekarang hasilnya di-cache.
//
// HASIL: Untuk 1 baris jam, 3 series (L,B,R) masing2 HANYA dihitung
// SEKALI (bukan 5-6x), sehingga waktu per-jam turun drastis
// (estimasi dari ~100ms menjadi ~15-20ms untuk Sun).
class SunFunction {
  // ── Data series VSOP87 (tetap field instance seperti semula) ────
  l00 = SunDataL00.vsop87MtL0;
  l01 = SunDataL01.vsop87MtL1;
  l02 = SunDataL02.vsop87MtL2;
  l03 = SunDataL03.vsop87MtL3;
  l04 = SunDataL04.vsop87MtL4;
  l05 = SunDataL05.vsop87MtL5;

  b00 = SunDataB00.vsop87MtB0;
  b01 = SunDataB01.vsop87MtB1;
  b02 = SunDataB02.vsop87MtB2;
  b03 = SunDataB03.vsop87MtB3;
  b04 = SunDataB04.vsop87MtB4;

  r00 = SunDataR00.vsop87MtR0;
  r01 = SunDataR01.vsop87MtR1;
  r02 = SunDataR02.vsop87MtR2;
  r03 = SunDataR03.vsop87MtR3;
  r04 = SunDataR04.vsop87MtR4;
  r05 = SunDataR05.vsop87MtR5;

  mf = new MathFunction();
  julianDay = new JulianDay();
  nt = new NutationAndObliquity();
  dt = new DynamicalTime();

  // ═══════════════════════════════════════════════════════════════
  // ── CACHE STORAGE (BARU) ─────────────────────────────────────────
  // Cache hanya menyimpan hasil TERAKHIR per method (L, B, R),
  // di-key berdasarkan jde = jd + deltaT/86400.
  // ═══════════════════════════════════════════════════════════════
  _cacheJdeL ;
  _cacheL ;

  _cacheJdeB ;
  _cacheB ;

  _cacheJdeR ;
  _cacheR ;

  // ═══════════════════════════════════════════════════════════════
  // earthHeliocentricLongitude — DENGAN CACHE
  // ═══════════════════════════════════════════════════════════════
  earthHeliocentricLongitude(jd, deltaT) {
    const jde = jd + deltaT / 86400.0; // waktu dalam Dynamical Time (TD)

    // ✅ Cek cache dulu
    if (this._cacheJdeL == jde && this._cacheL != null) {
      return this._cacheL;
    }

    const t = this.julianDay.jc(jde);
    const tau = this.julianDay.jm(t);

    // L0 = 559 terms
    let l000sum = 0.0;
    for (let i = 0; i < 559; i++) {
      l000sum += this.l00[i][0] * Math.cos(this.l00[i][1] + this.l00[i][2] * tau);
    }

    // L1 = 341 terms
    let l001sum = 0.0;
    for (let i = 0; i < 341; i++) {
      l001sum += this.l01[i][0] * Math.cos(this.l01[i][1] + this.l01[i][2] * tau);
    }

    // L2 = 142 terms
    let l002sum = 0.0;
    for (let i = 0; i < 142; i++) {
      l002sum += this.l02[i][0] * Math.cos(this.l02[i][1] + this.l02[i][2] * tau);
    }

    // L3 = 22 terms
    let l003sum = 0.0;
    for (let i = 0; i < 22; i++) {
      l003sum += this.l03[i][0] * Math.cos(this.l03[i][1] + this.l03[i][2] * tau);
    }

    // L4 = 11 terms
    let l004sum = 0.0;
    for (let i = 0; i < 11; i++) {
      l004sum += this.l04[i][0] * Math.cos(this.l04[i][1] + this.l04[i][2] * tau);
    }

    // L5 = 5 terms
    let l005sum = 0.0;
    for (let i = 0; i < 5; i++) {
      l005sum += this.l05[i][0] * Math.cos(this.l05[i][1] + this.l05[i][2] * tau);
    }

    const l = this.mf.mod(
      this.mf.deg(
        l000sum +
            l001sum * tau +
            l002sum * Math.pow(tau, 2.0) +
            l003sum * Math.pow(tau, 3.0) +
            l004sum * Math.pow(tau, 4.0) +
            l005sum * Math.pow(tau, 5.0),
      ),
      360.0,
    );

    // ✅ Simpan ke cache sebelum return
    this._cacheJdeL = jde;
    this._cacheL = l;
    return l;
  }

  // ═══════════════════════════════════════════════════════════════
  // earthHeliocentricLatitude — DENGAN CACHE
  // ═══════════════════════════════════════════════════════════════
  earthHeliocentricLatitude(jd, deltaT) {
    const jde = jd + deltaT / 86400.0;

    // ✅ Cek cache dulu
    if (this._cacheJdeB == jde && this._cacheB != null) {
      return this._cacheB;
    }

    const t = this.julianDay.jc(jde);
    const tau = this.julianDay.jm(t);

    // b0 = 184 terms
    let b00sum = 0.0;
    for (let i = 0; i < 184; i++) {
      b00sum += this.b00[i][0] * Math.cos(this.b00[i][1] + this.b00[i][2] * tau);
    }

    // b1 = 99 terms
    let b01sum = 0.0;
    for (let i = 0; i < 99; i++) {
      b01sum += this.b01[i][0] * Math.cos(this.b01[i][1] + this.b01[i][2] * tau);
    }

    // b2 = 49 terms
    let b02sum = 0.0;
    for (let i = 0; i < 49; i++) {
      b02sum += this.b02[i][0] * Math.cos(this.b02[i][1] + this.b02[i][2] * tau);
    }

    // b3 = 11 terms
    let b03sum = 0.0;
    for (let i = 0; i < 11; i++) {
      b03sum += this.b03[i][0] * Math.cos(this.b03[i][1] + this.b03[i][2] * tau);
    }

    // b4 = 5 terms
    let b04sum = 0.0;
    for (let i = 0; i < 5; i++) {
      b04sum += this.b04[i][0] * Math.cos(this.b04[i][1] + this.b04[i][2] * tau);
    }

    const b = this.mf.deg(
      b00sum +
          b01sum * tau +
          b02sum * Math.pow(tau, 2) +
          b03sum * Math.pow(tau, 3) +
          b04sum * Math.pow(tau, 4),
    );

    // ✅ Simpan ke cache sebelum return
    this._cacheJdeB = jde;
    this._cacheB = b;
    return b;
  }

  // ═══════════════════════════════════════════════════════════════
  // earthRadiusVector — DENGAN CACHE
  // ═══════════════════════════════════════════════════════════════
  earthRadiusVector(jd, deltaT) {
    const jde = jd + deltaT / 86400;

    // ✅ Cek cache dulu
    if (this._cacheJdeR == jde && this._cacheR != null) {
      return this._cacheR;
    }

    const t = this.julianDay.jc(jde);
    const tau = this.julianDay.jm(t);

    // R0 = 526 terms
    let r000sum = 0.0;
    for (let i = 0; i < 526; i++) {
      r000sum += this.r00[i][0] * Math.cos(this.r00[i][1] + this.r00[i][2] * tau);
    }

    // R1 = 292 terms
    let r001sum = 0.0;
    for (let i = 0; i < 292; i++) {
      r001sum += this.r01[i][0] * Math.cos(this.r01[i][1] + this.r01[i][2] * tau);
    }

    // R2 = 139 terms
    let r002sum = 0.0;
    for (let i = 0; i < 139; i++) {
      r002sum += this.r02[i][0] * Math.cos(this.r02[i][1] + this.r02[i][2] * tau);
    }

    // R3 = 27 terms
    let r003sum = 0.0;
    for (let i = 0; i < 27; i++) {
      r003sum += this.r03[i][0] * Math.cos(this.r03[i][1] + this.r03[i][2] * tau);
    }

    // R4 = 10 terms
    let r004sum = 0.0;
    for (let i = 0; i < 10; i++) {
      r004sum += this.r04[i][0] * Math.cos(this.r04[i][1] + this.r04[i][2] * tau);
    }

    // R5 = 3 terms
    let r005sum = 0.0;
    for (let i = 0; i < 3; i++) {
      r005sum += this.r05[i][0] * Math.cos(this.r05[i][1] + this.r05[i][2] * tau);
    }

    const r =
        r000sum +
        r001sum * tau +
        r002sum * Math.pow(tau, 2) +
        r003sum * Math.pow(tau, 3) +
        r004sum * Math.pow(tau, 4) +
        r005sum * Math.pow(tau, 5);

    // ✅ Simpan ke cache sebelum return
    this._cacheJdeR = jde;
    this._cacheR = r;
    return r;
  }

  sunGeocentricLongitude(jd, deltaT, optional) {
    const l = this.earthHeliocentricLongitude(jd, deltaT);
    const b = this.earthHeliocentricLatitude(jd, deltaT);
    const theta = this.mf.mod(l + 180, 360);
    const beta = -b;

    const jde = jd + deltaT / 86400;
    const t = this.julianDay.jc(jde);

    const lmbdP = this.mf.mod(theta - 1.397 * t - 0.00031 * t * t, 360.0);
    const dltTh =
        (-0.09033 +
            0.03916 *
                (Math.cos(this.mf.rad(lmbdP)) + Math.sin(this.mf.rad(lmbdP))) *
                Math.tan(this.mf.rad(beta))) /
        3600;
    const thtaFK5 = theta + dltTh;

    const dltPsi = this.nt.nutationInLongitude(jd, deltaT);
    const aberr = this.sunAberration(jd, deltaT) / 3600.0;
    const lambd = this.mf.mod(thtaFK5 + dltPsi + aberr, 360.0);

    switch (optional) {
      case "True":
        return thtaFK5;
      case "Appa":
        return lambd;
      default:
        return lambd;
    }
  }

  sunGeocentricLatitude(jd, deltaT) {
    const l = this.earthHeliocentricLongitude(jd, deltaT);
    const b = this.earthHeliocentricLatitude(jd, deltaT);
    const theta = this.mf.mod(l + 180, 360);
    const beta = -b;

    const jde = jd + deltaT / 86400;
    const t = this.julianDay.jce(jde);

    const lambdP = theta - 1.397 * t - 0.00031 * t * t;
    const dltBta =
        (0.03916 * (Math.cos(this.mf.rad(lambdP)) - Math.sin(this.mf.rad(lambdP)))) /
        3600;

    const btaFk5 = beta + dltBta;
    return btaFk5;
  }

  sunGeocentricDistance(jd, deltaT, opt) {
    const r = this.earthRadiusVector(jd, deltaT);
    const rAU = r;
    const rKM = r * 149597870.7;
    const rER = r * 149597870.7 / 6371;

    switch (opt) {
      case "AU":
        return rAU;
      case "KM":
        return rKM;
      case "ER":
        return rER;
      default:
        return rAU;
    }
  }

  sunAberration(jd, deltaT) {
    const jde = jd + deltaT / 86400.0;
    const t = this.julianDay.jc(jde);
    const tau = this.julianDay.jm(t);

    // dL (Δλ) dari VSOP87D, satuan arcseconds
    const dL =
        3548.330 +
        118.568 * Math.sin(this.mf.rad(87.5287 + 359993.7286 * tau)) +
        2.476 * Math.sin(this.mf.rad(85.0561 + 719987.4571 * tau)) +
        1.376 * Math.sin(this.mf.rad(27.8502 + 4452671.1152 * tau)) +
        0.119 * Math.sin(this.mf.rad(73.1375 + 450368.8564 * tau)) +
        0.114 * Math.sin(this.mf.rad(337.2264 + 329644.6718 * tau)) +
        0.086 * Math.sin(this.mf.rad(222.5400 + 659289.3436 * tau)) +
        0.078 * Math.sin(this.mf.rad(162.8136 + 9224659.7915 * tau)) +
        0.054 * Math.sin(this.mf.rad(82.5823 + 1079981.1857 * tau)) +
        0.052 * Math.sin(this.mf.rad(171.5189 + 225184.4282 * tau)) +
        0.034 * Math.sin(this.mf.rad(30.3214 + 4092677.3866 * tau)) +
        0.033 * Math.sin(this.mf.rad(119.8105 + 337181.4711 * tau)) +
        0.023 * Math.sin(this.mf.rad(247.5418 + 299295.6151 * tau)) +
        0.023 * Math.sin(this.mf.rad(325.1526 + 315559.5560 * tau)) +
        0.021 * Math.sin(this.mf.rad(155.1241 + 675553.2846 * tau)) +
        7.311 * tau * Math.sin(this.mf.rad(333.4515 + 359993.7286 * tau)) +
        0.305 * tau * Math.sin(this.mf.rad(330.9814 + 719987.4571 * tau)) +
        0.010 * tau * Math.sin(this.mf.rad(328.5170 + 1079981.1857 * tau)) +
        0.309 * tau * tau * Math.sin(this.mf.rad(241.4518 + 359993.7286 * tau)) +
        0.021 * tau * tau * Math.sin(this.mf.rad(205.0482 + 719987.4571 * tau)) +
        0.004 * tau * tau * Math.sin(this.mf.rad(297.8610 + 4452671.1152 * tau)) +
        0.010 *
            tau *
            tau *
            tau *
            Math.sin(this.mf.rad(154.7066 + 359993.7286 * tau));

    // jarak Matahari (dalam AU)
    const r = this.sunGeocentricDistance(jd, deltaT, "AU");

    // hasil dalam arcseconds
    const abr = -0.005775518 * r * dL;

    // kalau mau dijadikan derajat, tinggal abr / 3600
    return abr;
  }

  sunGeocentricRightAscension(jd, deltaT) {
    const lambda = this.sunGeocentricLongitude(jd, deltaT, "Appa");
    const beta = this.sunGeocentricLatitude(jd, deltaT);
    const epsilon = this.nt.trueObliquityOfEcliptic(jd, deltaT);

    const alphaFK5 = this.mf.mod(
      this.mf.deg(
        Math.atan2(
          Math.sin(this.mf.rad(lambda)) * Math.cos(this.mf.rad(epsilon)) -
              Math.tan(this.mf.rad(beta)) * Math.sin(this.mf.rad(epsilon)),
          Math.cos(this.mf.rad(lambda)),
        ),
      ),
      360,
    );

    return alphaFK5;
  }

  sunGeocentricDeclination(jd, deltaT) {
    const lambda = this.sunGeocentricLongitude(jd, deltaT, "Appa");
    const beta = this.sunGeocentricLatitude(jd, deltaT);
    const epsilon = this.nt.trueObliquityOfEcliptic(jd, deltaT);

    const deltaFK5 = this.mf.deg(
      Math.asin(
        Math.sin(this.mf.rad(beta)) * Math.cos(this.mf.rad(epsilon)) +
            Math.cos(this.mf.rad(beta)) *
                Math.sin(this.mf.rad(epsilon)) *
                Math.sin(this.mf.rad(lambda)),
      ),
    );

    return deltaFK5;
  }

  greenwichMeanSiderialTime(jd) {
    const t = this.julianDay.jc(jd);
    const gmst = this.mf.mod(
      280.46061837 +
          360.98564736629 * (jd - 2451545.0) +
          0.000387933 * Math.pow(t, 2.0) -
          (Math.pow(t, 3) / 38710000),
      360,
    );
    return gmst;
  }

  greenwichApparentSiderialTime(jd, deltaT) {
    let gmst = this.greenwichMeanSiderialTime(jd);
    let dPsi = this.nt.nutationInLongitude(jd, deltaT);
    let eps = this.nt.trueObliquityOfEcliptic(jd, deltaT);
    let gast = this.mf.mod(gmst + dPsi * Math.cos(this.mf.rad(eps)), 360.0);
    return gast;
  }

  localApparentSiderialTime(jd, deltaT, gLon) {
    let gast = this.greenwichApparentSiderialTime(jd, deltaT);
    let last = this.mf.mod(gast + gLon, 360.0);
    return last;
  }

  sunGeocentricGreenwichHourAngle(jd, deltaT) {
    const gast = this.greenwichApparentSiderialTime(jd, deltaT);
    const alpha = this.sunGeocentricRightAscension(jd, deltaT);
    const gha = this.mf.mod(gast - alpha, 360.0);
    return gha;
  }

  sunGeocentricLocalHourAngle(jd, deltaT, gLon) {
    const gast = this.greenwichApparentSiderialTime(jd, deltaT);
    const alpha = this.sunGeocentricRightAscension(jd, deltaT);
    const lhaFK5 = this.mf.mod(gast + gLon - alpha, 360.0);
    return lhaFK5;
  }

  sunGeocentricAzimuth(jd, deltaT, gLon, gLat) {
    const lha = this.sunGeocentricLocalHourAngle(jd, deltaT, gLon);
    const dec = this.sunGeocentricDeclination(jd, deltaT);
    const azm = this.mf.mod(
      this.mf.deg(
            Math.atan2(
              Math.sin(this.mf.rad(lha)),
              Math.cos(this.mf.rad(lha)) * Math.sin(this.mf.rad(gLat)) -
                  Math.tan(this.mf.rad(dec)) * Math.cos(this.mf.rad(gLat)),
            ),
          ) +
          180,
      360,
    );
    return azm;
  }

  sunGeocentricAltitude(jd, deltaT, gLon, gLat) {
    const lha = this.sunGeocentricLocalHourAngle(jd, deltaT, gLon);
    const dec = this.sunGeocentricDeclination(jd, deltaT);
    const alt = this.mf.deg(
      Math.asin(
        Math.sin(this.mf.rad(gLat)) * Math.sin(this.mf.rad(dec)) +
            Math.cos(this.mf.rad(gLat)) *
                Math.cos(this.mf.rad(dec)) *
                Math.cos(this.mf.rad(lha)),
      ),
    );
    return alt;
  }

  sunGeocentricSemidiameter(jd, deltaT) {
    let r = this.earthRadiusVector(jd, deltaT);
    let s0 = 15 + 59.63 / 60; // 15'59.63" dalam menit
    let s = (s0 / r) / 60; // hasil dalam derajat
    return s;
  }

  sunEquatorialHorizontalParallax(jd, deltaT) {
    let er = this.earthRadiusVector(jd, deltaT);
    let phi = 8.794 / (er * 3600); // hasil dalam derajat
    return phi;
  }

  termU(gLat) {
    let u = Math.atan(0.99664719 * Math.tan(this.mf.rad(gLat)));
    return u;
  }

  termX(gLat, elev) {
    let u = this.termU(gLat);
    let x = Math.cos(u) + (elev / 6378140) * Math.cos(this.mf.rad(gLat));
    return x;
  }

  termY(gLat, elev) {
    let u = this.termU(gLat);
    let y =
        0.99664719 * Math.sin(u) + (elev / 6378140) * Math.sin(this.mf.rad(gLat));
    return y;
  }

  termN(jd, deltaT, gLon, gLat, elev) {
    let lambda = this.sunGeocentricLongitude(jd, deltaT, "Appa");
    let beta = this.sunGeocentricLatitude(jd, deltaT);
    let theta = this.localApparentSiderialTime(jd, deltaT, gLon);
    let x = this.termX(gLat, elev);
    let phi = this.sunEquatorialHorizontalParallax(jd, deltaT);
    let n =
        Math.cos(this.mf.rad(lambda)) * Math.cos(this.mf.rad(beta)) -
        x * Math.sin(this.mf.rad(phi)) * Math.cos(this.mf.rad(theta));
    return n;
  }

  parallaxInTheSunRightAscension(jd, deltaT, gLon, gLat, elev) {
    let x = this.termX(gLat, elev);
    let phi = this.sunEquatorialHorizontalParallax(jd, deltaT);
    let ha = this.sunGeocentricLocalHourAngle(jd, deltaT, gLon);
    let dec = this.sunGeocentricDeclination(jd, deltaT);
    let dAlpha = this.mf.deg(
      Math.atan2(
        -x * Math.sin(this.mf.rad(phi)) * Math.sin(this.mf.rad(ha)),
        Math.cos(this.mf.rad(dec)) -
            x * Math.sin(this.mf.rad(phi)) * Math.cos(this.mf.rad(ha)),
      ),
    );
    return dAlpha;
  }

  parallaxInTheSunAltitude(jd, deltaT, gLon, gLat, elev) {
    let h = this.sunGeocentricAltitude(jd, deltaT, gLon, gLat);
    let y = this.termY(gLat, elev);
    let x = this.termX(gLat, elev);
    let phi = this.sunEquatorialHorizontalParallax(jd, deltaT);
    let P = this.mf.deg(
      Math.sin(
        Math.sqrt(y * y + x * x) * Math.sin(this.mf.rad(phi)) * Math.cos(this.mf.rad(h)),
      ),
    );
    return P;
  }

  atmosphericRefractionFromAirlessAltitude(airlessAltitude, pressure, temperature) {
    let h = airlessAltitude;
    let P = pressure;
    let t = temperature;
    return (1.02 /
                Math.tan(this.mf.rad(h + 10.3 / (h + 5.11))) *
                P /
                1010 *
                283 /
                (273 + t) +
            0.0019279204034639303) /
        60;
  }

  sunTopocentricLongitude(jd, deltaT, gLon, gLat, elev) {
    let lambda = this.sunGeocentricLongitude(jd, deltaT, "Appa");
    let beta = this.sunGeocentricLatitude(jd, deltaT);
    let phi = this.sunEquatorialHorizontalParallax(jd, deltaT);
    let theta = this.localApparentSiderialTime(jd, deltaT, gLon);
    let eps = this.nt.trueObliquityOfEcliptic(jd, deltaT);
    let x = this.termX(gLat, elev);
    let y = this.termY(gLat, elev);
    let n = this.termN(jd, deltaT, gLon, gLat, elev);

    let lmbdP = this.mf.mod(
      this.mf.deg(
        Math.atan2(
          (Math.sin(this.mf.rad(lambda)) * Math.cos(this.mf.rad(beta)) -
              Math.sin(this.mf.rad(phi)) *
                  (y * Math.sin(this.mf.rad(eps)) +
                      x * Math.cos(this.mf.rad(eps)) * Math.sin(this.mf.rad(theta)))),
          n,
        ),
      ),
      360,
    );
    return lmbdP;
  }

  sunTopocentricLatitude(jd, deltaT, gLon, gLat, elev) {
    let lmbdP = this.sunTopocentricLongitude(jd, deltaT, gLon, gLat, elev);
    let beta = this.sunGeocentricLatitude(jd, deltaT);
    let phi = this.sunEquatorialHorizontalParallax(jd, deltaT);
    let theta = this.localApparentSiderialTime(jd, deltaT, gLon);
    let eps = this.nt.trueObliquityOfEcliptic(jd, deltaT);
    let x = this.termX(gLat, elev);
    let y = this.termY(gLat, elev);
    let n = this.termN(jd, deltaT, gLon, gLat, elev);

    let btaP = this.mf.deg(
      Math.atan(
        Math.cos(this.mf.rad(lmbdP)) *
            (Math.sin(this.mf.rad(beta)) -
                Math.sin(this.mf.rad(phi)) *
                    (y * Math.cos(this.mf.rad(eps)) -
                        x * Math.sin(this.mf.rad(eps)) * Math.sin(this.mf.rad(theta)))) /
            n,
      ),
    );
    return btaP;
  }

  sunTopocentricRightAscension(jd, deltaT, gLon, gLat, elev) {
    let alpha = this.sunGeocentricRightAscension(jd, deltaT);
    let dAlpha = this.parallaxInTheSunRightAscension(
      jd,
      deltaT,
      gLon,
      gLat,
      elev,
    );
    let alphP = alpha + dAlpha;
    return alphP;
  }

  sunTopocentricDeclination(jd, deltaT, gLon, gLat, elev) {
    let dec = this.sunGeocentricDeclination(jd, deltaT);
    let y = this.termY(gLat, elev);
    let x = this.termX(gLat, elev);
    let phi = this.sunEquatorialHorizontalParallax(jd, deltaT);
    let dAlph = this.parallaxInTheSunRightAscension(jd, deltaT, gLon, gLat, elev);
    let ha = this.sunGeocentricLocalHourAngle(jd, deltaT, gLon);

    let dltP = this.mf.deg(
      Math.atan2(
        (Math.sin(this.mf.rad(dec)) - y * Math.sin(this.mf.rad(phi))) *
            Math.cos(this.mf.rad(dAlph)),
        Math.cos(this.mf.rad(dec)) -
            x * Math.sin(this.mf.rad(phi)) * Math.cos(this.mf.rad(ha)),
      ),
    );

    return dltP;
  }

  sunTopocentricGreenwichHourAngle(jd, deltaT, gLon, gLat, elev) {
    let gast = this.greenwichApparentSiderialTime(jd, deltaT);
    let alpha = this.sunTopocentricRightAscension(jd, deltaT, gLon, gLat, elev);
    let gha = this.mf.mod(gast - alpha, 360.0);
    return gha;
  }

  sunTopocentricLocalHourAngel(jd, deltaT, gLon, gLat, elev) {
    let lha = this.sunGeocentricLocalHourAngle(jd, deltaT, gLon);
    let dAlph = this.parallaxInTheSunRightAscension(jd, deltaT, gLon, gLat, elev);
    let lhaP = lha - dAlph;
    return lhaP;
  }

  sunTopocentricAzimuth(jd, deltaT, gLon, gLat, elev) {
    let lhaP = this.sunTopocentricLocalHourAngel(jd, deltaT, gLon, gLat, elev);
    let dltP = this.sunTopocentricDeclination(jd, deltaT, gLon, gLat, elev);

    let azmP = this.mf.mod(
      this.mf.deg(
            Math.atan2(
              Math.sin(this.mf.rad(lhaP)),
              Math.cos(this.mf.rad(lhaP)) * Math.sin(this.mf.rad(gLat)) -
                  Math.tan(this.mf.rad(dltP)) * Math.cos(this.mf.rad(gLat)),
            ),
          ) +
          180,
      360,
    );

    return azmP;
  }

  sunTopocentricAltitude(jd, deltaT, gLon, gLat, elev, pres, temp, opt) {
    let dec = this.sunTopocentricDeclination(jd, deltaT, gLon, gLat, elev);
    let lha = this.sunTopocentricLocalHourAngel(jd, deltaT, gLon, gLat, elev);
    let dip = 1.75 / 60 * Math.sqrt(elev);
    let sdm = this.sunTopocentricSemidiameter(jd, deltaT, gLon, gLat, elev);

    //let h = this.sunGeocentricAltitude(jd, deltaT, gLon, gLat);

    //Airless Altitude
    let htc = this.mf.deg(
      Math.asin(
        Math.sin(this.mf.rad(gLat)) * Math.sin(this.mf.rad(dec)) +
            Math.cos(this.mf.rad(gLat)) *
                Math.cos(this.mf.rad(dec)) *
                Math.cos(this.mf.rad(lha)),
      ),
    ); //center

    let htu = htc + sdm; //upper
    let htl = htc - sdm; //Lower

    //Refraksi Upper,Center dan Lower
    let rhtu = this.atmosphericRefractionFromAirlessAltitude(htu, pres, temp);
    let rhtc = this.atmosphericRefractionFromAirlessAltitude(htc, pres, temp);
    let rhtl = this.atmosphericRefractionFromAirlessAltitude(htc, pres, temp);

    //Apparent Altitude
    let htau = htu + rhtu;
    let htac = htc + rhtc;
    let htal = htl + rhtl;

    //observered Altitude

    let htou = htau + dip;
    let htoc = htac + dip;
    let htol = htal + dip;

    switch (opt) {
      case "htu":
        return htu;
      case "htc":
        return htc;
      case "htl":
        return htl;

      case "htau":
        return htau;
      case "htac":
        return htac;
      case "htal":
        return htal;

      case "htou":
        return htou;
      case "htoc":
        return htoc;
      case "htol":
        return htol;
      default:
        return htc;
    }
  }

  sunTopocentricSemidiameter(jd, deltaT, gLon, gLat, elev) {
    let lmbdP = this.sunTopocentricLongitude(jd, deltaT, gLon, gLat, elev);
    let betaP = this.sunTopocentricLatitude(jd, deltaT, gLon, gLat, elev);
    let s = this.sunGeocentricSemidiameter(jd, deltaT);
    let n = this.termN(jd, deltaT, gLon, gLat, elev);

    let sP = this.mf.deg(
      Math.asin(
        Math.cos(this.mf.rad(lmbdP)) *
            Math.cos(this.mf.rad(betaP)) *
            Math.sin(this.mf.rad(s)) /
            n,
      ),
    );

    return sP;
  }

  equationOfTime(jd, deltaT) {
    let jde = jd + deltaT / 86400;
    let t = this.julianDay.jc(jde);
    let tau = this.julianDay.jm(t);

    let alpha = this.sunGeocentricRightAscension(jd, deltaT);
    let dPsi = this.nt.nutationInLongitude(jd, deltaT);
    let epsln = this.nt.trueObliquityOfEcliptic(jd, deltaT);

    let lo = this.mf.mod(
      280.4664567 +
          360007.6982779 * tau +
          0.03032028 * Math.pow(tau, 2.0) +
          Math.pow(tau, 3.0) / 49931 -
          Math.pow(tau, 4.0) / 15300 -
          Math.pow(tau, 5.0) / 2000000,
      360,
    );

    let e = lo - 0.0057183 - alpha + dPsi * Math.cos(this.mf.rad(epsln));

    if ((Math.abs(e) * 4) < 20) {
      e = e / 15;
    } else if ((Math.abs(e) * 4 >= 20) && (e > 0)) {
      e = e / 15 - 24;
    } else if ((Math.abs(e) * 4 >= 20) && (e < 0)) {
      e = e / 15 + 24;
    } else {
      e = e / 15;
    }

    return e;
  }

  jdGhurubSyams(jdNM, gLat, gLon, gAlt, tmZn) {
    let cjdn;
    let jdGS = 0.0;
    let jdEGS;
    let dltS, sdS, eot, rfS, dip, altTS, coshaS, haS, kwd;
    let jSunSet = 17.0;

    // ✅ FIX: Konversi jdNM ke local calendar day
    cjdn = Math.floor((jdNM + 0.5 + tmZn / 24.0));

    for (let itr = 1; itr <= 2; itr++) {
      // jdGS tetap dalam UT: LCT - tmZn
      jdGS = cjdn - 0.5 + (jSunSet - tmZn) / 24.0;
      jdEGS = jdGS + this.dt.deltaT(jdGS) / 86400.0;

      dltS = this.sunGeocentricDeclination(jdEGS, 0);
      sdS = this.sunGeocentricSemidiameter(jdEGS, 0);
      eot = this.equationOfTime(jdEGS, 0);

      rfS = 34.16 / 60.0;
      dip = 2.1 * Math.sqrt(gAlt) / 60.0;
      altTS = -(sdS + rfS + dip - 0.0024);

      coshaS =
          (Math.sin(this.mf.rad(altTS)) -
              Math.sin(this.mf.rad(gLat)) * Math.sin(this.mf.rad(dltS))) /
          (Math.cos(this.mf.rad(gLat)) * Math.cos(this.mf.rad(dltS)));

      if (Math.abs(coshaS) < 1) {
        haS = this.mf.deg(Math.acos(coshaS));
        kwd = gLon / 15.0 - tmZn;
        jSunSet = haS / 15.0 + 12.0 - eot - kwd;
        jdGS = cjdn - 0.5 + (jSunSet - tmZn) / 24.0;
      } else {
        jdGS = 0.0;
      }
    }

    return jdGS;
  }

  jdGhurubSyams2(jdNM, gLat, gLon, gAlt, tmZn) {
    let cjdn;
    let jdGS = 0.0;
    let jdEGS;
    let dltS, sdS, eot, rfS, dip, altTS, coshaS, haS, kwd;
    let jSunSet = 17.0;

    // ✅ FIX: Konversi jdNM ke local calendar day
    cjdn = Math.floor((jdNM + 0.5 + 0.0 / 24.0));

    for (let itr = 1; itr <= 2; itr++) {
      // jdGS tetap dalam UT: LCT - tmZn
      jdGS = cjdn - 0.5 + (jSunSet - tmZn) / 24.0;
      jdEGS = jdGS + this.dt.deltaT(jdGS) / 86400.0;

      dltS = this.sunGeocentricDeclination(jdEGS, 0);
      sdS = this.sunGeocentricSemidiameter(jdEGS, 0);
      eot = this.equationOfTime(jdEGS, 0);

      rfS = 34.16 / 60.0;
      dip = 2.1 * Math.sqrt(gAlt) / 60.0;
      altTS = -(sdS + rfS + dip - 0.0024);

      coshaS =
          (Math.sin(this.mf.rad(altTS)) -
              Math.sin(this.mf.rad(gLat)) * Math.sin(this.mf.rad(dltS))) /
          (Math.cos(this.mf.rad(gLat)) * Math.cos(this.mf.rad(dltS)));

      if (Math.abs(coshaS) < 1) {
        haS = this.mf.deg(Math.acos(coshaS));
        kwd = gLon / 15.0 - tmZn;
        jSunSet = haS / 15.0 + 12.0 - eot - kwd;
        jdGS = cjdn - 0.5 + (jSunSet - tmZn) / 24.0;
      } else {
        jdGS = 0.0;
      }
    }

    return jdGS;
  }
}

