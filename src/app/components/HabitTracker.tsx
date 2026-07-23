import { useEffect, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useToday } from "../hooks/useToday";
import { useLang } from "../i18n/LangContext";
import { Reorder } from "motion/react";
import { Sprout, Plus, X, Check, StickyNote } from "lucide-react";
import { AnimatedCollapse } from "./AnimatedCollapse";
import { ReorderRow } from "./ui/ReorderRow";
import { IconButton } from "./ui/IconButton";

export interface Habit {
  id: string;
  name: string;
  emoji: string;
  totalCompletions: number;
  doneToday: boolean;
  lastCompletedDate?: string; // "YYYY-MM-DD" — legacy entries may predate this field
  note?: string; // optional freeform context, e.g. "doctor said 2L a day" — mirrors Reminders' note field
}

// Each habit is just a seed — the growth payoff lives in the Overview's daily tree, not here.

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
  const [editNote, setEditNote] = useState("");
  const today = useToday();

  // Let App.tsx's growth/celebration state know immediately — it reads this same
  // localStorage key but doesn't otherwise learn about changes made while this tab is open.
  useEffect(() => {
    window.dispatchEvent(new Event("steady-habits-changed"));
  }, [habits]);

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

  const startEditing = (habit: Habit) => {
    setEditingId(habit.id);
    setEditName(habit.name);
    setEditEmoji(habit.emoji);
    setEditNote(habit.note ?? "");
  };

  const saveEdit = (id: string) => {
    const name = editName.trim();
    if (!name) return;
    const note = editNote.trim();
    setHabits((prev) => prev.map((habit) => habit.id === id ? { ...habit, name, emoji: editEmoji || "🎯", note: note || undefined } : habit));
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
        <div className="text-center py-6">
          <img src="/sprout9.webp" alt="" aria-hidden="true" className="mx-auto mb-3" style={{ width: 88, height: 88, objectFit: "contain" }} />
          <div className="space-y-1">
            <p className="text-foreground" style={{ fontWeight: 700 }}>{t.habits.emptyTitle}</p>
            <p className="text-muted-foreground" style={{ fontSize: "0.88rem" }}>{t.habits.emptySubtitle}</p>
          </div>
        </div>
      )}

      <Reorder.Group axis="y" values={habits} onReorder={setHabits} className="space-y-2 mb-3">
        {habits.map((habit, index) => {
          const totalCompletions = habit.totalCompletions ?? 0; // legacy entries may predate this field
          return (
          <ReorderRow key={habit.id} value={habit} dragDisabled={editingId === habit.id}>
            <div className="flex-1 min-w-0">
            <div className="relative">
            {/* Main tap area — full width */}
            {editingId === habit.id ? (
              <div className="flex flex-col gap-2 p-3 pr-20 rounded-xl border-2 border-primary bg-input-background">
                <div className="flex items-center gap-2">
                  <input aria-label={t.habits.emojiLabel} value={editEmoji} onChange={(e) => setEditEmoji(e.target.value)} className="w-10 bg-transparent text-center outline-none" style={{ fontSize: "1.5rem" }} maxLength={2} />
                  <input autoFocus value={editName} onChange={(e) => setEditName(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) saveEdit(habit.id); if (e.key === "Escape") setEditingId(null); }} className="flex-1 min-w-0 bg-transparent text-foreground outline-none" />
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <StickyNote size={12} />
                  <span style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.02em" }}>{t.habits.noteLabel}</span>
                </div>
                <textarea
                  value={editNote}
                  onChange={(e) => setEditNote(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Escape") setEditingId(null); }}
                  placeholder={t.habits.notePlaceholder}
                  rows={2}
                  className="w-full bg-transparent text-foreground placeholder:text-muted-foreground outline-none resize-none"
                  style={{ fontSize: "0.9rem", lineHeight: 1.5 }}
                />
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
                <Sprout size={15} style={{ color: "var(--primary)" }} aria-hidden="true" />
                <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--primary)" }}>
                  {totalCompletions}
                </span>
                <span className="sr-only">{totalCompletions} total completions</span>
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
              {editingId === habit.id ? (
                <IconButton size="pill" tone="primary" onClick={() => saveEdit(habit.id)} style={{ fontSize: "0.78rem", fontWeight: 700 }} aria-label={`${t.habits.saveEdit}: ${habit.name}`}><Check size={15} /></IconButton>
              ) : (
                <IconButton size="pill" tone="primary" onClick={() => startEditing(habit)} style={{ fontSize: "0.78rem", fontWeight: 700 }} aria-label={`${t.habits.edit}: ${habit.name}`}>{t.habits.editLabel}</IconButton>
              )}
              <IconButton tone="destructive" onClick={() => deleteHabit(habit.id)} aria-label={`${t.habits.deleteHabit}: ${habit.name}`}><X size={15} /></IconButton>
            </div>
            </div>
            <AnimatedCollapse open={editingId !== habit.id && !!habit.note}>
              <button
                onClick={() => startEditing(habit)}
                className="mt-1.5 w-full flex items-start gap-1.5 px-3 py-2 rounded-xl border border-dashed text-left text-muted-foreground hover:text-foreground hover:border-primary"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--surface-1)", transition: "color 0.15s, border-color 0.15s" }}
                aria-label={`${t.habits.editNote}: ${habit.name}`}
              >
                <StickyNote size={12} className="flex-shrink-0 mt-0.5" style={{ color: "var(--primary)" }} />
                <span style={{ fontSize: "0.82rem", lineHeight: 1.4, whiteSpace: "pre-wrap" }}>{habit.note}</span>
              </button>
            </AnimatedCollapse>
            </div>
          </ReorderRow>
          );
        })}
      </Reorder.Group>

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
