import { useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useToday } from "../hooks/useToday";
import { useLang } from "../i18n/LangContext";
import { Reorder } from "motion/react";
import { Plus, X, Check } from "lucide-react";
import { ReorderRow } from "./ui/ReorderRow";
import { IconButton } from "./ui/IconButton";

export interface ImportantDateEntry {
  id: string;
  name: string;
  emoji: string;
  date: string; // "YYYY-MM-DD" — anchor date; for yearly entries only month/day are reused
  repeatsYearly: boolean;
}

const EMOJI_SUGGESTIONS = [
  "🎂", "🎉", "💍", "✈️", "🎓", "💊", "🏥", "🌟", "❤️", "🕯️", "📅",
];

const EMOJI_LABELS: Record<string, string> = {
  "🎂": "Birthday cake", "🎉": "Party popper", "💍": "Ring", "✈️": "Airplane",
  "🎓": "Graduation cap", "💊": "Medication", "🏥": "Hospital", "🌟": "Star",
  "❤️": "Heart", "🕯️": "Candle", "📅": "Calendar",
};

function generateId() {
  return `date-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function parseDateKey(dateKey: string): Date {
  const [y, m, d] = dateKey.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function daysBetween(from: Date, to: Date): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  const a = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const b = new Date(to.getFullYear(), to.getMonth(), to.getDate());
  return Math.round((b.getTime() - a.getTime()) / msPerDay);
}

interface DateStatus {
  daysUntil: number | null; // 0 = today, >0 = upcoming
  daysSince: number | null; // >0 = days elapsed since a past, non-repeating date
}

function getDateStatus(entry: ImportantDateEntry, todayKey: string): DateStatus {
  const today = parseDateKey(todayKey);
  const anchor = parseDateKey(entry.date);

  if (entry.repeatsYearly) {
    let next = new Date(today.getFullYear(), anchor.getMonth(), anchor.getDate());
    if (daysBetween(today, next) < 0) {
      next = new Date(today.getFullYear() + 1, anchor.getMonth(), anchor.getDate());
    }
    return { daysUntil: daysBetween(today, next), daysSince: null };
  }

  const diff = daysBetween(anchor, today);
  if (diff <= 0) return { daysUntil: -diff, daysSince: null };
  return { daysUntil: null, daysSince: diff };
}

function formatStatus(status: DateStatus, t: ReturnType<typeof useLang>["dates"]): string {
  if (status.daysUntil === 0) return t.today;
  if (status.daysUntil !== null) {
    const unit = status.daysUntil === 1 ? t.day : t.days;
    return `${t.inPrefix} ${status.daysUntil} ${unit}`;
  }
  if (status.daysSince !== null) {
    const unit = status.daysSince === 1 ? t.day : t.days;
    return `${status.daysSince} ${unit} ${t.agoSuffix}`;
  }
  return "";
}

export function ImportantDates() {
  const t = useLang();
  const d = t.dates;
  const [dates, setDates] = useLocalStorage<ImportantDateEntry[]>("steady-important-dates", []);
  const [showForm, setShowForm] = useState(false);
  const [newEmoji, setNewEmoji] = useState("🎂");
  const [newName, setNewName] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newRepeats, setNewRepeats] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmoji, setEditEmoji] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editRepeats, setEditRepeats] = useState(true);
  const today = useToday();

  const deleteDate = (id: string) => {
    setDates((prev) => prev.filter((entry) => entry.id !== id));
  };

  const startEditing = (entry: ImportantDateEntry) => {
    setEditingId(entry.id);
    setEditName(entry.name);
    setEditEmoji(entry.emoji);
    setEditDate(entry.date);
    setEditRepeats(entry.repeatsYearly);
  };

  const saveEdit = (id: string) => {
    const name = editName.trim();
    if (!name || !editDate) return;
    setDates((prev) =>
      prev.map((entry) =>
        entry.id === id
          ? { ...entry, name, emoji: editEmoji || "📅", date: editDate, repeatsYearly: editRepeats }
          : entry,
      ),
    );
    setEditingId(null);
  };

  const addDate = () => {
    const name = newName.trim();
    if (!name || !newDate) return;
    setDates((prev) => [
      ...prev,
      { id: generateId(), name, emoji: newEmoji, date: newDate, repeatsYearly: newRepeats },
    ]);
    setNewName("");
    setNewEmoji("🎂");
    setNewDate("");
    setNewRepeats(true);
    setShowForm(false);
  };

  return (
    <div className="steady-card bg-card rounded-2xl p-5 border border-border">
      <h3 className="mb-1 text-foreground">{d.heading}</h3>
      <p className="text-muted-foreground mb-4" style={{ fontSize: "0.95rem" }}>
        {d.description}
      </p>

      {dates.length === 0 && !showForm && (
        <div className="text-center py-6 space-y-1">
          <p className="text-foreground" style={{ fontWeight: 700 }}>{d.emptyTitle}</p>
          <p className="text-muted-foreground" style={{ fontSize: "0.88rem" }}>{d.emptySubtitle}</p>
        </div>
      )}

      <Reorder.Group axis="y" values={dates} onReorder={setDates} className="space-y-2 mb-3">
        {dates.map((entry) => {
          const status = getDateStatus(entry, today);
          return (
            <ReorderRow key={entry.id} value={entry} dragDisabled={editingId === entry.id}>
              <div className="relative flex-1 min-w-0">
                {editingId === entry.id ? (
                  <div className="flex flex-col gap-2 p-3 pr-20 rounded-xl border-2 border-primary bg-input-background">
                    <div className="flex items-center gap-2">
                      <input aria-label={d.emojiLabel} value={editEmoji} onChange={(e) => setEditEmoji(e.target.value)} className="w-10 bg-transparent text-center outline-none" style={{ fontSize: "1.5rem" }} maxLength={2} />
                      <input autoFocus value={editName} onChange={(e) => setEditName(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") saveEdit(entry.id); if (e.key === "Escape") setEditingId(null); }} className="flex-1 min-w-0 bg-transparent text-foreground outline-none" />
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <input
                        type="date"
                        value={editDate}
                        onChange={(e) => setEditDate(e.target.value)}
                        className="rounded-lg px-2 py-1.5 border border-border bg-input-background text-foreground outline-none"
                        style={{ fontSize: "0.85rem" }}
                      />
                      <button
                        onClick={() => setEditRepeats((r) => !r)}
                        aria-pressed={editRepeats}
                        className="rounded-lg px-2.5 py-1.5 border-2"
                        style={{
                          fontSize: "0.8rem", fontWeight: 600,
                          borderColor: editRepeats ? "var(--primary)" : "var(--border)",
                          backgroundColor: editRepeats ? "var(--green-bg)" : "transparent",
                          color: editRepeats ? "var(--green-text)" : "var(--foreground)",
                        }}
                      >
                        {d.repeatsYearly}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    className="w-full flex items-center gap-3 p-3 pr-24 rounded-xl"
                    style={{ backgroundColor: "var(--surface-1)" }}
                  >
                    <span style={{ fontSize: "1.7rem", flexShrink: 0 }}>{entry.emoji}</span>
                    <span className="flex-1 text-foreground min-w-0 truncate" style={{ fontWeight: 600 }}>
                      {entry.name}
                    </span>
                    <span
                      className="rounded-full px-3 py-1 flex-shrink-0"
                      style={{ backgroundColor: "var(--yellow-bg)", color: "var(--yellow-text)", fontSize: "0.8rem", fontWeight: 700, whiteSpace: "nowrap" }}
                    >
                      {formatStatus(status, d)}
                    </span>
                  </div>
                )}

                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
                  <IconButton size="pill" tone="primary" onClick={() => editingId === entry.id ? saveEdit(entry.id) : startEditing(entry)} style={{ fontSize: "0.78rem", fontWeight: 700 }} aria-label={`${editingId === entry.id ? d.saveEdit : d.edit}: ${entry.name}`}>{editingId === entry.id ? <Check size={15} /> : d.editLabel}</IconButton>
                  <IconButton tone="destructive" onClick={() => deleteDate(entry.id)} aria-label={`${d.deleteDate}: ${entry.name}`}><X size={15} /></IconButton>
                </div>
              </div>
            </ReorderRow>
          );
        })}
      </Reorder.Group>

      {showForm ? (
        <div
          className="rounded-2xl p-4 border-2 space-y-3"
          style={{ borderColor: "var(--primary)", backgroundColor: "var(--surface-1)" }}
        >
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
                    width: 44, height: 44, fontSize: "1.3rem",
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

          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder={d.namePlaceholder}
            className="w-full rounded-xl px-4 py-3 border border-border bg-input-background text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
            style={{ transition: "border-color 0.15s" }}
          />

          <div className="flex items-center gap-2 flex-wrap">
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              aria-label={d.dateLabel}
              className="rounded-xl px-3 py-2.5 border border-border bg-input-background text-foreground outline-none focus:border-primary"
              style={{ fontSize: "0.9rem" }}
            />
            <button
              onClick={() => setNewRepeats((r) => !r)}
              aria-pressed={newRepeats}
              className="rounded-xl px-3 py-2.5 border-2"
              style={{
                fontSize: "0.85rem", fontWeight: 600,
                borderColor: newRepeats ? "var(--primary)" : "var(--border)",
                backgroundColor: newRepeats ? "var(--green-bg)" : "transparent",
                color: newRepeats ? "var(--green-text)" : "var(--foreground)",
                transition: "all 0.15s",
              }}
            >
              {d.repeatsYearly}
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={addDate}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3 bg-primary text-primary-foreground hover:opacity-90"
              style={{ fontWeight: 700, transition: "opacity 0.15s" }}
            >
              <Check size={16} />
              {d.addDate}
            </button>
            <button
              onClick={() => { setShowForm(false); setNewName(""); setNewEmoji("🎂"); setNewDate(""); setNewRepeats(true); }}
              className="rounded-xl px-4 py-3 border border-border text-foreground hover:bg-muted"
              style={{ fontWeight: 600, transition: "background-color 0.15s" }}
            >
              {d.cancel}
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
          <span style={{ fontWeight: 600, fontSize: "1rem" }}>{d.addDate}</span>
        </button>
      )}
    </div>
  );
}
