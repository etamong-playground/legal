import type { LegalVersion } from "./model";

/**
 * Today as YYYY-MM-DD in a given IANA timezone (default Asia/Seoul).
 *
 * Effective/published dates are legal calendar dates, so they must be compared
 * against the calendar day in the service's jurisdiction — not UTC, which can
 * be a day off for KST users near midnight.
 */
export function todayISO(timeZone = "Asia/Seoul"): string {
  // en-CA formats as YYYY-MM-DD.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

/**
 * The version currently in force: newest whose `effectiveDate` is on/before
 * `today`. Falls back to the oldest version if none is effective yet (so a
 * brand-new doc still renders something).
 */
export function effectiveVersion(versions: LegalVersion[], today = todayISO()): LegalVersion {
  const inForce = versions
    .filter((v) => v.effectiveDate <= today)
    .sort((a, b) => b.effectiveDate.localeCompare(a.effectiveDate));
  return inForce[0] ?? versions[versions.length - 1];
}

/**
 * The soonest *announced* version not yet in force: `publishedDate <= today <
 * effectiveDate`. Returns null when nothing is pending.
 *
 * The `publishedDate <= today` guard is deliberate — it prevents a draft entry
 * with a future publish date from prematurely lighting up the public "변경 예정"
 * banner (see planning concepts/user-facing-content-hygiene: no fake notices).
 */
export function upcomingVersion(versions: LegalVersion[], today = todayISO()): LegalVersion | null {
  const announced = versions
    .filter((v) => v.publishedDate <= today && v.effectiveDate > today)
    .sort((a, b) => a.effectiveDate.localeCompare(b.effectiveDate));
  return announced[0] ?? null;
}
