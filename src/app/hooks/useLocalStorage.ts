import { useCallback, useState } from "react";

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
      } catch {
        // storage full or unavailable — silently continue
      }
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return [value, set];
}
