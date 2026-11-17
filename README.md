# PERSIS TIMES JS

Port JavaScript dari pustaka Dart `persis_times` (abusabda, lisensi MIT). Berjalan di peramban **tanpa peladen**:
buka `index.html` dengan klik ganda (memakai `<script src>` biasa, bukan `import`, agar jalan via `file://`).

## Struktur dan urutan muat

| Tahap | Berkas | Isi |
|---|---|---|
| 1. Data | `js/data/*.js` | Koefisien VSOP87D (Matahari) dan ELPMPP02 (Bulan: bujur, lintang, jarak), 38.326 suku |
| 2. Inti | `js/core/models.js`, `prayer_method.js` | Model hasil dan metode salat (sudut Subuh/Isya) |
| | `safe_math`, `math_utils` | Matematika dasar dan pemformat sudut |
| | `julian_day`, `dynamical_time`, `nutation` | Waktu astronomi dan koreksi |
| | `sun`, `moon_longitude/latitude/distance`, `moon` | Posisi dan fenomena Matahari/Bulan |
| | `waktu_salat`, `arah_kiblat` | Algoritma salat dan kiblat |
| 3. Layanan | `js/services/calendar_service.js`, `salat_service.js` | Kalender Hijriah, jadwal salat harian |
| | `js/services/hisab_awal_bulan_service.js` | Hisab awal bulan: ijtimak, Magrib, data hilal, status MABIMS/Turki/WH |
| | `js/services/peta_visibilitas_service.js` | Visibilitas hilal per lokasi: Odeh, Yallop, SAAO, Maunder, Bruin |
| | `js/services/lunar_eclipse_service.js`, `solar_eclipse_service.js` | Gerhana Bulan/Matahari: Besselian, kontak, magnitudo, global, lokal, rentang tahun H |
| | `js/services/astro_events_service.js` | **Tambahan** (bukan dari Dart): fase Bulan, solstis/ekuinoks, tithi |
| | `js/services/jadwal_service.js` | **Tambahan**: jadwal lengkap — hisab berdetik + ihtiyat, imsak, twilight, Bulan terbit/terbenam, keterangan kriteria |
| | `js/services/pelengkap_service.js` | **Tambahan**: waktu istiwa, tafawut (perata waktu), sepertiga malam, rasydulqiblat harian |
| | `js/services/panchanga_service.js` | **Tambahan**: pañcāṅga lengkap — nakṣatra, yoga, karaṇa, māsa, śakavarṣa, lagna-rāśi, muhūrta (ayanāṃśa Lahiri) |
| 4. Antarmuka | `js/app/ui.js` | Kerangka: formulir lokasi, sistem tab, pemformat |
| | `js/app/charts.js` | Grafik SVG kecil (batang, linimasa), mengikuti tema |
| | `js/app/tab_*.js`, `main.js`, `css/style.css` | Satu berkas per tab: salat, posisi, fase, musim, tithi, hilal (+peta), gerhana |

Urutan `<script>` di `index.html` penting: data → inti → layanan → antarmuka.

## Alur perhitungan
- Waktu salat: `SalatService.waktuSalatHarian` → `WaktuSalat` → `SunFunction` (VSOP87D + nutasi + ΔT) → jam desimal → ihtiyat.
- Hisab awal bulan: `MoonFunction.geocentricConjunction` (ijtimak) → `SunFunction.jdGhurubSyams` (Magrib) → posisi Matahari/Bulan saat Magrib → elongasi, tinggi hilal, kriteria.

