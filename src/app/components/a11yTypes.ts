import type { Lang } from "../i18n/translations";

export interface A11ySettings {
  fontSize: "normal" | "large" | "xlarge";
  font: "standard" | "readable";
  lineSpacing: "normal" | "spacious";
  reduceMotion: boolean;
  highContrast: boolean;
  darkMode: boolean;
  language: Lang;
}

export const DEFAULT_A11Y: A11ySettings = {
  fontSize: "normal",
  font: "standard",
  lineSpacing: "normal",
  reduceMotion: false,
  highContrast: false,
  darkMode: false,
  language: "en",
};
