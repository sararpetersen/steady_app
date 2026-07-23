import { useLocalStorage } from "../hooks/useLocalStorage";
import { useToday } from "../hooks/useToday";
import { useLang } from "../i18n/LangContext";

export interface MoodEntry {
  date: string; // "YYYY-MM-DD"
  moodIndex: number;
}

const MOOD_COLOR_VARS = [
  "var(--mood-color-0)",
  "var(--mood-color-1)",
  "var(--mood-color-2)",
  "var(--mood-color-3)",
  "var(--mood-color-4)",
  "var(--mood-color-5)",
];

export function MoodCheck() {
  const t = useLang();
  const [history, setHistory] = useLocalStorage<MoodEntry[]>("steady-mood-history", []);
  const moods = t.mood.options;

  const today = useToday();
  const todayEntry = history.find((e) => e.date === today);
  const selected = todayEntry?.moodIndex ?? null;

  const select = (index: number) => {
    setHistory((prev) => {
      const without = prev.filter((e) => e.date !== today);
      return [...without, { date: today, moodIndex: index }];
    });
  };

  return (
    <div className="steady-card bg-card rounded-2xl p-5 border border-border">
      <h3 className="mb-1.5 text-foreground">{t.mood.heading}</h3>
      <p className="text-muted-foreground mb-3" style={{ fontSize: "0.95rem" }}>
        {t.mood.description}
        <br />
        <span className="opacity-80 italic" style={{ fontSize: "0.7rem" }}>
          {t.mood.changeHint}
        </span>
      </p>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
        {moods.map((mood, i) => (
          <button
            key={mood.key}
            onClick={() => select(i)}
            className="flex flex-col items-center gap-1 rounded-xl border-2 cursor-pointer hover:opacity-85"
            style={{
              padding: "10px 4px",
              borderColor: selected === i ? "var(--primary)" : "transparent",
              backgroundColor: selected === i ? MOOD_COLOR_VARS[i] : "var(--surface-1)",
              transform: selected === i ? "scale(1.06)" : "scale(1)",
              transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
            }}
            aria-label={mood.label}
            aria-pressed={selected === i}
          >
            <span aria-hidden="true" style={{ fontSize: "1.5rem" }}>
              {mood.emoji}
            </span>
            <span
              className="mood-label text-foreground"
              style={{ fontSize: "11px", fontWeight: 600, lineHeight: 1.2, textAlign: "center", wordBreak: "break-word" }}
            >
              {mood.label}
            </span>
          </button>
        ))}
      </div>
      {selected !== null && (
        <p className="mt-4" style={{ fontWeight: 600, color: "var(--primary)" }}>
          {moods[selected].result}
        </p>
      )}
    </div>
  );
}
