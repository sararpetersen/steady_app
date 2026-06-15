import { useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useLang } from "../i18n/LangContext";
import { Flame, Plus, X, Check } from "lucide-react";

export interface Habit {
  id: string;
  name: string;
  emoji: string;
  streak: number;
  doneToday: boolean;
}

const EMOJI_SUGGESTIONS = [
  "💧","🚶","📵","📝","🏃","😴","🥗","🧘","📚","💊",
  "🎵","🌳","☀️","🍎","💪","🧹","🎯","✍️","🫧","🌿",
];

const DONE_COLORS = [
  "var(--habit-water)",
  "var(--habit-move)",
  "var(--habit-screens)",
  "var(--habit-journal)",
  "var(--green-bg)",
  "var(--purple-bg)",
  "var(--yellow-bg)",
];

function getDoneColor(index: number) {
  return DONE_COLORS[index % DONE_COLORS.length];
}

function generateId() {
  return `habit-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export const DEFAULT_HABITS: Habit[] = [
  { id: "water", name: "Drink 8 glasses of water", emoji: "💧", streak: 0, doneToday: false },
  { id: "move", name: "Move my body", emoji: "🚶", streak: 0, doneToday: false },
  { id: "screens", name: "No screens 1 hr before bed", emoji: "📵", streak: 0, doneToday: false },
  { id: "journal", name: "Journal or gratitude note", emoji: "📝", streak: 0, doneToday: false },
];

export function HabitTracker() {
  const t = useLang();
  const [habits, setHabits] = useLocalStorage<Habit[]>("steady-habits-v2", DEFAULT_HABITS);
  const [showForm, setShowForm] = useState(false);
  const [newEmoji, setNewEmoji] = useState("🎯");
  const [newName, setNewName] = useState("");

  const toggle = (id: string) => {
    setHabits((prev) =>
      prev.map((h) =>
        h.id === id
          ? {
              ...h,
              doneToday: !h.doneToday,
              streak: !h.doneToday ? h.streak + 1 : Math.max(0, h.streak - 1),
            }
          : h
      )
    );
  };

  const deleteHabit = (id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  };

  const addHabit = () => {
    const name = newName.trim();
    if (!name) return;
    setHabits((prev) => [
      ...prev,
      { id: generateId(), name, emoji: newEmoji, streak: 0, doneToday: false },
    ]);
    setNewName("");
    setNewEmoji("🎯");
    setShowForm(false);
  };

  return (
    <div className="steady-card bg-card rounded-2xl p-5 border border-border">
      <h3 className="mb-1 text-foreground">{t.habits.heading}</h3>
      <p className="text-muted-foreground mb-4" style={{ fontSize: "0.95rem" }}>
        {t.habits.description}
      </p>

      {habits.length === 0 && !showForm && (
        <p className="text-muted-foreground text-center py-4" style={{ fontSize: "0.9rem" }}>
          {t.habits.noHabits}
        </p>
      )}

      <div className="space-y-2 mb-3">
        {habits.map((habit, index) => (
          <div
            key={habit.id}
            className="flex items-center gap-3 rounded-xl overflow-hidden group"
          >
            {/* Main tap area */}
            <button
              onClick={() => toggle(habit.id)}
              className="flex-1 flex items-center gap-3 p-3 rounded-xl hover:opacity-90 text-left"
              style={{
                backgroundColor: habit.doneToday ? getDoneColor(index) : "var(--surface-1)",
                border: habit.doneToday ? "2px solid var(--primary)" : "2px solid transparent",
                transition: "background-color 0.25s cubic-bezier(0.34,1.56,0.64,1), border-color 0.25s cubic-bezier(0.34,1.56,0.64,1), transform 0.25s cubic-bezier(0.34,1.56,0.64,1)",
                transform: habit.doneToday ? "scale(1.01)" : "scale(1)",
              }}
            >
              <span style={{ fontSize: "1.7rem", flexShrink: 0 }}>{habit.emoji}</span>
              <span className="flex-1 text-foreground" style={{ fontWeight: 600 }}>
                {habit.name}
              </span>
              <div className="flex items-center gap-1">
                <Flame
                  size={15}
                  style={{ color: habit.streak > 0 ? "#E8834A" : "var(--muted-foreground)" }}
                />
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    color: habit.streak > 0 ? "#E8834A" : "var(--muted-foreground)",
                  }}
                >
                  {habit.streak}
                </span>
              </div>
              <div
                className="rounded-full border-2 flex items-center justify-center flex-shrink-0"
                style={{
                  width: 24,
                  height: 24,
                  borderColor: habit.doneToday ? "var(--primary)" : "var(--muted-foreground)",
                  backgroundColor: habit.doneToday ? "var(--primary)" : "transparent",
                  transition: "all 0.25s cubic-bezier(0.34,1.56,0.64,1)",
                }}
              >
                {habit.doneToday && (
                  <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
                    <path d="M2.5 7L5.5 10L11.5 4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            </button>

            {/* Delete — visible on hover (desktop) / always on mobile */}
            <button
              onClick={() => deleteHabit(habit.id)}
              className="flex-shrink-0 p-2 rounded-xl text-muted-foreground hover:text-destructive hover:bg-muted sm:opacity-0 sm:group-hover:opacity-100"
              style={{ transition: "all 0.15s" }}
              aria-label={t.habits.deleteHabit}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Add habit form */}
      {showForm ? (
        <div
          className="rounded-2xl p-4 border-2 space-y-3"
          style={{ borderColor: "var(--primary)", backgroundColor: "var(--surface-1)" }}
        >
          {/* Emoji picker */}
          <div>
            <p className="text-muted-foreground mb-2" style={{ fontSize: "0.82rem", fontWeight: 600 }}>
              Pick an emoji
            </p>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {EMOJI_SUGGESTIONS.map((e) => (
                <button
                  key={e}
                  onClick={() => setNewEmoji(e)}
                  className="rounded-lg hover:scale-110"
                  style={{
                    width: 36,
                    height: 36,
                    fontSize: "1.3rem",
                    backgroundColor: newEmoji === e ? "var(--green-bg)" : "transparent",
                    border: newEmoji === e ? "2px solid var(--primary)" : "2px solid transparent",
                    transition: "all 0.15s",
                  }}
                >
                  {e}
                </button>
              ))}
            </div>
            {/* Selected emoji preview */}
            <div className="flex items-center gap-2">
              <span style={{ fontSize: "1.8rem" }}>{newEmoji}</span>
              <span className="text-muted-foreground" style={{ fontSize: "0.82rem" }}>
                or type your own:
              </span>
              <input
                type="text"
                value={newEmoji}
                onChange={(e) => setNewEmoji(e.target.value.slice(-2) || e.target.value)}
                className="rounded-lg border border-border bg-input-background text-foreground outline-none focus:border-primary text-center"
                style={{ width: 48, height: 36, fontSize: "1.2rem" }}
                maxLength={2}
              />
            </div>
          </div>

          {/* Name input */}
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addHabit()}
            placeholder={t.habits.namePlaceholder}
            autoFocus
            className="w-full rounded-xl px-4 py-3 border border-border bg-input-background text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
            style={{ transition: "border-color 0.15s" }}
          />

          <div className="flex gap-2">
            <button
              onClick={addHabit}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3 bg-primary text-primary-foreground hover:opacity-90"
              style={{ fontWeight: 700, transition: "opacity 0.15s" }}
            >
              <Check size={16} />
              {t.habits.addHabit}
            </button>
            <button
              onClick={() => { setShowForm(false); setNewName(""); setNewEmoji("🎯"); }}
              className="rounded-xl px-4 py-3 border border-border text-foreground hover:bg-muted"
              style={{ fontWeight: 600, transition: "background-color 0.15s" }}
            >
              {t.habits.cancel}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowForm(true)}
            className="flex-1 flex items-center gap-3 p-3 rounded-xl border-2 border-dashed text-muted-foreground hover:text-primary hover:border-primary"
            style={{ borderColor: "var(--border)", transition: "all 0.15s" }}
          >
            <span style={{ fontSize: "1.7rem", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Plus size={22} />
            </span>
            <span style={{ fontWeight: 600, fontSize: "1rem" }}>{t.habits.addHabit}</span>
          </button>
          {/* Invisible spacer matching the delete button so widths align */}
          <div className="flex-shrink-0 p-2" style={{ width: 32 }} aria-hidden="true" />
        </div>
      )}
    </div>
  );
}
