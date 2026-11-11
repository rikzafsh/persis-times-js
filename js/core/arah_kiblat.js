/**
 * arah_kiblat.js — Arah dan jarak kiblat: bola, koreksi elipsoid, Vincenty.
 * Sumber Dart: core/qibla/arah_kiblat.dart
 * Kelas: ArahKiblat
 * Fungsi: arahQiblatSpherical, arahQiblaWithEllipsoidCorrection, arahQiblaVincenty, jarakQiblatSpherical, jarakQiblatEllipsoid, bayanganQiblatHarian, rashdulQiblat, antipodaKabah, rashdulQiblatBulan
 */
class ArahKiblat {
  julianDay = new JulianDay();
  dynamicalTime = new DynamicalTime();
  mf = new MathFunction();
  sn = new SunFunction();
  mn = new MoonFunction();

  arahQiblatSpherical(gLon, gLat) {
    const gLatKabah = 21.0 + 25.0 / 60.0 + 21.02 / 3600.0;
    const gLonKabah = 39.0 + 49.0 / 60.0 + 34.27 / 3600.0;

    const a = (90.0 - gLat);
    const b = (90.0 - gLatKabah);
    const c = (gLon - gLonKabah);

    const sB = Math.sin(this.mf.rad(b)) * Math.sin(this.mf.rad(c));
    const cB =
        Math.cos(this.mf.rad(b)) * Math.sin(this.mf.rad(a)) -
        Math.cos(this.mf.rad(a)) * Math.sin(this.mf.rad(b)) * Math.cos(this.mf.rad(c));
    const bB = this.mf.deg(Math.atan2(sB, cB));
    const azQ = this.mf.mod((360.0 - bB), 360.0);
    return azQ;
  }

  arahQiblaWithEllipsoidCorrection(gLon, gLat) {
    const gLatKabah = 21.0 + 25.0 / 60.0 + 21.02 / 3600.0;
    const gLonKabah = 39.0 + 49.0 / 60.0 + 34.27 / 3600.0;

    const e = 0.0066943800229;
    const gLatKprime = this.mf.deg(Math.atan((1 - e) * Math.tan(this.mf.rad(gLatKabah))));
    const gLatPprime = this.mf.deg(Math.atan((1 - e) * Math.tan(this.mf.rad(gLat))));

    const a = (90.0 - gLatPprime);
    const b = (90.0 - gLatKprime);
    const c = (gLon - gLonKabah);

    const sB = Math.sin(this.mf.rad(b)) * Math.sin(this.mf.rad(c));
    const cB =
        Math.cos(this.mf.rad(b)) * Math.sin(this.mf.rad(a)) -
        Math.cos(this.mf.rad(a)) * Math.sin(this.mf.rad(b)) * Math.cos(this.mf.rad(c));
    const bB = this.mf.deg(Math.atan2(sB, cB));
    const azQ = this.mf.mod((360.0 - bB), 360.0);
    return azQ;
  }

