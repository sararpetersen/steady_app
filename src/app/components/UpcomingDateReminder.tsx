import { useLocalStorage } from "../hooks/useLocalStorage";
import { useToday } from "../hooks/useToday";
import { useLang } from "../i18n/LangContext";
import { getDateStatus, type ImportantDateEntry } from "./ImportantDates";

// Deliberately short — a longer lead time starts to feel like a countdown, which is the
// opposite of "gentle". This is also not a real push notification (the browser can't
// reliably deliver those without a service worker + backend); it's just a quiet card that
// shows up on Home while something's genuinely close, controlled by the Settings toggle.
const REMINDER_WINDOW_DAYS = 3;

export function UpcomingDateReminder() {
  const t = useLang();
  const today = useToday();
  const [dates] = useLocalStorage<ImportantDateEntry[]>("steady-important-dates", []);
  const [remindersEnabled] = useLocalStorage<boolean>("steady-date-reminders-enabled", true);

  if (!remindersEnabled || dates.length === 0) return null;

  let soonest: { entry: ImportantDateEntry; daysUntil: number } | null = null;
  for (const entry of dates) {
    const status = getDateStatus(entry, today);
    if (status.daysUntil === null || status.daysUntil > REMINDER_WINDOW_DAYS) continue;
    if (soonest === null || status.daysUntil < soonest.daysUntil) {
      soonest = { entry, daysUntil: status.daysUntil };
    }
  }
  if (!soonest) return null;

  const sentence =
    soonest.daysUntil === 0
      ? t.dates.upcoming.today(soonest.entry.name)
      : soonest.daysUntil === 1
      ? t.dates.upcoming.tomorrow(soonest.entry.name)
      : t.dates.upcoming.inDays(soonest.entry.name, soonest.daysUntil);

  return (
    <div className="steady-card rounded-2xl p-4 flex items-center gap-3 border border-border" style={{ backgroundColor: "var(--yellow-bg)" }}>
      <span aria-hidden="true" style={{ fontSize: "1.6rem", flexShrink: 0 }}>
        {soonest.entry.emoji}
      </span>
      <p style={{ color: "var(--yellow-text)", fontWeight: 600, fontSize: "0.92rem" }}>{sentence}</p>
    </div>
  );
}
