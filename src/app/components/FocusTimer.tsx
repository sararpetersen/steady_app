import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { useLang } from "../i18n/LangContext";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useToday } from "../hooks/useToday";

const PRESET_SECONDS = [5 * 60, 15 * 60, 25 * 60, 45 * 60];
const PRESET_LABELS = ["5 min", "15 min", "25 min", "45 min"];

export function FocusTimer() {
  const t = useLang();
  const today = useToday();
  const [total, setTotal] = useState(25 * 60);
  const [remaining, setRemaining] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [sessionCounts, setSessionCounts] = useLocalStorage<Record<string, number>>("steady-focus-sessions", {});
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const todaySessionCount = sessionCounts[today] ?? 0;

  // Counts a completed session once per finish, so the companion can say "this is your Nth session today".
  useEffect(() => {
    if (done) {
      setSessionCounts((prev) => ({ ...prev, [today]: (prev[today] ?? 0) + 1 }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setRemaining((r) => {
          if (r <= 1) {
            clearInterval(intervalRef.current!);
            setRunning(false);
            setDone(true);
            return 0;
          }
          return r - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current!);
    }
    return () => clearInterval(intervalRef.current!);
  }, [running]);

  const reset = (seconds?: number) => {
    clearInterval(intervalRef.current!);
    const s = seconds ?? total;
    setTotal(s);
    setRemaining(s);
    setRunning(false);
    setDone(false);
  };

  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");
  const progress = remaining / total;
  const circumference = 2 * Math.PI * 52;
  const strokeDash = circumference * progress;

  const companionMessage = progress > 0.66 ? t.focus.companion.early : progress > 0.33 ? t.focus.companion.mid : t.focus.companion.late;

  return (
    <>
      <div
        className="steady-card rounded-2xl p-5 border-2"
        style={{
          backgroundColor: "var(--card)",
          borderColor: running ? "var(--primary)" : done ? "var(--purple-vivid)" : "var(--border)",
          transition: "border-color 0.4s",
        }}
      >
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-foreground text-lg">{t.focus.heading}</h2>
          {running && (
            <span
              className="flex items-center gap-1.5 rounded-full px-3 py-1"
              style={{ backgroundColor: "var(--green-bg)", color: "var(--green-text)", fontSize: "0.78rem", fontWeight: 700 }}
            >
              <span style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: "var(--primary)", display: "inline-block" }} />
              {t.focus.focusing}
            </span>
          )}
        </div>
        <p className="text-muted-foreground mb-5" style={{ fontSize: "0.95rem" }}>
          {t.focus.description}
        </p>

        {/* Presets — hidden while running to reduce distraction */}
        {!running && !done && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
            {PRESET_SECONDS.map((s, i) => (
              <button
                key={s}
                onClick={() => reset(s)}
                aria-pressed={total === s}
                className="w-full rounded-xl px-4 py-2.5 border-2 hover:opacity-80"
                style={{
                  backgroundColor: total === s ? "var(--primary)" : "var(--surface-1)",
                  borderColor: total === s ? "var(--primary)" : "var(--border)",
                  color: total === s ? "var(--primary-foreground)" : "var(--foreground)",
                  fontWeight: total === s ? 800 : 600,
                  transition: "all 0.15s",
                }}
              >
                {PRESET_LABELS[i]}
              </button>
            ))}
          </div>
        )}

        <div className="flex flex-col items-center gap-5">
          <div className="relative" style={{ width: 148, height: 148 }}>
            <svg width="148" height="148" viewBox="0 0 148 148" aria-hidden="true">
              <circle cx="74" cy="74" r="60" fill="none" stroke="var(--surface-2)" strokeWidth="11" />
              <circle
                cx="74"
                cy="74"
                r="60"
                fill="none"
                stroke={done ? "var(--purple-vivid)" : "var(--primary)"}
                strokeWidth="11"
                strokeDasharray={`${strokeDash * (60 / 52)} ${circumference * (60 / 52)}`}
                strokeLinecap="round"
                transform="rotate(-90 74 74)"
                style={{ transition: "stroke-dasharray 0.5s ease" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
              <span
                role="timer"
                aria-label={t.focus.timerRemaining(mm, ss)}
                style={{
                  fontSize: running ? "1.7rem" : "1.7rem",
                  fontWeight: 800,
                  fontFamily: "inherit",
                  color: done ? "var(--purple-vivid)" : "var(--foreground)",
                  transition: "font-size 0.2s",
                  lineHeight: 1,
                }}
              >
                {mm}:{ss}
              </span>
              {running && (
                <span
                  style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--green-text)", letterSpacing: "0.08em", textTransform: "uppercase" }}
                >
                  {t.focus.running}
                </span>
              )}
            </div>
          </div>

          {running && (
            <div
              className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 w-full"
              style={{ backgroundColor: "var(--green-bg)" }}
            >
              <motion.img
                src="/sprout2.webp"
                alt=""
                aria-hidden="true"
                style={{ width: 30, height: 30, objectFit: "contain", flexShrink: 0 }}
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
              />
              <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--green-text)" }}>{companionMessage}</p>
            </div>
          )}

          {done && (
            <div className="flex flex-col items-center gap-1">
              <p style={{ fontWeight: 700, color: "var(--purple-vivid)", fontSize: "1rem" }}>{t.focus.done}</p>
              <p style={{ fontSize: "0.82rem", color: "var(--muted-foreground)" }}>{t.focus.companion.sessionCount(todaySessionCount)}</p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => setRunning((r) => !r)}
              aria-label={running ? t.focus.pause : t.focus.start}
              className="flex items-center gap-2 rounded-xl px-6 py-3 bg-primary text-primary-foreground hover:opacity-90"
              style={{
                fontWeight: 700,
                transition: "opacity 0.15s",
                minWidth: 120,
                justifyContent: "center",
              }}
            >
              {running ? <Pause size={18} /> : <Play size={18} />}
              {running ? t.focus.pause : t.focus.start}
            </button>
            <button
              onClick={() => reset()}
              className="flex items-center gap-2 rounded-xl px-4 py-3 border border-border text-foreground hover:bg-muted"
              style={{ fontWeight: 600, transition: "background-color 0.15s" }}
            >
              <RotateCcw size={18} />
              {t.focus.reset}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
