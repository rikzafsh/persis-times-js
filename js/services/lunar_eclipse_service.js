/**
 * lunar_eclipse_service.js — Gerhana Bulan: elemen Besselian, kontak P1–P4/U1–U4, magnitudo, global dan lokal, rentang tahun Hijriah.
 * Sumber Dart: service/lunar_eclipse_service.dart
 * Kelas: LunarEclipseService
 * Fungsi: lBesselian, lunarEclipseLocal, lunarEclipseGlobal, lunarEclipseGlobalRangeHijri, lunarEclipseLocalRangeHijri
 */
class LunarEclipseService {
  julDay = new JulianDay();
  dyTme = new DynamicalTime();

  sn = new SunFunction();
  mf = new MathFunction();
  mo = new MoonFunction();

  lBesselian(blnH, thnH) {
    const jdEclipse1 = this.mo.jdeEclipseModified(blnH, thnH, 2);
    if (jdEclipse1 <= 0) return null;

    const jdEclipse2 =
        this.mf.floor(jdEclipse1) +
        (Math.round(((jdEclipse1 - this.mf.floor(jdEclipse1)) * 24)) / 24.0);

    const t0 = this.mf.mod(
      Math.round((((jdEclipse2 + 0.5) - this.mf.floor(jdEclipse2 + 0.5)) * 24)),
      24.0,
    );

    const dT = this.dyTme.deltaT(jdEclipse2);

    // ---------------- Data Matahari ----------------
    const aRsM2 = this.sn.sunGeocentricRightAscension(jdEclipse2 - 2 / 24, 0);
    const aRsM1 = this.sn.sunGeocentricRightAscension(jdEclipse2 - 1 / 24, 0);
    const aRs00 = this.sn.sunGeocentricRightAscension(jdEclipse2, 0);
    const aRsP1 = this.sn.sunGeocentricRightAscension(jdEclipse2 + 1 / 24, 0);
    const aRsP2 = this.sn.sunGeocentricRightAscension(jdEclipse2 + 2 / 24, 0);

    const dsM2 = this.sn.sunGeocentricDeclination(jdEclipse2 - 2 / 24, 0);
    const dsM1 = this.sn.sunGeocentricDeclination(jdEclipse2 - 1 / 24, 0);
    const ds00 = this.sn.sunGeocentricDeclination(jdEclipse2, 0);
    const dsP1 = this.sn.sunGeocentricDeclination(jdEclipse2 + 1 / 24, 0);
    const dsP2 = this.sn.sunGeocentricDeclination(jdEclipse2 + 2 / 24, 0);

    const ssM2 = this.sn.sunGeocentricSemidiameter(jdEclipse2 - 2 / 24, 0);
    const ssM1 = this.sn.sunGeocentricSemidiameter(jdEclipse2 - 1 / 24, 0);
    const ss00 = this.sn.sunGeocentricSemidiameter(jdEclipse2, 0);
    const ssP1 = this.sn.sunGeocentricSemidiameter(jdEclipse2 + 1 / 24, 0);
    const ssP2 = this.sn.sunGeocentricSemidiameter(jdEclipse2 + 2 / 24, 0);

    const hpsM2 = this.sn.sunEquatorialHorizontalParallax(jdEclipse2 - 2 / 24, 0);
    const hpsM1 = this.sn.sunEquatorialHorizontalParallax(jdEclipse2 - 1 / 24, 0);
    const hps00 = this.sn.sunEquatorialHorizontalParallax(jdEclipse2, 0);
    const hpsP1 = this.sn.sunEquatorialHorizontalParallax(jdEclipse2 + 1 / 24, 0);
    const hpsP2 = this.sn.sunEquatorialHorizontalParallax(jdEclipse2 + 2 / 24, 0);

    // ---------------- Data Bulan ----------------
    const aRmM2 = this.mo.moonGeocentricRightAscension(jdEclipse2 - 2 / 24, 0);
    const aRmM1 = this.mo.moonGeocentricRightAscension(jdEclipse2 - 1 / 24, 0);
    const aRm00 = this.mo.moonGeocentricRightAscension(jdEclipse2, 0);
    const aRmP1 = this.mo.moonGeocentricRightAscension(jdEclipse2 + 1 / 24, 0);
    const aRmP2 = this.mo.moonGeocentricRightAscension(jdEclipse2 + 2 / 24, 0);

    const dmM2 = this.mo.moonGeocentricDeclination(jdEclipse2 - 2 / 24, 0);
    const dmM1 = this.mo.moonGeocentricDeclination(jdEclipse2 - 1 / 24, 0);
    const dm00 = this.mo.moonGeocentricDeclination(jdEclipse2, 0);
    const dmP1 = this.mo.moonGeocentricDeclination(jdEclipse2 + 1 / 24, 0);
    const dmP2 = this.mo.moonGeocentricDeclination(jdEclipse2 + 2 / 24, 0);

    const smM2 = this.mo.moonGeocentricSemidiameter(jdEclipse2 - 2 / 24, 0);
    const smM1 = this.mo.moonGeocentricSemidiameter(jdEclipse2 - 1 / 24, 0);
    const sm00 = this.mo.moonGeocentricSemidiameter(jdEclipse2, 0);
    const smP1 = this.mo.moonGeocentricSemidiameter(jdEclipse2 + 1 / 24, 0);
    const smP2 = this.mo.moonGeocentricSemidiameter(jdEclipse2 + 2 / 24, 0);

    const muM2 = this.mo.moonGeocentricGreenwichHourAngle(jdEclipse2 - 2 / 24, 0);
    const muM1 = this.mo.moonGeocentricGreenwichHourAngle(jdEclipse2 - 1 / 24, 0);
    const mu00 = this.mo.moonGeocentricGreenwichHourAngle(jdEclipse2, 0);
    const muP1 = this.mo.moonGeocentricGreenwichHourAngle(jdEclipse2 + 1 / 24, 0);
    const muP2 = this.mo.moonGeocentricGreenwichHourAngle(jdEclipse2 + 2 / 24, 0);

    const hpmM2 = (this.mo.moonEquatorialHorizontalParallax(jdEclipse2 - 2 / 24, 0));
    const hpmM1 = (this.mo.moonEquatorialHorizontalParallax(jdEclipse2 - 1 / 24, 0));
    const hpm00 = (this.mo.moonEquatorialHorizontalParallax(jdEclipse2, 0));
    const hpmP1 = (this.mo.moonEquatorialHorizontalParallax(jdEclipse2 + 1 / 24, 0));
    const hpmP2 = (this.mo.moonEquatorialHorizontalParallax(jdEclipse2 + 2 / 24, 0));

    // -----Transformasi Equatorial ke Rektangular/Kartesius 3d: (x,y,z)-----
    const aM2 = this.mf.mod(aRsM2 + 180, 360);
    const aM1 = this.mf.mod(aRsM1 + 180, 360);
    const a00 = this.mf.mod(aRs00 + 180, 360);
    const aP1 = this.mf.mod(aRsP1 + 180, 360);
    const aP2 = this.mf.mod(aRsP2 + 180, 360);

    const dM2 = -dsM2;
    const dM1 = -dsM1;
    const d00 = -ds00;
    const dP1 = -dsP1;
    const dP2 = -dsP2;

    const e = (aRm, a, d) => { return 0.25 * (aRm - a) * Math.sin(this.mf.rad(2 * d)) * Math.sin(this.mf.rad(aRm - a)); }

    const eM2 = e(aRmM2, aM2, dM2);
    const eM1 = e(aRmM1, aM1, dM1);
    const e00 = e(aRm00, a00, d00);
    const eP1 = e(aRmP1, aP1, dP1);
    const eP2 = e(aRmP2, aP2, dP2);

    const f1 = (hpm, hps, ss) => { return 1.01 * hpm + hps + ss; }
    const f2 = (hpm, hps, ss) => { return 1.01 * hpm + hps - ss; }

    const f1M2 = f1(hpmM2, hpsM2, ssM2);
    const f1M1 = f1(hpmM1, hpsM1, ssM1);
    const f100 = f1(hpm00, hps00, ss00);
    const f1P1 = f1(hpmP1, hpsP1, ssP1);
    const f1P2 = f1(hpmP2, hpsP2, ssP2);

    const f2M2 = f2(hpmM2, hpsM2, ssM2);
    const f2M1 = f2(hpmM1, hpsM1, ssM1);
    const f200 = f2(hpm00, hps00, ss00);
    const f2P1 = f2(hpmP1, hpsP1, ssP1);
    const f2P2 = f2(hpmP2, hpsP2, ssP2);

    const x = (aRm, a, dm) => { return (aRm - a) * Math.cos(this.mf.rad(dm)); }

    const y = (dm, d, e) => { return dm - d + e; }

    const xM2 = x(aRmM2, aM2, dmM2);
    const xM1 = x(aRmM1, aM1, dmM1);
    const x00 = x(aRm00, a00, dm00);
    const xP1 = x(aRmP1, aP1, dmP1);
    const xP2 = x(aRmP2, aP2, dmP2);

    const yM2 = y(dmM2, dM2, eM2);
    const yM1 = y(dmM1, dM1, eM1);
    const y00 = y(dm00, d00, e00);
    const yP1 = y(dmP1, dP1, eP1);
    const yP2 = y(dmP2, dP2, eP2);

    return new LunarBesselianResult({
      jde: jdEclipse2,
      deltaT: dT,
      t0: t0,

      x: [
        this.mf.interp5(xM2, xM1, x00, xP1, xP2, 0),
        this.mf.interp5(xM2, xM1, x00, xP1, xP2, 1),
        this.mf.interp5(xM2, xM1, x00, xP1, xP2, 2),
        this.mf.interp5(xM2, xM1, x00, xP1, xP2, 3),
        this.mf.interp5(xM2, xM1, x00, xP1, xP2, 4),
      ],

      y: [
        this.mf.interp5(yM2, yM1, y00, yP1, yP2, 0),
        this.mf.interp5(yM2, yM1, y00, yP1, yP2, 1),
        this.mf.interp5(yM2, yM1, y00, yP1, yP2, 2),
        this.mf.interp5(yM2, yM1, y00, yP1, yP2, 3),
        this.mf.interp5(yM2, yM1, y00, yP1, yP2, 4),
      ],

      f1: [
        this.mf.interp5(f1M2, f1M1, f100, f1P1, f1P2, 0),
        this.mf.interp5(f1M2, f1M1, f100, f1P1, f1P2, 1),
        this.mf.interp5(f1M2, f1M1, f100, f1P1, f1P2, 2),
        this.mf.interp5(f1M2, f1M1, f100, f1P1, f1P2, 3),
        this.mf.interp5(f1M2, f1M1, f100, f1P1, f1P2, 4),
      ],

      f2: [
        this.mf.interp5(f2M2, f2M1, f200, f2P1, f2P2, 0),
        this.mf.interp5(f2M2, f2M1, f200, f2P1, f2P2, 1),
        this.mf.interp5(f2M2, f2M1, f200, f2P1, f2P2, 2),
        this.mf.interp5(f2M2, f2M1, f200, f2P1, f2P2, 3),
        this.mf.interp5(f2M2, f2M1, f200, f2P1, f2P2, 4),
      ],

      sm: [
        this.mf.interp5(smM2, smM1, sm00, smP1, smP2, 0),
        this.mf.interp5(smM2, smM1, sm00, smP1, smP2, 1),
        this.mf.interp5(smM2, smM1, sm00, smP1, smP2, 2),
        this.mf.interp5(smM2, smM1, sm00, smP1, smP2, 3),
        this.mf.interp5(smM2, smM1, sm00, smP1, smP2, 4),
      ],

      mu: [
        this.mf.interp5(muM2, muM1, mu00, muP1, muP2, 0),
        this.mf.interp5(muM2, muM1, mu00, muP1, muP2, 1),
        this.mf.interp5(muM2, muM1, mu00, muP1, muP2, 2),
        this.mf.interp5(muM2, muM1, mu00, muP1, muP2, 3),
        this.mf.interp5(muM2, muM1, mu00, muP1, muP2, 4),
      ],

      hp: [
        this.mf.interp5(hpmM2, hpmM1, hpm00, hpmP1, hpmP2, 0),
        this.mf.interp5(hpmM2, hpmM1, hpm00, hpmP1, hpmP2, 1),
        this.mf.interp5(hpmM2, hpmM1, hpm00, hpmP1, hpmP2, 2),
        this.mf.interp5(hpmM2, hpmM1, hpm00, hpmP1, hpmP2, 3),
        this.mf.interp5(hpmM2, hpmM1, hpm00, hpmP1, hpmP2, 4),
      ],

      d: [
        this.mf.interp5(dM2, dM1, d00, dP1, dP2, 0),
        this.mf.interp5(dM2, dM1, d00, dP1, dP2, 1),
        this.mf.interp5(dM2, dM1, d00, dP1, dP2, 2),
        this.mf.interp5(dM2, dM1, d00, dP1, dP2, 3),
        this.mf.interp5(dM2, dM1, d00, dP1, dP2, 4),
      ],

      dm: [
        this.mf.interp5(dmM2, dmM1, dm00, dmP1, dmP2, 0),
        this.mf.interp5(dmM2, dmM1, dm00, dmP1, dmP2, 1),
        this.mf.interp5(dmM2, dmM1, dm00, dmP1, dmP2, 2),
        this.mf.interp5(dmM2, dmM1, dm00, dmP1, dmP2, 3),
        this.mf.interp5(dmM2, dmM1, dm00, dmP1, dmP2, 4),
      ],
    });
  }

