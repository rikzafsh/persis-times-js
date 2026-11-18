/**
 * panchanga_service.js — TAMBAHAN (bukan port dari Dart): Pañcāṅga lengkap.
 * Tithi, nakṣatra, yoga, karaṇa (lima aṅga), māsa, śakavarṣa, lagna-rāśi, dan muhūrta.
 * Bertumpu pada AstroEvents (bujur tampak Matahari & Bulan: VSOP87D + ELPMPP02). Zodiak sidereal memakai
 * ayanāṃśa Lahiri (Chitrapaksha): 23°15′00,658″ pada 22-9-1956, ditambah presesi umum; bujur tampak dikurangi nutasi
 * agar sebanding dengan ayanāṃśa rata-rata. Semua waktu berupa JD UT.
 */
const PN = {
  // Ejaan mengikuti daftar yang diberikan pengguna (aksara Latin-Jawa Kuna); urutan = urutan baku.
  TITHI: ["Pꭉaŧama","Dwitīyā","Tꭉétỿa","Catur̀ŧī","Pañcamī","Ṣaṣṭī","Saptamī","Äṣṭamī","Nawamī","Dašamī","Ë́kādašī","Dwādašī","Tꭉayodašī","Catur̀dašī","Pañcadašī"],
  NAKSATRA: ["äšwini","ƀaraṇī","kr̥t͟tikā","rohiṇī","mr̥gašīr̀ṣa","ǟr̀dꭉā","punar̀wasu","puṣỿa","ǟšléṣā","maǥā","pūr̀w͟wa⹝ꝑalguṇī","üttara⹝ꝑalguṇī","hasta","citꭉā","swāti","wišāꝁā","änurāđā","jỿéṣŧ̣ā","mūla","pūr̀w͟wa⹝ǟṣāđ̣ā","üttara⹝ǟṣāđ̣ā","šꭉāwaṇa","đaniṣŧ̣ā","šataƀiṣā","pūr̀w͟wa⹝ƀādꭉapada","üttara⹝ƀādꭉapada","réwatī"],
  DEWATA: ["Äšwini","Yama","Ägnī","Bꭉahmā","Candꭉa","Šiwa","Ǟditỿa","Br̥haspati","Nāga","Pitara","Ƀagā","Ǟr̀y⃭ỿamana","Ǟditỿa","Wiswakaṙmma","Wayu","Ïndrâgni","Mitꭉa","Ïndꭉa","Nꜽr̥̈̄ti","Jala","Wišwadéwā","Wiṣṇu","Äṣṭawasu","Warūṇa","Äjꜽkapāda","Ähir̀buđnỿa","Pūṣā"],
  MANDALA: ["Bāyabỿa","Ǟgnéya","Ǟgnéya","Mahe̋ndꭉa","Bāyabỿa","Bāruṇỿa","Bāyabỿa","Ǟgnéya","Bāruṇỿa","Ǟgnéya","Ǟgnéya","Bāyabỿa","Bāyabỿa","Bāyabỿa","Bāyabỿa","Ǟgnéya","Mahe̋ndꭉa","Mahe̋ndꭉa","Bāruṇỿa","Bāruṇỿa","Mahe̋ndꭉa","Mahe̋ndꭉa","Mahe̋ndꭉa","Bāruṇỿa","Mahe̋ndꭉa","Bāruṇỿa","Bāruṇỿa"],
  YOGA: ["Wiṣkamƀa","Pꭉīti","Ǟyuṣmāna","Sꜷƀāgỿa","Šoƀana","Ätigaṇḍa","Sukar̀m͟mā","Đr̥ti","Šūla","Gaṇḍa","Wr̥dđi","Đꭉuwa","Wỿāǥāta","Har̀ṣaṇa","Wajꭉa","Sidđi","Wỿatipāta","Warīyas⸝","Pariǥa","Šiwa","Sidđa","Sāđỿa","Šuƀa","Šukla","Bꭉahma","Mahe̋ndꭉa","Wꜽđr̥ti"],
  KARANA_BERGERAK: ["Wawa","Walawa","Kolawa","Tꜽŧila","Garadi","Waṇija","Wiṣṭi"],
  KARANA_TETAP: { 1: "Kimtuǥna", 58: "Sakuni", 59: "Catuspada", 60: "Naga" },
  MASA: ["Cꜽtꭉa","Wꜽšāꝁa","Jỿéṣṭa","Äsađa","šꭉawaṇa","ƀadꭉawāda","Äsuji","Kar̀t͟tika","Mār̀g͟gašira","Puṣā","Māǥa","ꝑalguṇa"],
  RASI: ["meša","wr̥ṣaƀa","miŧuna","kar̀k͟ka","siṅha","kanỿā","tūla","mr̥c⃬ꞓika","đanuḥ","makara","kumƀa","mīna"],
  PAKSA: ["Šukla","Kr̥ṣṇa"],
  // saptawāra (Minggu = 0) dipakai juga sebagai nama vāra
  VARA: ["Raditỿa","Soma","äṅgara","Buđa","Wr̥haspati","Šukꭉa","Šanꜽšcara"],
  SADWARA: ["Tuŋlꜽ","Hariyaŋ","Wurukuŋ","Panir̀w͟wan⸝","Wās⸝","Mawulu"],
  PANCAWARA: ["Ümanis⸝","Pahiŋ","Pon","Wagꜽ","Kaliww̭ͧan⸝"],
  WUKU: ["Sinta","Landĕp⸝","Wukir⸝","Kurantil⸝","Tolu","Gumbr̥ᵉ̆g","Wariga","Warigadỿan⸝","Juluŋwaṅi","Suṅsaŋ","Duṅulan⸝","Kuniṅan⸝","Laṅkir⸝","Maḍasiha","Juluŋpujut⸝","Pahaŋ","Kuruwĕlut⸝","Marakiḥ","Tambir⸝","Maḍaŋkuṅan⸝","Mahatal⸝","Wuyꜽ","Manahil⸝","Praŋbakat⸝","Bala","Wugu","Wayaŋ","Kulawu","Ḍukut⸝","Watugunuŋ"],
  // 15 muhūrta; sistem 15×2: siang (terbit→terbenam) dan malam (terbenam→terbit) masing-masing 15, memakai daftar yang sama
  MUHURTA: ["rꜷdꭉa","šwéta","mꜽtꭉa","sāraƀaṭa","sāwitꭉa","wꜽrājỿa","wišwāwasu","äƀijit⸝","rꜷhiṇa","bala","wijaya","nꜽriti","baruṇa","somỿa","bago"],
  // urutan bagian siang (1/8) menurut hari, Minggu = 0
  RAHU: [8, 2, 7, 5, 6, 4, 3], YAMA: [5, 4, 3, 2, 1, 7, 6], GULIKA: [7, 6, 5, 4, 3, 2, 1],
};
// seluruh nama unsur jyotisa diseragamkan menjadi huruf kecil
for (const k of ["TITHI", "NAKSATRA", "DEWATA", "MANDALA", "YOGA", "KARANA_BERGERAK", "MASA", "RASI", "PAKSA", "VARA", "SADWARA", "PANCAWARA", "WUKU", "MUHURTA"]) PN[k] = PN[k].map(s => s.toLowerCase());
for (const k of Object.keys(PN.KARANA_TETAP)) PN.KARANA_TETAP[k] = PN.KARANA_TETAP[k].toLowerCase();
PN.MUHURTA_SIANG = PN.MUHURTA; PN.MUHURTA_MALAM = PN.MUHURTA;

