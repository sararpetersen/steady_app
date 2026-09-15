import { useCallback, useEffect, useState } from "react";
import { SYNCED_KEYS, markPendingPush } from "../lib/sync";

export function useLocalStorage<T>(
  key: string,
  initial: T
): [T, (v: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored !== null ? (JSON.parse(stored) as T) : initial;
    } catch {
      return initial;
    }
  });

  // Memoized so consumers can safely list the setter in a useEffect dependency array —
  // an unmemoized version is a *new function every render*, which makes React treat the
  // effect's deps as "changed" on every re-render regardless of whether the actual values
  // did, causing effects to re-fire far more often than intended (this caused the habit
  // "full bloom" celebration to wrongly re-fire around day rollover).
  const set = useCallback((v: T | ((prev: T) => T)) => {
    setValue((prev) => {
      const next = typeof v === "function" ? (v as (prev: T) => T)(prev) : v;
      try {
        localStorage.setItem(key, JSON.stringify(next));
        // Marked here, on the actual write, rather than from a component-level effect
        // watching the value — an effect fires on every mount/remount too (e.g. switching
        // tabs remounts HabitTracker), which would misreport "changed" far more often than
        // real edits happen. This only runs when a consumer actually calls the setter.
        if (SYNCED_KEYS.has(key)) markPendingPush();
      } catch {
        // storage full or unavailable — silently continue
      }
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // Keeps this tab's in-memory copy in sync with writes made in OTHER tabs of the same
  // origin — the browser only fires `storage` in tabs that did NOT make the change, never
  // the one that made it, so without this a second open tab's React state can drift
  // arbitrarily stale. That's not just cosmetic: if anything in the stale tab later calls
  // its OWN setter for the same key — even something unrelated to what changed, like a
  // daily-rollover effect re-saving the tasks list — it writes that stale in-memory copy
  // straight back to localStorage, silently overwriting whatever the other, active tab had
  // just saved. No error, no warning, just data that was there a moment ago and now isn't.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== key) return;
      try {
        setValue(e.newValue !== null ? (JSON.parse(e.newValue) as T) : initial);
      } catch {
        // malformed write from elsewhere — ignore rather than propagate garbage
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return [value, set];
}
