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
    routines_custom: readJSON("steady-routines-custom", { morning: [], noon: [], afternoon: [], evening: [], late: [] }),
    routines_next_id: readJSON("steady-routines-nextid", 100),
    onboarded: readJSON("steady-onboarded", false),
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
}

export async function pushLocalToRemote(userId: string): Promise<void> {
  const row = collectLocalRow();
  await supabase
    .from("steady_user_data")
    .upsert({ user_id: userId, ...row, updated_at: new Date().toISOString() });
}

export async function pullRemoteToLocal(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("steady_user_data")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (error || !data) return false;
  applyRowToLocal(data as SteadyUserDataRow);
  return true;
}
