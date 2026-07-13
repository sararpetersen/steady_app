import { useEffect, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useToday } from "../hooks/useToday";
import { useLang } from "../i18n/LangContext";
import { Sprout, Leaf, Flower2, TreeDeciduous, Plus, X, Check, ChevronUp, ChevronDown } from "lucide-react";

export interface Habit {
  id: string;
  name: string;
  emoji: string;
  totalCompletions: number;
  doneToday: boolean;
  lastCompletedDate?: string; // "YYYY-MM-DD" — legacy entries may predate this field
}

// Growth never regresses — a missed day just doesn't add to the count, nothing is lost.
const GROWTH_STAGES = [
  { min: 0, icon: Sprout, label: "Seed" },
  { min: 3, icon: Leaf, label: "Sprouting" },
  { min: 10, icon: Flower2, label: "Blooming" },
  { min: 25, icon: TreeDeciduous, label: "Flourishing" },
] as const;

function getGrowthStage(totalCompletions: number): (typeof GROWTH_STAGES)[number] {
  let stage: (typeof GROWTH_STAGES)[number] = GROWTH_STAGES[0];
  for (const s of GROWTH_STAGES) {
    if (totalCompletions >= s.min) stage = s;
  }
  return stage;
}

const EMOJI_SUGGESTIONS = [
  "💧","🚶","📵","📝","🏃","😴","🥗","🧘","📚","💊",
  "🎵","🌳","☀️","🍎","💪","🧹","🎯","✍️","🫧","🌿",
];

const EMOJI_LABELS: Record<string, string> = {
  "💧": "Water drop", "🚶": "Walking", "📵": "No phone", "📝": "Notepad",
  "🏃": "Running", "😴": "Sleeping", "🥗": "Salad", "🧘": "Meditating",
  "📚": "Books", "💊": "Medication", "🎵": "Music", "🌳": "Tree",
  "☀️": "Sun", "🍎": "Apple", "💪": "Strength", "🧹": "Cleaning",
  "🎯": "Target", "✍️": "Writing", "🫧": "Bubbles", "🌿": "Herb",
};

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

const DEFAULT_HABITS: Habit[] = [
  { id: "water", name: "Drink 8 glasses of water", emoji: "💧", totalCompletions: 0, doneToday: false },
  { id: "move", name: "Move my body", emoji: "🚶", totalCompletions: 0, doneToday: false },
  { id: "screens", name: "No screens 1 hr before bed", emoji: "📵", totalCompletions: 0, doneToday: false },
  { id: "journal", name: "Journal or gratitude note", emoji: "📝", totalCompletions: 0, doneToday: false },
];

