/** tab_posisi.js — Tab "Matahari & Bulan": posisi pada pukul 12:00 lokal + keadaan Bulan (iluminasi, umur, fase). */
(function () {
  const { rows, card, dms } = UI;
  const p = UI.add({ id: "posisi", label: "Matahari & Bulan", icon: "☀️" });
  UI.onRender("posisi", () => {
    const L = UI.L(), A = new AstroEvents(), sn = A.sn, mn = A.mn;
    const jd = A.jd.kmjd(L.d, L.mo, L.y, 12, L.tz), dT = A.dt.deltaT(jd), ms = A.moonState(jd), [em, nm] = UI.faseNama(ms.elongasi);
    p.innerHTML =
      "<div class='card'><h2>Bulan pada pukul 12:00 lokal</h2><div class='split'><div><div class='big'>" + em + " " + nm + "</div><div class='bar'><i style='width:" + Math.min(100, ms.iluminasi).toFixed(1) + "%'></i></div>" +
      "<span class='note'>Iluminasi " + ms.iluminasi.toFixed(1) + " % · umur " + ms.umur.toFixed(2) + " hari</span></div></div></div>" +
      card("Posisi astronomi <small>(ΔT " + dT.toFixed(1) + " s, JD " + jd.toFixed(4) + ")</small>", rows([
        ["Matahari: bujur tampak", dms(sn.sunGeocentricLongitude(jd, dT, "Appa"))], ["Matahari: deklinasi", dms(sn.sunGeocentricDeclination(jd, dT))], ["Matahari: jarak", sn.sunGeocentricDistance(jd, dT, "AU").toFixed(6) + " AU"],
        ["Bulan: bujur tampak", dms(mn.ml.moonGeocentricLongitude(jd, dT, "Appa"))], ["Bulan: deklinasi", dms(mn.moonGeocentricDeclination(jd, dT))], ["Bulan: jarak", ms.jarakKm.toFixed(1) + " km"],
        ["Elongasi Bulan–Matahari", dms(ms.elongasi)]]));
  });
})();
