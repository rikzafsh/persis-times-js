/**
 * moon.js — Bulan: RA/Dec, paralaks, elongasi, fase, ijtimak, ketinggian toposentrik hilal.
 * Sumber Dart: core/astronomy/moon_function.dart
 * Kelas: MoonFunction
 * Fungsi: moonGeocentricRightAscension, moonGeocentricDeclination, moonGeocentricGreenwichHourAngle, moonGeocentricLocalHourAngel, moonGeocentricAzimuth, moonGeocentricAltitude, moonEquatorialHorizontalParallax, moonGeocentricSemidiameter, moonSunGeocentricElongation, moonGeocentricPhaseAngle, moonGeocentricDiskIlluminatedFraction, moonGeocentricBrightLimbAngle, termN, parallaxInTheMoonRightAscension …
 */
class MoonFunction {
  ml = new MoonLongitude();
  mb = new MoonLatitude();
  md = new MoonDistance();
  mf = new MathFunction();
  nt = new NutationAndObliquity();
  jd = new JulianDay();
  dt = new DynamicalTime();
  sn = new SunFunction();

  /// Moon Geocentric Right Ascension
  moonGeocentricRightAscension(jd, deltaT) {
    const lmbd = this.ml.moonGeocentricLongitude(jd, deltaT, "Appa");
    const beta = this.mb.moonGeocentricLatitude(jd, deltaT, "Appa");
    const epsln = this.nt.trueObliquityOfEcliptic(jd, deltaT);

    const alpha = this.mf.mod(
      this.mf.deg(
        Math.atan2(
          Math.sin(this.mf.rad(lmbd)) * Math.cos(this.mf.rad(epsln)) -
              Math.tan(this.mf.rad(beta)) * Math.sin(this.mf.rad(epsln)),
          Math.cos(this.mf.rad(lmbd)),
        ),
      ),
      360.0,
    );
    return alpha;
  }

  /// Moon Geocentric Declination
  moonGeocentricDeclination(jd, deltaT) {
    const lmbd = this.ml.moonGeocentricLongitude(jd, deltaT, "Appa");
    const beta = this.mb.moonGeocentricLatitude(jd, deltaT, "Appa");
    const epsln = this.nt.trueObliquityOfEcliptic(jd, deltaT);

    const delta = this.mf.deg(
      Math.asin(
        Math.sin(this.mf.rad(beta)) * Math.cos(this.mf.rad(epsln)) +
            Math.cos(this.mf.rad(beta)) *
                Math.sin(this.mf.rad(epsln)) *
                Math.sin(this.mf.rad(lmbd)),
      ),
    );
    return delta;
  }

  moonGeocentricGreenwichHourAngle(jd, deltaT) {
    const gast = this.sn.greenwichApparentSiderialTime(jd, deltaT);
    const alpha = this.moonGeocentricRightAscension(jd, deltaT);
    const gha = this.mf.mod(gast - alpha, 360);
    return gha;
  }

  moonGeocentricLocalHourAngel(jd, deltaT, gLon) {
    const gast = this.sn.greenwichApparentSiderialTime(jd, deltaT);
    const alpha = this.moonGeocentricRightAscension(jd, deltaT);
    const lhaFK5 = this.mf.mod(gast + gLon - alpha, 360);
    return lhaFK5;
  }

