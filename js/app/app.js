/**
 * app.js — Antarmuka demo: membaca masukan, memanggil pustaka, menampilkan tabel.
 * Hanya bagian ini yang menyentuh DOM; pustaka di js/core dan js/services bebas DOM.
 */
(function(){
const P={PrayerMethod,SalatService,ArahKiblat,JulianDay,DynamicalTime,SunFunction,MoonFunction,CalendarService};
const cities={"Yogyakarta":[-7.7956,110.3695,7,100],"Jakarta":[-6.2088,106.8456,7,8],"Bandung":[-6.9175,107.6191,7,768],"Surabaya":[-7.2575,112.7521,7,5],"Makassar":[-5.1477,119.4327,8,10],"Jayapura":[-2.5337,140.7181,9,5],"Makkah":[21.4225,39.8262,3,300],"Kuala Lumpur":[3.139,101.6869,8,60]};
const $=id=>document.getElementById(id);
for(const k in cities){const o=document.createElement("option");o.textContent=k;$("city").appendChild(o);}
P.PrayerMethod.predefined.forEach((m,i)=>{const o=document.createElement("option");o.value=i;o.textContent=m.name;$("method").appendChild(o);});
function setCity(){const c=cities[$("city").value];$("lat").value=c[0];$("lon").value=c[1];$("tz").value=c[2];$("elev").value=c[3];}
$("city").onchange=setCity;setCity();
const n=new Date();$("date").value=n.getFullYear()+"-"+String(n.getMonth()+1).padStart(2,"0")+"-"+String(n.getDate()).padStart(2,"0");
const hm=h=>{if(h==null)return"—";let t=Math.round(h*3600);t=((t%86400)+86400)%86400;return String(Math.floor(t/3600)).padStart(2,"0")+":"+String(Math.floor(t%3600/60)).padStart(2,"0");};
const dms=x=>{const s=x<0?"−":"";x=Math.abs(x);const d=Math.floor(x),m=Math.floor((x-d)*60),sc=((x-d)*60-m)*60;return s+d+"° "+String(m).padStart(2,"0")+"′ "+sc.toFixed(1).padStart(4,"0")+"″";};
const rows=a=>"<table class='kv'>"+a.map(r=>"<tr><td>"+r[0]+"</td><td>"+r[1]+"</td></tr>").join("")+"</table>";
const card=(t,b)=>"<div class='card'><h2>"+t+"</h2><div class='wrap'>"+b+"</div></div>";
function run(){
  const [y,mo,d]=$("date").value.split("-").map(Number);
  const lat=+$("lat").value,lon=+$("lon").value,tz=+$("tz").value,elev=+$("elev").value,iht=+$("iht").value||0;
  const meth=P.PrayerMethod.predefined[+$("method").value];
  const r=new P.SalatService().waktuSalatHarian({tglM:d,blnM:mo,thnM:y,gLon:lon,gLat:lat,elev,tmZn:tz,prayerMethod:meth,ihtySubuh:iht,ihtySyuruk:iht,ihtyZuhur:iht,ihtyAsar:iht,ihtyMagrib:iht,ihtyIsya:iht});
  const nm=[["Subuh","subuh"],["Syuruk","syuruk"],["Duha","duha"],["Zuhur","zuhur"],["Asar","asar"],["Magrib","magrib"],["Isya","isya"],["Nisfu lail","nisfuLail"]];
  let h=card("Waktu salat — "+meth.name+" <small>(WIB/zona "+tz+")</small>",rows(nm.map(([l,k])=>[l,r[k].isNormal?hm(r[k].time):"("+r[k].status+")"])));
  const ak=new P.ArahKiblat();
  h+=card("Arah kiblat",rows([["Bola (spherical)",dms(ak.arahQiblatSpherical(lon,lat))],["Koreksi elipsoid",dms(ak.arahQiblaWithEllipsoidCorrection(lon,lat))],["Vincenty",dms(ak.arahQiblaVincenty(lon,lat,"PtoQ"))],["Jarak (Vincenty)",(ak.arahQiblaVincenty(lon,lat,"Dist")/1000).toFixed(1)+" km"]]));
  const jdn=new P.JulianDay(),dt=new P.DynamicalTime(),sn=new P.SunFunction(),mn=new P.MoonFunction();
  const jd=jdn.kmjd(d,mo,y,12,tz),dT=dt.deltaT(jd);
  h+=card("Matahari &amp; Bulan pada pukul 12:00 lokal <small>(ΔT "+dT.toFixed(1)+" s, JD "+jd.toFixed(4)+")</small>",rows([
   ["Matahari: bujur tampak",dms(sn.sunGeocentricLongitude(jd,dT,"Appa"))],["Matahari: deklinasi",dms(sn.sunGeocentricDeclination(jd,dT))],["Matahari: jarak",sn.sunGeocentricDistance(jd,dT,"AU").toFixed(6)+" AU"],
   ["Bulan: bujur tampak",dms(mn.ml.moonGeocentricLongitude(jd,dT,"Appa"))],["Bulan: deklinasi",dms(mn.moonGeocentricDeclination(jd,dT))],["Bulan: jarak",mn.md.moonGeocentricDistance(jd,dT,"KM").toFixed(1)+" km"],
   ["Bulan: elongasi",dms(mn.moonSunGeocentricElongation(jd,dT))],["Bulan: iluminasi",(mn.moonGeocentricDiskIlluminatedFraction(jd,dT)).toFixed(1)+" %"]]));
  $("out").innerHTML=h+"<div class='card' id='hj'><h2>Kalender Hijriah</h2>Menghitung…</div>";
  setTimeout(()=>{try{const c=new P.CalendarService();
    const f=s=>String(s).split("|").pop().trim();
    $("hj").innerHTML="<h2>Kalender Hijriah</h2>"+rows([["MABIMS",f(c.serviceKalenderHijriahMABIMS(d,mo,y))],["Ummul Qura",f(c.serviceKalenderHijriahUQ(d,mo,y))],["Wujudul Hilal",f(c.serviceKalenderHijriahWH(d,mo,y))]]);
  }catch(e){$("hj").innerHTML="<h2>Kalender Hijriah</h2>Gagal: "+e.message;}},30);
}
$("go").onclick=run;run();
})();
