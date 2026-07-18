import type { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";

interface Props {
  open: boolean;
  children: ReactNode;
}

/** Smoothly grows/shrinks its content instead of an instant show/hide — used by every accordion-like section. */
export function AnimatedCollapse({ open, children }: Props) {
  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          style={{ overflow: "hidden" }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