  moonGeocentricAzimuth(jd, deltaT, gLon, gLat) {
    const lha = this.moonGeocentricLocalHourAngel(jd, deltaT, gLon);
    const dec = this.moonGeocentricDeclination(jd, deltaT);
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

  moonGeocentricAltitude(jd, deltaT, gLon, gLat) {
    const lha = this.moonGeocentricLocalHourAngel(jd, deltaT, gLon);
    const dec = this.moonGeocentricDeclination(jd, deltaT);
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

  /// Moon Equatorial Horizontal Parallax
  moonEquatorialHorizontalParallax(jd, deltaT) {
    const distance = this.md.moonGeocentricDistance(jd, deltaT, "KM");
    const pi = this.mf.deg(Math.asin(6378.14 / distance));
    return pi;
  }

  moonGeocentricSemidiameter(jd, deltaT) {
    const k = 0.272481;
    const pi = this.moonEquatorialHorizontalParallax(jd, deltaT);
    const s = this.mf.deg(Math.asin(k * Math.sin(this.mf.rad(pi))));
    return s;
  }

  moonSunGeocentricElongation(jd, deltaT) {
    const deltaSun = this.sn.sunGeocentricDeclination(jd, deltaT);
    const alphaSun = this.sn.sunGeocentricRightAscension(jd, deltaT);
    const deltaMoon = this.moonGeocentricDeclination(jd, deltaT);
    const alphaMoon = this.moonGeocentricRightAscension(jd, deltaT);

    const d = this.mf.deg(
      Math.acos(
        Math.sin(this.mf.rad(deltaSun)) * Math.sin(this.mf.rad(deltaMoon)) +
            Math.cos(this.mf.rad(deltaSun)) *
                Math.cos(this.mf.rad(deltaMoon)) *
                Math.cos(this.mf.rad(alphaSun - alphaMoon)),
      ),
    );
    return d;
  }

  moonGeocentricPhaseAngle(jd, deltaT) {
    const rSun = this.sn.sunGeocentricDistance(jd, deltaT, "KM");
    const rMoon = this.md.moonGeocentricDistance(jd, deltaT, "KM");
    const d = this.moonSunGeocentricElongation(jd, deltaT);
    const i = this.mf.deg(
      Math.atan2(
        rSun * Math.sin(this.mf.rad(d)),
        rMoon - rSun * Math.cos(this.mf.rad(d)),
      ),
    );
    return i;
  }

  moonGeocentricDiskIlluminatedFraction(jd, deltaT) {
    const rSun = this.sn.sunGeocentricDistance(jd, deltaT, "KM");
    const rMoon = this.md.moonGeocentricDistance(jd, deltaT, "KM");
    const d = this.moonSunGeocentricElongation(jd, deltaT);
    const i = this.mf.deg(
      Math.atan2(
        rSun * Math.sin(this.mf.rad(d)),
        rMoon - rSun * Math.cos(this.mf.rad(d)),
      ),
    );
    let k = ((1 + Math.cos(this.mf.rad(i))) / 2) * 100;
    return k;
  }

  moonGeocentricBrightLimbAngle(jd, deltaT) {
    const deltaSun = this.sn.sunGeocentricDeclination(jd, deltaT);
    const alphaSun = this.sn.sunGeocentricRightAscension(jd, deltaT);
    const deltaMoon = this.moonGeocentricDeclination(jd, deltaT);
    const alphaMoon = this.moonGeocentricRightAscension(jd, deltaT);

    const x = this.mf.mod(
      this.mf.deg(
        Math.atan2(
          Math.cos(this.mf.rad(deltaSun)) * Math.sin(this.mf.rad(alphaSun - alphaMoon)),
          Math.sin(this.mf.rad(deltaSun)) * Math.cos(this.mf.rad(deltaMoon)) -
              Math.cos(this.mf.rad(deltaSun)) *
                  Math.sin(this.mf.rad(deltaMoon)) *
                  Math.cos(this.mf.rad(alphaSun - alphaMoon)),
        ),
      ),
      360,
    );
    return x;
  }

  termN(jd, deltaT, gLon, gLat, elev) {
    const lambda = this.ml.moonGeocentricLongitude(jd, deltaT, "Appa");
    const beta = this.mb.moonGeocentricLatitude(jd, deltaT, "Appa");
    const thta = this.sn.localApparentSiderialTime(jd, deltaT, gLon);
    const x = this.sn.termX(gLat, elev);
    const phi = this.moonEquatorialHorizontalParallax(jd, deltaT);

    const n =
        Math.cos(this.mf.rad(lambda)) * Math.cos(this.mf.rad(beta)) -
        x * Math.sin(this.mf.rad(phi)) * Math.cos(this.mf.rad(thta));
    return n;
  }

  parallaxInTheMoonRightAscension(jd, deltaT, gLon, gLat, elev) {
    const x = this.sn.termX(gLat, elev);
    const phi = this.moonEquatorialHorizontalParallax(jd, deltaT);
    const ha = this.moonGeocentricLocalHourAngel(jd, deltaT, gLon);
    const dec = this.moonGeocentricDeclination(jd, deltaT);

    const dAlpha = this.mf.deg(
      Math.atan2(
        -x * Math.sin(this.mf.rad(phi)) * Math.sin(this.mf.rad(ha)),
        Math.cos(this.mf.rad(dec)) -
            x * Math.sin(this.mf.rad(phi)) * Math.cos(this.mf.rad(ha)),
      ),
    );
    return dAlpha;
  }

  atmosphericRefractionFromApparentAltitude(apparentAltitude, pres, temp) {
    const h = apparentAltitude;
    const P = pres;
    const T = temp;

    return (1 /
                Math.tan(this.mf.rad(h + 7.31 / (h + 4.4))) *
                P /
                1010 *
                283 /
                (273 + T) +
            0.0013515216737560731) /
        60;
  }

  parallaxInTheMoonAltitude(jd, deltaT, gLon, gLat, elev) {
    const h = this.moonGeocentricAltitude(jd, deltaT, gLon, gLat);
    const y = this.sn.termY(gLat, elev);
    const x = this.sn.termX(gLat, elev);
    const phi = this.moonEquatorialHorizontalParallax(jd, deltaT);

    const par = this.mf.deg(
      Math.asin(
        Math.sqrt(y * y + x * x) * Math.sin(this.mf.rad(phi)) * Math.cos(this.mf.rad(h)),
      ),
    );
    return par;
  }

  moonTopocentricLongitude(jd, deltaT, gLon, gLat, elev) {
    const lmbd = this.ml.moonGeocentricLongitude(jd, deltaT, "Appa");
    const beta = this.mb.moonGeocentricLatitude(jd, deltaT, "Appa");
    const phi = this.moonEquatorialHorizontalParallax(jd, deltaT);
    const thta = this.sn.localApparentSiderialTime(jd, deltaT, gLon);
    const eps = this.nt.trueObliquityOfEcliptic(jd, deltaT);
    const x = this.sn.termX(gLat, elev);
    const y = this.sn.termY(gLat, elev);
    const n = this.termN(jd, deltaT, gLon, gLat, elev);

    const lmbdP = this.mf.mod(
      this.mf.deg(
        Math.atan2(
          (Math.sin(this.mf.rad(lmbd)) * Math.cos(this.mf.rad(beta)) -
              Math.sin(this.mf.rad(phi)) *
                  (y * Math.sin(this.mf.rad(eps)) +
                      x * Math.cos(this.mf.rad(eps)) * Math.sin(this.mf.rad(thta)))),
          n,
        ),
      ),
      360,
    );

    return lmbdP;
  }

  moonTopocentricLatitude(jd, deltaT, gLon, gLat, elev) {
    const lmbdP = this.moonTopocentricLongitude(jd, deltaT, gLon, gLat, elev);
    const beta = this.mb.moonGeocentricLatitude(jd, deltaT, "Appa");
    const phi = this.moonEquatorialHorizontalParallax(jd, deltaT);
    const thta = this.sn.localApparentSiderialTime(jd, deltaT, gLon);
    const eps = this.nt.trueObliquityOfEcliptic(jd, deltaT);
    const x = this.sn.termX(gLat, elev);
    const y = this.sn.termY(gLat, elev);
    const n = this.termN(jd, deltaT, gLon, gLat, elev);

    const betaP = this.mf.deg(
      Math.atan(
        Math.cos(this.mf.rad(lmbdP)) *
            (Math.sin(this.mf.rad(beta)) -
                Math.sin(this.mf.rad(phi)) *
                    (y * Math.cos(this.mf.rad(eps)) -
                        x * Math.sin(this.mf.rad(eps)) * Math.sin(this.mf.rad(thta)))) /
            n,
      ),
    );

    return betaP;
  }

  moonTopocentricRightAscension(jd, deltaT, gLon, gLat, elev) {
    const alpha = this.moonGeocentricRightAscension(jd, deltaT);
    const dAlph = this.parallaxInTheMoonRightAscension(jd, deltaT, gLon, gLat, elev);
    const alphP = alpha + dAlph;
    return alphP;
  }

  moonTopocentricDeclination(jd, deltaT, gLon, gLat, elev) {
    const dec = this.moonGeocentricDeclination(jd, deltaT);
    const y = this.sn.termY(gLat, elev);
    const x = this.sn.termX(gLat, elev);
    const phi = this.moonEquatorialHorizontalParallax(jd, deltaT);
    const dAlph = this.parallaxInTheMoonRightAscension(jd, deltaT, gLon, gLat, elev);
    const ha = this.moonGeocentricLocalHourAngel(jd, deltaT, gLon);

    const dltaP = this.mf.deg(
      Math.atan2(
        (Math.sin(this.mf.rad(dec)) - y * Math.sin(this.mf.rad(phi))) *
            Math.cos(this.mf.rad(dAlph)),
        Math.cos(this.mf.rad(dec)) -
            x * Math.sin(this.mf.rad(phi)) * Math.cos(this.mf.rad(ha)),
      ),
    );
    return dltaP;
  }

  moonTopocentricGreenwichHourAngle(jd, deltaT, gLon, gLat, elev) {
    const gast = this.sn.greenwichApparentSiderialTime(jd, deltaT);
    const alph = this.moonTopocentricRightAscension(jd, deltaT, gLon, gLat, elev);
    const gha = this.mf.mod(gast - alph, 360.0);
    return gha;
  }

  moonTopocentricLocalHourAngel(jd, deltaT, gLon, gLat, elev) {
    const lha = this.moonGeocentricLocalHourAngel(jd, deltaT, gLon);
    const dAlph = this.parallaxInTheMoonRightAscension(jd, deltaT, gLon, gLat, elev);
    const lhaP = lha - dAlph;
    return lhaP;
  }

  moonTopocentricSemidiameter(jd, deltaT, gLon, gLat, elev) {
    let lmbdP = this.moonTopocentricLongitude(jd, deltaT, gLon, gLat, elev);
    let betaP = this.moonTopocentricLatitude(jd, deltaT, gLon, gLat, elev);
    let s = this.moonGeocentricSemidiameter(jd, deltaT);
    let n = this.termN(jd, deltaT, gLon, gLat, elev);

    let sP = this.mf.deg(
      Math.sin(
        Math.cos(this.mf.rad(lmbdP)) *
            Math.cos(this.mf.rad(betaP)) *
            Math.sin(this.mf.rad(s)) /
            n,
      ),
    );
    return sP;
  }

  moonTopocentricAzimuth(jd, deltaT, gLon, gLat, elev) {
    const lhaP = this.moonTopocentricLocalHourAngel(jd, deltaT, gLon, gLat, elev);
    const dltP = this.moonTopocentricDeclination(jd, deltaT, gLon, gLat, elev);

    const azmP = this.mf.mod(
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

  moonTopocentricAltitude(jd, deltaT, gLon, gLat, elev, pres, temp, opt) {
    const dec = this.moonTopocentricDeclination(jd, deltaT, gLon, gLat, elev);
    const lHA = this.moonTopocentricLocalHourAngel(jd, deltaT, gLon, gLat, elev);

    const htc = this.mf.deg(
      Math.asin(
        Math.sin(this.mf.rad(gLat)) * Math.sin(this.mf.rad(dec)) +
            Math.cos(this.mf.rad(gLat)) *
                Math.cos(this.mf.rad(dec)) *
                Math.cos(this.mf.rad(lHA)),
      ),
    );

    const dip = 1.75 / 60 * Math.sqrt(elev);
    const sdc = this.moonTopocentricSemidiameter(jd, deltaT, gLon, gLat, elev);

    const htu = htc + sdc;
    const htl = htc - sdc;

    const rhtu = this.sn.atmosphericRefractionFromAirlessAltitude(htu, pres, temp);
    const rhtc = this.sn.atmosphericRefractionFromAirlessAltitude(htc, pres, temp);
    const rhtl = this.sn.atmosphericRefractionFromAirlessAltitude(htl, pres, temp);

    const htau = htu + rhtu;
    const htac = htc + rhtc;
    const htal = htl + rhtl;

    const htoc = htac + dip;
    const htou = htau + dip;
    const htol = htal + dip;

    let ht;
    switch (opt) {
      //Airless Altitude
      case "htu":
        ht = htu;
        break;
      case "htc":
        ht = htc;
        break;
      case "htl":
        ht = htl;
        break;
      //Apparent Altitude
      case "htau":
        ht = htau;
        break;
      case "htac":
        ht = htac;
        break;
      case "htal":
        ht = htal;
        break;
      //Observered Altitude
      case "htou":
        ht = htou;
        break;
      case "htoc":
        ht = htoc;
        break;
      case "htol":
        ht = htol;
        break;
      //Refraksi
      case "Rhtc":
        ht = rhtc;
        break;
      case "Rhtu":
        ht = rhtu;
        break;
      case "Rhtl":
        ht = rhtl;
        break;
      //Dip
      case "Dip":
        ht = dip;
        break;
      default:
        ht = htc;
    }

    return ht;
  }

  //Keterangan:

  //htu  = Airles topocentric altitude of The Moon’s Upper Limb
  //htc  = Airless topocentric altitude of The Moon’s Center Limb
  //htl  = Airles topocentric altitude of The Moon’s Lower Limb

  //htal = Apparent topocentric altitude of The Moon’s Lower Limb
  //htac = Apparent topocentric altitude of The Moon’s Center Limb
  //htau = Apparent topocentric altitude of The Moon’s Upper Limb

  //htou = Observed altitude of The Moon’s Upper Limb
  //htoc = Observed altitude of The Moon’s Center Limb
  //htol = Observed altitude of The Moon’s Lower Limb

  moonSunTopocentricElongation(jd, deltaT, gLon, gLat, elev) {
    const dltaS = this.sn.sunTopocentricDeclination(
      jd,
      deltaT,
      gLon,
      gLat,
      elev,
    );
    const alphS = this.sn.sunTopocentricRightAscension(
      jd,
      deltaT,
      gLon,
      gLat,
      elev,
    );
    const dltaM = this.moonTopocentricDeclination(
      jd,
      deltaT,
      gLon,
      gLat,
      elev,
    );
    const alphM = this.moonTopocentricRightAscension(
      jd,
      deltaT,
      gLon,
      gLat,
      elev,
    );

    const d = this.mf.deg(
      Math.acos(
        Math.sin(this.mf.rad(dltaS)) * Math.sin(this.mf.rad(dltaM)) +
            Math.cos(this.mf.rad(dltaS)) *
                Math.cos(this.mf.rad(dltaM)) *
                Math.cos(this.mf.rad(alphS - alphM)),
      ),
    );

    return d;
  }

  moonTopocentricPhaseAngle(jd, deltaT, gLon, gLat, elev) {
    let rSn = this.sn.sunGeocentricDistance(jd, deltaT, "KM");
    let rMn = this.md.moonGeocentricDistance(jd, deltaT, "KM");
    let d = this.moonSunTopocentricElongation(jd, deltaT, gLon, gLat, elev);

    let i = this.mf.deg(
      Math.atan2(rSn * Math.sin(this.mf.rad(d)), rMn - rSn * Math.cos(this.mf.rad(d))),
    );
    return i;
  }

  moonTopocentricDiskIlluminatedFraction(jd, deltaT, gLon, gLat, elev) {
    let rSn = this.sn.sunGeocentricDistance(jd, deltaT, "KM");
    let rMn = this.md.moonGeocentricDistance(jd, deltaT, "KM");
    let d = this.moonSunTopocentricElongation(jd, deltaT, gLon, gLat, elev);

    let i = this.mf.deg(
      Math.atan2(rSn * Math.sin(this.mf.rad(d)), rMn - rSn * Math.cos(this.mf.rad(d))),
    );
    let k = ((1 + Math.cos(this.mf.rad(i))) / 2) * 100;
    return k;
  }

  moonTopocentricBrightLimbAngle(jd, deltaT, gLon, gLat, elev) {
    let dltaSn = this.sn.sunTopocentricDeclination(jd, deltaT, gLon, gLat, elev);
    let alphSn = this.sn.sunTopocentricRightAscension(
      jd,
      deltaT,
      gLon,
      gLat,
      elev,
    );
    let dltaMn = this.moonTopocentricDeclination(jd, deltaT, gLon, gLat, elev);
    let alphMn = this.moonTopocentricRightAscension(jd, deltaT, gLon, gLat, elev);

    let x = this.mf.mod(
      this.mf.deg(
        Math.atan2(
          Math.cos(this.mf.rad(dltaSn)) * Math.sin(this.mf.rad(alphSn - alphMn)),
          Math.sin(this.mf.rad(dltaSn)) * Math.cos(this.mf.rad(dltaMn)) -
              Math.cos(this.mf.rad(dltaSn)) *
                  Math.sin(this.mf.rad(dltaMn)) *
                  Math.cos(this.mf.rad(alphSn - alphMn)),
        ),
      ),
      360,
    );
    return x;
  }

  moonPhasesModified(hijriMonth, hijriYear, moonPhaseKind) {
    let k = (hijriMonth) + 12 * (hijriYear) - 17050;

    let kII;
    switch (moonPhaseKind) {
      case 1:
        kII = 0.0;
        break;
      case 2:
        kII = 0.25;
        break;
      case 3:
        kII = 0.5;
        break;
      case 4:
        kII = 0.75;
        break;
      default:
        kII = 0.0;
    }

    k = this.mf.floor(k) + kII;

    const t = k / 1236.85;
    const t2 = t * t;
    const t3 = t2 * t;
    const t4 = t3 * t;

    const jdeMMP =
        2451550.09766 +
        29.530588861 * k +
        0.00015437 * t2 -
        0.00000015 * t3 +
        0.00000000073 * t4;

    const e = 1 - 0.002516 * t - 0.0000074 * t2;

    let m = 2.5534 + 29.1053567 * k - 0.0000014 * t2 - 0.00000011 * t3;
    m = this.mf.rad(this.mf.mod(m, 360));

    let mp =
        201.5643 +
        385.81693528 * k +
        0.0107582 * t2 +
        0.00001238 * t3 -
        0.000000058 * t4;
    mp = this.mf.rad(this.mf.mod(mp, 360));

    let f =
        160.7108 +
        390.67050284 * k -
        0.0016118 * t2 -
        0.00000227 * t3 +
        0.000000011 * t4;
    f = this.mf.rad(this.mf.mod(f, 360));

    let om = 124.7746 - 1.56375588 * k + 0.0020672 * t2 + 0.00000215 * t3;
    om = this.mf.rad(this.mf.mod(om, 360));

    const a1 = this.mf.rad(this.mf.mod(299.77 + 0.107408 * k - 0.009173 * t * t, 360));
    const a2 = this.mf.rad(this.mf.mod(251.88 + 0.016321 * k, 360));
    const a3 = this.mf.rad(this.mf.mod(251.83 + 26.651886 * k, 360));
    const a4 = this.mf.rad(this.mf.mod(349.42 + 36.412478 * k, 360));
    const a5 = this.mf.rad(this.mf.mod(84.66 + 18.206239 * k, 360));
    const a6 = this.mf.rad(this.mf.mod(141.74 + 53.303771 * k, 360));
    const a7 = this.mf.rad(this.mf.mod(207.14 + 2.453732 * k, 360));
    const a8 = this.mf.rad(this.mf.mod(154.84 + 7.30686 * k, 360));
    const a9 = this.mf.rad(this.mf.mod(34.52 + 27.261239 * k, 360));
    const a10 = this.mf.rad(this.mf.mod(207.19 + 0.121824 * k, 360));
    const a11 = this.mf.rad(this.mf.mod(291.34 + 1.844379 * k, 360));
    const a12 = this.mf.rad(this.mf.mod(161.72 + 24.198154 * k, 360));
    const a13 = this.mf.rad(this.mf.mod(239.56 + 25.513099 * k, 360));
    const a14 = this.mf.rad(this.mf.mod(331.55 + 3.592518 * k, 360));

    let jdeCorr1;
    switch (moonPhaseKind) {
      case 1:
        jdeCorr1 =
            -0.4072 * Math.sin(mp) +
            0.17241 * e * Math.sin(m) +
            0.01608 * Math.sin(2 * mp) +
            0.01039 * Math.sin(2 * f) +
            0.00739 * e * Math.sin(mp - m) -
            0.00514 * e * Math.sin(mp + m) +
            0.00208 * e * e * Math.sin(2 * m) -
            0.00111 * Math.sin(mp - 2 * f) -
            0.00057 * Math.sin(mp + 2 * f) +
            0.00056 * e * Math.sin(2 * mp + m) -
            0.00042 * Math.sin(3 * mp) +
            0.00042 * e * Math.sin(m + 2 * f) +
            0.00038 * e * Math.sin(m - 2 * f) -
            0.00024 * e * Math.sin(2 * mp - m) -
            0.00017 * Math.sin(om) -
            0.00007 * Math.sin(mp + 2 * m) +
            0.00004 * Math.sin(2 * mp - 2 * f) +
            0.00004 * Math.sin(3 * m) +
            0.00003 * Math.sin(mp + m - 2 * f) +
            0.00003 * Math.sin(2 * mp + 2 * f) -
            0.00003 * Math.sin(mp + m + 2 * f) +
            0.00003 * Math.sin(mp - m + 2 * f) -
            0.00002 * Math.sin(mp - m - 2 * f) -
            0.00002 * Math.sin(3 * mp + m) +
            0.00002 * Math.sin(4 * mp);
        break;

      case 3:
        jdeCorr1 =
            -0.40614 * Math.sin(mp) +
            0.17302 * e * Math.sin(m) +
            0.01614 * Math.sin(2 * mp) +
            0.01043 * Math.sin(2 * f) +
            0.00734 * e * Math.sin(mp - m) -
            0.00514 * e * Math.sin(mp + m) +
            0.00209 * e * e * Math.sin(2 * m) -
            0.00111 * Math.sin(mp - 2 * f) -
            0.00057 * Math.sin(mp + 2 * f) +
            0.00056 * e * Math.sin(2 * mp + m) -
            0.00042 * Math.sin(3 * mp) +
            0.00042 * e * Math.sin(m + 2 * f) +
            0.00038 * e * Math.sin(m - 2 * f) -
            0.00024 * e * Math.sin(2 * mp - m) -
            0.00017 * Math.sin(om) -
            0.00007 * Math.sin(mp + 2 * m) +
            0.00004 * Math.sin(2 * mp - 2 * f) +
            0.00004 * Math.sin(3 * m) +
            0.00003 * Math.sin(mp + m - 2 * f) +
            0.00003 * Math.sin(2 * mp + 2 * f) -
            0.00003 * Math.sin(mp + m + 2 * f) +
            0.00003 * Math.sin(mp - m + 2 * f) -
            0.00002 * Math.sin(mp - m - 2 * f) -
            0.00002 * Math.sin(3 * mp + m) +
            0.00002 * Math.sin(4 * mp);
        break;

      case 2:
      case 4:
        jdeCorr1 =
            -0.62801 * Math.sin(mp) +
            0.17172 * e * Math.sin(m) -
            0.01183 * e * Math.sin(mp + m) +
            0.00862 * Math.sin(2 * mp) +
            0.00804 * Math.sin(2 * f) +
            0.00454 * e * Math.sin(mp - m) +
            0.00204 * e * e * Math.sin(2 * m) -
            0.0018 * Math.sin(mp - 2 * f) -
            0.0007 * Math.sin(mp + 2 * f) -
            0.0004 * Math.sin(3 * mp) -
            0.00034 * e * Math.sin(2 * mp - m) +
            0.00032 * e * Math.sin(m + 2 * f) +
            0.00032 * e * Math.sin(m - 2 * f) -
            0.00028 * e * e * Math.sin(mp + 2 * m) +
            0.00027 * e * Math.sin(2 * mp + m) -
            0.00017 * Math.sin(om) -
            0.00005 * Math.sin(mp - m - 2 * f) +
            0.00004 * Math.sin(2.0 * mp + 2 * f) -
            0.00004 * Math.sin(mp + m + 2 * f) +
            0.00004 * Math.sin(mp - 2 * m) +
            0.00003 * Math.sin(mp + m - 2 * f) +
            0.00003 * Math.sin(3 * m) +
            0.00002 * Math.sin(2 * mp - 2 * f) +
            0.00002 * Math.sin(mp - m + 2 * f) -
            0.00002 * Math.sin(3 * mp + m);
        break;

      default:
        jdeCorr1 = 0.0;
    }

    // Extra correction for Quarter phases
    if (moonPhaseKind == 2 || moonPhaseKind == 4) {
      const w =
          0.00306 -
          0.00038 * e * Math.cos(m) +
          0.00026 * Math.cos(mp) -
          0.00002 * Math.cos(mp - m) +
          0.00002 * Math.cos(mp + m) +
          0.00002 * Math.cos(2 * f);
      if (moonPhaseKind == 2) {
        jdeCorr1 += w;
      } else if (moonPhaseKind == 4) {
        jdeCorr1 -= w;
      }
    }

    const jdeCorr2 =
        0.000325 * Math.sin(a1) +
        0.000165 * Math.sin(a2) +
        0.000164 * Math.sin(a3) +
        0.000126 * Math.sin(a4) +
        0.00011 * Math.sin(a5) +
        0.000062 * Math.sin(a6) +
        0.00006 * Math.sin(a7) +
        0.000056 * Math.sin(a8) +
        0.000047 * Math.sin(a9) +
        0.000042 * Math.sin(a10) +
        0.00004 * Math.sin(a11) +
        0.000037 * Math.sin(a12) +
        0.000035 * Math.sin(a13) +
        0.000023 * Math.sin(a14);

    const result = jdeMMP + jdeCorr1 + jdeCorr2;
    return result;
  }

  jdeEclipseModified(hijriMonth, hijriYear, eclipseKind) {
    let k;

    switch (eclipseKind) {
      case 1:
        k =
            this.mf.floor(
              (hijriMonth) + 12 * (hijriYear) - 17048.5,
            ) +
            0.0;
        break;
      case 2:
        k =
            ((hijriMonth) + 12 * (hijriYear) - 17049.5)
                Math.floor(Math) +
            0.5;
        break;
      default:
        k =
            ((hijriMonth) + 12 * (hijriYear) - 17048.5)
                Math.floor(Math) +
            0.0;
        break;
    }

    let t = k / 1236.85;
    let t2 = t * t;
    let t3 = t2 * t;
    let t4 = t3 * t;

    let jdeMMP =
        2451550.09766 +
        29.530588861 * k +
        0.00015437 * t2 -
        0.000000150 * t3 +
        0.00000000073 * t4;

    let e = 1 - 0.002516 * t - 0.0000074 * t2;

    let m = 2.5534 + 29.1053567 * k - 0.0000014 * t2 - 0.00000011 * t3;
    m = this.mf.rad(this.mf.mod(m, 360));

    let mp =
        201.5643 +
        385.81693528 * k +
        0.0107582 * t2 +
        0.00001238 * t3 -
        0.000000058 * t4;
    mp = this.mf.rad(this.mf.mod(mp, 360));

    let f =
        160.7108 +
        390.67050284 * k -
        0.0016118 * t2 -
        0.00000227 * t3 +
        0.000000011 * t4;
    f = this.mf.rad(this.mf.mod(f, 360));

    let omg = 124.7746 - 1.56375588 * k + 0.0020672 * t2 + 0.00000215 * t3;
    omg = this.mf.rad(this.mf.mod(omg, 360));

    if (this.mf.abs(Math.sin(f)) > 0.36) {
      return 0.0;
    } else {
      let f1 = this.mf.deg(f) - 0.02665 * Math.sin(omg);
      f1 = this.mf.rad(this.mf.mod(f1, 360));

      let a1 = 299.77 + 0.107408 * k - 0.009173 * t2;
      a1 = this.mf.rad(this.mf.mod(a1, 360));

      let jdeCorr;
      switch (eclipseKind) {
        case 1:
          jdeCorr = -0.4075 * Math.sin(mp) + 0.1721 * e * Math.sin(m);
          break;
        case 2:
          jdeCorr = -0.4065 * Math.sin(mp) + 0.1727 * e * Math.sin(m);
          break;
        default:
          jdeCorr = -0.4075 * Math.sin(mp) + 0.1721 * e * Math.sin(m);
          break;
      }

      jdeCorr =
          jdeCorr +
          0.0161 * Math.sin(2 * mp) -
          0.0097 * Math.sin(2 * f1) +
          0.0073 * e * Math.sin(mp - m) -
          0.0050 * e * Math.sin(mp + m) -
          0.0023 * Math.sin(mp - 2 * f1) +
          0.0021 * e * Math.sin(2 * m) +
          0.0012 * Math.sin(mp + 2 * f1) +
          0.0006 * e * Math.sin(2 * mp + m) -
          0.0004 * Math.sin(3 * mp) -
          0.0003 * e * Math.sin(m + 2 * f1) +
          0.0003 * Math.sin(a1) -
          0.0002 * e * Math.sin(m - 2 * f1) -
          0.0002 * e * Math.sin(2 * mp - m) -
          0.0002 * Math.sin(omg);

      return jdeMMP + jdeCorr;
    }
  }

  geocentricConjunction(hijriMonth, hijriYear, deltaT, optR) {
    let jdNMGeo = 0.0;
    let jdNM = this.moonPhasesModified(hijriMonth, hijriYear, 1);

    let x1 = jdNM - 1 / 24;
    let x2 = jdNM;
    let x3 = jdNM + 1 / 24;

    let y1 =
        this.sn.sunGeocentricLongitude(x1, deltaT, "Appa") -
        this.ml.moonGeocentricLongitude(x1, deltaT, "Appa");
    let y2 =
        this.sn.sunGeocentricLongitude(x2, deltaT, "Appa") -
        this.ml.moonGeocentricLongitude(x2, deltaT, "Appa");
    let y3 =
        this.sn.sunGeocentricLongitude(x3, deltaT, "Appa") -
        this.ml.moonGeocentricLongitude(x3, deltaT, "Appa");

    let a = y2 - y1;
    let b = y3 - y2;
    let c = b - a;

    let n0 = 0.0;

    for (let i = 1; i <= 2; i++) {
      n0 = -2 * y2 / (a + b + c * n0);
      jdNMGeo = jdNM + n0 / 24;
    }

    let lonG = this.sn.sunGeocentricLongitude(jdNMGeo, deltaT, "Appa");

    switch (optR) {
      case "Ijtima":
        return jdNMGeo;
      case "Bujur":
        return lonG;
      default:
        return jdNMGeo;
    }
  }

  topocentricConjunction(hijriMonth, hijriYear, deltaT, gLon, gLat, elev, optR) {
    let jdNMTopo = 0.0;
    let jdNM = this.moonPhasesModified(hijriMonth, hijriYear, 1);

    let x1 = jdNM - 1 / 24;
    let x2 = jdNM;
    let x3 = jdNM + 1 / 24;

    let y1 =
        this.sn.sunTopocentricLongitude(x1, deltaT, gLon, gLat, elev) -
        this.moonTopocentricLongitude(x1, deltaT, gLon, gLat, elev);
    let y2 =
        this.sn.sunTopocentricLongitude(x2, deltaT, gLon, gLat, elev) -
        this.moonTopocentricLongitude(x2, deltaT, gLon, gLat, elev);
    let y3 =
        this.sn.sunTopocentricLongitude(x3, deltaT, gLon, gLat, elev) -
        this.moonTopocentricLongitude(x3, deltaT, gLon, gLat, elev);

    let a = y2 - y1;
    let b = y3 - y2;
    let c = b - a;

    let n0 = 0.0;
    n0 = -2 * y2 / (a + b + c * n0);

    for (let i = 1; i <= 3; i++) {
      n0 = -2 * y2 / (a + b + c * n0);
      jdNMTopo = jdNM + n0 / 24;
    }

    let lonT = this.sn.sunTopocentricLongitude(
      jdNMTopo,
      deltaT,
      gLon,
      gLat,
      elev,
    );

    switch (optR) {
      case "Ijtima":
        return jdNMTopo;
      case "Bujur":
        return lonT;
      default:
        return jdNMTopo;
    }
  }

  moonTransitRiseSet(tglM, blnM, thnM, gLon, gLat, elev, tmZn, trsType, maxItr) {
    let jd00LT;
    let jd00UT;
    let jde00UT;
    let alphaMm1d = 0.0;
    let alphaM00d = 0.0;
    let alphaMp1d = 0.0;
    let deltaMm1d = 0.0;
    let deltaM00d = 0.0;
    let deltaMp1d = 0.0;
    let pi;
    let h0 = 0.0;
    let cosHA0;
    let ha0;
    let t;
    let theta0 = 0.0;
    let m = 0.0;
    let sTheta0 = 0.0;
    let nT = 0.0;
    let alphaM = 0.0;
    let deltaM = 0.0;
    let ha = 0.0;
    let h = 0.0;
    let dltm = 0.0;
    let jdTRS;
    let ttrs = 0.0;

    jd00UT = this.jd.kmjd(tglM, blnM, thnM, tmZn, tmZn) + -1;

    for (let dItr = 1; dItr <= 3; dItr++) {
      jde00UT = jd00UT + this.dt.deltaT(jd00UT) / 86400.0;
      alphaMm1d = this.moonGeocentricRightAscension(jde00UT - 1, 0);
      alphaM00d = this.moonGeocentricRightAscension(jde00UT - 0, 0);
      alphaMp1d = this.moonGeocentricRightAscension(jde00UT + 1, 0);

      if (trsType == "TRANSIT") {
        deltaM00d = 0;
        deltaMm1d = 0;
        deltaMp1d = 0;
      } else {
        deltaMm1d = this.moonGeocentricDeclination(jde00UT - 1, 0);
        deltaM00d = this.moonGeocentricDeclination(jde00UT - 0, 0);
        deltaMp1d = this.moonGeocentricDeclination(jde00UT + 1, 0);
      }

      pi = this.moonEquatorialHorizontalParallax(jde00UT, 0);

      h0 = -(34 / 60) + 0.7275 * pi - 0.0353 * Math.sqrt(elev);
      cosHA0 =
          (Math.sin(this.mf.rad(h0)) -
              Math.sin(this.mf.rad(gLat)) * Math.sin(this.mf.rad(deltaM00d))) /
          (Math.cos(this.mf.rad(gLat)) * Math.cos(this.mf.rad(deltaM00d)));

      if (Math.abs((cosHA0)) <= 1) {
        ha0 = this.mf.deg(Math.acos(cosHA0));
      } else {
        ha0 = 0;
      }

      t = (jde00UT - 2451545) / 36525;

      theta0 =
          (100.46061837) +
          (36000.770053608 * t) +
          (0.000387933 * t * t) -
          (Math.pow(t, 3.0) / 38710000) +
          (this.nt.nutationInLongitude(jde00UT, 0) *
              Math.cos(this.mf.rad(this.nt.trueObliquityOfEcliptic(jde00UT, 0))));

      theta0 = this.mf.mod(theta0, 360);

      m = (alphaM00d - gLon - theta0) / 360;

      switch (trsType) {
        case "TRANSIT":
          m = m;
          break;
        case "RISE":
          m = m - ha0 / 360;
          break;
        case "SET":
          m = m + ha0 / 360;
          break;
      }

      m = this.mf.mod(m, 1);

      for (let itr = 1; itr <= maxItr; itr++) {
        sTheta0 = theta0 + 360.985647 * m;
        sTheta0 = this.mf.mod(sTheta0, 360);
        nT = m;
        alphaM = this.mf.mod(
          alphaM00d +
              nT /
                  2.0 *
                  (this.mf.mod((alphaM00d - alphaMm1d), 360) +
                      this.mf.mod((alphaMp1d - alphaM00d), 360) +
                      nT *
                          (this.mf.mod((alphaMp1d - alphaM00d), 360) -
                              this.mf.mod((alphaM00d - alphaMm1d), 360))),
          360,
        );

        if (trsType == "TRANSIT") {
          deltaM = 0;
        } else {
          deltaM =
              deltaM00d +
              nT /
                  2.0 *
                  ((deltaM00d - deltaMm1d) +
                      (deltaMp1d - deltaM00d) +
                      nT * ((deltaMp1d - deltaM00d) - (deltaM00d - deltaMm1d)));
        }

        ha = sTheta0 + gLon - alphaM;

        if (this.mf.mod(ha, 360) > 180) {
          ha = this.mf.mod(ha, 360) - 360;
        } else {
          ha = this.mf.mod(ha, 360);
        }

        h = this.mf.deg(
          Math.asin(
            Math.sin(this.mf.rad(gLat)) * Math.sin(this.mf.rad(deltaM)) +
                Math.cos(this.mf.rad(gLat)) *
                    Math.cos(this.mf.rad(deltaM)) *
                    Math.cos(this.mf.rad(ha)),
          ),
        );

        switch (trsType) {
          case "TRANSIT":
            dltm = -ha / 360;
            break;
          case "RISE":
          case "SET":
            dltm =
                (h - h0) /
                (360 *
                    Math.cos(this.mf.rad(deltaM)) *
                    Math.cos(this.mf.rad(gLat)) *
                    Math.sin(this.mf.rad(ha)));
            break;
        }

        m = this.mf.mod(m + dltm, 1);
      }

      jdTRS = jd00UT + m;
      jd00LT = this.jd.kmjd(tglM, blnM, thnM, 0, tmZn);
      ttrs =  parseFloat(this.jd.jdkm(jdTRS, tmZn, "JAMDES"));

      if ((jdTRS >= (jd00LT + 0)) && (jdTRS <= (jd00LT + 1))) {
        ttrs =  parseFloat(this.jd.jdkm(jdTRS, tmZn, "JAMDES"));
      } else {
        jd00UT = jd00UT + 1;
        ttrs = 0;
      }
    }
    return ttrs;
  }
}

