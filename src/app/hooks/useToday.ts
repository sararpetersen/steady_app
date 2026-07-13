import { useEffect, useState } from "react";

function todayKey() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function msUntilNextMidnight() {
  const now = new Date();
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 5);
  return next.getTime() - now.getTime();
}

/** Returns today's date key (YYYY-MM-DD) and re-renders consumers when the day rolls over. */
export function useToday() {
  const [today, setToday] = useState(todayKey());

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const scheduleNext = () => {
      timeoutId = setTimeout(() => {
        setToday(todayKey());
        scheduleNext();
      }, msUntilNextMidnight());
    };
    scheduleNext();

    const onVisible = () => {
      if (document.visibilityState === "visible") setToday(todayKey());
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  return today;
}
