import { useLocalStorage } from "../hooks/useLocalStorage";
import { useLang } from "../i18n/LangContext";

export interface MoodEntry {
  date: string; // "YYYY-MM-DD"
  moodIndex: number;
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

const MOOD_COLOR_VARS = [
  "var(--mood-color-0)",
  "var(--mood-color-1)",
  "var(--mood-color-2)",
  "var(--mood-color-3)",
  "var(--mood-color-4)",
];

export function MoodCheck() {
  const t = useLang();
  const [history, setHistory] = useLocalStorage<MoodEntry[]>("steady-mood-history", []);
  const moods = t.mood.options;

  const today = todayKey();
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
      <h3 className="mb-1 text-foreground">{t.mood.heading}</h3>
      <p className="text-muted-foreground mb-4" style={{ fontSize: "0.95rem" }}>{t.mood.description}</p>
      <div style={{ display: "flex", gap: "6px" }}>
        {moods.map((mood, i) => (
          <button
            key={mood.key}
            onClick={() => select(i)}
            className="flex flex-col items-center gap-1 rounded-xl border-2 cursor-pointer hover:opacity-85"
            style={{
              flex: 1,
              minWidth: 0,
              padding: "8px 2px",
              borderColor: selected === i ? "var(--primary)" : "transparent",
              backgroundColor: selected === i ? MOOD_COLOR_VARS[i] : "var(--surface-1)",
              transform: selected === i ? "scale(1.06)" : "scale(1)",
              transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
            }}
            aria-label={mood.label}
            aria-pressed={selected === i}
          >
            <span aria-hidden="true" style={{ fontSize: "1.4rem" }}>{mood.emoji}</span>
            <span className="mood-label text-foreground" style={{ fontSize: "11px", fontWeight: 600, lineHeight: 1.2, overflow: "hidden", maxWidth: "100%" }}>{mood.label}</span>
          </button>
        ))}
      </div>
      {selected !== null && (
        <p className="mt-4" style={{ fontWeight: 600, color: "var(--primary)" }}>
          {t.mood.result(moods[selected].label, moods[selected].emoji)}
        </p>
      )}
    </div>
  );
}
