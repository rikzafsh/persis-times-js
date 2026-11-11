/**
 * calendar_service.js — Kalender Hijriah (MABIMS, Ummul Qura, Wujudul Hilal, Turki) dari hisab awal bulan.
 * Sumber Dart: service/calendar_service.dart
 * Kelas: Lokasi, Lokasi2, CalendarService
 * Fungsi: abqMabims, abqWujudulHilal, abqUmmulQura, abqTurki, serviceKalenderHijriahMABIMS, serviceKalenderHijriahWH, serviceKalenderHijriahUQ, serviceKalenderHijriahTURKI
 */
class Lokasi { constructor(gLat,gLon,tmZn){this.gLat=gLat;this.gLon=gLon;this.tmZn=tmZn;} }
class Lokasi2 extends Lokasi {}










//import 'package:myhisab/service/moon_service.dart';

//const mf = new MathFunction();
class CalendarService {
  julDay = new JulianDay();
  dyTme = new DynamicalTime();
  sn = new SunFunction();
  mf = new MathFunction();
  ml = new MoonLongitude();
  mb = new MoonLatitude();
  md = new MoonDistance();
  mo = new MoonFunction();

  // Fungsi Hisab Awal Bulan Hijriah Menurut MABIMS

  abqMabims(blnH, thnH) {
    const lokasi = [
      //A. Empat Titik Paling Barat (Utara-Selatan)
      new Lokasi(
        5 + 54 / 60 + 26.32 / 3600,
        95 + 13 / 60 + 1.01 / 3600,
        7,
      ), // 1. Sabang, Banda Aceh

      new Lokasi(
        -(5 + 22 / 60 + 28.80 / 3600),
        102 + 13 / 60 + 54.86 / 3600,
        7,
      ), // 2. Enggano, Bengkulu Utara

      new Lokasi(
        4 + 47 / 60 + 45.14 / 3600,
        108 + 1 / 60 + 16.46 / 3600,
        7,
      ), // 3. Natuna, Kepulauan Riau

      new Lokasi(
        -(7 + 4 / 60 + 26.1 / 3600),
        106 + 31 / 60 + 53.71 / 3600,
        7,
      ), // 4. Cibeas, Jawa Barat
      //B. Poros Tengah (Selatan-Utara)
      new Lokasi(
        -(8 + 50 / 60 + 59.7 / 3600),
        115 + 9 / 60 + 41.73 / 3600,
        8,
      ), // 5. Pecatu, Bali

      new Lokasi(
        4 + 9 / 60 + 9.62 / 3600,
        117 + 42 / 60 + 3.47 / 3600,
        8,
      ), // 6. Sebatik, Kalimantan Utara
    ];

    const sn = new SunFunction();
    const mo = new MoonFunction();

    const jdNM = mo.geocentricConjunction(blnH, thnH, 0.0, "Ijtimak");
    const delT = this.dyTme.deltaT(jdNM);
    const jdNM2 = mo.geocentricConjunction(blnH, thnH, delT, "Ijtimak");

    let irMabims = 2; // Default, akan diganti jika syarat terpenuhi
    let jdGSBase = sn.jdGhurubSyams(
      jdNM2,
      lokasi[0].gLat,
      lokasi[0].gLon,
      10.0,
      lokasi[0].tmZn,
    );
    let tmZnBase = lokasi[0].tmZn;

    for (const loc of lokasi) {
      const jdGS = sn.jdGhurubSyams(jdNM2, loc.gLat, loc.gLon, 10.0, loc.tmZn);
      const tHlal00 = mo.moonTopocentricAltitude(
        jdGS,
        delT,
        loc.gLon,
        loc.gLat,
        10.0,
        1010.0,
        10.0,
        "htoc",
      );
      const elong00 = mo.moonSunGeocentricElongation(jdGS, delT);

      if (elong00 >= 6.4 && tHlal00 >= 3) {
        irMabims = 1;
        jdGSBase = jdGS; // ✅ pakai sunset lokasi yang memenuhi syarat
        tmZnBase = loc.tmZn;
        break;
      }
    }

    //const jdAbqMabims =((this.mf.floor(jdNM2 + 0.5 + 7 / 24.0)) - 0.0 / 24.0) + irMabims;

    const jdAbqMabims =
        (this.mf.floor(jdGSBase + 0.5 + tmZnBase / 24.0)) -
        0.5 +
        tmZnBase / 24.0 +
        irMabims;

    return Math.ceil(jdAbqMabims);
  }