class Panchanga {
  constructor(a) { this.A = a || new AstroEvents(); this._masaCache = null; }
  _n360(x) { return ((x % 360) + 360) % 360; }
  _n180(x) { return this.A._n180(x); }

  // ───────── Zodiak sidereal ─────────
  /** Ayanāṃśa Lahiri rata-rata (derajat) pada jd. */
  ayanamsa(jd) {
    const pr = T => (5028.796195 * T + 1.1054348 * T * T + 0.00007964 * T * T * T) / 3600;
    const T = (jd + this.A.dt.deltaT(jd) / 86400 - 2451545) / 36525, T0 = (2435553.5 - 2451545) / 36525;
    return 23.245524743 + pr(T) - pr(T0);
  }
  _dpsi(jd) { return this.A.sn.nt.nutationInLongitude(jd, this.A.dt.deltaT(jd)); }
  sidSun(jd)  { return this._n360(this.A.sunLon(jd)  - this._dpsi(jd) - this.ayanamsa(jd)); }
  sidMoon(jd) { return this._n360(this.A.moonLon(jd) - this._dpsi(jd) - this.ayanamsa(jd)); }

  // ───────── Pembagi sudut generik: nakṣatra, yoga, karaṇa, tithi ─────────
  /** Rentang elemen yang berlaku pada jd untuk nilai sudut `f(jd)` dibagi lebar `w`. */
  _span(f, w, rate, jd, nama) {
    const v = f(jd), idx = Math.floor(v / w), bag = (v - idx * w) / w, step = w / rate;
    const solve = (m, j0) => this.A._solve(j => this._n180(f(j) - m * w), j0, rate);
    return { idx, n: idx + 1, nama: nama(idx), bagian: bag, awal: solve(idx, jd - bag * step), akhir: solve(idx + 1, jd + (1 - bag) * step) };
  }
  nakshatra(jd) {
    const s = this._span(j => this.sidMoon(j), 40 / 3, 13.18, jd, i => PN.NAKSATRA[i % 27]);
    s.pada = Math.floor(s.bagian * 4) + 1; return s;
  }
  yoga(jd) { return this._span(j => this._n360(this.sidSun(j) + this.sidMoon(j)), 40 / 3, 14.17, jd, i => PN.YOGA[i % 27]); }
  /** Nama karaṇa ke-k (1–60): 1 tetap, 2–57 siklus 7 bergerak, 58–60 tetap. */
  namaKarana(k) { return PN.KARANA_TETAP[k] || PN.KARANA_BERGERAK[(k - 2) % 7]; }
  karana(jd) { return this._span(j => this.A.elongation(j), 6, 12.19, jd, i => this.namaKarana((i % 60) + 1)); }
  tithi(jd) {
    const s = this._span(j => this.A.elongation(j), 12, 12.19, jd, i => PN.TITHI[(i % 30) % 15]);
    s.paksha = s.n <= 15 ? PN.PAKSA[0] : PN.PAKSA[1]; return s;
  }

