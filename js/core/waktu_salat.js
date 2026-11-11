/**
 * waktu_salat.js — Algoritma waktu salat per waktu (Subuh, Syuruk, Zuhur, Asar, Magrib, Isya, ...).
 * Sumber Dart: core/prayer/waktu_salat.dart
 * Kelas: WaktuSalat
 * Fungsi: zuhur, asar, magrib, isya, subuh, syuruk, duha, nisfuLail, ihtiyathShalat
 */
class WaktuSalat {
  julianDay = new JulianDay();
  mf = new MathFunction();
  dt = new DynamicalTime();
  sn = new SunFunction();

  // ==========================
  // ZUHUR
  // ==========================
  zuhur(tglM, blnM, thnM, gLon, tmZn) {
    let zhr = 12.0;

    for (let i = 1; i <= 3; i++) {
      const jd = this.julianDay.kmjd(tglM, blnM, thnM, zhr, tmZn);
      const jde = jd + (this.dt.deltaT(jd) / 86400);
      const eoT = this.sn.equationOfTime(jde, 0.0);
      const kwd = (gLon - (tmZn * 15.0)) / 15.0;

      zhr = 12 - eoT - kwd;
    }

    return new SalatValue({time: zhr, status: SalatStatus.normal});
  }

  // ==========================
  // ASAR
  // ==========================
  asar(tglM, blnM, thnM, gLon, gLat, tmZn) {
    let asr = 15.0;

    for (let i = 1; i <= 3; i++) {
      const jd = this.julianDay.kmjd(tglM, blnM, thnM, asr, tmZn);
      const jde = jd + (this.dt.deltaT(jd) / 86400);
      const eoT = this.sn.equationOfTime(jde, 0.0);
      const dec = this.sn.sunGeocentricDeclination(jde, 0.0);
      const kwd = (gLon - (tmZn * 15.0)) / 15.0;

      const zm = Math.abs((gLat - dec));
      const hm = this.mf.deg(Math.atan(1 / (Math.tan(this.mf.rad(zm)) + 1)));

      const cost = -Math.tan(this.mf.rad(gLat)) * Math.tan(this.mf.rad(dec));

      const costm =
          cost + Math.sin(this.mf.rad(hm)) / Math.cos(this.mf.rad(gLat)) / Math.cos(this.mf.rad(dec));

      if (cost < -1) {
        return new SalatValue({time: null, status: SalatStatus.up});
      }

      if (cost > 1) {
        return new SalatValue({time: null, status: SalatStatus.down});
      }

      const tm = this.mf.deg(Math.acos(costm));
      asr = (12 - eoT) + tm / 15.0 - kwd;
    }

    return new SalatValue({time: asr, status: SalatStatus.normal});
  }

  // ==========================
  // MAGRIB
  // ==========================
  magrib(tglM, blnM, thnM, gLon, gLat, elev, tmZn) {
    let mgr = 18.0;

    for (let i = 1; i <= 3; i++) {
      const jd = this.julianDay.kmjd(tglM, blnM, thnM, mgr, tmZn);
      const jde = jd + (this.dt.deltaT(jd) / 86400.0);
      const eoT = this.sn.equationOfTime(jde, 0.0);
      const dec = this.sn.sunGeocentricDeclination(jde, 0.0);
      const sd = this.sn.sunGeocentricSemidiameter(jde, 0.0);
      const kwd = (gLon - (tmZn * 15.0)) / 15.0;

      const dip = 1.76 / 60.0 * Math.sqrt(elev);
      const hm = -(sd + 34.5 / 60.0 + dip);

      const costm =
          -Math.tan(this.mf.rad(gLat)) * Math.tan(this.mf.rad(dec)) +
          Math.sin(this.mf.rad(hm)) / Math.cos(this.mf.rad(gLat)) / Math.cos(this.mf.rad(dec));

      if (costm < -1) {
        return new SalatValue({time: null, status: SalatStatus.up});
      }

      if (costm > 1) {
        return new SalatValue({time: null, status: SalatStatus.down});
      }

      const tm = this.mf.deg(Math.acos(costm));
      mgr = 12 - eoT + tm / 15.0 - kwd;
    }

    return new SalatValue({time: mgr, status: SalatStatus.normal});
  }

  // ==========================
  // ISYA
  // ==========================
  isya(tglM, blnM, thnM, gLon, gLat, tmZn, hm) {
    let isy = 19.0;
    const hmValue = hm ?? -18.0;

    for (let i = 1; i <= 3; i++) {
      const jd = this.julianDay.kmjd(tglM, blnM, thnM, isy, tmZn);
      const jde = jd + (this.dt.deltaT(jd) / 86400.0);
      const eoT = this.sn.equationOfTime(jde, 0.0);
      const dec = this.sn.sunGeocentricDeclination(jde, 0.0);
      const kwd = (gLon - (tmZn * 15.0)) / 15.0;

      //const hm = -18.0;

      const costm =
          -Math.tan(this.mf.rad(gLat)) * Math.tan(this.mf.rad(dec)) +
          Math.sin(this.mf.rad(hmValue)) / Math.cos(this.mf.rad(gLat)) / Math.cos(this.mf.rad(dec));

      if (costm < -1) {
        return new SalatValue({time: null, status: SalatStatus.bright});
      }

      if (costm > 1) {
        return new SalatValue({time: null, status: SalatStatus.dark});
      }

      const tm = this.mf.deg(Math.acos(costm));
      isy = 12 - eoT + tm / 15.0 - kwd;
    }

    return new SalatValue({time: isy, status: SalatStatus.normal});
  }