  lunarEclipseLocal({blnH, thnH, gLon, gLat, elev, pres, temp, tmZn} = {}) {
    const bessel = this.lBesselian(blnH, thnH);
    if (bessel == null || !bessel.isValid) return null;

    const dt = bessel.deltaT;
    const jdE2 = bessel.jde;
    const t0 = bessel.t0;

    const x = bessel.x;
    const y = bessel.y;
    const f1c = bessel.f1;
    const f2c = bessel.f2;
    const smc = bessel.sm;

    let t = 0.0;
    let tx = 0.0;

    let xVal, yVal, xDer, yDer, f1, f2, sm;

    // =====================================
    // ITERASI TENGAH GERHANA
    // =====================================

    for (let i = 0; i < 3; i++) {
      t += tx;

      const t2 = t * t;
      const t3 = t2 * t;
      const t4 = t2 * t2;

      xVal = x[0] + x[1] * t + x[2] * t2 + x[3] * t3 + x[4] * t4;
      yVal = y[0] + y[1] * t + y[2] * t2 + y[3] * t3 + y[4] * t4;

      xDer = x[1] + 2 * x[2] * t + 3 * x[3] * t2 + 4 * x[4] * t3;
      yDer = y[1] + 2 * y[2] * t + 3 * y[3] * t2 + 4 * y[4] * t3;

      f1 = f1c[0] + f1c[1] * t + f1c[2] * t2 + f1c[3] * t3 + f1c[4] * t4;
      f2 = f2c[0] + f2c[1] * t + f2c[2] * t2 + f2c[3] * t3 + f2c[4] * t4;
      sm = smc[0] + smc[1] * t + smc[2] * t2 + smc[3] * t3 + smc[4] * t4;

      const n2 = xDer * xDer + yDer * yDer;
      if (n2 == 0.0) return null;

      tx = -(xVal * xDer + yVal * yDer) / n2;
    }

    if (xVal == null ||
        yVal == null ||
        xDer == null ||
        yDer == null ||
        f1 == null ||
        f2 == null ||
        sm == null) {
      return null;
    }

    const n = Math.sqrt(xDer * xDer + yDer * yDer);
    if (n == 0.0) return null;

    const d = Math.sqrt(xVal * xVal + yVal * yVal);

    const l1 = f1 + sm;
    const l2 = f2 + sm;
    const l3 = f2 - sm;

    const testP = l1 * l1 - d * d;
    if (testP <= 0) return null;

    const testU = l2 * l2 - d * d;
    const testT = l3 * l3 - d * d;

    const hasUmbral = testU > 0;
    const hasTotal = testT > 0;

    const tm1 = testP > 0 ? Math.sqrt(testP) / n : null;
    const tm2 = hasUmbral ? Math.sqrt(testU) / n : null;
    const tm3 = hasTotal ? Math.sqrt(testT) / n : null;

    // =====================================
    // KONVERSI JD
    // =====================================

    const jdBase = this.mf.floor(jdE2 + 0.5) - 0.5;
    const mx = jdBase + ((t0 + t) / 24) - dt / 86400;

    let p1, p4, u1, u2, u3, u4;

    if (tm1 != null) {
      p1 = jdBase + ((t0 + t - tm1) / 24) - dt / 86400;
      p4 = jdBase + ((t0 + t + tm1) / 24) - dt / 86400;
    }

    if (tm2 != null) {
      u1 = jdBase + ((t0 + t - tm2) / 24) - dt / 86400;
      u4 = jdBase + ((t0 + t + tm2) / 24) - dt / 86400;
    }

    if (tm3 != null) {
      u2 = jdBase + ((t0 + t - tm3) / 24) - dt / 86400;
      u3 = jdBase + ((t0 + t + tm3) / 24) - dt / 86400;
    }

    // =====================================
    // DURASI
    // =====================================

    const durP = tm1 != null ? 2 * tm1 : null;
    const durU = tm2 != null ? 2 * tm2 : null;
    const durT = tm3 != null ? 2 * tm3 : null;

    // =====================================
    // MAGNITUDE
    // =====================================

    const magPen = (l1 - d) / (2 * sm);
    const magUmb = hasUmbral ? (l2 - d) / (2 * sm) : null;

    const radPen = l1 - sm;
    const radUmb = hasUmbral ? (l2 - sm) : null;

    const jenis = hasTotal
        ? "GERHANA BULAN TOTAL"
        : hasUmbral
        ? "GERHANA BULAN SEBAGIAN"
        : "GERHANA BULAN PENUMBRAL";

    const mo = new MoonFunction();
    const sn = new SunFunction();

    // =====================================
    // AZIMUTH & ALTITUDE (pakai pres & temp)
    // =====================================

    const alt = (jd) => { return jd == null
        ? null
        : mo.moonTopocentricAltitude(
            jd,
            dt,
            gLon,
            gLat,
            elev,
            pres,
            temp,
            'htoc',
          ); }

    const az = (jd) => { return jd == null ? null : mo.moonTopocentricAzimuth(jd, dt, gLon, gLat, elev); }

    const azmP1 = az(p1);
    const azmU1 = az(u1);
    const azmU2 = az(u2);
    const azmMax = az(mx);
    const azmU3 = az(u3);
    const azmU4 = az(u4);
    const azmP4 = az(p4);

    const altP1 = alt(p1);
    const altU1 = alt(u1);
    const altU2 = alt(u2);
    const altMax = alt(mx);
    const altU3 = alt(u3);
    const altU4 = alt(u4);
    const altP4 = alt(p4);

    // =====================================
    // DATA EPHEMERIS SAAT PUNCAK
    // =====================================

    const safe = (v) => {
      if (v == null) return null;
      if (Number.isNaN(v) || (Math.abs(v)===Infinity)) return null;
      return v;
    }

    let sunData ;
    let moonData ;

    if (mx.isFinite) {
      const raS = safe(sn.sunGeocentricRightAscension(mx, 0));
      const dcS = safe(sn.sunGeocentricDeclination(mx, 0));
      const sdS = safe(sn.sunGeocentricSemidiameter(mx, 0));
      const hpS = safe(sn.sunEquatorialHorizontalParallax(mx, 0));

      const raM = safe(mo.moonGeocentricRightAscension(mx, 0));
      const dcM = safe(mo.moonGeocentricDeclination(mx, 0));
      const sdM = safe(mo.moonGeocentricSemidiameter(mx, 0));
      const hpM = safe(mo.moonEquatorialHorizontalParallax(mx, 0));

      sunData = new EclipseEphemerisBody({
        ra: raS != null ? raS / 15.0 : null, // konversi ke jam
        dec: dcS,
        sd: sdS,
        hp: hpS,
      });

      moonData = new EclipseEphemerisBody({
        ra: raM != null ? raM / 15.0 : null, // konversi ke jam
        dec: dcM,
        sd: sdM,
        hp: hpM,
      });
    }

    // =====================================
    // RETURN
    // =====================================

    return new LunarEclipseLocalResult({
      isValid: true,
      ada: true,

      p1: p1,
      u1: u1,
      u2: u2,
      mx: mx,
      u3: u3,
      u4: u4,
      p4: p4,

      azmP1: azmP1,
      azmU1: azmU1,
      azmU2: azmU2,
      azmMx: azmMax,
      azmU3: azmU3,
      azmU4: azmU4,
      azmP4: azmP4,

      altP1: altP1,
      altU1: altU1,
      altU2: altU2,
      altMx: altMax,
      altU3: altU3,
      altU4: altU4,
      altP4: altP4,

      durasiPenumbral: durP,
      durasiUmbral: durU,
      durasiTotal: durT,
      magnitudePenumbral: magPen,
      magnitudeUmbral: magUmb,
      radiusPenumbral: radPen,
      radiusUmbral: radUmb,

      sun: sunData,
      moon: moonData,

      besselian: bessel,
      deltaT: dt,

      jenis: jenis,
    });
  }