  // ───────── Māsa & Śakavarṣa ─────────
  /** Bulan lunar (bulan baru → bulan baru) yang memuat jd, diberi nama menurut skema amānta; deteksi adhika. */
  masa(jd) {
    let c = this._masaCache;
    if (!c || jd < c.awal || jd >= c.akhir) {
      let k = Math.floor((jd - 2451550.09766) / 29.530588861), a = this.A.moonPhase(k).jd;
      while (a > jd) a = this.A.moonPhase(--k).jd;
      let b = this.A.moonPhase(k + 1).jd;
      while (b <= jd) { a = b; b = this.A.moonPhase(++k + 1).jd; }
      const r1 = Math.floor(this.sidSun(a) / 30), r2 = Math.floor(this.sidSun(b) / 30);
      c = this._masaCache = { awal: a, akhir: b, adhika: r1 === r2, idx: (r1 + 1) % 12 };
    }
    const paksha = this.A.elongation(jd) < 180 ? PN.PAKSA[0] : PN.PAKSA[1];
    return { ...c, nama: PN.MASA[c.idx], paksha, adhika: c.adhika,
             namaPurnimanta: paksha === PN.PAKSA[1] && !c.adhika ? PN.MASA[(c.idx + 1) % 12] : PN.MASA[c.idx] };
  }
  /** Tahun Śaka: bertambah di Caitra Śukla Pratipadā (≈ Maret–April). bulanMasehi/tahunMasehi = tanggal lokal. */
  sakaYear(masaIdx, bulanMasehi, tahunMasehi) { return tahunMasehi - ((masaIdx >= 9 && bulanMasehi <= 5) ? 79 : 78); }
  /** Saat Matahari sidereal mencapai bujur `lon` (mis. 0 = Meṣa saṅkrānti) di sekitar jd0. */
  sankranti(lon, jd0) { return this.A._solve(j => this._n180(this.sidSun(j) - lon), jd0, 0.9856); }

  // ───────── Pawukon (kalender Bali, siklus 210 hari) ─────────
  /**
   * Wuku, saptawāra, pañcawāra, sadwāra untuk tanggal sipil (tahun, bulan, tanggal Masehi).
   * Acuan: Minggu 17-12-2023 = awal wuku Sinta (hari ke-0). saptawāra = hari ke-0 mod 7 (Minggu = 0), pañcawāra = (d+1) mod 5 (Ümanis = 0),
   * sadwāra = d mod 6 (Tuŋlꜽ = 0), wuku = ⌊d/7⌋. Cocok dengan Galungan (Buđa Kaliww̭ͧan⸝, wuku Duṅulan⸝) 28-2-2024 dan 23-4-2025.
   */
  pawukon(thn, bln, tgl) {
    const d = (((Math.round(Date.UTC(thn, bln - 1, tgl) / 864e5 - Date.UTC(2023, 11, 17) / 864e5)) % 210) + 210) % 210, iw = Math.floor(d / 7);
    return { hariKe: d, noWuku: iw + 1, wuku: PN.WUKU[iw], saptawara: PN.VARA[d % 7], pancawara: PN.PANCAWARA[(d + 1) % 5], sadwara: PN.SADWARA[d % 6], idx: { wuku: iw, saptawara: d % 7, pancawara: (d + 1) % 5, sadwara: d % 6 } };
  }

