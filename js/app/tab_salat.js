/** tab_salat.js — Tab "Waktu Salat": jadwal harian (SalatService) + arah kiblat (ArahKiblat). */
(function () {
  const { $, rows, card, hm, dms } = UI;
  const p = UI.add({ id: "salat", label: "Waktu Salat", icon: "🕌" });
  const NAMA = [["Subuh","subuh"],["Syuruk","syuruk"],["Duha","duha"],["Zuhur","zuhur"],["Asar","asar"],["Magrib","magrib"],["Isya","isya"],["Nisfu lail","nisfuLail"]];
  const kompas = b => "<svg viewBox='-60 -60 120 120' width='112' height='112' role='img' aria-label='Arah kiblat " + b.toFixed(1) + "°'>" +
    "<circle r='52' fill='none' stroke='var(--line)' stroke-width='2'/><text y='-40' text-anchor='middle' font-size='11' fill='var(--mut)'>U</text>" +
    "<g transform='rotate(" + b + ")'><path d='M0 -44 L7 4 L0 -3 L-7 4 Z' fill='var(--ac)'/><circle r='3' fill='var(--ac)'/></g></svg>";
  UI.onRender("salat", () => {
    const L = UI.L(), I = L.iht;
    const r = new SalatService().waktuSalatHarian({ tglM: L.d, blnM: L.mo, thnM: L.y, gLon: L.lon, gLat: L.lat, elev: L.elev, tmZn: L.tz, prayerMethod: L.method,
      ihtySubuh: I, ihtySyuruk: I, ihtyZuhur: I, ihtyAsar: I, ihtyMagrib: I, ihtyIsya: I });
    const ak = new ArahKiblat(), bs = ak.arahQiblatSpherical(L.lon, L.lat), bv = ak.arahQiblaVincenty(L.lon, L.lat, "PtoQ");
    p.innerHTML =
      card("Jadwal salat <small>(" + L.method.name + ", zona " + L.tz + ")</small>", "<table class='kv'>" + NAMA.map(([l, k]) => "<tr><td>" + l + "</td><td class='big'>" + (r[k].isNormal ? hm(r[k].time) : "<small>(" + r[k].status + ")</small>") + "</td></tr>").join("") + "</table>",
        "Ihtiyat " + I + " menit. Waktu dibulatkan ke menit seperti pada pustaka asli.") +
      "<div class='card'><h2>Arah kiblat</h2><div class='split'><div class='wrap'>" + rows([["Bola (spherical)", dms(bs)], ["Koreksi elipsoid", dms(ak.arahQiblaWithEllipsoidCorrection(L.lon, L.lat))], ["Vincenty", dms(bv)], ["Jarak (Vincenty)", (ak.arahQiblaVincenty(L.lon, L.lat, "Dist") / 1000).toFixed(1) + " km"]]) + "</div>" + kompas(bv) + "</div><p class='note'>Dihitung dari utara sejati searah jarum jam.</p></div>";
  });
})();