  lunarEclipseGlobal({blnH, thnH} = {}) {
    const bessel = this.lBesselian(blnH, thnH);
    if (bessel == null || !bessel.isValid) return null;

    const dt = bessel.deltaT;
    const jdE2 = bessel.jde;
    const t0 = bessel.t0;

    const x = bessel.x;
    const y = bessel.y;
    const f1c = bessel.f1;
    const f2c = bessel.f2;
    const smc = bessel.sm;

    let t = 0.0;
    let tx = 0.0;

    let xVal, yVal, xDer, yDer, f1, f2, sm;

    // =====================================
    // ITERASI TENGAH GERHANA
    // =====================================

    for (let i = 0; i < 3; i++) {
      t += tx;

      const t2 = t * t;
      const t3 = t2 * t;
      const t4 = t2 * t2;

      xVal = x[0] + x[1] * t + x[2] * t2 + x[3] * t3 + x[4] * t4;
      yVal = y[0] + y[1] * t + y[2] * t2 + y[3] * t3 + y[4] * t4;

      xDer = x[1] + 2 * x[2] * t + 3 * x[3] * t2 + 4 * x[4] * t3;
      yDer = y[1] + 2 * y[2] * t + 3 * y[3] * t2 + 4 * y[4] * t3;

      f1 = f1c[0] + f1c[1] * t + f1c[2] * t2 + f1c[3] * t3 + f1c[4] * t4;
      f2 = f2c[0] + f2c[1] * t + f2c[2] * t2 + f2c[3] * t3 + f2c[4] * t4;
      sm = smc[0] + smc[1] * t + smc[2] * t2 + smc[3] * t3 + smc[4] * t4;

      const n2 = xDer * xDer + yDer * yDer;
      if (n2 == 0.0) return null;

      tx = -(xVal * xDer + yVal * yDer) / n2;
    }

    if (xVal == null ||
        yVal == null ||
        xDer == null ||
        yDer == null ||
        f1 == null ||
        f2 == null ||
        sm == null) {
      return null;
    }

    const n = Math.sqrt(xDer * xDer + yDer * yDer);
    if (n == 0.0) return null;

    const d = Math.sqrt(xVal * xVal + yVal * yVal);

    const l1 = f1 + sm;
    const l2 = f2 + sm;
    const l3 = f2 - sm;

    const testP = l1 * l1 - d * d;
    if (testP <= 0) return null;

    const testU = l2 * l2 - d * d;
    const testT = l3 * l3 - d * d;

    const hasUmbral = testU > 0;
    const hasTotal = testT > 0;

    const tm1 = testP > 0 ? Math.sqrt(testP) / n : null;
    const tm2 = hasUmbral ? Math.sqrt(testU) / n : null;
    const tm3 = hasTotal ? Math.sqrt(testT) / n : null;

    // =====================================
    // KONVERSI JD
    // =====================================

    const jdBase = this.mf.floor(jdE2 + 0.5) - 0.5;
    const mx = jdBase + ((t0 + t) / 24) - dt / 86400;

    let p1, p4, u1, u2, u3, u4;

    if (tm1 != null) {
      p1 = jdBase + ((t0 + t - tm1) / 24) - dt / 86400;
      p4 = jdBase + ((t0 + t + tm1) / 24) - dt / 86400;
    }

    if (tm2 != null) {
      u1 = jdBase + ((t0 + t - tm2) / 24) - dt / 86400;
      u4 = jdBase + ((t0 + t + tm2) / 24) - dt / 86400;
    }

    if (tm3 != null) {
      u2 = jdBase + ((t0 + t - tm3) / 24) - dt / 86400;
      u3 = jdBase + ((t0 + t + tm3) / 24) - dt / 86400;
    }

    // =====================================
    // DURASI
    // =====================================

    const durP = tm1 != null ? 2 * tm1 : null;
    const durU = tm2 != null ? 2 * tm2 : null;
    const durT = tm3 != null ? 2 * tm3 : null;

    // =====================================
    // MAGNITUDE
    // =====================================

    const magPen = (l1 - d) / (2 * sm);
    const magUmb = hasUmbral ? (l2 - d) / (2 * sm) : null;

    const radPen = l1 - sm;
    const radUmb = hasUmbral ? (l2 - sm) : null;

    let jenis;

    if (hasTotal) {
      jenis = "GERHANA BULAN TOTAL";
    } else if (hasUmbral) {
      jenis = "GERHANA BULAN SEBAGIAN";
    } else {
      jenis = "GERHANA BULAN PENUMBRAL";
    }

    // =====================================
    // DATA EPHEMERIS SAAT PUNCAK
    // =====================================

    const safe = (v) => {
      if (v == null) return null;
      if (Number.isNaN(v) || (Math.abs(v)===Infinity)) return null;
      return v;
    }

    let sunData ;
    let moonData ;

    if (mx.isFinite) {
      const raS = safe(this.sn.sunGeocentricRightAscension(mx, 0));
      const dcS = safe(this.sn.sunGeocentricDeclination(mx, 0));
      const sdS = safe(this.sn.sunGeocentricSemidiameter(mx, 0));
      const hpS = safe(this.sn.sunEquatorialHorizontalParallax(mx, 0));

      const raM = safe(this.mo.moonGeocentricRightAscension(mx, 0));
      const dcM = safe(this.mo.moonGeocentricDeclination(mx, 0));
      const sdM = safe(this.mo.moonGeocentricSemidiameter(mx, 0));
      const hpM = safe(this.mo.moonEquatorialHorizontalParallax(mx, 0));

      sunData = new EclipseEphemerisBody({
        ra: raS != null ? raS / 15.0 : null, // konversi ke jam
        dec: dcS,
        sd: sdS,
        hp: hpS,
      });

      moonData = new EclipseEphemerisBody({
        ra: raM != null ? raM / 15.0 : null, // konversi ke jam
        dec: dcM,
        sd: sdM,
        hp: hpM,
      });
    }

    // =====================================
    // RETURN
    // =====================================

    return new LunarEclipseGlobalResult({
      isValid: true,

      p1: p1,
      u1: u1,
      u2: u2,
      mx: mx,
      u3: u3,
      u4: u4,
      p4: p4,

      durasiPenumbral: durP,
      durasiUmbral: durU,
      durasiTotal: durT,
      magnitudePenumbral: magPen,
      magnitudeUmbral: magUmb,
      radiusPenumbral: radPen,
      radiusUmbral: radUmb,

      besselian: bessel,

      sun: sunData,
      moon: moonData,

      jenis: jenis,
    });
  }