## Contoh pemakaian
```js
const r = new SalatService().waktuSalatHarian({tglM:10,blnM:11,thnM:2026,gLon:110.3695,gLat:-7.7956,elev:100,tmZn:7,
                                               prayerMethod:PrayerMethod.persatuanIslam});
r.subuh.time;                                   // jam desimal

const h = new HisabAwalBulanService().hitung({blnH:10,thnH:1447,gLon:110.37,gLat:-7.80,tmZn:7,
            elev:100,pres:1010,temp:10,tbhHari:0,optKriteria:1});
h.geojdIjtimak; h.moonGeo.altitude; h.imkanMabimsStatus;   // 1 = memenuhi, 2 = belum

const peta = new PetaVisibilitasService(), pre = peta.preHitung({blnH:10,thnH:1447});
peta.hitung({blnH:10,thnH:1447,gLon:-74,gLat:40.7,tmZn:-5,tbhHari:1,jdIjtimak:pre.jdIjtimak,deltaT:pre.deltaT}).zonaOdeh;
```
`blnH` = bulan Hijriah yang awalnya dihisab (10 = Syawwal). `tbhHari` menggeser hari Magrib dari tanggal lokal ijtimak.
Peta dunia di antarmuka memakai Magrib pertama setelah ijtimak (opsi bisa diganti).

## Fase Bulan, Solstis & Ekuinoks, Tithi (tambahan)
Pustaka Dart asli hanya memiliki `moonPhasesModified` (deret Meeus per bulan Hijriah). Tiga fitur ini ditambahkan di `AstroEvents`
dengan pencarian akar (Newton) pada bujur tampak Matahari (VSOP87D) dan Bulan (ELPMPP02), ΔT otomatis. Semua waktu berupa JD UT.
```js
const A = new AstroEvents();
A.phasesBetween(jdAwal, jdAkhir);   // [{jd, fase:0..3, nama}]  0=baru, 1=kuartal pertama, 2=purnama, 3=kuartal terakhir
A.moonPhase(k);                     // k bulat = bulan baru; k+0.5 = purnama (k=0 ≈ 6 Jan 2000)
A.seasons(2026);                    // [{jd, nama}] Ekuinoks Mar, Solstis Jun, Ekuinoks Sep, Solstis Des
A.tithiSpan(jd);                    // {n:1..30, nama, paksha, awal, akhir}   (n 15 = Purnima, 30 = Amavasya)
A.moonState(jd);                    // {elongasi, iluminasi(%), umur(hari), jarakKm}
```
Validasi: musim 2026 dan fase Maret 2026 cocok dengan USNO sampai menit (ekuinoks 20 Mar 14:45:53 UT, solstis 21 Jun 08:24:25 UT;
purnama 3 Mar 11:37:50 UT, bulan baru 19 Mar 01:23:25 UT); bulan baru Meeus 1977 selisih ±3 detik. Tithi n berlangsung saat elongasi
12°·(n−1) → 12°·n; Purnima berakhir tepat saat purnama.

## Pañcāṅga (tambahan)
```js
const P = new Panchanga();                    // memakai AstroEvents di dalamnya
P.tithi(jd); P.nakshatra(jd); P.yoga(jd); P.karana(jd);   // {n, nama, awal, akhir, bagian, (pada | paksha)}
P.masa(jd);                                   // {nama, adhika, namaPurnimanta, paksha, awal, akhir}  (skema amānta)
P.sakaYear(masa.idx, bulanMasehi, tahunMasehi);           // tahun Śaka
P.lagna(jd, lat, lon); P.lagnaSpans(jd, lat, lon, 24);    // ascendant sidereal & jam tiap lagna-rāśi
P.muhurta(jdTerbit, jdTerbenam, jdTerbitBerikutnya, vara);// Brahma, Abhijit, Rāhu, Yamagaṇḍa, Gulika + 30 muhūrta
P.sidSun(jd); P.sidMoon(jd); P.ayanamsa(jd);  // zodiak sidereal
```
Grafik harian 24 jam (tab Tithi & Pañcāṅga, `Charts.dayline`): garis waktu terbit → terbit berikutnya, tiap unsur berupa blok berwarna (nuansa bergantian per masa berlaku).
Tiga mode: (1) Pañcāṅga + lagna-rāśi + 30 muhūrta (15 siang, 15 malam; tanpa penanda waktu baik/buruk), (2) Pañcāṅga saja (Tithi, Nakṣatra, Yoga, Karaṇa, Vāra),
(3) Lengkap: + Lagna, Caughaḍiyā (hijau baik, abu netral, merah buruk), Kāla (Rāhu, Yamagaṇḍa, Gulika), Brahma/Abhijit muhūrta. Mesin: `Panchanga.rangkaian('tithi'|'nakshatra'|'yoga'|'karana', jdAwal, jdAkhir)` dan
`Panchanga.caughadiya(sr, ss, sr2, vara)` (siklus siang Udvega-Cara-Lābha-Amṛta-Kāla-Śubha-Roga mulai indeks 3·vāra; malam Śubha-Amṛta-Cara-Roga-Kāla-Lābha-Udvega mulai 2·vāra).
Validasi terhadap contoh Drik Panchang (New Delhi, Minggu 15 Nov 2026): Tithi Ṣaṣṭhī → Saptamī berakhir 02:02 (contoh 02:00), Nakṣatra Uttarāṣāḍhā → Śravaṇa 23:29 (23:28),
Karaṇa Kaulava 12:44 (12:43) → Taitila 02:02 → Gara, Yoga Gaṇḍa sepanjang jendela, dan seluruh Caughaḍiyā buruk cocok. Kota "New Delhi" tersedia di daftar kota.

