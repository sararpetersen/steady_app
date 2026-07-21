import type { CSSProperties, ReactNode } from "react";
import { Reorder } from "motion/react";
import { GripVertical } from "lucide-react";

interface ReorderRowProps<T> {
  value: T;
  dragDisabled?: boolean;
  className?: string;
  style?: CSSProperties;
  handleSize?: number;
  children: ReactNode;
}

export function ReorderRow<T>({
  value,
  dragDisabled,
  className = "flex items-center gap-1 group relative",
  style,
  handleSize = 19,
  children,
}: ReorderRowProps<T>) {
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
      {children}
    </Reorder.Item>
  );
}
