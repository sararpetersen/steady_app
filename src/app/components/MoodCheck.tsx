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
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "8px" }}>
        {moods.map((mood, i) => (
          <button
            key={mood.key}
            onClick={() => select(i)}
            className="flex flex-col items-center gap-1 rounded-xl border-2 cursor-pointer hover:opacity-85"
            style={{
              padding: "10px 4px",
              borderColor: selected === i ? "var(--primary)" : "transparent",
              backgroundColor: selected === i ? MOOD_COLOR_VARS[i] : "var(--surface-1)",
              transform: selected === i ? "scale(1.08)" : "scale(1)",
              transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
            }}
            aria-pressed={selected === i}
          >
            <span style={{ fontSize: "1.5rem" }}>{mood.emoji}</span>
            <span className="text-foreground" style={{ fontSize: "0.75rem", fontWeight: 600 }}>{mood.label}</span>
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
