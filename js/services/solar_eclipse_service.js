/**
 * solar_eclipse_service.js — Gerhana Matahari: elemen Besselian, kontak P/U/C, jalur & durasi, magnitudo, obskurasi, global dan lokal, rentang tahun Hijriah.
 * Sumber Dart: service/solar_eclipse_service.dart
 * Kelas: SolarEclipseService
 * Fungsi: sBesselian, solarEclipseLocal, solarEclipseGlobal, solarEclipseGlobalRangeHijri, solarEclipseLocalRangeHijri
 */
class SolarEclipseService {
  julianDay = new JulianDay();
  dynamicalTime = new DynamicalTime();

  sn = new SunFunction();
  mf = new MathFunction();
  mo = new MoonFunction();
  md = new MoonDistance();

  sBesselian(hijriMonth, hijriYear) {
    const jdeSolarEclipse1 = this.mo.jdeEclipseModified(hijriMonth, hijriYear, 1);

    if (jdeSolarEclipse1 <= 0) return null;

    const jdeSolarEclipse2 =
        this.mf.floor(jdeSolarEclipse1) +
        (Math.round(((jdeSolarEclipse1 - this.mf.floor(jdeSolarEclipse1)) * 24))) / 24.0;

    const t0 =
        Math.round((((jdeSolarEclipse2 + 0.5) - Math.floor((jdeSolarEclipse2 + 0.5))) * 24));

    const deltaT = this.dynamicalTime.deltaT(jdeSolarEclipse2);

    // === SUN ===
    const arSm2 = this.sn.sunGeocentricRightAscension(jdeSolarEclipse2 - 2 / 24, 0);
    const arSm1 = this.sn.sunGeocentricRightAscension(jdeSolarEclipse2 - 1 / 24, 0);
    const arS00 = this.sn.sunGeocentricRightAscension(jdeSolarEclipse2, 0);
    const arSp1 = this.sn.sunGeocentricRightAscension(jdeSolarEclipse2 + 1 / 24, 0);
    const arSp2 = this.sn.sunGeocentricRightAscension(jdeSolarEclipse2 + 2 / 24, 0);

    const dSm2 = this.sn.sunGeocentricDeclination(jdeSolarEclipse2 - 2 / 24, 0);
    const dSm1 = this.sn.sunGeocentricDeclination(jdeSolarEclipse2 - 1 / 24, 0);
    const dS00 = this.sn.sunGeocentricDeclination(jdeSolarEclipse2, 0);
    const dSp1 = this.sn.sunGeocentricDeclination(jdeSolarEclipse2 + 1 / 24, 0);
    const dSp2 = this.sn.sunGeocentricDeclination(jdeSolarEclipse2 + 2 / 24, 0);

    const rSm2 = this.sn.sunGeocentricDistance(jdeSolarEclipse2 - 2 / 24, 0, "AU");
    const rSm1 = this.sn.sunGeocentricDistance(jdeSolarEclipse2 - 1 / 24, 0, "AU");
    const rS00 = this.sn.sunGeocentricDistance(jdeSolarEclipse2, 0, "AU");
    const rSp1 = this.sn.sunGeocentricDistance(jdeSolarEclipse2 + 1 / 24, 0, "AU");
    const rSp2 = this.sn.sunGeocentricDistance(jdeSolarEclipse2 + 2 / 24, 0, "AU");

    // === MOON ===
    const arMm2 = this.mo.moonGeocentricRightAscension(jdeSolarEclipse2 - 2 / 24, 0);
    const arMm1 = this.mo.moonGeocentricRightAscension(jdeSolarEclipse2 - 1 / 24, 0);
    const arM00 = this.mo.moonGeocentricRightAscension(jdeSolarEclipse2, 0);
    const arMp1 = this.mo.moonGeocentricRightAscension(jdeSolarEclipse2 + 1 / 24, 0);
    const arMp2 = this.mo.moonGeocentricRightAscension(jdeSolarEclipse2 + 2 / 24, 0);

    const dMm2 = this.mo.moonGeocentricDeclination(jdeSolarEclipse2 - 2 / 24, 0);
    const dMm1 = this.mo.moonGeocentricDeclination(jdeSolarEclipse2 - 1 / 24, 0);
    const dM00 = this.mo.moonGeocentricDeclination(jdeSolarEclipse2, 0);
    const dMp1 = this.mo.moonGeocentricDeclination(jdeSolarEclipse2 + 1 / 24, 0);
    const dMp2 = this.mo.moonGeocentricDeclination(jdeSolarEclipse2 + 2 / 24, 0);

    const hpMm2 = this.mo.moonEquatorialHorizontalParallax(
      jdeSolarEclipse2 - 2 / 24,
      0,
    );
    const hpMm1 = this.mo.moonEquatorialHorizontalParallax(
      jdeSolarEclipse2 - 1 / 24,
      0,
    );
    const hpM00 = this.mo.moonEquatorialHorizontalParallax(jdeSolarEclipse2, 0);
    const hpMp1 = this.mo.moonEquatorialHorizontalParallax(
      jdeSolarEclipse2 + 1 / 24,
      0,
    );
    const hpMp2 = this.mo.moonEquatorialHorizontalParallax(
      jdeSolarEclipse2 + 2 / 24,
      0,
    );

    // === bm ===
    const bm2 =
        Math.sin(this.mf.rad(8.794 / 3600.0)) / rSm2 / Math.sin(this.mf.rad(hpMm2));
    const bm1 =
        Math.sin(this.mf.rad(8.794 / 3600.0)) / rSm1 / Math.sin(this.mf.rad(hpMm1));
    const b00 =
        Math.sin(this.mf.rad(8.794 / 3600.0)) / rS00 / Math.sin(this.mf.rad(hpM00));
    const bp1 =
        Math.sin(this.mf.rad(8.794 / 3600.0)) / rSp1 / Math.sin(this.mf.rad(hpMp1));
    const bp2 =
        Math.sin(this.mf.rad(8.794 / 3600.0)) / rSp2 / Math.sin(this.mf.rad(hpMp2));

    // === g1 ===
    const g1m2 =
        Math.cos(this.mf.rad(dSm2)) * Math.cos(this.mf.rad(arSm2)) -
        bm2 * Math.cos(this.mf.rad(dMm2)) * Math.cos(this.mf.rad(arMm2));
    const g1m1 =
        Math.cos(this.mf.rad(dSm1)) * Math.cos(this.mf.rad(arSm1)) -
        bm1 * Math.cos(this.mf.rad(dMm1)) * Math.cos(this.mf.rad(arMm1));
    const g100 =
        Math.cos(this.mf.rad(dS00)) * Math.cos(this.mf.rad(arS00)) -
        b00 * Math.cos(this.mf.rad(dM00)) * Math.cos(this.mf.rad(arM00));
    const g1p1 =
        Math.cos(this.mf.rad(dSp1)) * Math.cos(this.mf.rad(arSp1)) -
        bp1 * Math.cos(this.mf.rad(dMp1)) * Math.cos(this.mf.rad(arMp1));
    const g1p2 =
        Math.cos(this.mf.rad(dSp2)) * Math.cos(this.mf.rad(arSp2)) -
        bp2 * Math.cos(this.mf.rad(dMp2)) * Math.cos(this.mf.rad(arMp2));

    // === g2 ===
    const g2m2 =
        Math.cos(this.mf.rad(dSm2)) * Math.sin(this.mf.rad(arSm2)) -
        bm2 * Math.cos(this.mf.rad(dMm2)) * Math.sin(this.mf.rad(arMm2));
    const g2m1 =
        Math.cos(this.mf.rad(dSm1)) * Math.sin(this.mf.rad(arSm1)) -
        bm1 * Math.cos(this.mf.rad(dMm1)) * Math.sin(this.mf.rad(arMm1));
    const g200 =
        Math.cos(this.mf.rad(dS00)) * Math.sin(this.mf.rad(arS00)) -
        b00 * Math.cos(this.mf.rad(dM00)) * Math.sin(this.mf.rad(arM00));
    const g2p1 =
        Math.cos(this.mf.rad(dSp1)) * Math.sin(this.mf.rad(arSp1)) -
        bp1 * Math.cos(this.mf.rad(dMp1)) * Math.sin(this.mf.rad(arMp1));
    const g2p2 =
        Math.cos(this.mf.rad(dSp2)) * Math.sin(this.mf.rad(arSp2)) -
        bp2 * Math.cos(this.mf.rad(dMp2)) * Math.sin(this.mf.rad(arMp2));

    // === g3 ===
    const g3m2 = Math.sin(this.mf.rad(dSm2)) - bm2 * Math.sin(this.mf.rad(dMm2));
    const g3m1 = Math.sin(this.mf.rad(dSm1)) - bm1 * Math.sin(this.mf.rad(dMm1));
    const g300 = Math.sin(this.mf.rad(dS00)) - b00 * Math.sin(this.mf.rad(dM00));
    const g3p1 = Math.sin(this.mf.rad(dSp1)) - bp1 * Math.sin(this.mf.rad(dMp1));
    const g3p2 = Math.sin(this.mf.rad(dSp2)) - bp2 * Math.sin(this.mf.rad(dMp2));

    // === a ===
    const am2 = this.mf.mod(this.mf.deg(Math.atan2(g2m2, g1m2)), 360.0);
    const am1 = this.mf.mod(this.mf.deg(Math.atan2(g2m1, g1m1)), 360.0);
    const a00 = this.mf.mod(this.mf.deg(Math.atan2(g200, g100)), 360.0);
    const ap1 = this.mf.mod(this.mf.deg(Math.atan2(g2p1, g1p1)), 360.0);
    const ap2 = this.mf.mod(this.mf.deg(Math.atan2(g2p2, g1p2)), 360.0);

    // === d ===
    const dm = (g3, g1, g2) => { return this.mf.deg(Math.atan(g3 / Math.sqrt(g1 * g1 + g2 * g2))); }

    const dm2 = dm(g3m2, g1m2, g2m2);
    const dm1 = dm(g3m1, g1m1, g2m1);
    const d00 = dm(g300, g100, g200);
    const dp1 = dm(g3p1, g1p1, g2p1);
    const dp2 = dm(g3p2, g1p2, g2p2);

    // === gm ===
    const gm = (g1, g2, g3) => { return Math.sqrt(g1 * g1 + g2 * g2 + g3 * g3); }

    const gm2 = gm(g1m2, g2m2, g3m2);
    const gm1 = gm(g1m1, g2m1, g3m1);
    const g00 = gm(g100, g200, g300);
    const gp1 = gm(g1p1, g2p1, g3p1);
    const gp2 = gm(g1p2, g2p2, g3p2);

    // === xm ===
    const xm = (dM, aM, a, hp) => { return (Math.cos(this.mf.rad(dM)) * Math.sin(this.mf.rad(aM - a))) /
        Math.sin(this.mf.rad(hp)); }

    const xm2 = xm(dMm2, arMm2, am2, hpMm2);
    const xm1 = xm(dMm1, arMm1, am1, hpMm1);
    const x00 = xm(dM00, arM00, a00, hpM00);
    const xp1 = xm(dMp1, arMp1, ap1, hpMp1);
    const xp2 = xm(dMp2, arMp2, ap2, hpMp2);

    // === ym ===
    const ym = (dM, d, aM, a, hp) => { return (Math.sin(this.mf.rad(dM)) * Math.cos(this.mf.rad(d)) -
            Math.cos(this.mf.rad(dM)) *
                Math.sin(this.mf.rad(d)) *
                Math.cos(this.mf.rad(aM - a))) /
        Math.sin(this.mf.rad(hp)); }

    const ym2 = ym(dMm2, dm2, arMm2, am2, hpMm2);
    const ym1 = ym(dMm1, dm1, arMm1, am1, hpMm1);
    const y00 = ym(dM00, d00, arM00, a00, hpM00);
    const yp1 = ym(dMp1, dp1, arMp1, ap1, hpMp1);
    const yp2 = ym(dMp2, dp2, arMp2, ap2, hpMp2);

    // === zm ===
    const zm = (dM, d, aM, a, hp) => { return (Math.sin(this.mf.rad(dM)) * Math.sin(this.mf.rad(d)) +
            Math.cos(this.mf.rad(dM)) *
                Math.cos(this.mf.rad(d)) *
                Math.cos(this.mf.rad(aM - a))) /
        Math.sin(this.mf.rad(hp)); }

    const zm2 = zm(dMm2, dm2, arMm2, am2, hpMm2);
    const zm1 = zm(dMm1, dm1, arMm1, am1, hpMm1);
    const z00 = zm(dM00, d00, arM00, a00, hpM00);
    const zp1 = zm(dMp1, dp1, arMp1, ap1, hpMp1);
    const zp2 = zm(dMp2, dp2, arMp2, ap2, hpMp2);

    // === Math.sin(f1,f2) ===
    const sinf1m2 = 0.004664026 / (gm2 * rSm2);
    const sinf1m1 = 0.004664026 / (gm1 * rSm1);
    const sinf100 = 0.004664026 / (g00 * rS00);
    const sinf1p1 = 0.004664026 / (gp1 * rSp1);
    const sinf1p2 = 0.004664026 / (gp2 * rSp2);

    const sinf2m2 = 0.004640784 / (gm2 * rSm2);
    const sinf2m1 = 0.004640784 / (gm1 * rSm1);
    const sinf200 = 0.004640784 / (g00 * rS00);
    const sinf2p1 = 0.004640784 / (gp1 * rSp1);
    const sinf2p2 = 0.004640784 / (gp2 * rSp2);

    // === Math.tan(f1,f2) ===
    const tanf1m2 = Math.tan(Math.asin(sinf1m2));
    const tanf1m1 = Math.tan(Math.asin(sinf1m1));
    const tanf100 = Math.tan(Math.asin(sinf100));
    const tanf1p1 = Math.tan(Math.asin(sinf1p1));
    const tanf1p2 = Math.tan(Math.asin(sinf1p2));

    const tanf2m2 = Math.tan(Math.asin(sinf2m2));
    const tanf2m1 = Math.tan(Math.asin(sinf2m1));
    const tanf200 = Math.tan(Math.asin(sinf200));
    const tanf2p1 = Math.tan(Math.asin(sinf2p1));
    const tanf2p2 = Math.tan(Math.asin(sinf2p2));

    // === C1 & C2 ===
    const c1m2 = zm2 + 0.2724880 / sinf1m2;
    const c1m1 = zm1 + 0.2724880 / sinf1m1;
    const c100 = z00 + 0.2724880 / sinf100;
    const c1p1 = zp1 + 0.2724880 / sinf1p1;
    const c1p2 = zp2 + 0.2724880 / sinf1p2;

    const c2m2 = zm2 - 0.2722810 / sinf2m2;
    const c2m1 = zm1 - 0.2722810 / sinf2m1;
    const c200 = z00 - 0.2722810 / sinf200;
    const c2p1 = zp1 - 0.2722810 / sinf2p1;
    const c2p2 = zp2 - 0.2722810 / sinf2p2;

    // === l1 l2 ===
    const l1m2 = c1m2 * tanf1m2;
    const l1m1 = c1m1 * tanf1m1;
    const l100 = c100 * tanf100;
    const l1p1 = c1p1 * tanf1p1;
    const l1p2 = c1p2 * tanf1p2;

    const l2m2 = c2m2 * tanf2m2;
    const l2m1 = c2m1 * tanf2m1;
    const l200 = c200 * tanf200;
    const l2p1 = c2p1 * tanf2p1;
    const l2p2 = c2p2 * tanf2p2;

    // === GAST → mu ===
    const gastm2 = this.sn.greenwichApparentSiderialTime(
      jdeSolarEclipse2 - 2 / 24,
      0,
    );
    const gastm1 = this.sn.greenwichApparentSiderialTime(
      jdeSolarEclipse2 - 1 / 24,
      0,
    );
    const gast00 = this.sn.greenwichApparentSiderialTime(jdeSolarEclipse2, 0);
    const gastp1 = this.sn.greenwichApparentSiderialTime(
      jdeSolarEclipse2 + 1 / 24,
      0,
    );
    const gastp2 = this.sn.greenwichApparentSiderialTime(
      jdeSolarEclipse2 + 2 / 24,
      0,
    );

    const mum2 = this.mf.mod(gastm2 - am2, 360.0);
    const mum1 = this.mf.mod(gastm1 - am1, 360.0);
    const mu00 = this.mf.mod(gast00 - a00, 360.0);
    const mup1 = this.mf.mod(gastp1 - ap1, 360.0);
    const mup2 = this.mf.mod(gastp2 - ap2, 360.0);

    // ---------------- Hasil Interpolasi ----------------

    return new SolarBesselianResult({
      jde: jdeSolarEclipse2,
      deltaT: deltaT,
      t0: t0,

      x: [
        this.mf.interp5(xm2, xm1, x00, xp1, xp2, 0),
        this.mf.interp5(xm2, xm1, x00, xp1, xp2, 1),
        this.mf.interp5(xm2, xm1, x00, xp1, xp2, 2),
        this.mf.interp5(xm2, xm1, x00, xp1, xp2, 3),
        this.mf.interp5(xm2, xm1, x00, xp1, xp2, 4),
      ],

      y: [
        this.mf.interp5(ym2, ym1, y00, yp1, yp2, 0),
        this.mf.interp5(ym2, ym1, y00, yp1, yp2, 1),
        this.mf.interp5(ym2, ym1, y00, yp1, yp2, 2),
        this.mf.interp5(ym2, ym1, y00, yp1, yp2, 3),
        this.mf.interp5(ym2, ym1, y00, yp1, yp2, 4),
      ],

      d: [
        this.mf.interp5(dm2, dm1, d00, dp1, dp2, 0),
        this.mf.interp5(dm2, dm1, d00, dp1, dp2, 1),
        this.mf.interp5(dm2, dm1, d00, dp1, dp2, 2),
        this.mf.interp5(dm2, dm1, d00, dp1, dp2, 3),
        this.mf.interp5(dm2, dm1, d00, dp1, dp2, 4),
      ],

      mu: [
        this.mf.interp5Angle(mum2, mum1, mu00, mup1, mup2, 0),
        this.mf.interp5Angle(mum2, mum1, mu00, mup1, mup2, 1),
        this.mf.interp5Angle(mum2, mum1, mu00, mup1, mup2, 2),
        this.mf.interp5Angle(mum2, mum1, mu00, mup1, mup2, 3),
        this.mf.interp5Angle(mum2, mum1, mu00, mup1, mup2, 4),
      ],

      l1: [
        this.mf.interp5(l1m2, l1m1, l100, l1p1, l1p2, 0),
        this.mf.interp5(l1m2, l1m1, l100, l1p1, l1p2, 1),
        this.mf.interp5(l1m2, l1m1, l100, l1p1, l1p2, 2),
        this.mf.interp5(l1m2, l1m1, l100, l1p1, l1p2, 3),
        this.mf.interp5(l1m2, l1m1, l100, l1p1, l1p2, 4),
      ],

      l2: [
        this.mf.interp5(l2m2, l2m1, l200, l2p1, l2p2, 0),
        this.mf.interp5(l2m2, l2m1, l200, l2p1, l2p2, 1),
        this.mf.interp5(l2m2, l2m1, l200, l2p1, l2p2, 2),
        this.mf.interp5(l2m2, l2m1, l200, l2p1, l2p2, 3),
        this.mf.interp5(l2m2, l2m1, l200, l2p1, l2p2, 4),
      ],

      tanf1: tanf100,
      tanf2: tanf200,
    });
  }

