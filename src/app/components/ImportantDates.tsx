import { useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useToday } from "../hooks/useToday";
import { useLang } from "../i18n/LangContext";
import { Reorder } from "motion/react";
import { Plus, X, Check, Pencil, ChevronLeft, ChevronRight, List, CalendarDays } from "lucide-react";
import { ReorderRow } from "./ui/ReorderRow";
import { IconButton } from "./ui/IconButton";
import { PictogramPicker } from "./ui/PictogramPicker";

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

function generateId() {
  return `date-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function parseDateKey(dateKey: string): Date {
  const [y, m, d] = dateKey.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function daysBetween(from: Date, to: Date): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  const a = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const b = new Date(to.getFullYear(), to.getMonth(), to.getDate());
  return Math.round((b.getTime() - a.getTime()) / msPerDay);
}

export interface DateStatus {
  daysUntil: number | null; // 0 = today, >0 = upcoming
  daysSince: number | null; // >0 = days elapsed since a past, non-repeating date
}

export function getDateStatus(entry: ImportantDateEntry, todayKey: string): DateStatus {
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

function toDateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// Yearly entries match any year on the same month/day; one-off entries only match their
// exact date, so an old birthday from a past year doesn't keep lighting up every month view.
function entriesOnDay(dates: ImportantDateEntry[], cellDate: Date): ImportantDateEntry[] {
  return dates.filter((entry) => {
    const anchor = parseDateKey(entry.date);
    if (entry.repeatsYearly) {
      return anchor.getMonth() === cellDate.getMonth() && anchor.getDate() === cellDate.getDate();
    }
    return (
      anchor.getFullYear() === cellDate.getFullYear() &&
      anchor.getMonth() === cellDate.getMonth() &&
      anchor.getDate() === cellDate.getDate()
    );
  });
}

// Monday-first grid (matching the mood history strip elsewhere in the app), padded with
// null leading/trailing cells so every row is a full week.
function buildMonthGrid(monthCursor: Date): (Date | null)[] {
  const first = new Date(monthCursor.getFullYear(), monthCursor.getMonth(), 1);
  const firstWeekday = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(monthCursor.getFullYear(), monthCursor.getMonth() + 1, 0).getDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) cells.push(new Date(monthCursor.getFullYear(), monthCursor.getMonth(), day));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
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
  const [view, setView] = useState<"list" | "calendar">("list");
  const [monthCursor, setMonthCursor] = useState(() => parseDateKey(today));
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const monthGrid = buildMonthGrid(monthCursor);
  const monthLabel = monthCursor.toLocaleDateString(t.dateLocale, { month: "long", year: "numeric" });
  const selectedEntries = selectedDay ? entriesOnDay(dates, parseDateKey(selectedDay)) : [];

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
      <h2 className="mb-1 text-foreground text-lg">{d.heading}</h2>
      <p className="text-muted-foreground mb-4" style={{ fontSize: "0.95rem" }}>
        {d.description}
      </p>

      {dates.length > 0 && (
        <div className="flex gap-1 mb-4 p-1 rounded-xl" style={{ backgroundColor: "var(--surface-1)", width: "fit-content" }} role="group" aria-label={d.viewToggleLabel}>
          {(["list", "calendar"] as const).map((option) => (
            <button
              key={option}
              onClick={() => setView(option)}
              aria-pressed={view === option}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5"
              style={{
                fontSize: "0.85rem",
                fontWeight: view === option ? 700 : 500,
                backgroundColor: view === option ? "var(--card)" : "transparent",
                color: view === option ? "var(--foreground)" : "var(--muted-foreground)",
                boxShadow: view === option ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
                transition: "all 0.15s",
              }}
            >
              {option === "list" ? <List size={14} /> : <CalendarDays size={14} />}
              {option === "list" ? d.viewList : d.viewCalendar}
            </button>
          ))}
        </div>
      )}

      {dates.length === 0 && !showForm && (
        <div className="text-center py-6 space-y-1">
          <p className="text-foreground" style={{ fontWeight: 700 }}>{d.emptyTitle}</p>
          <p className="text-muted-foreground" style={{ fontSize: "0.88rem" }}>{d.emptySubtitle}</p>
        </div>
      )}

      {dates.length > 0 && view === "calendar" && (
        <div className="mb-4 rounded-xl border border-border p-3" style={{ backgroundColor: "var(--surface-1)" }}>
          <div className="flex items-center justify-between mb-3">
            <IconButton size="md" onClick={() => { setMonthCursor((c) => new Date(c.getFullYear(), c.getMonth() - 1, 1)); setSelectedDay(null); }} aria-label={d.prevMonth}>
              <ChevronLeft size={16} />
            </IconButton>
            <p className="text-foreground" style={{ fontWeight: 700, fontSize: "0.95rem" }}>{monthLabel}</p>
            <IconButton size="md" onClick={() => { setMonthCursor((c) => new Date(c.getFullYear(), c.getMonth() + 1, 1)); setSelectedDay(null); }} aria-label={d.nextMonth}>
              <ChevronRight size={16} />
            </IconButton>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-1">
            {t.moodHistory.days.map((label) => (
              <span key={label} className="text-center text-muted-foreground" style={{ fontSize: "0.68rem", fontWeight: 700 }}>
                {label}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {monthGrid.map((cellDate, i) => {
              if (!cellDate) return <div key={i} aria-hidden="true" />;
              const cellKey = toDateKey(cellDate);
              const dayEntries = entriesOnDay(dates, cellDate);
              const isToday = cellKey === today;
              const isSelected = cellKey === selectedDay;
              return (
                <button
                  key={i}
                  onClick={() => setSelectedDay(cellKey === selectedDay ? null : cellKey)}
                  className="rounded-lg flex flex-col items-center justify-center gap-0.5"
                  style={{
                    aspectRatio: "1",
                    backgroundColor: isSelected ? "var(--green-bg)" : isToday ? "var(--card)" : "transparent",
                    border: isToday ? "2px solid var(--primary)" : "2px solid transparent",
                    transition: "all 0.15s",
                  }}
                  aria-pressed={isSelected}
                  aria-label={dayEntries.length > 0 ? `${cellDate.getDate()}: ${dayEntries.map((e) => e.name).join(", ")}` : String(cellDate.getDate())}
                >
                  <span style={{ fontSize: "0.78rem", fontWeight: isToday ? 800 : 500, color: isToday ? "var(--primary)" : "var(--foreground)" }}>
                    {cellDate.getDate()}
                  </span>
                  {dayEntries.length > 0 && (
                    <span aria-hidden="true" style={{ fontSize: "0.65rem", lineHeight: 1 }}>
                      {dayEntries.slice(0, 2).map((e) => e.emoji).join("")}
                      {dayEntries.length > 2 ? `+${dayEntries.length - 2}` : ""}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          {selectedDay && (
            <div className="mt-3 pt-3 border-t border-border space-y-1.5">
              {selectedEntries.length === 0 ? (
                <p className="text-muted-foreground" style={{ fontSize: "0.85rem" }}>{d.noDatesThisDay}</p>
              ) : (
                selectedEntries.map((entry) => (
                  <div key={entry.id} className="flex items-center gap-2">
                    <span aria-hidden="true" style={{ fontSize: "1.1rem" }}>{entry.emoji}</span>
                    <span className="text-foreground" style={{ fontSize: "0.9rem" }}>{entry.name}</span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {view === "list" && (
      <Reorder.Group axis="y" values={dates} onReorder={setDates} className="space-y-2 mb-3">
        {dates.map((entry) => {
          const status = getDateStatus(entry, today);
          return (
            <ReorderRow key={entry.id} value={entry} values={dates} onReorder={setDates} moveUpLabel={t.common.moveUp} moveDownLabel={t.common.moveDown} dragDisabled={editingId === entry.id}>
              <div className="flex-1 min-w-0">
                {editingId === entry.id ? (
                  <div className="flex flex-col gap-2 p-3 rounded-xl border-2 border-primary bg-input-background">
                    <div className="flex items-center gap-2">
                      <input aria-label={d.emojiLabel} value={editEmoji} onChange={(e) => setEditEmoji(e.target.value)} className="w-10 flex-shrink-0 bg-transparent text-center outline-none focus:ring-2 focus:ring-inset focus:ring-primary rounded-lg" style={{ fontSize: "1.5rem" }} maxLength={2} />
                      <input autoFocus value={editName} onChange={(e) => setEditName(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") saveEdit(entry.id); if (e.key === "Escape") setEditingId(null); }} className="flex-1 min-w-0 bg-transparent text-foreground outline-none focus:ring-2 focus:ring-inset focus:ring-primary rounded-lg" />
                      <div className="flex items-center gap-0.5 flex-shrink-0">
                        <IconButton size="pill" tone="primary" onClick={() => saveEdit(entry.id)} style={{ fontSize: "0.78rem", fontWeight: 700 }} aria-label={`${d.saveEdit}: ${entry.name}`}><Check size={15} /></IconButton>
                        <IconButton tone="destructive" onClick={() => deleteDate(entry.id)} aria-label={`${d.deleteDate}: ${entry.name}`}><X size={15} /></IconButton>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <input
                        type="date"
                        value={editDate}
                        onChange={(e) => setEditDate(e.target.value)}
                        className="rounded-lg px-2 py-1.5 border border-border bg-input-background text-foreground outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
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
                    className="w-full flex items-center gap-2 p-3 rounded-xl flex-wrap sm:flex-nowrap"
                    style={{ backgroundColor: "var(--surface-1)" }}
                  >
                    <span style={{ fontSize: "1.7rem", flexShrink: 0 }}>{entry.emoji}</span>
                    {/* flexBasis reserves enough room that the badge/edit/delete wrap below
                        instead of squeezing the name down to a couple of characters. */}
                    <span
                      className="flex-1 text-foreground min-w-0 truncate"
                      style={{ fontWeight: 600, flexBasis: 140 }}
                    >
                      {entry.name}
                    </span>
                    <span
                      className="rounded-full px-3 py-1 flex-shrink-0"
                      style={{ backgroundColor: "var(--yellow-bg)", color: "var(--yellow-text)", fontSize: "0.8rem", fontWeight: 700, whiteSpace: "nowrap" }}
                    >
                      {formatStatus(status, d)}
                    </span>
                    <div className="flex items-center gap-0.5 flex-shrink-0">
                      <IconButton size="pill" tone="primary" onClick={() => startEditing(entry)} style={{ fontSize: "0.78rem", fontWeight: 700 }} aria-label={`${d.edit}: ${entry.name}`}>
                        <Pencil size={14} className="sm:hidden" />
                        <span className="hidden sm:inline">{d.editLabel}</span>
                      </IconButton>
                      <IconButton tone="destructive" onClick={() => deleteDate(entry.id)} aria-label={`${d.deleteDate}: ${entry.name}`}><X size={15} /></IconButton>
                    </div>
                  </div>
                )}
              </div>
            </ReorderRow>
          );
        })}
      </Reorder.Group>
      )}

      {showForm ? (
        <div
          className="rounded-2xl p-4 border-2 space-y-3"
          style={{ borderColor: "var(--primary)", backgroundColor: "var(--surface-1)" }}
        >
          <PictogramPicker value={newEmoji} onChange={setNewEmoji} suggestions={EMOJI_SUGGESTIONS} labels={d.emojiLabels} />

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