  // Fungsi Hisab Awal Bulan Hijriah Menurut Wujudul Hilal
  abqWujudulHilal(blnH, thnH) {
    let gLon = 110 + 21 / 60;
    let gLat = -(7 + 48 / 60);
    let tmZn = 7;
    let elev = 30;

    const jdNM = this.mo.geocentricConjunction(blnH, thnH, 0.0, "Ijtimak");
    const delT = this.dyTme.deltaT(jdNM);
    const jdNM2 = this.mo.geocentricConjunction(blnH, thnH, delT, "Ijtimak");

    const jdGS = this.sn.jdGhurubSyams(jdNM2, gLat, gLon, elev, tmZn);
    const tHlal00 = this.mo.moonTopocentricAltitude(
      jdGS,
      delT,
      gLon,
      gLat,
      10.0,
      1010.0,
      10.0,
      "htou",
    );

    let wh = 2;

    if (tHlal00 > 0 && jdNM2 < jdGS) {
      wh = 1;
    }

    //const jdAbqWH = ((this.mf.floor(jdNM2 + 0.5 + 7 / 24.0)) - 0.0 / 24.0) + wh;

    const jdAbqWH =
        (this.mf.floor(jdGS + 0.5 + tmZn / 24.0)) - 0.5 + tmZn / 24.0 + wh;

    return Math.ceil(jdAbqWH);
  }