  // ───────── Lagna (ascendant) ─────────
  /** Bujur ascendant sidereal (derajat) dan rāśi (0 = Meṣa) pada jd di lintang lat, bujur lon. */
  lagna(jd, lat, lon) {
    const A = this.A, dT = A.dt.deltaT(jd), th = A.sn.localApparentSiderialTime(jd, dT, lon) * Math.PI / 180,
      eps = A.sn.nt.trueObliquityOfEcliptic(jd, dT) * Math.PI / 180, ph = lat * Math.PI / 180;
    const asc = this._n360(Math.atan2(Math.cos(th), -(Math.sin(th) * Math.cos(eps) + Math.tan(ph) * Math.sin(eps))) * 180 / Math.PI);
    const sid = this._n360(asc - this._dpsi(jd) - this.ayanamsa(jd));
    return { trop: asc, sid, rasi: Math.floor(sid / 30), nama: PN.RASI[Math.floor(sid / 30)] };
  }
  _lagnaCross(m, jd0, lat, lon) {                 // waktu saat ascendant sidereal = 30°·m (turunan numerik)
    let jd = jd0;
    for (let i = 0; i < 14; i++) {
      const f = j => this._n180(this.lagna(j, lat, lon).sid - 30 * m), h = 1e-3, d = f(jd), s = (f(jd + h) - d) / h || 360, dj = d / s;
      jd -= dj; if (Math.abs(dj) < 1e-7) break;
    }
    return jd;
  }
  /** Daftar lagna-rāśi sejak jdMulai selama `jam` jam (default 24): [{nama, awal, akhir}] */
  lagnaSpans(jdMulai, lat, lon, jam = 24) {
    const out = [], jdAkhir = jdMulai + jam / 24;
    let l = this.lagna(jdMulai, lat, lon), m = l.rasi, awal = this._lagnaCross(m, jdMulai - (l.sid - 30 * m) / 360, lat, lon);
    for (let g = 0; g < 16 && awal < jdAkhir; g++) {
      const akhir = this._lagnaCross((m + 1) % 12, awal + (30 / 360) * 1.05, lat, lon);
      out.push({ rasi: m, nama: PN.RASI[m], awal, akhir }); awal = akhir; m = (m + 1) % 12;
    }
    return out;
  }

  // ───────── Muhūrta ─────────
  /** Muhūrta hari itu dari terbit (sr), terbenam (ss), dan terbit berikutnya (sr2); vara 0 = Minggu. */
  muhurta(sr, ss, sr2, vara) {
    const dayLen = ss - sr, nightLen = sr2 - ss, sl = k => [sr + (k - 1) * dayLen / 8, sr + k * dayLen / 8];
    const siang = PN.MUHURTA_SIANG.map((n, i) => ({ nama: n, awal: sr + i * dayLen / 15, akhir: sr + (i + 1) * dayLen / 15 }));
    const malam = PN.MUHURTA_MALAM.map((n, i) => ({ nama: n, awal: ss + i * nightLen / 15, akhir: ss + (i + 1) * nightLen / 15 }));
    const [ra, rb] = sl(PN.RAHU[vara]), [ya, yb] = sl(PN.YAMA[vara]), [ga, gb] = sl(PN.GULIKA[vara]);
    return {
      brahma: { awal: sr - 96 / 1440, akhir: sr - 48 / 1440 },
      abhijit: { awal: siang[7].awal, akhir: siang[7].akhir, catatan: vara === 3 ? "Hari Rabu: Abhijit tidak dianjurkan" : "" },
      rahu: { awal: ra, akhir: rb }, yamaganda: { awal: ya, akhir: yb }, gulika: { awal: ga, akhir: gb },
      lamaSiang: dayLen * 24, lamaMalam: nightLen * 24, siang, malam,
    };
  }