  solarEclipseLocal({blnH, thnH, gLon, gLat, elev, pres, temp, tmZn} = {}) {
    // 🔴 CEK DULU APAKAH ADA GERHANA
    const bessel = this.sBesselian(blnH, thnH);

    if (bessel == null || !bessel.isValid) {
      return null;
    }

    // ===================== Variabel =====================
    let tMx = 0.0;
    let pi = 0.0;
    let S = 0.0;
    let C = 0.0;
    let xMx = 0.0;
    let yMx = 0.0;
    let dMx = 0.0;
    let muMx = 0.0;
    let l1Mx = 0.0;
    let l2Mx = 0.0;
    let xpMx = 0.0;
    let ypMx = 0.0;
    let hMx = 0.0;
    let pMx = 0.0;
    let qMx = 0.0;
    let rMx = 0.0;
    let prMx = 0.0;
    let qpMx = 0.0;
    let uMx = 0.0;
    let vMx = 0.0;
    let aMx = 0.0;
    let bMx = 0.0;
    let nMx = 0.0;
    let ppMx = 0.0;
    let aaMx = 0.0;

    // ===================== Data Besselian =====================
    const x = bessel.x;
    const y = bessel.y;
    const d = bessel.d;
    const mu = bessel.mu;
    const l1 = bessel.l1;
    const l2 = bessel.l2;
    const tanf1 = bessel.tanf1;
    const tanf2 = bessel.tanf2;
    const deltaT = bessel.deltaT;
    const t0 = bessel.t0;
    const jde2 = bessel.jde;

    tMx += ppMx;
    // ===================== Iterasi 5 kali =====================
    for (let i = 1; i <= 5; i++) {
      pi = Math.atan(0.99664719 * Math.tan(this.mf.rad(gLat)));

      S = 0.99664719 * Math.sin(pi) + (elev / 6378140) * Math.sin(this.mf.rad(gLat));
      C = Math.cos(pi) + (elev / 6378140) * Math.cos(this.mf.rad(gLat));

      xMx =
          x[0] +
          x[1] * tMx +
          x[2] * tMx * tMx +
          x[3] * tMx * tMx * tMx +
          x[4] * tMx * tMx * tMx * tMx;
      yMx =
          y[0] +
          y[1] * tMx +
          y[2] * tMx * tMx +
          y[3] * tMx * tMx * tMx +
          y[4] * tMx * tMx * tMx * tMx;
      dMx =
          d[0] +
          d[1] * tMx +
          d[2] * tMx * tMx +
          d[3] * tMx * tMx * tMx +
          d[4] * tMx * tMx * tMx * tMx;

      muMx =
          mu[0] +
          mu[1] * tMx +
          mu[2] * tMx * tMx +
          mu[3] * tMx * tMx * tMx +
          mu[4] * tMx * tMx * tMx * tMx;

      l1Mx =
          l1[0] +
          l1[1] * tMx +
          l1[2] * tMx * tMx +
          l1[3] * tMx * tMx * tMx +
          l1[4] * tMx * tMx * tMx * tMx;
      l2Mx =
          l2[0] +
          l2[1] * tMx +
          l2[2] * tMx * tMx +
          l2[3] * tMx * tMx * tMx +
          l2[4] * tMx * tMx * tMx * tMx;

      xpMx =
          x[1] +
          2 * x[2] * tMx +
          3 * x[3] * tMx * tMx +
          4 * x[4] * tMx * tMx * tMx;
      ypMx =
          y[1] +
          2 * y[2] * tMx +
          3 * y[3] * tMx * tMx +
          4 * y[4] * tMx * tMx * tMx;

      hMx = this.mf.rad(muMx + gLon - 0.00417807 * deltaT);

      pMx = C * Math.sin(hMx);
      qMx =
          S * Math.cos(this.mf.rad(dMx)) - C * Math.cos(hMx) * Math.sin(this.mf.rad(dMx));
      rMx =
          S * Math.sin(this.mf.rad(dMx)) + C * Math.cos(hMx) * Math.cos(this.mf.rad(dMx));

      prMx = 0.01745329 * mu[1] * C * Math.cos(hMx);
      qpMx = 0.01745329 * (mu[1] * pMx * Math.sin(this.mf.rad(dMx)) - rMx * d[1]);

      uMx = xMx - pMx;
      vMx = yMx - qMx;

      aMx = xpMx - prMx;
      bMx = ypMx - qpMx;

      nMx = aMx * aMx + bMx * bMx;

      ppMx = -(uMx * aMx + vMx * bMx) / nMx;
      tMx += ppMx;
    }

    // ===================== Waktu maksimum gerhana =====================
    aaMx = t0 + tMx - deltaT / 3600.0;
    const jdSolarMx = this.mf.floor(jde2 + 0.5) - 0.5 + (aaMx / 24.0);

    // ===================== Magnitude & Obskurasi =====================
    const mm = Math.sqrt(uMx * uMx + vMx * vMx);
    const l1p = l1Mx - rMx * tanf1;
    const l2p = l2Mx - rMx * tanf2;

    const mag = (l1p - mm) / (l1p + l2p);

    if (mag <= 0) {
      return new SolarEclipseLocalResult({
        ada: false,
        keterangan: "Tidak terjadi gerhana",
        besselian: bessel,
        jenis: "TIDAK TERJADI GERHANA",
      });
    }

    const nn = Math.sqrt(nMx);
    const zz = (aMx * vMx - uMx * bMx) / (nn * l1p);
    const tau = (l1p / nn) * Math.sqrt(1 - zz * zz);

    const rpMx = 2 * mm / (l1p + l2p);
    const spMx = (l1p - l2p) / (l1p + l2p);

    const yy = (spMx * spMx + rpMx * rpMx - 1) / (2 * rpMx * spMx);
    const zp = (rpMx * rpMx - spMx * spMx + 1) / (2 * rpMx);

    const bb = (yy < -1)
        ? Math.PI
        : (yy > 1)
        ? 0.0
        : Math.acos(yy);

    const cc = (zp < -1)
        ? Math.PI
        : (zp > 1)
        ? 0.0
        : Math.acos(zp);

    const obs =
        ((spMx * spMx * (bb - Math.sin(2 * bb) / 2) +
                (cc - Math.sin(2 * cc) / 2)) /
            Math.PI) *
        100.0;

    // ===================== Jenis Gerhana =====================
    let jSE;

    if (mag > 0.0 && mm > Math.abs(l2p)) {
      jSE = "GERHANA MATAHARI SEBAGIAN";
    } else if (mag > 0.0 && mm < Math.abs(l2p) && l2p < 0.0) {
      jSE = "GERHANA MATAHARI TOTAL";
    } else if (mag > 0.0 && mm < Math.abs(l2p) && l2p > 0.0) {
      jSE = "GERHANA MATAHARI CINCIN";
    } else {
      jSE = "TIDAK TERJADI GERHANA";
    }

    const mag3 = (jSE == "GERHANA MATAHARI SEBAGIAN") ? mag : spMx;

    // // Hisab Kontak U2 dan U3
    // const qq = (aMx * vMx - uMx * bMx) / (nn * l2p);
    // const t2 = Math.abs(((l2p / nn) * Math.sqrt(1 - qq * qq)));
    // const aU2 = aaMx - t2;
    // const aU3 = aaMx + t2;
    // const jdSolarU2 = Math.floor((jde2 + 0.5)) - 0.5 + (aU2 / 24.0);
    // const jdSolarU3 = Math.floor((jde2 + 0.5)) - 0.5 + (aU3 / 24.0);

    // =====================
    // Hisab Kontak U2 dan U3
    // =====================

    let jdSolarU2;
    let jdSolarU3;

    if (mm < Math.abs(l2p)) {
      const qq = (aMx * vMx - uMx * bMx) / (nn * l2p);

      const inside = 1 - qq * qq;

      if (inside >= 0) {
        const t2 = Math.abs(((l2p / nn) * Math.sqrt(inside)));

        const aU2 = aaMx - t2;
        const aU3 = aaMx + t2;

        jdSolarU2 = Math.floor((jde2 + 0.5)) - 0.5 + (aU2 / 24.0);

        jdSolarU3 = Math.floor((jde2 + 0.5)) - 0.5 + (aU3 / 24.0);
      }
    }

    // =======================
    // Hisab Kontak U1
    // =======================

    let jdSolarU1;

    let t = 0.0;
    let aaU1;
    let tU1;

    let xU1 = 0.0;
    let yU1 = 0.0;
    let dU1 = 0.0;
    let muU1 = 0.0;
    let l1U1 = 0.0;
    let xpU1 = 0.0;
    let ypU1 = 0.0;
    let hU1 = 0.0;
    let pU1 = 0.0;
    let qU1 = 0.0;
    let rU1 = 0.0;
    let prU1 = 0.0;
    let qpU1 = 0.0;
    let uU1 = 0.0;
    let vU1 = 0.0;
    let aU1 = 0.0;
    let bU1 = 0.0;
    let nU1 = 0.0;
    let nnU1 = 0.0;
    let l1pU1 = 0.0;
    let mmU1 = 0.0;
    let ppU1 = 0.0;

    tU1 = t - tau;

    for (let i = 0; i < 5; i++) {
      const pi = Math.atan(0.99664719 * Math.tan(this.mf.rad(gLat)));
      const s =
          0.99664719 * Math.sin(pi) + (elev / 6378140) * Math.sin(this.mf.rad(gLat));
      const c = Math.cos(pi) + (elev / 6378140) * Math.cos(this.mf.rad(gLat));

      xU1 =
          x[0] +
          x[1] * tU1 +
          x[2] * tU1 * tU1 +
          x[3] * tU1 * tU1 * tU1 +
          x[4] * tU1 * tU1 * tU1 * tU1;

      yU1 =
          y[0] +
          y[1] * tU1 +
          y[2] * tU1 * tU1 +
          y[3] * tU1 * tU1 * tU1 +
          y[4] * tU1 * tU1 * tU1 * tU1;

      dU1 =
          d[0] +
          d[1] * tU1 +
          d[2] * tU1 * tU1 +
          d[3] * tU1 * tU1 * tU1 +
          d[4] * tU1 * tU1 * tU1 * tU1;

      muU1 =
          mu[0] +
          mu[1] * tU1 +
          mu[2] * tU1 * tU1 +
          mu[3] * tU1 * tU1 * tU1 +
          mu[4] * tU1 * tU1 * tU1 * tU1;

      l1U1 =
          l1[0] +
          l1[1] * tU1 +
          l1[2] * tU1 * tU1 +
          l1[3] * tU1 * tU1 * tU1 +
          l1[4] * tU1 * tU1 * tU1 * tU1;

      // l2U1 =
      //     l2[0] +
      //     l2[1] * tU1 +
      //     l2[2] * tU1 * tU1 +
      //     l2[3] * tU1 * tU1 * tU1 +
      //     l2[4] * tU1 * tU1 * tU1 * tU1;

      xpU1 =
          x[1] +
          2 * x[2] * tU1 +
          3 * x[3] * tU1 * tU1 +
          4 * x[4] * tU1 * tU1 * tU1;

      ypU1 =
          y[1] +
          2 * y[2] * tU1 +
          3 * y[3] * tU1 * tU1 +
          4 * y[4] * tU1 * tU1 * tU1;

      hU1 = this.mf.rad(muU1 + gLon - 0.00417807 * deltaT);
      pU1 = c * Math.sin(hU1);
      qU1 =
          s * Math.cos(this.mf.rad(dU1)) - c * Math.cos(hU1) * Math.sin(this.mf.rad(dU1));
      rU1 =
          s * Math.sin(this.mf.rad(dU1)) + c * Math.cos(hU1) * Math.cos(this.mf.rad(dU1));

      prU1 = 0.01745329 * mu[1] * c * Math.cos(hU1);
      qpU1 = 0.01745329 * (mu[1] * pU1 * Math.sin(this.mf.rad(dU1)) - rU1 * d[1]);

      uU1 = xU1 - pU1;
      vU1 = yU1 - qU1;
      aU1 = xpU1 - prU1;
      bU1 = ypU1 - qpU1;

      nU1 = aU1 * aU1 + bU1 * bU1;
      nnU1 = Math.sqrt(nU1);

      l1pU1 = l1U1 - rU1 * tanf1;
      mmU1 = (aU1 * vU1 - uU1 * bU1) / (nnU1 * l1pU1);
      ppU1 =
          -(uU1 * aU1 + vU1 * bU1) / nU1 -
          (l1pU1 / nnU1) * Math.sqrt(1 - mmU1 * mmU1);

      tU1 += ppU1;
    }

    aaU1 = tU1 + ppU1 - deltaT / 3600.0;
    //jdSolarU1 = Math.floor(jde2) + 0.5 + ((t0 + aaU1) / 24.0);
    jdSolarU1 = Math.floor((jde2 + 0.5)) - 0.5 + ((t0 + aaU1) / 24.0);

    // =======================
    // Hisab Kontak U4
    // =======================

    let jdSolarU4;
    let aaU4;
    let tU4;

    let xU4 = 0.0;
    let yU4 = 0.0;
    let dU4 = 0.0;
    let muU4 = 0.0;
    let l1U4 = 0.0;
    let xpU4 = 0.0;
    let ypU4 = 0.0;
    let hU4 = 0.0;
    let pU4 = 0.0;
    let qU4 = 0.0;
    let rU4 = 0.0;
    let prU4 = 0.0;
    let qpU4 = 0.0;
    let uU4 = 0.0;
    let vU4 = 0.0;
    let aU4 = 0.0;
    let bU4 = 0.0;
    let nU4 = 0.0;
    let nnU4 = 0.0;
    let l1pU4 = 0.0;
    let mmU4 = 0.0;
    let ppU4 = 0.0;

    tU4 = t + tau;

    for (let i = 0; i < 5; i++) {
      const pi = Math.atan(0.99664719 * Math.tan(this.mf.rad(gLat)));
      const s =
          0.99664719 * Math.sin(pi) + (elev / 6378140) * Math.sin(this.mf.rad(gLat));
      const c = Math.cos(pi) + (elev / 6378140) * Math.cos(this.mf.rad(gLat));

      xU4 =
          x[0] +
          x[1] * tU4 +
          x[2] * tU4 * tU4 +
          x[3] * tU4 * tU4 * tU4 +
          x[4] * tU4 * tU4 * tU4 * tU4;

      yU4 =
          y[0] +
          y[1] * tU4 +
          y[2] * tU4 * tU4 +
          y[3] * tU4 * tU4 * tU4 +
          y[4] * tU4 * tU4 * tU4 * tU4;

      dU4 =
          d[0] +
          d[1] * tU4 +
          d[2] * tU4 * tU4 +
          d[3] * tU4 * tU4 * tU4 +
          d[4] * tU4 * tU4 * tU4 * tU4;

      muU4 =
          mu[0] +
          mu[1] * tU4 +
          mu[2] * tU4 * tU4 +
          mu[3] * tU4 * tU4 * tU4 +
          mu[4] * tU4 * tU4 * tU4 * tU4;

      l1U4 =
          l1[0] +
          l1[1] * tU4 +
          l1[2] * tU4 * tU4 +
          l1[3] * tU4 * tU4 * tU4 +
          l1[4] * tU4 * tU4 * tU4 * tU4;

      // l2U4 =
      //     l2[0] +
      //     l2[1] * tU4 +
      //     l2[2] * tU4 * tU4 +
      //     l2[3] * tU4 * tU4 * tU4 +
      //     l2[4] * tU4 * tU4 * tU4 * tU4;

      xpU4 =
          x[1] +
          2 * x[2] * tU4 +
          3 * x[3] * tU4 * tU4 +
          4 * x[4] * tU4 * tU4 * tU4;

      ypU4 =
          y[1] +
          2 * y[2] * tU4 +
          3 * y[3] * tU4 * tU4 +
          4 * y[4] * tU4 * tU4 * tU4;

      hU4 = this.mf.rad(muU4 + gLon - 0.00417807 * deltaT);
      pU4 = c * Math.sin(hU4);
      qU4 =
          s * Math.cos(this.mf.rad(dU4)) - c * Math.cos(hU4) * Math.sin(this.mf.rad(dU4));
      rU4 =
          s * Math.sin(this.mf.rad(dU4)) + c * Math.cos(hU4) * Math.cos(this.mf.rad(dU4));

      prU4 = 0.01745329 * mu[1] * c * Math.cos(hU4);
      qpU4 = 0.01745329 * (mu[1] * pU4 * Math.sin(this.mf.rad(dU4)) - rU4 * d[1]);

      uU4 = xU4 - pU4;
      vU4 = yU4 - qU4;
      aU4 = xpU4 - prU4;
      bU4 = ypU4 - qpU4;

      nU4 = aU4 * aU4 + bU4 * bU4;
      nnU4 = Math.sqrt(nU4);
      l1pU4 = l1U4 - rU4 * tanf1;
      mmU4 = (aU4 * vU4 - uU4 * bU4) / (nnU4 * l1pU4);

      ppU4 =
          -(uU4 * aU4 + vU4 * bU4) / nU4 +
          (l1pU4 / nnU4) * Math.sqrt(1 - mmU4 * mmU4);

      tU4 += ppU4;
    }

    aaU4 = tU4 + ppU4 - deltaT / 3600.0;
    jdSolarU4 = Math.floor((jde2 + 0.5)) - 0.5 + ((t0 + aaU4) / 24.0);

    let durG = (jdSolarU4 - jdSolarU1) * 24.0;

    const durT = (jdSolarU2 != null && jdSolarU3 != null)
        ? (jdSolarU3 - jdSolarU2) * 24.0
        : null;

    //let durT = (jdSolarU3 - jdSolarU2) * 24.0;

    // Hisab Azimuth tiap kontak
    const azmU1 = this.sn.sunTopocentricAzimuth(
      jdSolarU1,
      0.0,
      gLon,
      gLat,
      elev,
    );

    const azmU2 = jdSolarU2 != null
        ? this.sn.sunTopocentricAzimuth(jdSolarU2, 0.0, gLon, gLat, elev)
        : null;

    const azmMx = this.sn.sunTopocentricAzimuth(
      jdSolarMx,
      0.0,
      gLon,
      gLat,
      elev,
    );

    const azmU3 = jdSolarU3 != null
        ? this.sn.sunTopocentricAzimuth(jdSolarU3, 0.0, gLon, gLat, elev)
        : null;

    const azmU4 = this.sn.sunTopocentricAzimuth(
      jdSolarU4,
      0.0,
      gLon,
      gLat,
      elev,
    );

    // Hisab Altitude tiap kontak
    const altU1 = this.sn.sunTopocentricAltitude(
      jdSolarU1,
      0.0,
      gLon,
      gLat,
      elev,
      pres,
      temp,
      "htc",
    );

    const altU2 = jdSolarU2 != null
        ? this.sn.sunTopocentricAltitude(
            jdSolarU2,
            0.0,
            gLon,
            gLat,
            elev,
            pres,
            temp,
            "htc",
          )
        : null;

    const altMx = this.sn.sunTopocentricAltitude(
      jdSolarMx,
      0.0,
      gLon,
      gLat,
      elev,
      pres,
      temp,
      "htc",
    );

    const altU3 = jdSolarU3 != null
        ? this.sn.sunTopocentricAltitude(
            jdSolarU3,
            0.0,
            gLon,
            gLat,
            elev,
            pres,
            temp,
            "htc",
          )
        : null;

    const altU4 = this.sn.sunTopocentricAltitude(
      jdSolarU4,
      0.0,
      gLon,
      gLat,
      elev,
      pres,
      temp,
      "htc",
    );

    // ================== Data matahari saat maximum=====================
    let raS = this.sn.sunGeocentricRightAscension(jdSolarMx, 0);
    let dcS = this.sn.sunGeocentricDeclination(jdSolarMx, 0);
    let sdS = this.sn.sunGeocentricSemidiameter(jdSolarMx, 0);
    let hpS = this.sn.sunEquatorialHorizontalParallax(jdSolarMx, 0);

    // ================== Data bulan saat maximum=====================
    let raM = this.mo.moonGeocentricRightAscension(jdSolarMx, 0);
    let dcM = this.mo.moonGeocentricDeclination(jdSolarMx, 0);
    let sdM = this.mo.moonGeocentricSemidiameter(jdSolarMx, 0);
    let hpM = this.mo.moonEquatorialHorizontalParallax(jdSolarMx, 0);

    // Hitung deltaT dalam hari untuk konversi TD -> UT
    const deltaTDays = (bessel.deltaT ?? 0) / 86400.0;

    return new SolarEclipseLocalResult({
      ada: true,
      keterangan: "Ada gerhana",
      besselian: bessel,

      // === WAKTU UT (sudah terkoreksi deltaT) ===
      u1UT: jdSolarU1,
      u2UT: jdSolarU2,
      mxUT: jdSolarMx,
      u3UT: jdSolarU3,
      u4UT: jdSolarU4,

      // === WAKTU TD (UT + deltaT) ===
      u1TD: jdSolarU1 + deltaTDays, // ✅ UT + deltaT = TD
      u2TD: jdSolarU2 != null ? jdSolarU2 + deltaTDays : null,
      mxTD: jdSolarMx + deltaTDays,
      u3TD: jdSolarU3 != null ? jdSolarU3 + deltaTDays : null,
      u4TD: jdSolarU4 + deltaTDays,

      // === ALTITUDE & AZIMUTH ===
      altU1: altU1,
      altU2: altU2,
      altMx: altMx,
      altU3: altU3,
      altU4: altU4,
      azmU1: azmU1,
      azmU2: azmU2,
      azmMx: azmMx,
      azmU3: azmU3,
      azmU4: azmU4,

      // === EPHEMERIS (DIPISAH) ===
      sunEphemeris: new EclipseEphemerisBody({
        ra: raS / 15,
        dec: dcS,
        sd: sdS,
        hp: hpS,
      }),
      moonEphemeris: new EclipseEphemerisBody({
        ra: raM / 15,
        dec: dcM,
        sd: sdM,
        hp: hpM,
      }),

      // === PARAMETER ===
      magnitude: mag3,
      obscuration: obs,
      jenis: jSE,
      durasiGerhana: durG,
      durasiTotalitas: durT,
    });
  }

