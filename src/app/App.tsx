import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { MotionConfig } from "motion/react";
import { MoodCheck } from "./components/MoodCheck";
import { TaskList, type Task, isTaskScheduledToday } from "./components/TaskList";
import { Routines } from "./components/Routines";
import { NowNextBanner } from "./components/NowNextBanner";
import { UpcomingDateReminder } from "./components/UpcomingDateReminder";
import { HabitTracker, type Habit } from "./components/HabitTracker";
import { DailyNote } from "./components/DailyNote";
import { NotesNudge } from "./components/NotesNudge";
import { MorePage } from "./components/MorePage";
import { Profile } from "./components/Profile";
import { DEFAULT_PROFILE, type ProfileData } from "./components/profileTypes";
import { PersonalizedTip } from "./components/PersonalizedTip";
import { Onboarding } from "./components/Onboarding";
import { SettingsPage } from "./components/SettingsPage";
import { AuthPage, type AuthState } from "./components/AuthPage";
import { FeedbackForm } from "./components/FeedbackForm";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useToday } from "./hooks/useToday";
import { supabase } from "./lib/supabaseClient";
import { pushLocalToRemote, pullRemoteToLocal } from "./lib/sync";
import { LangContext } from "./i18n/LangContext";
import { translations } from "./i18n/translations";
import { DEFAULT_A11Y } from "./components/a11yTypes";
import { LayoutDashboard, ClipboardList, Repeat2, Sprout, UserCircle2, NotebookPen, Settings, CalendarDays, MoreHorizontal, Sun, Moon, MessageCircle } from "lucide-react";
import { SteadyWordmark } from "./components/SteadyWordmark";
import { IconButton } from "./components/ui/IconButton";
import { APP_NAME } from "./version";

{
  /* MARKER-MAKE-KIT-INVOKED */
}

// Today's growth is relative to how many habits *this* person tracks, not a fixed count —
// so it scales whether someone has 2 habits or 8, and resets fresh each day (no streak logic).
type TodayGrowthStageKey = "seed" | "sprouting" | "blooming" | "fullBloom";

function getTodaysGrowthStageKey(done: number, total: number): TodayGrowthStageKey {
  if (total === 0 || done === 0) return "seed";
  const ratio = done / total;
  if (ratio >= 1) return "fullBloom";
  if (ratio >= 0.5) return "blooming";
  return "sprouting";
}

// The lifetime stat keeps climbing past "fullBloom" instead of freezing there forever —
// grove/forest give the emoji (and not just the raw number) somewhere to keep growing.
type LifetimeGrowthStageKey = TodayGrowthStageKey | "grove" | "forest";

const GROWTH_STAGE_EMOJI: Record<LifetimeGrowthStageKey, string> = {
  seed: "🌱",
  sprouting: "🌿",
  blooming: "🌸",
  fullBloom: "🌳",
  grove: "🌳🌿",
  forest: "🌲🌳",
};

// The lifetime "Habit growth" counter never resets, so its stage can climb through
// milestones as the all-time total rises — separate from today's ratio above.
function getHabitGrowthStageKey(total: number): LifetimeGrowthStageKey {
  if (total >= 250) return "forest";
  if (total >= 100) return "grove";
  if (total >= 50) return "fullBloom";
  if (total >= 25) return "blooming";
  if (total >= 10) return "sprouting";
  return "seed";
}

