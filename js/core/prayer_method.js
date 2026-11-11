/**
 * prayer_method.js — Metode penentuan waktu salat: sudut Subuh/Isya per lembaga.
 * Persatuan Islam, Kemenag RI, NU, Muhammadiyah, EGAS, ISNA, MWL, Karachi, Ummul Qura (Isya 90/120 menit).
 * Sumber Dart: lib/src/core/prayer/prayer_method.dart (ditulis manual)
 */
class PrayerMethod {
  constructor(name,hmSubuh,hmIsya,{isCustom=false,isyaMenitSetelahMagrib=null,isyaMenitSetelahMagribRamadan=null}={}){
    Object.assign(this,{name,hmSubuh,hmIsya,isCustom,isyaMenitSetelahMagrib,isyaMenitSetelahMagribRamadan});}
  get isyaBerbasisInterval(){return this.isyaMenitSetelahMagrib!=null;}
  static custom(name,hmSubuh,hmIsya){return new PrayerMethod(name,hmSubuh,hmIsya,{isCustom:true});}
  static fromName(n){const l=n.toLowerCase();return PrayerMethod.predefined.find(m=>m.name.toLowerCase()===l)||null;}
}
PrayerMethod.persatuanIslam=new PrayerMethod("Persatuan Islam",-20,-18);
PrayerMethod.kemenagRI=new PrayerMethod("Kemenag RI",-20,-18);
PrayerMethod.nahdlatulUlama=new PrayerMethod("Nahdlatul Ulama",-20,-18);
PrayerMethod.muhammadiyah=new PrayerMethod("Muhammadiyah",-18,-18);
PrayerMethod.egyptianGeneralAuthority=new PrayerMethod("Egyptian General Authority of Survey",-19.5,-17.5);
PrayerMethod.islamicSocietyNorthAmerica=new PrayerMethod("Islamic Society of North America",-18,-18);
PrayerMethod.muslimWorldLeague=new PrayerMethod("Muslim World League",-18,-17);
PrayerMethod.universityIslamicScienceKarachi=new PrayerMethod("University of Islamic Science, Karachi",-18,-18);
PrayerMethod.ummulQura=new PrayerMethod("Ummul Qura",-18.5,-18,{isyaMenitSetelahMagrib:90,isyaMenitSetelahMagribRamadan:120});
PrayerMethod.predefined=[PrayerMethod.persatuanIslam,PrayerMethod.kemenagRI,PrayerMethod.nahdlatulUlama,PrayerMethod.muhammadiyah,PrayerMethod.egyptianGeneralAuthority,PrayerMethod.islamicSocietyNorthAmerica,PrayerMethod.muslimWorldLeague,PrayerMethod.universityIslamicScienceKarachi,PrayerMethod.ummulQura];
