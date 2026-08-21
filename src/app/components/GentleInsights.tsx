import { ChartNoAxesCombined } from "lucide-react";
import { useLang } from "../i18n/LangContext";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { MoodEntry } from "./MoodCheck";
import type { Habit } from "./HabitTracker";

// Needs at least this many mood check-ins on both "habit" and "no habit" days before
// saying anything — a two-day sample would just be noise dressed up as a pattern.
const MIN_BUCKET_SIZE = 3;
// moodIndex swings below this between the two buckets reads as "about the same" rather
// than manufacturing a verdict out of a fractional difference.
const DIFF_THRESHOLD = 0.5;

type Verdict = "higher" | "lower" | "similar";

interface Result {
  verdict: Verdict;
  avgWithHabit: number;
  avgWithoutHabit: number;
  sampleSize: number;
}

// Unlike PersonalizedTip's canned, profile-based messages, this is computed live from the
// user's own mood + habit logs — different mechanism, so it needs to look like one, not
// like another colored tip box.
function computeResult(moodHistory: MoodEntry[], habits: Habit[]): Result | null {
  const trackingStart = habits
    .flatMap((h) => h.completedDates ?? [])
    .reduce<string | null>((min, d) => (min === null || d < min ? d : min), null);
  if (!trackingStart) return null;

  const habitDoneDates = new Set(habits.flatMap((h) => h.completedDates ?? []));
  const relevant = moodHistory.filter((e) => e.date >= trackingStart);
  const withHabit = relevant.filter((e) => habitDoneDates.has(e.date));
  const withoutHabit = relevant.filter((e) => !habitDoneDates.has(e.date));
  if (withHabit.length < MIN_BUCKET_SIZE || withoutHabit.length < MIN_BUCKET_SIZE) return null;

  const avg = (arr: MoodEntry[]) => arr.reduce((sum, e) => sum + e.moodIndex, 0) / arr.length;
  const avgWithHabit = avg(withHabit);
  const avgWithoutHabit = avg(withoutHabit);
  const diff = avgWithHabit - avgWithoutHabit;
  const verdict: Verdict = diff >= DIFF_THRESHOLD ? "higher" : diff <= -DIFF_THRESHOLD ? "lower" : "similar";

  return { verdict, avgWithHabit, avgWithoutHabit, sampleSize: withHabit.length + withoutHabit.length };
}

function MoodBar({ label, value, moodEmoji }: { label: string; value: number; moodEmoji: string }) {
  const pct = Math.max(6, (value / 5) * 100);
  return (
    <div className="flex items-center gap-2.5">
      <span className="text-muted-foreground flex-shrink-0" style={{ fontSize: "0.78rem", width: 84 }}>
        {label}
      </span>
      <div className="flex-1 min-w-0 rounded-full overflow-hidden" style={{ height: 8, backgroundColor: "var(--surface-1)" }}>
        <div style={{ width: `${pct}%`, height: "100%", backgroundColor: "var(--blue-text)", borderRadius: 999 }} />
      </div>
      <span aria-hidden="true" style={{ fontSize: "1rem", flexShrink: 0 }}>{moodEmoji}</span>
    </div>
  );
}

export function GentleInsights() {
  const t = useLang();
  const [moodHistory] = useLocalStorage<MoodEntry[]>("steady-mood-history", []);
  const [habits] = useLocalStorage<Habit[]>("steady-habits-v2", []);
  const moods = t.mood.options;

  const result = computeResult(moodHistory, habits);

  return (
    <div className="steady-card bg-card rounded-2xl p-5 border border-border">
      <div className="flex items-center gap-2 mb-1">
        <ChartNoAxesCombined size={18} style={{ color: "var(--blue-text)" }} aria-hidden="true" />
        <h3 className="text-foreground">{t.insights.heading}</h3>
      </div>
      <p className="text-muted-foreground mb-3" style={{ fontSize: "0.95rem" }}>
        {t.insights.description}
      </p>

      {result === null ? (
        <p className="rounded-xl px-4 py-3 text-muted-foreground" style={{ backgroundColor: "var(--surface-1)", fontSize: "0.9rem", lineHeight: 1.6 }}>
          {t.insights.notEnoughData}
        </p>
      ) : (
        <div className="rounded-xl p-4 space-y-3" style={{ backgroundColor: "var(--blue-bg)" }}>
          <div className="space-y-2">
            <MoodBar
              label={t.insights.habitDaysLabel}
              value={result.avgWithHabit}
              moodEmoji={moods[Math.round(result.avgWithHabit)].emoji}
            />
            <MoodBar
              label={t.insights.otherDaysLabel}
              value={result.avgWithoutHabit}
              moodEmoji={moods[Math.round(result.avgWithoutHabit)].emoji}
            />
          </div>
          <p style={{ color: "var(--blue-text)", fontSize: "0.9rem", lineHeight: 1.6 }}>
            {t.insights[result.verdict]}
          </p>
          <p className="text-muted-foreground" style={{ fontSize: "0.72rem" }}>
            {t.insights.sampleSize(result.sampleSize)}
          </p>
        </div>
      )}
    </div>
  );
}
