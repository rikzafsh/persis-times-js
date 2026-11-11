/**
 * hisab_awal_bulan_service.js — Hisab awal bulan Hijriah: ijtimak, Magrib, data Matahari/Bulan geo+toposentris, elongasi, q Odeh, status MABIMS/Turki/WH.
 * Sumber Dart: service/hisab_awal_bulan_service.dart
 * Kelas: HisabAwalBulanService
 * Fungsi: hitung
 */
class HisabAwalBulanService {
  hitung({blnH, thnH, gLon, gLat, tmZn, elev, pres, temp, tbhHari, optKriteria} = {}) {
    const mo = new MoonFunction();
    const ml = new MoonLongitude();
    const mb = new MoonLatitude();
    const md = new MoonDistance();
    const sn = new SunFunction();
    const dt = new DynamicalTime();
    const jd = new JulianDay();
    const mf = new MathFunction();

    const geojdIjtimak = mo.geocentricConjunction(
      blnH,
      thnH,
      0.0,
      "Ijtima",
    );

    const deltaT = dt.deltaT(Math.floor(geojdIjtimak) + 0.5);

    const geojdIjtimak2 = mo.geocentricConjunction(
      blnH,
      thnH,
      deltaT,
      "Ijtima",
    );

    const topojdIjtimak = mo.topocentricConjunction(
      blnH,
      thnH,
      deltaT,
      gLon,
      gLat,
      elev,
      "Ijtima",
    );

    const sunsetJD = sn.jdGhurubSyams(
      geojdIjtimak + tbhHari,
      gLat,
      gLon,
      elev,
      tmZn,
    );

    const tglM =  parseInt(jd.jdkm(sunsetJD, tmZn, "TglM").toString());
    const blnM =  parseInt(jd.jdkm(sunsetJD, tmZn, "BlnM").toString());
    const thnM =  parseInt(jd.jdkm(sunsetJD, tmZn, "ThnM").toString());

    let mSet = mo.moonTransitRiseSet(
      tglM,
      blnM,
      thnM,
      gLon,
      gLat,
      elev,
      tmZn,
      "SET",
      2,
    );

    const moonsetJD = (mSet != 0.0)
        ? jd.kmjd(tglM, blnM, thnM, 0.0, 0.0) + (mSet - tmZn) / 24.0
        : null;

    //Data Matahari Geosentris
    const sunGeocentricLongitudeTrue = sn.sunGeocentricLongitude(
      sunsetJD,
      deltaT,
      "True",
    );
    const sunGeocentricLongitudeApparent = sn.sunGeocentricLongitude(
      sunsetJD,
      deltaT,
      "Appa",
    );
    const sunGeocentricLatitudeTrue = sn.sunGeocentricLatitude(
      sunsetJD,
      deltaT,
    );
    const sunGeocentricLatitudeApparent = sn.sunGeocentricLatitude(
      sunsetJD,
      deltaT,
    );

    const sunGeocentricRightAscension = sn.sunGeocentricRightAscension(
      sunsetJD,
      deltaT,
    );
    const sunGeocentricDeclination = sn.sunGeocentricDeclination(
      sunsetJD,
      deltaT,
    );

    const sunGeocentricAzimuth = sn.sunGeocentricAzimuth(
      sunsetJD,
      deltaT,
      gLon,
      gLat,
    );
    const sunGeocentricAltitude = sn.sunGeocentricAltitude(
      sunsetJD,
      deltaT,
      gLon,
      gLat,
    );

    const sunGeocentricSemidiameter = sn.sunGeocentricSemidiameter(
      sunsetJD,
      deltaT,
    );
    const sunEquatorialHorizontalParallax = sn.sunEquatorialHorizontalParallax(sunsetJD, deltaT);

    const sunGeocentricDistanceAU = sn.sunGeocentricDistance(
      sunsetJD,
      deltaT,
      "AU",
    );
    const sunGeocentricDistanceKM = sn.sunGeocentricDistance(
      sunsetJD,
      deltaT,
      "KM",
    );
    const sunGeocentricDistanceER = sn.sunGeocentricDistance(
      sunsetJD,
      deltaT,
      "ER",
    );

    const greenwichApparentSiderealTime = sn.greenwichApparentSiderialTime(sunsetJD, deltaT);

    const localApparentSiderealTime = sn.localApparentSiderialTime(
      sunsetJD,
      deltaT,
      gLon,
    );

    const sunGeocentricGreenwichHourAngle = sn.sunGeocentricGreenwichHourAngle(sunsetJD, deltaT);
    const sunGeocentricLocalHourAngle = sn.sunGeocentricLocalHourAngle(
      sunsetJD,
      deltaT,
      gLon,
    );

    //Data Matahari Toposentris
    const sunTopocentricLongitudeApparent = sn.sunTopocentricLongitude(
      sunsetJD,
      deltaT,
      gLon,
      gLat,
      elev,
    );
    const sunTopocentricLatitudeTrue = sn.sunTopocentricLatitude(
      sunsetJD,
      deltaT,
      gLon,
      gLat,
      elev,
    );

    const sunTopocentricRightAscension = sn.sunTopocentricRightAscension(
      sunsetJD,
      deltaT,
      gLon,
      gLat,
      elev,
    );
    const sunTopocentricDeclination = sn.sunTopocentricDeclination(
      sunsetJD,
      deltaT,
      gLon,
      gLat,
      elev,
    );

    const sunTopocentricAzimuth = sn.sunTopocentricAzimuth(
      sunsetJD,
      deltaT,
      gLon,
      gLat,
      elev,
    );

    const sunTopocentricAltitudeAirlessUpper = sn.sunTopocentricAltitude(
      sunsetJD,
      deltaT,
      gLon,
      gLat,
      elev,
      pres,
      temp,
      "htu",
    );

    const sunTopocentricAltitudeAirlessCenter = sn.sunTopocentricAltitude(
          sunsetJD,
          deltaT,
          gLon,
          gLat,
          elev,
          pres,
          temp,
          "htc",
        );

    const sunTopocentricAltitudeAirlessLower = sn.sunTopocentricAltitude(
      sunsetJD,
      deltaT,
      gLon,
      gLat,
      elev,
      pres,
      temp,
      "htl",
    );

    const sunTopocentricAltitudeApparentsUpper = sn.sunTopocentricAltitude(
          sunsetJD,
          deltaT,
          gLon,
          gLat,
          elev,
          pres,
          temp,
          "htau",
        );

    const sunTopocentricAltitudeApparentCenter = sn.sunTopocentricAltitude(
          sunsetJD,
          deltaT,
          gLon,
          gLat,
          elev,
          pres,
          temp,
          "htac",
        );

    const sunTopocentricAltitudeApparentLower = sn.sunTopocentricAltitude(
          sunsetJD,
          deltaT,
          gLon,
          gLat,
          elev,
          pres,
          temp,
          "htal",
        );

    const sunTopocentricAltitudeObserveredUpper = sn.sunTopocentricAltitude(
          sunsetJD,
          deltaT,
          gLon,
          gLat,
          elev,
          pres,
          temp,
          "htou",
        );

    const sunTopocentricAltitudeObserveredCenter = sn.sunTopocentricAltitude(
          sunsetJD,
          deltaT,
          gLon,
          gLat,
          elev,
          pres,
          temp,
          "htoc",
        );

    const sunTopocentricAltitudeObserveredLower = sn.sunTopocentricAltitude(
          sunsetJD,
          deltaT,
          gLon,
          gLat,
          elev,
          pres,
          temp,
          "htol",
        );

    const sunTopocentricSemidiameter = sn.sunTopocentricSemidiameter(
      sunsetJD,
      deltaT,
      gLon,
      gLat,
      elev,
    );

    const sunTopocentricGreenwichHourAngle = sn.sunTopocentricGreenwichHourAngle(sunsetJD, deltaT, gLon, gLat, elev);
    const sunTopocentricLocalHourAngle = sn.sunTopocentricLocalHourAngel(
      sunsetJD,
      deltaT,
      gLon,
      gLat,
      elev,
    );

    //Data Bulan Geosentris
    const moonGeocentricLongitudeTrue = ml.moonGeocentricLongitude(
      sunsetJD,
      deltaT,
      "true",
    );
    const moonGeocentricLongitudeApparent = ml.moonGeocentricLongitude(
      sunsetJD,
      deltaT,
      "apparent",
    );
    const moonGeocentricLatitudeTrue = mb.moonGeocentricLatitude(
      sunsetJD,
      deltaT,
      "true",
    );
    const moonGeocentricLatitudeApparent = mb.moonGeocentricLatitude(
      sunsetJD,
      deltaT,
      "apparent",
    );

    const moonGeocentricRightAscension = mo.moonGeocentricRightAscension(
      sunsetJD,
      deltaT,
    );
    const moonGeocentricDeclination = mo.moonGeocentricDeclination(
      sunsetJD,
      deltaT,
    );

    const moonGeocentricGreenwichHourAngle = mo.moonGeocentricGreenwichHourAngle(sunsetJD, deltaT);

    const moonGeocentricLocalHourAngle = mo.moonGeocentricLocalHourAngel(
      sunsetJD,
      deltaT,
      gLon,
    );

    const moonGeocentricAzimuth = mo.moonGeocentricAzimuth(
      sunsetJD,
      deltaT,
      gLon,
      gLat,
    );
    const moonGeocentricAltitude = mo.moonGeocentricAltitude(
      sunsetJD,
      deltaT,
      gLon,
      gLat,
    );

    const moonGeocentricDistanceAU = md.moonGeocentricDistance(
      sunsetJD,
      deltaT,
      "AU",
    );
    const moonGeocentricDistanceKM = md.moonGeocentricDistance(
      sunsetJD,
      deltaT,
      "KM",
    );
    const moonGeocentricDistanceER = md.moonGeocentricDistance(
      sunsetJD,
      deltaT,
      "ER",
    );

    const moonGeocentricSemidiameter = mo.moonGeocentricSemidiameter(
      sunsetJD,
      deltaT,
    );
    const moonEquatorialHorizontalParallax = mo.moonEquatorialHorizontalParallax(sunsetJD, deltaT);

    const moonGeocentricPhaseAngle = mo.moonGeocentricPhaseAngle(
      sunsetJD,
      deltaT,
    );
    const moonGeocentricDiskIlluminatedFraction = mo.moonGeocentricDiskIlluminatedFraction(sunsetJD, deltaT);

    const moonGeocentricBrightLimbAngle = mo.moonGeocentricBrightLimbAngle(sunsetJD, deltaT);

    //Data Bulan Toposentris
    const moonTopocentricLongitudeApparent = mo.moonTopocentricLongitude(
      sunsetJD,
      deltaT,
      gLon,
      gLat,
      elev,
    );
    const moonTopocentricLatitudeApparent = mo.moonTopocentricLatitude(
      sunsetJD,
      deltaT,
      gLon,
      gLat,
      elev,
    );

    const moonTopocentricRightAscension = mo.moonTopocentricRightAscension(sunsetJD, deltaT, gLon, gLat, elev);

    const moonTopocentricDeclination = mo.moonTopocentricDeclination(
      sunsetJD,
      deltaT,
      gLon,
      gLat,
      elev,
    );

    const moonTopocentricGreenwichHourAngle = mo.moonTopocentricGreenwichHourAngle(sunsetJD, deltaT, gLon, gLat, elev);

    const moonTopocentricLocalHourAngle = mo.moonTopocentricLocalHourAngel(sunsetJD, deltaT, gLon, gLat, elev);

    const moonTopocentricSemidiameter = mo.moonTopocentricSemidiameter(
      sunsetJD,
      deltaT,
      gLon,
      gLat,
      elev,
    );

    const moonTopocentricPhaseAngle = mo.moonTopocentricPhaseAngle(
      sunsetJD,
      deltaT,
      gLon,
      gLat,
      elev,
    );
    const moonTopocentricDiskIlluminatedFraction = mo.moonTopocentricDiskIlluminatedFraction(
          sunsetJD,
          deltaT,
          gLon,
          gLat,
          elev,
        );
    const moonTopocentricBrightLimbAngle = mo.moonTopocentricBrightLimbAngle(sunsetJD, deltaT, gLon, gLat, elev);

    const moonTopocentricAzimuth = mo.moonTopocentricAzimuth(
      sunsetJD,
      deltaT,
      gLon,
      gLat,
      elev,
    );

    const moonTopocentricAltitudeAirlessUpper = mo.moonTopocentricAltitude(
          sunsetJD,
          deltaT,
          gLon,
          gLat,
          elev,
          pres,
          temp,
          "htu",
        );

    const moonTopocentricAltitudeAirlessCenter = mo.moonTopocentricAltitude(
          sunsetJD,
          deltaT,
          gLon,
          gLat,
          elev,
          pres,
          temp,
          "htc",
        );

    const moonTopocentricAltitudeAirlessLower = mo.moonTopocentricAltitude(
          sunsetJD,
          deltaT,
          gLon,
          gLat,
          elev,
          pres,
          temp,
          "htl",
        );

    const moonTopocentricAltitudeApparentsUpper = mo.moonTopocentricAltitude(
          sunsetJD,
          deltaT,
          gLon,
          gLat,
          elev,
          pres,
          temp,
          "htau",
        );

    const moonTopocentricAltitudeApparentCenter = mo.moonTopocentricAltitude(
          sunsetJD,
          deltaT,
          gLon,
          gLat,
          elev,
          pres,
          temp,
          "htac",
        );

    const moonTopocentricAltitudeApparentLower = mo.moonTopocentricAltitude(
          sunsetJD,
          deltaT,
          gLon,
          gLat,
          elev,
          pres,
          temp,
          "htal",
        );

    const moonTopocentricAltitudeObserveredUpper = mo.moonTopocentricAltitude(
          sunsetJD,
          deltaT,
          gLon,
          gLat,
          elev,
          pres,
          temp,
          "htou",
        );

    const moonTopocentricAltitudeObserveredCenter = mo.moonTopocentricAltitude(
          sunsetJD,
          deltaT,
          gLon,
          gLat,
          elev,
          pres,
          temp,
          "htoc",
        );

    const moonTopocentricAltitudeObserveredLower = mo.moonTopocentricAltitude(
          sunsetJD,
          deltaT,
          gLon,
          gLat,
          elev,
          pres,
          temp,
          "htol",
        );

    const elongGeo = mo.moonSunGeocentricElongation(sunsetJD, deltaT);

    const elongTopo = mo.moonSunTopocentricElongation(
      sunsetJD,
      deltaT,
      gLon,
      gLat,
      elev,
    );

    const relAltGeo =
        moonGeocentricAltitude + Math.abs(sunGeocentricAltitude);

    const relAltTopo =
        moonTopocentricAltitudeAirlessCenter +
        Math.abs(sunTopocentricAltitudeAirlessCenter);

    const crescentGeo =
        mo.moonGeocentricSemidiameter(sunsetJD, deltaT) *
        (1 - Math.cos(mf.rad(elongGeo)));

    const crescentTopo =
        mo.moonTopocentricSemidiameter(sunsetJD, deltaT, gLon, gLat, elev) *
        (1 - Math.cos(mf.rad(elongTopo)));

    const qOdeh =
        relAltTopo -
        (-0.1018 * Math.pow((crescentTopo * 60), 3) +
            0.7319 * Math.pow((crescentTopo * 60), 2) -
            6.3226 * (crescentTopo * 60) +
            7.1651);

    let bestTime;

    if (moonsetJD != null) {
      bestTime =
           parseFloat(jd.jdkm(sunsetJD, tmZn, "JAMDES")) +
          4 / 9 * ((moonsetJD - sunsetJD) * 24.0);
    }

    // ===================
    // KRITERIA
    // ===================

    const imkanMabimsStatus =
        (moonTopocentricAltitudeObserveredCenter >= 3.0 && elongGeo >= 6.4)
        ? 1.0
        : 2.0;

    const imkanTurkiStatus =
        (moonGeocentricAltitude >= 5.0 && elongGeo >= 8) ? 1.0 : 2.0;

    const wujudHilalStatus =
        (moonTopocentricAltitudeObserveredUpper > 0.0) ? 1.0 : 2.0;

    // const awalBulanJD =
    //     (Math.floor((geojdIjtimak + 0.5 + tmZn / 24)) - tmZn / 24.0) +
    //     (optKriteria == 1 ? imkanStatus : wujudStatus);

    return new HisabAwalBulanResult({
      jd: sunsetJD,
      deltaT: deltaT,
      geojdIjtimak: geojdIjtimak2,
      topojdIjtimak: topojdIjtimak,
      sunsetJD: sunsetJD,
      moonsetJD: moonsetJD,
      imkanMabimsStatus: imkanMabimsStatus,
      imkanTurkiStatus: imkanTurkiStatus,
      wujudHilalStatus: wujudHilalStatus,

      // =====================
      // SUN GEO
      // =====================
      sunGeo: new SunDataGeo({
        longitudeTrue: sunGeocentricLongitudeTrue,
        longitudeApparent: sunGeocentricLongitudeApparent,
        latitudeTrue: sunGeocentricLatitudeTrue,
        latitudeApparent: sunGeocentricLatitudeApparent,

        rightAscension: sunGeocentricRightAscension,
        declination: sunGeocentricDeclination,

        greenwichApparentSiderealTime: greenwichApparentSiderealTime,
        localApparentSiderealTime: localApparentSiderealTime,

        greenwichHourAngle: sunGeocentricGreenwichHourAngle,
        localHourAngle: sunGeocentricLocalHourAngle,

        distanceAU: sunGeocentricDistanceAU,
        distanceKm: sunGeocentricDistanceKM,
        distanceER: sunGeocentricDistanceER,
        semidiameter: sunGeocentricSemidiameter,
        horizontalParallax: sunEquatorialHorizontalParallax,

        azimuth: sunGeocentricAzimuth,
        altitude: sunGeocentricAltitude,
      }),

      // =====================
      // SUN TOPO
      // =====================
      sunTopo: new SunDataTopo({
        longitudeApparent: sunTopocentricLongitudeApparent,
        latitudeApparent: sunTopocentricLatitudeTrue,

        rightAscension: sunTopocentricRightAscension,
        declination: sunTopocentricDeclination,

        semidiameter: sunTopocentricSemidiameter,
        greenwichHourAngle: sunTopocentricGreenwichHourAngle,
        localHourAngle: sunTopocentricLocalHourAngle,

        azimuth: sunTopocentricAzimuth,
        altitudeAirlessUpper: sunTopocentricAltitudeAirlessUpper,
        altitudeAirlessCenter: sunTopocentricAltitudeAirlessCenter,
        altitudeAirlessLower: sunTopocentricAltitudeAirlessLower,

        altitudeApparentUpper: sunTopocentricAltitudeApparentsUpper,
        altitudeApparentCenter: sunTopocentricAltitudeApparentCenter,
        altitudeApparentLower: sunTopocentricAltitudeApparentLower,

        altitudeObserveredUpper: sunTopocentricAltitudeObserveredUpper,
        altitudeObserveredCenter: sunTopocentricAltitudeObserveredCenter,
        altitudeObserveredLower: sunTopocentricAltitudeObserveredLower,
      }),

      // =====================
      // MOON GEO
      // =====================
      moonGeo: new MoonDataGeo({
        longitudeTrue: moonGeocentricLongitudeTrue,
        longitudeApparent: moonGeocentricLongitudeApparent,
        latitudeTrue: moonGeocentricLatitudeTrue,
        latitudeApparent: moonGeocentricLatitudeApparent,

        rightAscension: moonGeocentricRightAscension,
        declination: moonGeocentricDeclination,

        distanceAU: moonGeocentricDistanceAU,
        distanceKm: moonGeocentricDistanceKM,
        distanceER: moonGeocentricDistanceER,

        greenwichHourAngle: moonGeocentricGreenwichHourAngle,
        localHourAngle: moonGeocentricLocalHourAngle,
        horizontalParallax: moonEquatorialHorizontalParallax,
        semidiameter: moonGeocentricSemidiameter,

        azimuth: moonGeocentricAzimuth,
        altitude: moonGeocentricAltitude,

        phaseAngle: moonGeocentricPhaseAngle,
        diskIlluminationFraction: moonGeocentricDiskIlluminatedFraction,
        brightLimbAngle: moonGeocentricBrightLimbAngle,
      }),

      // =====================
      // MOON TOPO
      // =====================
      moonTopo: new MoonDataTopo({
        longitudeApparent: moonTopocentricLongitudeApparent,
        latitudeApparent: moonTopocentricLatitudeApparent,

        rightAscension: moonTopocentricRightAscension,
        declination: moonTopocentricDeclination,

        greenwichHourAngle: moonTopocentricGreenwichHourAngle,
        localHourAngle: moonTopocentricLocalHourAngle,
        horizontalParallax: moonEquatorialHorizontalParallax,
        semidiameter: moonTopocentricSemidiameter,

        azimuth: moonTopocentricAzimuth,

        altitudeAirlessUpper: moonTopocentricAltitudeAirlessUpper,
        altitudeAirlessCenter: moonTopocentricAltitudeAirlessCenter,
        altitudeAirlessLower: moonTopocentricAltitudeAirlessLower,

        altitudeApparentUpper: moonTopocentricAltitudeApparentsUpper,
        altitudeApparentCenter: moonTopocentricAltitudeApparentCenter,
        altitudeApparentLower: moonTopocentricAltitudeApparentLower,

        altitudeObservedUpper: moonTopocentricAltitudeObserveredUpper,
        altitudeObservedCenter: moonTopocentricAltitudeObserveredCenter,
        altitudeObservedLower: moonTopocentricAltitudeObserveredLower,

        phaseAngle: moonTopocentricPhaseAngle,
        diskIlluminationFraction: moonTopocentricDiskIlluminatedFraction,
        brightLimbAngle: moonTopocentricBrightLimbAngle,
      }),

      // =====================
      // HILAL DATA
      // =====================
      hilal: new HilalData({
        elongationGeo: elongGeo,
        elongationTopo: elongTopo,
        crescentWidthGeo: crescentGeo,
        crescentWidthTopo: crescentTopo,
        relativeAltitudeGeo: relAltGeo,
        relativeAltitudeTopo: relAltTopo,
        qOdeh: qOdeh,
        bestTime: bestTime,
        imkanMabimsStatus: imkanMabimsStatus,
        imkanTurkiStatus: imkanTurkiStatus,
        wujudHilalStatus: wujudHilalStatus,
        //awalBulanJD: awalBulanJD,
      }),
    });
  }
}

