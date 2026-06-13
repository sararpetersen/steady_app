import { useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useLang } from "../i18n/LangContext";
import { Save, ChevronDown, ChevronUp, Trash2 } from "lucide-react";

export interface NoteEntry {
  id: number;
  date: string; // "YYYY-MM-DD"
  text: string;
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function formatEntryDate(dateStr: string, locale: string, todayLabel: string): string {
  if (dateStr === todayKey()) return todayLabel;
  return new Date(dateStr).toLocaleDateString(locale, { weekday: "short", day: "numeric", month: "short" });
}

export function DailyNote() {
  const t = useLang();
  const [entries, setEntries] = useLocalStorage<NoteEntry[]>("steady-notes", []);
  const [nextId, setNextId] = useLocalStorage<number>("steady-notes-nextid", 1);
  const [saved, setSaved] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  const today = todayKey();
  const todayEntry = entries.find((e) => e.date === today);
  const [draft, setDraft] = useState(todayEntry?.text ?? "");

  const promptIndex = new Date().getDate() % t.note.prompts.length;

  const save = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    if (todayEntry) {
      setEntries((prev) => prev.map((e) => e.date === today ? { ...e, text: trimmed } : e));
    } else {
      setEntries((prev) => [...prev, { id: nextId, date: today, text: trimmed }]);
      setNextId((n) => n + 1);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const deleteEntry = (id: number) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const pastEntries = [...entries]
    .filter((e) => e.date !== today)
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-4">
      {/* Today's note */}
      <div className="steady-card bg-card rounded-2xl p-5 border border-border">
        <h3 className="mb-1 text-foreground">{t.note.heading}</h3>
        <p className="text-muted-foreground mb-1" style={{ fontSize: "0.95rem" }}>{t.note.description}</p>
        <p className="mb-3 rounded-xl px-4 py-3" style={{ backgroundColor: "var(--purple-bg)", fontSize: "0.95rem", color: "var(--purple-text)", fontStyle: "italic" }}>
          💭 {t.note.prompts[promptIndex]}
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
          <span className="text-muted-foreground" style={{ fontSize: "0.85rem" }}>{draft.length} {t.note.characters}</span>
          <button
            onClick={save}
            className="flex items-center gap-2 rounded-xl px-4 py-2 bg-primary text-primary-foreground hover:opacity-90"
            style={{ fontWeight: 700, transition: "opacity 0.15s" }}
          >
            <Save size={15} />
            {saved ? t.note.saved : t.note.save}
          </button>
        </div>
      </div>

      {/* Note history */}
      <div className="steady-card bg-card rounded-2xl border border-border overflow-hidden">
        <button
          onClick={() => setHistoryOpen((o) => !o)}
          className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted"
          style={{ transition: "background-color 0.15s" }}
        >
          <div>
            <p className="text-foreground text-left" style={{ fontWeight: 700 }}>{t.noteHistory.heading}</p>
            <p className="text-muted-foreground text-left" style={{ fontSize: "0.85rem" }}>
              {pastEntries.length} {pastEntries.length === 1 ? "entry" : "entries"}
            </p>
          </div>
          {historyOpen ? <ChevronUp size={18} className="text-muted-foreground" /> : <ChevronDown size={18} className="text-muted-foreground" />}
        </button>

        {historyOpen && (
          <div className="border-t border-border">
            {pastEntries.length === 0 ? (
              <p className="text-muted-foreground px-5 py-4" style={{ fontSize: "0.9rem" }}>{t.noteHistory.empty}</p>
            ) : (
              <div className="divide-y" style={{ borderColor: "var(--border)" }}>
                {pastEntries.map((entry) => (
                  <div key={entry.id} className="px-5 py-4 group">
                    <div className="flex items-center justify-between mb-1">
                      <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--primary)" }}>
                        {formatEntryDate(entry.date, t.dateLocale, t.noteHistory.today)}
                      </span>
                      <button
                        onClick={() => deleteEntry(entry.id)}
                        className="text-muted-foreground hover:text-destructive p-1 rounded-lg opacity-0 group-hover:opacity-100"
                        style={{ transition: "all 0.15s" }}
                        aria-label={t.noteHistory.deleteEntry}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <p className="text-foreground" style={{ fontSize: "0.9rem", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                      {entry.text}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
