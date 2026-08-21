import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Sun, Sunset, MoonStar, Plus, X, CheckCircle2, Check, Pencil, Link2, ListTree, ListChecks, Info, UtensilsCrossed } from "lucide-react";
import { Reorder } from "motion/react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useToday } from "../hooks/useToday";
import { useLang } from "../i18n/LangContext";
import { AnimatedCollapse } from "./AnimatedCollapse";
import { ReorderRow } from "./ui/ReorderRow";
import { IconButton } from "./ui/IconButton";
import { PictogramPicker } from "./ui/PictogramPicker";
import { DONE_TEXT_OPACITY } from "../lib/uiConstants";
import {
  isTaskScheduledToday,
  hasPrepContent,
  emptyPrep,
  TEN_H_KEYS,
  type Task,
  type TaskRecurrence,
  type TenHKey,
  type TenHPrep,
} from "./TaskList";

export const SECTION_KEYS = ["morning", "afternoon", "late", "meals"] as const;
export type SectionKey = typeof SECTION_KEYS[number];

export const SECTION_ICONS: Record<SectionKey, React.ReactNode> = {
  morning: <Sun size={20} />,
  afternoon: <Sunset size={20} />,
  late: <MoonStar size={20} />,
  meals: <UtensilsCrossed size={20} />,
};

const SECTION_COLOR_VARS: Record<SectionKey, string> = {
  morning: "var(--morning-bg)",
  afternoon: "var(--afternoon-bg)",
  late: "var(--late-bg)",
  meals: "var(--green-bg)",
};

export interface SubTask {
  id: number;
  text: string;
  done: boolean;
}

export interface CustomItem {
  id: number;
  text: string;
  // When set, this step is the same item as a task in the Tasks tab (any recurrence) — added to
  // solve the duplicate-entry complaint of having to type a thing twice to track it both
  // places. Completion and text are mirrored from that task rather than tracked locally;
  // if the task is later deleted from the Tasks side, this just self-heals back into a
  // normal, independently-toggleable step (see resolveLink below).
  linkedTaskId?: number;
  // Optional pictogram shown before the step name — same free-text emoji-input pattern
  // already used for habits and important dates, for visual consistency across the app.
  emoji?: string;
  // Optional breakdown for a step that needs more specificity than one checkbox covers
  // (e.g. "Get dressed" -> socks, shirt, shoes). Deliberately independent of the parent
  // step's own done state — checking sub-steps doesn't auto-complete the parent, so
  // there's no surprise side effect from ticking the last one.
  subtasks?: SubTask[];
  // Optional "De 10 H'er" task-prep breakdown, same shape and fields as Tasks' own — reused
  // as-is since the 10 orienting questions apply equally to a routine step.
  prep?: TenHPrep;
}

export type CustomMap = Record<SectionKey, CustomItem[]>;

const CUSTOM_NEXT_ID_START = 100;

// Same pick-or-type pattern as the Habit tracker's "Add habit" form, tailored to
// routine-step-shaped things (self-care, morning/evening tasks) instead of habit-shaped ones.
const EMOJI_SUGGESTIONS = [
  "🌅", "🛏️", "🪥", "🚿", "👕", "🍽️", "💊", "📵",
  "🎵", "📚", "🧘", "🚶", "☀️", "🌙", "✅", "🎯",
  "🧹", "🪴", "✍️", "🫧",
];

