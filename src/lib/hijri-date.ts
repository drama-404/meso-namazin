/**
 * Approximate Hijri date calculation using the Umm al-Qura-style algorithm.
 * Accurate enough for Ramadan detection (month 9) and day-of-month display.
 */
export function getCurrentHijriDate(): { day: number; month: number; year: number } {
  const now = new Date();
  return gregorianToHijri(now);
}

function gregorianToHijri(date: Date): { day: number; month: number; year: number } {
  const gd = date.getDate();
  const gm = date.getMonth() + 1; // 1-based
  const gy = date.getFullYear();

  // Julian Day Number
  let jd =
    Math.floor((1461 * (gy + 4800 + Math.floor((gm - 14) / 12))) / 4) +
    Math.floor((367 * (gm - 2 - 12 * Math.floor((gm - 14) / 12))) / 12) -
    Math.floor((3 * Math.floor((gy + 4900 + Math.floor((gm - 14) / 12)) / 100)) / 4) +
    gd -
    32075;

  // Convert JD to Hijri
  const l = jd - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  const remainL = l - 10631 * n + 354;
  const j =
    Math.floor((10985 - remainL) / 5316) * Math.floor((50 * remainL) / 17719) +
    Math.floor(remainL / 5670) * Math.floor((43 * remainL) / 15238);
  const finalL =
    remainL -
    Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
    Math.floor(j / 16) * Math.floor((15238 * j) / 43) +
    29;
  const month = Math.floor((24 * finalL) / 709);
  const day = finalL - Math.floor((709 * month) / 24);
  const year = 30 * n + j - 30;

  return { day, month, year };
}
