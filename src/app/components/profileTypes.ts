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
