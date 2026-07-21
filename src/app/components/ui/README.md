# Steady UI primitives

Shared, presentational components used across the app's list-based screens (Habits, Tasks, Routines, Important Dates, Onboarding, Profile, Settings). Extracted from duplicated markup — see each component for the exact call sites it replaced.

Live, interactive states for all of these: run `npm run dev` and visit `/dev/gallery` (dev-only, stripped from production builds — see `src/main.tsx`).

---

## ReorderRow

Wraps `motion/react`'s `Reorder.Item` with the drag-handle affordance (grip icon, cursor, touch handling) that every draggable list uses.

Must be rendered inside a `Reorder.Group`.

```tsx
<Reorder.Group axis="y" values={items} onReorder={setItems}>
  {items.map((item) => (
    <ReorderRow key={item.id} value={item} dragDisabled={editingId === item.id}>
      {/* row content */}
    </ReorderRow>
  ))}
</Reorder.Group>
```

| Prop | Type | Default | Notes |
|---|---|---|---|
| `value` | `T` | — | The item this row represents (passed straight to `Reorder.Item`). |
| `dragDisabled` | `boolean` | `false` | Set while the row is in inline-edit mode, so a drag gesture doesn't fight text selection. |
| `className` | `string` | `"flex items-center gap-1 group relative"` | Override when a row needs different layout (e.g. Tasks' flat row with no absolute-positioned actions). |
| `style` | `CSSProperties` | — | For per-row dynamic styling (e.g. Tasks' done/not-done background color). |
| `handleSize` | `number` | `19` | Routines uses `18` to match its slightly denser rows. |

Used in: `HabitTracker`, `TaskList`, `Routines`, `ImportantDates`.

---

## IconButton

Every icon-only button in the app — edit/save toggles, delete buttons, the note-toggle, password-visibility toggle, and the round nav-level toggles (dark mode, settings) — is one of four `size` × four `tone` combinations.

```tsx
<IconButton size="md" tone="destructive" onClick={remove} aria-label="Delete task">
  <X size={16} />
</IconButton>
```

| Prop | Type | Default | Notes |
|---|---|---|---|
| `size` | `"sm" \| "md" \| "pill" \| "lg"` | `"sm"` | `sm`/`md` — square icon buttons in list rows. `pill` — same but with room for a text label (edit/save toggles). `lg` — 44px round, for nav-level toggles. |
| `tone` | `"none" \| "default" \| "primary" \| "destructive"` | `"default"` | Controls the hover text color. `none` — no hover color change, just `hover:bg-muted` (used by the note-toggle, whose color is driven entirely by `active`). |
| `bordered` | `boolean` | `false` | `lg`-only: draws a 2px border, primary-tinted when `active`. Used by the dark-mode and settings toggles. |
| `active` | `boolean` | `false` | Tints icon/text primary regardless of hover — a pressed/has-content/open state (e.g. "this habit has a note", "settings panel is open"). |
| ...rest | `ButtonHTMLAttributes` | — | `onClick`, `aria-label`, `aria-pressed`, `type`, etc. pass straight through. |

Used in: `HabitTracker`, `TaskList`, `Routines`, `ImportantDates`, `DailyNote`, `SettingsPage`, `App`.

Not used by: `AuthPage`'s password-visibility toggle — that one is a bare icon with no background/padding box, a deliberately different (lighter) treatment for a sign-in form.

---

## EmojiPicker

The 10-emoji avatar grid, in the two layouts the app needs it in.

```tsx
<EmojiPicker value={profile.avatar} onChange={(avatar) => update({ avatar })} layout="wrap" groupLabel="Emoji avatar" />
```

| Prop | Type | Default | Notes |
|---|---|---|---|
| `value` | `string` | — | Currently-selected emoji. |
| `onChange` | `(emoji: string) => void` | — | |
| `layout` | `"grid" \| "wrap"` | `"wrap"` | `grid` — 6-column, larger aspect-square tiles (Onboarding's full-width step). `wrap` — fixed 40px tiles that flow inline (Profile's compact row). |
| `groupLabel` | `string` | — | `aria-label` on the surrounding `role="group"`. |

Exports `AVATAR_EMOJIS` (the shared list) alongside the component, in case a caller needs the raw list without the picker UI.

Used in: `Onboarding` (`layout="grid"`), `Profile` (`layout="wrap"`).

---

## AnimatedCollapse

Smoothly grows/shrinks its children instead of an instant show/hide. Wraps `motion/react`'s `AnimatePresence` + a `height`/`opacity` transition.

```tsx
<AnimatedCollapse open={panelOpen}>
  <div>...</div>
</AnimatedCollapse>
```

| Prop | Type | Notes |
|---|---|---|
| `open` | `boolean` | Content unmounts (not just hides) when `false`, after the exit transition finishes. |
| `children` | `ReactNode` | |

Used in: `Routines` (time-of-day sections), `SettingsPage` (email/password change panels), `HabitTracker` (note editor + note preview).

---

## Design tokens

None of these components hardcode colors — they all read the app's CSS custom properties (`var(--primary)`, `var(--muted-foreground)`, `var(--border)`, `var(--surface-1)`, etc., defined in `src/styles/theme.css`) so they stay correct in both light and dark mode automatically.
