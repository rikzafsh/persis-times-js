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
