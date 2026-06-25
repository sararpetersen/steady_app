import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { SteadyLogo } from "./SteadyLogo";
import { translations } from "../i18n/translations";

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" style={{ flexShrink: 0 }}>
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const AppleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ flexShrink: 0 }}>
    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.4c1.32.07 2.23.73 2.99.78.93-.19 1.82-.83 3.24-.79 1.76.06 3.08.8 3.93 2.02-3.46 2.06-2.87 6.63.39 8.09-.61 1.41-1.4 2.77-2.55 3.78zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
  </svg>
);

export interface AuthState {
  email: string;
  isGuest: boolean;
}

interface StoredAccount {
  passwordHash: string;
}

import { hashPassword } from "../utils/crypto";

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

  const submit = async () => {
    setError("");
    if (!email.trim()) { setError(t.emailRequired); return; }
    if (password.length < 6) { setError(t.passwordTooShort); return; }

    const accounts = getAccounts();
    const passwordHash = await hashPassword(password);

    if (mode === "signup") {
      if (confirmPassword !== password) { setError(t.passwordsNoMatch); return; }
      if (accounts[email.toLowerCase()]) { setError(t.emailInUse); return; }
      accounts[email.toLowerCase()] = { passwordHash };
      saveAccounts(accounts);
      onAuth({ email: email.toLowerCase(), isGuest: false });
    } else {
      const stored = accounts[email.toLowerCase()];
      if (!stored || stored.passwordHash !== passwordHash) { setError(t.invalidCredentials); return; }
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
            role="alert"
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

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px" style={{ backgroundColor: "var(--border)" }} />
          <span className="text-muted-foreground" style={{ fontSize: "0.8rem" }}>or</span>
          <div className="flex-1 h-px" style={{ backgroundColor: "var(--border)" }} />
        </div>

        {/* Social buttons */}
        <div className="space-y-2.5">
          <button
            onClick={() => alert(t.socialComingSoon)}
            className="w-full flex items-center justify-center gap-3 rounded-2xl py-3 border hover:opacity-85"
            style={{ backgroundColor: "var(--card)", borderColor: "var(--border)", color: "var(--foreground)", fontWeight: 600, fontSize: "0.92rem", transition: "opacity 0.15s" }}
          >
            <GoogleIcon />
            {t.continueWithGoogle}
          </button>
          <button
            onClick={() => alert(t.socialComingSoon)}
            className="w-full flex items-center justify-center gap-3 rounded-2xl py-3 hover:opacity-85"
            style={{ backgroundColor: "var(--foreground)", color: "var(--background)", fontWeight: 600, fontSize: "0.92rem", transition: "opacity 0.15s" }}
          >
            <AppleIcon />
            {t.continueWithApple}
          </button>
        </div>

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
