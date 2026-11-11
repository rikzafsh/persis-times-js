/**
 * math_utils.js — Utilitas dasar: derajat↔radian, modulus, pembulatan, dan pemformat sudut (DMS).
 * Sumber Dart: core/math/math_utils.dart
 * Kelas: MathFunction
 * Fungsi: deg, rad, mod, floor, abs, sign, roundDouble, trunc, roundTo, roundUp, dhhms, dhhm, dddms, dddms2 …
 */
class MathFunction {
  // Konversi sudut
  deg(x) { return x * 180.0 / Math.PI; }
  rad(x) { return x * Math.PI / 180.0; }

  // Modulus
  mod(a, m) {
    // 🔴 GUARD: NaN/Infinity check
    if (!SafeMath.isValid(a) || !SafeMath.isValid(m) || m == 0) {
      return 0.0;
    }

    // Original logic dengan SafeMath
    const quotient = SafeMath.safeDiv(a, m);
    return a - m * Math.floor(quotient);
  }

  //double floor(double x) { return Math.floor((x)); }
  floor(value) {
    if (!SafeMath.isValid(value)) return 0.0;
    return Math.floor(value);
  }

  abs(x) { return Math.abs((x)); }

  // Sign
  sign(x) { return (x > 0) ? 1 : (x < 0 ? -1 : 0); }

  // Pembulatan umum (seperti extension round di Kotlin)
  roundDouble(value, decimals) {
    return value.toFixed(decimals);
  }

  trunc(value, decimals = 2) {
    const mod = Math.pow(10.0, decimals);
    return Math.trunc((value * mod)) / mod;
  }

  // Pembulatan manual ala RoundTo
  roundTo(xDec, {place = 2} = {}) {
    const A = Math.pow(10.0, (place));
    const H = (xDec >= 0)
        ? this.floor(xDec * A + 0.5) / A
        : -this.floor(this.abs(xDec) * A + 0.5) / A;
    return H.toString();
  }

  roundUp(value, decimals) {
    const mod = Math.pow(10.0, decimals);
    return (value * mod).ceil() / mod;
  }

  // Format jam HH:MM:SS
  dhhms(dHrs, {optResult = "HH:MM:SS", secDecPlaces = 2, posNegSign = ""} = {}) {
    const uDHrs = this.abs(dHrs);
    let uHrs = this.floor(uDHrs);
    const uDMin = (uDHrs - uHrs) * 60.0;
    let uMin = this.floor(uDMin);
    const uDSec = (uDMin - uMin) * 60.0;

    // format detik dengan jumlah desimal sesuai
    let uSec = uDSec.toFixed(secDecPlaces);

    // koreksi jika detik = 60.0
    if ( parseFloat(uSec) == 60.0) {
      uSec = 0.0.toFixed(secDecPlaces);
      uMin += 1.0;
    }

    // koreksi jika menit = 60
    if (uMin == 60.0) {
      uMin = 0.0;
      uHrs += 1.0;
    }

    const sHrs = Math.trunc(uHrs) < 10 ? `0${Math.trunc(uHrs)}` : `${Math.trunc(uHrs)}`;
    const sMin = Math.trunc(uMin) < 10 ? `0${Math.trunc(uMin)}` : `${Math.trunc(uMin)}`;
    const sSec =  parseFloat(uSec) < 10.0 ? `0${uSec}` : uSec;

    // tanda positif/negatif
    let pns;
    if (posNegSign == "+-") {
      if (dHrs > 0.0) {
        pns = "+";
      } else if (dHrs < 0.0) {
        pns = "-";
      } else {
        pns = "";
      }
    } else {
      if (dHrs < 0.0) {
        pns = "-";
      } else {
        pns = "";
      }
    }

    switch (optResult) {
      case "HH:MM:SS":
        return `${pns}${sHrs}:${sMin}:${sSec}`;
      case "HHMMSS":
        return `${pns}${sHrs}h ${sMin}m ${sSec}s`;
      case "MMSS":
        return `${pns}${sMin}m ${sSec}s`;
      case "HH:MM":
        return `${pns}${sHrs}:${sMin}`;
      default:
        return `${pns}${sHrs}:${sMin}:${sSec}`;
    }
  }

