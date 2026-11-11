/**
 * julian_day.js — Konversi Kalender Masehi ↔ Julian Day (kmjd, jdkm) dan konversi Hijriah (CJDN).
 * Sumber Dart: core/astronomy/julian_day.dart
 * Kelas: JulianDay
 * Fungsi: kmjd, jdkm, jde, jc, jce, jm, jme, jdkh, khcjdn, cjdnkh
 */
class JulianDay {
  //const dt = new DynamicalTime();
  mf = new MathFunction();

  // Konversi Kalender Masehi ke Julian Day
  kmjd(tglM, blnM, thnM, jamDes = 0.0, timeZone = 0.0) {
    let dd = tglM + ((jamDes - timeZone) / 24.0);
    let mm;
    let yy;

    if (blnM > 2) {
      mm = (blnM);
      yy = (thnM);
    } else {
      mm = (blnM) + 12;
      yy = (thnM) - 1;
    }

    let bb;
    if (((thnM) + (blnM) / 100 + (tglM) / 10000) >=
        1582.1015) {
      let aa = Math.floor((yy / 100));
      bb = 2 - aa + Math.floor((aa / 4));
    } else {
      bb = 0.0;
    }

    let jd =
        Math.floor((365.25 * (yy + 4716))) +
        Math.floor((30.6001 * (mm + 1))) +
        dd +
        bb -
        1524.5;

    return jd;
  }

  // Konversi Julian Day ke Kalender Masehi
  jdkm(jd, tmZn = 0.0, optResult = "") {
    let cjd = jd + 0.5 + tmZn / 24.0;
    let cjdn = Math.floor(cjd);
    let fracD = cjd - cjdn;

    let alpha = Math.floor(((cjdn - 1867216.25) / 36524.25));
    let beta = 1 + alpha - Math.floor((alpha / 4));

    let gc = (cjdn >= 2299161) ? beta : 0.0;

    let a = cjdn + gc;
    let b = a + 1524;
    let c = Math.floor(((b - 122.1) / 365.25));
    let d = Math.floor((365.25 * c));
    let e = Math.floor(((b - d) / 30.6001));

    let tglM = b - d - Math.floor((30.6001 * e));
    let blnM = (e < 14) ? e - 1 : e - 13;
    let thnM = (blnM > 2) ? c - 4716 : c - 4715;

    let jamDes = fracD * 24;

    // Nama hari
    let noHrM = cjdn - 7 * Math.floor((cjdn / 7));
    let nmHrMDt = [
      "Senin",
      "Selasa",
      "Rabu",
      "Kamis",
      "Jum'at",
      "Sabtu",
      "Ahad",
    ];
    let nmHrM = nmHrMDt[Math.trunc(noHrM)];

    // Nama bulan
    let nmBlnMDt = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    let nmBlnM = nmBlnMDt[Math.trunc(blnM) - 1];

    // Jenis penomoran tahun
    let thnMHYNS;
    let thnMAYNS;
    if (thnM > 0) {
      thnMHYNS = `${nmHrM}, ${Math.trunc(tglM)} ${nmBlnM} ${Math.trunc(thnM)} M`;
      thnMAYNS = `${nmHrM}, ${Math.trunc(tglM)} ${nmBlnM} +${Math.trunc(thnM)}`;
    } else {
      thnMHYNS =
          `${nmHrM}, ${Math.trunc(tglM)} ${nmBlnM} ${(Math.trunc(Math.abs(thnM)) + 1)} SM`;
      thnMAYNS = `${nmHrM}, ${Math.trunc(tglM)} ${nmBlnM} ${Math.trunc(thnM)}`;
    }

    switch (optResult.replaceAll(" ", "").toUpperCase()) {
      case "TGLM":
      case "TGL":
        return Math.trunc(tglM).toString();
      case "BLNM":
      case "BLN":
        return Math.trunc(blnM).toString();
      case "THNM":
      case "THN":
        return Math.trunc(thnM).toString();
      case "NMBLNM":
      case "BULAN":
        return nmBlnM;
      case "NMHRM":
      case "HARI":
      case "HR":
        return nmHrM;
      case "THNMHYNS":
        return thnMHYNS;
      case "THNMAYNS":
        return thnMAYNS;
      case "JAMDES":
      case "JAMDESIMAL":
      case "JAMD":
        return jamDes.toString();
      case "FRACDAY":
      case "PECAHANHARI":
        return fracD.toString();
      default:
        return `${nmHrM}, ${Math.trunc(tglM)} ${nmBlnM} ${Math.trunc(thnM)}`;
    }
  }

  jde(jd, {deltaT = 0.0} = {}) {
    return jd + deltaT / 86400.0;
  }

  jc(jd) {
    return (jd - 2451545) / 36525;
  }

