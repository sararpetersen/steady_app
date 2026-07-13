import { useState } from "react";
import { useLang } from "../i18n/LangContext";
import { Plus, X, CheckCircle2, Pencil, Check, ChevronUp, ChevronDown } from "lucide-react";

export interface Task {
  id: number;
  text: string;
  done: boolean;
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
  const [newText, setNewText] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  const toggle = (id: number) =>
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task,
      ),
    );

  const remove = (id: number) =>
    setTasks((prev) => prev.filter((task) => task.id !== id));

  const move = (index: number, offset: -1 | 1) => {
    setTasks((prev) => {
      const nextIndex = index + offset;
      if (nextIndex < 0 || nextIndex >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return next;
    });
  };

  const startEditing = (task: Task) => {
    setEditingId(task.id);
    setEditText(task.text);
  };

  const saveEdit = (id: number) => {
    const text = editText.trim();
    if (!text) return;
    setTasks((prev) => prev.map((task) => task.id === id ? { ...task, text } : task));
    setEditingId(null);
  };

  const add = () => {
    const trimmed = newText.trim();
    if (!trimmed) return;
    setTasks((prev) => [
      ...prev,
      { id: nextId, text: trimmed, done: false },
    ]);
    setNextId((n) => n + 1);
    setNewText("");
  };

  const remaining = tasks.filter((task) => !task.done).length;

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
        <div className="text-center py-6 space-y-1">
          <p className="text-foreground" style={{ fontWeight: 700 }}>{t.tasks.emptyTitle}</p>
          <p className="text-muted-foreground" style={{ fontSize: "0.88rem" }}>{t.tasks.emptySubtitle}</p>
        </div>
      )}

      <div className="space-y-2 mb-4">
        {tasks.map((task, index) => (
          <div
            key={task.id}
            className="flex items-center gap-3 rounded-xl p-3 hover:brightness-95"
            style={{
              backgroundColor: task.done
                ? "var(--surface-2)"
                : "var(--surface-1)",
            }}
          >
            <button
              onClick={() => toggle(task.id)}
              className="flex-shrink-0 rounded-full border-2 flex items-center justify-center"
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
              aria-label={
                task.done
                  ? t.tasks.markIncomplete
                  : t.tasks.markComplete
              }
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
            </button>
            {editingId === task.id ? (
              <input autoFocus value={editText} onChange={(e) => setEditText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") saveEdit(task.id); if (e.key === "Escape") setEditingId(null); }} className="flex-1 min-w-0 rounded-lg px-2 py-1 border border-primary bg-input-background text-foreground outline-none" />
            ) : (
              <span className="flex-1 text-foreground" style={{ textDecoration: task.done ? "line-through" : "none", opacity: task.done ? 0.5 : 1 }}>{task.text}</span>
            )}
            <div className="flex items-center gap-0.5 flex-shrink-0">
              <button onClick={() => move(index, -1)} disabled={index === 0} className="text-muted-foreground p-1 rounded-lg disabled:opacity-25" aria-label={`${t.tasks.moveUp}: ${task.text}`}><ChevronUp size={16} /></button>
              <button onClick={() => move(index, 1)} disabled={index === tasks.length - 1} className="text-muted-foreground p-1 rounded-lg disabled:opacity-25" aria-label={`${t.tasks.moveDown}: ${task.text}`}><ChevronDown size={16} /></button>
              <button onClick={() => editingId === task.id ? saveEdit(task.id) : startEditing(task)} className="text-muted-foreground hover:text-primary p-1 rounded-lg" aria-label={`${editingId === task.id ? t.tasks.saveEdit : t.tasks.edit}: ${task.text}`}>{editingId === task.id ? <Check size={16} /> : <Pencil size={15} />}</button>
            <button
              onClick={() => remove(task.id)}
              className="text-muted-foreground hover:text-destructive p-1 rounded-lg"
              style={{ transition: "color 0.15s" }}
              aria-label={`${t.tasks.remove}: ${task.text}`}
            >
              <X size={16} />
            </button>
            </div>
          </div>
        ))}
      </div>

      {tasks.length > 0 && remaining === 0 && (
        <div
          className="rounded-xl px-4 py-3 flex items-center gap-3 mb-4"
          style={{ backgroundColor: "var(--green-bg)" }}
        >
          <CheckCircle2
            size={20}
            style={{
              color: "var(--green-text)",
              flexShrink: 0,
            }}
          />
          <p
            style={{
              color: "var(--green-text)",
              fontWeight: 700,
              fontSize: "0.95rem",
            }}
          >
            {t.tasks.allDoneMessage}
          </p>
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
    </div>
  );
}