function SectionPanel({
  sectionKey,
  doneIds,
  onToggle,
  customItems,
  tasks,
  onAddCustom,
  onEditCustom,
  onReorderCustom,
  onDeleteCustom,
  onAddSubtask,
  onToggleSubtask,
  onDeleteSubtask,
}: {
  sectionKey: SectionKey;
  doneIds: number[];
  onToggle: (id: number) => void;
  customItems: CustomItem[];
  tasks: Task[];
  onAddCustom: (text: string, linkToTasks: boolean, emoji: string, recurrence: TaskRecurrence, prep: TenHPrep | undefined) => void;
  onEditCustom: (id: number, text: string, emoji: string, targetSection: SectionKey, prep: TenHPrep | undefined) => void;
  onReorderCustom: (items: CustomItem[]) => void;
  onDeleteCustom: (id: number) => void;
  onAddSubtask: (id: number, text: string) => void;
  onToggleSubtask: (id: number, subtaskId: number) => void;
  onDeleteSubtask: (id: number, subtaskId: number) => void;
}) {
  const t = useLang();
  const today = useToday();
  const section = t.routines.sections[sectionKey];
  const [open, setOpen] = useState(false);
  const [addingStep, setAddingStep] = useState(false);
  const [stepDraft, setStepDraft] = useState("");
  const [stepEmojiDraft, setStepEmojiDraft] = useState("");
  const [linkToTasks, setLinkToTasks] = useState(false);
  const [linkRecurrence, setLinkRecurrence] = useState<TaskRecurrence>("daily");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState("");
  const [editEmojiDraft, setEditEmojiDraft] = useState("");
  const [editSection, setEditSection] = useState<SectionKey>(sectionKey);
  const [newSubtaskDraft, setNewSubtaskDraft] = useState("");
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  const [prepExpandedIds, setPrepExpandedIds] = useState<Set<number>>(new Set());
  const [newPrep, setNewPrep] = useState<Record<TenHKey, string>>(emptyPrep());
  const [editPrep, setEditPrep] = useState<Record<TenHKey, string>>(emptyPrep());
  const [prepModalOpen, setPrepModalOpen] = useState<"new" | "edit" | null>(null);
  const modalPrep = prepModalOpen === "new" ? newPrep : editPrep;
  const setModalPrep = prepModalOpen === "new" ? setNewPrep : setEditPrep;

  // A step only counts as "linked" while its task still exists — if that task was deleted
  // from the Tasks tab, it self-heals back into a plain, locally-tracked step rather than
  // pointing at nothing.
  const linkedTask = (item: CustomItem) =>
    item.linkedTaskId != null ? tasks.find((tsk) => tsk.id === item.linkedTaskId) : undefined;
  const isDone = (item: CustomItem) => linkedTask(item)?.done ?? doneIds.includes(item.id);

  // A step linked to a recurring task only belongs on the days that task is actually due —
  // otherwise a "Monday only" step would sit in the routine looking identical to a daily one,
  // making the weekday choice made in the Tasks tab appear to have no effect here.
  const isScheduledToday = (item: CustomItem) => {
    const task = linkedTask(item);
    return !task || isTaskScheduledToday(task, today);
  };
  const visibleItems = customItems.filter(isScheduledToday);

  const allIds = visibleItems.map((c) => c.id);
  const doneCount = visibleItems.filter(isDone).length;

  const toggleExpanded = (id: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const togglePrepExpanded = (id: number) => {
    setPrepExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const submitStep = () => {
    const trimmed = stepDraft.trim();
    if (!trimmed) return;
    onAddCustom(trimmed, linkToTasks, stepEmojiDraft.trim(), linkRecurrence, hasPrepContent(newPrep) ? newPrep : undefined);
    setStepDraft("");
    setStepEmojiDraft("");
    setLinkToTasks(false);
    setLinkRecurrence("daily");
    setNewPrep(emptyPrep());
    setAddingStep(false);
  };

  const startEditing = (item: CustomItem) => {
    setEditingId(item.id);
    setEditDraft(linkedTask(item)?.text ?? item.text);
    setEditEmojiDraft(item.emoji ?? "");
    setEditSection(sectionKey);
    setEditPrep({ ...emptyPrep(), ...item.prep });
  };

  const saveEdit = (id: number) => {
    const trimmed = editDraft.trim();
    if (!trimmed) return;
    onEditCustom(id, trimmed, editEmojiDraft.trim(), editSection, hasPrepContent(editPrep) ? editPrep : undefined);
    setEditingId(null);
    setEditDraft("");
    setEditEmojiDraft("");
  };

  const renderItem = (item: CustomItem) => {
    if (!isScheduledToday(item)) return null;
    const { id } = item;
    const linked = linkedTask(item);
    const text = linked?.text ?? item.text;
    const done = isDone(item);
    const subtasks = item.subtasks ?? [];
    const subtaskDoneCount = subtasks.filter((s) => s.done).length;
    const expanded = expandedIds.has(id);
    return (
      <ReorderRow key={id} value={item} values={customItems} onReorder={onReorderCustom} moveUpLabel={t.common.moveUp} moveDownLabel={t.common.moveDown} dragDisabled={editingId === id} className="flex items-center flex-wrap gap-2 group relative py-1.5" handleSize={18}>
        {editingId === id ? (
          <div className="flex-1 min-w-0 flex items-center gap-2 rounded-xl p-3 bg-muted" style={{ flexBasis: 140 }}>
            <span
              className="flex-shrink-0 rounded-full border-2 flex items-center justify-center"
              style={{
                width: 24, height: 24,
                borderColor: done ? "var(--primary)" : "var(--muted-foreground)",
                backgroundColor: done ? "var(--primary)" : "transparent",
              }}
              aria-hidden="true"
            >
              {done && <Check size={13} color="var(--primary-foreground)" />}
            </span>
            <input
              aria-label={t.routines.emojiLabel}
              value={editEmojiDraft}
              onChange={(event) => setEditEmojiDraft(event.target.value)}
              className="w-9 flex-shrink-0 bg-transparent text-center outline-none focus:ring-2 focus:ring-inset focus:ring-primary rounded-lg"
              style={{ fontSize: "1.3rem" }}
              maxLength={2}
            />
            <input
              autoFocus
              aria-label={`${t.routines.editStep}: ${text}`}
              value={editDraft}
              onChange={(event) => setEditDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") saveEdit(id);
                if (event.key === "Escape") setEditingId(null);
              }}
              className="flex-1 min-w-0 rounded-lg px-2 py-1 border border-primary bg-input-background text-foreground outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            />
            <button
              onClick={() => setPrepModalOpen("edit")}
              className="flex-shrink-0 rounded-lg p-1.5 border-2 hover:opacity-85"
              style={{
                borderColor: hasPrepContent(editPrep) ? "var(--primary)" : "var(--border)",
                backgroundColor: hasPrepContent(editPrep) ? "var(--green-bg)" : "transparent",
                color: hasPrepContent(editPrep) ? "var(--green-text)" : "var(--muted-foreground)",
                transition: "all 0.15s",
              }}
              aria-label={t.tasks.prep.buttonLabel}
              title={t.tasks.prep.buttonLabel}
            >
              <ListChecks size={14} aria-hidden="true" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => onToggle(id)}
            disabled={!!linked && done}
            aria-pressed={done}
            className="flex-1 min-w-0 flex items-center gap-2 rounded-xl p-2.5 text-left hover:bg-muted disabled:cursor-default"
            style={{ backgroundColor: done ? "var(--surface-2)" : "transparent", transition: "background-color 0.15s", flexBasis: 140 }}
          >
            <span
              className="flex-shrink-0 rounded-full border-2 flex items-center justify-center"
              style={{
                width: 24, height: 24,
                borderColor: done ? "var(--primary)" : "var(--muted-foreground)",
                backgroundColor: done ? "var(--primary)" : "transparent",
              }}
            >
              {done && <Check size={13} color="var(--primary-foreground)" />}
            </span>
            {item.emoji && <span style={{ fontSize: "1.3rem", flexShrink: 0 }} aria-hidden="true">{item.emoji}</span>}
            <span
              className="flex-1 min-w-0 text-foreground truncate steady-truncate-compact"
              style={{ textDecoration: done ? "line-through" : "none", opacity: done ? DONE_TEXT_OPACITY : 1 }}
            >
              {text}
            </span>
            {linked && (
              <Link2
                size={13}
                className="flex-shrink-0"
                style={{ color: "var(--muted-foreground)" }}
                aria-hidden="true"
              />
            )}
          </button>
        )}
        {editingId === id && (
          <div className="flex items-center justify-between gap-2 flex-wrap pb-1" style={{ flexBasis: "100%" }}>
            <div className="flex items-center gap-1 flex-wrap">
              {SECTION_KEYS.map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setEditSection(key)}
                  aria-pressed={editSection === key}
                  className="rounded-full px-3 py-1 hover:opacity-85"
                  style={{
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    backgroundColor: editSection === key ? "var(--primary)" : "var(--surface-1)",
                    color: editSection === key ? "var(--primary-foreground)" : "var(--muted-foreground)",
                    transition: "all 0.15s",
                  }}
                >
                  {t.routines.sections[key].label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-0.5 flex-shrink-0">
              <IconButton size="md" tone="primary" onClick={() => saveEdit(id)} aria-label={`${t.routines.saveStep}: ${text}`}>
                <Check size={15} />
              </IconButton>
              <IconButton size="md" tone="destructive" onClick={() => onDeleteCustom(id)} aria-label={`${t.routines.deleteStep}: ${text}`}>
                <X size={14} />
              </IconButton>
            </div>
          </div>
        )}
        {linked && <span className="sr-only">{t.routines.linkedToTasks}</span>}
        {editingId !== id && (
          <div className="flex items-center gap-0.5 flex-shrink-0">
            {sectionKey !== "meals" && subtasks.length > 0 && (
              <IconButton
                size="pill"
                tone="default"
                onClick={() => toggleExpanded(id)}
                aria-label={`${t.routines.subtasksLabel}: ${subtaskDoneCount}/${subtasks.length}`}
                aria-expanded={expanded}
                style={{ fontSize: "0.75rem", fontWeight: 700 }}
              >
                <ListTree size={13} aria-hidden="true" />
                {subtaskDoneCount}/{subtasks.length}
              </IconButton>
            )}
            {hasPrepContent(item.prep) && (
              <IconButton
                size="pill"
                tone="default"
                onClick={() => togglePrepExpanded(id)}
                aria-label={t.tasks.prep.viewHeading}
                aria-expanded={prepExpandedIds.has(id)}
                style={{ fontSize: "0.75rem", fontWeight: 700 }}
              >
                <Info size={13} aria-hidden="true" />
              </IconButton>
            )}
            <IconButton
              size="md"
              tone="primary"
              onClick={() => startEditing(item)}
              aria-label={`${t.routines.editStep}: ${text}`}
            >
              <Pencil size={14} className="sm:hidden" />
              <span className="hidden sm:inline" style={{ fontSize: "0.75rem", fontWeight: 700 }}>{t.routines.editLabel}</span>
            </IconButton>
            <IconButton
              size="md"
              tone="destructive"
              onClick={() => onDeleteCustom(id)}
              aria-label={`${t.routines.deleteStep}: ${text}`}
            >
              <X size={14} />
            </IconButton>
          </div>
        )}
        {/* flexBasis 100% forces this onto its own row within the flex-wrap parent; the
            top border keeps it from visually blending into the save/cancel row above,
            which belongs to the step itself rather than to sub-steps. */}
        {editingId === id && sectionKey !== "meals" && (
          <div className="space-y-1.5 pb-1.5 pt-2 mt-1" style={{ flexBasis: "100%", borderTop: "1px solid var(--border)" }}>
            <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--muted-foreground)" }}>
              {t.routines.subtasksLabel}
            </p>
            {subtasks.map((sub) => (
              <div key={sub.id} className="flex items-center gap-2 pl-1">
                <button
                  onClick={() => onToggleSubtask(id, sub.id)}
                  aria-pressed={sub.done}
                  aria-label={`${sub.done ? t.routines.saveStep : t.routines.editStep}: ${sub.text}`}
                  className="flex-shrink-0 rounded-full border-2 flex items-center justify-center"
                  style={{
                    width: 18, height: 18,
                    borderColor: sub.done ? "var(--primary)" : "var(--muted-foreground)",
                    backgroundColor: sub.done ? "var(--primary)" : "transparent",
                  }}
                >
                  {sub.done && <Check size={11} color="var(--primary-foreground)" />}
                </button>
                <span
                  className="flex-1 min-w-0 truncate"
                  style={{ fontSize: "0.88rem", textDecoration: sub.done ? "line-through" : "none", opacity: sub.done ? DONE_TEXT_OPACITY : 1 }}
                >
                  {sub.text}
                </span>
                <IconButton size="sm" tone="destructive" onClick={() => onDeleteSubtask(id, sub.id)} aria-label={`${t.routines.deleteStep}: ${sub.text}`}>
                  <X size={12} />
                </IconButton>
              </div>
            ))}
            <div className="flex gap-1.5 pl-1">
              <input
                type="text"
                value={newSubtaskDraft}
                onChange={(e) => setNewSubtaskDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key !== "Enter") return;
                  const trimmed = newSubtaskDraft.trim();
                  if (!trimmed) return;
                  onAddSubtask(id, trimmed);
                  setNewSubtaskDraft("");
                }}
                placeholder={t.routines.addSubtaskPlaceholder}
                className="flex-1 min-w-0 rounded-lg px-2 py-1 border border-border bg-input-background text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
                style={{ fontSize: "0.85rem" }}
              />
              <button
                onClick={() => {
                  const trimmed = newSubtaskDraft.trim();
                  if (!trimmed) return;
                  onAddSubtask(id, trimmed);
                  setNewSubtaskDraft("");
                }}
                className="rounded-lg px-2.5 border border-border text-muted-foreground hover:bg-muted flex-shrink-0"
                aria-label={t.routines.addSubtaskPlaceholder.replace("…", "")}
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
        )}
        {editingId !== id && sectionKey !== "meals" && expanded && subtasks.length > 0 && (
          <div className="space-y-1.5 pl-9 pb-1.5" style={{ flexBasis: "100%" }}>
            {subtasks.map((sub) => (
              <div key={sub.id} className="flex items-center gap-2">
                <button
                  onClick={() => onToggleSubtask(id, sub.id)}
                  aria-pressed={sub.done}
                  aria-label={sub.text}
                  className="flex-shrink-0 rounded-full border-2 flex items-center justify-center"
                  style={{
                    width: 18, height: 18,
                    borderColor: sub.done ? "var(--primary)" : "var(--muted-foreground)",
                    backgroundColor: sub.done ? "var(--primary)" : "transparent",
                  }}
                >
                  {sub.done && <Check size={11} color="var(--primary-foreground)" />}
                </button>
                <span
                  className="flex-1 min-w-0 truncate"
                  style={{ fontSize: "0.88rem", color: "var(--muted-foreground)", textDecoration: sub.done ? "line-through" : "none", opacity: sub.done ? DONE_TEXT_OPACITY : 1 }}
                >
                  {sub.text}
                </span>
              </div>
            ))}
          </div>
        )}
        {editingId !== id && prepExpandedIds.has(id) && hasPrepContent(item.prep) && (
          <div className="space-y-2 pl-9 pb-1.5" style={{ flexBasis: "100%" }}>
            {TEN_H_KEYS.filter((k) => (item.prep?.[k] ?? "").trim().length > 0).map((k) => (
              <div key={k}>
                <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--muted-foreground)" }}>{t.tasks.prep.fields[k]}</p>
                <p style={{ fontSize: "0.88rem", color: "var(--foreground)", whiteSpace: "pre-wrap" }}>{item.prep![k]}</p>
              </div>
            ))}
          </div>
        )}
      </ReorderRow>
    );
  };

  return (
    <div className="rounded-2xl border border-border overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-2 sm:gap-3 p-3 sm:p-4 text-left hover:opacity-90"
        style={{ backgroundColor: SECTION_COLOR_VARS[sectionKey], transition: "opacity 0.15s" }}
      >
        <span className="text-foreground flex-shrink-0">{SECTION_ICONS[sectionKey]}</span>
        <div className="flex-1 min-w-0">
          <p style={{ fontWeight: 700, fontSize: "1rem" }} className="text-foreground truncate">{section.label}</p>
          <p style={{ fontSize: "0.8rem" }} className="text-muted-foreground truncate">{section.time}</p>
        </div>
        {allIds.length > 0 && doneCount === allIds.length ? (
          <CheckCircle2
            size={22}
            className="flex-shrink-0"
            style={{ color: "var(--primary)" }}
          />
        ) : (
          <span
            className="rounded-full px-2.5 py-0.5 flex-shrink-0 text-foreground"
            style={{ backgroundColor: "rgba(128,128,128,0.25)", fontSize: "0.8rem", fontWeight: 700 }}
          >
            {doneCount}/{allIds.length}
          </span>
        )}
        {open ? <ChevronUp size={18} className="text-muted-foreground" /> : <ChevronDown size={18} className="text-muted-foreground" />}
      </button>

      <AnimatedCollapse open={open}>
        <div className="p-4 space-y-1 bg-card">
          {/* Custom items */}
          {visibleItems.length === 0 && !addingStep && (
            <p className="text-muted-foreground py-2 pl-1" style={{ fontSize: "0.88rem" }}>
              {customItems.length > 0 ? t.routines.noStepsToday : t.routines.noSteps}
            </p>
          )}
          <Reorder.Group axis="y" values={customItems} onReorder={onReorderCustom} className="space-y-1">
            {customItems.map(renderItem)}
          </Reorder.Group>

          {/* Add step */}
          {addingStep ? (
            <div className="space-y-2 mt-2">
              <PictogramPicker value={stepEmojiDraft} onChange={setStepEmojiDraft} suggestions={EMOJI_SUGGESTIONS} labels={t.routines.emojiLabels} size="sm" />
              <input
                type="text"
                value={stepDraft}
                onChange={(e) => setStepDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submitStep()}
                placeholder={t.routines.addStepPlaceholder}
                autoFocus
                className="w-full rounded-xl px-3 py-2.5 border border-border bg-input-background text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
                style={{ fontSize: "0.9rem", transition: "border-color 0.15s" }}
              />
              <div className="flex gap-2">
                <button
                  onClick={submitStep}
                  className="flex-1 rounded-xl px-4 py-2.5 bg-primary text-primary-foreground hover:opacity-90"
                  style={{ fontWeight: 700, fontSize: "0.9rem", transition: "opacity 0.15s" }}
                >
                  {t.routines.addStepButton}
                </button>
                <button
                  onClick={() => setPrepModalOpen("new")}
                  className="rounded-xl px-3 py-2.5 border-2 flex items-center hover:opacity-85 flex-shrink-0"
                  style={{
                    borderColor: hasPrepContent(newPrep) ? "var(--primary)" : "var(--border)",
                    backgroundColor: hasPrepContent(newPrep) ? "var(--green-bg)" : "transparent",
                    color: hasPrepContent(newPrep) ? "var(--green-text)" : "var(--muted-foreground)",
                    transition: "all 0.15s",
                  }}
                  aria-label={t.tasks.prep.buttonLabel}
                  title={t.tasks.prep.buttonLabel}
                >
                  <ListChecks size={16} aria-hidden="true" />
                </button>
                <button
                  onClick={() => { setAddingStep(false); setStepDraft(""); setStepEmojiDraft(""); setLinkToTasks(false); setLinkRecurrence("daily"); setNewPrep(emptyPrep()); }}
                  className="rounded-xl px-4 py-2.5 border border-border text-muted-foreground hover:bg-muted flex-shrink-0"
                  style={{ transition: "background-color 0.15s" }}
                  aria-label={t.routines.cancel}
                >
                  <X size={16} />
                </button>
              </div>
              {sectionKey !== "meals" && (
                <label className="flex items-center gap-2 pl-1" style={{ fontSize: "0.85rem", color: "var(--muted-foreground)" }}>
                  <input
                    type="checkbox"
                    checked={linkToTasks}
                    onChange={(e) => setLinkToTasks(e.target.checked)}
                    className="rounded"
                    style={{ width: 16, height: 16, accentColor: "var(--primary)" }}
                  />
                  {t.routines.alsoAddToTasks}
                </label>
              )}
              {sectionKey !== "meals" && linkToTasks && (
                <div className="flex items-center gap-1.5 pl-1" role="group" aria-label={t.tasks.repeatButtonLabel}>
                  {(["daily", "weekly", "monthly"] as const).map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setLinkRecurrence(option)}
                      aria-pressed={linkRecurrence === option}
                      className="rounded-full px-3 py-1 border"
                      style={{
                        fontSize: "0.78rem",
                        fontWeight: linkRecurrence === option ? 700 : 500,
                        backgroundColor: linkRecurrence === option ? "var(--primary)" : "transparent",
                        borderColor: linkRecurrence === option ? "var(--primary)" : "var(--border)",
                        color: linkRecurrence === option ? "var(--primary-foreground)" : "var(--muted-foreground)",
                        transition: "all 0.15s",
                      }}
                    >
                      {option === "daily" ? t.tasks.repeatDailyBadge : option === "weekly" ? t.tasks.repeatWeeklyBadge : t.tasks.repeatMonthlyBadge}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setAddingStep(true)}
              className="flex items-center gap-2 text-muted-foreground hover:text-primary mt-1 pl-1"
              style={{ fontSize: "0.88rem", fontWeight: 600, transition: "color 0.15s" }}
            >
              <Plus size={15} />
              {t.routines.addStepPlaceholder.replace("…", "")}
            </button>
          )}
        </div>
      </AnimatedCollapse>

      {prepModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setPrepModalOpen(null);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="routine-prep-dialog-title"
            className="w-full max-w-sm rounded-2xl border border-border flex flex-col steady-modal-dialog"
            style={{ backgroundColor: "var(--card)" }}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0">
              <h3 id="routine-prep-dialog-title" className="text-foreground" style={{ fontFamily: "var(--app-font-heading, Nunito)" }}>
                {t.tasks.prep.modalTitle}
              </h3>
              <IconButton size="md" onClick={() => setPrepModalOpen(null)} aria-label={t.tasks.prep.modalDone}>
                <X size={18} />
              </IconButton>
            </div>
            <div className="overflow-y-auto px-5 py-4 space-y-3" style={{ overflowX: "hidden", WebkitOverflowScrolling: "touch" }}>
              <p className="text-muted-foreground" style={{ fontSize: "0.85rem", lineHeight: 1.5 }}>{t.tasks.prep.modalIntro}</p>
              {TEN_H_KEYS.map((k) => (
                <div key={k}>
                  <label
                    htmlFor={`routine-prep-field-${k}`}
                    className="block text-foreground mb-1"
                    style={{ fontSize: "0.82rem", fontWeight: 700 }}
                  >
                    {t.tasks.prep.fields[k]}
                  </label>
                  <input
                    id={`routine-prep-field-${k}`}
                    type="text"
                    value={modalPrep[k]}
                    onChange={(e) => setModalPrep((prev) => ({ ...prev, [k]: e.target.value }))}
                    className="w-full rounded-xl px-3 py-2.5 border border-border bg-input-background text-foreground outline-none focus:border-primary"
                    style={{ boxSizing: "border-box", fontSize: "0.9rem" }}
                  />
                </div>
              ))}
            </div>
            <div className="px-5 py-4 border-t border-border flex-shrink-0">
              <button
                onClick={() => setPrepModalOpen(null)}
                className="w-full rounded-xl py-3 bg-primary text-primary-foreground hover:opacity-90"
                style={{ fontWeight: 700, transition: "opacity 0.15s" }}
              >
                {t.tasks.prep.modalDone}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface RoutinesProps {
  tasks: Task[];
  setTasks: (updater: Task[] | ((prev: Task[]) => Task[])) => void;
  taskNextId: number;
  setTaskNextId: (updater: number | ((prev: number) => number)) => void;
}

export function Routines({ tasks, setTasks, taskNextId, setTaskNextId }: RoutinesProps) {
  const t = useLang();
  const [doneIds, setDoneIds] = useLocalStorage<number[]>("steady-routines-done", []);
  const [doneDate, setDoneDate] = useLocalStorage<string | null>("steady-routines-done-date", null);
  const [custom, setCustom] = useLocalStorage<CustomMap>("steady-routines-custom", {
    morning: [], afternoon: [], late: [], meals: [],
  });
  const [nextId, setNextId] = useLocalStorage<number>("steady-routines-nextid", CUSTOM_NEXT_ID_START);
  const today = useToday();

  // Reset checked-off steps when the day rolls over, so routines start fresh each day.
  // Linked steps don't need their own reset: their completion lives on the task, and that
  // task already resets itself on its own cadence (daily/weekly/monthly) via the Tasks
  // rollover in App.tsx. Sub-tasks live inside `custom` rather than the doneIds array, so
  // they need their own reset pass.
  useEffect(() => {
    if (doneDate !== today) {
      setDoneIds([]);
      setDoneDate(today);
      setCustom((prev) => {
        const next: CustomMap = { morning: [], afternoon: [], late: [], meals: [] };
        for (const key of SECTION_KEYS) {
          next[key] = (prev[key] ?? []).map((item) =>
            item.subtasks ? { ...item, subtasks: item.subtasks.map((s) => ({ ...s, done: false })) } : item
          );
        }
        return next;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [today]);

  const findCustomItem = (id: number): CustomItem | undefined => {
    for (const key of SECTION_KEYS) {
      const found = (custom[key] ?? []).find((item) => item.id === id);
      if (found) return found;
    }
    return undefined;
  };

  const toggleDone = (id: number) => {
    const item = findCustomItem(id);
    if (item?.linkedTaskId != null) {
      // One-way to match how standalone tasks behave — once checked off here or in Tasks,
      // it locks for the day rather than being freely re-toggleable like a plain step.
      setTasks((prev) => prev.map((tsk) => (tsk.id === item.linkedTaskId && !tsk.done ? { ...tsk, done: true } : tsk)));
      return;
    }
    setDoneIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const addCustom = (section: SectionKey, text: string, linkToTasks: boolean, emoji: string, recurrence: TaskRecurrence, prep: TenHPrep | undefined) => {
    const id = nextId;
    setNextId((n) => n + 1);
    let linkedTaskId: number | undefined;
    if (linkToTasks) {
      linkedTaskId = taskNextId;
      setTaskNextId((n) => n + 1);
      const newTask: Task = { id: linkedTaskId, text, done: false, recurrence };
      if (recurrence === "weekly") {
        newTask.weeklyWeekdays = [new Date(`${today}T00:00:00`).getDay()];
        newTask.recurrenceStartDate = today;
      } else if (recurrence === "monthly") {
        newTask.monthlyDays = [new Date(`${today}T00:00:00`).getDate()];
        newTask.recurrenceStartDate = today;
      }
      setTasks((prev) => [...prev, newTask]);
    }
    setCustom((prev) => ({
      ...prev,
      [section]: [...(prev[section] ?? []), { id, text, linkedTaskId, emoji: emoji || undefined, prep }],
    }));
  };

  const deleteCustom = (section: SectionKey, id: number) => {
    const item = (custom[section] ?? []).find((i) => i.id === id);
    if (item?.linkedTaskId != null) {
      setTasks((prev) => prev.filter((tsk) => tsk.id !== item.linkedTaskId));
    }
    setCustom((prev) => ({
      ...prev,
      [section]: (prev[section] ?? []).filter((i) => i.id !== id),
    }));
    setDoneIds((prev) => prev.filter((x) => x !== id));
  };

  const editCustom = (section: SectionKey, id: number, text: string, emoji: string, targetSection: SectionKey, prep: TenHPrep | undefined) => {
    const item = (custom[section] ?? []).find((i) => i.id === id);
    if (item?.linkedTaskId != null) {
      setTasks((prev) => prev.map((tsk) => (tsk.id === item.linkedTaskId ? { ...tsk, text } : tsk)));
    }
    if (targetSection !== section) {
      // Moving to another section — drop it from this one and append it to the target's.
      setCustom((prev) => {
        const moved = (prev[section] ?? []).find((i) => i.id === id);
        if (!moved) return prev;
        const updated = { ...moved, text, emoji: emoji || undefined, prep };
        return {
          ...prev,
          [section]: (prev[section] ?? []).filter((i) => i.id !== id),
          [targetSection]: [...(prev[targetSection] ?? []), updated],
        };
      });
      return;
    }
    setCustom((prev) => ({
      ...prev,
      [section]: (prev[section] ?? []).map((i) => i.id === id ? { ...i, text, emoji: emoji || undefined, prep } : i),
    }));
  };

  const reorderCustom = (section: SectionKey, items: CustomItem[]) => {
    setCustom((prev) => ({ ...prev, [section]: items }));
  };

  const addSubtask = (id: number, text: string) => {
    const subId = nextId;
    setNextId((n) => n + 1);
    setCustom((prev) => {
      const next = { ...prev };
      for (const key of SECTION_KEYS) {
        next[key] = (prev[key] ?? []).map((item) =>
          item.id === id
            ? { ...item, subtasks: [...(item.subtasks ?? []), { id: subId, text, done: false }] }
            : item
        );
      }
      return next;
    });
  };

  const toggleSubtask = (id: number, subtaskId: number) => {
    setCustom((prev) => {
      const next = { ...prev };
      for (const key of SECTION_KEYS) {
        next[key] = (prev[key] ?? []).map((item) =>
          item.id === id
            ? { ...item, subtasks: (item.subtasks ?? []).map((s) => s.id === subtaskId ? { ...s, done: !s.done } : s) }
            : item
        );
      }
      return next;
    });
  };

  const deleteSubtask = (id: number, subtaskId: number) => {
    setCustom((prev) => {
      const next = { ...prev };
      for (const key of SECTION_KEYS) {
        next[key] = (prev[key] ?? []).map((item) =>
          item.id === id
            ? { ...item, subtasks: (item.subtasks ?? []).filter((s) => s.id !== subtaskId) }
            : item
        );
      }
      return next;
    });
  };

  return (
    <div className="steady-card bg-card rounded-2xl p-5 border border-border">
      <h2 className="mb-1 text-foreground text-lg">{t.routines.heading}</h2>
      <p className="text-muted-foreground mb-4" style={{ fontSize: "0.95rem" }}>{t.routines.description}</p>
      <div className="space-y-3">
        {SECTION_KEYS.map((key) => (
          <SectionPanel
            key={key}
            sectionKey={key}
            doneIds={doneIds}
            onToggle={toggleDone}
            customItems={custom[key] ?? []}
            tasks={tasks}
            onAddCustom={(text, linkToTasks, emoji, recurrence, prep) => addCustom(key, text, linkToTasks, emoji, recurrence, prep)}
            onEditCustom={(id, text, emoji, targetSection, prep) => editCustom(key, id, text, emoji, targetSection, prep)}
            onReorderCustom={(items) => reorderCustom(key, items)}
            onDeleteCustom={(id) => deleteCustom(key, id)}
            onAddSubtask={addSubtask}
            onToggleSubtask={toggleSubtask}
            onDeleteSubtask={deleteSubtask}
          />
        ))}
      </div>
    </div>
  );
}
