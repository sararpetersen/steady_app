import { History } from "lucide-react";
import { useLang } from "../i18n/LangContext";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useToday } from "../hooks/useToday";
import type { MoodEntry } from "./MoodCheck";
import type { Habit } from "./HabitTracker";
import type { NoteEntry } from "./DailyNote";

// Same "last 7 calendar days, keyed off the app's own today" pattern as HabitTracker's
// 7-day history strip — duplicated locally rather than shared, matching how last7Days()
// already exists separately in Profile.tsx and HabitTracker.tsx.
function last7DateKeys(today: string): string[] {
  const [y, m, d] = today.split("-").map(Number);
  const keys: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const dt = new Date(y, m - 1, d - i);
    keys.push(`${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`);
  }
  return keys;
}

interface Recap {
  checkedInDays: number;
  topMoodIndex: number | null;
  habitCompletions: number;
  topHabit: { name: string; emoji: string; count: number } | null;
  reflectionCount: number;
  latestReflection: NoteEntry | null;
  hasAnyData: boolean;
}

// Tasks and routines aren't included here — unlike habits and mood, neither keeps any
// history past "today" (completed one-off tasks are deleted at rollover, routine done-state
// is wiped daily), so there's nothing truthful to recap for them yet without adding a new
// completion log for both.
function computeRecap(today: string, moodHistory: MoodEntry[], habits: Habit[], notes: NoteEntry[]): Recap {
  const week = new Set(last7DateKeys(today));

  const weekMoods = moodHistory.filter((e) => week.has(e.date));
  let topMoodIndex: number | null = null;
  if (weekMoods.length > 0) {
    const counts = new Map<number, number>();
    for (const e of weekMoods) counts.set(e.moodIndex, (counts.get(e.moodIndex) ?? 0) + 1);
    let best = -1;
    for (const [idx, count] of counts) {
      if (count > best) {
        best = count;
        topMoodIndex = idx;
      }
    }
  }

  let habitCompletions = 0;
  let topHabit: Recap["topHabit"] = null;
  for (const h of habits) {
    const count = (h.completedDates ?? []).filter((d) => week.has(d)).length;
    habitCompletions += count;
    if (count >= 2 && (topHabit === null || count > topHabit.count)) {
      topHabit = { name: h.name, emoji: h.emoji, count };
    }
  }

  const weekNotes = notes.filter((n) => week.has(n.date));
  const latestReflection = weekNotes.length > 0 ? [...weekNotes].sort((a, b) => b.date.localeCompare(a.date))[0] : null;

  return {
    checkedInDays: weekMoods.length,
    topMoodIndex,
    habitCompletions,
    topHabit,
    reflectionCount: weekNotes.length,
    latestReflection,
    hasAnyData: weekMoods.length > 0 || habitCompletions > 0 || weekNotes.length > 0,
  };
}

export function WeeklyRecap() {
  const t = useLang();
  const today = useToday();
  const [moodHistory] = useLocalStorage<MoodEntry[]>("steady-mood-history", []);
  const [habits] = useLocalStorage<Habit[]>("steady-habits-v2", []);
  const [notes] = useLocalStorage<NoteEntry[]>("steady-notes", []);
  const r = t.weeklyRecap;
  const moods = t.mood.options;

  const recap = computeRecap(today, moodHistory, habits, notes);

  return (
    <div className="steady-card bg-card rounded-2xl p-5 border border-border">
      <div className="flex items-center gap-2 mb-1">
        <History size={18} style={{ color: "var(--orange-text)" }} aria-hidden="true" />
        <h3 className="text-foreground">{r.heading}</h3>
      </div>
      <p className="text-muted-foreground mb-3" style={{ fontSize: "0.95rem" }}>
        {r.description}
      </p>

      {!recap.hasAnyData ? (
        <p className="rounded-xl px-4 py-3 text-muted-foreground" style={{ backgroundColor: "var(--surface-1)", fontSize: "0.9rem", lineHeight: 1.6 }}>
          {r.notEnoughData}
        </p>
      ) : (
        <div className="rounded-xl p-4 space-y-3" style={{ backgroundColor: "var(--orange-bg)" }}>
          <ul className="space-y-2">
            {recap.checkedInDays > 0 && (
              <li className="flex items-start gap-2" style={{ color: "var(--orange-text)", fontSize: "0.9rem", lineHeight: 1.6 }}>
                <span aria-hidden="true" className="flex-shrink-0">{recap.topMoodIndex !== null ? moods[recap.topMoodIndex].emoji : "💬"}</span>
                <span>
                  {r.checkedIn(recap.checkedInDays)}
                  {recap.topMoodIndex !== null && ` ${r.moodMostly(moods[recap.topMoodIndex].label)}`}
                </span>
              </li>
            )}
            {recap.habitCompletions > 0 && (
              <li className="flex items-start gap-2" style={{ color: "var(--orange-text)", fontSize: "0.9rem", lineHeight: 1.6 }}>
                <span aria-hidden="true" className="flex-shrink-0">🌱</span>
                <span>
                  {r.habitCompletionsSentence(recap.habitCompletions)}
                  {recap.topHabit && ` ${r.topHabit(`${recap.topHabit.emoji} ${recap.topHabit.name}`, recap.topHabit.count)}`}
                </span>
              </li>
            )}
            {recap.reflectionCount > 0 && (
              <li className="flex items-start gap-2" style={{ color: "var(--orange-text)", fontSize: "0.9rem", lineHeight: 1.6 }}>
                <span aria-hidden="true" className="flex-shrink-0">📝</span>
                <span>{r.reflections(recap.reflectionCount)}</span>
              </li>
            )}
          </ul>

          {recap.latestReflection && (
            <div className="rounded-lg p-3" style={{ backgroundColor: "var(--card)" }}>
              <p className="text-muted-foreground mb-1" style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                {r.somethingYouWrote}
              </p>
              <p style={{ fontSize: "0.88rem", fontStyle: "italic", color: "var(--foreground)", lineHeight: 1.5 }}>
                &ldquo;{recap.latestReflection.text}&rdquo;
              </p>
            </div>
          )}

          <p style={{ color: "var(--orange-text)", fontSize: "0.85rem", lineHeight: 1.6, opacity: 0.9 }}>{r.closing}</p>
        </div>
      )}
    </div>
  );
}