  //HISAB GERHANA BULAN GLOBAL PER RENTANG TAHUN

  lunarEclipseGlobalRangeHijri({tahunAwalH, tahunAkhirH} = {}) {
    const hasil = [];

    for (let thn = tahunAwalH; thn <= tahunAkhirH; thn++) {
      for (let bln = 1; bln <= 12; bln++) {
        const eclipse = this.lunarEclipseGlobal({blnH: bln,thnH: thn});

        if (eclipse == null || eclipse.isValid != true) continue;

        hasil.push(
          new LunarEclipseGlobalSummary({
            tahunHijri: thn,
            bulanHijri: bln,
            p1: eclipse.p1,
            u1: eclipse.u1,
            u2: eclipse.u2,
            mx: eclipse.mx,
            u3: eclipse.u3,
            u4: eclipse.u4,
            p4: eclipse.p4,

            durasiUmbral: eclipse.durasiUmbral,
            durasiPenumbral: eclipse.durasiPenumbral,
            durasiTotal: eclipse.durasiTotal,

            besselian: eclipse.besselian,

            sun: eclipse.sun,
            moon: eclipse.moon,

            jenis: eclipse.jenis,
          }),
        );
      }
    }

    return hasil;
  }

  //GERHANA BULAN LOKAL PER RENTANG TAHUN

