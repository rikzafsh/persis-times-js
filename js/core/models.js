/**
 * models.js — Model data kecil (ditulis manual; di Dart ada di lib/src/model/).
 * SalatStatus  : enum status hasil waktu salat (normal/up/down/bright/dark/invalid)
 * SalatValue   : { time (jam desimal | null), status }
 * SalatDailyResult, QiblaEventResult : pembungkus hasil
 */
const SalatStatus = Object.freeze({normal:"normal",up:"up",down:"down",bright:"bright",dark:"dark",invalid:"invalid"});
class SalatValue { constructor({time=null,status}){this.time=time;this.status=status;} get isNormal(){return this.status===SalatStatus.normal;} }
class SalatDailyResult { constructor(o){Object.assign(this,o);} }
class QiblaEventResult { constructor(o){Object.assign(this,o);} }
class SunDataGeo { constructor(o){Object.assign(this,o);} }
class SunDataTopo { constructor(o){Object.assign(this,o);} }
class MoonDataGeo { constructor(o){Object.assign(this,o);} }
class MoonDataTopo { constructor(o){Object.assign(this,o);} }
class HilalData { constructor(o){Object.assign(this,o);} }
class HisabAwalBulanResult { constructor(o){Object.assign(this,o);} }
class PetaVisibilitasHilalResult { constructor(o){Object.assign(this,o);} }

// Model hasil hisab awal bulan & visibilitas: pembungkus objek polos.

// ── Model gerhana (lib/src/model/*_eclipse, helper_eclipse): pembungkus objek polos ──
class EclipseContact { constructor(o){Object.assign(this,o);} }
class EclipseEphemeris { constructor(o){Object.assign(this,o);} }
class EclipseEphemerisBody { constructor(o){Object.assign(this,o);} }
class EclipseEphemerisGlobal { constructor(o){Object.assign(this,o);} }
class EclipseEphemerisBodyGlobal { constructor(o){Object.assign(this,o);} }
class EclipseContactGlobal { constructor(o){Object.assign(this,o);} }
class LunarEclipseLocalResult { constructor(o){Object.assign(this,o);} }
class LunarEclipseGlobalResult { constructor(o){Object.assign(this,o);} }
class LunarEclipseGlobalSummary { constructor(o){Object.assign(this,o);} }
class LunarEclipseLocalSummary { constructor(o){Object.assign(this,o);} }
class SolarEclipseLocalResult { constructor(o){Object.assign(this,o);} }
class SolarEclipseGlobalResult { constructor(o){Object.assign(this,o);} }
class SolarEclipseGlobalSummary { constructor(o){Object.assign(this,o);} }
class SolarEclipseLocalSummary { constructor(o){Object.assign(this,o);} }
const TimeScale = Object.freeze({jdTD:"jdTD", jdUT:"jdUT"});   // skala waktu keluaran rentang gerhana
class SolarBesselianResult { constructor(o){Object.assign(this,o);} get isValid(){ return [this.jde,this.x,this.y,this.d,this.mu,this.l1,this.l2].every(v=>v!=null); } }
class LunarBesselianResult { constructor(o){Object.assign(this,o);} get isValid(){ return this.x.length===5&&this.y.length===5&&this.f1.length===5&&this.f2.length===5&&this.sm.length===5&&!Number.isNaN(this.jde)&&!Number.isNaN(this.deltaT)&&!Number.isNaN(this.t0); } }
