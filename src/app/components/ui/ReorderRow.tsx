import type { CSSProperties, ReactNode } from "react";
import { Reorder } from "motion/react";
import { GripVertical, ChevronUp, ChevronDown } from "lucide-react";

interface ReorderRowProps<T> {
  value: T;
  /** The full list this row belongs to, plus its setter — used only to build the
   * keyboard move-up/down alternative to dragging, not for rendering. */
  values: T[];
  onReorder: (next: T[]) => void;
  moveUpLabel: string;
  moveDownLabel: string;
  dragDisabled?: boolean;
  className?: string;
  style?: CSSProperties;
  handleSize?: number;
  children: ReactNode;
}

export function ReorderRow<T>({
  value,
  values,
  onReorder,
  moveUpLabel,
  moveDownLabel,
  dragDisabled,
  className = "flex items-center gap-1 group relative",
  style,
  handleSize = 19,
  children,
}: ReorderRowProps<T>) {
  const index = values.indexOf(value);

  const move = (delta: number) => {
    const target = index + delta;
    if (index < 0 || target < 0 || target >= values.length) return;
    const next = [...values];
    [next[index], next[target]] = [next[target], next[index]];
    onReorder(next);
  };

  return (
    <Reorder.Item
      value={value}
      dragListener={!dragDisabled}
      whileDrag={{ scale: 1.02, zIndex: 10 }}
      className={className}
      style={style}
    >
      <span className="p-1 text-muted-foreground flex-shrink-0 cursor-grab active:cursor-grabbing touch-none" aria-hidden="true">
        <GripVertical size={handleSize} />
      </span>
      {/* Drag is mouse/touch-only — these give keyboard users a way to reorder too. Dropped
          from layout entirely below sm: touch already has working drag-to-reorder via the
          grip handle, and a permanently-visible button pair here was eating enough row width
          to wrap the edit/delete buttons onto their own line on narrow screens. At sm+ they're
          faded out by default (same reveal-on-hover/focus pattern used for the note edit/delete
          buttons) and only appear on hover or keyboard focus. */}
      {/* sm:opacity-0 and the two reveal variants below all target the same property at
          equal specificity, so whichever rule Tailwind happens to emit last in the
          stylesheet would silently win regardless of hover/focus state — the `!` pins
          the reveal rules to actually win when their condition is true. */}
      <span className="hidden sm:flex sm:flex-col flex-shrink-0 sm:opacity-0 sm:group-hover:opacity-100! sm:group-focus-within:opacity-100!" style={{ transition: "opacity 0.15s" }}>
        <button
          type="button"
          onClick={() => move(-1)}
          disabled={index <= 0}
          aria-label={moveUpLabel}
          className="text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-default"
        >
          <ChevronUp size={14} />
        </button>
        <button
          type="button"
          onClick={() => move(1)}
          disabled={index < 0 || index >= values.length - 1}
          aria-label={moveDownLabel}
          className="text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-default"
        >
          <ChevronDown size={14} />
        </button>
      </span>
      {children}
    </Reorder.Item>
  );
}
