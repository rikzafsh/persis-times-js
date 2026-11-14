/**
 * pelengkap_service.js — TAMBAHAN (bukan port dari Dart):
 *  1) WaktuPelengkap   — waktu istiwa, tafawut (perata waktu), sepertiga malam.
 *  2) RasydulHarian    — rasydulqiblat harian: saat Matahari tepat di arah kiblat atau berlawanan (bayangan menuju kiblat)
 *                        untuk lokasi mana pun, setiap hari; plus tinggi/azimut Matahari sesaat.
 * Bertumpu pada SunFunction (VSOP87D), WaktuSalat, dan ArahKiblat hasil port. Jam dalam desimal waktu zona (tmZn).
 *
 * Definisi:
 *  - Istiwa   : saat Matahari berkulminasi (waktu hakiki 12:00) = zuhur mentah pustaka (12 − e − KWD), tanpa ihtiyat.
 *  - Tafawut  : selisih waktu hakiki terhadap waktu pertengahan = perata waktu (e); positif bila Matahari "lebih cepat".
 *               (Pustaka Dart tidak memuat "tafawut"; ini tafsir dari "daqāiq al-tafāwut" pada tabel falak klasik.)
 *  - KWD      : koreksi waktu daerah = (bujur − 15°·zona)/15, jam.
 *  - Malam    : Magrib → Subuh (sudut Subuh menurut metode), seperti nisfuLail pada pustaka.
 */
class WaktuPelengkap {
  constructor() { this.ws = new WaktuSalat(); this.sn = new SunFunction(); this.dt = new DynamicalTime(); this.jd = new JulianDay(); }
  _mod24(x) { return ((x % 24) + 24) % 24; }
  /** Perata waktu e (jam) pada JD UT jd; positif bila Matahari lebih cepat dari waktu pertengahan. */
  perataWaktu(jd) { return this.sn.equationOfTime(jd + this.dt.deltaT(jd) / 86400, 0); }
  /** Koreksi waktu daerah (jam): (bujur − 15·zona)/15. */
  kwd(gLon, tmZn) { return (gLon - tmZn * 15) / 15; }
  /** Istiwa + tafawut + KWD + tinggi Matahari saat kulminasi, untuk satu hari. */
  istiwa(tgl, bln, thn, gLon, gLat, tmZn) {
    const t = this.ws.zuhur(tgl, bln, thn, gLon, tmZn).time, jd = this.jd.kmjd(tgl, bln, thn, t, tmZn), dT = this.dt.deltaT(jd);
    const dek = this.sn.sunGeocentricDeclination(jd, dT);
    return { jam: t, jd, tafawut: this.perataWaktu(jd), kwd: this.kwd(gLon, tmZn), deklinasi: dek, tinggi: 90 - Math.abs(gLat - dek) };
  }
  /** Magrib, Subuh, tengah malam, akhir sepertiga pertama, dan awal sepertiga terakhir malam (jam desimal). */
  sepertigaMalam(tgl, bln, thn, gLon, gLat, elev, tmZn, prayerMethod = PrayerMethod.persatuanIslam) {
    const mg = this.ws.magrib(tgl, bln, thn, gLon, gLat, elev, tmZn), sb = this.ws.subuh(tgl, bln, thn, gLon, gLat, tmZn, prayerMethod.hmSubuh);
    if (!mg.isNormal || !sb.isNormal) return null;
    const len = this._mod24(sb.time - mg.time);
    return { magrib: mg.time, subuh: sb.time, lama: len, akhirSepertigaPertama: this._mod24(mg.time + len / 3), tengahMalam: this._mod24(mg.time + len / 2), awalSepertigaTerakhir: this._mod24(mg.time + 2 * len / 3) };
  }
}

class RasydulHarian {
  constructor() { this.sn = new SunFunction(); this.dt = new DynamicalTime(); this.jd = new JulianDay(); this.ak = new ArahKiblat(); }
  _r(x) { return x * Math.PI / 180; }
  /** Tinggi & azimut (dari utara, searah jarum jam) Matahari geosentris pada jd UT di lintang/bujur tertentu. */
  sunAltAz(jd, gLat, gLon) {
    const dT = this.dt.deltaT(jd), dek = this._r(this.sn.sunGeocentricDeclination(jd, dT)), ra = this.sn.sunGeocentricRightAscension(jd, dT),
      H = this._r(this.sn.localApparentSiderialTime(jd, dT, gLon) - ra), ph = this._r(gLat);
    const alt = Math.asin(Math.sin(ph) * Math.sin(dek) + Math.cos(ph) * Math.cos(dek) * Math.cos(H));
    const N = Math.cos(ph) * Math.sin(dek) - Math.sin(ph) * Math.cos(dek) * Math.cos(H), E = -Math.cos(dek) * Math.sin(H);
    return { tinggi: alt * 180 / Math.PI, azimut: (Math.atan2(E, N) * 180 / Math.PI + 360) % 360 };
  }
  /**
   * Rasydulqiblat harian. Q = arah kiblat (derajat dari utara). Syarat azimut Matahari = Q (jenis 0: Matahari tepat di arah kiblat)
   * atau Q+180° (jenis 1: bayangan tongkat tegak menuju kiblat) berbentuk a·cosH + b·sinH = c, dengan dua akar sudut jam H.
   * Tiap akar diiterasi sendiri (deklinasi & perata waktu berubah selama hari), jenisnya ditentukan dari tanda hasil kali titik,
   * dan hanya yang Matahari-nya di atas ufuk (tinggi > −0,833°) dikembalikan: [{jenis, jam, tinggi, azimut}] urut jam (0–2 peristiwa/hari).
   */
  hari(tgl, bln, thn, gLat, gLon, tmZn, Q) {
    const out = [], ph = this._r(gLat), q = this._r(Q);
    for (const sg of [1, -1]) {
      let t = 12, last = null;
      for (let it = 0; it < 12; it++) {
        const jd = this.jd.kmjd(tgl, bln, thn, t, tmZn), dT = this.dt.deltaT(jd), de = this._r(this.sn.sunGeocentricDeclination(jd, dT));
        const istiwa = 12 - this.sn.equationOfTime(jd + dT / 86400, 0) - (gLon - tmZn * 15) / 15;
        const a = Math.sin(ph) * Math.sin(q) * Math.cos(de), b = -Math.cos(q) * Math.cos(de), c = Math.sin(q) * Math.cos(ph) * Math.sin(de), R = Math.hypot(a, b);
        if (R < 1e-12 || Math.abs(c) > R) { last = null; break; }
        const H = Math.atan2(b, a) + sg * Math.acos(c / R), Hd = ((H * 180 / Math.PI + 540) % 360) - 180, tn = istiwa + Hd / 15;
        last = { H, t: tn, de };
        if (Math.abs(tn - t) < 1e-7) break;
        t = tn;
      }
      if (!last) continue;
      const { H, de } = last, N = Math.cos(ph) * Math.sin(de) - Math.sin(ph) * Math.cos(de) * Math.cos(H), E = -Math.cos(de) * Math.sin(H);
      const jenis = (E * Math.sin(q) + N * Math.cos(q)) > 0 ? 0 : 1;
      const tinggi = Math.asin(Math.max(-1, Math.min(1, Math.sin(ph) * Math.sin(de) + Math.cos(ph) * Math.cos(de) * Math.cos(H)))) * 180 / Math.PI;
      if (tinggi > -0.833) out.push({ jenis, jam: last.t, tinggi, azimut: (Q + (jenis ? 180 : 0)) % 360 });
    }
    return out.sort((x, y) => x.jam - y.jam);
  }
}