  dhhm(dHrs, {optResult = "HH:MM", minDecPlaces = 0, posNegSign = ""} = {}) {
    const isNeg = dHrs < 0;
    const uDHrs = Math.abs(dHrs);

    let hrs = Math.floor(uDHrs);
    const decMin = (uDHrs - hrs) * 60.0;

    const minsRounded = minDecPlaces == 0
        ? (Math.round(decMin))
        :  parseFloat(decMin.toFixed(minDecPlaces));

    let hrs2 = hrs;
    let mins = minsRounded;
    if (mins >= 60) {
      mins -= 60;
      hrs2 += 1;
    }

    const sHrs = hrs2.toString().padStart(2, '0');
    const sMin = minDecPlaces == 0
        ? Math.trunc(mins).toString().padStart(2, '0')
        : mins.toFixed(minDecPlaces).padStart(2 + 1 + minDecPlaces, '0');

    let pns = "";
    if (posNegSign == "+-") {
      if (dHrs > 0) pns = "+";
      if (dHrs < 0) pns = "-";
    } else {
      if (isNeg) pns = "-";
    }

    switch (optResult) {
      case "HH:MM":
        return `${pns}${sHrs}:${sMin}`;
      case "HHMM":
        return `${pns}${sHrs}h ${sMin}m`;
      default:
        return `${pns}${sHrs}:${sMin}`;
    }
  }

  // // Format derajat DD°MM'SS"
  // String dddms(
  //   double dDeg, {
  //   let optResult = "DDMMSS",
  //   let sdp = 2,
  //   let posNegSign = "+-",
  // }) {
  //   const uDDeg = abs(dDeg);
  //   let uDeg = floor(uDDeg);
  //   const uDMin = (uDDeg - uDeg) * 60.0;
  //   let uMin = floor(uDMin);
  //   const uDSec = (uDMin - uMin) * 60.0;
  //   let uSec = uDSec.toFixed(sdp);

  //   if ( parseFloat(uSec) == 60.0) {
  //     uSec = 0.0.toFixed(sdp);
  //     uMin = uMin + 1.0;
  //   }

  //   if (uMin == 60.0) {
  //     uMin = 0.0;
  //     uDeg = uDeg + 1.0;
  //   }

  //   const sDeg = (Math.trunc(uDeg) < 10)
  //       ? `00${Math.trunc(uDeg)}`
  //       : (Math.trunc(uDeg) < 100)
  //       ? `0${Math.trunc(uDeg)}`
  //       : `${Math.trunc(uDeg)}`;

  //   const sMin = (Math.trunc(uMin) < 10)
  //       ? `0${Math.trunc(uMin)}`
  //       : `${Math.trunc(uMin)}`;

  //   const sSec = ( parseFloat(uSec) < 10.0) ? `0${uSec}` : uSec;

  //   // --- PNS sesuai aturan PosNegSign ---
  //   let pns;
  //   if (posNegSign == "+-") {
  //     if (dDeg > 0.0) {
  //       pns = "+";
  //     } else if (dDeg < 0.0) {
  //       pns = "-";
  //     } else {
  //       pns = "";
  //     }
  //   } else {
  //     if (dDeg > 0.0) {
  //       pns = "";
  //     } else if (dDeg < 0.0) {
  //       pns = "-";
  //     } else {
  //       pns = "";
  //     }
  //   }

  //   let bbbt;
  //   let luls;

  //   if (dDeg > 0.0) {
  //     bbbt = "BT";
  //     luls = "LU";
  //   } else {
  //     bbbt = "BB";
  //     luls = "LS";
  //   }

  //   switch (optResult) {
  //     case "DDMMSS":
  //       return `${pns}${sDeg}° ${sMin}’ ${sSec}”`;
  //     case "MMSS":
  //       return `${pns}${sMin}’ ${sSec}”`;
  //     case "SS":
  //       return `${pns}${sSec}”`;
  //     case "BBBT":
  //       return `${pns}${sDeg}° ${sMin}’ ${sSec}” ${bbbt}`;
  //     case "LULS":
  //       return `${pns}${sDeg}° ${sMin}’ ${sSec}” ${luls}`;
  //     default:
  //       return `${pns}${sDeg}° ${sMin}’ ${sSec}”`;
  //   }
  // }

