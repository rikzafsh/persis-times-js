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
| 4. Antarmuka | `js/app/app.js`, `css/style.css` | Satu-satunya bagian yang menyentuh DOM |

Urutan `<script>` di `index.html` penting: data → inti → layanan → antarmuka.

## Alur perhitungan waktu salat
`SalatService.waktuSalatHarian` → `WaktuSalat` → `SunFunction` (VSOP87D + nutasi + ΔT) → jam desimal → ihtiyat.

## Pakai sebagai pustaka
```html
<script src="js/data/sun_vsop87d.js"></script> ... (urutan seperti index.html, tanpa app.js)
<script>
  const r = new SalatService().waktuSalatHarian({tglM:10,blnM:11,thnM:2026,gLon:110.3695,gLat:-7.7956,elev:100,tmZn:7,
                                                 prayerMethod:PrayerMethod.persatuanIslam});
  r.subuh.time; // jam desimal
</script>
```

## Belum diport
Gerhana Matahari/Bulan, hisab awal bulan, peta visibilitas hilal, rashdulqiblat.

Lisensi: lihat `LICENSE-persis_times.txt` (hak cipta asli abusabda, MIT).