  arahQiblaVincenty(gLon, gLat, optResult) {
    const gLatKabah = 21 + 25 / 60.0 + 21.02 / 3600.0;
    const gLonKabah = 39 + 49 / 60.0 + 34.27 / 3600.0;

    const f = 1.0 / 298.257223563;
    const ae = 6378137.0;
    const be = 6356752.314245180;

    const u1 = Math.atan((1 - f) * Math.tan(this.mf.rad(gLatKabah)));
    const u2 = Math.atan((1 - f) * Math.tan(this.mf.rad(gLat)));
    const l0 = this.mf.rad(gLon - gLonKabah);

    let lambda = l0;
    let lambda0 = 0.0;
    let sigma = 0.0;
    let sAlpha = 0.0;
    let c2Alpha = 0.0;
    let c2SigmaM = 0.0;
    let cSigma = 0.0;
    let sSigma = 0.0;
    let iterlimit = 0;

    do {
      iterlimit++;
      lambda0 = lambda;
      cSigma =
          Math.sin(u1) * Math.sin(u2) +
          Math.cos(u1) * Math.cos(u2) * Math.cos(lambda);
      sSigma = Math.sqrt(
        Math.pow(Math.cos(u2) * Math.sin(lambda), 2.0) +
            Math.pow(
              Math.cos(u1) * Math.sin(u2) -
                  Math.sin(u1) * Math.cos(u2) * Math.cos(lambda),
              2.0,
            ),
      );
      sigma = Math.atan2(sSigma, cSigma);
      sAlpha = Math.cos(u1) * Math.cos(u2) * Math.sin(lambda) / sSigma;
      c2Alpha = 1.0 - Math.pow(sAlpha, 2.0);
      c2SigmaM = cSigma - 2.0 * Math.sin(u1) * Math.sin(u2) / c2Alpha;
      const c = f / 16.0 * c2Alpha * (4.0 + f * (4.0 - 3.0 * c2Alpha));
      lambda =
          l0 +
          (1.0 - c) *
              f *
              sAlpha *
              (sigma +
                  c *
                      sSigma *
                      (c2SigmaM +
                          c * cSigma * (-1.0 + 2.0 * Math.pow(c2SigmaM, 2.0))));
    } while (Math.abs((lambda - lambda0)) > 1e-12 && iterlimit < 100);

    const alpha1 = Math.atan2(
      Math.cos(u2) * Math.sin(lambda),
      Math.cos(u1) * Math.sin(u2) -
          Math.sin(u1) * Math.cos(u2) * Math.cos(lambda),
    );
    const alpha2 = Math.atan2(
      Math.cos(u1) * Math.sin(lambda),
      -Math.sin(u1) * Math.cos(u2) +
          Math.cos(u1) * Math.sin(u2) * Math.cos(lambda),
    );

    const up2 =
        c2Alpha * (Math.pow(ae, 2.0) - Math.pow(be, 2.0)) / Math.pow(be, 2.0);
    const a = 1 + up2 / 16384 * (4096 + up2 * (-768 + up2 * (320 - 175 * up2)));
    const b = up2 / 1024 * (256 + up2 * (-128 + up2 * (74 - 47 * up2)));

    const dSigma =
        b *
        sSigma *
        (c2SigmaM +
            0.25 *
                b *
                (cSigma * (-1 + 2 * Math.pow(c2SigmaM, 2.0)) -
                    1 /
                        6 *
                        b *
                        c2SigmaM *
                        (-3 + 4 * Math.pow(sSigma, 2.0)) *
                        (-3 + 4 * Math.pow(c2SigmaM, 2.0))));
    const s = be * a * (sigma - dSigma);

    switch (optResult) {
      case "PtoQ":
        return this.mf.mod(180 + this.mf.deg(alpha2), 360.0);
      case "QtoP":
        return this.mf.mod(this.mf.deg(alpha1), 360.0);
      case "Dist":
        return s;
      default:
        return this.mf.mod(180 + this.mf.deg(alpha2), 360.0);
    }
  }

  jarakQiblatSpherical(gLon, gLat) {
    const gLonK = (39.0 + 49.0 / 60.0 + 34.27 / 3600.0);
    const gLatK = (21.0 + 25.0 / 60.0 + 21.02 / 3600.0);

    const d = this.mf.deg(
      Math.acos(
        Math.sin(this.mf.rad(gLat)) * Math.sin(this.mf.rad(gLatK)) +
            Math.cos(this.mf.rad(gLat)) *
                Math.cos(this.mf.rad(gLatK)) *
                Math.cos(this.mf.rad(gLonK - gLon)),
      ),
    );

    const s = 6378.137 * d / 57.2957795;
    return s;
  }

  jarakQiblatEllipsoid(gLon, gLat) {
    const pi2 = 3.14159265358979;

    const gLatK = (21.0 + 25.0 / 60.0 + 21.02 / 3600.0);
    const gLonK = (39.0 + 49.0 / 60.0 + 34.27 / 3600.0);

    const u = (gLatK + gLat) / 2.0;
    const g = (gLatK - gLat) / 2.0;
    const j = (gLonK - gLon) / 2.0;

    const m =
        Math.pow(Math.sin(this.mf.rad(g)), 2.0) *
            Math.pow(Math.cos(this.mf.rad(j)), 2.0) +
        Math.pow(Math.cos(this.mf.rad(u)), 2.0) * Math.pow(Math.sin(this.mf.rad(j)), 2.0);

    const n =
        Math.pow(Math.cos(this.mf.rad(g)), 2.0) *
            Math.pow(Math.cos(this.mf.rad(j)), 2.0) +
        Math.pow(Math.sin(this.mf.rad(u)), 2.0) * Math.pow(Math.sin(this.mf.rad(j)), 2.0);

    const w = Math.atan(Math.sqrt(m / n));
    const p = (Math.sqrt(m * n)) / w;

    const d = this.mf.deg(((2 * w) * 6378.137) / (180.0 / pi2));

    const e1 = ((3 * p) - 1) / (2 * n);
    const e2 = ((3 * p) + 1) / (2 * m);

    const f = 1 / 298.25722;

    const s =
        d *
        (1 +
            f *
                e1 *
                Math.pow(Math.sin(this.mf.rad(u)), 2.0) *
                Math.pow(Math.cos(this.mf.rad(g)), 2.0) -
            f *
                e2 *
                Math.pow(Math.cos(this.mf.rad(u)), 2.0) *
                Math.pow(Math.sin(this.mf.rad(g)), 2.0));

    return s;
  }