  /// Mengonversi Desimal Derajat (Decimal Degrees) ke format Derajat, Menit, Detik (DMS).
  ///
  /// [xDecDeg] Nilai desimal derajat ({misal: -106.8456}).
  /// [optResult] Format keluaran ( '[D]', 'DMS', dll,{contoh: 'DMMSS'}). Default: 'DMMSS'.
  /// [secDetPlaces] Jumlah desimal untuk detik. Default: 3.
  /// [posNegSign] Penanda arah/tanda ( 'LAT', 'B', '+/-', dll,{contoh: 'LON'}). Default: ''.
  ///
  /// Memerlukan Dart 3.0+ untuk sintaks Switch Expression.
  dddms(xDecDeg, {optResult = '', sdp, posNegSign = ''} = {}) {
    // 1. Hitung komponen absolut
    const absDecDeg = Math.abs(xDecDeg);
    let absDeg = Math.floor(absDecDeg);
    let absDecMin = (absDecDeg - absDeg) * 60.0;
    let absMin = Math.floor(absDecMin);
    let absDecSec = (absDecMin - absMin) * 60.0;

    // 2. Validasi jumlah desimal detik
    let places = sdp ?? 3;
    if (Math.abs(places) > 16) places = 3;
    places = Math.abs(places);

    // 3. Format & bulatkan detik
    const secStrFixed = absDecSec.toFixed(places);
    let absSec =  parseFloat(secStrFixed);

    // 4. Koreksi rollover
    if (absSec == 60.0) {
      absSec = 0.0;
      absMin += 1;
    }
    if (absMin == 60.0) {
      absMin = 0.0;
      absDeg += 1;
    }

    // 5. Tentukan prefix & suffix
    let pns = '';
    let lls = '';
    const cleanPosNeg = posNegSign.replaceAll(' ', '').toUpperCase();

    switch (cleanPosNeg) {
      case '':
        pns = xDecDeg >= 0 ? '' : '-';
      case '+/-' || '-/+' || '+-' || '-+':
        pns = xDecDeg >= 0 ? '+' : '-';
      case 'B' || 'BUJUR':
        lls = xDecDeg >= 0 ? ' BT' : ' BB';
      case 'L' || 'LINTANG':
        lls = xDecDeg >= 0 ? ' LU' : ' LS';
      case 'LON' || 'LONG' || 'LONGITUDE':
        lls = xDecDeg >= 0 ? 'E' : 'W';
      case 'LAT' || 'LATITUDE':
        lls = xDecDeg >= 0 ? 'N' : 'S';
      default:
        pns = xDecDeg >= 0 ? '' : '-';
    }

    // Pre-compute formatting
    const deg0 = Math.trunc(absDeg).toString();
    const deg00 = deg0.padStart(2, '0');
    const deg000 = deg0.padStart(3, '0');
    const min0 = Math.trunc(absMin).toString();
    const min00 = min0.padStart(2, '0');

    //lebar padding dinamis
    const secWidth = places == 0 ? 2 : places + 3;
    const sec00x = secStrFixed.padStart(secWidth, '0');

    // 6. Mapping format hasil
    const cleanOpt = optResult.replaceAll(' ', '').toUpperCase();

    const result = (function(){ const __v = cleanOpt; if (__v === '' || __v === 'DMMSS') return `${pns}${deg0}° ${min00}’ ${sec00x}”${lls}`; if (__v === 'DDMMSS') return `${pns}${deg00}° ${min00}’ ${sec00x}”${lls}`; if (__v === 'DDDMMSS') return `${pns}${deg000}° ${min00}’ ${sec00x}”${lls}`; if (__v === '[D]') return `${pns}${deg0}`; if (__v === '[M]') return `${pns}${min0}`; if (__v === '[S]') return `${pns}${secStrFixed}`; if (__v === 'D') return `${pns}${deg0}° ${lls}`; if (__v === 'M') return `${pns}${min0}’ ${lls}`; if (__v === 'S') return `${pns}${secStrFixed}”${lls}`; if (__v === 'MSS') return `${pns}${min0}’ ${sec00x}”${lls}`; if (__v === 'DMM') return `${pns}${deg0}° ${min00}’ ${lls}`; if (__v === 'DDMM') return `${pns}${deg00}° ${min00}’ ${lls}`; if (__v === 'DDDMM') return `${pns}${deg000}° ${min00}’ ${lls}`; if (__v === 'DD') return `${pns}${deg00}° ${lls}`; if (__v === 'DDD') return `${pns}${deg000}° ${lls}`; if (__v === 'MM') return `${pns}${min00}’ ${lls}`; if (__v === 'MMSS') return `${pns}${min00}’ ${sec00x}”${lls}`; if (__v === 'MS') return `${pns}${min0}’ ${secStrFixed}”${lls}`; if (__v === 'SS') return `${pns}${sec00x}”${lls}`; if (__v === 'DM') return `${pns}${deg0}° ${min0}’ ${lls}`; if (__v === 'DMS') return `${pns}${deg0}° ${min0}’ ${secStrFixed}”${lls}`; return `${pns}${deg0}° ${min00}’ ${sec00x}”${lls}`; })();

    return result;
  }

