import { useEffect, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useToday } from "../hooks/useToday";
import { useLang } from "../i18n/LangContext";
import { Save, Trash2, Check } from "lucide-react";

export interface NoteEntry {
  id: number;
  date: string; // "YYYY-MM-DD"
  text: string;
  prompt?: string; // the reflection prompt shown while writing this entry, if any
}

function formatEntryDate(dateStr: string, locale: string, todayLabel: string, today: string): string {
  if (dateStr === today) return todayLabel;
  return new Date(dateStr).toLocaleDateString(locale, { weekday: "short", day: "numeric", month: "short" });
}

export function DailyNote() {
  const t = useLang();
  const [entries, setEntries] = useLocalStorage<NoteEntry[]>("steady-notes", []);
  const [nextId, setNextId] = useLocalStorage<number>("steady-notes-nextid", 1);
  const [draft, setDraft] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState("");

  const today = useToday();
  const todayEntry = entries.find((e) => e.date === today);

  // A new day means a fresh, empty compose box — yesterday's writing already lives in the list below.
  useEffect(() => {
    setDraft("");
    setEditingId(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [today]);

  const promptIndex = new Date(`${today}T00:00:00`).getDate() % t.note.prompts.length;

  const save = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    const prompt = t.note.prompts[promptIndex];
    if (todayEntry) {
      setEntries((prev) => prev.map((e) => (e.date === today ? { ...e, text: trimmed, prompt } : e)));
    } else {
      setEntries((prev) => [...prev, { id: nextId, date: today, text: trimmed, prompt }]);
      setNextId((n) => n + 1);
    }
    setDraft("");
  };

  const deleteEntry = (id: number) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
    if (editingId === id) setEditingId(null);
  };

  const startEditing = (entry: NoteEntry) => {
    setEditingId(entry.id);
    setEditDraft(entry.text);
  };

  const saveEntryEdit = (id: number) => {
    const trimmed = editDraft.trim();
    if (!trimmed) return;
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, text: trimmed } : e)));
    setEditingId(null);
  };

  const historyEntries = [...entries].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-4">
      {/* Compose — only shown until today's note has been written */}
      {!todayEntry && (
        <div className="steady-card bg-card rounded-2xl p-5 border border-border">
          <h3 className="mb-1 text-foreground">{t.note.heading}</h3>
          <p className="text-muted-foreground mb-3" style={{ fontSize: "0.95rem" }}>
            {t.note.description}
          </p>
          <p
            className="mb-6 rounded-xl px-4 py-3"
            style={{ backgroundColor: "var(--purple-bg)", fontSize: "0.95rem", color: "var(--purple-text)", fontStyle: "italic" }}
          >
            <span aria-hidden="true">💭 </span>
            {t.note.prompts[promptIndex]}
          </p>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={t.note.placeholder}
            rows={5}
            className="w-full rounded-xl px-4 py-3 border border-border bg-input-background text-foreground placeholder:text-muted-foreground outline-none focus:border-primary resize-none"
            style={{ lineHeight: 1.7, transition: "border-color 0.15s" }}
          />
          <div className="flex items-center justify-between mt-3">
            <span className="text-muted-foreground" style={{ fontSize: "0.85rem" }}>
              {draft.length} {t.note.characters}
            </span>
            <button
              onClick={save}
              className="flex items-center gap-2 rounded-xl px-4 py-2 bg-primary text-primary-foreground hover:opacity-90"
              style={{ fontWeight: 700, transition: "opacity 0.15s" }}
            >
              <Save size={15} />
              {t.note.save}
            </button>
          </div>
        </div>
      )}

      {/* Notes list — today's entry (once written) plus everything before it */}
      <div className="steady-card bg-card rounded-2xl border border-border overflow-hidden">
        <div className="px-5 py-4">
          <p className="text-foreground" style={{ fontWeight: 700 }}>
            {t.noteHistory.heading}
          </p>
          <p className="text-muted-foreground" style={{ fontSize: "0.85rem" }}>
            {historyEntries.length} {historyEntries.length === 1 ? "entry" : "entries"}
          </p>
        </div>

        <div className="border-t border-border">
          {historyEntries.length === 0 ? (
            <div className="flex items-center gap-3 px-5 py-4">
              <img src="/sprout7.webp" alt="" aria-hidden="true" style={{ width: 48, height: 48, objectFit: "contain", flexShrink: 0 }} />
              <p className="text-muted-foreground" style={{ fontSize: "0.9rem" }}>
                {t.noteHistory.empty}
              </p>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: "var(--border)" }}>
              {historyEntries.map((entry) => {
                const label = formatEntryDate(entry.date, t.dateLocale, t.noteHistory.today, today);
                const editing = editingId === entry.id;
                return (
                  <div key={entry.id} className="px-5 py-4 group">
                    <div className="flex items-center justify-between mb-1">
                      <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--primary)" }}>
                        {label}
                      </span>
                      <div className="flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100" style={{ transition: "opacity 0.15s" }}>
                        <button
                          onClick={() => editing ? saveEntryEdit(entry.id) : startEditing(entry)}
                          className="text-muted-foreground hover:text-primary hover:bg-muted px-2.5 py-1.5 rounded-lg flex items-center justify-center"
                          style={{ fontSize: "0.78rem", fontWeight: 700 }}
                          aria-label={`${editing ? t.noteHistory.saveEntry : t.noteHistory.editEntry}: ${label}`}
                        >
                          {editing ? <Check size={14} /> : t.noteHistory.editLabel}
                        </button>
                        <button
                          onClick={() => deleteEntry(entry.id)}
                          className="text-muted-foreground hover:text-destructive hover:bg-muted p-2 rounded-lg"
                          aria-label={`${t.noteHistory.deleteEntry}: ${label}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    {entry.prompt && (
                      <p className="mb-1" style={{ fontSize: "0.78rem", fontStyle: "italic", color: "var(--purple-text)" }}>
                        <span aria-hidden="true">💭 </span>
                        {entry.prompt}
                      </p>
                    )}
                    {editing ? (
                      <textarea
                        autoFocus
                        value={editDraft}
                        onChange={(e) => setEditDraft(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Escape") setEditingId(null); }}
                        rows={3}
                        className="w-full rounded-xl px-3 py-2 border border-primary bg-input-background text-foreground outline-none resize-none"
                        style={{ fontSize: "0.9rem", lineHeight: 1.6 }}
                      />
                    ) : (
                      <p className="text-foreground" style={{ fontSize: "0.9rem", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                        {entry.text}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