  //GERHANA MATAHARI GLOBAL

  solarEclipseGlobal({blnH, thnH} = {}) {
    // 🔴 CEK DULU APAKAH ADA GERHANA
    const bessel = this.sBesselian(blnH, thnH);

    if (bessel == null || !bessel.isValid) {
      return null;
    }

    // ===================== Data Besselian =====================
    const t0 = bessel.t0;
    const dt = bessel.deltaT;
    const jde2 = bessel.jde;
    const x = bessel.x;
    const y = bessel.y;
    const d = bessel.d;
    const mu = bessel.mu;
    const l1 = bessel.l1;
    const l2 = bessel.l2;
    const tanf1 = bessel.tanf1;
    const tanf2 = bessel.tanf2;

    let xMx = 0.0;
    let yMx = 0.0;
    let dMx = 0.0;
    let muMx = 0.0;
    let xpMx = 0.0;
    let ypMx = 0.0;

    let mbMx;
    let msMx = 0.0;
    let nbMx;
    let nsMx;

    let tuMx = 0.0;
    let tMx = 0.0;
    let mXTD;
    let mXUT;

    tMx += tuMx;

    for (let i = 1; i <= 7; i++) {
      xMx =
          x[0] +
          x[1] * tMx +
          x[2] * tMx * tMx +
          x[3] * tMx * tMx * tMx +
          x[4] * tMx * tMx * tMx * tMx;

      yMx =
          y[0] +
          y[1] * tMx +
          y[2] * tMx * tMx +
          y[3] * tMx * tMx * tMx +
          y[4] * tMx * tMx * tMx * tMx;

      dMx =
          d[0] +
          d[1] * tMx +
          d[2] * tMx * tMx +
          d[3] * tMx * tMx * tMx +
          d[4] * tMx * tMx * tMx * tMx;

      muMx =
          mu[0] +
          mu[1] * tMx +
          mu[2] * tMx * tMx +
          mu[3] * tMx * tMx * tMx +
          mu[4] * tMx * tMx * tMx * tMx;

      xpMx =
          x[1] +
          2 * x[2] * tMx +
          3 * x[3] * tMx * tMx +
          4 * x[4] * tMx * tMx * tMx;

      ypMx =
          y[1] +
          2 * y[2] * tMx +
          3 * y[3] * tMx * tMx +
          4 * y[4] * tMx * tMx * tMx;

      mbMx = this.mf.mod(this.mf.deg(Math.atan2(yMx, xMx)), 360.0);
      msMx = SafeMath.sqrt(xMx * xMx + yMx * yMx);

      nbMx = this.mf.mod(this.mf.deg(Math.atan2(ypMx, xpMx)), 360.0);
      nsMx = SafeMath.sqrt(xpMx * xpMx + ypMx * ypMx);

      tuMx = -SafeMath.safeDiv(msMx * Math.cos(this.mf.rad(mbMx - nbMx)), nsMx);
      tMx += tuMx;
    }

    mXTD = this.mf.mod(t0 + tMx, 24.0);
    mXUT = this.mf.mod(t0 + tMx - dt / 3600.0, 24.0);

    // ==========================
    // Tipe, Jenis, Durasi Gerhana
    // ==========================

    const l1Mx =
        l1[0] +
        l1[1] * tuMx +
        l1[2] * tuMx * tuMx +
        l1[3] * tuMx * tuMx * tuMx +
        l1[4] * tuMx * tuMx * tuMx * tuMx;

    const l2Mx =
        l2[0] +
        l2[1] * tuMx +
        l2[2] * tuMx * tuMx +
        l2[3] * tuMx * tuMx * tuMx +
        l2[4] * tuMx * tuMx * tuMx * tuMx;

    let jse;

    if (msMx < 0.9972) {
      if (l2Mx < 0) {
        jse = "Sentral Total";
      } else if (l2Mx > 0.0047) {
        jse = "Sentral Cincin";
      } else {
        jse = "Sentral Hybrid";
      }
    } else if (msMx > 0.9972) {
      if (l2Mx < 0 && msMx < (Math.abs(l2Mx) + 0.9972)) {
        jse = "Non Sentral Total";
      } else if (l2Mx > 0 && msMx < (Math.abs(l2Mx) + 0.9972)) {
        jse = "Non Sentral Cincin";
      } else if (msMx < (Math.abs(l2Mx) + 1.5433)) {
        jse = "Non Sentral Sebagian";
      } else {
        jse = "";
      }
    } else {
      jse = "Tidak ada gerhana";
    }

    // ==========================
    // Koordinat puncak gerhana
    // ==========================

    const a = 6378137.0;
    const b = 6356752.0;
    const f = (a - b) / a;
    const e2 = (2 * f) - (f * f);

    const ba = b / a;
    const ab = a / b;

    const rho0 = SafeMath.sqrt(1 - e2 * Math.cos(this.mf.rad(dMx)));
    const d1Mx = this.mf.deg(
      Math.atan(
        SafeMath.safeDiv(Math.sin(this.mf.rad(dMx)), (Math.cos(this.mf.rad(dMx)) * ba)),
      ),
    );

    const y1Mx = SafeMath.safeDiv(yMx, rho0);
    const m1Mx = SafeMath.sqrt(xMx * xMx + y1Mx * y1Mx);
    const y2Mx = SafeMath.safeDiv(y1Mx, m1Mx);

    const bBig = SafeMath.sqrt(
      Math.max(0.0, 1 - xMx * xMx - y1Mx * y1Mx),
    );

    const pi1Mx = (msMx < 0.9972)
        ? this.mf.deg(
            SafeMath.asin(
              y1Mx * Math.cos(this.mf.rad(d1Mx)) + bBig * Math.sin(this.mf.rad(d1Mx)),
            ),
          )
        : this.mf.deg(SafeMath.asin(y2Mx * Math.cos(this.mf.rad(d1Mx))));

    const piMx = this.mf.deg(
      Math.atan(ab * Math.tan(this.mf.rad(pi1Mx))),
    ); //Lintang

    const x2Mx = (msMx < 0.9972)
        ? -y1Mx * Math.sin(this.mf.rad(d1Mx)) + bBig * Math.cos(this.mf.rad(d1Mx))
        : -y1Mx * Math.sin(this.mf.rad(d1Mx));

    const haMx = this.mf.mod(this.mf.deg(Math.atan2(xMx, x2Mx)), 360.0);

    const calc = haMx - muMx + (0.004178 * dt);
    const ldMx = (calc > 180)
        ? calc - 360
        : (calc < -180 ? calc + 360 : calc); //bujur

    // ==========================
    const l1pMx = l1Mx - bBig * tanf1;
    const l2pMx = l2Mx - bBig * tanf2;

    const pp = this.mf.rad(mu[1]);

    const aa = ypMx - pp * xMx * Math.sin(this.mf.rad(dMx));

    const bb = xpMx + pp * yMx * Math.sin(this.mf.rad(dMx));

    const cc = bb - pp * bBig * Math.cos(this.mf.rad(dMx));

    const ns1 = SafeMath.sqrt(cc * cc + aa * aa);

    const dur = SafeMath.safeDiv(this.mf.abs(7200 * l2pMx), ns1) / 3600.0;

    // ==========================
    // Azimuth & Altitude puncak gerhana
    // ==========================

    const altMx = this.mf.deg(
      SafeMath.asin(
        Math.sin(this.mf.rad(piMx)) * Math.sin(this.mf.rad(dMx)) +
            Math.cos(this.mf.rad(piMx)) *
                Math.cos(this.mf.rad(dMx)) *
                Math.cos(this.mf.rad(haMx)),
      ),
    );

    const azmMx = this.mf.mod(
      this.mf.deg(
            Math.atan2(
              Math.sin(this.mf.rad(haMx)),
              Math.cos(this.mf.rad(haMx)) * Math.sin(this.mf.rad(piMx)) -
                  Math.tan(this.mf.rad(dMx)) * Math.cos(this.mf.rad(piMx)),
            ),
          ) +
          180,
      360.0,
    );

    // ==========================
    // Magnitudo gerhana
    // ==========================

    const rho = SafeMath.safeDiv(msMx, m1Mx);

    const ddd = msMx - rho;

    const mag1 = SafeMath.safeDiv(l1pMx - l2pMx, l1pMx + l2pMx);

    const mag2 = SafeMath.safeDiv(l1Mx - ddd, l1Mx + l2Mx);

    const mag = (msMx < 0.9972) ? mag1 : mag2;

    if (mag <= 0) {
      return new SolarEclipseGlobalResult({
        ada: false,
        besselian: bessel,
        jenis: jse,
      });
    }
    // ==========================
    // Lebar gerhana
    // ==========================

    const kk = SafeMath.sqrt(
      bBig * bBig + Math.pow(SafeMath.safeDiv((xMx * cc + yMx * aa), ns1), 2.0),
    );

    const wd = this.mf.abs(SafeMath.safeDiv(12756 * l2pMx, kk));

    // ==========================
    // Obskurasi (belum)
    // ==========================

    const jdSolarEclipseMxTD = this.mf.floor(jde2 - 0.5) + 0.5 + mXTD / 24.0;

    const jdSolarEclipseMxUT = this.mf.floor(jde2 - 0.5) + 0.5 + mXUT / 24.0;

    //Data MATAHARI DAN BULAN SAAT PUNCAK GERHANA
    //({ra: raS / 15,dec: dcS,sd: sdS,hp: hpS}),

    const raS = this.sn.sunGeocentricRightAscension(jdSolarEclipseMxTD, 0);
    const dcS = this.sn.sunGeocentricDeclination(jdSolarEclipseMxTD, 0);
    const sdS = this.sn.sunGeocentricSemidiameter(jdSolarEclipseMxTD, 0);
    const hpS = this.sn.sunEquatorialHorizontalParallax(jdSolarEclipseMxTD, 0);

    const raM = this.mo.moonGeocentricRightAscension(jdSolarEclipseMxTD, 0);
    const dcM = this.mo.moonGeocentricDeclination(jdSolarEclipseMxTD, 0);
    const sdM = this.mo.moonGeocentricSemidiameter(jdSolarEclipseMxTD, 0);
    const hpM = this.mo.moonEquatorialHorizontalParallax(jdSolarEclipseMxTD, 0);

    const central = msMx < 0.9972;

    // hitung semua P
    let jdSolarEclipseP1TD;
    let jdSolarEclipseP2TD;
    let jdSolarEclipseP3TD;
    let jdSolarEclipseP4TD;

    let jdSolarEclipseP1UT;
    let jdSolarEclipseP2UT;
    let jdSolarEclipseP3UT;
    let jdSolarEclipseP4UT;

    let ldP1, ldP2, ldP3, ldP4;
    let piP1, piP2, piP3, piP4;
    let altP1, altP2, altP3, altP4;
    let azmP1, azmP2, azmP3, azmP4;

    // hitung semua U
    let jdSolarEclipseU1TD;
    let jdSolarEclipseU2TD;
    let jdSolarEclipseU3TD;
    let jdSolarEclipseU4TD;

    let jdSolarEclipseU1UT;
    let jdSolarEclipseU2UT;
    let jdSolarEclipseU3UT;
    let jdSolarEclipseU4UT;

    let altU1, altU2, altU3, altU4;
    let azmU1, azmU2, azmU3, azmU4;

    let piU1, piU2, piU3, piU4;
    let ldU1, ldU2, ldU3, ldU4;

    // hitung semua C
    let jdSolarEclipseC1TD;
    let jdSolarEclipseC2TD;
    let jdSolarEclipseC1UT;
    let jdSolarEclipseC2UT;

    let altC1, altC2;
    let azmC1, azmC2;

    let piC1, piC2;
    let ldC1, ldC2;

    if (central) {
      //KONTAK P1 & P4
      //Penumbral First External Contact (P1)

      let xP1 = 0.0;
      let yP1 = 0.0;
      let dP1 = 0.0;
      let muP1 = 0.0;
      let xpP1 = 0.0;
      let ypP1 = 0.0;
      let l1P1 = 0.0;
      let omP1 = 0.0;
      let msP1 = 0.0;
      let y1P1 = 0.0;
      let m1P1 = 0.0;
      let roP1 = 0.0;
      let n2P1 = 0.0;
      let nsP1 = 0.0;
      let psP1 = 0.0;

      let tuP1 = 0.0;
      let tP1 = 0.0;

      tP1 += tuP1;

      for (let i = 1; i <= 5; i++) {
        xP1 =
            x[0] +
            x[1] * tP1 +
            x[2] * tP1 * tP1 +
            x[3] * tP1 * tP1 * tP1 +
            x[4] * tP1 * tP1 * tP1 * tP1;

        yP1 =
            y[0] +
            y[1] * tP1 +
            y[2] * tP1 * tP1 +
            y[3] * tP1 * tP1 * tP1 +
            y[4] * tP1 * tP1 * tP1 * tP1;

        dP1 =
            d[0] +
            d[1] * tP1 +
            d[2] * tP1 * tP1 +
            d[3] * tP1 * tP1 * tP1 +
            d[4] * tP1 * tP1 * tP1 * tP1;

        muP1 =
            mu[0] +
            mu[1] * tP1 +
            mu[2] * tP1 * tP1 +
            mu[3] * tP1 * tP1 * tP1 +
            mu[4] * tP1 * tP1 * tP1 * tP1;

        xpP1 =
            x[1] +
            2 * x[2] * tP1 +
            3 * x[3] * tP1 * tP1 +
            4 * x[4] * tP1 * tP1 * tP1;

        ypP1 =
            y[1] +
            2 * y[2] * tP1 +
            3 * y[3] * tP1 * tP1 +
            4 * y[4] * tP1 * tP1 * tP1;

        l1P1 =
            l1[0] +
            l1[1] * tP1 +
            l1[2] * tP1 * tP1 +
            l1[3] * tP1 * tP1 * tP1 +
            l1[4] * tP1 * tP1 * tP1 * tP1;

        omP1 = SafeMath.safeDiv(
          1.0,
          SafeMath.sqrt(1 - e2 * Math.cos(this.mf.rad(dP1)) * Math.cos(this.mf.rad(dP1))),
        );

        msP1 = SafeMath.sqrt(xP1 * xP1 + yP1 * yP1);

        y1P1 = yP1 * omP1;
        m1P1 = SafeMath.sqrt(xP1 * xP1 + y1P1 * y1P1);
        roP1 = SafeMath.safeDiv(msP1, m1P1);

        n2P1 = xpP1 * xpP1 + ypP1 * ypP1;
        nsP1 = SafeMath.sqrt(n2P1);

        psP1 = SafeMath.asin(
          SafeMath.safeDiv((xP1 * ypP1 - xpP1 * yP1), (nsP1 * (l1P1 + roP1))),
        );

        tuP1 =
            SafeMath.safeDiv((l1P1 + roP1), nsP1) * -Math.cos(psP1) -
            SafeMath.safeDiv((xP1 * xpP1 + yP1 * ypP1), (nsP1 * nsP1));

        tP1 = tP1 + tuP1;
      }

      let p1TD = this.mf.mod(t0 + tP1, 24.0);
      let p1UT = this.mf.mod(p1TD - dt / 3600.0, 24.0);

      // Koordinat saat kontak P1
      let d1P1 = this.mf.deg(
        Math.atan(
          SafeMath.safeDiv(Math.sin(this.mf.rad(dP1)), (Math.cos(this.mf.rad(dP1)) * ba)),
        ),
      );

      let rhP1 = SafeMath.sqrt(
        Math.sin(this.mf.rad(dP1)) * Math.sin(this.mf.rad(dP1)) +
            (Math.cos(this.mf.rad(dP1)) * ba) * (Math.cos(this.mf.rad(dP1)) * ba),
      );

      let yIP1 = SafeMath.safeDiv(yP1, rhP1);
      let mIP1 = SafeMath.sqrt(xP1 * xP1 + yIP1 * yIP1);

      let x1P1 = SafeMath.safeDiv(xP1, mIP1);
      let y2P1 = SafeMath.safeDiv(yIP1, mIP1);

      let pi1P1 = this.mf.deg(SafeMath.asin(y2P1 * Math.cos(this.mf.rad(d1P1))));

      piP1 = this.mf.deg(Math.atan(ab * Math.tan(this.mf.rad(pi1P1))));

      let x2P1 = -y2P1 * Math.sin(this.mf.rad(dP1));

      let haP1 = this.mf.mod(this.mf.deg(Math.atan2(x1P1, x2P1)), 360.0);

      let caP1 = haP1 - muP1 + (0.004178 * dt);

      ldP1;

      if (caP1 > 180) {
        ldP1 = caP1 - 360;
      } else if (caP1 < -180) {
        ldP1 = caP1 + 360;
      } else {
        ldP1 = caP1;
      }

      // Azimuth dan Altitude
      altP1 = this.mf.deg(
        SafeMath.asin(
          Math.sin(this.mf.rad(piP1)) * Math.sin(this.mf.rad(dP1)) +
              Math.cos(this.mf.rad(piP1)) *
                  Math.cos(this.mf.rad(dP1)) *
                  Math.cos(this.mf.rad(haP1)),
        ),
      );

      azmP1 = this.mf.mod(
        this.mf.deg(
              Math.atan2(
                Math.sin(this.mf.rad(haP1)),
                Math.cos(this.mf.rad(haP1)) * Math.sin(this.mf.rad(piP1)) -
                    Math.tan(this.mf.rad(dP1)) * Math.cos(this.mf.rad(piP1)),
              ),
            ) +
            180,
        360.0,
      );

      //Waktu Kontak P1

      jdSolarEclipseP1TD = this.mf.floor(jde2 - 0.5) + 0.5 + p1TD / 24.0;
      jdSolarEclipseP1UT = this.mf.floor(jde2 - 0.5) + 0.5 + p1UT / 24.0;

      // Penumbral Last External Contact (P4)

      let xP4 = 0.0;
      let yP4 = 0.0;
      let dP4 = 0.0;
      let muP4 = 0.0;
      let xpP4 = 0.0;
      let ypP4 = 0.0;
      let l1P4 = 0.0;
      let omP4 = 0.0;
      let msP4 = 0.0;
      let y1P4 = 0.0;
      let m1P4 = 0.0;
      let roP4 = 0.0;
      let n2P4 = 0.0;
      let nsP4 = 0.0;
      let psP4 = 0.0;

      let tuP4 = 0.0;
      let tP4 = 0.0;

      tP4 += tuP4;

      for (let i = 1; i <= 5; i++) {
        xP4 =
            x[0] +
            x[1] * tP4 +
            x[2] * tP4 * tP4 +
            x[3] * tP4 * tP4 * tP4 +
            x[4] * tP4 * tP4 * tP4 * tP4;

        yP4 =
            y[0] +
            y[1] * tP4 +
            y[2] * tP4 * tP4 +
            y[3] * tP4 * tP4 * tP4 +
            y[4] * tP4 * tP4 * tP4 * tP4;

        dP4 =
            d[0] +
            d[1] * tP4 +
            d[2] * tP4 * tP4 +
            d[3] * tP4 * tP4 * tP4 +
            d[4] * tP4 * tP4 * tP4 * tP4;

        muP4 =
            mu[0] +
            mu[1] * tP4 +
            mu[2] * tP4 * tP4 +
            mu[3] * tP4 * tP4 * tP4 +
            mu[4] * tP4 * tP4 * tP4 * tP4;

        xpP4 =
            x[1] +
            2 * x[2] * tP4 +
            3 * x[3] * tP4 * tP4 +
            4 * x[4] * tP4 * tP4 * tP4;

        ypP4 =
            y[1] +
            2 * y[2] * tP4 +
            3 * y[3] * tP4 * tP4 +
            4 * y[4] * tP4 * tP4 * tP4;

        l1P4 =
            l1[0] +
            l1[1] * tP4 +
            l1[2] * tP4 * tP4 +
            l1[3] * tP4 * tP4 * tP4 +
            l1[4] * tP4 * tP4 * tP4 * tP4;

        omP4 = SafeMath.safeDiv(
          1.0,
          SafeMath.sqrt(
            1.0 - e2 * Math.cos(this.mf.rad(dP4)) * Math.cos(this.mf.rad(dP4)),
          ),
        );

        msP4 = SafeMath.sqrt(xP4 * xP4 + yP4 * yP4);

        y1P4 = yP4 * omP4;

        m1P4 = SafeMath.sqrt(xP4 * xP4 + y1P4 * y1P4);

        roP4 = SafeMath.safeDiv(msP4, m1P4);

        n2P4 = xpP4 * xpP4 + ypP4 * ypP4;

        nsP4 = SafeMath.sqrt(n2P4);

        psP4 = SafeMath.asin(
          SafeMath.safeDiv((xP4 * ypP4 - xpP4 * yP4), (nsP4 * (l1P4 + roP4))),
        );

        tuP4 =
            SafeMath.safeDiv((l1P4 + roP4), nsP4) * Math.cos(psP4) -
            SafeMath.safeDiv((xP4 * xpP4 + yP4 * ypP4), (nsP4 * nsP4));

        tP4 = tP4 + tuP4;
      }

      let p4TD = this.mf.mod(t0 + tP4, 24.0);
      let p4UT = this.mf.mod(p4TD - dt / 3600.0, 24.0);

      // Koordinat saat kontak P4

      let d1P4 = this.mf.deg(
        Math.atan(
          SafeMath.safeDiv(Math.sin(this.mf.rad(dP4)), (Math.cos(this.mf.rad(dP4)) * ba)),
        ),
      );

      let rhP4 = SafeMath.sqrt(
        Math.sin(this.mf.rad(dP4)) * Math.sin(this.mf.rad(dP4)) +
            (Math.cos(this.mf.rad(dP4)) * ba) * (Math.cos(this.mf.rad(dP4)) * ba),
      );

      let yIP4 = SafeMath.safeDiv(yP4, rhP4);

      let mIP4 = SafeMath.sqrt(xP4 * xP4 + yIP4 * yIP4);

      let x1P4 = SafeMath.safeDiv(xP4, mIP4);
      let y2P4 = SafeMath.safeDiv(yIP4, mIP4);

      let pi1P4 = this.mf.deg(SafeMath.asin(y2P4 * Math.cos(this.mf.rad(d1P4))));

      piP4 = this.mf.deg(Math.atan(ab * Math.tan(this.mf.rad(pi1P4))));

      let x2P4 = -y2P4 * Math.sin(this.mf.rad(dP4));

      let haP4 = this.mf.mod(this.mf.deg(Math.atan2(x1P4, x2P4)), 360.0);

      let caP4 = haP4 - muP4 + (0.004178 * dt);

      ldP4;

      if (caP4 > 180.0) {
        ldP4 = caP4 - 360.0;
      } else if (caP4 < -180.0) {
        ldP4 = caP4 + 360.0;
      } else {
        ldP4 = caP4;
      }

      // Azimuth dan Altitude saat kontak P4

      altP4 = this.mf.deg(
        SafeMath.asin(
          Math.sin(this.mf.rad(piP4)) * Math.sin(this.mf.rad(dP4)) +
              Math.cos(this.mf.rad(piP4)) *
                  Math.cos(this.mf.rad(dP4)) *
                  Math.cos(this.mf.rad(haP4)),
        ),
      );

      azmP4 = this.mf.mod(
        this.mf.deg(
              Math.atan2(
                Math.sin(this.mf.rad(haP4)),
                Math.cos(this.mf.rad(haP4)) * Math.sin(this.mf.rad(piP4)) -
                    Math.tan(this.mf.rad(dP4)) * Math.cos(this.mf.rad(piP4)),
              ),
            ) +
            180.0,
        360.0,
      );

      //Waktu Kontak P4

      jdSolarEclipseP4TD = this.mf.floor(jde2 - 0.5) + 0.5 + p4TD / 24.0;
      jdSolarEclipseP4UT = this.mf.floor(jde2 - 0.5) + 0.5 + p4UT / 24.0;

      //KONTAK P2 & P3
      // ===============================
      // Penumbral First Internal Contact (P2)
      // ===============================

      let xP2 = 0.0;
      let yP2 = 0.0;
      let dP2 = 0.0;
      let muP2 = 0.0;
      let xpP2 = 0.0;
      let ypP2 = 0.0;
      let l1P2 = 0.0;
      let omP2 = 0.0;
      let msP2 = 0.0;
      let y1P2 = 0.0;
      let m1P2 = 0.0;
      let roP2 = 0.0;
      let n2P2 = 0.0;
      let nsP2 = 0.0;
      let psP2 = 0.0;

      let tuP2 = 0.0;
      let tP2 = 0.0;

      tP2 += tuP2;

      for (let i = 1; i <= 5; i++) {
        xP2 =
            x[0] +
            x[1] * tP2 +
            x[2] * tP2 * tP2 +
            x[3] * tP2 * tP2 * tP2 +
            x[4] * tP2 * tP2 * tP2 * tP2;

        yP2 =
            y[0] +
            y[1] * tP2 +
            y[2] * tP2 * tP2 +
            y[3] * tP2 * tP2 * tP2 +
            y[4] * tP2 * tP2 * tP2 * tP2;

        dP2 =
            d[0] +
            d[1] * tP2 +
            d[2] * tP2 * tP2 +
            d[3] * tP2 * tP2 * tP2 +
            d[4] * tP2 * tP2 * tP2 * tP2;

        muP2 =
            mu[0] +
            mu[1] * tP2 +
            mu[2] * tP2 * tP2 +
            mu[3] * tP2 * tP2 * tP2 +
            mu[4] * tP2 * tP2 * tP2 * tP2;

        xpP2 =
            x[1] +
            2 * x[2] * tP2 +
            3 * x[3] * tP2 * tP2 +
            4 * x[4] * tP2 * tP2 * tP2;

        ypP2 =
            y[1] +
            2 * y[2] * tP2 +
            3 * y[3] * tP2 * tP2 +
            4 * y[4] * tP2 * tP2 * tP2;

        l1P2 =
            l1[0] +
            l1[1] * tP2 +
            l1[2] * tP2 * tP2 +
            l1[3] * tP2 * tP2 * tP2 +
            l1[4] * tP2 * tP2 * tP2 * tP2;

        omP2 = SafeMath.safeDiv(
          1.0,
          SafeMath.sqrt(
            1.0 - e2 * Math.cos(this.mf.rad(dP2)) * Math.cos(this.mf.rad(dP2)),
          ),
        );

        msP2 = SafeMath.sqrt(xP2 * xP2 + yP2 * yP2);

        y1P2 = yP2 * omP2;

        m1P2 = SafeMath.sqrt(xP2 * xP2 + y1P2 * y1P2);

        roP2 = SafeMath.safeDiv(msP2, m1P2);

        n2P2 = xpP2 * xpP2 + ypP2 * ypP2;

        nsP2 = SafeMath.sqrt(n2P2);

        psP2 = SafeMath.asin(
          SafeMath.safeDiv((xP2 * ypP2 - xpP2 * yP2), (nsP2 * (l1P2 - roP2))),
        );

        tuP2 =
            (SafeMath.safeDiv((roP2 - l1P2), nsP2)) * -Math.cos(psP2) -
            SafeMath.safeDiv((xP2 * xpP2 + yP2 * ypP2), (nsP2 * nsP2));

        tP2 = tP2 + tuP2;
      }

      let p2TD = this.mf.mod(t0 + tP2, 24.0);

      let p2UT = this.mf.mod(p2TD - dt / 3600.0, 24.0);

      // Koordinat saat kontak P2

      let d1P2 = this.mf.deg(
        Math.atan(
          SafeMath.safeDiv(Math.sin(this.mf.rad(dP2)), (Math.cos(this.mf.rad(dP2)) * ba)),
        ),
      );

      let rhP2 = SafeMath.sqrt(
        Math.sin(this.mf.rad(dP2)) * Math.sin(this.mf.rad(dP2)) +
            (Math.cos(this.mf.rad(dP2)) * ba) * (Math.cos(this.mf.rad(dP2)) * ba),
      );

      let yIP2 = SafeMath.safeDiv(yP2, rhP2);

      let mIP2 = SafeMath.sqrt(xP2 * xP2 + yIP2 * yIP2);

      let x1P2 = SafeMath.safeDiv(xP2, mIP2);

      let y2P2 = SafeMath.safeDiv(yIP2, mIP2);

      let pi1P2 = this.mf.deg(SafeMath.asin(y2P2 * Math.cos(this.mf.rad(d1P2))));

      piP2 = this.mf.deg(Math.atan(ab * Math.tan(this.mf.rad(pi1P2))));

      let x2P2 = -y2P2 * Math.sin(this.mf.rad(dP2));

      let haP2 = this.mf.mod(this.mf.deg(Math.atan2(x1P2, x2P2)), 360.0);

      let caP2 = haP2 - muP2 + (0.004178 * dt);

      if (caP2 > 180.0) {
        ldP2 = caP2 - 360.0;
      } else if (caP2 < -180.0) {
        ldP2 = caP2 + 360.0;
      } else {
        ldP2 = caP2;
      }

      // Azimuth dan Altitude saat kontak P2

      altP2 = this.mf.deg(
        SafeMath.asin(
          Math.sin(this.mf.rad(piP2)) * Math.sin(this.mf.rad(dP2)) +
              Math.cos(this.mf.rad(piP2)) *
                  Math.cos(this.mf.rad(dP2)) *
                  Math.cos(this.mf.rad(haP2)),
        ),
      );

      azmP2 = this.mf.mod(
        this.mf.deg(
              Math.atan2(
                Math.sin(this.mf.rad(haP2)),
                Math.cos(this.mf.rad(haP2)) * Math.sin(this.mf.rad(piP2)) -
                    Math.tan(this.mf.rad(dP2)) * Math.cos(this.mf.rad(piP2)),
              ),
            ) +
            180.0,
        360.0,
      );

      //Waktu Kontak P2

      jdSolarEclipseP2TD = this.mf.floor(jde2 - 0.5) + 0.5 + p2TD / 24.0;

      jdSolarEclipseP2UT = this.mf.floor(jde2 - 0.5) + 0.5 + p2UT / 24.0;

      // ===============================
      // Penumbral Last Internal Contact (P3)
      // ===============================

      let xP3 = 0.0;
      let yP3 = 0.0;
      let dP3 = 0.0;
      let muP3 = 0.0;
      let xpP3 = 0.0;
      let ypP3 = 0.0;
      let l1P3 = 0.0;
      let omP3 = 0.0;
      let msP3 = 0.0;
      let y1P3 = 0.0;
      let m1P3 = 0.0;
      let roP3 = 0.0;
      let n2P3 = 0.0;
      let nsP3 = 0.0;
      let psP3 = 0.0;

      let tuP3 = 0.0;
      let tP3 = 0.0;

      tP3 += tuP3;

      for (let i = 1; i <= 5; i++) {
        xP3 =
            x[0] +
            x[1] * tP3 +
            x[2] * tP3 * tP3 +
            x[3] * tP3 * tP3 * tP3 +
            x[4] * tP3 * tP3 * tP3 * tP3;

        yP3 =
            y[0] +
            y[1] * tP3 +
            y[2] * tP3 * tP3 +
            y[3] * tP3 * tP3 * tP3 +
            y[4] * tP3 * tP3 * tP3 * tP3;

        dP3 =
            d[0] +
            d[1] * tP3 +
            d[2] * tP3 * tP3 +
            d[3] * tP3 * tP3 * tP3 +
            d[4] * tP3 * tP3 * tP3 * tP3;

        muP3 =
            mu[0] +
            mu[1] * tP3 +
            mu[2] * tP3 * tP3 +
            mu[3] * tP3 * tP3 * tP3 +
            mu[4] * tP3 * tP3 * tP3 * tP3;

        xpP3 =
            x[1] +
            2 * x[2] * tP3 +
            3 * x[3] * tP3 * tP3 +
            4 * x[4] * tP3 * tP3 * tP3;

        ypP3 =
            y[1] +
            2 * y[2] * tP3 +
            3 * y[3] * tP3 * tP3 +
            4 * y[4] * tP3 * tP3 * tP3;

        l1P3 =
            l1[0] +
            l1[1] * tP3 +
            l1[2] * tP3 * tP3 +
            l1[3] * tP3 * tP3 * tP3 +
            l1[4] * tP3 * tP3 * tP3 * tP3;

        omP3 = SafeMath.safeDiv(
          1.0,
          SafeMath.sqrt(1 - e2 * Math.cos(this.mf.rad(dP3)) * Math.cos(this.mf.rad(dP3))),
        );

        msP3 = SafeMath.sqrt(xP3 * xP3 + yP3 * yP3);

        y1P3 = yP3 * omP3;
        m1P3 = SafeMath.sqrt(xP3 * xP3 + y1P3 * y1P3);

        roP3 = SafeMath.safeDiv(msP3, m1P3);

        n2P3 = xpP3 * xpP3 + ypP3 * ypP3;
        nsP3 = SafeMath.sqrt(n2P3);

        psP3 = SafeMath.asin(
          SafeMath.safeDiv((xP3 * ypP3 - xpP3 * yP3), (nsP3 * (l1P3 - roP3))),
        );

        tuP3 =
            SafeMath.safeDiv((roP3 - l1P3), nsP3) * Math.cos(psP3) -
            SafeMath.safeDiv((xP3 * xpP3 + yP3 * ypP3), (nsP3 * nsP3));

        tP3 = tP3 + tuP3;
      }

      // ===============================
      // Waktu P3
      // ===============================

      let p3TD = this.mf.mod(t0 + tP3, 24.0);
      let p3UT = this.mf.mod(p3TD - dt / 3600.0, 24.0);

      // ===============================
      // Koordinat saat kontak P3
      // ===============================

      let d1P3 = this.mf.deg(
        Math.atan(
          SafeMath.safeDiv(Math.sin(this.mf.rad(dP3)), (Math.cos(this.mf.rad(dP3)) * ba)),
        ),
      );

      let rhP3 = SafeMath.sqrt(
        Math.sin(this.mf.rad(dP3)) * Math.sin(this.mf.rad(dP3)) +
            (Math.cos(this.mf.rad(dP3)) * ba) * (Math.cos(this.mf.rad(dP3)) * ba),
      );

      let yIP3 = SafeMath.safeDiv(yP3, rhP3);

      let mIP3 = SafeMath.sqrt(xP3 * xP3 + yIP3 * yIP3);

      let x1P3 = SafeMath.safeDiv(xP3, mIP3);
      let y2P3 = SafeMath.safeDiv(yIP3, mIP3);

      let pi1P3 = this.mf.deg(SafeMath.asin(y2P3 * Math.cos(this.mf.rad(d1P3))));

      piP3 = this.mf.deg(Math.atan(ab * Math.tan(this.mf.rad(pi1P3))));

      let x2P3 = -y2P3 * Math.sin(this.mf.rad(dP3));

      let haP3 = this.mf.mod(this.mf.deg(Math.atan2(x1P3, x2P3)), 360.0);

      let caP3 = haP3 - muP3 + (0.004178 * dt);

      if (caP3 > 180) {
        ldP3 = caP3 - 360;
      } else if (caP3 < -180) {
        ldP3 = caP3 + 360;
      } else {
        ldP3 = caP3;
      }

      // ===============================
      // Azimuth & Altitude P3
      // ===============================

      altP3 = this.mf.deg(
        SafeMath.asin(
          Math.sin(this.mf.rad(piP3)) * Math.sin(this.mf.rad(dP3)) +
              Math.cos(this.mf.rad(piP3)) *
                  Math.cos(this.mf.rad(dP3)) *
                  Math.cos(this.mf.rad(haP3)),
        ),
      );

      azmP3 = this.mf.mod(
        this.mf.deg(
              Math.atan2(
                Math.sin(this.mf.rad(haP3)),
                Math.cos(this.mf.rad(haP3)) * Math.sin(this.mf.rad(piP3)) -
                    Math.tan(this.mf.rad(dP3)) * Math.cos(this.mf.rad(piP3)),
              ),
            ) +
            180,
        360.0,
      );

      //Waktu Kontak P3

      jdSolarEclipseP3TD = this.mf.floor(jde2 - 0.5) + 0.5 + p3TD / 24.0;

      jdSolarEclipseP3UT = this.mf.floor(jde2 - 0.5) + 0.5 + p3UT / 24.0;

      //KONTAK U1, U2, U3, U4

      // ===============================
      // U1
      // ===============================

      let xU1 = 0.0;
      let yU1 = 0.0;
      let dU1 = 0.0;
      let muU1 = 0.0;
      let xpU1 = 0.0;
      let ypU1 = 0.0;
      let l2U1 = 0.0;
      let omU1 = 0.0;
      let msU1 = 0.0;
      let y1U1 = 0.0;
      let m1U1 = 0.0;
      let roU1 = 0.0;
      let n2U1 = 0.0;
      let nsU1 = 0.0;
      let psU1 = 0.0;

      let tuU1 = 0.0;
      let tU1 = 0.0;

      tU1 += tuU1;

      for (let i = 1; i <= 5; i++) {
        xU1 =
            x[0] +
            x[1] * tU1 +
            x[2] * tU1 * tU1 +
            x[3] * tU1 * tU1 * tU1 +
            x[4] * tU1 * tU1 * tU1 * tU1;
        yU1 =
            y[0] +
            y[1] * tU1 +
            y[2] * tU1 * tU1 +
            y[3] * tU1 * tU1 * tU1 +
            y[4] * tU1 * tU1 * tU1 * tU1;
        dU1 =
            d[0] +
            d[1] * tU1 +
            d[2] * tU1 * tU1 +
            d[3] * tU1 * tU1 * tU1 +
            d[4] * tU1 * tU1 * tU1 * tU1;
        muU1 =
            mu[0] +
            mu[1] * tU1 +
            mu[2] * tU1 * tU1 +
            mu[3] * tU1 * tU1 * tU1 +
            mu[4] * tU1 * tU1 * tU1 * tU1;

        xpU1 =
            x[1] +
            2 * x[2] * tU1 +
            3 * x[3] * tU1 * tU1 +
            4 * x[4] * tU1 * tU1 * tU1;

        ypU1 =
            y[1] +
            2 * y[2] * tU1 +
            3 * y[3] * tU1 * tU1 +
            4 * y[4] * tU1 * tU1 * tU1;

        l2U1 =
            l2[0] +
            l2[1] * tU1 +
            l2[2] * tU1 * tU1 +
            l2[3] * tU1 * tU1 * tU1 +
            l2[4] * tU1 * tU1 * tU1 * tU1;

        omU1 = SafeMath.safeDiv(
          1.0,
          SafeMath.sqrt(1 - e2 * Math.cos(this.mf.rad(dU1)) * Math.cos(this.mf.rad(dU1))),
        );
        msU1 = SafeMath.sqrt(xU1 * xU1 + yU1 * yU1);

        y1U1 = yU1 * omU1;
        m1U1 = SafeMath.sqrt(xU1 * xU1 + y1U1 * y1U1);
        roU1 = SafeMath.safeDiv(msU1, m1U1);

        n2U1 = xpU1 * xpU1 + ypU1 * ypU1;
        nsU1 = SafeMath.sqrt(n2U1);

        if (l2U1 < 0.0) {
          psU1 = SafeMath.asin(
            SafeMath.safeDiv((xU1 * ypU1 - xpU1 * yU1), (nsU1 * (l2U1 - roU1))),
          );
          tuU1 =
              SafeMath.safeDiv((roU1 - l2U1), nsU1) * -Math.cos(psU1) -
              SafeMath.safeDiv((xU1 * xpU1 + yU1 * ypU1), (nsU1 * nsU1));
        } else {
          psU1 = SafeMath.asin(
            SafeMath.safeDiv((xU1 * ypU1 - xpU1 * yU1), (nsU1 * (l2U1 + roU1))),
          );
          tuU1 =
              SafeMath.safeDiv((roU1 + l2U1), nsU1) * -Math.cos(psU1) -
              SafeMath.safeDiv((xU1 * xpU1 + yU1 * ypU1), (nsU1 * nsU1));
        }

        tU1 = tU1 + tuU1;
      }

      // ===============================
      // Waktu U1
      // ===============================

      let u1TD = this.mf.mod(t0 + tU1, 24.0);
      let u1UT = this.mf.mod(u1TD - dt / 3600.0, 24.0);

      // ===============================
      // Koordinat saat kontak U1
      // ===============================

      let d1U1 = this.mf.deg(
        Math.atan(
          SafeMath.safeDiv(Math.sin(this.mf.rad(dU1)), (Math.cos(this.mf.rad(dU1)) * ba)),
        ),
      );

      let rhU1 = SafeMath.sqrt(
        Math.sin(this.mf.rad(dU1)) * Math.sin(this.mf.rad(dU1)) +
            (Math.cos(this.mf.rad(dU1)) * ba) * (Math.cos(this.mf.rad(dU1)) * ba),
      );

      let yIU1 = SafeMath.safeDiv(yU1, rhU1);
      let mIU1 = SafeMath.sqrt(xU1 * xU1 + yIU1 * yIU1);

      let x1U1 = SafeMath.safeDiv(xU1, mIU1);
      let y2U1 = SafeMath.safeDiv(yIU1, mIU1);

      let pi1U1 = this.mf.deg(SafeMath.asin(y2U1 * Math.cos(this.mf.rad(d1U1))));

      piU1 = this.mf.deg(Math.atan(ab * Math.tan(this.mf.rad(pi1U1))));

      let x2U1 = -y2U1 * Math.sin(this.mf.rad(dU1));

      let haU1 = this.mf.mod(this.mf.deg(Math.atan2(x1U1, x2U1)), 360.0);

      let caU1 = haU1 - muU1 + (0.004178 * dt);

      if (caU1 > 180) {
        ldU1 = caU1 - 360;
      } else if (caU1 < -180) {
        ldU1 = caU1 + 360;
      } else {
        ldU1 = caU1;
      }

      // ===============================
      // Azimuth & Altitude U1
      // ===============================

      altU1 = this.mf.deg(
        SafeMath.asin(
          Math.sin(this.mf.rad(piU1)) * Math.sin(this.mf.rad(dU1)) +
              Math.cos(this.mf.rad(piU1)) *
                  Math.cos(this.mf.rad(dU1)) *
                  Math.cos(this.mf.rad(haU1)),
        ),
      );

      azmU1 = this.mf.mod(
        this.mf.deg(
              Math.atan2(
                Math.sin(this.mf.rad(haU1)),
                Math.cos(this.mf.rad(haU1)) * Math.sin(this.mf.rad(piU1)) -
                    Math.tan(this.mf.rad(dU1)) * Math.cos(this.mf.rad(piU1)),
              ),
            ) +
            180,
        360.0,
      );

      //Waktu Kontak U1

      jdSolarEclipseU1TD = this.mf.floor(jde2 - 0.5) + 0.5 + u1TD / 24.0;

      jdSolarEclipseU1UT = this.mf.floor(jde2 - 0.5) + 0.5 + u1UT / 24.0;

      // ===============================
      // U2
      // ===============================

      let xU2 = 0.0;
      let yU2 = 0.0;
      let dU2 = 0.0;
      let muU2 = 0.0;
      let xpU2 = 0.0;
      let ypU2 = 0.0;
      let l2U2 = 0.0;
      let omU2 = 0.0;
      let msU2 = 0.0;
      let y1U2 = 0.0;
      let m1U2 = 0.0;
      let roU2 = 0.0;
      let n2U2 = 0.0;
      let nsU2 = 0.0;
      let psU2 = 0.0;

      let tuU2 = 0.0;
      let tU2 = 0.0;

      tU2 += tuU2;

      for (let i = 1; i <= 5; i++) {
        xU2 =
            x[0] +
            x[1] * tU2 +
            x[2] * tU2 * tU2 +
            x[3] * tU2 * tU2 * tU2 +
            x[4] * tU2 * tU2 * tU2 * tU2;

        yU2 =
            y[0] +
            y[1] * tU2 +
            y[2] * tU2 * tU2 +
            y[3] * tU2 * tU2 * tU2 +
            y[4] * tU2 * tU2 * tU2 * tU2;

        dU2 =
            d[0] +
            d[1] * tU2 +
            d[2] * tU2 * tU2 +
            d[3] * tU2 * tU2 * tU2 +
            d[4] * tU2 * tU2 * tU2 * tU2;

        muU2 =
            mu[0] +
            mu[1] * tU2 +
            mu[2] * tU2 * tU2 +
            mu[3] * tU2 * tU2 * tU2 +
            mu[4] * tU2 * tU2 * tU2 * tU2;

        xpU2 =
            x[1] +
            2 * x[2] * tU2 +
            3 * x[3] * tU2 * tU2 +
            4 * x[4] * tU2 * tU2 * tU2;

        ypU2 =
            y[1] +
            2 * y[2] * tU2 +
            3 * y[3] * tU2 * tU2 +
            4 * y[4] * tU2 * tU2 * tU2;

        l2U2 =
            l2[0] +
            l2[1] * tU2 +
            l2[2] * tU2 * tU2 +
            l2[3] * tU2 * tU2 * tU2 +
            l2[4] * tU2 * tU2 * tU2 * tU2;

        omU2 = SafeMath.safeDiv(
          1.0,
          SafeMath.sqrt(1 - e2 * Math.cos(this.mf.rad(dU2)) * Math.cos(this.mf.rad(dU2))),
        );

        msU2 = SafeMath.sqrt(xU2 * xU2 + yU2 * yU2);

        y1U2 = yU2 * omU2;
        m1U2 = SafeMath.sqrt(xU2 * xU2 + y1U2 * y1U2);
        roU2 = SafeMath.safeDiv(msU2, m1U2);

        n2U2 = xpU2 * xpU2 + ypU2 * ypU2;
        nsU2 = SafeMath.sqrt(n2U2);

        if (l2U2 < 0.0) {
          psU2 = SafeMath.asin(
            SafeMath.safeDiv((xU2 * ypU2 - xpU2 * yU2), (nsU2 * (l2U2 + roU2))),
          );
        } else {
          psU2 = SafeMath.asin(
            SafeMath.safeDiv((xU2 * ypU2 - xpU2 * yU2), (nsU2 * (l2U2 - roU2))),
          );
        }

        if (l2U2 < 0.0) {
          tuU2 =
              SafeMath.safeDiv((roU2 + l2U2), nsU2) * -Math.cos(psU2) -
              SafeMath.safeDiv((xU2 * xpU2 + yU2 * ypU2), (nsU2 * nsU2));
        } else {
          tuU2 =
              SafeMath.safeDiv((roU2 - l2U2), nsU2) * -Math.cos(psU2) -
              SafeMath.safeDiv((xU2 * xpU2 + yU2 * ypU2), (nsU2 * nsU2));
        }

        tU2 = tU2 + tuU2;
      }

      let u2TD = this.mf.mod(t0 + tU2, 24.0);
      let u2UT = this.mf.mod(u2TD - dt / 3600.0, 24.0);

      // Koordinat saat kontak U2

      let d1U2 = this.mf.deg(
        Math.atan(
          SafeMath.safeDiv(Math.sin(this.mf.rad(dU2)), (Math.cos(this.mf.rad(dU2)) * ba)),
        ),
      );

      let rhU2 = SafeMath.sqrt(
        Math.sin(this.mf.rad(dU2)) * Math.sin(this.mf.rad(dU2)) +
            (Math.cos(this.mf.rad(dU2)) * ba) * (Math.cos(this.mf.rad(dU2)) * ba),
      );

      let yIU2 = SafeMath.safeDiv(yU2, rhU2);
      let mIU2 = SafeMath.sqrt(xU2 * xU2 + yIU2 * yIU2);

      let x1U2 = SafeMath.safeDiv(xU2, mIU2);
      let y2U2 = SafeMath.safeDiv(yIU2, mIU2);

      let pi1U2 = this.mf.deg(SafeMath.asin(y2U2 * Math.cos(this.mf.rad(d1U2))));

      piU2 = this.mf.deg(Math.atan(ab * Math.tan(this.mf.rad(pi1U2))));

      let x2U2 = -y2U2 * Math.sin(this.mf.rad(dU2));

      let haU2 = this.mf.mod(this.mf.deg(Math.atan2(x1U2, x2U2)), 360.0);

      let caU2 = haU2 - muU2 + (0.004178 * dt);

      if (caU2 > 180) {
        ldU2 = caU2 - 360;
      } else if (caU2 < -180) {
        ldU2 = caU2 + 360;
      } else {
        ldU2 = caU2;
      }

      // Azimuth dan Altitude saat kontak U2

      altU2 = this.mf.deg(
        SafeMath.asin(
          Math.sin(this.mf.rad(piU2)) * Math.sin(this.mf.rad(dU2)) +
              Math.cos(this.mf.rad(piU2)) *
                  Math.cos(this.mf.rad(dU2)) *
                  Math.cos(this.mf.rad(haU2)),
        ),
      );

      azmU2 = this.mf.mod(
        this.mf.deg(
              Math.atan2(
                Math.sin(this.mf.rad(haU2)),
                Math.cos(this.mf.rad(haU2)) * Math.sin(this.mf.rad(piU2)) -
                    Math.tan(this.mf.rad(dU2)) * Math.cos(this.mf.rad(piU2)),
              ),
            ) +
            180,
        360.0,
      );

      //Waktu Kontak U2

      jdSolarEclipseU2TD = this.mf.floor(jde2 - 0.5) + 0.5 + u2TD / 24.0;

      jdSolarEclipseU2UT = this.mf.floor(jde2 - 0.5) + 0.5 + u2UT / 24.0;

      // ===============================
      // U3
      // ===============================

      let xU3 = 0.0;
      let yU3 = 0.0;
      let dU3 = 0.0;
      let muU3 = 0.0;
      let xpU3 = 0.0;
      let ypU3 = 0.0;
      let l2U3 = 0.0;
      let omU3 = 0.0;
      let msU3 = 0.0;
      let y1U3 = 0.0;
      let m1U3 = 0.0;
      let roU3 = 0.0;
      let n2U3 = 0.0;
      let nsU3 = 0.0;
      let psU3 = 0.0;

      let tuU3 = 0.0;
      let tU3 = 0.0;

      tU3 += tuU3;

      for (let i = 1; i <= 5; i++) {
        xU3 =
            x[0] +
            x[1] * tU3 +
            x[2] * tU3 * tU3 +
            x[3] * tU3 * tU3 * tU3 +
            x[4] * tU3 * tU3 * tU3 * tU3;

        yU3 =
            y[0] +
            y[1] * tU3 +
            y[2] * tU3 * tU3 +
            y[3] * tU3 * tU3 * tU3 +
            y[4] * tU3 * tU3 * tU3 * tU3;

        dU3 =
            d[0] +
            d[1] * tU3 +
            d[2] * tU3 * tU3 +
            d[3] * tU3 * tU3 * tU3 +
            d[4] * tU3 * tU3 * tU3 * tU3;

        muU3 =
            mu[0] +
            mu[1] * tU3 +
            mu[2] * tU3 * tU3 +
            mu[3] * tU3 * tU3 * tU3 +
            mu[4] * tU3 * tU3 * tU3 * tU3;

        xpU3 =
            x[1] +
            2 * x[2] * tU3 +
            3 * x[3] * tU3 * tU3 +
            4 * x[4] * tU3 * tU3 * tU3;

        ypU3 =
            y[1] +
            2 * y[2] * tU3 +
            3 * y[3] * tU3 * tU3 +
            4 * y[4] * tU3 * tU3 * tU3;

        l2U3 =
            l2[0] +
            l2[1] * tU3 +
            l2[2] * tU3 * tU3 +
            l2[3] * tU3 * tU3 * tU3 +
            l2[4] * tU3 * tU3 * tU3 * tU3;

        omU3 = SafeMath.safeDiv(
          1.0,
          SafeMath.sqrt(1 - e2 * Math.cos(this.mf.rad(dU3)) * Math.cos(this.mf.rad(dU3))),
        );

        msU3 = SafeMath.sqrt(xU3 * xU3 + yU3 * yU3);

        y1U3 = yU3 * omU3;
        m1U3 = SafeMath.sqrt(xU3 * xU3 + y1U3 * y1U3);
        roU3 = SafeMath.safeDiv(msU3, m1U3);

        n2U3 = xpU3 * xpU3 + ypU3 * ypU3;
        nsU3 = SafeMath.sqrt(n2U3);

        if (l2U3 < 0.0) {
          psU3 = SafeMath.asin(
            SafeMath.safeDiv((xU3 * ypU3 - xpU3 * yU3), (nsU3 * (l2U3 + roU3))),
          );
        } else {
          psU3 = SafeMath.asin(
            SafeMath.safeDiv((xU3 * ypU3 - xpU3 * yU3), (nsU3 * (l2U3 - roU3))),
          );
        }

        if (l2U3 < 0.0) {
          tuU3 =
              SafeMath.safeDiv((roU3 + l2U3), nsU3) * Math.cos(psU3) -
              SafeMath.safeDiv((xU3 * xpU3 + yU3 * ypU3), (nsU3 * nsU3));
        } else {
          tuU3 =
              SafeMath.safeDiv((roU3 - l2U3), nsU3) * Math.cos(psU3) -
              SafeMath.safeDiv((xU3 * xpU3 + yU3 * ypU3), (nsU3 * nsU3));
        }

        tU3 = tU3 + tuU3;
      }

      let u3TD = this.mf.mod(t0 + tU3, 24.0);
      let u3UT = this.mf.mod(u3TD - dt / 3600.0, 24.0);

      // Koordinat saat kontak U3

      let d1U3 = this.mf.deg(
        Math.atan(
          SafeMath.safeDiv(Math.sin(this.mf.rad(dU3)), (Math.cos(this.mf.rad(dU3)) * ba)),
        ),
      );

      let rhU3 = SafeMath.sqrt(
        Math.sin(this.mf.rad(dU3)) * Math.sin(this.mf.rad(dU3)) +
            (Math.cos(this.mf.rad(dU3)) * ba) * (Math.cos(this.mf.rad(dU3)) * ba),
      );

      let yIU3 = SafeMath.safeDiv(yU3, rhU3);
      let mIU3 = SafeMath.sqrt(xU3 * xU3 + yIU3 * yIU3);

      let x1U3 = SafeMath.safeDiv(xU3, mIU3);
      let y2U3 = SafeMath.safeDiv(yIU3, mIU3);

      let pi1U3 = this.mf.deg(SafeMath.asin(y2U3 * Math.cos(this.mf.rad(d1U3))));

      piU3 = this.mf.deg(Math.atan(ab * Math.tan(this.mf.rad(pi1U3))));

      let x2U3 = -y2U3 * Math.sin(this.mf.rad(dU3));

      let haU3 = this.mf.mod(this.mf.deg(Math.atan2(x1U3, x2U3)), 360.0);

      let caU3 = haU3 - muU3 + (0.004178 * dt);

      if (caU3 > 180) {
        ldU3 = caU3 - 360;
      } else if (caU3 < -180) {
        ldU3 = caU3 + 360;
      } else {
        ldU3 = caU3;
      }

      // Azimuth dan Altitude saat kontak U3

      altU3 = this.mf.deg(
        SafeMath.asin(
          Math.sin(this.mf.rad(piU3)) * Math.sin(this.mf.rad(dU3)) +
              Math.cos(this.mf.rad(piU3)) *
                  Math.cos(this.mf.rad(dU3)) *
                  Math.cos(this.mf.rad(haU3)),
        ),
      );

      azmU3 = this.mf.mod(
        this.mf.deg(
              Math.atan2(
                Math.sin(this.mf.rad(haU3)),
                Math.cos(this.mf.rad(haU3)) * Math.sin(this.mf.rad(piU3)) -
                    Math.tan(this.mf.rad(dU3)) * Math.cos(this.mf.rad(piU3)),
              ),
            ) +
            180,
        360.0,
      );

      //Waktu Kontak U3

      jdSolarEclipseU3TD = this.mf.floor(jde2 - 0.5) + 0.5 + u3TD / 24.0;

      jdSolarEclipseU3UT = this.mf.floor(jde2 - 0.5) + 0.5 + u3UT / 24.0;

      // ===============================
      // U4
      // ===============================

      let xU4 = 0.0;
      let yU4 = 0.0;
      let dU4 = 0.0;
      let muU4 = 0.0;
      let xpU4 = 0.0;
      let ypU4 = 0.0;
      let l2U4 = 0.0;
      let omU4 = 0.0;
      let msU4 = 0.0;
      let y1U4 = 0.0;
      let m1U4 = 0.0;
      let roU4 = 0.0;
      let n2U4 = 0.0;
      let nsU4 = 0.0;
      let psU4 = 0.0;

      let tuU4 = 0.0;
      let tU4 = 0.0;

      tU4 += tuU4;

      for (let i = 1; i <= 5; i++) {
        xU4 =
            x[0] +
            x[1] * tU4 +
            x[2] * tU4 * tU4 +
            x[3] * tU4 * tU4 * tU4 +
            x[4] * tU4 * tU4 * tU4 * tU4;

        yU4 =
            y[0] +
            y[1] * tU4 +
            y[2] * tU4 * tU4 +
            y[3] * tU4 * tU4 * tU4 +
            y[4] * tU4 * tU4 * tU4 * tU4;

        dU4 =
            d[0] +
            d[1] * tU4 +
            d[2] * tU4 * tU4 +
            d[3] * tU4 * tU4 * tU4 +
            d[4] * tU4 * tU4 * tU4 * tU4;

        muU4 =
            mu[0] +
            mu[1] * tU4 +
            mu[2] * tU4 * tU4 +
            mu[3] * tU4 * tU4 * tU4 +
            mu[4] * tU4 * tU4 * tU4 * tU4;

        xpU4 =
            x[1] +
            2 * x[2] * tU4 +
            3 * x[3] * tU4 * tU4 +
            4 * x[4] * tU4 * tU4 * tU4;

        ypU4 =
            y[1] +
            2 * y[2] * tU4 +
            3 * y[3] * tU4 * tU4 +
            4 * y[4] * tU4 * tU4 * tU4;

        l2U4 =
            l2[0] +
            l2[1] * tU4 +
            l2[2] * tU4 * tU4 +
            l2[3] * tU4 * tU4 * tU4 +
            l2[4] * tU4 * tU4 * tU4 * tU4;

        omU4 = SafeMath.safeDiv(
          1.0,
          SafeMath.sqrt(1 - e2 * Math.cos(this.mf.rad(dU4)) * Math.cos(this.mf.rad(dU4))),
        );

        msU4 = SafeMath.sqrt(xU4 * xU4 + yU4 * yU4);

        y1U4 = yU4 * omU4;
        m1U4 = SafeMath.sqrt(xU4 * xU4 + y1U4 * y1U4);
        roU4 = SafeMath.safeDiv(msU4, m1U4);

        n2U4 = xpU4 * xpU4 + ypU4 * ypU4;
        nsU4 = SafeMath.sqrt(n2U4);

        if (l2U4 < 0.0) {
          psU4 = SafeMath.asin(
            SafeMath.safeDiv((xU4 * ypU4 - xpU4 * yU4), (nsU4 * (l2U4 - roU4))),
          );
        } else {
          psU4 = SafeMath.asin(
            SafeMath.safeDiv((xU4 * ypU4 - xpU4 * yU4), (nsU4 * (l2U4 + roU4))),
          );
        }

        if (l2U4 < 0.0) {
          tuU4 =
              SafeMath.safeDiv((roU4 - l2U4), nsU4) * Math.cos(psU4) -
              SafeMath.safeDiv((xU4 * xpU4 + yU4 * ypU4), (nsU4 * nsU4));
        } else {
          tuU4 =
              SafeMath.safeDiv((roU4 + l2U4), nsU4) * Math.cos(psU4) -
              SafeMath.safeDiv((xU4 * xpU4 + yU4 * ypU4), (nsU4 * nsU4));
        }

        tU4 = tU4 + tuU4;
      }

      let u4TD = this.mf.mod(t0 + tU4, 24.0);
      let u4UT = this.mf.mod(u4TD - dt / 3600.0, 24.0);

      // Koordinat saat kontak U4

      let d1U4 = this.mf.deg(
        Math.atan(
          SafeMath.safeDiv(
            (Math.sin(this.mf.rad(dU4))),
            (Math.cos(this.mf.rad(dU4)) * ba),
          ),
        ),
      );

      let rhU4 = SafeMath.sqrt(
        Math.sin(this.mf.rad(dU4)) * Math.sin(this.mf.rad(dU4)) +
            (Math.cos(this.mf.rad(dU4)) * ba) * (Math.cos(this.mf.rad(dU4)) * ba),
      );

      let yIU4 = SafeMath.safeDiv(yU4, rhU4);
      let mIU4 = SafeMath.sqrt(xU4 * xU4 + yIU4 * yIU4);

      let x1U4 = SafeMath.safeDiv(xU4, mIU4);
      let y2U4 = SafeMath.safeDiv(yIU4, mIU4);

      let pi1U4 = this.mf.deg(SafeMath.asin(y2U4 * Math.cos(this.mf.rad(d1U4))));

      piU4 = this.mf.deg(Math.atan(ab * Math.tan(this.mf.rad(pi1U4))));

      let x2U4 = -y2U4 * Math.sin(this.mf.rad(dU4));

      let haU4 = this.mf.mod(this.mf.deg(Math.atan2(x1U4, x2U4)), 360.0);

      let caU4 = haU4 - muU4 + (0.004178 * dt);

      if (caU4 > 180) {
        ldU4 = caU4 - 360;
      } else if (caU4 < -180) {
        ldU4 = caU4 + 360;
      } else {
        ldU4 = caU4;
      }

      // Azimuth dan Altitude saat kontak U4

      altU4 = this.mf.deg(
        SafeMath.asin(
          Math.sin(this.mf.rad(piU4)) * Math.sin(this.mf.rad(dU4)) +
              Math.cos(this.mf.rad(piU4)) *
                  Math.cos(this.mf.rad(dU4)) *
                  Math.cos(this.mf.rad(haU4)),
        ),
      );

      azmU4 = this.mf.mod(
        this.mf.deg(
              Math.atan2(
                Math.sin(this.mf.rad(haU4)),
                Math.cos(this.mf.rad(haU4)) * Math.sin(this.mf.rad(piU4)) -
                    Math.tan(this.mf.rad(dU4)) * Math.cos(this.mf.rad(piU4)),
              ),
            ) +
            180,
        360.0,
      );

      //Waktu Kontak U4

      jdSolarEclipseU4TD = this.mf.floor(jde2 - 0.5) + 0.5 + u4TD / 24.0;

      jdSolarEclipseU4UT = this.mf.floor(jde2 - 0.5) + 0.5 + u4UT / 24.0;

      // ===============================
      // C1
      // ===============================

      let xC1 = 0.0;
      let yC1 = 0.0;
      let dC1 = 0.0;
      let muC1 = 0.0;
      let xpC1 = 0.0;
      let ypC1 = 0.0;
      let omC1 = 0.0;
      let uC1 = 0.0;
      let vC1 = 0.0;
      let aC1 = 0.0;
      let bC1 = 0.0;
      let n2C1 = 0.0;
      let nsC1 = 0.0;
      let psC1 = 0.0;
      let tuC1 = 0.0;
      let tC1 = 0.0;

      tC1 += tuC1;

      for (let i = 1; i <= 5; i++) {
        xC1 =
            x[0] +
            x[1] * tC1 +
            x[2] * tC1 * tC1 +
            x[3] * tC1 * tC1 * tC1 +
            x[4] * tC1 * tC1 * tC1 * tC1;

        yC1 =
            y[0] +
            y[1] * tC1 +
            y[2] * tC1 * tC1 +
            y[3] * tC1 * tC1 * tC1 +
            y[4] * tC1 * tC1 * tC1 * tC1;

        dC1 =
            d[0] +
            d[1] * tC1 +
            d[2] * tC1 * tC1 +
            d[3] * tC1 * tC1 * tC1 +
            d[4] * tC1 * tC1 * tC1 * tC1;

        muC1 =
            mu[0] +
            mu[1] * tC1 +
            mu[2] * tC1 * tC1 +
            mu[3] * tC1 * tC1 * tC1 +
            mu[4] * tC1 * tC1 * tC1 * tC1;

        xpC1 =
            x[1] +
            2 * x[2] * tC1 +
            3 * x[3] * tC1 * tC1 +
            4 * x[4] * tC1 * tC1 * tC1;

        ypC1 =
            y[1] +
            2 * y[2] * tC1 +
            3 * y[3] * tC1 * tC1 +
            4 * y[4] * tC1 * tC1 * tC1;

        omC1 = SafeMath.safeDiv(
          1.0,
          SafeMath.sqrt(1 - e2 * Math.cos(this.mf.rad(dC1)) * Math.cos(this.mf.rad(dC1))),
        );

        uC1 = xC1;
        vC1 = yC1 * omC1;
        aC1 = xpC1;
        bC1 = ypC1 * omC1;

        n2C1 = aC1 * aC1 + bC1 * bC1;
        nsC1 = SafeMath.sqrt(n2C1);

        psC1 = SafeMath.safeDiv((aC1 * vC1 - uC1 * bC1), nsC1);

        tuC1 =
            -SafeMath.safeDiv(uC1 * aC1 + vC1 * bC1, n2C1) -
            SafeMath.safeDiv(SafeMath.sqrt(1 - psC1 * psC1), nsC1);

        tC1 = tC1 + tuC1;
      }

      let c1TD = this.mf.mod(t0 + tC1, 24.0);
      let c1UT = this.mf.mod(c1TD - dt / 3600.0, 24.0);

      // Koordinat saat kontak C1

      let d1C1 = this.mf.deg(
        Math.atan(
          SafeMath.safeDiv(Math.sin(this.mf.rad(dC1)), (Math.cos(this.mf.rad(dC1)) * ba)),
        ),
      );

      let rhC1 = SafeMath.sqrt(
        Math.sin(this.mf.rad(dC1)) * Math.sin(this.mf.rad(dC1)) +
            (Math.cos(this.mf.rad(dC1)) * ba) * (Math.cos(this.mf.rad(dC1)) * ba),
      );

      let yIC1 = SafeMath.safeDiv(yC1, rhC1);
      let mIC1 = SafeMath.sqrt(xC1 * xC1 + yIC1 * yIC1);

      let x1C1 = SafeMath.safeDiv(xC1, mIC1);
      let y2C1 = SafeMath.safeDiv(yIC1, mIC1);

      let pi1C1 = this.mf.deg(SafeMath.asin(y2C1 * Math.cos(this.mf.rad(d1C1))));

      piC1 = this.mf.deg(Math.atan(ab * Math.tan(this.mf.rad(pi1C1))));

      let x2C1 = -y2C1 * Math.sin(this.mf.rad(dC1));

      let haC1 = this.mf.mod(this.mf.deg(Math.atan2(x1C1, x2C1)), 360.0);

      let caC1 = haC1 - muC1 + (0.004178 * dt);

      if (caC1 > 180) {
        ldC1 = caC1 - 360;
      } else if (caC1 < -180) {
        ldC1 = caC1 + 360;
      } else {
        ldC1 = caC1;
      }

      // Azimuth dan Altitude saat kontak C1

      altC1 = this.mf.deg(
        SafeMath.asin(
          Math.sin(this.mf.rad(piC1)) * Math.sin(this.mf.rad(dC1)) +
              Math.cos(this.mf.rad(piC1)) *
                  Math.cos(this.mf.rad(dC1)) *
                  Math.cos(this.mf.rad(haC1)),
        ),
      );

      azmC1 = this.mf.mod(
        this.mf.deg(
              Math.atan2(
                Math.sin(this.mf.rad(haC1)),
                Math.cos(this.mf.rad(haC1)) * Math.sin(this.mf.rad(piC1)) -
                    Math.tan(this.mf.rad(dC1)) * Math.cos(this.mf.rad(piC1)),
              ),
            ) +
            180,
        360.0,
      );

      //Waktu Kontak C1

      jdSolarEclipseC1TD = this.mf.floor(jde2 - 0.5) + 0.5 + c1TD / 24.0;

      jdSolarEclipseC1UT = this.mf.floor(jde2 - 0.5) + 0.5 + c1UT / 24.0;

      // ===============================
      // C2
      // ===============================

      let xC2 = 0.0;
      let yC2 = 0.0;
      let dC2 = 0.0;
      let muC2 = 0.0;
      let xpC2 = 0.0;
      let ypC2 = 0.0;
      let omC2 = 0.0;
      let uC2 = 0.0;
      let vC2 = 0.0;
      let aC2 = 0.0;
      let bC2 = 0.0;
      let n2C2 = 0.0;
      let nsC2 = 0.0;
      let psC2 = 0.0;
      let tuC2 = 0.0;
      let tC2 = 0.0;

      tC2 += tuC2;

      for (let i = 1; i <= 5; i++) {
        xC2 =
            x[0] +
            x[1] * tC2 +
            x[2] * tC2 * tC2 +
            x[3] * tC2 * tC2 * tC2 +
            x[4] * tC2 * tC2 * tC2 * tC2;

        yC2 =
            y[0] +
            y[1] * tC2 +
            y[2] * tC2 * tC2 +
            y[3] * tC2 * tC2 * tC2 +
            y[4] * tC2 * tC2 * tC2 * tC2;

        dC2 =
            d[0] +
            d[1] * tC2 +
            d[2] * tC2 * tC2 +
            d[3] * tC2 * tC2 * tC2 +
            d[4] * tC2 * tC2 * tC2 * tC2;

        muC2 =
            mu[0] +
            mu[1] * tC2 +
            mu[2] * tC2 * tC2 +
            mu[3] * tC2 * tC2 * tC2 +
            mu[4] * tC2 * tC2 * tC2 * tC2;

        xpC2 =
            x[1] +
            2 * x[2] * tC2 +
            3 * x[3] * tC2 * tC2 +
            4 * x[4] * tC2 * tC2 * tC2;

        ypC2 =
            y[1] +
            2 * y[2] * tC2 +
            3 * y[3] * tC2 * tC2 +
            4 * y[4] * tC2 * tC2 * tC2;

        omC2 = SafeMath.safeDiv(
          1.0,
          SafeMath.sqrt(1 - e2 * Math.cos(this.mf.rad(dC2)) * Math.cos(this.mf.rad(dC2))),
        );

        uC2 = xC2;
        vC2 = yC2 * omC2;
        aC2 = xpC2;
        bC2 = ypC2 * omC2;

        n2C2 = aC2 * aC2 + bC2 * bC2;
        nsC2 = SafeMath.sqrt(n2C2);

        psC2 = SafeMath.safeDiv((aC2 * vC2 - uC2 * bC2), nsC2);

        tuC2 =
            SafeMath.safeDiv(-(uC2 * aC2 + vC2 * bC2), n2C2) +
            SafeMath.sqrt(1 - psC2 * psC2) / nsC2;

        tC2 = tC2 + tuC2;
      }

      let c2TD = this.mf.mod(t0 + tC2, 24.0);
      let c2UT = this.mf.mod(c2TD - dt / 3600.0, 24.0);

      // Koordinat saat kontak C2

      let d1C2 = this.mf.deg(
        Math.atan(
          SafeMath.safeDiv(Math.sin(this.mf.rad(dC2)), (Math.cos(this.mf.rad(dC2)) * ba)),
        ),
      );

      let rhC2 = SafeMath.sqrt(
        Math.sin(this.mf.rad(dC2)) * Math.sin(this.mf.rad(dC2)) +
            (Math.cos(this.mf.rad(dC2)) * ba) * (Math.cos(this.mf.rad(dC2)) * ba),
      );

      let yIC2 = SafeMath.safeDiv(yC2, rhC2);

      let mIC2 = SafeMath.sqrt(xC2 * xC2 + yIC2 * yIC2);

      let x1C2 = SafeMath.safeDiv(xC2, mIC2);
      let y2C2 = SafeMath.safeDiv(yIC2, mIC2);

      let pi1C2 = this.mf.deg(SafeMath.asin(y2C2 * Math.cos(this.mf.rad(d1C2))));

      piC2 = this.mf.deg(Math.atan(ab * Math.tan(this.mf.rad(pi1C2))));

      let x2C2 = -y2C2 * Math.sin(this.mf.rad(dC2));

      let haC2 = this.mf.mod(this.mf.deg(Math.atan2(x1C2, x2C2)), 360.0);

      let caC2 = haC2 - muC2 + (0.004178 * dt);

      if (caC2 > 180) {
        ldC2 = caC2 - 360;
      } else if (caC2 < -180) {
        ldC2 = caC2 + 360;
      } else {
        ldC2 = caC2;
      }

      // Azimuth dan Altitude saat kontak C2

      altC2 = this.mf.deg(
        SafeMath.asin(
          Math.sin(this.mf.rad(piC2)) * Math.sin(this.mf.rad(dC2)) +
              Math.cos(this.mf.rad(piC2)) *
                  Math.cos(this.mf.rad(dC2)) *
                  Math.cos(this.mf.rad(haC2)),
        ),
      );

      azmC2 = this.mf.mod(
        this.mf.deg(
              Math.atan2(
                Math.sin(this.mf.rad(haC2)),
                Math.cos(this.mf.rad(haC2)) * Math.sin(this.mf.rad(piC2)) -
                    Math.tan(this.mf.rad(dC2)) * Math.cos(this.mf.rad(piC2)),
              ),
            ) +
            180,
        360.0,
      );

      //Waktu Kontak C2

      jdSolarEclipseC2TD = this.mf.floor(jde2 - 0.5) + 0.5 + c2TD / 24.0;

      jdSolarEclipseC2UT = this.mf.floor(jde2 - 0.5) + 0.5 + c2UT / 24.0;
    } else {
      // hanya P1 dan P4

      //KONTAK P1 & P4
      //Penumbral First External Contact (P1)

      let xP1 = 0.0;
      let yP1 = 0.0;
      let dP1 = 0.0;
      let muP1 = 0.0;
      let xpP1 = 0.0;
      let ypP1 = 0.0;
      let l1P1 = 0.0;
      let omP1 = 0.0;
      let msP1 = 0.0;
      let y1P1 = 0.0;
      let m1P1 = 0.0;
      let roP1 = 0.0;
      let n2P1 = 0.0;
      let nsP1 = 0.0;
      let psP1 = 0.0;

      let tuP1 = 0.0;
      let tP1 = 0.0;

      tP1 += tuP1;

      for (let i = 1; i <= 5; i++) {
        xP1 =
            x[0] +
            x[1] * tP1 +
            x[2] * tP1 * tP1 +
            x[3] * tP1 * tP1 * tP1 +
            x[4] * tP1 * tP1 * tP1 * tP1;

        yP1 =
            y[0] +
            y[1] * tP1 +
            y[2] * tP1 * tP1 +
            y[3] * tP1 * tP1 * tP1 +
            y[4] * tP1 * tP1 * tP1 * tP1;

        dP1 =
            d[0] +
            d[1] * tP1 +
            d[2] * tP1 * tP1 +
            d[3] * tP1 * tP1 * tP1 +
            d[4] * tP1 * tP1 * tP1 * tP1;

        muP1 =
            mu[0] +
            mu[1] * tP1 +
            mu[2] * tP1 * tP1 +
            mu[3] * tP1 * tP1 * tP1 +
            mu[4] * tP1 * tP1 * tP1 * tP1;

        xpP1 =
            x[1] +
            2 * x[2] * tP1 +
            3 * x[3] * tP1 * tP1 +
            4 * x[4] * tP1 * tP1 * tP1;

        ypP1 =
            y[1] +
            2 * y[2] * tP1 +
            3 * y[3] * tP1 * tP1 +
            4 * y[4] * tP1 * tP1 * tP1;

        l1P1 =
            l1[0] +
            l1[1] * tP1 +
            l1[2] * tP1 * tP1 +
            l1[3] * tP1 * tP1 * tP1 +
            l1[4] * tP1 * tP1 * tP1 * tP1;

        omP1 = SafeMath.safeDiv(
          1.0,
          SafeMath.sqrt(1 - e2 * Math.cos(this.mf.rad(dP1)) * Math.cos(this.mf.rad(dP1))),
        );

        msP1 = SafeMath.sqrt(xP1 * xP1 + yP1 * yP1);

        y1P1 = yP1 * omP1;
        m1P1 = SafeMath.sqrt(xP1 * xP1 + y1P1 * y1P1);
        roP1 = SafeMath.safeDiv(msP1, m1P1);

        n2P1 = xpP1 * xpP1 + ypP1 * ypP1;
        nsP1 = SafeMath.sqrt(n2P1);

        psP1 = SafeMath.asin(
          SafeMath.safeDiv((xP1 * ypP1 - xpP1 * yP1), (nsP1 * (l1P1 + roP1))),
        );

        tuP1 =
            SafeMath.safeDiv((l1P1 + roP1), nsP1) * -Math.cos(psP1) -
            SafeMath.safeDiv((xP1 * xpP1 + yP1 * ypP1), (nsP1 * nsP1));

        tP1 = tP1 + tuP1;
      }

      let p1TD = this.mf.mod(t0 + tP1, 24.0);
      let p1UT = this.mf.mod(p1TD - dt / 3600.0, 24.0);

      // Koordinat saat kontak P1
      let d1P1 = this.mf.deg(
        Math.atan(
          SafeMath.safeDiv(Math.sin(this.mf.rad(dP1)), (Math.cos(this.mf.rad(dP1)) * ba)),
        ),
      );

      let rhP1 = SafeMath.sqrt(
        Math.sin(this.mf.rad(dP1)) * Math.sin(this.mf.rad(dP1)) +
            (Math.cos(this.mf.rad(dP1)) * ba) * (Math.cos(this.mf.rad(dP1)) * ba),
      );

      let yIP1 = SafeMath.safeDiv(yP1, rhP1);
      let mIP1 = SafeMath.sqrt(xP1 * xP1 + yIP1 * yIP1);

      let x1P1 = SafeMath.safeDiv(xP1, mIP1);
      let y2P1 = SafeMath.safeDiv(yIP1, mIP1);

      let pi1P1 = this.mf.deg(SafeMath.asin(y2P1 * Math.cos(this.mf.rad(d1P1))));

      piP1 = this.mf.deg(Math.atan(ab * Math.tan(this.mf.rad(pi1P1))));

      let x2P1 = -y2P1 * Math.sin(this.mf.rad(dP1));

      let haP1 = this.mf.mod(this.mf.deg(Math.atan2(x1P1, x2P1)), 360.0);

      let caP1 = haP1 - muP1 + (0.004178 * dt);

      ldP1;

      if (caP1 > 180) {
        ldP1 = caP1 - 360;
      } else if (caP1 < -180) {
        ldP1 = caP1 + 360;
      } else {
        ldP1 = caP1;
      }

      // Azimuth dan Altitude
      altP1 = this.mf.deg(
        SafeMath.asin(
          Math.sin(this.mf.rad(piP1)) * Math.sin(this.mf.rad(dP1)) +
              Math.cos(this.mf.rad(piP1)) *
                  Math.cos(this.mf.rad(dP1)) *
                  Math.cos(this.mf.rad(haP1)),
        ),
      );

      azmP1 = this.mf.mod(
        this.mf.deg(
              Math.atan2(
                Math.sin(this.mf.rad(haP1)),
                Math.cos(this.mf.rad(haP1)) * Math.sin(this.mf.rad(piP1)) -
                    Math.tan(this.mf.rad(dP1)) * Math.cos(this.mf.rad(piP1)),
              ),
            ) +
            180,
        360.0,
      );

      //Waktu Kontak P1

      jdSolarEclipseP1TD = this.mf.floor(jde2 - 0.5) + 0.5 + p1TD / 24.0;
      jdSolarEclipseP1UT = this.mf.floor(jde2 - 0.5) + 0.5 + p1UT / 24.0;

      // Penumbral Last External Contact (P4)

      let xP4 = 0.0;
      let yP4 = 0.0;
      let dP4 = 0.0;
      let muP4 = 0.0;
      let xpP4 = 0.0;
      let ypP4 = 0.0;
      let l1P4 = 0.0;
      let omP4 = 0.0;
      let msP4 = 0.0;
      let y1P4 = 0.0;
      let m1P4 = 0.0;
      let roP4 = 0.0;
      let n2P4 = 0.0;
      let nsP4 = 0.0;
      let psP4 = 0.0;

      let tuP4 = 0.0;
      let tP4 = 0.0;

      tP4 += tuP4;

      for (let i = 1; i <= 5; i++) {
        xP4 =
            x[0] +
            x[1] * tP4 +
            x[2] * tP4 * tP4 +
            x[3] * tP4 * tP4 * tP4 +
            x[4] * tP4 * tP4 * tP4 * tP4;

        yP4 =
            y[0] +
            y[1] * tP4 +
            y[2] * tP4 * tP4 +
            y[3] * tP4 * tP4 * tP4 +
            y[4] * tP4 * tP4 * tP4 * tP4;

        dP4 =
            d[0] +
            d[1] * tP4 +
            d[2] * tP4 * tP4 +
            d[3] * tP4 * tP4 * tP4 +
            d[4] * tP4 * tP4 * tP4 * tP4;

        muP4 =
            mu[0] +
            mu[1] * tP4 +
            mu[2] * tP4 * tP4 +
            mu[3] * tP4 * tP4 * tP4 +
            mu[4] * tP4 * tP4 * tP4 * tP4;

        xpP4 =
            x[1] +
            2 * x[2] * tP4 +
            3 * x[3] * tP4 * tP4 +
            4 * x[4] * tP4 * tP4 * tP4;

        ypP4 =
            y[1] +
            2 * y[2] * tP4 +
            3 * y[3] * tP4 * tP4 +
            4 * y[4] * tP4 * tP4 * tP4;

        l1P4 =
            l1[0] +
            l1[1] * tP4 +
            l1[2] * tP4 * tP4 +
            l1[3] * tP4 * tP4 * tP4 +
            l1[4] * tP4 * tP4 * tP4 * tP4;

        omP4 = SafeMath.safeDiv(
          1.0,
          SafeMath.sqrt(
            1.0 - e2 * Math.cos(this.mf.rad(dP4)) * Math.cos(this.mf.rad(dP4)),
          ),
        );

        msP4 = SafeMath.sqrt(xP4 * xP4 + yP4 * yP4);

        y1P4 = yP4 * omP4;

        m1P4 = SafeMath.sqrt(xP4 * xP4 + y1P4 * y1P4);

        roP4 = SafeMath.safeDiv(msP4, m1P4);

        n2P4 = xpP4 * xpP4 + ypP4 * ypP4;

        nsP4 = SafeMath.sqrt(n2P4);

        psP4 = SafeMath.asin(
          SafeMath.safeDiv((xP4 * ypP4 - xpP4 * yP4), (nsP4 * (l1P4 + roP4))),
        );

        tuP4 =
            SafeMath.safeDiv((l1P4 + roP4), nsP4) * Math.cos(psP4) -
            SafeMath.safeDiv((xP4 * xpP4 + yP4 * ypP4), (nsP4 * nsP4));

        tP4 = tP4 + tuP4;
      }

      let p4TD = this.mf.mod(t0 + tP4, 24.0);
      let p4UT = this.mf.mod(p4TD - dt / 3600.0, 24.0);

      // Koordinat saat kontak P4

      let d1P4 = this.mf.deg(
        Math.atan(
          SafeMath.safeDiv(Math.sin(this.mf.rad(dP4)), (Math.cos(this.mf.rad(dP4)) * ba)),
        ),
      );

      let rhP4 = SafeMath.sqrt(
        Math.sin(this.mf.rad(dP4)) * Math.sin(this.mf.rad(dP4)) +
            (Math.cos(this.mf.rad(dP4)) * ba) * (Math.cos(this.mf.rad(dP4)) * ba),
      );

      let yIP4 = SafeMath.safeDiv(yP4, rhP4);

      let mIP4 = SafeMath.sqrt(xP4 * xP4 + yIP4 * yIP4);

      let x1P4 = SafeMath.safeDiv(xP4, mIP4);
      let y2P4 = SafeMath.safeDiv(yIP4, mIP4);

      let pi1P4 = this.mf.deg(SafeMath.asin(y2P4 * Math.cos(this.mf.rad(d1P4))));

      piP4 = this.mf.deg(Math.atan(ab * Math.tan(this.mf.rad(pi1P4))));

      let x2P4 = -y2P4 * Math.sin(this.mf.rad(dP4));

      let haP4 = this.mf.mod(this.mf.deg(Math.atan2(x1P4, x2P4)), 360.0);

      let caP4 = haP4 - muP4 + (0.004178 * dt);

      ldP4;

      if (caP4 > 180.0) {
        ldP4 = caP4 - 360.0;
      } else if (caP4 < -180.0) {
        ldP4 = caP4 + 360.0;
      } else {
        ldP4 = caP4;
      }

      // Azimuth dan Altitude saat kontak P4

      altP4 = this.mf.deg(
        SafeMath.asin(
          Math.sin(this.mf.rad(piP4)) * Math.sin(this.mf.rad(dP4)) +
              Math.cos(this.mf.rad(piP4)) *
                  Math.cos(this.mf.rad(dP4)) *
                  Math.cos(this.mf.rad(haP4)),
        ),
      );

      azmP4 = this.mf.mod(
        this.mf.deg(
              Math.atan2(
                Math.sin(this.mf.rad(haP4)),
                Math.cos(this.mf.rad(haP4)) * Math.sin(this.mf.rad(piP4)) -
                    Math.tan(this.mf.rad(dP4)) * Math.cos(this.mf.rad(piP4)),
              ),
            ) +
            180.0,
        360.0,
      );

      //Waktu Kontak P4

      jdSolarEclipseP4TD = this.mf.floor(jde2 - 0.5) + 0.5 + p4TD / 24.0;
      jdSolarEclipseP4UT = this.mf.floor(jde2 - 0.5) + 0.5 + p4UT / 24.0;
    }

    //Durasi keseluruhan Gerhana
    //const dur2 = 0;

    //KESIMPULAN

    const isPartial = jse.toLowerCase().includes('sebagian');

    return new SolarEclipseGlobalResult({
      ada: true,
      keterangan: "Ada gerhana",
      besselian: bessel,

      // === WAKTU TD ===
      p1TD: jdSolarEclipseP1TD,
      u1TD: jdSolarEclipseU1TD,
      c1TD: jdSolarEclipseC1TD,
      u2TD: jdSolarEclipseU2TD,
      p2TD: jdSolarEclipseP2TD,
      mxTD: jdSolarEclipseMxTD,
      p3TD: jdSolarEclipseP3TD,
      u3TD: jdSolarEclipseU3TD,
      c2TD: jdSolarEclipseC2TD,
      u4TD: jdSolarEclipseU4TD,
      p4TD: jdSolarEclipseP4TD,

      // === WAKTU UT ===
      p1UT: jdSolarEclipseP1UT,
      u1UT: jdSolarEclipseU1UT,
      c1UT: jdSolarEclipseC1UT,
      u2UT: jdSolarEclipseU2UT,
      p2UT: jdSolarEclipseP2UT,
      mxUT: jdSolarEclipseMxUT,
      p3UT: jdSolarEclipseP3UT,
      u3UT: jdSolarEclipseU3UT,
      c2UT: jdSolarEclipseC2UT,
      u4UT: jdSolarEclipseU4UT,
      p4UT: jdSolarEclipseP4UT,

      // === LONGITUDE ===
      lonP1: ldP1,
      lonU1: ldU1,
      lonC1: ldC1,
      lonU2: ldU2,
      lonP2: ldP2,
      lonMx: ldMx,
      lonP3: ldP3,
      lonU3: ldU3,
      lonC2: ldC2,
      lonU4: ldU4,
      lonP4: ldP4,

      // === LATITUDE ===
      latP1: piP1,
      latU1: piU1,
      latC1: piC1,
      latU2: piU2,
      latP2: piP2,
      latMx: piMx,
      latP3: piP3,
      latU3: piU3,
      latC2: piC2,
      latU4: piU4,
      latP4: piP4,

      // === AZIMUTH ===
      azmP1: azmP1,
      azmU1: azmU1,
      azmC1: azmC1,
      azmU2: azmU2,
      azmP2: azmP2,
      azmMx: azmMx,
      azmP3: azmP3,
      azmU3: azmU3,
      azmC2: azmC2,
      azmU4: azmU4,
      azmP4: azmP4,

      // === ALTITUDE ===
      altP1: altP1,
      altU1: altU1,
      altC1: altC1,
      altU2: altU2,
      altP2: altP2,
      altMx: altMx,
      altP3: altP3,
      altU3: altU3,
      altC2: altC2,
      altU4: altU4,
      altP4: altP4,

      // === PARAMETER GERHANA ===
      magnitude: mag,
      jenis: jse,
      durasiTotalitas: isPartial ? null : dur,
      lebar: isPartial ? null : wd,

      // === EPHEMERIS (DIPISAH) ===
      sunEphemeris: new EclipseEphemerisBodyGlobal({
        ra: raS / 15,
        dec: dcS,
        sd: sdS,
        hp: hpS,
      }),
      moonEphemeris: new EclipseEphemerisBodyGlobal({
        ra: raM / 15,
        dec: dcM,
        sd: sdM,
        hp: hpM,
      }),
    });
  }

