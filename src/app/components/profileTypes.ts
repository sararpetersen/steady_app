import { type A11ySettings, DEFAULT_A11Y } from "./a11yTypes";

export interface ProfileData {
  name: string;
  pronoun: string;
  avatar: string;
  about: string;
  sensory: string[];
  support: string[];
  strengths: string[];
  a11y: A11ySettings;
}

export const DEFAULT_PROFILE: ProfileData = {
  name: "",
  pronoun: "",
  avatar: "🌱",
  about: "",
  sensory: [],
  support: [],
  strengths: [],
  a11y: DEFAULT_A11Y,
};

const LEGACY_DANISH_PRONOUNS: Record<string, string> = {
  "han/ham": "he/him",
  "hun/hende": "she/her",
  "de/dem": "they/them",
  "han/de": "he/they",
  "hun/de": "she/they",
  alle: "any/all",
};

export function normalizePronoun(pronoun: string) {
  return LEGACY_DANISH_PRONOUNS[pronoun] ?? pronoun;
}
