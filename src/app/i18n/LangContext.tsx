import { createContext, useContext } from "react";
import { translations, type T, type Lang } from "./translations";

export const LangContext = createContext<T>(translations.en);

export function useLang(): T {
  return useContext(LangContext);
}

export type { T, Lang };