  jce(jde) {
    return (jde - 2451545) / 36525;
  }

  jm(jc) {
    return jc / 10.0;
  }

  jme(jce) {
    return jce / 10.0;
  }

  // // Konversi CJDN ke Kalender Hijriah
  // dynamic cjdnKH(
  //   int cjdn, {
  //   let hCalE = 2, //pilihan epoch
  //   let hCalL = 2, //pilihan leap year correction
  //   let optResult = " ",
  // }) {
  //   let dltD = (hCalE == 1) ? 1948439.0 : 1948440.0;

  //   let lyCor;
  //   switch (hCalL) {
  //     case 1:
  //       lyCor = 15.0;
  //       break;
  //     case 2:
  //       lyCor = 14.0;
  //       break;
  //     case 3:
  //       lyCor = 11.0;
  //       break;
  //     case 4:
  //       lyCor = 9.0;
  //       break;
  //     default:
  //       lyCor = 14.0;
  //   }

  //   let hCalDN = cjdn - dltD;
  //   let x2 = Math.floor(((30.0 * hCalDN + 29.0 - lyCor) / 10631));
  //   let r2 = mf.mod(30 * hCalDN + 29 - lyCor, 10631.0);
  //   let x1 = Math.floor(((11 * Math.floor((r2 / 30)) + 5) / 325));
  //   let r1 = mf.mod(11 * Math.floor((r2 / 30)) + 5, 325.0);

  //   let hCalD = Math.floor((r1 / 11)) + 1;
  //   let hCalM = x1 + 1;
  //   let hCalY = x2 + 1;

  //   let namaBulanHijriah = [
  //     "Al-Muharram",
  //     "Shafar",
  //     "Rabiul Awwal",
  //     "Rabiul Akhir",
  //     "Jumadal Ula",
  //     "Jumadal Akhirah",
  //     "Rajab",
  //     "Syaban",
  //     "Ramadhan",
  //     "Syawal",
  //     "Zulqadah",
  //     "Zulhijjah",
  //   ];
  //   let namaHari = [
  //     "Senin",
  //     "Selasa",
  //     "Rabu",
  //     "Kamis",
  //     "Jum'at",
  //     "Sabtu",
  //     "Ahad",
  //   ];
  //   let namaPasaran = ["Legi", "Pahing", "Pon", "Wage", "Kliwon"];

  //   let nmBlnH = namaBulanHijriah[hCalM - 1];
  //   let nmHrH = namaHari[cjdn % 7];
  //   let nmPsH = namaPasaran[cjdn % 5];

  //   switch (optResult.replaceAll(" ", "").toUpperCase()) {
  //     case "TGLH":
  //     case "TGL":
  //       return hCalD;
  //     case "BLNH":
  //     case "BLN":
  //       return hCalM;
  //     case "THNH":
  //     case "THN":
  //       return hCalY;
  //     case "NMBLNH":
  //     case "BULAN":
  //       return nmBlnH;
  //     case "NMHRH":
  //     case "HARI":
  //     case "HR":
  //       return nmHrH;
  //     case "NMPSM":
  //     case "PASARAN":
  //     case "PS":
  //       return nmPsH;
  //     default:
  //       return `${nmHrH}, ${hCalD}, ${nmBlnH}, ${hCalY}`;
  //   }
  // }

  static _nmHrHDt = [
    'Senin',
    'Selasa',
    'Rabu',
    'Kamis',
    'Jumat',
    'Sabtu',
    'Ahad',
  ];
  static _nmPsHDt = [
    'Legi',
    'Pahing',
    'Pon',
    'Wage',
    'Kliwon',
  ];

  static _nmBlnHDt = [
    'Al-Muharram',
    'Shafar',
    'Rabiul Awwal',
    'Rabiul Akhir',
    'Jumadal Ula',
    'Jumadal Akhirah',
    'Rajab',
    'Syaban',
    'Ramadhan',
    'Syawal',
    'Zulqadah',
    'Zulhijjah',
  ];

  /// Mengembalikan konstanta epoch (dltD) sesuai pilihan [hCalE].
  /// 1 -> 1 Al-Muharram 1 H = Kamis Kliwon, 15 Juli 622 M
  /// 2 (default/selain 1) -> 1 Al-Muharram 1 H = Jum'at Legi, 16 Juli 622 M

  _epoch(hCalE) { return hCalE == 1 ? 1948439.0 : 1948440.0; }

  /// Mengembalikan konstanta koreksi tahun kabisat (LYCor) sesuai [hCalL].
  _leapYearCorrection(hCalL) {
    switch (hCalL) {
      case 1:
        return 15.0; // 2,5,7,10,13,15,18,21,24,26,29
      case 2:
        return 14.0; // 2,5,7,10,13,16,18,21,24,26,29
      case 3:
        return 11.0; // 2,5,8,10,13,16,19,21,24,27,29
      case 4:
        return 9.0; // 2,5,8,11,13,16,19,21,24,27,30
      default:
        return 14.0;
    }
  }