Definisi: nakṣatra = bujur sidereal Bulan / 13°20′ (27); yoga = (bujur sidereal Matahari + Bulan) / 13°20′; karaṇa = elongasi / 6° (60 per bulan:
Kiṃstughna, 7 karaṇa bergerak × 8, lalu Śakuni, Catuṣpada, Nāga); māsa amānta dinamai rāśi sidereal Matahari saat bulan baru (+1), tanpa saṅkrānti = adhika;
Śaka bertambah di Caitra Śukla Pratipadā. Validasi: ayanāṃśa Lahiri J2000 = 23,8571°; Śaka 1948 mulai 19 Mar 2026; Adhika Jyeṣṭha 17 Mei–15 Jun 2026
terdeteksi; Diwali 8 Nov 2026 = Āśvina Kṛṣṇa Amāvāsyā; lagna saat terbit mendekati bujur Matahari.

Pencarian adhika/kṣaya māsa pada rentang tahun:
```js
const P = new Panchanga();
const hasil = P.cariAdhikaKsaya(2000, 2100);  // {bulan, adhika:[...], ksaya:[...]}  (±2,6 ms per bulan lunar)
for (const m of P.lunarMonths(jdAwal, jdAkhir)) { /* generator: {awal, akhir, lama, idx, nama, jenis:'normal'|'adhika'|'ksaya', hilang, sankranti} */ }
```
Validasi: adhika 2001 Āśvina, 2004 Śrāvaṇa, 2007 Jyeṣṭha, 2010 Vaiśākha, 2012 Bhādrapada, 2015 Āṣāḍha, 2018 Jyeṣṭha, 2020 Āśvina, 2023 Śrāvaṇa, 2026 Jyeṣṭha;
kṣaya 1963 (Mārgaśīrṣa), 1983 (Māgha), 2123–24 (Pauṣa). Tab antarmuka: linimasa, frekuensi per māsa, selang antar adhika, kurun, siklus Metonik (`charts.js`, SVG tanpa pustaka luar).
Tradisi regional bisa berbeda dalam detail (mis. aturan hari perayaan, vāra muhūrta); anggap ini hitungan astronomis, bukan panchang resmi.