  bayanganQiblatHarian(gLon, gLat, tglM, blnM, thnM, tmZn, azQiblat, opt) {
    let jd, jde, dm, e, azQ, b, p, ca, bq;

    bq = 12.0;

    for (let i = 1; i <= 3; i++) {
      jd = this.julianDay.kmjd(tglM, blnM, thnM, bq, tmZn);
      jde = jd + this.dynamicalTime.deltaT(jd) / 86400.0;
      dm = this.sn.sunGeocentricDeclination(jde, 0.0);
      e = this.sn.equationOfTime(jde, 0.0);

      // Pilih metode azimut kiblat
      switch (azQiblat.toLowerCase()) {
        case "ellipsoid":
          azQ = this.arahQiblaWithEllipsoidCorrection(gLon, gLat);
          break;
        case "vincenty":
          azQ = this.arahQiblaVincenty(gLon, gLat, "PtoQ");
          break;
        default: // spherical
          azQ = this.arahQiblatSpherical(gLon, gLat);
      }

      b = 90 - gLat;

      p = this.mf.deg(Math.atan(1 / (Math.cos(this.mf.rad(b)) * Math.tan(this.mf.rad(azQ)))));

      // Guard: argumen acos harus dalam range [-1, 1]
      let cosArg =
          Math.tan(this.mf.rad(dm)) * Math.tan(this.mf.rad(b)) * Math.cos(this.mf.rad(p));

      if (cosArg < -1.0 || cosArg > 1.0) return null;

      ca = this.mf.deg(Math.acos(cosArg));

      switch (opt) {
        case 1:
          bq = this.mf.mod(
            (-(p - ca) / 15) + (12 - e) + ((tmZn * 15) - gLon) / 15,
            24.0,
          );
          break;
        case 2:
          bq = this.mf.mod(
            (-(p + ca) / 15) + (12 - e) + ((tmZn * 15) - gLon) / 15,
            24.0,
          );
          break;
        default:
          return null;
      }
    }

    return this.mf.mod(bq, 24.0);
  }

