import { useState } from "react";
import { useLang } from "../i18n/LangContext";
import { useToday } from "../hooks/useToday";
import { Reorder } from "motion/react";
import { Plus, X, CheckCircle2, Check, Pencil, Repeat, ChevronDown, ChevronUp } from "lucide-react";
import { ReorderRow } from "./ui/ReorderRow";
import { IconButton } from "./ui/IconButton";
import { AnimatedCollapse } from "./AnimatedCollapse";

export type TaskRecurrence = "daily" | "weekly" | "monthly";

export interface Task {
  id: number;
  text: string;
  done: boolean;
  // Absent = one-off task, cleared once completed (existing behavior). When set, the
  // task is never removed at day rollover — it just resets to undone on its cadence
  // instead (see App.tsx's rollover effect).
  recurrence?: TaskRecurrence;
  // Which weekday(s) (0 = Sunday ... 6 = Saturday) a "weekly" task resets on — defaults to
  // the day it was created, but can include any combination (e.g. a task due Mon+Wed+Fri
  // resets — and needs doing again — on each of those days).
  weeklyWeekdays?: number[];
  // Which day(s)-of-month (1-31) a "monthly" task resets on — e.g. rent on the 1st,
  // a bill on the 15th. A day that doesn't exist in a given month (31 in April) just
  // doesn't fire that month rather than shifting to another date.
  monthlyDays?: number[];
}

