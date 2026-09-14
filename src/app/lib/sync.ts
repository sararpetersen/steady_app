import { supabase } from "./supabaseClient";

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

interface SteadyUserDataRow {
  profile: unknown;
  profile_photo: string | null;
  tasks: unknown;
  task_next_id: number;
  tasks_date: string | null;
  habits: unknown;
  mood_history: unknown;
  notes: unknown;
  notes_next_id: number;
  routines_done: unknown;
  routines_done_date: string | null;
  routines_custom: unknown;
  routines_next_id: number;
  onboarded: boolean;
  important_dates: unknown;
  date_reminders_enabled: boolean;
  focus_sessions: unknown;
  meal_guide_items: unknown;
  meal_guide_next_id: number;
  updated_at?: string;
}

const LAST_SYNCED_KEY = "steady-last-synced-at";
const PENDING_PUSH_KEY = "steady-pending-push";

// Marks that local data has changed since the last confirmed push — set synchronously
// (a plain localStorage write, not delayed like the actual network push) the moment a
// tracked field changes, so it survives even if the tab closes before the debounced or
// beforeunload push gets a chance to run or complete. Checked on the next load so that
// device's pending change gets a chance to reach the server before a pull can silently
// discard it — the bug this exists to close: add a task, close the tab within the
// debounce window, reopen, and the pull-on-load fetches the still-old server row and
// overwrites the local addition with no trace it ever happened.
export function markPendingPush() {
  try {
    localStorage.setItem(PENDING_PUSH_KEY, "1");
  } catch {
    /* ignore */
  }
}

export function hasPendingPush(): boolean {
  try {
    return localStorage.getItem(PENDING_PUSH_KEY) === "1";
  } catch {
    return false;
  }
}

function clearPendingPush() {
  try {
    localStorage.removeItem(PENDING_PUSH_KEY);
  } catch {
    /* ignore */
  }
}

export type SyncFailureReason = "remote-newer" | "request-failed";
export type SyncResult<T> =
  | { ok: true; value: T }
  | { ok: false; reason: SyncFailureReason };

export function getLastSyncedAt(): string | null {
  return readJSON<string | null>(LAST_SYNCED_KEY, null);
}

function setLastSyncedAt(iso: string) {
  writeJSON(LAST_SYNCED_KEY, iso);
}

// The exact set of keys that make up the synced row (mirrors collectLocalRow/applyRowToLocal
// below) — exported so useLocalStorage can mark a pending push precisely on writes to these
// keys only. Plenty of other steady-* keys exist (active tab, dismissed-nudge flags, the
// onboarding step, auth state itself) that are real localStorage but never synced; marking
// pending for those would just make every load attempt a pointless push, and — since a push
// bumps the row's updated_at even when nothing synced actually changed — could reintroduce
// the false "newer data on another device" conflict this app has already chased down twice.
export const SYNCED_KEYS = new Set([
  "steady-profile",
  "steady-profile-photo",
  "steady-tasks",
  "steady-task-nextid",
  "steady-tasks-date",
  "steady-habits-v2",
  "steady-mood-history",
  "steady-notes",
  "steady-notes-nextid",
  "steady-routines-done",
  "steady-routines-done-date",
  "steady-routines-custom",
  "steady-routines-nextid",
  "steady-onboarded",
  "steady-important-dates",
  "steady-date-reminders-enabled",
  "steady-focus-sessions",
  "steady-meal-guide-items-v3",
  "steady-meal-guide-next-id-v3",
]);

function collectLocalRow(): SteadyUserDataRow {
  return {
    profile: readJSON("steady-profile", {}),
    profile_photo: readJSON<string | null>("steady-profile-photo", null),
    tasks: readJSON("steady-tasks", []),
    task_next_id: readJSON("steady-task-nextid", 1),
    tasks_date: readJSON<string | null>("steady-tasks-date", null),
    habits: readJSON("steady-habits-v2", []),
    mood_history: readJSON("steady-mood-history", []),
    notes: readJSON("steady-notes", []),
    notes_next_id: readJSON("steady-notes-nextid", 1),
    routines_done: readJSON("steady-routines-done", []),
    routines_done_date: readJSON<string | null>("steady-routines-done-date", null),
    routines_custom: readJSON("steady-routines-custom", { morning: [], afternoon: [], late: [] }),
    routines_next_id: readJSON("steady-routines-nextid", 100),
    onboarded: readJSON("steady-onboarded", false),
    important_dates: readJSON("steady-important-dates", []),
    date_reminders_enabled: readJSON("steady-date-reminders-enabled", true),
    focus_sessions: readJSON("steady-focus-sessions", {}),
    meal_guide_items: readJSON("steady-meal-guide-items-v3", []),
    meal_guide_next_id: readJSON("steady-meal-guide-next-id-v3", 0),
  };
}