## Ejaan nama & Pawukon
Nama māsa, tiŧi, nakṣatꭉa (beserta déwatā dan maṇḍala), yoga, karaṇa, muhūr̀tta, rāšī, wuku, sadwāra, pañcawāra, saptawāra, dan pakṣa mengikuti daftar ejaan yang diberikan pengguna
(`PN` di `panchanga_service.js`; urutan = urutan baku, jumlah divalidasi: 15, 27, 27, 27, 27, 12, 12, 7, 6, 5, 30, 15, 2).
Catatan: tiŧi 15 dan 30 sama-sama "Pañcadašī" (dibedakan pakṣa Šukla/Kr̥ṣṇa); nama karaṇa tetap dipetakan menurut identitas (Sakuni = 58, Catuspada = 59, Naga = 60);
muhūr̀tta memakai sistem 15×2 (15 siang + 15 malam) dengan daftar nama yang sama untuk keduanya. Ejaan memakai aksara Latin Extended-D/E; bila tampil kotak, pasang font seperti
Junicode, Gentium Plus, Charis SIL, atau FreeSerif (CSS sudah mencantumkannya sebagai cadangan).
```js
const P = new Panchanga();
P.pawukon(2026, 11, 15);   // {hariKe, noWuku, wuku, saptawara, pancawara, sadwara, idx:{...}}
P.nakshatra(jd);           // {n, nama, pada, idx}  →  PN.DEWATA[idx], PN.MANDALA[idx]
```
Pawukon (siklus 210 hari): hari ke-0 = Minggu 17-12-2023 (awal wuku Sinta); saptawāra = d mod 7, pañcawāra = (d+1) mod 5 (Ümanis = 0), sadwāra = d mod 6 (Tuŋlꜽ = 0), wuku = ⌊d/7⌋.
Validasi: Galungan (Buđa Kaliww̭ͧan⸝, wuku Duṅulan⸝) 28-2-2024, 23-4-2025, 19-11-2025, 17-6-2026; Saniscara Kaliww̭ͧan⸝ (Tumpek) jatuh tepat pada enam wuku Tumpek
(Landĕp, Wariga, Kuniṅan, Kuruwĕlut, Wuyꜽ, Wayaŋ). Offset sadwāra (Tuŋlꜽ pada Raditỿa wuku Sinta) tidak dapat diverifikasi dari sumber independen; ia konsisten dengan contoh pengguna
(Raditỿa, Kaliww̭ͧan⸝, Tuŋlꜽ, wuku Bala). Hari pawukon di grafik memakai tanggal sipil hari terbit (Bali menggantinya pukul 00:00).

## Gerhana
```js
const S = new SolarEclipseService(), L = new LunarEclipseService();
S.solarEclipseGlobal({blnH:2, thnH:1448});     // 12 Agt 2026: Sentral Total, magnitudo 1,0386, durasi 2m18s
S.solarEclipseLocal({blnH:2, thnH:1448, gLon:-0.88, gLat:41.65, elev:200, pres:1010, temp:20, tmZn:2});
L.lunarEclipseGlobal({blnH:9, thnH:1447});     // 3 Mar 2026: Gerhana Bulan Total
S.solarEclipseGlobalRangeHijri({tahunAwalH:1448, tahunAkhirH:1449, timeScale:TimeScale.jdUT});
```
`blnH` = bulan Hijriah yang awalnya ditandai ijtimak/oposisi gerhana itu (Matahari: ijtimak; Bulan: purnama).
Pustaka asli menghitung keadaan geometris lokal meski Matahari/Bulan di bawah ufuk (`altMx < 0`); antarmuka menandainya "tidak teramati".

