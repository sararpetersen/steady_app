import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { SteadyLogo } from "./SteadyLogo";
import { translations } from "../i18n/translations";

export interface AuthState {
  email: string;
  isGuest: boolean;
}

interface StoredAccount {
  password: string;
}

function getAccounts(): Record<string, StoredAccount> {
  try { return JSON.parse(localStorage.getItem("steady-accounts") ?? "{}"); } catch { return {}; }
}

function saveAccounts(accounts: Record<string, StoredAccount>) {
  localStorage.setItem("steady-accounts", JSON.stringify(accounts));
}

interface Props {
  onAuth: (state: AuthState) => void;
}

export function AuthPage({ onAuth }: Props) {
  // Use English for the auth screen by default (no language selected yet)
  const t = translations["en"].auth;

  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const switchMode = (m: "signup" | "login") => {
    setMode(m);
    setError("");
  };

  const submit = () => {
    setError("");
    if (!email.trim()) { setError(t.emailRequired); return; }
    if (password.length < 6) { setError(t.passwordTooShort); return; }

    const accounts = getAccounts();

    if (mode === "signup") {
      if (confirmPassword !== password) { setError(t.passwordsNoMatch); return; }
      if (accounts[email.toLowerCase()]) { setError(t.emailInUse); return; }
      accounts[email.toLowerCase()] = { password };
      saveAccounts(accounts);
      onAuth({ email: email.toLowerCase(), isGuest: false });
    } else {
      const stored = accounts[email.toLowerCase()];
      if (!stored || stored.password !== password) { setError(t.invalidCredentials); return; }
      onAuth({ email: email.toLowerCase(), isGuest: false });
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-5 py-12"
      style={{ backgroundColor: "var(--background)", fontFamily: "var(--app-font-body, 'Nunito Sans', sans-serif)" }}
    >
      {/* Logo + wordmark */}
      <div className="flex items-center gap-3 mb-8">
        <div
          className="rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ width: 52, height: 52, backgroundColor: "var(--green-bg)", border: "2px solid var(--border)" }}
        >
          <SteadyLogo size={34} />
        </div>
        <span style={{ fontFamily: "var(--app-font-heading, Nunito)", fontWeight: 800, fontSize: "2rem", color: "var(--primary)", letterSpacing: "-0.02em" }}>
          Steady
        </span>
      </div>

      {/* Card */}
      <div
        className="w-full max-w-sm rounded-3xl p-7 border border-border steady-card space-y-5"
        style={{ backgroundColor: "var(--card)" }}
      >
        {/* Mode toggle */}
        <div
          className="flex rounded-2xl overflow-hidden border border-border"
          style={{ backgroundColor: "var(--surface-1)" }}
        >
          {(["signup", "login"] as const).map((m) => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              className="flex-1 py-2.5"
              style={{
                fontWeight: mode === m ? 700 : 500,
                backgroundColor: mode === m ? "var(--primary)" : "transparent",
                color: mode === m ? "var(--primary-foreground)" : "var(--muted-foreground)",
                fontSize: "0.92rem",
                transition: "all 0.15s",
                fontFamily: "var(--app-font-heading, Nunito)",
              }}
            >
              {m === "signup" ? t.signUp : t.logIn}
            </button>
          ))}
        </div>

        {/* Email */}
        <div>
          <label style={{ display: "block", fontSize: "0.88rem", fontWeight: 600, marginBottom: 6, color: "var(--foreground)" }}>
            {t.emailLabel}
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder={t.emailPlaceholder}
            autoComplete="email"
            className="w-full rounded-xl px-4 py-3 border border-border bg-input-background text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
            style={{ transition: "border-color 0.15s" }}
          />
        </div>

        {/* Password */}
        <div>
          <label style={{ display: "block", fontSize: "0.88rem", fontWeight: 600, marginBottom: 6, color: "var(--foreground)" }}>
            {t.passwordLabel}
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder={t.passwordPlaceholder}
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              className="w-full rounded-xl px-4 py-3 border border-border bg-input-background text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
              style={{ paddingRight: "2.75rem", transition: "border-color 0.15s" }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              style={{ transition: "color 0.15s" }}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </div>

        {/* Confirm password — sign-up only */}
        {mode === "signup" && (
          <div>
            <label style={{ display: "block", fontSize: "0.88rem", fontWeight: 600, marginBottom: 6, color: "var(--foreground)" }}>
              {t.confirmPasswordLabel}
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder={t.confirmPasswordPlaceholder}
              autoComplete="new-password"
              className="w-full rounded-xl px-4 py-3 border border-border bg-input-background text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
              style={{ transition: "border-color 0.15s" }}
            />
          </div>
        )}

        {/* Error message */}
        {error && (
          <p
            className="rounded-xl px-4 py-2.5"
            style={{ backgroundColor: "rgba(192,57,43,0.1)", color: "var(--destructive)", fontSize: "0.88rem", fontWeight: 600 }}
          >
            {error}
          </p>
        )}

        {/* Submit */}
        <button
          onClick={submit}
          className="w-full rounded-2xl py-3.5 bg-primary text-primary-foreground hover:opacity-90"
          style={{ fontWeight: 700, fontSize: "1rem", transition: "opacity 0.15s" }}
        >
          {mode === "signup" ? t.createAccount : t.logIn}
        </button>

        {/* Guest */}
        <button
          onClick={() => onAuth({ email: "", isGuest: true })}
          className="w-full text-center hover:text-foreground"
          style={{ fontSize: "0.88rem", color: "var(--muted-foreground)", transition: "color 0.15s" }}
        >
          {t.continueAsGuest}
        </button>
      </div>

      <p
        className="text-muted-foreground mt-6 text-center"
        style={{ fontSize: "0.76rem", maxWidth: 300, lineHeight: 1.6 }}
      >
        {t.localDataNote}
      </p>
    </div>
  );
}