  rashdulQiblat(thnM, tmZn, opt) {
    const gLatK = 21.0 + 25.0 / 60.0 + 21.02 / 3600.0;
    const gLonK = 39.0 + 49.0 / 60.0 + 34.27 / 3600.0;
    const tmZnK = 3.0;

    let trs1 = 12.0;
    let trs2 = 12.0;
    let trs3 = 12.0;
    let jdResult = 0.0;

    bulanLoop:
    for (let n = 1; n <= 12; n++) {
      for (let i = 1; i <= 31; i++) {
        for (let z = 1; z <= 3; z++) {
          const jd01 = this.julianDay.kmjd(i, n, thnM, trs1, tmZnK);
          const jde1 = jd01 + (this.dynamicalTime.deltaT(jd01) / 86400.0);
          const eoT1 = this.sn.equationOfTime(jde1, 0.0);
          trs1 = 12 - eoT1 - (gLonK - (tmZnK * 15)) / 15;

          const jd02 = this.julianDay.kmjd(i + 1, n, thnM, trs2, tmZnK);
          const jde2 = jd02 + (this.dynamicalTime.deltaT(jd02) / 86400.0);
          const eoT2 = this.sn.equationOfTime(jde2, 0.0);
          trs2 = 12 - eoT2 - (gLonK - (tmZnK * 15)) / 15;

          const jd03 = this.julianDay.kmjd(i + 2, n, thnM, trs3, tmZnK);
          const jde3 = jd03 + (this.dynamicalTime.deltaT(jd03) / 86400.0);
          const eoT3 = this.sn.equationOfTime(jde3, 0.0);
          trs3 = 12 - eoT3 - (gLonK - (tmZnK * 15)) / 15;
        }

        const jd1 = this.julianDay.kmjd(i, n, thnM, trs1, tmZnK);
        const jd2 = this.julianDay.kmjd(i + 1, n, thnM, trs2, tmZnK);
        const jd3 = this.julianDay.kmjd(i + 2, n, thnM, trs3, tmZnK);

        const dS01 = this.sn.sunGeocentricDeclination(
          jd1 + this.dynamicalTime.deltaT(jd1) / 86400.0,
          0.0,
        );
        const dS02 = this.sn.sunGeocentricDeclination(
          jd2 + this.dynamicalTime.deltaT(jd2) / 86400.0,
          0.0,
        );
        const dS03 = this.sn.sunGeocentricDeclination(
          jd3 + this.dynamicalTime.deltaT(jd3) / 86400.0,
          0.0,
        );

        const dlt1 = Math.abs((gLatK - dS01));
        const dlt2 = Math.abs((gLatK - dS02));
        const dlt3 = Math.abs((gLatK - dS03));

        if ((dlt1 > dlt2) && (dlt2 < dlt3)) {
          jdResult = jd2;

          switch (opt) {
            case 1:
              break bulanLoop;
            case 2:
              continue bulanLoop;
          }
        }
      }
    }

    const dm = this.sn.sunGeocentricDeclination(jdResult, 0.0);
    const h = 90.0 - Math.abs((gLatK - dm));
    const jamDes =  parseFloat(this.julianDay.jdkm(jdResult, tmZn, "JAM DES"));

    return new QiblaEventResult({
      jd: jdResult,
      jamDes: jamDes,
      tinggi: h,
      deklinasi: dm,
    });
  }

  antipodaKabah(thnM, tmZn, opt) {
    const gLatK = -(21.0 + 25.0 / 60.0 + 21.02 / 3600.0);
    const gLonK = 39.0 + 49.0 / 60.0 + 34.27 / 3600.0;
    const tmZnK = 3.0;

    let trs1 = 24.0;
    let trs2 = 24.0;
    let trs3 = 24.0;
    let jdResult = 0.0;

    bulanLoop:
    for (let n = 1; n <= 12; n++) {
      for (let i = 1; i <= 31; i++) {
        // Iterasi koreksi waktu transit
        for (let z = 1; z <= 3; z++) {
          const jd01 = this.julianDay.kmjd(i, n, thnM, trs1, tmZnK);
          const jde1 = jd01 + (this.dynamicalTime.deltaT(jd01) / 86400.0);
          const eoT1 = this.sn.equationOfTime(jde1, 0.0);
          trs1 = 24 - eoT1 - (gLonK - (tmZnK * 15)) / 15;

          const jd02 = this.julianDay.kmjd(i + 1, n, thnM, trs2, tmZnK);
          const jde2 = jd02 + (this.dynamicalTime.deltaT(jd02) / 86400.0);
          const eoT2 = this.sn.equationOfTime(jde2, 0.0);
          trs2 = 24 - eoT2 - (gLonK - (tmZnK * 15)) / 15;

          const jd03 = this.julianDay.kmjd(i + 2, n, thnM, trs3, tmZnK);
          const jde3 = jd03 + (this.dynamicalTime.deltaT(jd03) / 86400.0);
          const eoT3 = this.sn.equationOfTime(jde3, 0.0);
          trs3 = 24 - eoT3 - (gLonK - (tmZnK * 15)) / 15;
        }

        const jd1 = this.julianDay.kmjd(i, n, thnM, trs1, tmZnK);
        const jd2 = this.julianDay.kmjd(i + 1, n, thnM, trs2, tmZnK);
        const jd3 = this.julianDay.kmjd(i + 2, n, thnM, trs3, tmZnK);

        const dS01 = this.sn.sunGeocentricDeclination(
          jd1 + this.dynamicalTime.deltaT(jd1) / 86400.0,
          0.0,
        );
        const dS02 = this.sn.sunGeocentricDeclination(
          jd2 + this.dynamicalTime.deltaT(jd2) / 86400.0,
          0.0,
        );
        const dS03 = this.sn.sunGeocentricDeclination(
          jd3 + this.dynamicalTime.deltaT(jd3) / 86400.0,
          0.0,
        );

        const dlt1 = Math.abs((gLatK - dS01));
        const dlt2 = Math.abs((gLatK - dS02));
        const dlt3 = Math.abs((gLatK - dS03));

        // Cari minimum lokal (event sebenarnya)
        if ((dlt1 > dlt2) && (dlt2 < dlt3)) {
          jdResult = jd2;

          switch (opt) {
            case 1:
              break bulanLoop;
            case 2:
              continue bulanLoop;
          }
        }
      }
    }

    const dm = this.sn.sunGeocentricDeclination(jdResult, 0.0);
    const h = -(90.0 - Math.abs((gLatK - dm)));
    const jamDes =  parseFloat(this.julianDay.jdkm(jdResult, tmZn, "JAM DES"));

    return new QiblaEventResult({
      jd: jdResult,
      jamDes: jamDes,
      tinggi: h,
      deklinasi: dm,
    });
  }