## Jadwal lengkap: imsak, twilight, Bulan, kriteria (tambahan)
```js
const J = new JadwalLengkap();
const L = { lat:-7.7956, lon:110.3695, elev:100, tz:7, method:PrayerMethod.persatuanIslam, iht:2 };
const r = J.hitung(12, 11, 2026, L, { imsakMenit: 10 });
r.hisab.subuh.time;      // jam desimal mentah (berdetik)       r.jadwal.subuh.time  // menit dibulatkan ke bawah + ihtiyat
r.astro.fajarSipil;      // juga fajarNaut, fajarAstro, senjaSipil/Naut/Astro, bulanTerbit/Transit/Terbenam, lamaSiang/Malam
J.kriteria(12, 11, 2026, L);                         // [{nama, kriteria, nilai}] keterangan kriteria menurut metode
J.nilai(12, 11, 2026, L, ['subuh','magrib','bulanTerbit']);   // hanya yang dibutuhkan (hemat; dipakai grafik)
```
Kriteria sesuai kode pustaka: Subuh/Isya = sudut Matahari menurut metode; Syuruk/Magrib = −(SD + 34,5′ + 1,76′·√elevasi); Duha = Syuruk + 15 menit;
Zuhur = istiwa; Asar = bayangan = tinggi benda + bayangan istiwa; Nisfu lail = tengah Magrib–Subuh. Imsak = Subuh − n menit (bawaan 10, dapat diatur).
Fajar/senja sipil, nautis, astronomis = Matahari −6°, −12°, −18° (memakai `WaktuSalat.subuh/isya` dengan sudut itu). Bulan terbit/terbenam memakai `MoonFunction.moonTransitRiseSet`
(h = −34′ + 0,7275·π − 0,0353·√elevasi); hasil 0 pada tanggal itu berarti tidak ada kejadian. Isya Ummul Qura (interval) memakai deteksi Ramadan dari kalender Ummul Qura bawaan peramban (`Intl`).

## Waktu pelengkap salat & rasydulqiblat (tambahan + pustaka)
```js
const W = new WaktuPelengkap();
W.istiwa(10, 11, 2026, 110.3695, -7.7956, 7);      // {jam, tafawut(jam), kwd(jam), deklinasi, tinggi}  istiwa = zuhur mentah (12 − e − KWD)
W.sepertigaMalam(10, 11, 2026, lon, lat, elev, 7, PrayerMethod.persatuanIslam); // {magrib, subuh, lama, akhirSepertigaPertama, tengahMalam, awalSepertigaTerakhir}

const R = new RasydulHarian(), Q = new ArahKiblat().arahQiblatSpherical(lon, lat);
R.hari(12, 11, 2026, lat, lon, 7, Q);               // [{jenis:0|1, jam, tinggi, azimut}]  0 = Matahari di arah kiblat, 1 = bayangan menuju kiblat
R.sunAltAz(jd, lat, lon);                           // {tinggi, azimut} Matahari geosentris

const ak = new ArahKiblat();                        // dari pustaka Dart (sudah ikut diport):
ak.rashdulQiblat(2026, 7, 1);                       // {jd, jamDes, tinggi, deklinasi}  opt 1 = Rasydul 1 (±28 Mei), 2 = Rasydul 2 (±15 Juli)
ak.antipodaKabah(2026, 7, 1);                       // Matahari di nadir Ka'bah
ak.rashdulQiblatBulan(2026, 7);                     // Bulan di zenit Ka'bah (daftar)
```
Rasydulqiblat harian: syarat azimut Matahari = Q (atau Q+180°) berbentuk a·cosH + b·sinH = c dengan a = sinφ·sinQ·cosδ, b = −cosQ·cosδ, c = sinQ·cosφ·sinδ.
Ada dua akar sudut jam; tiap akar diiterasi sendiri, jenisnya ditentukan dari tanda hasil kali titik, dan hanya yang Matahari-nya di atas ufuk dikembalikan.
Jam yang dekat zenit (tinggi > 85°) azimutnya tidak pasti. Uji silang terhadap `sunAltAz` pada 655 peristiwa di 7 lokasi: simpangan azimut < 0,05° kecuali saat Matahari < 0,4° dari zenit.
Tafawut: pustaka Dart tidak memuatnya; di sini diartikan perata waktu (e) = selisih waktu hakiki (istiwa) terhadap waktu pertengahan ("daqāiq al-tafāwut" pada tabel falak klasik).
Jika yang dimaksud berbeda, ubah baris "Tafawut" pada `js/app/tab_salat.js`. Perata waktu pustaka cocok dengan transit berbasis asensio rekta sampai 0,2 detik.

## Belum diport
Pembungkus `qibla_service.dart` (rentang tahun) tidak diport; fungsinya tersedia langsung lewat `ArahKiblat`.

Lisensi: lihat `LICENSE-persis_times.txt` (hak cipta asli abusabda, MIT).