  /// JDKH : Julian Day ke Kalender Hijriah
  jdkh(jd, timeZone, hCalE, hCalL, optResult = '') {
    // Konversi JD -> Chronological Julian Day (CJD) & Day Number (CJDN)
    const cjd = jd + 0.5 + (timeZone / 24);
    const cjdn = Math.floor(cjd);

    const dltD = this._epoch(hCalE);
    const lyCor = this._leapYearCorrection(hCalL);

    const hCalDN = cjdn - dltD;
    const x2 = Math.floor(((30 * hCalDN + 29 - lyCor) / 10631));
    const r2 = this.mf.mod(30 * hCalDN + 29 - lyCor, 10631.0);
    const x1 = Math.floor(((11 * Math.floor((r2 / 30)) + 5) / 325));
    const r1 = this.mf.mod(11 * Math.floor((r2 / 30)) + 5, 325.0);

    const hCalD = Math.floor((r1 / 11)) + 1;
    const hCalM = Math.trunc(x1) + 1;
    const hCalY = Math.trunc(x2) + 1;

    // Nama hari (berdasarkan kalender Miladi)
    const noHrH = Math.trunc(this.mf.mod(cjdn, 7));
    const nmHrH = JulianDay._nmHrHDt[noHrH];

    // Nama bulan Hijriah
    const nmBlnH = JulianDay._nmBlnHDt[hCalM - 1];

    const opt = optResult.replaceAll(' ', '').toUpperCase();
    switch (opt) {
      case '':
        return `${nmHrH}, ${hCalD} ${nmBlnH} ${hCalY}`;
      case 'NHRH':
      case 'HRH':
        return nmHrH;
      case 'TGLH':
      case 'TGL':
        return hCalD;
      case 'BLNH':
      case 'BLN':
        return hCalM;
      case 'NMBLNH':
        return nmBlnH;
      case 'THNH':
      case 'THN':
        return hCalY;
      default:
        return `${nmHrH}, ${hCalD} ${nmBlnH} ${hCalY}`;
    }
  }

  /// KHCJDN : Kalender Hijriah ke Chronological Julian Day Number
  khcjdn(hCalD, hCalM, hCalY, hCalE, hCalL) {
    const dltD = this._epoch(hCalE);
    const lyCor = this._leapYearCorrection(hCalL);

    const hCalDN =
        Math.floor(((10631 * hCalY - 10631 + lyCor) / 30)) +
        Math.floor(((325 * hCalM - 320) / 11)) +
        (hCalD - 1);

    const cjdn = hCalDN + dltD;

    return Math.trunc(cjdn);
  }

  /// CJDNKH : Chronological Julian Day Number ke Kalender Hijriah
  cjdnkh(cjdn, {hCalE = 2, hCalL = 2, optResult = ' '} = {}) {
    const dltD = this._epoch(hCalE);
    const lyCor = this._leapYearCorrection(hCalL);

    const hCalDN = cjdn - dltD;
    const x2 = Math.floor(((30.0 * hCalDN + 29.0 - lyCor) / 10631));
    const r2 = this.mf.mod(30 * hCalDN + 29 - lyCor, 10631);
    const x1 = Math.floor(((11 * Math.floor((r2 / 30)) + 5) / 325));
    const r1 = this.mf.mod(11 * Math.floor((r2 / 30)) + 5, 325);

    const hCalD = Math.floor((r1 / 11)) + 1;
    const hCalM = Math.trunc(x1) + 1;
    const hCalY = Math.trunc(x2) + 1;

    const nmBlnH = JulianDay._nmBlnHDt[hCalM - 1];

    const noHrH = cjdn - 7 * Math.floor((cjdn / 7));
    const noPsH = cjdn - 5 * Math.floor((cjdn / 5));

    const nmHrH = JulianDay._nmHrHDt[noHrH];
    const nmPsH = JulianDay._nmPsHDt[noPsH];

    const opt = optResult.replaceAll(' ', '').toUpperCase();
    switch (opt) {
      case 'TGLH':
      case 'TGL':
        return hCalD;
      case 'BLNH':
      case 'BLN':
        return hCalM;
      case 'THNH':
      case 'THN':
        return hCalY;
      case 'NMBLNH':
      case 'BULAN':
        return nmBlnH;
      case 'NMHRH':
      case 'HARI':
      case 'HR':
        return nmHrH;
      case 'NMPSM':
      case 'PASARAN':
      case 'PS':
        return nmPsH;
      default:
        return `${nmHrH}, ${hCalD}, ${nmBlnH}, ${hCalY}`;
    }
  }
}