function applyRowToLocal(row: SteadyUserDataRow) {
  writeJSON("steady-profile", row.profile);
  writeJSON("steady-profile-photo", row.profile_photo);
  writeJSON("steady-tasks", row.tasks);
  writeJSON("steady-task-nextid", row.task_next_id);
  writeJSON("steady-tasks-date", row.tasks_date);
  writeJSON("steady-habits-v2", row.habits);
  writeJSON("steady-mood-history", row.mood_history);
  writeJSON("steady-notes", row.notes);
  writeJSON("steady-notes-nextid", row.notes_next_id);
  writeJSON("steady-routines-done", row.routines_done);
  writeJSON("steady-routines-done-date", row.routines_done_date);
  writeJSON("steady-routines-custom", row.routines_custom);
  writeJSON("steady-routines-nextid", row.routines_next_id);
  writeJSON("steady-onboarded", row.onboarded);
  writeJSON("steady-important-dates", row.important_dates);
  writeJSON("steady-date-reminders-enabled", row.date_reminders_enabled);
  writeJSON("steady-focus-sessions", row.focus_sessions);
  writeJSON("steady-meal-guide-items-v3", row.meal_guide_items);
  writeJSON("steady-meal-guide-next-id-v3", row.meal_guide_next_id);
}

// A mobile browser tab backgrounded for a while stops running Supabase's auto-refresh
// timer, so its access token can quietly expire; the next request then fails with a 401
// that would otherwise be silent and permanent — no retry, no error surfaced to the user,
// just a change that never reaches the server. Refreshing the session once and retrying
// turns that into a same-tick recovery instead of a standing gap until something else
// happens to trigger a refresh.
async function refreshAndRetry<T>(attempt: () => PromiseLike<{ data: T; error: unknown }>) {
  const first = await attempt();
  if (!first.error) return first;
  await supabase.auth.refreshSession();
  return attempt();
}

export async function pushLocalToRemote(userId: string): Promise<SyncResult<void>> {
  const row = collectLocalRow();
  const lastSyncedAt = getLastSyncedAt();

  // Each account is stored as one full-row snapshot. Refuse to overwrite a snapshot
  // that another device has changed since this device last pulled or pushed it.
  if (lastSyncedAt) {
    const remote = await refreshAndRetry(() =>
      supabase.from("steady_user_data").select("updated_at").eq("user_id", userId).maybeSingle(),
    );
    if (remote.error) return { ok: false, reason: "request-failed" };
    if (remote.data?.updated_at && new Date(remote.data.updated_at).getTime() > new Date(lastSyncedAt).getTime()) {
      return { ok: false, reason: "remote-newer" };
    }
  }

  const updatedAt = new Date().toISOString();
  const { error } = await refreshAndRetry(() =>
    supabase.from("steady_user_data").upsert({ user_id: userId, ...row, updated_at: updatedAt }),
  );
  if (error) return { ok: false, reason: "request-failed" };
  setLastSyncedAt(updatedAt);
  clearPendingPush();
  return { ok: true, value: undefined };
}

export async function pullRemoteToLocal(userId: string): Promise<SyncResult<boolean>> {
  const { data, error } = await refreshAndRetry(() =>
    supabase.from("steady_user_data").select("*").eq("user_id", userId).maybeSingle(),
  );
  if (error) return { ok: false, reason: "request-failed" };
  if (!data) return { ok: true, value: false };
  const row = data as SteadyUserDataRow;
  applyRowToLocal(row);
  if (row.updated_at) setLastSyncedAt(row.updated_at);
  // Local now mirrors the server exactly, so any pending-push flag from before this pull
  // no longer refers to anything real — either it already reached the server (this row
  // reflects it) or it's been superseded by a genuinely newer remote copy, in which case
  // retrying that stale push would be pointless.
  clearPendingPush();
  return { ok: true, value: true };
}
