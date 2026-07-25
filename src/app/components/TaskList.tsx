import { useState } from "react";
import { useLang } from "../i18n/LangContext";
import { useToday } from "../hooks/useToday";
import { Reorder } from "motion/react";
import { Plus, X, CheckCircle2, Check, Pencil, Repeat } from "lucide-react";
import { ReorderRow } from "./ui/ReorderRow";
import { IconButton } from "./ui/IconButton";

export type TaskRecurrence = "daily" | "weekly";

export interface Task {
  id: number;
  text: string;
  done: boolean;
  // Absent = one-off task, cleared once completed (existing behavior). When set, the
  // task is never removed at day rollover — it just resets to undone on its cadence
  // instead (see App.tsx's rollover effect).
  recurrence?: TaskRecurrence;
  // Which weekday (0 = Sunday ... 6 = Saturday) a "weekly" task resets on — defaults to
  // the day it was created, but can be moved to any other day (e.g. skip today, just
  // reschedule instead of leaving it undone).
  weeklyWeekday?: number;
}

interface Props {
  tasks: Task[];
  setTasks: (
    updater: Task[] | ((prev: Task[]) => Task[]),
  ) => void;
  nextId: number;
  setNextId: (
    updater: number | ((prev: number) => number),
  ) => void;
}

export function TaskList({
  tasks,
  setTasks,
  nextId,
  setNextId,
}: Props) {
  const t = useLang();
  const today = useToday();
  const todayWeekday = new Date(`${today}T00:00:00`).getDay();
  const [newText, setNewText] = useState("");
  const [newRecurrence, setNewRecurrence] = useState<TaskRecurrence | undefined>(undefined);
  const [newWeekday, setNewWeekday] = useState(todayWeekday);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [editRecurrence, setEditRecurrence] = useState<TaskRecurrence | undefined>(undefined);
  const [editWeekday, setEditWeekday] = useState(todayWeekday);

  const cycleRecurrence = (current: TaskRecurrence | undefined): TaskRecurrence | undefined => {
    if (current === undefined) return "daily";
    if (current === "daily") return "weekly";
    return undefined;
  };

  const recurrenceLabel = (recurrence: TaskRecurrence | undefined) => {
    if (recurrence === "daily") return t.tasks.repeatDaily;
    if (recurrence === "weekly") return t.tasks.repeatWeekly;
    return t.tasks.repeatNone;
  };

  const recurrenceBadge = (recurrence: TaskRecurrence | undefined) => {
    if (recurrence === "daily") return t.tasks.repeatDailyBadge;
    if (recurrence === "weekly") return t.tasks.repeatWeeklyBadge;
    return null;
  };

  const WeekdayPicker = ({ value, onChange }: { value: number; onChange: (day: number) => void }) => (
    <div className="flex items-center gap-1 flex-wrap" role="group" aria-label={t.tasks.repeatWeekly}>
      {t.tasks.weekdaysShort.map((label, day) => (
        <button
          key={day}
          type="button"
          onClick={() => onChange(day)}
          aria-pressed={value === day}
          aria-label={t.tasks.weekdaysFull[day]}
          className="rounded-full flex items-center justify-center hover:opacity-85 flex-shrink-0"
          style={{
            width: 36,
            height: 36,
            fontSize: "0.75rem",
            fontWeight: 700,
            backgroundColor: value === day ? "var(--primary)" : "var(--surface-1)",
            color: value === day ? "var(--primary-foreground)" : "var(--muted-foreground)",
            transition: "all 0.15s",
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );

  const toggle = (id: number) =>
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task,
      ),
    );

  const remove = (id: number) =>
    setTasks((prev) => prev.filter((task) => task.id !== id));

  const startEditing = (task: Task) => {
    setEditingId(task.id);
    setEditText(task.text);
    setEditRecurrence(task.recurrence);
    setEditWeekday(task.weeklyWeekday ?? todayWeekday);
  };

  const saveEdit = (id: number) => {
    const text = editText.trim();
    if (!text) return;
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              text,
              recurrence: editRecurrence,
              weeklyWeekday: editRecurrence === "weekly" ? editWeekday : undefined,
            }
          : task,
      ),
    );
    setEditingId(null);
  };

  const add = () => {
    const trimmed = newText.trim();
    if (!trimmed) return;
    setTasks((prev) => [
      ...prev,
      {
        id: nextId,
        text: trimmed,
        done: false,
        recurrence: newRecurrence,
        weeklyWeekday: newRecurrence === "weekly" ? newWeekday : undefined,
      },
    ]);
    setNextId((n) => n + 1);
    setNewText("");
    setNewRecurrence(undefined);
    setNewWeekday(todayWeekday);
  };

  const remaining = tasks.filter((task) => !task.done).length;

  // Completed tasks sink to the bottom instead of staying scattered wherever
  // they were checked off — sort is stable, so drag order within each group holds.
  const sortedTasks = [...tasks].sort((a, b) => Number(a.done) - Number(b.done));
  const firstCompletedIndex = sortedTasks.findIndex((task) => task.done);

  return (
    <div className="steady-card bg-card rounded-2xl p-5 border border-border">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-foreground">{t.tasks.heading}</h3>
        {tasks.length > 0 && (
          remaining === 0 ? (
            <span
              className="rounded-full px-3 py-1 flex items-center gap-1.5"
              style={{ backgroundColor: "var(--green-bg)", color: "var(--green-text)", fontSize: "0.85rem", fontWeight: 700 }}
            >
              <CheckCircle2 size={14} />
              {t.tasks.allDone}
            </span>
          ) : (
            <span
              className="rounded-full px-3 py-1"
              style={{ backgroundColor: "var(--green-bg)", color: "var(--green-text)", fontSize: "0.85rem", fontWeight: 700 }}
            >
              {remaining} {t.tasks.left}
            </span>
          )
        )}
      </div>
      <p
        className="text-muted-foreground mb-4 text-sm sm:text-base"
      >
        {t.tasks.description}
      </p>

      {tasks.length === 0 && (
        <div className="text-center py-6">
          <img src="/sprout6.webp" alt="" aria-hidden="true" className="mx-auto mb-3" style={{ width: 72, height: 72, objectFit: "contain" }} />
          <div className="space-y-1">
            <p className="text-foreground" style={{ fontWeight: 700 }}>{t.tasks.emptyTitle}</p>
            <p className="text-muted-foreground" style={{ fontSize: "0.88rem" }}>{t.tasks.emptySubtitle}</p>
          </div>
        </div>
      )}

      <Reorder.Group axis="y" values={sortedTasks} onReorder={setTasks} className="space-y-2 mb-4">
        {sortedTasks.map((task, index) => (
          <div key={task.id}>
            {task.done && index === firstCompletedIndex && (
              <p
                className="text-muted-foreground"
                style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", margin: "12px 0 8px 4px" }}
              >
                {t.tasks.completedHeading}
              </p>
            )}
          <ReorderRow
            value={task}
            dragDisabled={editingId === task.id}
            className="flex items-center gap-1 rounded-xl hover:brightness-95"
            style={{
              backgroundColor: task.done
                ? "var(--green-bg)"
                : "var(--surface-1)",
            }}
          >
            <button
              onClick={() => toggle(task.id)}
              className="flex-shrink-0 rounded-full flex items-center justify-center"
              style={{ width: 44, height: 44 }}
              aria-label={
                task.done
                  ? t.tasks.markIncomplete
                  : t.tasks.markComplete
              }
            >
              <span
                className="rounded-full border-2 flex items-center justify-center"
                style={{
                  width: 28,
                  height: 28,
                  borderColor: task.done
                    ? "var(--primary)"
                    : "var(--muted-foreground)",
                  backgroundColor: task.done
                    ? "var(--primary)"
                    : "transparent",
                  transition: "background-color 0.2s, border-color 0.2s",
                }}
              >
                {task.done && (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                  >
                    <path
                      d="M2.5 7L5.5 10L11.5 4"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </span>
            </button>
            {editingId === task.id ? (
              <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5">
                  <input autoFocus value={editText} onChange={(e) => setEditText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") saveEdit(task.id); if (e.key === "Escape") setEditingId(null); }} className="flex-1 min-w-0 rounded-lg px-2 py-1 border border-primary bg-input-background text-foreground outline-none" />
                  <button
                    onClick={() => setEditRecurrence((r) => cycleRecurrence(r))}
                    className="flex-shrink-0 rounded-lg p-1.5 border-2 hover:opacity-85"
                    style={{
                      borderColor: editRecurrence ? "var(--primary)" : "var(--border)",
                      backgroundColor: editRecurrence ? "var(--green-bg)" : "transparent",
                      color: editRecurrence ? "var(--green-text)" : "var(--muted-foreground)",
                      transition: "all 0.15s",
                    }}
                    aria-label={recurrenceLabel(editRecurrence)}
                    title={recurrenceLabel(editRecurrence)}
                  >
                    <Repeat size={14} aria-hidden="true" />
                  </button>
                </div>
                {editRecurrence === "weekly" && <WeekdayPicker value={editWeekday} onChange={setEditWeekday} />}
              </div>
            ) : (
              <span className="flex-1 min-w-0 flex items-center gap-1.5" style={{ wordBreak: "break-word" }}>
                <span
                  style={{
                    color: task.done ? "var(--green-text)" : "var(--foreground)",
                    textDecoration: task.done ? "line-through" : "none",
                    opacity: task.done ? 0.75 : 1,
                  }}
                >
                  {task.text}
                </span>
                {task.recurrence && (
                  <span
                    className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 flex-shrink-0"
                    style={{ backgroundColor: "var(--surface-2)", color: "var(--muted-foreground)", fontSize: "0.7rem", fontWeight: 700 }}
                    title={recurrenceLabel(task.recurrence)}
                  >
                    <Repeat size={10} aria-hidden="true" />
                    {recurrenceBadge(task.recurrence)}
                  </span>
                )}
              </span>
            )}
            <div className="flex items-center gap-1 flex-shrink-0 pr-1">
              <IconButton size="pill" tone="primary" onClick={() => editingId === task.id ? saveEdit(task.id) : startEditing(task)} style={{ fontSize: "0.78rem", fontWeight: 700 }} aria-label={`${editingId === task.id ? t.tasks.saveEdit : t.tasks.edit}: ${task.text}`}>
                {editingId === task.id ? (
                  <Check size={16} />
                ) : (
                  <>
                    <Pencil size={14} className="sm:hidden" />
                    <span className="hidden sm:inline">{t.tasks.editLabel}</span>
                  </>
                )}
              </IconButton>
            <IconButton
              size="md"
              tone="destructive"
              onClick={() => remove(task.id)}
              aria-label={`${t.tasks.remove}: ${task.text}`}
            >
              <X size={16} />
            </IconButton>
            </div>
          </ReorderRow>
          </div>
        ))}
      </Reorder.Group>

      {tasks.length > 0 && remaining === 0 && (
        <div
          className="rounded-xl px-4 py-3 flex items-center gap-3 mb-4"
          style={{ backgroundColor: "var(--orange-bg)" }}
        >
          <CheckCircle2
            size={20}
            style={{
              color: "var(--orange-text)",
              flexShrink: 0,
            }}
          />
          <p
            style={{
              color: "var(--orange-text)",
              fontWeight: 700,
              fontSize: "0.95rem",
            }}
          >
            {t.tasks.allDoneMessage}
          </p>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add()}
            placeholder={t.tasks.placeholder}
            className="flex-1 min-w-0 rounded-xl px-4 py-3 border border-border bg-input-background text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
            style={{ transition: "border-color 0.15s" }}
          />
          <button
            onClick={() => setNewRecurrence((r) => cycleRecurrence(r))}
            className="rounded-xl px-3 py-3 border-2 flex items-center gap-1.5 hover:opacity-85 flex-shrink-0"
            style={{
              borderColor: newRecurrence ? "var(--primary)" : "var(--border)",
              backgroundColor: newRecurrence ? "var(--green-bg)" : "transparent",
              color: newRecurrence ? "var(--green-text)" : "var(--muted-foreground)",
              fontWeight: 700,
              fontSize: "0.8rem",
              transition: "all 0.15s",
            }}
            aria-label={recurrenceLabel(newRecurrence)}
            title={recurrenceLabel(newRecurrence)}
          >
            <Repeat size={16} aria-hidden="true" />
            {newRecurrence && <span className="hidden sm:inline">{recurrenceBadge(newRecurrence)}</span>}
          </button>
          <button
            onClick={add}
            className="rounded-xl px-4 py-3 bg-primary text-primary-foreground flex items-center gap-2 hover:opacity-90 flex-shrink-0"
            style={{
              fontWeight: 700,
              transition: "opacity 0.15s",
            }}
          >
            <Plus size={18} />
            <span className="hidden sm:inline">{t.tasks.add}</span>
          </button>
        </div>
        {newRecurrence === "weekly" && (
          <div className="pl-1">
            <WeekdayPicker value={newWeekday} onChange={setNewWeekday} />
          </div>
        )}
      </div>
    </div>
  );
}