  solarEclipseGlobalRangeHijri({tahunAwalH, tahunAkhirH, timeScale} = {}) {
    const hasil = [];

    for (let thn = tahunAwalH; thn <= tahunAkhirH; thn++) {
      for (let bln = 1; bln <= 12; bln++) {
        const e = this.solarEclipseGlobal({blnH: bln,thnH: thn});

        if (e == null || e.ada != true) continue;

        hasil.push(
          new SolarEclipseGlobalSummary({
            tahunHijri: thn,
            bulanHijri: bln,

            // === WAKTU TD (SELALU dari field TD) ===
            p1TD: e.p1TD,
            u1TD: e.u1TD,
            c1TD: e.c1TD,
            u2TD: e.u2TD,
            p2TD: e.p2TD,
            mxTD: e.mxTD,
            p3TD: e.p3TD,
            u3TD: e.u3TD,
            c2TD: e.c2TD,
            u4TD: e.u4TD,
            p4TD: e.p4TD,

            // === WAKTU UT (SELALU dari field UT) ===
            p1UT: e.p1UT,
            u1UT: e.u1UT,
            c1UT: e.c1UT,
            u2UT: e.u2UT,
            p2UT: e.p2UT,
            mxUT: e.mxUT,
            p3UT: e.p3UT,
            u3UT: e.u3UT,
            c2UT: e.c2UT,
            u4UT: e.u4UT,
            p4UT: e.p4UT,

            // === LONGITUDE & LATITUDE ===
            lonP1: e.lonP1,
            lonU1: e.lonU1,
            lonC1: e.lonC1,
            lonU2: e.lonU2,
            lonP2: e.lonP2,
            lonMx: e.lonMx,
            lonP3: e.lonP3,
            lonU3: e.lonU3,
            lonC2: e.lonC2,
            lonU4: e.lonU4,
            lonP4: e.lonP4,

            latP1: e.latP1,
            latU1: e.latU1,
            latC1: e.latC1,
            latU2: e.latU2,
            latP2: e.latP2,
            latMx: e.latMx,
            latP3: e.latP3,
            latU3: e.latU3,
            latC2: e.latC2,
            latU4: e.latU4,
            latP4: e.latP4,

            // === AZIMUTH & ALTITUDE ===
            azmP1: e.azmP1,
            azmU1: e.azmU1,
            azmC1: e.azmC1,
            azmU2: e.azmU2,
            azmP2: e.azmP2,
            azmMx: e.azmMx,
            azmP3: e.azmP3,
            azmU3: e.azmU3,
            azmC2: e.azmC2,
            azmU4: e.azmU4,
            azmP4: e.azmP4,

            altP1: e.altP1,
            altU1: e.altU1,
            altC1: e.altC1,
            altU2: e.altU2,
            altP2: e.altP2,
            altMx: e.altMx,
            altP3: e.altP3,
            altU3: e.altU3,
            altC2: e.altC2,
            altU4: e.altU4,
            altP4: e.altP4,

            // === PARAMETER & LAINNYA ===
            jenis: e.jenis ?? "",
            magnitude: e.magnitude,
            durasiTotalitas: e.durasiTotalitas,
            lebar: e.lebar,
            besselian: e.besselian,
            sunEphemeris: e.sunEphemeris,
            moonEphemeris: e.moonEphemeris,
          }),
        );
      }
    }

    return hasil;
  }