export function HabitTracker() {
  const t = useLang();
  const [habits, setHabits] = useLocalStorage<Habit[]>("steady-habits-v2", []);
  const [showForm, setShowForm] = useState(false);
  const [newEmoji, setNewEmoji] = useState("🎯");
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmoji, setEditEmoji] = useState("");
  const today = useToday();

  // Reset doneToday when the day rolls over, so habits start fresh each day.
  useEffect(() => {
    setHabits((prev) => {
      let changed = false;
      const next = prev.map((h) => {
        if (h.doneToday && h.lastCompletedDate !== today) {
          changed = true;
          return { ...h, doneToday: false };
        }
        return h;
      });
      return changed ? next : prev;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [today]);

  const toggle = (id: string) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h;
        const current = h.totalCompletions ?? 0; // legacy entries may predate this field
        const nowDone = !h.doneToday;
        return {
          ...h,
          doneToday: nowDone,
          lastCompletedDate: nowDone ? today : h.lastCompletedDate,
          totalCompletions: nowDone ? current + 1 : Math.max(0, current - 1),
        };
      })
    );
  };

  const deleteHabit = (id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  };

  const moveHabit = (index: number, offset: -1 | 1) => {
    setHabits((prev) => {
      const nextIndex = index + offset;
      if (nextIndex < 0 || nextIndex >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return next;
    });
  };

  const startEditing = (habit: Habit) => {
    setEditingId(habit.id);
    setEditName(habit.name);
    setEditEmoji(habit.emoji);
  };

  const saveEdit = (id: string) => {
    const name = editName.trim();
    if (!name) return;
    setHabits((prev) => prev.map((habit) => habit.id === id ? { ...habit, name, emoji: editEmoji || "🎯" } : habit));
    setEditingId(null);
  };

  const addHabit = () => {
    const name = newName.trim();
    if (!name) return;
    setHabits((prev) => [
      ...prev,
      { id: generateId(), name, emoji: newEmoji, totalCompletions: 0, doneToday: false },
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
        <div className="text-center py-6 space-y-1">
          <p className="text-foreground" style={{ fontWeight: 700 }}>{t.habits.emptyTitle}</p>
          <p className="text-muted-foreground" style={{ fontSize: "0.88rem" }}>{t.habits.emptySubtitle}</p>
        </div>
      )}

      <div className="space-y-2 mb-3">
        {habits.map((habit, index) => {
          const totalCompletions = habit.totalCompletions ?? 0; // legacy entries may predate this field
          const stage = getGrowthStage(totalCompletions);
          const StageIcon = stage.icon;
          return (
          <div key={habit.id} className="flex items-center gap-1 group">
            <div className="flex flex-col flex-shrink-0 gap-0.5">
              <button onClick={() => moveHabit(index, -1)} disabled={index === 0} className="p-1.5 rounded-lg text-muted-foreground disabled:opacity-25 hover:bg-muted" aria-label={`${t.habits.moveUp}: ${habit.name}`}><ChevronUp size={16} /></button>
              <button onClick={() => moveHabit(index, 1)} disabled={index === habits.length - 1} className="p-1.5 rounded-lg text-muted-foreground disabled:opacity-25 hover:bg-muted" aria-label={`${t.habits.moveDown}: ${habit.name}`}><ChevronDown size={16} /></button>
            </div>
            <div className="relative flex-1 min-w-0">
            {/* Main tap area — full width */}
            {editingId === habit.id ? (
              <div className="flex items-center gap-2 p-3 pr-20 rounded-xl border-2 border-primary bg-input-background">
                <input aria-label={t.habits.emojiLabel} value={editEmoji} onChange={(e) => setEditEmoji(e.target.value)} className="w-10 bg-transparent text-center outline-none" style={{ fontSize: "1.5rem" }} maxLength={2} />
                <input autoFocus value={editName} onChange={(e) => setEditName(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") saveEdit(habit.id); if (e.key === "Escape") setEditingId(null); }} className="flex-1 min-w-0 bg-transparent text-foreground outline-none" />
              </div>
            ) : (
            <button
              onClick={() => toggle(habit.id)}
              className="w-full flex items-center gap-3 p-3 pr-24 rounded-xl hover:opacity-90 text-left"
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
                <StageIcon size={15} style={{ color: "var(--primary)" }} aria-hidden="true" />
                <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--primary)" }}>
                  {totalCompletions}
                </span>
                <span className="sr-only">{stage.label} stage, {totalCompletions} total completions</span>
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
            )}

            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
              <button onClick={() => editingId === habit.id ? saveEdit(habit.id) : startEditing(habit)} className="px-2.5 py-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-muted flex items-center justify-center" style={{ fontSize: "0.78rem", fontWeight: 700 }} aria-label={`${editingId === habit.id ? t.habits.saveEdit : t.habits.edit}: ${habit.name}`}>{editingId === habit.id ? <Check size={15} /> : t.habits.editLabel}</button>
              <button onClick={() => deleteHabit(habit.id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-muted" aria-label={`${t.habits.deleteHabit}: ${habit.name}`}><X size={15} /></button>
            </div>
            </div>
          </div>
          );
        })}
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
                    width: 44,
                    height: 44,
                    fontSize: "1.3rem",
                    backgroundColor: newEmoji === e ? "var(--green-bg)" : "transparent",
                    border: newEmoji === e ? "2px solid var(--primary)" : "2px solid transparent",
                    transition: "all 0.15s",
                  }}
                  aria-label={EMOJI_LABELS[e] ?? e}
                  aria-pressed={newEmoji === e}
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
        <button
          onClick={() => setShowForm(true)}
          className="w-full flex items-center justify-center gap-2.5 p-3 rounded-xl border-2 border-dashed text-muted-foreground hover:text-primary hover:border-primary"
          style={{ borderColor: "var(--border)", transition: "all 0.15s" }}
        >
          <span style={{ fontSize: "1.7rem", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Plus size={22} />
          </span>
          <span style={{ fontWeight: 600, fontSize: "1rem" }}>{t.habits.addHabit}</span>
        </button>
      )}
    </div>
  );
}
