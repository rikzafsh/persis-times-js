/**
 * nutation.js — Nutasi bujur & kemiringan (77 suku IAU 1980) dan kemiringan ekliptika.
 * Sumber Dart: core/astronomy/nutation.dart
 * Kelas: NutationAndObliquity
 * Fungsi: nutationInLongitude, nutationInObliquity, meanObliquityOfEcliptic, trueObliquityOfEcliptic
 */
class NutationAndObliquity {
  mf = new MathFunction();

  /// Nutation in longitude (Δψ dalam derajat)
  nutationInLongitude(jd, deltaT) {
    const jde = jd + deltaT / 86400.0;
    const t = (jde - 2451545.0) / 36525.0;
    const t2 = t * t;
    const t3 = t * t2;
    const t4 = t * t3;

    // Fundamental Delaunay arguments
    let l =
        (485868.249036 +
            1717915923.2178 * t +
            31.8792 * t2 +
            0.051635 * t3 -
            0.00024470 * t4) /
        3600.0;
    let lp =
        (1287104.79305 +
            129596581.0481 * t -
            0.5532 * t2 +
            0.000136 * t3 -
            0.00001149 * t4) /
        3600.0;
    let f =
        (335779.526232 +
            1739527262.8478 * t -
            12.7512 * t2 -
            0.001037 * t3 +
            0.00000417 * t4) /
        3600.0;
    let d =
        (1072260.70369 +
            1602961601.2090 * t -
            6.3706 * t2 +
            0.006593 * t3 -
            0.00003169 * t4) /
        3600.0;
    let om =
        (450160.398036 -
            6962890.5431 * t +
            7.4722 * t2 +
            0.007702 * t3 -
            0.00005939 * t4) /
        3600.0;

    // Konversi ke radian
    l = this.mf.rad(this.mf.mod(l, 360.0));
    lp = this.mf.rad(this.mf.mod(lp, 360.0));
    f = this.mf.rad(this.mf.mod(f, 360.0));
    d = this.mf.rad(this.mf.mod(d, 360.0));
    om = this.mf.rad(this.mf.mod(om, 360.0));

    let s = 0.0;
    s +=
        (-172064161.0 + -174666.0 * t) *
            Math.sin(0 * l + 0 * lp + 0 * f + 0 * d + 1 * om) +
        33386.0 * Math.cos(0 * l + 0 * lp + 0 * f + 0 * d + 1 * om);
    s +=
        (-13170906.0 + -1675.0 * t) *
            Math.sin(0 * l + 0 * lp + 2 * f + -2 * d + 2 * om) +
        -13696.0 * Math.cos(0 * l + 0 * lp + 2 * f + -2 * d + 2 * om);
    s +=
        (-2276413.0 + -234.0 * t) *
            Math.sin(0 * l + 0 * lp + 2 * f + 0 * d + 2 * om) +
        2796.0 * Math.cos(0 * l + 0 * lp + 2 * f + 0 * d + 2 * om);
    s +=
        (2074554.0 + 207.0 * t) * Math.sin(0 * l + 0 * lp + 0 * f + 0 * d + 2 * om) +
        -698.0 * Math.cos(0 * l + 0 * lp + 0 * f + 0 * d + 2 * om);
    s +=
        (1475877.0 + -3633.0 * t) *
            Math.sin(0 * l + 1 * lp + 0 * f + 0 * d + 0 * om) +
        11817.0 * Math.cos(0 * l + 1 * lp + 0 * f + 0 * d + 0 * om);
    s +=
        (-516821.0 + 1226.0 * t) *
            Math.sin(0 * l + 1 * lp + 2 * f + -2 * d + 2 * om) +
        -524.0 * Math.cos(0 * l + 1 * lp + 2 * f + -2 * d + 2 * om);
    s +=
        (711159.0 + 73.0 * t) * Math.sin(1 * l + 0 * lp + 0 * f + 0 * d + 0 * om) +
        -872.0 * Math.cos(1 * l + 0 * lp + 0 * f + 0 * d + 0 * om);
    s +=
        (-387298.0 + -367.0 * t) *
            Math.sin(0 * l + 0 * lp + 2 * f + 0 * d + 1 * om) +
        380.0 * Math.cos(0 * l + 0 * lp + 2 * f + 0 * d + 1 * om);
    s +=
        (-301461.0 + -36.0 * t) * Math.sin(1 * l + 0 * lp + 2 * f + 0 * d + 2 * om) +
        816.0 * Math.cos(1 * l + 0 * lp + 2 * f + 0 * d + 2 * om);
    s +=
        (215829.0 + -494.0 * t) *
            Math.sin(0 * l + -1 * lp + 2 * f + -2 * d + 2 * om) +
        111.0 * Math.cos(0 * l + -1 * lp + 2 * f + -2 * d + 2 * om);
    s +=
        (128227.0 + 137.0 * t) * Math.sin(0 * l + 0 * lp + 2 * f + -2 * d + 1 * om) +
        181.0 * Math.cos(0 * l + 0 * lp + 2 * f + -2 * d + 1 * om);
    s +=
        (123457.0 + 11.0 * t) * Math.sin(-1 * l + 0 * lp + 2 * f + 0 * d + 2 * om) +
        19.0 * Math.cos(-1 * l + 0 * lp + 2 * f + 0 * d + 2 * om);
    s +=
        (156994.0 + 10.0 * t) * Math.sin(-1 * l + 0 * lp + 0 * f + 2 * d + 0 * om) +
        -168.0 * Math.cos(-1 * l + 0 * lp + 0 * f + 2 * d + 0 * om);
    s +=
        (63110.0 + 63.0 * t) * Math.sin(1 * l + 0 * lp + 0 * f + 0 * d + 1 * om) +
        27.0 * Math.cos(1 * l + 0 * lp + 0 * f + 0 * d + 1 * om);
    s +=
        (-57976.0 + -63.0 * t) * Math.sin(-1 * l + 0 * lp + 0 * f + 0 * d + 1 * om) +
        -189.0 * Math.cos(-1 * l + 0 * lp + 0 * f + 0 * d + 1 * om);
    s +=
        (-59641.0 + -11.0 * t) * Math.sin(-1 * l + 0 * lp + 2 * f + 2 * d + 2 * om) +
        149.0 * Math.cos(-1 * l + 0 * lp + 2 * f + 2 * d + 2 * om);
    s +=
        (-51613.0 + -42.0 * t) * Math.sin(1 * l + 0 * lp + 2 * f + 0 * d + 1 * om) +
        129.0 * Math.cos(1 * l + 0 * lp + 2 * f + 0 * d + 1 * om);
    s +=
        (45893.0 + 50.0 * t) * Math.sin(-2 * l + 0 * lp + 2 * f + 0 * d + 1 * om) +
        31.0 * Math.cos(-2 * l + 0 * lp + 2 * f + 0 * d + 1 * om);
    s +=
        (63384.0 + 11.0 * t) * Math.sin(0 * l + 0 * lp + 0 * f + 2 * d + 0 * om) +
        -150.0 * Math.cos(0 * l + 0 * lp + 0 * f + 2 * d + 0 * om);
    s +=
        (-38571.0 + -1.0 * t) * Math.sin(0 * l + 0 * lp + 2 * f + 2 * d + 2 * om) +
        158.0 * Math.cos(0 * l + 0 * lp + 2 * f + 2 * d + 2 * om);
    s +=
        (32481.0 + 0.0 * t) * Math.sin(0 * l + -2 * lp + 2 * f + -2 * d + 2 * om) +
        0.0 * Math.cos(0 * l + -2 * lp + 2 * f + -2 * d + 2 * om);
    s +=
        (-47722.0 + 0.0 * t) * Math.sin(-2 * l + 0 * lp + 0 * f + 2 * d + 0 * om) +
        -18.0 * Math.cos(-2 * l + 0 * lp + 0 * f + 2 * d + 0 * om);
    s +=
        (-31046.0 + -1.0 * t) * Math.sin(2 * l + 0 * lp + 2 * f + 0 * d + 2 * om) +
        131.0 * Math.cos(2 * l + 0 * lp + 2 * f + 0 * d + 2 * om);
    s +=
        (28593.0 + 0.0 * t) * Math.sin(1 * l + 0 * lp + 2 * f + -2 * d + 2 * om) +
        -1.0 * Math.cos(1 * l + 0 * lp + 2 * f + -2 * d + 2 * om);
    s +=
        (20441.0 + 21.0 * t) * Math.sin(-1 * l + 0 * lp + 2 * f + 0 * d + 1 * om) +
        10.0 * Math.cos(-1 * l + 0 * lp + 2 * f + 0 * d + 1 * om);
    s +=
        (29243.0 + 0.0 * t) * Math.sin(2 * l + 0 * lp + 0 * f + 0 * d + 0 * om) +
        -74.0 * Math.cos(2 * l + 0 * lp + 0 * f + 0 * d + 0 * om);
    s +=
        (25887.0 + 0.0 * t) * Math.sin(0 * l + 0 * lp + 2 * f + 0 * d + 0 * om) +
        -66.0 * Math.cos(0 * l + 0 * lp + 2 * f + 0 * d + 0 * om);
    s +=
        (-14053.0 + -25.0 * t) * Math.sin(0 * l + 1 * lp + 0 * f + 0 * d + 1 * om) +
        79.0 * Math.cos(0 * l + 1 * lp + 0 * f + 0 * d + 1 * om);
    s +=
        (15164.0 + 10.0 * t) * Math.sin(-1 * l + 0 * lp + 0 * f + 2 * d + 1 * om) +
        11.0 * Math.cos(-1 * l + 0 * lp + 0 * f + 2 * d + 1 * om);
    s +=
        (-15794.0 + 72.0 * t) * Math.sin(0 * l + 2 * lp + 2 * f + -2 * d + 2 * om) +
        -16.0 * Math.cos(0 * l + 2 * lp + 2 * f + -2 * d + 2 * om);
    s +=
        (21783.0 + 0.0 * t) * Math.sin(0 * l + 0 * lp + -2 * f + 2 * d + 0 * om) +
        13.0 * Math.cos(0 * l + 0 * lp + -2 * f + 2 * d + 0 * om);
    s +=
        (-12873.0 + -10.0 * t) * Math.sin(1 * l + 0 * lp + 0 * f + -2 * d + 1 * om) +
        -37.0 * Math.cos(1 * l + 0 * lp + 0 * f + -2 * d + 1 * om);
    s +=
        (-12654.0 + 11.0 * t) * Math.sin(0 * l + -1 * lp + 0 * f + 0 * d + 1 * om) +
        63.0 * Math.cos(0 * l + -1 * lp + 0 * f + 0 * d + 1 * om);
    s +=
        (-10204.0 + 0.0 * t) * Math.sin(-1 * l + 0 * lp + 2 * f + 2 * d + 1 * om) +
        25.0 * Math.cos(-1 * l + 0 * lp + 2 * f + 2 * d + 1 * om);
    s +=
        (16707.0 + -85.0 * t) * Math.sin(0 * l + 2 * lp + 0 * f + 0 * d + 0 * om) +
        -10.0 * Math.cos(0 * l + 2 * lp + 0 * f + 0 * d + 0 * om);
    s +=
        (-7691.0 + 0.0 * t) * Math.sin(1 * l + 0 * lp + 2 * f + 2 * d + 2 * om) +
        44.0 * Math.cos(1 * l + 0 * lp + 2 * f + 2 * d + 2 * om);
    s +=
        (-11024.0 + 0.0 * t) * Math.sin(-2 * l + 0 * lp + 2 * f + 0 * d + 0 * om) +
        -14.0 * Math.cos(-2 * l + 0 * lp + 2 * f + 0 * d + 0 * om);
    s +=
        (7566.0 + -21.0 * t) * Math.sin(0 * l + 1 * lp + 2 * f + 0 * d + 2 * om) +
        -11.0 * Math.cos(0 * l + 1 * lp + 2 * f + 0 * d + 2 * om);
    s +=
        (-6637.0 + -11.0 * t) * Math.sin(0 * l + 0 * lp + 2 * f + 2 * d + 1 * om) +
        25.0 * Math.cos(0 * l + 0 * lp + 2 * f + 2 * d + 1 * om);
    s +=
        (-7141.0 + 21.0 * t) * Math.sin(0 * l + -1 * lp + 2 * f + 0 * d + 2 * om) +
        8.0 * Math.cos(0 * l + -1 * lp + 2 * f + 0 * d + 2 * om);
    s +=
        (-6302.0 + -11.0 * t) * Math.sin(0 * l + 0 * lp + 0 * f + 2 * d + 1 * om) +
        2.0 * Math.cos(0 * l + 0 * lp + 0 * f + 2 * d + 1 * om);
    s +=
        (5800.0 + 10.0 * t) * Math.sin(1 * l + 0 * lp + 2 * f + -2 * d + 1 * om) +
        2.0 * Math.cos(1 * l + 0 * lp + 2 * f + -2 * d + 1 * om);
    s +=
        (6443.0 + 0.0 * t) * Math.sin(2 * l + 0 * lp + 2 * f + -2 * d + 2 * om) +
        -7.0 * Math.cos(2 * l + 0 * lp + 2 * f + -2 * d + 2 * om);
    s +=
        (-5774.0 + -11.0 * t) * Math.sin(-2 * l + 0 * lp + 0 * f + 2 * d + 1 * om) +
        -15.0 * Math.cos(-2 * l + 0 * lp + 0 * f + 2 * d + 1 * om);
    s +=
        (-5350.0 + 0.0 * t) * Math.sin(2 * l + 0 * lp + 2 * f + 0 * d + 1 * om) +
        21.0 * Math.cos(2 * l + 0 * lp + 2 * f + 0 * d + 1 * om);
    s +=
        (-4752.0 + -11.0 * t) * Math.sin(0 * l + -1 * lp + 2 * f + -2 * d + 1 * om) +
        -3.0 * Math.cos(0 * l + -1 * lp + 2 * f + -2 * d + 1 * om);
    s +=
        (-4940.0 + -11.0 * t) * Math.sin(0 * l + 0 * lp + 0 * f + -2 * d + 1 * om) +
        -21.0 * Math.cos(0 * l + 0 * lp + 0 * f + -2 * d + 1 * om);
    s +=
        (7350.0 + 0.0 * t) * Math.sin(-1 * l + -1 * lp + 0 * f + 2 * d + 0 * om) +
        -8.0 * Math.cos(-1 * l + -1 * lp + 0 * f + 2 * d + 0 * om);
    s +=
        (4065.0 + 0.0 * t) * Math.sin(2 * l + 0 * lp + 0 * f + -2 * d + 1 * om) +
        6.0 * Math.cos(2 * l + 0 * lp + 0 * f + -2 * d + 1 * om);
    s +=
        (6579.0 + 0.0 * t) * Math.sin(1 * l + 0 * lp + 0 * f + 2 * d + 0 * om) +
        -24.0 * Math.cos(1 * l + 0 * lp + 0 * f + 2 * d + 0 * om);
    s +=
        (3579.0 + 0.0 * t) * Math.sin(0 * l + 1 * lp + 2 * f + -2 * d + 1 * om) +
        5.0 * Math.cos(0 * l + 1 * lp + 2 * f + -2 * d + 1 * om);
    s +=
        (4725.0 + 0.0 * t) * Math.sin(1 * l + -1 * lp + 0 * f + 0 * d + 0 * om) +
        -6.0 * Math.cos(1 * l + -1 * lp + 0 * f + 0 * d + 0 * om);
    s +=
        (-3075.0 + 0.0 * t) * Math.sin(-2 * l + 0 * lp + 2 * f + 0 * d + 2 * om) +
        -2.0 * Math.cos(-2 * l + 0 * lp + 2 * f + 0 * d + 2 * om);
    s +=
        (-2904.0 + 0.0 * t) * Math.sin(3 * l + 0 * lp + 2 * f + 0 * d + 2 * om) +
        15.0 * Math.cos(3 * l + 0 * lp + 2 * f + 0 * d + 2 * om);
    s +=
        (4348.0 + 0.0 * t) * Math.sin(0 * l + -1 * lp + 0 * f + 2 * d + 0 * om) +
        -10.0 * Math.cos(0 * l + -1 * lp + 0 * f + 2 * d + 0 * om);
    s +=
        (-2878.0 + 0.0 * t) * Math.sin(1 * l + -1 * lp + 2 * f + 0 * d + 2 * om) +
        8.0 * Math.cos(1 * l + -1 * lp + 2 * f + 0 * d + 2 * om);
    s +=
        (-4230.0 + 0.0 * t) * Math.sin(0 * l + 0 * lp + 0 * f + 1 * d + 0 * om) +
        5.0 * Math.cos(0 * l + 0 * lp + 0 * f + 1 * d + 0 * om);
    s +=
        (-2819.0 + 0.0 * t) * Math.sin(-1 * l + -1 * lp + 2 * f + 2 * d + 2 * om) +
        7.0 * Math.cos(-1 * l + -1 * lp + 2 * f + 2 * d + 2 * om);
    s +=
        (-4056.0 + 0.0 * t) * Math.sin(-1 * l + 0 * lp + 2 * f + 0 * d + 0 * om) +
        5.0 * Math.cos(-1 * l + 0 * lp + 2 * f + 0 * d + 0 * om);
    s +=
        (-2647.0 + 0.0 * t) * Math.sin(0 * l + -1 * lp + 2 * f + 2 * d + 2 * om) +
        11.0 * Math.cos(0 * l + -1 * lp + 2 * f + 2 * d + 2 * om);
    s +=
        (-2294.0 + 0.0 * t) * Math.sin(-2 * l + 0 * lp + 0 * f + 0 * d + 1 * om) +
        -10.0 * Math.cos(-2 * l + 0 * lp + 0 * f + 0 * d + 1 * om);
    s +=
        (2481.0 + 0.0 * t) * Math.sin(1 * l + 1 * lp + 2 * f + 0 * d + 2 * om) +
        -7.0 * Math.cos(1 * l + 1 * lp + 2 * f + 0 * d + 2 * om);
    s +=
        (2179.0 + 0.0 * t) * Math.sin(2 * l + 0 * lp + 0 * f + 0 * d + 1 * om) +
        -2.0 * Math.cos(2 * l + 0 * lp + 0 * f + 0 * d + 1 * om);
    s +=
        (3276.0 + 0.0 * t) * Math.sin(-1 * l + 1 * lp + 0 * f + 1 * d + 0 * om) +
        1.0 * Math.cos(-1 * l + 1 * lp + 0 * f + 1 * d + 0 * om);
    s +=
        (-3389.0 + 0.0 * t) * Math.sin(1 * l + 1 * lp + 0 * f + 0 * d + 0 * om) +
        5.0 * Math.cos(1 * l + 1 * lp + 0 * f + 0 * d + 0 * om);
    s +=
        (3339.0 + 0.0 * t) * Math.sin(1 * l + 0 * lp + 2 * f + 0 * d + 0 * om) +
        -13.0 * Math.cos(1 * l + 0 * lp + 2 * f + 0 * d + 0 * om);
    s +=
        (-1987.0 + 0.0 * t) * Math.sin(-1 * l + 0 * lp + 2 * f + -2 * d + 1 * om) +
        -6.0 * Math.cos(-1 * l + 0 * lp + 2 * f + -2 * d + 1 * om);
    s +=
        (-1981.0 + 0.0 * t) * Math.sin(1 * l + 0 * lp + 0 * f + 0 * d + 2 * om) +
        0.0 * Math.cos(1 * l + 0 * lp + 0 * f + 0 * d + 2 * om);
    s +=
        (4026.0 + 0.0 * t) * Math.sin(-1 * l + 0 * lp + 0 * f + 1 * d + 0 * om) +
        -353.0 * Math.cos(-1 * l + 0 * lp + 0 * f + 1 * d + 0 * om);
    s +=
        (1660.0 + 0.0 * t) * Math.sin(0 * l + 0 * lp + 2 * f + 1 * d + 2 * om) +
        -5.0 * Math.cos(0 * l + 0 * lp + 2 * f + 1 * d + 2 * om);
    s +=
        (-1521.0 + 0.0 * t) * Math.sin(-1 * l + 0 * lp + 2 * f + 4 * d + 2 * om) +
        9.0 * Math.cos(-1 * l + 0 * lp + 2 * f + 4 * d + 2 * om);
    s +=
        (1314.0 + 0.0 * t) * Math.sin(-1 * l + 1 * lp + 0 * f + 1 * d + 1 * om) +
        0.0 * Math.cos(-1 * l + 1 * lp + 0 * f + 1 * d + 1 * om);
    s +=
        (-1283.0 + 0.0 * t) * Math.sin(0 * l + -2 * lp + 2 * f + -2 * d + 1 * om) +
        0.0 * Math.cos(0 * l + -2 * lp + 2 * f + -2 * d + 1 * om);
    s +=
        (-1331.0 + 0.0 * t) * Math.sin(1 * l + 0 * lp + 2 * f + 2 * d + 1 * om) +
        8.0 * Math.cos(1 * l + 0 * lp + 2 * f + 2 * d + 1 * om);
    s +=
        (1383.0 + 0.0 * t) * Math.sin(-2 * l + 0 * lp + 2 * f + 2 * d + 2 * om) +
        -2.0 * Math.cos(-2 * l + 0 * lp + 2 * f + 2 * d + 2 * om);
    s +=
        (1405.0 + 0.0 * t) * Math.sin(-1 * l + 0 * lp + 0 * f + 0 * d + 2 * om) +
        4.0 * Math.cos(-1 * l + 0 * lp + 0 * f + 0 * d + 2 * om);
    s +=
        (1290.0 + 0.0 * t) * Math.sin(1 * l + 1 * lp + 2 * f + -2 * d + 2 * om) +
        0.0 * Math.cos(1 * l + 1 * lp + 2 * f + -2 * d + 2 * om);
    const dPsiDeg = s / 36000000000.0;
    return dPsiDeg;
  }

