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
      <div className="flex gap-3 flex-wrap">
        {moods.map((mood, i) => (
          <button
            key={mood.key}
            onClick={() => select(i)}
            className="flex flex-col items-center gap-1 rounded-xl px-4 py-3 border-2 cursor-pointer hover:opacity-85"
            style={{
              borderColor: selected === i ? "var(--primary)" : "transparent",
              backgroundColor: selected === i ? MOOD_COLOR_VARS[i] : "var(--surface-1)",
              transform: selected === i ? "scale(1.08)" : "scale(1)",
              transition: "all 0.15s",
            }}
            aria-pressed={selected === i}
          >
            <span style={{ fontSize: "2rem" }}>{mood.emoji}</span>
            <span className="text-foreground" style={{ fontSize: "0.85rem", fontWeight: 600 }}>{mood.label}</span>
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