  // ==========================
  // SUBUH
  // ==========================
  subuh(tglM, blnM, thnM, gLon, gLat, tmZn, hm) {
    let sbh = 4.0;
    const hmValue = hm ?? -20.0; // Default fallback

    for (let i = 1; i <= 3; i++) {
      const jd = this.julianDay.kmjd(tglM, blnM, thnM, sbh, tmZn);
      const jde = jd + (this.dt.deltaT(jd) / 86400.0);
      const eoT = this.sn.equationOfTime(jde, 0.0);
      const dec = this.sn.sunGeocentricDeclination(jde, 0.0);
      const kwd = (gLon - (tmZn * 15.0)) / 15.0;

      //const hm = -20.0;

      const costm =
          -Math.tan(this.mf.rad(gLat)) * Math.tan(this.mf.rad(dec)) +
          Math.sin(this.mf.rad(hmValue)) / Math.cos(this.mf.rad(gLat)) / Math.cos(this.mf.rad(dec));

      if (costm < -1) {
        return new SalatValue({time: null, status: SalatStatus.bright});
      }

      if (costm > 1) {
        return new SalatValue({time: null, status: SalatStatus.dark});
      }

      const tm = this.mf.deg(Math.acos(costm));
      sbh = 12 - eoT - tm / 15.0 - kwd;
    }

    return new SalatValue({time: sbh, status: SalatStatus.normal});
  }

  syuruk(tglM, blnM, thnM, gLon, gLat, elev, tmZn) {
    let syk = 6.0;

    for (let i = 1; i <= 3; i++) {
      const jd = this.julianDay.kmjd(tglM, blnM, thnM, syk, tmZn);
      const jde = jd + (this.dt.deltaT(jd) / 86400.0);
      const eoT = this.sn.equationOfTime(jde, 0.0);
      const dec = this.sn.sunGeocentricDeclination(jde, 0.0);
      const sd = this.sn.sunGeocentricSemidiameter(jde, 0.0);
      const kwd = (gLon - (tmZn * 15.0)) / 15.0;

      const dip = 1.76 / 60.0 * Math.sqrt(elev);
      const hm = -(sd + 34.5 / 60.0 + dip);

      const costm =
          -Math.tan(this.mf.rad(gLat)) * Math.tan(this.mf.rad(dec)) +
          Math.sin(this.mf.rad(hm)) / Math.cos(this.mf.rad(gLat)) / Math.cos(this.mf.rad(dec));

      if (costm < -1) {
        return new SalatValue({time: null, status: SalatStatus.up});
      }

      if (costm > 1) {
        return new SalatValue({time: null, status: SalatStatus.down});
      }

      const tm = this.mf.deg(Math.acos(costm));
      syk = 12 - eoT - tm / 15.0 - kwd;
    }

    return new SalatValue({time: syk, status: SalatStatus.normal});
  }

  duha(tglM, blnM, thnM, gLon, gLat, elev, tmZn) {
    const wSyk = this.syuruk(tglM, blnM, thnM, gLon, gLat, elev, tmZn);

    if (!wSyk.isNormal) {
      return new SalatValue({time: null, status: SalatStatus.invalid});
    }

    const duh = wSyk.time + 15 / 60.0;

    return new SalatValue({time: duh, status: SalatStatus.normal});
  }

  nisfuLail(tglM, blnM, thnM, gLon, gLat, elev, tmZn, {prayerMethod} = {}) {
    const wMgb = this.magrib(tglM, blnM, thnM, gLon, gLat, elev, tmZn);
    const wSbh = this.subuh(
      tglM,
      blnM,
      thnM,
      gLon,
      gLat,
      tmZn,
      prayerMethod.hmSubuh,
    );

    if (!wMgb.isNormal || !wSbh.isNormal) {
      return new SalatValue({time: null, status: SalatStatus.invalid});
    }

    const intr = (this.mf.mod(wSbh.time - wMgb.time, 24.0)) / 2.0;
    const nisf = wMgb.time + intr;

    return new SalatValue({time: nisf, status: SalatStatus.normal});
  }

  ihtiyathShalat(jamDesWs, ihtiyath) {
    let uDHrs = jamDesWs;
    let uHrs = Math.floor(jamDesWs);
    let uDMin = (uDHrs - uHrs) * 60.0;
    let uMin = Math.floor(uDMin) + ihtiyath;

    if (uMin == 60.0) {
      uMin = 0.0;
      uHrs = uHrs + 1.0;
    }

    let iht = uHrs + uMin / 60;
    return iht;
  }
}

