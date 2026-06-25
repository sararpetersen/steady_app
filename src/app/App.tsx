import { useEffect, useState } from "react";
import { MoodCheck } from "./components/MoodCheck";
import { TaskList, type Task } from "./components/TaskList";
import { Routines } from "./components/Routines";
import { HabitTracker, type Habit } from "./components/HabitTracker";
import { FocusTimer } from "./components/FocusTimer";
import { DailyNote } from "./components/DailyNote";
import { Profile, DEFAULT_PROFILE, type ProfileData } from "./components/Profile";
import { PersonalizedTip } from "./components/PersonalizedTip";
import { Onboarding } from "./components/Onboarding";
import { SettingsPage } from "./components/SettingsPage";
import { AuthPage, type AuthState } from "./components/AuthPage";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { LangContext } from "./i18n/LangContext";
import { translations } from "./i18n/translations";
import { DEFAULT_A11Y } from "./components/AccessibilityPanel";
import { LayoutDashboard, ClipboardList, Repeat2, Flame, UserCircle2, Timer, NotebookPen, Settings, CalendarDays } from "lucide-react";
import { SteadyLogo } from "./components/SteadyLogo";

{
  /* MARKER-MAKE-KIT-INVOKED */
}

export default function App() {
  const [authState, setAuthState] = useLocalStorage<AuthState | null>("steady-auth-state", null);
  const [forceAuth, setForceAuth] = useState(() =>
    new URLSearchParams(window.location.search).has("start")
  );
  const [onboarded, setOnboarded] = useLocalStorage("steady-onboarded", false);
  const [activeTab, setActiveTab] = useLocalStorage("steady-active-tab", "overview");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [rawProfile, setProfile] = useLocalStorage<ProfileData>("steady-profile", DEFAULT_PROFILE);
  const [profilePhoto, setProfilePhoto] = useLocalStorage<string | null>("steady-profile-photo", null);

  // Task state lifted here so Overview stats stay in sync with the TaskList
  const [tasks, setTasks] = useLocalStorage<Task[]>("steady-tasks", []);
  const [nextId, setNextId] = useLocalStorage<number>("steady-task-nextid", 1);

  // Habit stats — re-read from localStorage when tab changes (habits live in HabitTracker)
  const [habitsDone, setHabitsDone] = useState(0);
  const [habitsTotal, setHabitsTotal] = useState(0);
  const [streakDays, setStreakDays] = useState(0);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("steady-habits-v2");
      if (!raw) return;
      const data = JSON.parse(raw) as Habit[];
      if (!Array.isArray(data)) return;
      setHabitsDone(data.filter((h) => h.doneToday).length);
      setHabitsTotal(data.length);
      setStreakDays(data.length > 0 ? Math.max(...data.map((h) => h.streak)) : 0);
    } catch {
      /* ignore */
    }
  }, [activeTab]);

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
    const fontSizes = { normal: "17px", large: "20px", xlarge: "24px" };
    root.style.setProperty("--font-size", fontSizes[a11y.fontSize]);
    const readable = a11y.font === "readable";
    root.style.setProperty("--app-font-body", readable ? "'Atkinson Hyperlegible', sans-serif" : "'Nunito Sans', 'Nunito', sans-serif");
    root.style.setProperty("--app-font-heading", readable ? "'Atkinson Hyperlegible', sans-serif" : "'Nunito', sans-serif");
    root.style.setProperty("--app-line-height", a11y.lineSpacing === "spacious" ? "1.9" : "1.5");
    document.documentElement.lang = a11y.language ?? "en";
    root.classList.toggle("reduce-motion", a11y.reduceMotion);
    root.classList.toggle("dark", a11y.darkMode);
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
    setAuthState(null);
  };

  const handleAuthUpdate = (newEmail: string) => {
    setAuthState({ email: newEmail, isGuest: false });
  };

  const clearAllData = () => {
    setTasks([]);
    setNextId(1);
    localStorage.setItem("steady-habits-v2", JSON.stringify([]));
    localStorage.setItem("steady-mood-history", JSON.stringify([]));
    localStorage.setItem("steady-notes", JSON.stringify([]));
    localStorage.setItem("steady-notes-nextid", JSON.stringify(1));
    localStorage.setItem("steady-routines-done", JSON.stringify([]));
    localStorage.setItem("steady-routines-custom", JSON.stringify({ morning: [], afternoon: [], evening: [] }));
    localStorage.setItem("steady-routines-nextid", JSON.stringify(100));
  };

  const handleOnboardingComplete = (newProfile: ProfileData) => {
    setProfile(newProfile);
    clearAllData();
    setOnboarded(true);
  };

  if (!authState || forceAuth) {
    return <AuthPage onAuth={(s) => {
      setAuthState(s);
      if (forceAuth) {
        setForceAuth(false);
        window.history.replaceState({}, "", window.location.pathname);
      }
    }} />;
  }

  if (!onboarded) {
    return (
      <LangContext.Provider value={t}>
        <style>{`.reduce-motion * { transition: none !important; animation: none !important; } body { line-height: var(--app-line-height, 1.5); }`}</style>
        <Onboarding
          onComplete={handleOnboardingComplete}
          onSkip={() => setOnboarded(true)}
          isGuest={authState.isGuest}
          onRegister={(email) => setAuthState({ email, isGuest: false })}
        />
      </LangContext.Provider>
    );
  }

  const tasksLeft = tasks.filter((t) => !t.done).length;

  const TABS = [
    { key: "overview", label: t.nav.overview, icon: LayoutDashboard },
    { key: "tasks", label: t.nav.tasks, icon: ClipboardList },
    { key: "routines", label: t.nav.routines, icon: Repeat2 },
    { key: "habits", label: t.nav.habits, icon: Flame },
    { key: "focus", label: t.nav.focus, icon: Timer },
    { key: "note", label: t.nav.note, icon: NotebookPen },
    { key: "profile", label: t.nav.profile, icon: UserCircle2 },
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

  const dateStr = new Date().toLocaleDateString(t.dateLocale, { weekday: "short", day: "numeric", month: "short" });

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

        /* ── Tab content entrance ── */
        @keyframes fade-slide-up {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .tab-content { animation: fade-slide-up 0.22s ease-out both; }

        /* ── Stat card stagger ── */
        @keyframes pop-in {
          0%   { opacity: 0; transform: scale(0.93); }
          60%  { transform: scale(1.03); }
          100% { opacity: 1; transform: scale(1); }
        }
        .stat-card { animation: pop-in 0.28s cubic-bezier(0.34,1.56,0.64,1) both; }
        .stat-card:nth-child(1) { animation-delay: 0.04s; }
        .stat-card:nth-child(2) { animation-delay: 0.09s; }
        .stat-card:nth-child(3) { animation-delay: 0.14s; }

        /* ── Task checkbox pop ── */
        @keyframes check-pop {
          0%   { transform: scale(1); }
          35%  { transform: scale(0.75); }
          70%  { transform: scale(1.25); }
          100% { transform: scale(1); }
        }
        .task-checked { animation: check-pop 0.3s cubic-bezier(0.34,1.56,0.64,1); }

        /* ── Habit row bounce ── */
        @keyframes habit-bounce {
          0%   { transform: scale(1); }
          30%  { transform: scale(0.96); }
          65%  { transform: scale(1.03); }
          100% { transform: scale(1); }
        }

        .reduce-motion .tab-content,
        .reduce-motion .stat-card,
        .reduce-motion .task-checked,
        .reduce-motion .habit-bounce { animation: none !important; }

        @media (max-width: 360px) {
          .mood-label { display: none; }
        }
        @media (max-width: 320px) {
          .nav-tab-label { display: none; }
          .nav-tabs-row { padding-left: 4px; padding-right: 4px; gap: 0; }
        }
      `}</style>

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
              className="flex items-center gap-2.5 hover:opacity-80 rounded-xl w-full"
              style={{ transition: "opacity 0.15s" }}
              aria-label="Go to Overview"
            >
              <SteadyLogo size={30} />
              <div className="text-left min-w-0">
                <span
                  style={{
                    fontFamily: "var(--app-font-heading, Nunito)",
                    fontWeight: 800,
                    fontSize: "1.2rem",
                    color: "var(--primary)",
                    letterSpacing: "-0.02em",
                    display: "block",
                  }}
                >
                  Steady
                </span>
                <p className="text-muted-foreground truncate" style={{ fontSize: "0.75rem", lineHeight: 1.3 }}>
                  {greeting}
                </p>
              </div>
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
                    }}
                  >
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Bottom: settings + avatar */}
          <div className="p-4 border-t border-border space-y-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSettingsOpen((o) => !o)}
                className={`nav-tab flex-1 flex items-center justify-center gap-2 rounded-xl py-2 ${settingsOpen ? "nav-tab-active" : "nav-tab-inactive"}`}
                style={{ color: settingsOpen ? "var(--primary)" : "var(--muted-foreground)" }}
                aria-label="Open settings"
                aria-pressed={settingsOpen}
              >
                <Settings size={18} />
                <span style={{ fontSize: "0.88rem", fontWeight: settingsOpen ? 700 : 500, fontFamily: "var(--app-font-heading, Nunito)" }}>
                  {t.settings.title}
                </span>
              </button>
              <AvatarButton />
            </div>
          </div>
        </aside>

        {/* ── Content area (offset on lg) ──────────────────────────── */}
        <div className="lg:pl-60 flex flex-col min-h-screen">
          {/* Mobile / tablet header — hidden on lg */}
          <header className="sticky top-0 z-10 border-b border-border px-5 py-3 lg:hidden" style={{ backgroundColor: "var(--card)" }}>
            <div className="max-w-xl mx-auto flex items-center justify-between gap-4">
              {/* Logo — clickable, goes to Overview */}
              <button
                onClick={() => {
                  setActiveTab("overview");
                  setSettingsOpen(false);
                }}
                className="flex items-center gap-2.5 hover:opacity-80 rounded-xl min-w-0"
                style={{ transition: "opacity 0.15s" }}
                aria-label="Go to Overview"
              >
                <SteadyLogo size={30} className="flex-shrink-0" />
                <div className="text-left min-w-0">
                  <span
                    style={{
                      fontFamily: "var(--app-font-heading, Nunito)",
                      fontWeight: 800,
                      fontSize: "1.25rem",
                      color: "var(--primary)",
                      letterSpacing: "-0.02em",
                      display: "block",
                    }}
                  >
                    Steady
                  </span>
                  <p className="text-muted-foreground truncate" style={{ fontSize: "0.78rem", lineHeight: 1.2 }}>
                    {greeting}
                  </p>
                </div>
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSettingsOpen((o) => !o)}
                  className="rounded-xl p-2 hover:bg-muted"
                  style={{ transition: "background-color 0.15s", color: settingsOpen ? "var(--primary)" : "var(--muted-foreground)" }}
                  aria-label="Open settings"
                  aria-pressed={settingsOpen}
                >
                  <Settings size={20} />
                </button>
                <AvatarButton />
              </div>
            </div>
          </header>

          {/* Mobile / tablet tab navigation — hidden on lg */}
          <nav aria-label="Tab navigation" className="sticky top-[61px] z-10 border-b border-border lg:hidden" style={{ backgroundColor: "var(--card)" }}>
            <div className="nav-scroll overflow-x-auto">
              <div className="nav-tabs-row flex px-3 py-2 gap-1 max-w-xl mx-auto">
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
                      className="flex-1 flex flex-col items-center gap-0.5 py-2 px-1 min-w-[44px]"
                      aria-current={active ? "page" : undefined}
                    >
                      <Icon size={18} style={{ color: active ? "var(--primary)" : "var(--muted-foreground)" }} strokeWidth={active ? 2.5 : 1.8} />
                      <span
                        className="nav-tab-label"
                        style={{
                          fontSize: "0.65rem",
                          fontWeight: active ? 700 : 500,
                          color: active ? "var(--primary)" : "var(--muted-foreground)",
                          fontFamily: "var(--app-font-heading, Nunito)",
                          whiteSpace: "nowrap",
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

          {/* Main content */}
          <main className="flex-1 w-full max-w-xl lg:max-w-2xl mx-auto px-4 pt-5 pb-8">
            {settingsOpen ? (
              <SettingsPage
                settings={profile.a11y}
                onChange={(a11y) => setProfile({ ...profile, a11y })}
                onClose={() => setSettingsOpen(false)}
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
              <div key={activeTab} className="tab-content space-y-4">
                {activeTab === "overview" && (
                  <>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: t.overview.tasksLeft, value: String(tasksLeft), ariaLabel: undefined, bg: "var(--green-bg)", fg: "var(--green-text)" },
                        { label: t.overview.habitsDone, value: habitsTotal > 0 ? `${habitsDone} / ${habitsTotal}` : "–", ariaLabel: undefined, bg: "var(--purple-bg)", fg: "var(--purple-text)" },
                        { label: t.overview.streakDays, value: streakDays > 0 ? `${streakDays} 🔥` : "–", ariaLabel: streakDays > 0 ? `${streakDays} day streak` : "No streak yet", bg: "var(--yellow-bg)", fg: "var(--yellow-text)" },
                      ].map((stat) => (
                        <div
                          key={stat.label}
                          className="stat-card steady-card rounded-2xl p-3 sm:p-4 flex flex-col items-center text-center border border-border"
                          style={{ backgroundColor: stat.bg }}
                        >
                          <span aria-label={stat.ariaLabel} style={{ fontWeight: 800, fontSize: "clamp(16px, 1.4rem, 20px)", color: stat.fg, lineHeight: 1.2 }}>{stat.value}</span>
                          <span style={{ fontSize: "11px", color: stat.fg, fontWeight: 600, marginTop: 4, whiteSpace: "nowrap", overflow: "hidden", maxWidth: "100%" }}>{stat.label}</span>
                        </div>
                      ))}
                    </div>
                    <MoodCheck />
                    <PersonalizedTip support={profile.support} sensory={profile.sensory} />
                    <TaskList tasks={tasks} setTasks={setTasks} nextId={nextId} setNextId={setNextId} />
                  </>
                )}
                {activeTab === "tasks" && <TaskList tasks={tasks} setTasks={setTasks} nextId={nextId} setNextId={setNextId} />}
                {activeTab === "routines" && <Routines />}
                {activeTab === "habits" && <HabitTracker />}
                {activeTab === "focus" && <FocusTimer />}
                {activeTab === "note" && <DailyNote />}
                {activeTab === "profile" && <Profile profile={profile} onChange={setProfile} photo={profilePhoto} onPhotoChange={setProfilePhoto} />}
              </div>
            )}
          </main>
        </div>
      </div>
    </LangContext.Provider>
  );
}
