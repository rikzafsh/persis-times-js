/**
 * kalender_jawa.js — Kalender Jawa Mataraman (Sultan Agungan, siklus kurup/windu) dari Julian Day.
 * Fungsi: jd2jawa, jd2tanggalJawa, jd2bulanJawa, jd2tahunJawa, tahunJawa2noTahunJawa, jawa2jd
 */
const KALENDER_JAWA = { ambalHari: 765433, ambalKurup: 18, ambalTahun: 2160 };

function jd2midnight(jd) { return Math.floor(jd) + 0.5; }

function jd2jawa(jd) {
  const { ambalHari, ambalKurup, ambalTahun } = KALENDER_JAWA;
  const A = jd2midnight(jd) - 1917963.5;
  const B = Math.floor(A / ambalHari);
  const C = A - (B * ambalHari);
  const D = Math.floor(C / 42524) - Math.floor(C / 42524 / ambalKurup);
  const E = C - (D * 42524);
  const F = Math.floor(E / 2835);
  const G = E - (2835 * F);
  const H = Math.floor(((G - Math.floor(G / 2834)) / 354.36667) + 0.0013);
  const I = G - Math.round(H * 354.36667);
  const J = Math.floor((I - Math.floor(I / 354)) / 29.5);
  const tanggalJawa = I - Math.round(J * 29.5) + 1;
  const bulanJawa = J + 1;
  const tahunJawa = (B * ambalTahun) + (D * 120) + (F * 8) + H + 427;
  return { tahunJawa, bulanJawa, tanggalJawa };
}
function jd2tanggalJawa(jd) { return jd2jawa(jd).tanggalJawa; }
function jd2bulanJawa(jd) { return jd2jawa(jd).bulanJawa; }
function jd2tahunJawa(jd) { return jd2jawa(jd).tahunJawa; }
function tahunJawa2noTahunJawa(tahunJawa) { return ((tahunJawa - 3) % 8) + 1; }

function jawa2jd(tanggal_jv, bulan_jv, tahun_jv) {
  const ambalhari = 765433, ambalthn = 2160;
  const A = Math.floor((tahun_jv - 427) / ambalthn);
  const B = Math.floor(((tahun_jv - 427) - (A * ambalthn)) / 120);
  const C = Math.floor(((tahun_jv - 427) - ((A * ambalthn) + (B * 120))) / 8);
  const D = (tahun_jv - 427) - (A * ambalthn) - (B * 120) - (C * 8);
  const E = bulan_jv - 1;
  return 1917962.5 + (A * ambalhari) + (B * 42524) + (C * 2835) + Math.round(D * 354.35) + Math.round(E * 29.5) + tanggal_jv;
}
