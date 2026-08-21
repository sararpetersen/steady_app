import { NotebookPen, X } from "lucide-react";
import { useLang } from "../i18n/LangContext";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { NoteEntry } from "./DailyNote";
import { IconButton } from "./ui/IconButton";

interface Props {
  onOpenNotes: () => void;
  suppressed?: boolean;
}

// Same pattern as PersonalizedTip's dismissible nudge — hides itself for good once the
// underlying feature has actually been used (an entry exists), not just once dismissed.
export function NotesNudge({ onOpenNotes, suppressed }: Props) {
  const t = useLang();
  const [entries] = useLocalStorage<NoteEntry[]>("steady-notes", []);
  const [dismissed, setDismissed] = useLocalStorage("steady-notes-nudge-dismissed", false);

  // Only one nudge-style card shows on Overview at a time — when the personalize nudge
  // (PersonalizedTip's yellow "get tips made for you" card) is also eligible to show,
  // it takes priority and this one waits its turn rather than stacking both.
  if (entries.length > 0 || dismissed || suppressed) return null;

  return (
    <div className="rounded-2xl p-4 border border-border flex items-start gap-3" style={{ backgroundColor: "var(--orange-bg)" }}>
      <NotebookPen size={18} style={{ color: "var(--orange-text)", flexShrink: 0, marginTop: 2 }} aria-hidden="true" />
      <div className="flex-1 min-w-0">
        <p style={{ fontWeight: 700, color: "var(--orange-text)", marginBottom: 2 }}>{t.overview.notesNudgeTitle}</p>
        <p style={{ color: "var(--orange-text)", fontSize: "0.88rem", lineHeight: 1.5, marginBottom: 10 }}>{t.overview.notesNudgeText}</p>
        <button
          onClick={onOpenNotes}
          className="rounded-lg px-3 py-1.5 hover:opacity-90"
          style={{ fontSize: "0.82rem", fontWeight: 700, backgroundColor: "var(--foreground)", color: "var(--background)" }}
        >
          {t.overview.notesNudgeButton}
        </button>
      </div>
      <IconButton size="sm" onClick={() => setDismissed(true)} aria-label={t.overview.notesNudgeDismiss}>
        <X size={14} />
      </IconButton>
    </div>
  );
}
