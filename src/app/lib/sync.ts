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
  stock_locations: unknown;
  updated_at?: string;
}

const LAST_SYNCED_KEY = "steady-last-synced-at";

function getLastSyncedAt(): string | null {
  return readJSON<string | null>(LAST_SYNCED_KEY, null);
}

function setLastSyncedAt(iso: string) {
  writeJSON(LAST_SYNCED_KEY, iso);
}

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
    stock_locations: readJSON("steady-stock-locations-v2", []),
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
  writeJSON("steady-stock-locations-v2", row.stock_locations);
}

export async function pushLocalToRemote(userId: string): Promise<void> {
  const row = collectLocalRow();
  const updatedAt = new Date().toISOString();
  const { error } = await supabase
    .from("steady_user_data")
    .upsert({ user_id: userId, ...row, updated_at: updatedAt });
  // Record what our own push just made the server's timestamp — so a pull shortly after
  // (e.g. this same tab regaining focus) doesn't mistake our own change for a newer one
  // written elsewhere and reload for nothing.
  if (!error) setLastSyncedAt(updatedAt);
}

export async function pullRemoteToLocal(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("steady_user_data")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (error || !data) return false;
  const row = data as SteadyUserDataRow;
  applyRowToLocal(row);
  if (row.updated_at) setLastSyncedAt(row.updated_at);
  return true;
}

// Only applies the remote copy if it's actually newer than what this device last synced —
// used when the app regains focus, so switching back to a device you left open picks up
// changes made elsewhere without reloading (and discarding whatever's mid-edit) every time.
export async function pullIfNewer(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("steady_user_data")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (error || !data) return false;
  const row = data as SteadyUserDataRow;
  const localSyncedAt = getLastSyncedAt();
  if (row.updated_at && localSyncedAt && row.updated_at <= localSyncedAt) return false;
  applyRowToLocal(row);
  if (row.updated_at) setLastSyncedAt(row.updated_at);
  return true;
}