  solarEclipseLocalRangeHijri({tahunAwalH, tahunAkhirH, gLon, gLat, elev, pres, temp, tmZn, timeScale} = {}) {
    const hasil = [];

    for (let thn = tahunAwalH; thn <= tahunAkhirH; thn++) {
      for (let bln = 1; bln <= 12; bln++) {
        const e = this.solarEclipseLocal({blnH: bln,thnH: thn,gLon: gLon,gLat: gLat,elev: elev,pres: pres,temp: temp,tmZn: tmZn});

        if (e == null || e.ada != true) continue;

        // === WAKTU TD (langsung dari field baru) ===
        const u1TD = e.u1TD;
        const u2TD = e.u2TD;
        const mxTD = e.mxTD;
        const u3TD = e.u3TD;
        const u4TD = e.u4TD;

        // === WAKTU UT (langsung dari field baru) ===
        const u1UT = e.u1UT;
        const u2UT = e.u2UT;
        const mxUT = e.mxUT;
        const u3UT = e.u3UT;
        const u4UT = e.u4UT;

        // === ALTITUDE & AZIMUTH ===
        const altU1 = e.altU1;
        const altU2 = e.altU2;
        const altMx = e.altMx;
        const altU3 = e.altU3;
        const altU4 = e.altU4;

        const azmU1 = e.azmU1;
        const azmU2 = e.azmU2;
        const azmMx = e.azmMx;
        const azmU3 = e.azmU3;
        const azmU4 = e.azmU4;

        // === EPHEMERIS (langsung dari field terpisah) ===
        const sunEphe = e.sunEphemeris;
        const moonEphe = e.moonEphemeris;

        // === PARAMETER ===
        const jenis = e.jenis;
        const magnitude = e.magnitude;
        const obscuration = e.obscuration;
        const durasiTotal = e.durasiTotalitas;
        const durasiGerhana = e.durasiGerhana;
        const besselian = e.besselian;

        // === TAMBAHKAN KE LIST HASIL ===
        hasil.push(
          new SolarEclipseLocalSummary({
            tahunHijri: thn,
            bulanHijri: bln,

            // Waktu TD
            u1TD: u1TD,
            u2TD: u2TD,
            mxTD: mxTD,
            u3TD: u3TD,
            u4TD: u4TD,

            // Waktu UT
            u1UT: u1UT,
            u2UT: u2UT,
            mxUT: mxUT,
            u3UT: u3UT,
            u4UT: u4UT,

            // Altitude & Azimuth
            altU1: altU1,
            altU2: altU2,
            altMx: altMx,
            altU3: altU3,
            altU4: altU4,
            azmU1: azmU1,
            azmU2: azmU2,
            azmMx: azmMx,
            azmU3: azmU3,
            azmU4: azmU4,

            // Parameter
            magnitude: magnitude,
            obscuration: obscuration,
            durasiTotalitas: durasiTotal,
            durasiGerhana: durasiGerhana,

            // Ephemeris & Besselian
            sunEphemeris: sunEphe,
            moonEphemeris: moonEphe,
            besselian: besselian,

            jenis: jenis,
          }),
        );
      }
    }

    return hasil;
  }
}