  // ───────── Rangkaian harian (untuk grafik 24 jam) ─────────
  /**
   * Rangkaian elemen yang berlaku pada [jdMulai, jdSelesai]; nama = "tithi" | "nakshatra" | "yoga" | "karana".
   * Tiap butir: {awal, akhir (terpotong ke jendela), awalAsli, akhirAsli (waktu sebenarnya), nama, n, paksha?, pada?}
   */
  rangkaian(nama, jdMulai, jdSelesai) {
    const f = this[nama], out = []; let t = jdMulai;
    for (let g = 0; g < 24; g++) {
      const s = f.call(this, t);
      out.push({ ...s, awalAsli: s.awal, akhirAsli: s.akhir, awal: Math.max(s.awal, jdMulai), akhir: Math.min(s.akhir, jdSelesai) });
      if (s.akhir >= jdSelesai) break; t = s.akhir + 1e-4;
    }
    return out;
  }
  /**
   * Caughaḍiyā: siang (terbit→terbenam) dan malam (terbenam→terbit berikutnya) masing-masing dibagi 8.
   * Siklus siang: Udvega, Cara, Lābha, Amṛta, Kāla, Śubha, Roga (mulai dari indeks 3·vāra); malam: Śubha, Amṛta, Cara, Roga, Kāla, Lābha, Udvega (mulai 2·vāra).
   * vara 0 = Minggu. kualitas: baik (Amṛta, Śubha, Lābha), netral (Cara), buruk (Udvega, Kāla, Roga).
   */
  caughadiya(sr, ss, sr2, vara) {
    const D = ["Udvega", "Cara", "Lābha", "Amṛta", "Kāla", "Śubha", "Roga"], N = ["Śubha", "Amṛta", "Cara", "Roga", "Kāla", "Lābha", "Udvega"];
    const q = n => (n === "Amṛta" || n === "Śubha" || n === "Lābha") ? "baik" : n === "Cara" ? "netral" : "buruk", out = [];
    for (let i = 0; i < 8; i++) { const n = D[(3 * vara + i) % 7]; out.push({ nama: n, kualitas: q(n), malam: false, awal: sr + i * (ss - sr) / 8, akhir: sr + (i + 1) * (ss - sr) / 8 }); }
    for (let i = 0; i < 8; i++) { const n = N[(2 * vara + i) % 7]; out.push({ nama: n, kualitas: q(n), malam: true, awal: ss + i * (sr2 - ss) / 8, akhir: ss + (i + 1) * (sr2 - ss) / 8 }); }
    return out;
  }

  // ───────── Pencarian adhika & kṣaya māsa ─────────
  /**
   * Generator bulan lunar (bulan baru → bulan baru) yang bulan barunya jatuh di [jdAwal, jdAkhir].
   * jenis: "adhika" (tanpa saṅkrānti), "ksaya" (dua saṅkrānti), atau "normal".
   */
  *lunarMonths(jdAwal, jdAkhir) {
    const A = this.A;
    let k = Math.floor((jdAwal - 2451550.09766) / 29.530588861) - 1, a = A.newMoon(k);
    while (a < jdAwal) { k++; a = A.newMoon(k); }
    for (; a <= jdAkhir; k++) {
      const b = A.newMoon(k + 1), r1 = Math.floor(this.sidSun(a) / 30), r2 = Math.floor(this.sidSun(b) / 30), d = (r2 - r1 + 12) % 12, idx = (r1 + 1) % 12;
      yield { k, awal: a, akhir: b, lama: b - a, r1, r2, idx, nama: PN.MASA[idx], jenis: d === 0 ? "adhika" : d === 2 ? "ksaya" : "normal",
              hilang: d === 2 ? PN.MASA[(idx + 1) % 12] : null, sankranti: d === 2 ? [PN.RASI[(r1 + 1) % 12], PN.RASI[(r1 + 2) % 12]] : null };
      a = b;
    }
  }
  /** Cari semua adhika & kṣaya māsa untuk tahun Masehi tahunAwal..tahunAkhir (sinkron; untuk rentang besar pakai generator). */
  cariAdhikaKsaya(tahunAwal, tahunAkhir) {
    const J = this.A.jd, out = { bulan: 0, adhika: [], ksaya: [] };
    for (const m of this.lunarMonths(J.kmjd(1, 1, tahunAwal, 0, 0), J.kmjd(1, 1, tahunAkhir + 1, 0, 0))) {
      out.bulan++; if (m.jenis === "adhika") out.adhika.push(m); else if (m.jenis === "ksaya") out.ksaya.push(m);
    }
    return out;
  }
}
