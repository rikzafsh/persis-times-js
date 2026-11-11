/**
 * peta_visibilitas_service.js — Visibilitas hilal per lokasi: Odeh, Yallop, SAAO, Maunder, Bruin, MABIMS, Turki/KHGT (dasar peta dunia).
 * Sumber Dart: service/peta_visibilitas_service.dart
 * Kelas: PetaVisibilitasService
 * Fungsi: preHitung, hitung
 */
class PetaVisibilitasService {
  // Objek astronomi dibuat sekali, dipakai ulang
  _mo = new MoonFunction();
  _sn = new SunFunction();
  _dt = new DynamicalTime();
  _mf = new MathFunction();

  // ── Pre-hitung JD Ijtimak — panggil ini SEKALI sebelum loop ───
  // Kembalikan (jdIjtimak, deltaT) yang bisa di-cache di luar
  preHitung({blnH, thnH} = {}) {
    const jd1 = this._mo.geocentricConjunction(blnH, thnH, 0.0, "Ijtima");
    const dT = this._dt.deltaT(Math.floor(jd1) + 0.5);
    const jd2 = this._mo.geocentricConjunction(blnH, thnH, dT, "Ijtima");
    return {jdIjtimak: jd2, deltaT: dT};
  }

  // ── Hitung satu titik koordinat ────────────────────────────────
  // [jdIjtimak] & [deltaT]: opsional — jika tidak diisi, dihitung otomatis
  // Untuk loop peta: isi dari hasil preHitung() agar tidak hitung ulang
  hitung({blnH, thnH, gLon, gLat, tmZn, tbhHari, jdIjtimak, deltaT} = {}) {
    // Gunakan nilai yang dipass, atau this.hitung sendiri jika null
    let geojdIjtimak2;
    let dT;

    if (jdIjtimak != null && deltaT != null) {
      // Pakai nilai yang sudah dihitung di luar → hemat 2 panggilan berat
      geojdIjtimak2 = jdIjtimak;
      dT = deltaT;
    } else {
      // Hitung sendiri (perilaku lama, backward-compatible)
      const jd1 = this._mo.geocentricConjunction(blnH, thnH, 0.0, "Ijtima");
      dT = this._dt.deltaT(Math.floor(jd1) + 0.5);
      geojdIjtimak2 = this._mo.geocentricConjunction(blnH, thnH, dT, "Ijtima");
    }

    const sunsetJD = this._sn.jdGhurubSyams(
      geojdIjtimak2 + tbhHari,
      gLat,
      gLon,
      0.0,
      tmZn,
    );

    const moonGeoAlt = this._mo.moonGeocentricAltitude(
      sunsetJD,
      dT,
      gLon,
      gLat,
    );

    const moonTopoAirlessCenter = this._mo.moonTopocentricAltitude(
      sunsetJD,
      dT,
      gLon,
      gLat,
      0.0,
      1010.0,
      10.0,
      "htc",
    );

    const sunTopoAirlessCenter = this._sn.sunTopocentricAltitude(
      sunsetJD,
      dT,
      gLon,
      gLat,
      0.0,
      1010.0,
      10.0,
      "htc",
    );

    const moonTopoObsCenter = this._mo.moonTopocentricAltitude(
      sunsetJD,
      dT,
      gLon,
      gLat,
      0.0,
      1010.0,
      10.0,
      "htoc",
    );

    const elongGeo = this._mo.moonSunGeocentricElongation(sunsetJD, dT);
    const elongTopo = this._mo.moonSunTopocentricElongation(
      sunsetJD,
      dT,
      gLon,
      gLat,
      0.0,
    );

    const arcv = moonTopoAirlessCenter + Math.abs(sunTopoAirlessCenter);

    const sd = this._mo.moonTopocentricSemidiameter(
      sunsetJD,
      dT,
      gLon,
      gLat,
      0.0,
    );
    const crescentWidthDeg = sd * (1 - Math.cos(this._mf.rad(elongTopo)));
    const crescentWidthArcmin = crescentWidthDeg * 60;

    const moonHP = this._mo.moonEquatorialHorizontalParallax(sunsetJD, dT);

    const moonAz = this._mo.moonTopocentricAzimuth(
      sunsetJD,
      dT,
      gLon,
      gLat,
      0.0,
    );
    const sunAz = this._sn.sunTopocentricAzimuth(
      sunsetJD,
      dT,
      gLon,
      gLat,
      0.0,
    );
    const daz = Math.abs((moonAz - sunAz));

    // ── Odeh ──────────────────────────────────────────────────────
    const qOdeh =
        arcv -
        (-0.1018 * Math.pow(crescentWidthArcmin, 3) +
            0.7319 * Math.pow(crescentWidthArcmin, 2) -
            6.3226 * crescentWidthArcmin +
            7.1651);

    // ── Yallop ────────────────────────────────────────────────────
    const wPrime =
        0.27245 *
        moonHP *
        (1 + Math.sin(this._mf.rad(moonGeoAlt)) * Math.sin(this._mf.rad(moonHP))) *
        (1 - Math.cos(this._mf.rad(elongTopo)));

    const qYallop =
        (arcv -
            (11.8371 -
                6.3226 * wPrime +
                0.7319 * Math.pow(wPrime, 2) -
                0.1018 * Math.pow(wPrime, 3))) /
        10;

    // ── SAAO ──────────────────────────────────────────────────────
    const dalt1 = 6.36 - 0.0928 * daz - 0.0048 * Math.pow(daz, 2);
    const dalt2 = 8.257 - 0.0928 * daz - 0.0048 * Math.pow(daz, 2);
    const moonLowerLimb = moonTopoAirlessCenter - sd;

    let saaoStatus;
    if (moonLowerLimb > dalt2) {
      saaoStatus = "Terlihat dengan mata telanjang";
    } else if (moonLowerLimb >= dalt1) {
      saaoStatus = "Mungkin terlihat dengan alat optik";
    } else {
      saaoStatus = "Tidak terlihat";
    }

    // ── Maunder ───────────────────────────────────────────────────
    const maunderMin = 11 - (daz / 20) - (Math.pow(daz, 2) / 100);
    const maunderVisible = arcv > maunderMin;

    // ── Bruin ─────────────────────────────────────────────────────
    const bruinMin =
        12.4023 -
        9.4878 * crescentWidthDeg +
        3.9512 * Math.pow(crescentWidthDeg, 2) -
        0.5632 * Math.pow(crescentWidthDeg, 3);
    const bruinVisible = arcv > bruinMin;

    // ── IR MABIMS ─────────────────────────────────────────────────
    const mabimsVisible = (elongGeo >= 6.4) && (moonTopoObsCenter >= 3.0);

    // ── Turki/KHGT ────────────────────────────────────────────────
    const turkiVisible = (elongGeo >= 8.0) && (moonGeoAlt >= 5.0);

    // ── Zona ──────────────────────────────────────────────────────
    let zonaOdeh;
    if (qOdeh >= 5.65) {
      zonaOdeh = "A (Mata telanjang)";
    } else if (qOdeh >= 2.00) {
      zonaOdeh = "B (Alat optik, mungkin mata)";
    } else if (qOdeh >= -0.96) {
      zonaOdeh = "C (Alat optik saja)";
    } else {
      zonaOdeh = "D (Tidak terlihat)";
    }

    let zonaYallop;
    if (qYallop > 0.216) {
      zonaYallop = "A (Mudah dilihat)";
    } else if (qYallop > -0.014) {
      zonaYallop = "B (Cuaca cerah)";
    } else if (qYallop > -0.160) {
      zonaYallop = "C (Perlu alat optik)";
    } else if (qYallop > -0.232) {
      zonaYallop = "D (Perlu alat optik)";
    } else if (qYallop > -0.293) {
      zonaYallop = "E (Tidak terlihat)";
    } else {
      zonaYallop = "F (Di bawah limit Danjon)";
    }

    return new PetaVisibilitasHilalResult({
      geojdIjtimak: geojdIjtimak2,
      sunsetJD: sunsetJD,
      elongGeo: elongGeo,
      elongasi: elongTopo,
      arcv: arcv,
      daz: daz,
      crescentWidth: crescentWidthArcmin,
      moonAltitude: moonTopoAirlessCenter,
      moonTopoAltitudeObsCenter: moonTopoObsCenter,
      moonGeoAltitude: moonGeoAlt,
      moonLowerLimbAltitude: moonLowerLimb,
      qOdeh: qOdeh,
      zonaOdeh: zonaOdeh,
      wPrime: wPrime,
      qYallop: qYallop,
      zonaYallop: zonaYallop,
      dalt1: dalt1,
      dalt2: dalt2,
      saaoStatus: saaoStatus,
      maunderMinimum: maunderMin,
      maunderVisible: maunderVisible,
      bruinMinimum: bruinMin,
      bruinVisible: bruinVisible,
      mabimsVisible: mabimsVisible,
      mabimsStatus: mabimsVisible
          ? "Terlihat (Memenuhi kriteria MABIMS)"
          : "Tidak terlihat (Tidak memenuhi kriteria MABIMS)",
      turkiVisible: turkiVisible,
      turkiStatus: turkiVisible
          ? "Terlihat (Memenuhi kriteria Turki/KHGT)"
          : "Tidak terlihat (Tidak memenuhi kriteria Turki/KHGT)",
    });
  }
}
