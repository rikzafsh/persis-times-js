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
| 4. Antarmuka | `js/app/app.js`, `app_hisab.js`, `app_gerhana.js`, `css/style.css` | Satu-satunya bagian yang menyentuh DOM |

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

## Belum diport
Rashdulqiblat dan antipoda Ka'bah.

Lisensi: lihat `LICENSE-persis_times.txt` (hak cipta asli abusabda, MIT).