  // List<QiblaEventResult> rashdulQiblatBulan(int tahun, double tmZn) {
  //   const gLatK = 21.0 + 25.0 / 60.0 + 21.02 / 3600.0;

  //   let results = [];

  //   const jdStart = julianDay.kmjd(1, 1, tahun, 0, 0);
  //   const jdEnd = julianDay.kmjd(31, 12, tahun, 24, 0);

  //   const step = 0.25; // 6 jam

  //   let jd1 = jdStart;

  //   while (jd1 < jdEnd) {
  //     const jd2 = jd1 + step;

  //     const dec1 = mn.moonGeocentricDeclination(
  //       jd1 + dynamicalTime.deltaT(jd1) / 86400.0,
  //       0.0,
  //     );

  //     const dec2 = mn.moonGeocentricDeclination(
  //       jd2 + dynamicalTime.deltaT(jd2) / 86400.0,
  //       0.0,
  //     );

  //     const f1 = dec1 - gLatK;
  //     const f2 = dec2 - gLatK;

  //     if (f1 * f2 <= 0) {
  //       let a = jd1;
  //       let b = jd2;
  //       let mid = 0;

  //       for (let i = 0; i < 25; i++) {
  //         mid = (a + b) / 2;

  //         const decMid = mn.moonGeocentricDeclination(
  //           mid + dynamicalTime.deltaT(mid) / 86400.0,
  //           0.0,
  //         );

  //         const fmid = decMid - gLatK;

  //         if (f1 * fmid < 0) {
  //           b = mid;
  //         } else {
  //           a = mid;
  //         }
  //       }

  //       const jdEvent = (a + b) / 2;

  //       const dm = mn.moonGeocentricDeclination(
  //         jdEvent + dynamicalTime.deltaT(jdEvent) / 86400.0,
  //         0.0,
  //       );

  //       const tinggi = 90.0 - Math.abs((gLatK - dm));

  //       const jamDes =  parseFloat(julianDay.jdkm(jdEvent, tmZn, "JAM DES"));

  //       results.push(
  //         new QiblaEventResult(
  //           jd: jdEvent,
  //           jamDes: jamDes,
  //           tinggi: tinggi,
  //           deklinasi: dm,
  //         ),
  //       );
  //     }

  //     jd1 = jd2;
  //   }

  //   return results;
  // }

  //   class QiblaEventResult {
  //   let jd;
  //   let selisih;
  //   let deklinasi;
  //   let tinggi;
  //   let jamDes;

  //   new QiblaEventResult({
  //     required this.jd,
  //     required this.selisih,
  //     required this.deklinasi,
  //     required this.tinggi,
  //     required this.jamDes,
  //   });
  // }

  // List<QiblaEventResult> rashdulQiblatBulan(int tahun, double tmZn) {
  //   const latK = 21.0 + 25.0 / 60.0 + 21.02 / 3600.0;
  //   const lonK = 39.0 + 49.0 / 60.0 + 34.27 / 3600.0;
  //   const tzK = 3.0;

  //   // 🔴 simpan pasangan (selisih + data)
  //   let temp = [];