  // Format derajat versi 2 (DDDMS2)
  dddms2(dDeg, {optResult = "DDMMSS", sdp = 2, posNegSign = ""} = {}) {
    // Nilai absolut untuk dihitung
    const uDDeg = this.abs(dDeg);

    // Derajat
    let uDeg = this.floor(uDDeg).toFixed(0);

    // Menit
    let uDMin = (uDDeg -  parseFloat(uDeg)) * 60.0;
    let uMin = this.floor(uDMin).toFixed(0);

    // Detik
    let uDSec = (uDMin -  parseFloat(uMin)) * 60.0;
    let uSec = uDSec.toFixed(sdp);

    // Koreksi pembulatan detik -> menit
    if ( parseFloat(uSec) == 60.0) {
      uSec = 0.0.toFixed(sdp);
      uMin = ( parseFloat(uMin) + 1.0).toFixed(0);
    }

    // Koreksi pembulatan menit -> derajat
    if ( parseFloat(uMin) == 60.0) {
      uMin = "0";
      uDeg = ( parseFloat(uDeg) + 1.0).toFixed(0);
    }

    // Tanda Positif/Negatif sesuai pilihan
    let pns;
    if (posNegSign == "+-") {
      if (dDeg > 0.0) {
        pns = "+";
      } else if (dDeg < 0.0) {
        pns = "-";
      } else {
        pns = "";
      }
    } else {
      if (dDeg > 0.0) {
        pns = "";
      } else if (dDeg < 0.0) {
        pns = "-";
      } else {
        pns = "";
      }
    }

    // BT/BB dan LU/LS
    const bbbt = (dDeg > 0.0) ? "BT" : "BB";
    const luls = (dDeg > 0.0) ? "LU" : "LS";

    // Hasil sesuai OptResult
    switch (optResult) {
      case "DDMMSS":
        return `${pns}${uDeg}° ${uMin}’ ${uSec}”`;
      case "MMSS":
        return `${pns}${uMin}’ ${uSec}”`;
      case "SS":
        return `${pns}${uSec}”`;
      case "BBBT":
        return `${pns}${uDeg}° ${uMin}’ ${uSec}” ${bbbt}`;
      case "LULS":
        return `${pns}${uDeg}° ${uMin}’ ${uSec}” ${luls}`;
      default:
        return `${pns}${uDeg}° ${uMin}’ ${uSec}”`;
    }
  }

  // interpolation From Five Tabular Values
  interp5(xM2, xM1, x00, xP1, xP2, optResult) {
    const A = xM1 - xM2;
    const B = x00 - xM1;
    const C = xP1 - x00;
    const D = xP2 - xP1;

    const E = B - A;
    const F = C - B;
    const G = D - C;
    const H = F - E;
    const J = G - F;
    const K = J - H;

    switch (optResult) {
      case 0:
        return x00;
      case 1:
        return ((B + C) / 2 - (H + J) / 12);
      case 2:
        return (F / 2 - K / 24);
      case 3:
        return ((H + J) / 12);
      case 4:
        return (K / 24);
      default:
        return x00;
    }
  }

  // interpolation From Five Tabular Values
  interp5Angle(xM2, xM1, x00, xP1, xP2, optResult) {
    const A = this.mod(xM1 - xM2, 360);
    const B = this.mod(x00 - xM1, 360);
    const C = this.mod(xP1 - x00, 360);
    const D = this.mod(xP2 - xP1, 360);

    const E = B - A;
    const F = C - B;
    const G = D - C;
    const H = F - E;
    const J = G - F;
    const K = J - H;

    switch (optResult) {
      case 0:
        return x00;
      case 1:
        return ((B + C) / 2 - (H + J) / 12);
      case 2:
        return (F / 2 - K / 24);
      case 3:
        return ((H + J) / 12);
      case 4:
        return (K / 24);
      default:
        return x00;
    }
  }

  safeNum(v) {
    if (v == null) return null;
    if (typeof v === 'number') {
      if (Number.isNaN(v) || (Math.abs(v)===Infinity)) return null;
      return (v);
    }
    return null;
  }
}