  lunarEclipseLocalRangeHijri({tahunAwalH, tahunAkhirH, gLon, gLat, elev, pres, temp, tmZn, timeScale} = {}) {
    const hasil = [];

    for (let thn = tahunAwalH; thn <= tahunAkhirH; thn++) {
      for (let bln = 1; bln <= 12; bln++) {
        const eclipse = this.lunarEclipseLocal({blnH: bln,thnH: thn,gLon: gLon,gLat: gLat,elev: elev,pres: pres,temp: temp,tmZn: tmZn});

        if (eclipse == null || eclipse.ada != true) continue;

        // ============================
        // Tentukan JD sesuai TimeScale
        // ============================
        const convert = (jd) => {
          if (jd == null) return null;
          switch (timeScale) {
            case TimeScale.jdTD:
              return jd; // sudah TD
            case TimeScale.jdUT:
              return jd - (eclipse.deltaT ?? 0) / 86400.0;
          }
        }

        const p1 = convert(eclipse.p1);
        const u1 = convert(eclipse.u1);
        const u2 = convert(eclipse.u2);
        const mx = convert(eclipse.mx);
        const u3 = convert(eclipse.u3);
        const u4 = convert(eclipse.u4);
        const p4 = convert(eclipse.p4);

        hasil.push(
          new LunarEclipseLocalSummary({
            tahunHijri: thn,
            bulanHijri: bln,

            // Kontak (JD) - sudah dikonversi TimeScale
            p1: p1,
            u1: u1,
            u2: u2,
            mx: mx,
            u3: u3,
            u4: u4,
            p4: p4,

            // Altitude (nilai sebenarnya, TIDAK ikut TimeScale)
            altP1: eclipse.altP1,
            altU1: eclipse.altU1,
            altU2: eclipse.altU2,
            altMx: eclipse.altMx,
            altU3: eclipse.altU3,
            altU4: eclipse.altU4,
            altP4: eclipse.altP4,

            // Azimuth (nilai sebenarnya, TIDAK ikut TimeScale)
            azmP1: eclipse.azmP1,
            azmU1: eclipse.azmU1,
            azmU2: eclipse.azmU2,
            azmMx: eclipse.azmMx,
            azmU3: eclipse.azmU3,
            azmU4: eclipse.azmU4,
            azmP4: eclipse.azmP4,

            // Durasi (LENGKAP)
            durasiUmbral: eclipse.durasiUmbral,
            durasiPenumbral: eclipse.durasiPenumbral,
            durasiTotal: eclipse.durasiTotal,

            // Magnitude (BARU)
            magnitudeUmbral: eclipse.magnitudeUmbral,
            magnitudePenumbral: eclipse.magnitudePenumbral,

            // Radius
            radiusUmbral: eclipse.radiusUmbral,
            radiusPenumbral: eclipse.radiusPenumbral,

            // Delta T (BARU)
            deltaT: eclipse.deltaT,

            // ✅ Besselian Element (BARU - tambahkan ini)
            besselian: eclipse.besselian,

            // Ephemeris Data Saat Puncak (BARU)
            sunData: eclipse.sun,
            moonData: eclipse.moon,

            // Jenis Gerhana
            jenis: eclipse.jenis,
          }),
        );
      }
    }
    return hasil;
  }
}

