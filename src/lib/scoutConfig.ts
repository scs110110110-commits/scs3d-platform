/** Matches site UI: Cults3D downloads + Printables trending (last 30 days) */
export const SCOUT_WINDOW_DAYS = 30;
export const SCOUT_POOL_PER_SITE = 25;
export const DAILY_REPORT_PER_SITE = 5;
export const DAILY_REPORT_TOTAL = DAILY_REPORT_PER_SITE * 2;

export function scoutWindowStartIso(): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - SCOUT_WINDOW_DAYS);
  return d.toISOString();
}

export function scoutWindowStartMs(): number {
  return new Date(scoutWindowStartIso()).getTime();
}

export function isWithinScoutWindow(publishedAt?: string): boolean {
  if (!publishedAt) return true;
  const ts = new Date(publishedAt).getTime();
  return !Number.isNaN(ts) && ts >= scoutWindowStartMs();
}