  // Method Hisab Awal Bulan Hijriah Menurut Kalender Ummul Qura
  abqUmmulQura(blnH, thnH) {
    let gLon = (39 + 49 / 60 + 34.27 / 3600);
    let gLat = (21 + 25 / 60 + 21.02 / 3600);
    let tmZn = 3;
    let elev = 304;

    const jdNM = this.mo.geocentricConjunction(blnH, thnH, 0.0, "Ijtimak");
    const delT = this.dyTme.deltaT(jdNM);
    const jdNM2 = this.mo.geocentricConjunction(blnH, thnH, delT, "Ijtimak");
    const jdGS = this.sn.jdGhurubSyams(jdNM2, gLat, gLon, elev, tmZn);

    const tglM =  parseInt(this.julDay.jdkm(jdGS, tmZn, "TGLM")); //Tanggal Dalam LCT
    const blnM =  parseInt(this.julDay.jdkm(jdGS, tmZn, "BLNM")); //Bulan dalam LCT
    const thnM =  parseInt(this.julDay.jdkm(jdGS, tmZn, "THNM")); //Tahun dalam LCT

    const moonSet = this.mo.moonTransitRiseSet(
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

    const sunSet =  parseFloat(this.julDay.jdkm(jdGS, tmZn, "JAMDES"));

    const uQ = (moonSet > sunSet && jdNM2 < jdGS) ? 1 : 2;

    //const jdAbqUQ = ((this.mf.floor(jdNM2 + 0.5 + 0.0 / 24.0)) - 0.0 / 24.0) + uQ;

    const jdAbqUQ =
        (this.mf.floor(jdGS + 0.5 + tmZn / 24.0)) - 0.5 + tmZn / 24.0 + uQ;

    return Math.ceil(jdAbqUQ);
  }

  // Fungsi Hisab Awal Bulan Hijriah Menurut IR TURKI/KHGT
  abqTurki(blnH, thnH) {
    const lokasi = [
      new Lokasi2(65, -166.7, -9),
      new Lokasi2(54.47, -164.91, -9),
      new Lokasi2(60, -139.6304, -9),
      new Lokasi2(55.9182, -133.8442, -8),
      new Lokasi2(50, -127.45, -8),
      new Lokasi2(47, -124.21, -8),
      new Lokasi2(34, -118.92, -8),
      new Lokasi2(33, -117.33, -8),
      new Lokasi2(20, -105.5555, -6),
      new Lokasi2(14, -91.557, -6),
      new Lokasi2(13, -87.62, -6),
      new Lokasi2(9, -83.65, -6),
      new Lokasi2(7.25, -80.9333, -5),
      new Lokasi2(7, -77.692, -5),
      new Lokasi2(3, -77.674, -5),
      new Lokasi2(0, -80.1, -5),
      new Lokasi2(-3, -79.83, -5),
      new Lokasi2(-8, -79.235, -5),
      new Lokasi2(-16, -74.0254, -4),
      new Lokasi2(-24, -70.5235, -4),
      new Lokasi2(-32, -71.5397, -4),
      new Lokasi2(-40, -73.726, -4),
      new Lokasi2(-44, -73.2683, -3),
      new Lokasi2(-49, -75.6755, -3),
      new Lokasi2(-55.9385, -67.2877, -3),
    ];

    // ── 1. Ijtimak ──────────────────────────────────────────────────────────
    const jdNM = this.mo.geocentricConjunction(blnH, thnH, 0.0, "Ijtimak"); // UT
    const dT = this.dyTme.deltaT(jdNM);
    const jdNM2 = this.mo.geocentricConjunction(
      blnH,
      thnH,
      dT,
      "Ijtimak",
    ); // UT + ΔT

    // ── 2. Batas 00 UT (dihitung dari jdNM2, sesuai VB) ─────────────────────
    // VB: jd0UT        = Math.Floor(jdNM2 + 0.5) - 0.5
    //     jd0UTNextDay = jd0UT + 1
    const jd0UTNextDay = Math.floor((jdNM2 + 0.5)) - 0.5 + 1.0;

    // ── 3. Loop lokasi ───────────────────────────────────────────────────────
    let irTurki = 2;
    let isBefore00UT = false;
    let isAfter00UT = false;

    for (const loc of lokasi) {
      // VB: JDGhurubSyams3 → parameter ke-4 = 0 (mdl), ke-5 = TmZn
      const jdGS = this.sn.jdGhurubSyams2(jdNM, loc.gLat, loc.gLon, 0, loc.tmZn);
      const tHlal = this.mo.moonGeocentricAltitude(jdGS, dT, loc.gLon, loc.gLat);
      const elong = this.mo.moonSunGeocentricElongation(jdGS, dT);

      if (elong >= 8 && tHlal >= 5) {
        if (jdGS < jd0UTNextDay) {
          // ✅ Kondisi terpenuhi sebelum 00 UT → langsung keluar
          isBefore00UT = true;
          irTurki = 1;
          break;
        } else {
          // Kondisi terpenuhi setelah 00 UT → catat, lanjut loop
          isAfter00UT = true;
        }
      }
    }

    // ── 4. Fallback: cek fajar New Zealand ──────────────────────────────────
    // Hanya dijalankan jika tidak ada lokasi yang memenuhi sebelum 00 UT
    // tetapi ada yang memenuhi setelah 00 UT  (sesuai VB)
    if (!isBefore00UT && isAfter00UT) {
      // Perkiraan fajar di New Zealand
      // VB: JDFP = Math.Floor(jdNM2 + 0.5) - 0.5 + 17/24
      const jdFP = Math.floor((jdNM2 + 0.5)) - 0.5 + 17.0 / 24.0;

      const lonNZ = 174 + 48 / 60.0; //  174.8°
      const latNZ = -(41 + 19 / 60.0); // -41.317°
      const tzNZ = 12.0;

      const kwd = (lonNZ - (tzNZ * 15)) / 15.0;

      const dek = this.sn.sunGeocentricDeclination(jdFP, 0);
      const eqt = this.sn.equationOfTime(jdFP, 0);

      // Ambil nilai hmF dari settings ( default -18,{VB: My.Settings.tbTgSubhVal})
      const hmF = -18.0;

      const hAm = this.mf.deg(
        Math.acos(
          (Math.sin(this.mf.rad(hmF)) -
                  Math.sin(this.mf.rad(latNZ)) * Math.sin(this.mf.rad(dek))) /
              (Math.cos(this.mf.rad(latNZ)) * Math.cos(this.mf.rad(dek))),
        ),
      );

      const awf = 12.0 - eqt - hAm / 15.0 - kwd;

      // VB: AWFUTC = ModFDiv((AWF - 12), 24)  →  Dart: mod(awf - 12, 24)
      const awfUTC = this.mf.mod(awf - 12.0, 24.0);

      // VB: JDFUTC = Math.Floor(jdNM2 + 0.5) - 0.5 + AWFUTC / 24
      const jdFUTC = Math.floor((jdNM2 + 0.5)) - 0.5 + awfUTC / 24.0;

      // VB: If jdNM2 < JDFUTC → IRTurki = 1, Else → IRTurki = 2
      irTurki = (jdNM2 < jdFUTC) ? 1 : 2;
    }

    // ── 5. ABQ final ─────────────────────────────────────────────────────────
    // VB: abq = (Math.Floor(jdNM2 + 0.5 + 0.0/24.0) - 0.0/24.0) + IRTurki
    //         = Math.Floor(jdNM2 + 0.5) + IRTurki
    const abq = Math.floor((jdNM2 + 0.5)) + (irTurki);

    return abq;
  }

  namaBulanHijriah = [
    "Al-Muharram",
    "Shafar",
    "Rabiul Awwal",
    "Rabiul Akhir",
    "Jumadal Ula",
    "Jumadal Akhirah",
    "Rajab",
    "Syaban",
    "Ramadhan",
    "Syawwal",
    "Zulqadah",
    "Zulhijjah",
  ];

  serviceKalenderHijriahMABIMS(tglM, blnM, thnM) {
    const jd = this.julDay.kmjd(tglM, blnM, thnM);
    const jdTarget = this._jdToCJDN(jd);

    const thnH =  parseInt(
      this.julDay
          .cjdnkh(this._jdToCJDN(jd),{hCalE: 2,hCalL: 2,optResult: "THNH"})
          .toString(),
    );

    const abqList = [];

    // Tambahkan buffer di awal dan akhir agar semua tanggal ter-cover
    abqList.push(ab.abqMabims(12, thnH - 1)); // Zulhijjah thn lalu

    for (let blnH = 1; blnH <= 12; blnH++) {
      abqList.push(ab.abqMabims(blnH, thnH));
    }

    abqList.push(ab.abqMabims(1, thnH + 1)); // Muharram thn depan
    abqList.push(
      ab.abqMabims(2, thnH + 1),
    ); // ✅ FIX: Tambahkan Safar thn depan sebagai batas akhir

    // Loop hari dari tiap ABQ ke ABQ berikutnya
    for (let i = 0; i < abqList.length - 1; i++) {
      const cjdnStart = this._jdToCJDN(abqList[i]);
      const cjdnEnd = this._jdToCJDN(abqList[i + 1]);

      // Mapping index ke bulan/tahun yang benar
      const blnH = (function(){ const __v = i; if (__v === 0) return 12; if (__v === 13) return 1; if (__v === 14) return 2; return i; })();

      const thnHij = (function(){ const __v = i; if (__v === 0) return thnH - 1; if (__v >= 13) return thnH + 1; return thnH; })();

      const namaBlnH = this.namaBulanHijriah[blnH - 1];

      let nomorUrut = 1;
      for (let cjdn = cjdnStart; cjdn < cjdnEnd; cjdn++) {
        if (cjdn == jdTarget) {
          return `${this.julDay.jdkm(this._cjdnToJD(cjdn))} M | ${nomorUrut} ${namaBlnH} ${thnHij} H`;
        }
        nomorUrut++;
      }
    }

    return "Tidak ditemukan";
  }

  serviceKalenderHijriahWH(tglM, blnM, thnM) {
    const jd = this.julDay.kmjd(tglM, blnM, thnM);
    const jdTarget = this._jdToCJDN(jd);

    const thnH =  parseInt(
      this.julDay
          .cjdnkh(this._jdToCJDN(jd),{hCalE: 2,hCalL: 2,optResult: "THNH"})
          .toString(),
    );

    const abqList = [];

    // Tambahkan buffer di awal dan akhir
    abqList.push(ab.abqWujudulHilal(12, thnH - 1)); // Zulhijjah thn lalu

    for (let blnH = 1; blnH <= 12; blnH++) {
      abqList.push(ab.abqWujudulHilal(blnH, thnH));
    }

    abqList.push(ab.abqWujudulHilal(1, thnH + 1)); // Muharram thn depan
    abqList.push(ab.abqWujudulHilal(2, thnH + 1)); // ✅ Safar thn depan (buffer)

    for (let i = 0; i < abqList.length - 1; i++) {
      const cjdnStart = this._jdToCJDN(abqList[i]);
      const cjdnEnd = this._jdToCJDN(abqList[i + 1]);

      const blnH = (function(){ const __v = i; if (__v === 0) return 12; if (__v === 13) return 1; if (__v === 14) return 2; return i; })();

      const thnHij = (function(){ const __v = i; if (__v === 0) return thnH - 1; if (__v >= 13) return thnH + 1; return thnH; })();

      const namaBlnH = this.namaBulanHijriah[blnH - 1];

      let nomorUrut = 1;
      for (let cjdn = cjdnStart; cjdn < cjdnEnd; cjdn++) {
        if (cjdn == jdTarget) {
          return `${this.julDay.jdkm(this._cjdnToJD(cjdn))} M | ${nomorUrut} ${namaBlnH} ${thnHij} H`;
        }
        nomorUrut++;
      }
    }

    return "Tidak ditemukan";
  }

  serviceKalenderHijriahUQ(tglM, blnM, thnM) {
    const jd = this.julDay.kmjd(tglM, blnM, thnM);
    const jdTarget = this._jdToCJDN(jd);

    const thnH =  parseInt(
      this.julDay
          .cjdnkh(this._jdToCJDN(jd),{hCalE: 2,hCalL: 2,optResult: "THNH"})
          .toString(),
    );

    const abqList = [];

    // Tambahkan buffer di awal dan akhir
    abqList.push(ab.abqUmmulQura(12, thnH - 1)); // Zulhijjah thn lalu

    for (let blnH = 1; blnH <= 12; blnH++) {
      abqList.push(ab.abqUmmulQura(blnH, thnH));
    }

    abqList.push(ab.abqUmmulQura(1, thnH + 1)); // Muharram thn depan
    abqList.push(ab.abqUmmulQura(2, thnH + 1)); // ✅ Safar thn depan (buffer)

    for (let i = 0; i < abqList.length - 1; i++) {
      const cjdnStart = this._jdToCJDN(abqList[i]);
      const cjdnEnd = this._jdToCJDN(abqList[i + 1]);

      const blnH = (function(){ const __v = i; if (__v === 0) return 12; if (__v === 13) return 1; if (__v === 14) return 2; return i; })();

      const thnHij = (function(){ const __v = i; if (__v === 0) return thnH - 1; if (__v >= 13) return thnH + 1; return thnH; })();

      const namaBlnH = this.namaBulanHijriah[blnH - 1];

      let nomorUrut = 1;
      for (let cjdn = cjdnStart; cjdn < cjdnEnd; cjdn++) {
        if (cjdn == jdTarget) {
          return `${this.julDay.jdkm(this._cjdnToJD(cjdn))} M | ${nomorUrut} ${namaBlnH} ${thnHij} H`;
        }
        nomorUrut++;
      }
    }

    return "Tidak ditemukan";
  }

  serviceKalenderHijriahTURKI(tglM, blnM, thnM) {
    const jd = this.julDay.kmjd(tglM, blnM, thnM);
    const jdTarget = this._jdToCJDN(jd);

    const thnH =  parseInt(
      this.julDay
          .cjdnkh(this._jdToCJDN(jd),{hCalE: 2,hCalL: 2,optResult: "THNH"})
          .toString(),
    );

    const abqList = [];

    // Tambahkan buffer di awal dan akhir
    abqList.push(ab.abqTurki(12, thnH - 1)); // Zulhijjah thn lalu

    for (let blnH = 1; blnH <= 12; blnH++) {
      abqList.push(ab.abqTurki(blnH, thnH));
    }

    abqList.push(ab.abqTurki(1, thnH + 1)); // Muharram thn depan
    abqList.push(ab.abqTurki(2, thnH + 1)); // ✅ Safar thn depan (buffer)

    for (let i = 0; i < abqList.length - 1; i++) {
      const cjdnStart = this._jdToCJDN(abqList[i]);
      const cjdnEnd = this._jdToCJDN(abqList[i + 1]);

      const blnH = (function(){ const __v = i; if (__v === 0) return 12; if (__v === 13) return 1; if (__v === 14) return 2; return i; })();

      const thnHij = (function(){ const __v = i; if (__v === 0) return thnH - 1; if (__v >= 13) return thnH + 1; return thnH; })();

      const namaBlnH = this.namaBulanHijriah[blnH - 1];

      let nomorUrut = 1;
      for (let cjdn = cjdnStart; cjdn < cjdnEnd; cjdn++) {
        if (cjdn == jdTarget) {
          return `${this.julDay.jdkm(this._cjdnToJD(cjdn))} M | ${nomorUrut} ${namaBlnH} ${thnHij} H`;
        }
        nomorUrut++;
      }
    }

    return "Tidak ditemukan";
  }

  // ── Helper: Konversi JD → CJDN (Chronological Julian Day Number) ──
  // CJDN: integer yang mewakili hari kalender (midnight-to-midnight)
  _jdToCJDN(jd) { return Math.floor((jd + 0.5)); }

  // ── Helper: Konversi CJDN → JD (untuk display) ──
  _cjdnToJD(cjdn) { return (cjdn) - 0.5; }
}

const ab = new CalendarService();   // instans global yang dipakai antarmetode
