import { useState } from "react";
import { useLang } from "../i18n/LangContext";
import { Plus, X, CheckCircle2 } from "lucide-react";

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

  const toggle = (id: number) =>
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task,
      ),
    );

  const remove = (id: number) =>
    setTasks((prev) => prev.filter((task) => task.id !== id));

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
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-foreground">{t.tasks.heading}</h3>
        {tasks.length > 0 && remaining === 0 ? (
          <span
            className="rounded-full px-3 py-1 flex items-center gap-1.5"
            style={{
              backgroundColor: "var(--green-bg)",
              color: "var(--green-text)",
              fontSize: "0.85rem",
              fontWeight: 700,
            }}
          >
            <CheckCircle2 size={14} />
            All done!
          </span>
        ) : (
          <span
            className="rounded-full px-3 py-1"
            style={{
              backgroundColor: "var(--green-bg)",
              color: "var(--green-text)",
              fontSize: "0.85rem",
              fontWeight: 700,
            }}
          >
            {remaining} {t.tasks.left}
          </span>
        )}
      </div>
      <p
        className="text-muted-foreground mb-4"
        style={{ fontSize: "0.95rem" }}
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
        {tasks.map((task) => (
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
              className={`flex-shrink-0 rounded-full border-2 flex items-center justify-center${task.done ? " task-checked" : ""}`}
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
            <span
              className="flex-1 text-foreground"
              style={{
                textDecoration: task.done
                  ? "line-through"
                  : "none",
                opacity: task.done ? 0.5 : 1,
              }}
            >
              {task.text}
            </span>
            <button
              onClick={() => remove(task.id)}
              className="text-muted-foreground hover:text-destructive p-1 rounded-lg"
              style={{ transition: "color 0.15s" }}
              aria-label={t.tasks.remove}
            >
              <X size={16} />
            </button>
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
            Everything on your list is done — great work! 🎉
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
          className="flex-1 rounded-xl px-4 py-3 border border-border bg-input-background text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
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