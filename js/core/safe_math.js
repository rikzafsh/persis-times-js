/**
 * safe_math.js — Fungsi matematika aman (akar, asin, acos, pembagian) yang menolak NaN/Infinity.
 * Sumber Dart: core/math/safe_math.dart
 * Kelas: SafeMath
 * Fungsi: sqrt, asin, acos, safeDiv, clamp, isValid
 */
class SafeMath {
  static sqrt(value) {
    if (value < 0 || Number.isNaN(value) || (Math.abs(value)===Infinity)) return 0.0;
    return Math.sqrt(value);
  }

  static asin(value) {
    if (Number.isNaN(value) || (Math.abs(value)===Infinity)) return 0.0;
    if (value > 1.0) value = 1.0;
    if (value < -1.0) value = -1.0;
    return Math.asin(value);
  }

  static acos(value) {
    if (Number.isNaN(value) || (Math.abs(value)===Infinity)) return 0.0;
    if (value > 1.0) value = 1.0;
    if (value < -1.0) value = -1.0;
    return Math.acos(value);
  }

  static safeDiv(a, b, {fallback = 0.0} = {}) {
    if (Number.isNaN(a) || (Math.abs(a)===Infinity) || Number.isNaN(b) || (Math.abs(b)===Infinity) || b == 0) {
      return fallback;
    }
    const result = a / b;
    return Number.isNaN(result) || (Math.abs(result)===Infinity) ? fallback : result;
  }

  // ✅ TAMBAHKAN: Helper untuk clamp nilai ke range
  static clamp(value, min, max) {
    if (Number.isNaN(value) || (Math.abs(value)===Infinity)) return min;
    return value < min ? min : (value > max ? max : value);
  }

  // ✅ TAMBAHKAN: Helper untuk validasi double aman
  static isValid(value) { return value != null && !Number.isNaN(value) && !(Math.abs(value)===Infinity); }
}

