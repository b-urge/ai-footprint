"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { Comparison } from "@/utils/comparisons";
import { ComparisonCard } from "./ComparisonCard";

interface ComparisonsProps {
  comparisons: Comparison[];
  tokenCount: number;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

const GROUPS: {
  category: Comparison["category"];
  label: string;
  dotClass: string;
}[] = [
  { category: "water", label: "WATER", dotClass: "bg-accent-water" },
  { category: "energy", label: "ENERGY", dotClass: "bg-accent-energy" },
  { category: "co2", label: "CO₂", dotClass: "bg-accent-co2" },
];

export function Comparisons({ comparisons, tokenCount }: ComparisonsProps) {
  if (comparisons.length === 0) {
    if (tokenCount === 0) return null;
    return (
      <section
        className="mt-12 px-4 sm:px-8"
        aria-label="Real-world equivalents"
      >
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display mb-3 text-xs font-bold tracking-widest text-text-muted">
            EQUIVALENT TO…
          </h2>
          <p className="font-body text-sm font-light text-text-muted">
            Footprint is measurable but too small for everyday comparisons at
            this length. Paste more text to see equivalents.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-10 px-4 sm:mt-12 sm:px-8" aria-label="Real-world equivalents">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display mb-6 text-xs font-bold tracking-widest text-text-muted">
          EQUIVALENT TO…
        </h2>
        <div className="space-y-10">
          {GROUPS.map((group) => {
            const items = comparisons.filter((c) => c.category === group.category);
            if (items.length === 0) return null;
            return (
              <div key={group.category}>
                <div className="mb-4 flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${group.dotClass}`}
                    aria-hidden
                  />
                  <span className="font-display text-xs tracking-widest text-text-muted">
                    {group.label}
                  </span>
                </div>
                <motion.div
                  className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3"
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  key={items.map((i) => i.id).join("-")}
                >
                  <AnimatePresence mode="popLayout">
                    {items.map((comparison) => (
                      <motion.div
                        key={comparison.id}
                        variants={itemVariants}
                        initial="hidden"
                        animate="show"
                        exit="exit"
                        layout
                      >
                        <ComparisonCard comparison={comparison} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
