import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/** Fade + slide-up reveal on scroll. */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Editorial serif section title in the style of the reference. */
export function SectionTitle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={`font-serif text-[clamp(2rem,5vw,3.4rem)] leading-[1.05] tracking-[-0.01em] text-ink ${className ?? ""}`}
    >
      {children}
    </h2>
  );
}

/** A labelled small overline, like the k/v labels on the site. */
export function Label({ children }: { children: ReactNode }) {
  return (
    <span className="text-xs tracking-wide text-mute">{children}</span>
  );
}
