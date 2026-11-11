/**
 * salat_service.js — Layanan tingkat atas: jadwal salat satu hari lengkap.
 * Memanggil WaktuSalat (core), menerapkan ihtiyat, dan Isya berbasis interval (Ummul Qura)
 * dengan deteksi Ramadan otomatis lewat CalendarService.
 * Sumber Dart: lib/src/service/salat_service.dart (ditulis manual)
 */
class SalatService {
  constructor(){ this._jd = new JulianDay(); }
  _isRamadanMalam(tgl,bln,thn){
    try{ const b=new Date(Date.UTC(thn,bln-1,tgl+1)); const raw=new CalendarService().serviceKalenderHijriahMABIMS(b.getUTCDate(),b.getUTCMonth()+1,b.getUTCFullYear());
      const p=raw.split('|'); return (p.length>1?p[1]:raw).toLowerCase().includes('ramad'); }catch(e){ return false; }
  }
  waktuSalatHarian({tglM,blnM,thnM,gLon,gLat,elev=0,tmZn,prayerMethod=PrayerMethod.persatuanIslam,
      ihtySubuh=0,ihtySyuruk=0,ihtyDuha=0,ihtyZuhur=0,ihtyAsar=0,ihtyMagrib=0,ihtyIsya=0,ihtyNisfu=0,isRamadan=null}){
    const ws = new WaktuSalat();
    const apply=(v,iht)=> v.status!==SalatStatus.normal ? v : new SalatValue({time: ws.ihtiyathShalat(v.time,iht), status: SalatStatus.normal});
    const subuh  = apply(ws.subuh(tglM,blnM,thnM,gLon,gLat,tmZn,prayerMethod.hmSubuh), ihtySubuh);
    const syuruk = apply(ws.syuruk(tglM,blnM,thnM,gLon,gLat,elev,tmZn), ihtySyuruk);
    const duha   = apply(ws.duha(tglM,blnM,thnM,gLon,gLat,elev,tmZn), ihtySyuruk);
    const zuhur  = apply(ws.zuhur(tglM,blnM,thnM,gLon,tmZn), ihtyZuhur);
    const asar   = apply(ws.asar(tglM,blnM,thnM,gLon,gLat,tmZn), ihtyAsar);
    const magrib = apply(ws.magrib(tglM,blnM,thnM,gLon,gLat,elev,tmZn), ihtyMagrib);
    let isya;
    if (prayerMethod.isyaBerbasisInterval) {
      const raw = ws.magrib(tglM,blnM,thnM,gLon,gLat,elev,tmZn);
      if (!raw.isNormal) isya = raw;
      else {
        const ramadan = isRamadan ?? this._isRamadanMalam(tglM,blnM,thnM);
        const menit = ramadan ? (prayerMethod.isyaMenitSetelahMagribRamadan ?? prayerMethod.isyaMenitSetelahMagrib) : prayerMethod.isyaMenitSetelahMagrib;
        isya = apply(new SalatValue({time: raw.time + menit/60, status: SalatStatus.normal}), ihtyIsya);
      }
    } else isya = apply(ws.isya(tglM,blnM,thnM,gLon,gLat,tmZn,prayerMethod.hmIsya), ihtyIsya);
    const nisfuLail = apply(ws.nisfuLail(tglM,blnM,thnM,gLon,gLat,elev,tmZn,{prayerMethod}), ihtyMagrib);
    return new SalatDailyResult({subuh,syuruk,duha,zuhur,asar,magrib,isya,nisfuLail});
  }
}
