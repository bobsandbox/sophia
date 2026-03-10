// Sophia's birth date — hardcoded
const BIRTH_DATE = "2026-02-26";
const BIRTH_TIME = "20:30";

export function getBirthDay(): Date {
  const [y, m, d] = BIRTH_DATE.split("-").map(Number);
  return new Date(y, m - 1, d, 0, 0, 0, 0);
}

export interface AgeBreakdown {
  totalDays: number;
  totalWeeks: number;
  totalMonths: number;
  days: number;
  weeks: number;
  months: number;
}

/** Count age based on calendar days (midnight to midnight) */
export function getAge(birthDay: Date, now: Date = new Date()): AgeBreakdown {
  const birthMidnight = new Date(birthDay.getFullYear(), birthDay.getMonth(), birthDay.getDate());
  const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const diffMs = nowMidnight.getTime() - birthMidnight.getTime();
  const totalDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  const totalWeeks = Math.floor(totalDays / 7);

  let months = (nowMidnight.getFullYear() - birthMidnight.getFullYear()) * 12 + (nowMidnight.getMonth() - birthMidnight.getMonth());
  if (nowMidnight.getDate() < birthMidnight.getDate()) months--;
  if (months < 0) months = 0;

  const remainingDaysInWeek = totalDays % 7;
  const weeksAfterMonths = Math.floor((totalDays - Math.round(months * 30.44)) / 7);

  return {
    totalDays,
    totalWeeks,
    totalMonths: months,
    days: remainingDaysInWeek,
    weeks: weeksAfterMonths < 0 ? 0 : weeksAfterMonths,
    months,
  };
}

export function formatAge(age: AgeBreakdown): string {
  if (age.totalDays < 0) return "";
  if (age.totalDays === 0) return "Vandaag geboren!";
  if (age.totalDays === 1) return "1 dag oud";
  if (age.totalDays < 14) return `${age.totalDays} dagen oud`;
  if (age.totalWeeks < 9) {
    const w = age.totalWeeks;
    const d = age.days;
    if (d === 0) return `${w} weken oud`;
    return `${w} weken en ${d} ${d === 1 ? "dag" : "dagen"} oud`;
  }
  const m = age.months;
  const remainingWeeks = Math.floor((age.totalDays - Math.round(m * 30.44)) / 7);
  if (remainingWeeks <= 0) return `${m} ${m === 1 ? "maand" : "maanden"} oud`;
  return `${m} ${m === 1 ? "maand" : "maanden"} en ${remainingWeeks} ${remainingWeeks === 1 ? "week" : "weken"} oud`;
}