export default function App() {
  const [authState, setAuthState] = useLocalStorage<AuthState | null>("steady-auth-state", null);
  const [forceAuth, setForceAuth] = useState(() => new URLSearchParams(window.location.search).has("start"));
  const [onboarded, setOnboarded] = useLocalStorage("steady-onboarded", false);
  const [activeTab, setActiveTab] = useLocalStorage("steady-active-tab", "overview");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [rawProfile, setProfile] = useLocalStorage<ProfileData>("steady-profile", DEFAULT_PROFILE);
  const [profilePhoto, setProfilePhoto] = useLocalStorage<string | null>("steady-profile-photo", null);

  // The mobile header+nav switched from `position: sticky` to `fixed` (below) so iOS
  // Safari's elastic overscroll bounce can't drag it away from the top edge and briefly
  // reveal page content above it. Fixed elements are removed from document flow though, so
  // this measures its real rendered height (which varies with the avatar photo or larger
  // accessibility font sizes) and applies it as a spacer's height, keeping page content from
  // sliding underneath it.
  const mobileNavRef = useRef<HTMLDivElement>(null);
  const [mobileNavHeight, setMobileNavHeight] = useState(0);
  useLayoutEffect(() => {
    const el = mobileNavRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setMobileNavHeight(entry.contentRect.height));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // While a freshly-authenticated (non-guest) session is still pulling its remote data down,
  // hold off on the `!onboarded` check below — otherwise a real returning user briefly flashes
  // onto the Onboarding screen (this device's local "onboarded" is still its stale/default
  // value) before the pull finishes and reloads the page with their actual synced data.
  const [syncingRemote, setSyncingRemote] = useState(() => {
    if (!authState || authState.isGuest || !authState.userId) return false;
    return !sessionStorage.getItem(`steady-pulled-${authState.userId}`);
  });

  const today = useToday();

  // Task state lifted here so Overview stats stay in sync with the TaskList
  const [tasks, setTasks] = useLocalStorage<Task[]>("steady-tasks", []);
  const [nextId, setNextId] = useLocalStorage<number>("steady-task-nextid", 1);
  const [tasksDate, setTasksDate] = useLocalStorage<string | null>("steady-tasks-date", null);

  // "Daily" recurrence duplicated what Routines already does, so it's no longer offered
  // when creating/editing a task — but existing daily tasks shouldn't just vanish or break.
  // Converting them to "every day of the week" (weekly, all 7 days) keeps the exact same
  // firing behavior under the surviving recurrence type, one time, on load.
  useEffect(() => {
    setTasks((prev) => {
      let changed = false;
      const next = prev.map((task) => {
        if (task.recurrence !== "daily") return task;
        changed = true;
        return {
          ...task,
          recurrence: "weekly" as const,
          weeklyWeekdays: [0, 1, 2, 3, 4, 5, 6],
          weeklyIntervalWeeks: 1,
          weeklyAnchorDate: task.recurrenceStartDate ?? today,
        };
      });
      return changed ? next : prev;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Completed one-off tasks clear at rollover so the list doesn't grow forever, but
  // unfinished ones carry over — nothing gets silently forgotten just because the day
  // changed before you got to it. Recurring tasks are never removed: "daily" ones reset
  // to undone every rollover, "weekly" ones only reset on their chosen weekday(s) (and,
  // if set, only every Nth week), and "monthly" ones only reset on their chosen day(s)-of-month.
  useEffect(() => {
    if (tasksDate !== today) {
      setTasks((prev) =>
        prev
          .filter((task) => !task.done || task.recurrence)
          .map((task) => {
            if (!task.recurrence) return task;
            // Drop yesterday-or-earlier "delete just today" entries — only today's (if any)
            // is ever meaningful, so this keeps the array from growing forever.
            const prunedSkips = task.skippedDates?.filter((d) => d >= today);
            const pruned = prunedSkips?.length !== task.skippedDates?.length
              ? { ...task, skippedDates: prunedSkips }
              : task;
            if (!pruned.done) return pruned;
            if (!isTaskScheduledToday(pruned, today)) return pruned;
            return {
              ...pruned,
              done: false,
              subtasks: pruned.subtasks?.map((s) => ({ ...s, done: false })),
            };
          }),
      );
      setTasksDate(today);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [today]);

  // Reset habits' doneToday when the day rolls over. Done here (always mounted) rather than
  // inside HabitTracker, since HabitTracker only mounts when its tab is active and would
  // otherwise leave stale doneToday flags until the user happens to visit that tab.
  useEffect(() => {
    try {
      const raw = localStorage.getItem("steady-habits-v2");
      if (!raw) return;
      const data = JSON.parse(raw) as Habit[];
      if (!Array.isArray(data)) return;
      let changed = false;
      const next = data.map((h) => {
        if (h.doneToday && h.lastCompletedDate !== today) {
          changed = true;
          return { ...h, doneToday: false };
        }
        return h;
      });
      if (changed) localStorage.setItem("steady-habits-v2", JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, [today]);

  // Same rollover reset for routine steps checked off for the day.
  useEffect(() => {
    try {
      const raw = localStorage.getItem("steady-routines-done-date");
      const doneDate = raw !== null ? (JSON.parse(raw) as string) : null;
      if (doneDate !== today) {
        localStorage.setItem("steady-routines-done", JSON.stringify([]));
        localStorage.setItem("steady-routines-done-date", JSON.stringify(today));
      }
    } catch {
      /* ignore */
    }
  }, [today]);

  // Habit stats — habits live in HabitTracker's own localStorage-backed state, so we re-read
  // on tab/day change AND on "steady-habits-changed" (fired by HabitTracker on every edit) —
  // otherwise checking off the last habit while staying on the Habits tab wouldn't be noticed
  // until some later tab switch, badly delaying the 100%-completion celebration below.
  const [habitsDone, setHabitsDone] = useState(0);
  const [habitsTotal, setHabitsTotal] = useState(0);
  const [habitGrowth, setHabitGrowth] = useState(0);
  useEffect(() => {
    const syncHabitStats = () => {
      try {
        const raw = localStorage.getItem("steady-habits-v2");
        if (!raw) return;
        const data = JSON.parse(raw) as Habit[];
        if (!Array.isArray(data)) return;
        setHabitsDone(data.filter((h) => h.doneToday).length);
        setHabitsTotal(data.length);
        setHabitGrowth(data.reduce((sum, h) => sum + (h.totalCompletions ?? 0), 0));
      } catch {
        /* ignore */
      }
    };
    syncHabitStats();
    window.addEventListener("steady-habits-changed", syncHabitStats);
    return () => window.removeEventListener("steady-habits-changed", syncHabitStats);
  }, [activeTab, today]);

  // Celebrate hitting 100% once per day — a one-off moment, not a permanent card.
  const [celebratedDate, setCelebratedDate] = useLocalStorage<string | null>("steady-growth-celebrated-date", null);
  const [showCelebration, setShowCelebration] = useState(false);
  // Deliberately NOT depending on `today`: when the day rolls over, habitsDone/habitsTotal
  // still hold yesterday's (possibly 100%) values for one render, before the reset effects
  // above catch up — depending on `today` here fired this effect on that stale render and
  // wrongly re-celebrated. Habit toggles already change habitsDone/habitsTotal directly,
  // so this still re-checks correctly once those settle.
  // Startup/day-boundary check: celebratedDate can only legitimately equal today if today's
  // habits were genuinely all completed at some point. A past version of the rollover logic
  // could write celebratedDate = today without that ever being true, permanently blocking
  // the real celebration for the rest of the day. Heal that — but only once per calendar day
  // (tracked by `today`, not "ever"), so intentionally unchecking a habit after a genuine
  // celebration doesn't re-arm it for a second same-day fire. Re-arming per-day (rather than
  // once per app lifetime) matters because the day can roll over without a fresh page load —
  // e.g. a laptop asleep with the tab already open — so a fresh mount isn't the only moment
  // this needs to run.
  const lastHealedForDateRef = useRef<string | null>(null);
  useEffect(() => {
    if (lastHealedForDateRef.current === today || habitsTotal === 0) return;
    lastHealedForDateRef.current = today;
    if (celebratedDate === today && habitsDone !== habitsTotal) {
      setCelebratedDate(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [habitsTotal, habitsDone, celebratedDate, today, setCelebratedDate]);

  useEffect(() => {
    if (habitsTotal > 0 && habitsDone === habitsTotal && celebratedDate !== today) {
      setCelebratedDate(today);
      setShowCelebration(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [habitsDone, habitsTotal, celebratedDate, setCelebratedDate]);

  useEffect(() => {
    if (!showCelebration) return;
    const timer = window.setTimeout(() => setShowCelebration(false), 4000);
    return () => window.clearTimeout(timer);
  }, [showCelebration]);

  const profile: ProfileData = {
    ...DEFAULT_PROFILE,
    ...rawProfile,
    a11y: { ...DEFAULT_A11Y, ...(rawProfile.a11y ?? {}) },
  };

  const t = translations[profile.a11y.language ?? "en"];

  // Migrate old localStorage profile missing required fields
  useEffect(() => {
    if (!rawProfile.sensory || !rawProfile.support || !rawProfile.a11y) {
      setProfile(profile);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Apply all accessibility settings globally
  useEffect(() => {
    const root = document.documentElement;
    const a11y = profile.a11y;
    // "Extra large" was removed as a pickable option — its 24px root size broke enough
    // fixed-size layout (icon buttons, badges, nav labels) across the app that it did more
    // harm than good. Clamp it to "large" here so anyone who already had it saved self-heals
    // instead of silently keeping the broken size forever.
    const fontSizes = { normal: "17px", large: "20px" };
    root.style.setProperty("--font-size", fontSizes[a11y.fontSize as "normal" | "large"] ?? fontSizes.large);
    const readable = a11y.font === "readable";
    root.style.setProperty("--app-font-body", readable ? "'Atkinson Hyperlegible', sans-serif" : "'Nunito Sans', 'Nunito', sans-serif");
    root.style.setProperty("--app-font-heading", readable ? "'Atkinson Hyperlegible', sans-serif" : "'Nunito', sans-serif");
    root.style.setProperty("--app-line-height", a11y.lineSpacing === "spacious" ? "1.9" : "1.5");
    document.documentElement.lang = a11y.language ?? "en";
    root.classList.toggle("reduce-motion", a11y.reduceMotion);
    root.classList.toggle("dark", a11y.darkMode);
    root.style.colorScheme = a11y.darkMode ? "dark" : "light";
    if (a11y.highContrast) {
      root.style.setProperty("--foreground", a11y.darkMode ? "#FFFFFF" : "#111111");
      root.style.setProperty("--muted-foreground", a11y.darkMode ? "#CCCCCC" : "#444444");
      root.style.setProperty("--border", a11y.darkMode ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)");
    } else {
      root.style.removeProperty("--foreground");
      root.style.removeProperty("--muted-foreground");
      root.style.removeProperty("--border");
    }
  }, [profile.a11y]);

  const handleSignOut = () => {
    setSettingsOpen(false);
    setActiveTab("overview");
    setAuthState(null);
    supabase.auth.signOut();
  };

  const closeSettings = () => {
    setSettingsOpen(false);
    setActiveTab("overview");
  };

  // When a guest converts to a real account, their local data is the source of
  // truth and must be pushed up rather than overwritten by a pull.
  const justConvertedRef = useRef(false);

  const handleAuthUpdate = (newEmail: string, userId: string, justSignedUp?: boolean) => {
    if (justSignedUp) justConvertedRef.current = true;
    setAuthState({ email: newEmail, isGuest: false, userId });
  };

  // Sync: when a real (non-guest) session starts, either push the freshly
  // converted guest's local data up, or pull the account's existing remote data down.
  // A pull writes straight to localStorage (bypassing React state), so once it lands we
  // reload — guarded per-session so we don't loop — to make every useLocalStorage-backed
  // field (tasks, profile, onboarded, ...) pick up the newly synced values.
  useEffect(() => {
    if (!authState || authState.isGuest || !authState.userId) {
      setSyncingRemote(false);
      return;
    }
    const userId = authState.userId;
    let cancelled = false;
    (async () => {
      if (justConvertedRef.current) {
        justConvertedRef.current = false;
        setSyncingRemote(false);
        await pushLocalToRemote(userId);
        return;
      }
      const syncedFlag = `steady-pulled-${userId}`;
      if (sessionStorage.getItem(syncedFlag)) {
        setSyncingRemote(false);
        return;
      }
      const pulled = await pullRemoteToLocal(userId);
      if (cancelled) return;
      sessionStorage.setItem(syncedFlag, "1");
      if (pulled) {
        window.location.reload();
        return; // stay in the syncing state — the reload takes over from here
      }
      // No remote row yet for this account — push current local state up.
      await pushLocalToRemote(userId);
      if (!cancelled) setSyncingRemote(false);
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authState?.userId]);

  // Ongoing sync: debounce-push whenever tracked top-level state changes (tasks, profile, etc.).
  // Deliberately NOT keyed on `activeTab` or `today`: neither is synced data (activeTab isn't
  // even a field on the remote row), so including them here just meant switching tabs — or the
  // date ticking over — re-pushed whatever this device's local copy happens to hold, with no
  // pull-first check. On an idle/secondary device that's often a stale copy, so normal
  // navigation was silently re-clobbering fresher changes just pushed from another device
  // (the actual cause of "my changes don't show up on the other device").
  useEffect(() => {
    if (!authState || authState.isGuest || !authState.userId) return;
    const userId = authState.userId;
    const timeout = setTimeout(() => {
      pushLocalToRemote(userId);
    }, 1500);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authState?.userId, tasks, nextId, tasksDate, rawProfile, profilePhoto, onboarded]);

  // Habits/notes/routines are written directly to localStorage by their own tabs rather
  // than through top-level state, so also push periodically and when the tab loses focus
  // to make sure those changes eventually reach the account.
  //
  // Deliberately push-only — no background pull, no reload. A pull that finds newer remote
  // data overwrites this device's ENTIRE local state (there's no field-level merge), which
  // in practice meant background syncing could silently cancel or remove whatever you were
  // doing on a device, no matter how carefully the timing was guarded. That kept happening
  // in ways that were more disruptive than useful, so this device now only ever pushes its
  // own changes up; it picks up other devices' changes on next sign-in, not continuously.
  useEffect(() => {
    if (!authState || authState.isGuest || !authState.userId) return;
    const userId = authState.userId;
    const interval = setInterval(() => {
      pushLocalToRemote(userId);
    }, 30000);
    const onHide = () => pushLocalToRemote(userId);
    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") onHide();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("beforeunload", onHide);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("beforeunload", onHide);
    };
  }, [authState?.userId, authState?.isGuest]);

  const clearAllData = () => {
    setTasks([]);
    setNextId(1);
    localStorage.setItem("steady-habits-v2", JSON.stringify([]));
    localStorage.setItem("steady-mood-history", JSON.stringify([]));
    localStorage.setItem("steady-notes", JSON.stringify([]));
    localStorage.setItem("steady-notes-nextid", JSON.stringify(1));
    localStorage.setItem("steady-routines-done", JSON.stringify([]));
    localStorage.setItem("steady-routines-custom", JSON.stringify({ morning: [], afternoon: [], late: [] }));
    localStorage.setItem("steady-routines-nextid", JSON.stringify(100));
    localStorage.setItem("steady-important-dates", JSON.stringify([]));
    localStorage.setItem("steady-personalize-dismissed", JSON.stringify(false));
    localStorage.setItem("steady-focus-sessions", JSON.stringify({}));
    localStorage.setItem("steady-meal-guide-items-v3", JSON.stringify([]));
    localStorage.setItem("steady-meal-guide-next-id-v3", JSON.stringify(0));
    localStorage.setItem("steady-stock-locations-v2", JSON.stringify([]));
  };

  const handleOnboardingComplete = (newProfile: ProfileData) => {
    setProfile(newProfile);
    clearAllData();
    setOnboarded(true);
  };

  if (!authState || forceAuth) {
    return (
      <AuthPage
        onAuth={(s, justSignedUp) => {
          setSettingsOpen(false);
          if (justSignedUp) justConvertedRef.current = true;
          if (!s.isGuest && s.userId && !justSignedUp) {
            setSyncingRemote(!sessionStorage.getItem(`steady-pulled-${s.userId}`));
          }
          setAuthState(s);
          if (forceAuth) {
            setForceAuth(false);
            window.history.replaceState({}, "", window.location.pathname);
          }
        }}
      />
    );
  }

  if (syncingRemote) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="min-h-screen flex flex-col items-center justify-center gap-3"
        style={{ backgroundColor: "var(--background)" }}
      >
        <SteadyWordmark height={28} className="opacity-70" aria-hidden="true" />
        <span className="text-muted-foreground" style={{ fontSize: "0.85rem" }}>{t.overview.syncingData}</span>
      </div>
    );
  }

  if (!onboarded) {
    return (
      <LangContext.Provider value={t}>
        <style>{`.reduce-motion * { transition: none !important; animation: none !important; } body { line-height: var(--app-line-height, 1.5); }`}</style>
        <MotionConfig reducedMotion={profile.a11y.reduceMotion ? "always" : "never"}>
          <Onboarding
            onComplete={handleOnboardingComplete}
            onSkip={() => setOnboarded(true)}
            isGuest={authState.isGuest}
            onRegister={(email, userId) => {
              justConvertedRef.current = true;
              setAuthState({ email, isGuest: false, userId });
            }}
            onPhotoChange={setProfilePhoto}
          />
        </MotionConfig>
      </LangContext.Provider>
    );
  }

  const tasksLeft = tasks.filter((task) => isTaskScheduledToday(task, today) && !task.done).length;

  const growthStageKey = getTodaysGrowthStageKey(habitsDone, habitsTotal);

  const TABS = [
    { key: "overview", label: t.nav.overview, icon: LayoutDashboard },
    { key: "tasks", label: t.nav.tasks, icon: ClipboardList },
    { key: "routines", label: t.nav.routines, icon: Repeat2 },
    { key: "habits", label: t.nav.habits, icon: Sprout },
    { key: "note", label: t.nav.note, icon: NotebookPen },
    { key: "profile", label: t.nav.profile, icon: UserCircle2 },
    { key: "more", label: t.nav.more, icon: MoreHorizontal },
  ];

  // Consistent circular avatar button — photo fills circle, emoji sits on tinted background
  const AvatarButton = () => (
    <button
      onClick={() => {
        setActiveTab("profile");
        setSettingsOpen(false);
      }}
      className="rounded-full flex items-center justify-center overflow-hidden hover:opacity-80"
      style={{
        width: 44,
        height: 44,
        backgroundColor: profilePhoto ? "transparent" : "var(--green-bg)",
        border: "2px solid var(--primary)",
        flexShrink: 0,
        transition: "opacity 0.15s",
      }}
      aria-label="Open profile"
    >
      {profilePhoto ? (
        <img src={profilePhoto} alt="Your profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        <span style={{ fontSize: "1.3rem", lineHeight: 1 }}>{profile.avatar}</span>
      )}
    </button>
  );

  const greeting = (() => {
    const h = new Date().getHours();
    const base = h < 12 ? t.greeting.morning : h < 17 ? t.greeting.afternoon : t.greeting.evening;
    return profile.name ? `${base}, ${profile.name}` : base;
  })();

  const dateStr = new Date(`${today}T00:00:00`).toLocaleDateString(t.dateLocale, { weekday: "short", day: "numeric", month: "short" });

  return (
    <LangContext.Provider value={t}>
      <style>{`
        .reduce-motion * { transition: none !important; animation: none !important; }
        body { line-height: var(--app-line-height, 1.5); }
        .steady-card { box-shadow: var(--shadow-card); }
        .nav-tab { transition: background-color 0.18s, color 0.18s; }
        .nav-tab-active { background-color: var(--green-bg); }
        .nav-tab-inactive:hover { background-color: var(--muted); }
        .nav-scroll { scrollbar-width: none; -ms-overflow-style: none; }
        .nav-scroll::-webkit-scrollbar { display: none; }

        @media (max-width: 360px) {
          .mood-label { display: none; }
        }
        @media (max-width: 320px) {
          .nav-tabs-row { padding-left: 4px; padding-right: 4px; gap: 0; }
        }
      `}</style>

      <MotionConfig reducedMotion={profile.a11y.reduceMotion ? "always" : "never"}>
      <div className="min-h-screen bg-background" style={{ fontFamily: "var(--app-font-body, 'Nunito Sans', sans-serif)" }}>
        {/* ── Desktop sidebar (lg+) ─────────────────────────────────── */}
        <aside
          aria-label="Sidebar navigation"
          className="hidden lg:flex flex-col fixed top-0 left-0 h-screen w-60 border-r border-border z-20"
          style={{ backgroundColor: "var(--card)" }}
        >
          {/* Brand */}
          <div className="px-4 pt-5 pb-4 border-b border-border space-y-3">
            <button
              onClick={() => {
                setActiveTab("overview");
                setSettingsOpen(false);
              }}
              className="flex flex-col items-start gap-1.5 rounded-xl w-full p-2 cursor-default text-left"
              aria-label="Go to Overview"
            >
              <SteadyWordmark height={26} className="transition-transform hover:scale-[1.04] cursor-pointer" />
              <p className="text-muted-foreground truncate w-full text-left" style={{ fontSize: "0.75rem", lineHeight: 1.3 }}>
                {greeting}
              </p>
            </button>

            {/* Prominent date chip */}
            <div
              className="flex items-center gap-2.5 rounded-2xl px-3 py-2.5 w-full"
              style={{ backgroundColor: "var(--green-bg)", border: "1.5px solid var(--border)" }}
            >
              <CalendarDays size={18} style={{ color: "var(--primary)", flexShrink: 0 }} />
              <div className="min-w-0">
                <p
                  style={{
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    color: "var(--muted-foreground)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    lineHeight: 1,
                    marginBottom: 8,
                  }}
                >
                  Today
                </p>
                <p style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--green-text)", lineHeight: 1.3 }} className="truncate">
                  {dateStr}
                </p>
              </div>
            </div>
          </div>

          {/* Vertical nav */}
          <nav className="flex-1 overflow-y-auto p-2 py-3 space-y-0.5">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.key && !settingsOpen;
              return (
                <button
                  key={tab.key}
                  onClick={() => {
                    setActiveTab(tab.key);
                    setSettingsOpen(false);
                  }}
                  className={`nav-tab w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left ${active ? "nav-tab-active" : "nav-tab-inactive"}`}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon
                    size={18}
                    style={{ color: active ? "var(--primary)" : "var(--muted-foreground)", flexShrink: 0 }}
                    strokeWidth={active ? 2.5 : 1.8}
                  />
                  <span
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: active ? 700 : 500,
                      color: active ? "var(--primary)" : "var(--muted-foreground)",
                      fontFamily: "var(--app-font-heading, Nunito)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "100%",
                    }}
                  >
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Bottom controls */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center justify-end gap-2">
              <IconButton
                size="lg"
                bordered
                onClick={() => setFeedbackOpen(true)}
                aria-label={t.feedback.open}
              >
                <MessageCircle size={18} />
              </IconButton>
              <IconButton
                size="lg"
                bordered
                onClick={() => setProfile({ ...profile, a11y: { ...profile.a11y, darkMode: !profile.a11y.darkMode } })}
                aria-label={profile.a11y.darkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {profile.a11y.darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </IconButton>
              <IconButton
                size="lg"
                bordered
                active={settingsOpen}
                style={{ backgroundColor: settingsOpen ? "var(--green-bg)" : undefined }}
                onClick={() => setSettingsOpen((open) => !open)}
                aria-label="Open settings"
                aria-pressed={settingsOpen}
              >
                <Settings size={18} />
              </IconButton>
              <AvatarButton />
            </div>
          </div>
        </aside>

        {/* ── Content area (offset on lg) ──────────────────────────── */}
        <div className="lg:pl-60 flex flex-col min-h-screen">
          {/* Mobile / tablet header + tab nav — hidden on lg. Both live inside one sticky
              wrapper so they always stick together as a unit; giving each its own sticky
              offset (a hardcoded top-[61px] for the nav) broke as soon as the header's real
              height differed from that guess — e.g. with a profile photo avatar or larger
              accessibility font sizes — letting the nav bar scroll up and cover the header. */}
          {/* `fixed` instead of `sticky`: on iOS Safari, a sticky element can get dragged
              along during the elastic overscroll bounce at the top of the page (scroll down
              then sharply back up), sliding it away from the top edge and revealing content
              above it before it snaps back. A fixed element is anchored to the viewport
              itself rather than the document's scroll position, so the bounce can't move it.
              The spacer div right after this reserves its height in normal flow instead. */}
          <div ref={mobileNavRef} className="fixed top-0 inset-x-0 z-10 lg:hidden" style={{ transform: "translateZ(0)", WebkitTransform: "translateZ(0)" }}>
          <header className="border-b border-border px-5 py-3" style={{ backgroundColor: "var(--card)" }}>
            <div className="max-w-xl mx-auto flex items-center justify-between gap-4">
              {/* Logo — clickable, goes to Overview */}
              <button
                onClick={() => {
                  setActiveTab("overview");
                  setSettingsOpen(false);
                }}
                className="flex flex-col items-start gap-1 rounded-xl min-w-0 p-2 cursor-default text-left"
                aria-label="Go to Overview"
              >
                <SteadyWordmark height={24} className="flex-shrink-0 transition-transform hover:scale-[1.04] cursor-pointer" />
                {/* items-start on the button (so the logo doesn't stretch full-width) means
                    this paragraph never gets a cross-axis width to truncate against on its
                    own — w-full gives it one explicitly, so truncate has a box to clip to
                    instead of rendering at its full natural width and overlapping the avatar
                    button next to it. Buttons default to text-align:center in the UA
                    stylesheet, which doesn't affect this box's position (that's set by flex
                    alignment) but does center the text glyphs within it — text-left overrides
                    that so the greeting's ink actually starts at the box's left edge too. */}
                <p className="text-muted-foreground truncate w-full text-left" style={{ fontSize: "0.78rem", lineHeight: 1.2 }}>
                  {greeting}
                </p>
              </button>
              <div className="flex items-center gap-2">
                <IconButton
                  size="lg"
                  onClick={() => setFeedbackOpen(true)}
                  aria-label={t.feedback.open}
                >
                  <MessageCircle size={20} />
                </IconButton>
                <IconButton
                  size="lg"
                  active={settingsOpen}
                  onClick={() => setSettingsOpen((o) => !o)}
                  aria-label="Open settings"
                  aria-pressed={settingsOpen}
                >
                  <Settings size={20} />
                </IconButton>
                <AvatarButton />
              </div>
            </div>
          </header>

          {/* Mobile / tablet tab navigation */}
          <nav
            aria-label="Tab navigation"
            className="border-b border-border"
            style={{ backgroundColor: "var(--card)" }}
          >
            <div className="nav-scroll overflow-x-auto">
              <div className="nav-tabs-row flex px-2 py-2 gap-0.5 max-w-xl mx-auto">
                {TABS.map((tab) => {
                  const Icon = tab.icon;
                  const active = activeTab === tab.key && !settingsOpen;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => {
                        setActiveTab(tab.key);
                        setSettingsOpen(false);
                      }}
                      className="flex-1 flex flex-col items-center gap-0.5 py-2 px-0 min-w-[44px] max-w-full"
                      aria-current={active ? "page" : undefined}
                    >
                      <Icon size={18} style={{ color: active ? "var(--primary)" : "var(--muted-foreground)" }} strokeWidth={active ? 2.5 : 1.8} />
                      <span
                        className="nav-tab-label"
                        style={{
                          fontSize: "0.65rem",
                          // Fixed weight (not bolder when active) so a label's rendered width
                          // never changes between tabs — active state reads from color and the
                          // icon's strokeWidth alone. A width change here was tipping "Routines"
                          // over into wrapping only when it became active, making the whole nav
                          // bar's height jump depending on which tab was selected.
                          fontWeight: 600,
                          color: active ? "var(--primary)" : "var(--muted-foreground)",
                          fontFamily: "var(--app-font-heading, Nunito)",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: "100%",
                        }}
                      >
                        {tab.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </nav>
          </div>
          <div aria-hidden="true" className="lg:hidden" style={{ height: mobileNavHeight }} />

          {/* Main content */}
          <main className="flex-1 w-full max-w-xl lg:max-w-2xl mx-auto px-4 pt-5 pb-8">
            {/* Visually hidden — gives screen readers a real page-level heading to navigate
                by, since the visible "Steady" wordmark is a decorative logo, not text. */}
            <h1 className="sr-only">
              {APP_NAME} – {settingsOpen ? t.settings.title : TABS.find((tab) => tab.key === activeTab)?.label}
            </h1>
            {settingsOpen ? (
              <SettingsPage
                settings={profile.a11y}
                onChange={(a11y) => setProfile({ ...profile, a11y })}
                onClose={closeSettings}
                onResetOnboarding={() => {
                  setOnboarded(false);
                  setSettingsOpen(false);
                }}
                onClearData={() => {
                  clearAllData();
                  setProfile({ ...DEFAULT_PROFILE, a11y: profile.a11y });
                }}
                auth={authState}
                onSignOut={handleSignOut}
                onAuthUpdate={handleAuthUpdate}
              />
            ) : (
              <div className="space-y-4">
                {activeTab === "overview" && (
                  <>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        {
                          label: t.overview.tasksLeft,
                          value: String(tasksLeft),
                          ariaLabel: undefined,
                          bg: "var(--green-bg)",
                          fg: "var(--green-text)",
                        },
                        {
                          label: t.overview.habitsDone,
                          value: habitsTotal > 0 ? `${habitsDone} / ${habitsTotal} ${GROWTH_STAGE_EMOJI[growthStageKey]}` : "–",
                          ariaLabel: habitsTotal > 0 ? `${habitsDone} of ${habitsTotal} habits done today` : undefined,
                          bg: "var(--purple-bg)",
                          fg: "var(--purple-text)",
                        },
                        {
                          label: t.overview.habitGrowth,
                          value: habitGrowth > 0 ? `${habitGrowth} ${GROWTH_STAGE_EMOJI[getHabitGrowthStageKey(habitGrowth)]}` : "–",
                          ariaLabel: habitGrowth > 0 ? `${habitGrowth} total habit check-ins` : "No habit check-ins yet",
                          bg: "var(--yellow-bg)",
                          fg: "var(--yellow-text)",
                        },
                      ].map((stat) => (
                        <div
                          key={stat.label}
                          className="steady-card rounded-2xl p-3 sm:p-4 flex flex-col items-center text-center border border-border"
                          style={{ backgroundColor: stat.bg }}
                        >
                          <span
                            aria-label={stat.ariaLabel}
                            style={{ fontWeight: 800, fontSize: "clamp(16px, 1.4rem, 20px)", color: stat.fg, lineHeight: 1.2 }}
                          >
                            {stat.value}
                          </span>
                          <span
                            style={{
                              fontSize: "11px",
                              color: stat.fg,
                              fontWeight: 600,
                              marginTop: 4,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              maxWidth: "100%",
                            }}
                          >
                            {stat.label}
                          </span>
                        </div>
                      ))}
                    </div>
                    <UpcomingDateReminder />
                    <NowNextBanner tasks={tasks} />
                    <MoodCheck />
                    <PersonalizedTip support={profile.support} sensory={profile.sensory} onPersonalize={() => setActiveTab("profile")} />
                    <NotesNudge onOpenNotes={() => setActiveTab("note")} />
                    <TaskList tasks={tasks} setTasks={setTasks} nextId={nextId} setNextId={setNextId} />
                  </>
                )}
                {activeTab === "tasks" && <TaskList tasks={tasks} setTasks={setTasks} nextId={nextId} setNextId={setNextId} />}
                {activeTab === "routines" && <Routines tasks={tasks} setTasks={setTasks} taskNextId={nextId} setTaskNextId={setNextId} />}
                {activeTab === "habits" && <HabitTracker />}
                {activeTab === "note" && <DailyNote />}
                {activeTab === "more" && <MorePage />}
                {activeTab === "profile" && <Profile profile={profile} onChange={setProfile} photo={profilePhoto} onPhotoChange={setProfilePhoto} />}
              </div>
            )}
          </main>
        </div>

        {showCelebration && (
          <div className="fixed bottom-6 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
            <div
              role="status"
              className="steady-card animate-in fade-in slide-in-from-bottom-4 duration-300 flex items-center gap-3 rounded-2xl px-5 py-3 border border-border"
              style={{ backgroundColor: "var(--orange-bg)" }}
            >
              <span style={{ fontSize: "1.5rem", flexShrink: 0 }} aria-hidden="true">{GROWTH_STAGE_EMOJI.fullBloom}</span>
              <p style={{ color: "var(--orange-text)", fontWeight: 700, fontSize: "0.9rem" }}>{t.overview.growthFullBloom}</p>
            </div>
          </div>
        )}

        <FeedbackForm open={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
      </div>
      </MotionConfig>
    </LangContext.Provider>
  );
}