// A one-off or "daily" task is always today's business. A "weekly"/"monthly" task only is
// on the day(s) it's scheduled for — otherwise it'd sit in the list looking like it's due
// today when it's really due some other day/date.
export function isTaskScheduledToday(task: Task, todayWeekday: number, todayDayOfMonth: number): boolean {
  if (!task.recurrence || task.recurrence === "daily") return true;
  if (task.recurrence === "weekly") return task.weeklyWeekdays?.includes(todayWeekday) ?? false;
  return task.monthlyDays?.includes(todayDayOfMonth) ?? false;
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
  const todayDate = new Date(`${today}T00:00:00`);
  const todayWeekday = todayDate.getDay();
  const todayDayOfMonth = todayDate.getDate();
  const [newText, setNewText] = useState("");
  const [newRecurrence, setNewRecurrence] = useState<TaskRecurrence | undefined>(undefined);
  const [newWeekdays, setNewWeekdays] = useState<number[]>([todayWeekday]);
  const [newMonthlyDays, setNewMonthlyDays] = useState<number[]>([todayDayOfMonth]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [editRecurrence, setEditRecurrence] = useState<TaskRecurrence | undefined>(undefined);
  const [editWeekdays, setEditWeekdays] = useState<number[]>([todayWeekday]);
  const [editMonthlyDays, setEditMonthlyDays] = useState<number[]>([todayDayOfMonth]);
  const [otherOpen, setOtherOpen] = useState(false);
  // The weekday/day-of-month picker used to expand inline inside the row it belonged to,
  // which fought with the row's own flex layout (drag handle, checkbox, edit/delete
  // buttons) and produced broken-looking spacing once the picker grew wide. Moving it into
  // its own modal — like Reminders' "Repeat" screen — sidesteps that entirely: the picker
  // now lives in a fixed-width dialog with no relationship to any row's layout.
  const [recurrenceModalOpen, setRecurrenceModalOpen] = useState<"new" | "edit" | null>(null);
  const modalRecurrence = recurrenceModalOpen === "new" ? newRecurrence : editRecurrence;
  const setModalRecurrence = recurrenceModalOpen === "new" ? setNewRecurrence : setEditRecurrence;
  const modalWeekdays = recurrenceModalOpen === "new" ? newWeekdays : editWeekdays;
  const setModalWeekdays = recurrenceModalOpen === "new" ? setNewWeekdays : setEditWeekdays;
  const modalMonthlyDays = recurrenceModalOpen === "new" ? newMonthlyDays : editMonthlyDays;
  const setModalMonthlyDays = recurrenceModalOpen === "new" ? setNewMonthlyDays : setEditMonthlyDays;

  const toggleDay = (days: number[], day: number): number[] => {
    const without = days.filter((d) => d !== day);
    // Keep at least one day selected — an empty set would never reset.
    if (without.length === days.length) return [...days, day].sort((a, b) => a - b);
    return without.length > 0 ? without : days;
  };

  const recurrenceLabel = (recurrence: TaskRecurrence | undefined) => {
    if (recurrence === "daily") return t.tasks.repeatDaily;
    if (recurrence === "weekly") return t.tasks.repeatWeekly;
    if (recurrence === "monthly") return t.tasks.repeatMonthly;
    return t.tasks.repeatNone;
  };

  const recurrenceBadge = (recurrence: TaskRecurrence | undefined) => {
    if (recurrence === "daily") return t.tasks.repeatDailyBadge;
    if (recurrence === "weekly") return t.tasks.repeatWeeklyBadge;
    if (recurrence === "monthly") return t.tasks.repeatMonthlyBadge;
    return null;
  };

  const WeekdayPicker = ({ value, onChange }: { value: number[]; onChange: (days: number[]) => void }) => (
    <div className="flex items-center gap-1 flex-wrap" role="group" aria-label={t.tasks.repeatWeekly}>
      {t.tasks.weekdaysShort.map((label, day) => (
        <button
          key={day}
          type="button"
          onClick={() => onChange(toggleDay(value, day))}
          aria-pressed={value.includes(day)}
          aria-label={t.tasks.weekdaysFull[day]}
          className="rounded-full flex items-center justify-center hover:opacity-85 flex-shrink-0"
          style={{
            width: 36,
            height: 36,
            fontSize: "0.75rem",
            fontWeight: 700,
            backgroundColor: value.includes(day) ? "var(--primary)" : "var(--surface-1)",
            color: value.includes(day) ? "var(--primary-foreground)" : "var(--muted-foreground)",
            transition: "all 0.15s",
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );

  const MonthDayPicker = ({ value, onChange }: { value: number[]; onChange: (days: number[]) => void }) => (
    <div
      className="grid gap-1"
      style={{ gridTemplateColumns: "repeat(7, minmax(0, 1fr))", maxWidth: 280 }}
      role="group"
      aria-label={t.tasks.repeatMonthly}
    >
      {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
        <button
          key={day}
          type="button"
          onClick={() => onChange(toggleDay(value, day))}
          aria-pressed={value.includes(day)}
          aria-label={t.tasks.dayOfMonthLabel(day)}
          className="rounded-lg flex items-center justify-center hover:opacity-85"
          style={{
            width: 32,
            height: 32,
            fontSize: "0.7rem",
            fontWeight: 700,
            backgroundColor: value.includes(day) ? "var(--primary)" : "var(--surface-1)",
            color: value.includes(day) ? "var(--primary-foreground)" : "var(--muted-foreground)",
            transition: "all 0.15s",
          }}
        >
          {day}
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
    setEditWeekdays(task.weeklyWeekdays && task.weeklyWeekdays.length > 0 ? task.weeklyWeekdays : [todayWeekday]);
    setEditMonthlyDays(task.monthlyDays && task.monthlyDays.length > 0 ? task.monthlyDays : [todayDayOfMonth]);
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
              weeklyWeekdays: editRecurrence === "weekly" ? editWeekdays : undefined,
              monthlyDays: editRecurrence === "monthly" ? editMonthlyDays : undefined,
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
        weeklyWeekdays: newRecurrence === "weekly" ? newWeekdays : undefined,
        monthlyDays: newRecurrence === "monthly" ? newMonthlyDays : undefined,
      },
    ]);
    setNextId((n) => n + 1);
    setNewText("");
    setNewRecurrence(undefined);
    setNewWeekdays([todayWeekday]);
    setNewMonthlyDays([todayDayOfMonth]);
  };

  // Split off weekly/monthly tasks that aren't scheduled for today — they stay in storage
  // (and stay editable/deletable below) but don't clutter today's list looking like they're due.
  const todayTasks = tasks.filter((task) => isTaskScheduledToday(task, todayWeekday, todayDayOfMonth));
  const otherRecurringTasks = tasks.filter((task) => !isTaskScheduledToday(task, todayWeekday, todayDayOfMonth));

  const remaining = todayTasks.filter((task) => !task.done).length;

  // Completed tasks sink to the bottom instead of staying scattered wherever
  // they were checked off — sort is stable, so drag order within each group holds.
  const sortedTasks = [...todayTasks].sort((a, b) => Number(a.done) - Number(b.done));
  const firstCompletedIndex = sortedTasks.findIndex((task) => task.done);

  const weekdaysBadge = (days: number[] | undefined) =>
    (days ?? []).map((d) => t.tasks.weekdaysAbbr[d]).join(", ");

  const dueBadge = (task: Task) =>
    task.recurrence === "monthly" ? (task.monthlyDays ?? []).join(", ") : weekdaysBadge(task.weeklyWeekdays);

  return (
    <div className="steady-card bg-card rounded-2xl p-5 border border-border">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-foreground">{t.tasks.heading}</h3>
        {todayTasks.length > 0 && (
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

      {tasks.length > 0 && todayTasks.length === 0 && (
        <p className="text-muted-foreground text-center py-4" style={{ fontSize: "0.88rem" }}>{t.tasks.noneToday}</p>
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
              <div className="flex-1 min-w-0 flex items-center gap-1.5">
                <input autoFocus value={editText} onChange={(e) => setEditText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") saveEdit(task.id); if (e.key === "Escape") setEditingId(null); }} className="flex-1 min-w-0 rounded-lg px-2 py-1 border border-primary bg-input-background text-foreground outline-none" />
                <button
                  onClick={() => setRecurrenceModalOpen("edit")}
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

      {todayTasks.length > 0 && remaining === 0 && (
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

      {otherRecurringTasks.length > 0 && (
        <div className="rounded-xl border border-border overflow-hidden mb-4">
          <button
            onClick={() => setOtherOpen((o) => !o)}
            className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-muted text-left"
            style={{ transition: "background-color 0.15s" }}
          >
            <span className="text-muted-foreground" style={{ fontSize: "0.82rem", fontWeight: 700 }}>
              {t.tasks.otherRecurringHeading} ({otherRecurringTasks.length})
            </span>
            {otherOpen ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
          </button>
          <AnimatedCollapse open={otherOpen}>
            <div className="px-3 pb-3 space-y-1.5">
              {otherRecurringTasks.map((task) => (
                <div key={task.id} className="flex items-center gap-2 rounded-lg px-2 py-2" style={{ backgroundColor: "var(--surface-1)" }}>
                  {editingId === task.id ? (
                    <div className="flex-1 min-w-0 flex items-center gap-1.5">
                      <input autoFocus value={editText} onChange={(e) => setEditText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") saveEdit(task.id); if (e.key === "Escape") setEditingId(null); }} className="flex-1 min-w-0 rounded-lg px-2 py-1 border border-primary bg-input-background text-foreground outline-none" />
                      <button
                        onClick={() => setRecurrenceModalOpen("edit")}
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
                  ) : (
                    <span className="flex-1 min-w-0 flex items-center gap-1.5 flex-wrap" style={{ wordBreak: "break-word" }}>
                      <span className="text-foreground" style={{ opacity: 0.85 }}>{task.text}</span>
                      <span
                        className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 flex-shrink-0"
                        style={{ backgroundColor: "var(--surface-2)", color: "var(--muted-foreground)", fontSize: "0.7rem", fontWeight: 700 }}
                      >
                        {t.tasks.otherRecurringDue} {dueBadge(task)}
                      </span>
                    </span>
                  )}
                  <div className="flex items-center gap-1 flex-shrink-0">
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
                    <IconButton size="md" tone="destructive" onClick={() => remove(task.id)} aria-label={`${t.tasks.remove}: ${task.text}`}>
                      <X size={16} />
                    </IconButton>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedCollapse>
        </div>
      )}

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
          onClick={() => setRecurrenceModalOpen("new")}
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

      {recurrenceModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setRecurrenceModalOpen(null); }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="repeat-dialog-title"
            className="w-full max-w-sm rounded-2xl border border-border flex flex-col"
            style={{ backgroundColor: "var(--card)", maxHeight: "85vh" }}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0">
              <h3 id="repeat-dialog-title" className="text-foreground" style={{ fontFamily: "var(--app-font-heading, Nunito)" }}>
                {t.tasks.repeatModalTitle}
              </h3>
              <IconButton size="md" onClick={() => setRecurrenceModalOpen(null)} aria-label={t.tasks.repeatModalDone}>
                <X size={18} />
              </IconButton>
            </div>
            <div className="overflow-y-auto px-5 py-4 space-y-1">
              <div role="radiogroup" aria-label={t.tasks.repeatModalTitle} className="space-y-1">
                {([undefined, "daily", "weekly", "monthly"] as const).map((option) => {
                  const active = modalRecurrence === option;
                  return (
                    <button
                      key={option ?? "none"}
                      role="radio"
                      aria-checked={active}
                      onClick={() => setModalRecurrence(option)}
                      className="w-full flex items-center justify-between rounded-xl px-3 py-3 hover:bg-muted text-left"
                      style={{ backgroundColor: active ? "var(--green-bg)" : "transparent", transition: "background-color 0.15s" }}
                    >
                      <span style={{ color: active ? "var(--green-text)" : "var(--foreground)", fontWeight: active ? 700 : 500 }}>
                        {recurrenceLabel(option)}
                      </span>
                      {active && <Check size={16} style={{ color: "var(--green-text)" }} aria-hidden="true" />}
                    </button>
                  );
                })}
              </div>
              {modalRecurrence === "weekly" && (
                <div className="pt-3">
                  <WeekdayPicker value={modalWeekdays} onChange={setModalWeekdays} />
                </div>
              )}
              {modalRecurrence === "monthly" && (
                <div className="pt-3">
                  <MonthDayPicker value={modalMonthlyDays} onChange={setModalMonthlyDays} />
                </div>
              )}
            </div>
            <div className="px-5 py-4 border-t border-border flex-shrink-0">
              <button
                onClick={() => setRecurrenceModalOpen(null)}
                className="w-full rounded-xl py-3 bg-primary text-primary-foreground hover:opacity-90"
                style={{ fontWeight: 700, transition: "opacity 0.15s" }}
              >
                {t.tasks.repeatModalDone}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
