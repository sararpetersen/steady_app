// Shared "this item is done/checked off" text dimming, used alongside a strikethrough across
// Tasks, Routines, and Emergency Stock. Kept at one shared value so the degree of de-emphasis
// reads consistently across features, and picked high enough that even the tightest color
// pairing in the app (green-text on green-bg, muted-foreground on surface backgrounds) still
// clears a 3:1 contrast floor in both light and dark mode rather than fading past legibility.
export const DONE_TEXT_OPACITY = 0.8;