  /// Nutation in obliquity (Δε dalam derajat)
  nutationInObliquity(jd, deltaT) {
    const jde = jd + deltaT / 86400.0;
    const t = (jde - 2451545.0) / 36525.0;
    const t2 = t * t;
    const t3 = t * t2;
    const t4 = t * t3;

    // Fundamental Delaunay arguments
    let l =
        (485868.249036 +
            1717915923.2178 * t +
            31.8792 * t2 +
            0.051635 * t3 -
            0.00024470 * t4) /
        3600.0;
    let lp =
        (1287104.79305 +
            129596581.0481 * t -
            0.5532 * t2 +
            0.000136 * t3 -
            0.00001149 * t4) /
        3600.0;
    let f =
        (335779.526232 +
            1739527262.8478 * t -
            12.7512 * t2 -
            0.001037 * t3 +
            0.00000417 * t4) /
        3600.0;
    let d =
        (1072260.70369 +
            1602961601.2090 * t -
            6.3706 * t2 +
            0.006593 * t3 -
            0.00003169 * t4) /
        3600.0;
    let om =
        (450160.398036 -
            6962890.5431 * t +
            7.4722 * t2 +
            0.007702 * t3 -
            0.00005939 * t4) /
        3600.0;

    // Konversi ke radian
    l = this.mf.rad(this.mf.mod(l, 360.0));
    lp = this.mf.rad(this.mf.mod(lp, 360.0));
    f = this.mf.rad(this.mf.mod(f, 360.0));
    d = this.mf.rad(this.mf.mod(d, 360.0));
    om = this.mf.rad(this.mf.mod(om, 360.0));

    let s = 0.0;

    s +=
        (92052331.0 + 9086.0 * t) *
            Math.cos(0 * l + 0 * lp + 0 * f + 0 * d + 1 * om) +
        15377.0 * Math.sin(0 * l + 0 * lp + 0 * f + 0 * d + 1 * om);
    s +=
        (5730336.0 + -3015.0 * t) *
            Math.cos(0 * l + 0 * lp + 2 * f + -2 * d + 2 * om) +
        -4587.0 * Math.sin(0 * l + 0 * lp + 2 * f + -2 * d + 2 * om);
    s +=
        (978459.0 + -485.0 * t) * Math.cos(0 * l + 0 * lp + 2 * f + 0 * d + 2 * om) +
        1374.0 * Math.sin(0 * l + 0 * lp + 2 * f + 0 * d + 2 * om);
    s +=
        (-897492.0 + 470.0 * t) * Math.cos(0 * l + 0 * lp + 0 * f + 0 * d + 2 * om) +
        -291.0 * Math.sin(0 * l + 0 * lp + 0 * f + 0 * d + 2 * om);
    s +=
        (73871.0 + -184.0 * t) * Math.cos(0 * l + 1 * lp + 0 * f + 0 * d + 0 * om) +
        -1924.0 * Math.sin(0 * l + 1 * lp + 0 * f + 0 * d + 0 * om);
    s +=
        (224386.0 + -677.0 * t) *
            Math.cos(0 * l + 1 * lp + 2 * f + -2 * d + 2 * om) +
        -174.0 * Math.sin(0 * l + 1 * lp + 2 * f + -2 * d + 2 * om);
    s +=
        (-6750.0 + 0.0 * t) * Math.cos(1 * l + 0 * lp + 0 * f + 0 * d + 0 * om) +
        358.0 * Math.sin(1 * l + 0 * lp + 0 * f + 0 * d + 0 * om);
    s +=
        (200728.0 + 18.0 * t) * Math.cos(0 * l + 0 * lp + 2 * f + 0 * d + 1 * om) +
        318.0 * Math.sin(0 * l + 0 * lp + 2 * f + 0 * d + 1 * om);
    s +=
        (129025.0 + -63.0 * t) * Math.cos(1 * l + 0 * lp + 2 * f + 0 * d + 2 * om) +
        367.0 * Math.sin(1 * l + 0 * lp + 2 * f + 0 * d + 2 * om);
    s +=
        (-95929.0 + 299.0 * t) *
            Math.cos(0 * l + -1 * lp + 2 * f + -2 * d + 2 * om) +
        132.0 * Math.sin(0 * l + -1 * lp + 2 * f + -2 * d + 2 * om);
    s +=
        (-68982.0 + -9.0 * t) * Math.cos(0 * l + 0 * lp + 2 * f + -2 * d + 1 * om) +
        39.0 * Math.sin(0 * l + 0 * lp + 2 * f + -2 * d + 1 * om);
    s +=
        (-53311.0 + 32.0 * t) * Math.cos(-1 * l + 0 * lp + 2 * f + 0 * d + 2 * om) +
        -4.0 * Math.sin(-1 * l + 0 * lp + 2 * f + 0 * d + 2 * om);
    s +=
        (-1235.0 + 0.0 * t) * Math.cos(-1 * l + 0 * lp + 0 * f + 2 * d + 0 * om) +
        82.0 * Math.sin(-1 * l + 0 * lp + 0 * f + 2 * d + 0 * om);
    s +=
        (-33228.0 + 0.0 * t) * Math.cos(1 * l + 0 * lp + 0 * f + 0 * d + 1 * om) +
        -9.0 * Math.sin(1 * l + 0 * lp + 0 * f + 0 * d + 1 * om);
    s +=
        (31429.0 + 0.0 * t) * Math.cos(-1 * l + 0 * lp + 0 * f + 0 * d + 1 * om) +
        -75.0 * Math.sin(-1 * l + 0 * lp + 0 * f + 0 * d + 1 * om);
    s +=
        (25543.0 + -11.0 * t) * Math.cos(-1 * l + 0 * lp + 2 * f + 2 * d + 2 * om) +
        66.0 * Math.sin(-1 * l + 0 * lp + 2 * f + 2 * d + 2 * om);
    s +=
        (26366.0 + 0.0 * t) * Math.cos(1 * l + 0 * lp + 2 * f + 0 * d + 1 * om) +
        78.0 * Math.sin(1 * l + 0 * lp + 2 * f + 0 * d + 1 * om);
    s +=
        (-24236.0 + -10.0 * t) * Math.cos(-2 * l + 0 * lp + 2 * f + 0 * d + 1 * om) +
        20.0 * Math.sin(-2 * l + 0 * lp + 2 * f + 0 * d + 1 * om);
    s +=
        (-1220.0 + 0.0 * t) * Math.cos(0 * l + 0 * lp + 0 * f + 2 * d + 0 * om) +
        29.0 * Math.sin(0 * l + 0 * lp + 0 * f + 2 * d + 0 * om);
    s +=
        (16452.0 + -11.0 * t) * Math.cos(0 * l + 0 * lp + 2 * f + 2 * d + 2 * om) +
        68.0 * Math.sin(0 * l + 0 * lp + 2 * f + 2 * d + 2 * om);
    s +=
        (-13870.0 + 0.0 * t) * Math.cos(0 * l + -2 * lp + 2 * f + -2 * d + 2 * om) +
        0.0 * Math.sin(0 * l + -2 * lp + 2 * f + -2 * d + 2 * om);
    s +=
        (477.0 + 0.0 * t) * Math.cos(-2 * l + 0 * lp + 0 * f + 2 * d + 0 * om) +
        -25.0 * Math.sin(-2 * l + 0 * lp + 0 * f + 2 * d + 0 * om);
    s +=
        (13238.0 + -11.0 * t) * Math.cos(2 * l + 0 * lp + 2 * f + 0 * d + 2 * om) +
        59.0 * Math.sin(2 * l + 0 * lp + 2 * f + 0 * d + 2 * om);
    s +=
        (-12338.0 + 10.0 * t) * Math.cos(1 * l + 0 * lp + 2 * f + -2 * d + 2 * om) +
        -3.0 * Math.sin(1 * l + 0 * lp + 2 * f + -2 * d + 2 * om);
    s +=
        (-10758.0 + 0.0 * t) * Math.cos(-1 * l + 0 * lp + 2 * f + 0 * d + 1 * om) +
        -3.0 * Math.sin(-1 * l + 0 * lp + 2 * f + 0 * d + 1 * om);
    s +=
        (-609.0 + 0.0 * t) * Math.cos(2 * l + 0 * lp + 0 * f + 0 * d + 0 * om) +
        13.0 * Math.sin(2 * l + 0 * lp + 0 * f + 0 * d + 0 * om);
    s +=
        (-550.0 + 0.0 * t) * Math.cos(0 * l + 0 * lp + 2 * f + 0 * d + 0 * om) +
        11.0 * Math.sin(0 * l + 0 * lp + 2 * f + 0 * d + 0 * om);
    s +=
        (8551.0 + -2.0 * t) * Math.cos(0 * l + 1 * lp + 0 * f + 0 * d + 1 * om) +
        -45.0 * Math.sin(0 * l + 1 * lp + 0 * f + 0 * d + 1 * om);
    s +=
        (-8001.0 + 0.0 * t) * Math.cos(-1 * l + 0 * lp + 0 * f + 2 * d + 1 * om) +
        -1.0 * Math.sin(-1 * l + 0 * lp + 0 * f + 2 * d + 1 * om);
    s +=
        (6850.0 + -42.0 * t) * Math.cos(0 * l + 2 * lp + 2 * f + -2 * d + 2 * om) +
        -5.0 * Math.sin(0 * l + 2 * lp + 2 * f + -2 * d + 2 * om);
    s +=
        (-167.0 + 0.0 * t) * Math.cos(0 * l + 0 * lp + -2 * f + 2 * d + 0 * om) +
        13.0 * Math.sin(0 * l + 0 * lp + -2 * f + 2 * d + 0 * om);
    s +=
        (6953.0 + 0.0 * t) * Math.cos(1 * l + 0 * lp + 0 * f + -2 * d + 1 * om) +
        -14.0 * Math.sin(1 * l + 0 * lp + 0 * f + -2 * d + 1 * om);
    s +=
        (6415.0 + 0.0 * t) * Math.cos(0 * l + -1 * lp + 0 * f + 0 * d + 1 * om) +
        26.0 * Math.sin(0 * l + -1 * lp + 0 * f + 0 * d + 1 * om);
    s +=
        (5222.0 + 0.0 * t) * Math.cos(-1 * l + 0 * lp + 2 * f + 2 * d + 1 * om) +
        15.0 * Math.sin(-1 * l + 0 * lp + 2 * f + 2 * d + 1 * om);
    s +=
        (168.0 + -1.0 * t) * Math.cos(0 * l + 2 * lp + 0 * f + 0 * d + 0 * om) +
        10.0 * Math.sin(0 * l + 2 * lp + 0 * f + 0 * d + 0 * om);
    s +=
        (3268.0 + 0.0 * t) * Math.cos(1 * l + 0 * lp + 2 * f + 2 * d + 2 * om) +
        19.0 * Math.sin(1 * l + 0 * lp + 2 * f + 2 * d + 2 * om);
    s +=
        (104.0 + 0.0 * t) * Math.cos(-2 * l + 0 * lp + 2 * f + 0 * d + 0 * om) +
        2.0 * Math.sin(-2 * l + 0 * lp + 2 * f + 0 * d + 0 * om);
    s +=
        (-3250.0 + 0.0 * t) * Math.cos(0 * l + 1 * lp + 2 * f + 0 * d + 2 * om) +
        -5.0 * Math.sin(0 * l + 1 * lp + 2 * f + 0 * d + 2 * om);
    s +=
        (3353.0 + 0.0 * t) * Math.cos(0 * l + 0 * lp + 2 * f + 2 * d + 1 * om) +
        14.0 * Math.sin(0 * l + 0 * lp + 2 * f + 2 * d + 1 * om);
    s +=
        (3070.0 + 0.0 * t) * Math.cos(0 * l + -1 * lp + 2 * f + 0 * d + 2 * om) +
        4.0 * Math.sin(0 * l + -1 * lp + 2 * f + 0 * d + 2 * om);
    s +=
        (3272.0 + 0.0 * t) * Math.cos(0 * l + 0 * lp + 0 * f + 2 * d + 1 * om) +
        4.0 * Math.sin(0 * l + 0 * lp + 0 * f + 2 * d + 1 * om);
    s +=
        (-3045.0 + 0.0 * t) * Math.cos(1 * l + 0 * lp + 2 * f + -2 * d + 1 * om) +
        -1.0 * Math.sin(1 * l + 0 * lp + 2 * f + -2 * d + 1 * om);
    s +=
        (-2768.0 + 0.0 * t) * Math.cos(2 * l + 0 * lp + 2 * f + -2 * d + 2 * om) +
        -4.0 * Math.sin(2 * l + 0 * lp + 2 * f + -2 * d + 2 * om);
    s +=
        (3041.0 + 0.0 * t) * Math.cos(-2 * l + 0 * lp + 0 * f + 2 * d + 1 * om) +
        -5.0 * Math.sin(-2 * l + 0 * lp + 0 * f + 2 * d + 1 * om);
    s +=
        (2695.0 + 0.0 * t) * Math.cos(2 * l + 0 * lp + 2 * f + 0 * d + 1 * om) +
        12.0 * Math.sin(2 * l + 0 * lp + 2 * f + 0 * d + 1 * om);
    s +=
        (2719.0 + 0.0 * t) * Math.cos(0 * l + -1 * lp + 2 * f + -2 * d + 1 * om) +
        -3.0 * Math.sin(0 * l + -1 * lp + 2 * f + -2 * d + 1 * om);
    s +=
        (2720.0 + 0.0 * t) * Math.cos(0 * l + 0 * lp + 0 * f + -2 * d + 1 * om) +
        -9.0 * Math.sin(0 * l + 0 * lp + 0 * f + -2 * d + 1 * om);
    s +=
        (-51.0 + 0.0 * t) * Math.cos(-1 * l + -1 * lp + 0 * f + 2 * d + 0 * om) +
        4.0 * Math.sin(-1 * l + -1 * lp + 0 * f + 2 * d + 0 * om);
    s +=
        (-2206.0 + 0.0 * t) * Math.cos(2 * l + 0 * lp + 0 * f + -2 * d + 1 * om) +
        1.0 * Math.sin(2 * l + 0 * lp + 0 * f + -2 * d + 1 * om);
    s +=
        (-199.0 + 0.0 * t) * Math.cos(1 * l + 0 * lp + 0 * f + 2 * d + 0 * om) +
        2.0 * Math.sin(1 * l + 0 * lp + 0 * f + 2 * d + 0 * om);
    s +=
        (-1900.0 + 0.0 * t) * Math.cos(0 * l + 1 * lp + 2 * f + -2 * d + 1 * om) +
        1.0 * Math.sin(0 * l + 1 * lp + 2 * f + -2 * d + 1 * om);
    s +=
        (-41.0 + 0.0 * t) * Math.cos(1 * l + -1 * lp + 0 * f + 0 * d + 0 * om) +
        3.0 * Math.sin(1 * l + -1 * lp + 0 * f + 0 * d + 0 * om);
    s +=
        (1313.0 + 0.0 * t) * Math.cos(-2 * l + 0 * lp + 2 * f + 0 * d + 2 * om) +
        -1.0 * Math.sin(-2 * l + 0 * lp + 2 * f + 0 * d + 2 * om);
    s +=
        (1233.0 + 0.0 * t) * Math.cos(3 * l + 0 * lp + 2 * f + 0 * d + 2 * om) +
        7.0 * Math.sin(3 * l + 0 * lp + 2 * f + 0 * d + 2 * om);
    s +=
        (-81.0 + 0.0 * t) * Math.cos(0 * l + -1 * lp + 0 * f + 2 * d + 0 * om) +
        2.0 * Math.sin(0 * l + -1 * lp + 0 * f + 2 * d + 0 * om);
    s +=
        (1232.0 + 0.0 * t) * Math.cos(1 * l + -1 * lp + 2 * f + 0 * d + 2 * om) +
        4.0 * Math.sin(1 * l + -1 * lp + 2 * f + 0 * d + 2 * om);
    s +=
        (-20.0 + 0.0 * t) * Math.cos(0 * l + 0 * lp + 0 * f + 1 * d + 0 * om) +
        -2.0 * Math.sin(0 * l + 0 * lp + 0 * f + 1 * d + 0 * om);
    s +=
        (1207.0 + 0.0 * t) * Math.cos(-1 * l + -1 * lp + 2 * f + 2 * d + 2 * om) +
        3.0 * Math.sin(-1 * l + -1 * lp + 2 * f + 2 * d + 2 * om);
    s +=
        (40.0 + 0.0 * t) * Math.cos(-1 * l + 0 * lp + 2 * f + 0 * d + 0 * om) +
        -2.0 * Math.sin(-1 * l + 0 * lp + 2 * f + 0 * d + 0 * om);
    s +=
        (1129.0 + 0.0 * t) * Math.cos(0 * l + -1 * lp + 2 * f + 2 * d + 2 * om) +
        5.0 * Math.sin(0 * l + -1 * lp + 2 * f + 2 * d + 2 * om);
    s +=
        (1266.0 + 0.0 * t) * Math.cos(-2 * l + 0 * lp + 0 * f + 0 * d + 1 * om) +
        -4.0 * Math.sin(-2 * l + 0 * lp + 0 * f + 0 * d + 1 * om);
    s +=
        (-1062.0 + 0.0 * t) * Math.cos(1 * l + 1 * lp + 2 * f + 0 * d + 2 * om) +
        -3.0 * Math.sin(1 * l + 1 * lp + 2 * f + 0 * d + 2 * om);
    s +=
        (-1129.0 + 0.0 * t) * Math.cos(2 * l + 0 * lp + 0 * f + 0 * d + 1 * om) +
        -2.0 * Math.sin(2 * l + 0 * lp + 0 * f + 0 * d + 1 * om);
    s +=
        (-9.0 + 0.0 * t) * Math.cos(-1 * l + 1 * lp + 0 * f + 1 * d + 0 * om) +
        0.0 * Math.sin(-1 * l + 1 * lp + 0 * f + 1 * d + 0 * om);
    s +=
        (35.0 + 0.0 * t) * Math.cos(1 * l + 1 * lp + 0 * f + 0 * d + 0 * om) +
        -2.0 * Math.sin(1 * l + 1 * lp + 0 * f + 0 * d + 0 * om);
    s +=
        (-107.0 + 0.0 * t) * Math.cos(1 * l + 0 * lp + 2 * f + 0 * d + 0 * om) +
        1.0 * Math.sin(1 * l + 0 * lp + 2 * f + 0 * d + 0 * om);
    s +=
        (1073.0 + 0.0 * t) * Math.cos(-1 * l + 0 * lp + 2 * f + -2 * d + 1 * om) +
        -2.0 * Math.sin(-1 * l + 0 * lp + 2 * f + -2 * d + 1 * om);
    s +=
        (854.0 + 0.0 * t) * Math.cos(1 * l + 0 * lp + 0 * f + 0 * d + 2 * om) +
        0.0 * Math.sin(1 * l + 0 * lp + 0 * f + 0 * d + 2 * om);
    s +=
        (-553.0 + 0.0 * t) * Math.cos(-1 * l + 0 * lp + 0 * f + 1 * d + 0 * om) +
        -139.0 * Math.sin(-1 * l + 0 * lp + 0 * f + 1 * d + 0 * om);
    s +=
        (-710.0 + 0.0 * t) * Math.cos(0 * l + 0 * lp + 2 * f + 1 * d + 2 * om) +
        -2.0 * Math.sin(0 * l + 0 * lp + 2 * f + 1 * d + 2 * om);
    s +=
        (647.0 + 0.0 * t) * Math.cos(-1 * l + 0 * lp + 2 * f + 4 * d + 2 * om) +
        4.0 * Math.sin(-1 * l + 0 * lp + 2 * f + 4 * d + 2 * om);
    s +=
        (-700.0 + 0.0 * t) * Math.cos(-1 * l + 1 * lp + 0 * f + 1 * d + 1 * om) +
        0.0 * Math.sin(-1 * l + 1 * lp + 0 * f + 1 * d + 1 * om);
    s +=
        (672.0 + 0.0 * t) * Math.cos(0 * l + -2 * lp + 2 * f + -2 * d + 1 * om) +
        0.0 * Math.sin(0 * l + -2 * lp + 2 * f + -2 * d + 1 * om);
    s +=
        (663.0 + 0.0 * t) * Math.cos(1 * l + 0 * lp + 2 * f + 2 * d + 1 * om) +
        4.0 * Math.sin(1 * l + 0 * lp + 2 * f + 2 * d + 1 * om);
    s +=
        (-594.0 + 0.0 * t) * Math.cos(-2 * l + 0 * lp + 2 * f + 2 * d + 2 * om) +
        -2.0 * Math.sin(-2 * l + 0 * lp + 2 * f + 2 * d + 2 * om);
    s +=
        (-610.0 + 0.0 * t) * Math.cos(-1 * l + 0 * lp + 0 * f + 0 * d + 2 * om) +
        2.0 * Math.sin(-1 * l + 0 * lp + 0 * f + 0 * d + 2 * om);
    s +=
        (-556.0 + 0.0 * t) * Math.cos(1 * l + 1 * lp + 2 * f + -2 * d + 2 * om) +
        0.0 * Math.sin(1 * l + 1 * lp + 2 * f + -2 * d + 2 * om);
    const dEpsDeg = s / 36000000000.0;
    return dEpsDeg;
  }

  /// Mean obliquity of the ecliptic (ε₀ dalam derajat)
  meanObliquityOfEcliptic(jd, deltaT) {
    const jde = jd + deltaT / 86400.0;
    const t = (jde - 2451545.0) / 36525.0;
    const u = t / 100.0;

    const eps0 =
        23.0 +
        26.0 / 60.0 +
        21.448 / 3600.0 +
        (-4680.93 * u -
                1.55 * Math.pow(u, 2) +
                1999.25 * Math.pow(u, 3) -
                51.38 * Math.pow(u, 4) -
                249.67 * Math.pow(u, 5) -
                39.05 * Math.pow(u, 6) +
                7.12 * Math.pow(u, 7) +
                27.87 * Math.pow(u, 8) +
                5.79 * Math.pow(u, 9) +
                2.45 * Math.pow(u, 10)) /
            3600.0;

    return eps0;
  }

  /// True obliquity of the ecliptic (ε = ε₀ + Δε)
  trueObliquityOfEcliptic(jd, deltaT) {
    const eps0 = this.meanObliquityOfEcliptic(jd, deltaT);
    const dltEps = this.nutationInObliquity(jd, deltaT);
    const eps = eps0 + dltEps;
    return eps;
  }
}

