const MORNING_MINUTES: number = 9 * 60;
const TIME_PATTERN: RegExp = /(\d{1,2})\s*[:hH]\s*(\d{2})?/;

/** Transforme une heure écrite par l'IA (« 09:30 », « 14h », « 8h15 ») en minutes depuis minuit, 9h par défaut. */
export function minutesOfDay(time: string): number {
  const match: RegExpExecArray | null = TIME_PATTERN.exec(time);
  if (!match) {
    return MORNING_MINUTES;
  }

  const hours: number = Math.min(Number(match[1]), 23);
  const minutes: number = Math.min(Number(match[2] ?? 0), 59);
  return hours * 60 + minutes;
}