  //   for (let i = 1; i <= 366; i++) {
  //     const jd = julianDay.kmjd(i, 1, tahun, 0, tzK);
  //     const jde = jd + dynamicalTime.deltaT(jd) / 86400.0;

  //     const tgl =  parseInt(julianDay.jdkm(jde, 0, "TGLM"));
  //     const bln =  parseInt(julianDay.jdkm(jde, 0, "BLNM"));
  //     const thn =  parseInt(julianDay.jdkm(jde, 0, "THNM"));

  //     const trs = mn.moonTransitRiseSet(
  //       tgl,
  //       bln,
  //       thn,
  //       lonK,
  //       latK,
  //       10,
  //       tzK,
  //       "TRANSIT",
  //       3,
  //     );

  //     const jdTransit = (Math.floor(jd) + 0.5) - 0.5 + (trs - tzK) / 24.0;

  //     const dm = mn.moonGeocentricDeclination(
  //       jdTransit + dynamicalTime.deltaT(jdTransit) / 86400.0,
  //       0.0,
  //     );

  //     const selisih = Math.abs((dm - latK));
  //     const tinggi = 90.0 - selisih;

  //     const jamDes =  parseFloat(julianDay.jdkm(jdTransit, tmZn, "JAM DES"));

  //     temp.push({
  //       "selisih": selisih,
  //       "data": new QiblaEventResult(
  //         jd: jdTransit,
  //         jamDes: jamDes,
  //         tinggi: tinggi,
  //         deklinasi: dm,
  //       ),
  //     });
  //   }

  //   // 🔥 sort berdasarkan selisih
  //   temp.sort((a, b) { return a["selisih"].compareTo(b["selisih"])); }

  //   // 🔥 ambil 5 terbaik
  //   const top5 = temp
  //       .take(5)
  //       .map((e) { return e["data"] as QiblaEventResult)
  //       .toList(); }

  //   // 🔥 urutkan kembali berdasarkan waktu (opsional, biar rapi)
  //   top5.sort((a, b) { return a.jd.compareTo(b.jd)); }

  //   return top5;
  // }

  rashdulQiblatBulan(tahun, tmZn) {
    const latK = 21.0 + 25.0 / 60.0 + 21.02 / 3600.0;
    const lonK = 39.0 + 49.0 / 60.0 + 34.27 / 3600.0;
    const tzK = 3.0;

    let results = [];

    for (let i = 1; i <= 366; i++) {
      const jd = this.julianDay.kmjd(i, 1, tahun, 0, tzK);

      const jde = jd + this.dynamicalTime.deltaT(jd) / 86400.0;

      // 🔴 HARUS dari JDE (sesuai VB)
      const tgl =  parseInt(this.julianDay.jdkm(jde, 0, "TGLM"));
      const bln =  parseInt(this.julianDay.jdkm(jde, 0, "BLNM"));
      const thn =  parseInt(this.julianDay.jdkm(jde, 0, "THNM"));

      // 🔴 TRANSIT
      const trs = this.mn.moonTransitRiseSet(
        tgl,
        bln,
        thn,
        lonK,
        latK,
        10,
        tzK,
        "TRANSIT",
        3,
      );

      const jdTransit = (Math.floor(jd) + 0.5) - 0.5 + (trs - tzK) / 24.0;

      // 🔴 PENTING: DeltaT pakai jd (bukan jdTransit)
      const dm = this.mn.moonGeocentricDeclination(
        jdTransit + this.dynamicalTime.deltaT(jd) / 86400.0,
        0.0,
      );

      const selisih = Math.abs((dm - latK));

      // 🔴 FILTER seperti VB
      if (selisih <= 0.5) {
        const tinggi = 90.0 - selisih;

        const jamDes =  parseFloat(this.julianDay.jdkm(jdTransit, tmZn, "JAM DES"));

        results.push(
          new QiblaEventResult({
            jd: jdTransit,
            jamDes: jamDes,
            tinggi: tinggi,
            deklinasi: dm,
          }),
        );
      }
    }

    return results;
  }

  // List<QiblaEventResult> rangeRashdulQiblatBulan(
  //   int startYear,
  //   int endYear,
  //   double tmZn,
  // ) {
  //   let results = [];

  //   for (let y = startYear; y <= endYear; y++) {
  //     results.addAll(rashdulQiblatBulan(y, tmZn));
  //   }

  //   return results;
  // }
}

