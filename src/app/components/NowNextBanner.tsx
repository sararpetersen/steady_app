import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useLang } from "../i18n/LangContext";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useToday } from "../hooks/useToday";
import { SECTION_KEYS, SECTION_ICONS, type CustomMap, type CustomItem, type SectionKey } from "./Routines";
import { isTaskScheduledToday, type Task } from "./TaskList";

interface Props {
  tasks: Task[];
}

interface FlatStep {
  sectionKey: SectionKey;
  item: CustomItem;
}

export function NowNextBanner({ tasks }: Props) {
  const t = useLang();
  const today = useToday();
  const [custom] = useLocalStorage<CustomMap>("steady-routines-custom", { morning: [], afternoon: [], late: [] });
  const [doneIds] = useLocalStorage<number[]>("steady-routines-done", []);
  const [doneDate] = useLocalStorage<string | null>("steady-routines-done-date", null);
  const [hardDayIds] = useLocalStorage<number[]>("steady-routines-hardday", []);

  // Mirrors Routines.tsx's own per-step hard-day override so the banner and the Routines
  // list never disagree about which version of a step's text is currently showing.
  const displayText = (item: CustomItem) => (hardDayIds.includes(item.id) && item.hardDayText ? item.hardDayText : item.text);

  // Routines.tsx owns the actual rollover write (resetting doneIds at midnight) — this just
  // reads defensively so the banner never shows yesterday's completions before that effect
  // has had a chance to run, without racing it by writing here too.
  const effectiveDoneIds = doneDate === today ? doneIds : [];

  const isDone = (item: CustomItem) => {
    if (item.linkedTaskId != null) {
      const linked = tasks.find((tsk) => tsk.id === item.linkedTaskId);
      if (linked) return linked.done;
    }
    return effectiveDoneIds.includes(item.id);
  };

  // A step linked to a recurring task only belongs here on the days that task is actually
  // due — same rule Routines.tsx uses — otherwise a "Tue/Thu/Sun only" step would show up
  // as today's "Right now" on every other day too, as long as it hadn't been marked done.
  const isScheduledToday = (item: CustomItem) => {
    if (item.linkedTaskId == null) return true;
    const linked = tasks.find((tsk) => tsk.id === item.linkedTaskId);
    return !linked || isTaskScheduledToday(linked, today);
  };

  const allSteps: FlatStep[] = SECTION_KEYS.flatMap((sectionKey) =>
    (custom[sectionKey] ?? []).filter(isScheduledToday).map((item) => ({ sectionKey, item }))
  );

  if (allSteps.length === 0) return null;

  const incomplete = allSteps.filter(({ item }) => !isDone(item));

  if (incomplete.length === 0) {
    return (
      <div className="steady-card bg-card rounded-2xl p-4 border border-border flex items-center gap-3">
        <CheckCircle2 size={20} style={{ color: "var(--primary)" }} aria-hidden="true" />
        <p className="text-foreground" style={{ fontSize: "0.92rem" }}>{t.overview.nowNext.allDone}</p>
      </div>
    );
  }

  const [now, next] = incomplete;

  return (
    <div className="steady-card bg-card rounded-2xl p-4 border border-border">
      <div className="flex items-center gap-3">
        <span className="flex-shrink-0" style={{ color: "var(--green-text)" }} aria-hidden="true">
          {SECTION_ICONS[now.sectionKey]}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-muted-foreground" style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.02em" }}>
            {t.overview.nowNext.nowLabel}
          </p>
          <p className="text-foreground truncate" style={{ fontWeight: 700, fontSize: "1.02rem" }}>
            {now.item.emoji && <span aria-hidden="true">{now.item.emoji} </span>}
            {displayText(now.item)}
          </p>
        </div>
      </div>
      {next && (
        <div className="flex items-center gap-3 mt-3 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
          <ArrowRight size={16} className="flex-shrink-0" style={{ color: "var(--muted-foreground)" }} aria-hidden="true" />
          <div className="flex-1 min-w-0">
            <p className="text-muted-foreground" style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.02em" }}>
              {t.overview.nowNext.nextLabel}
            </p>
            <p className="text-muted-foreground truncate" style={{ fontSize: "0.9rem" }}>
              {next.item.emoji && <span aria-hidden="true">{next.item.emoji} </span>}
              {displayText(next.item)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
