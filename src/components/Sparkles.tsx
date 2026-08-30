"use client";

import { motion } from "motion/react";
import { useMemo } from "react";
import { SparkleIcon } from "@/components/Icons";

/**
 * Deterministic pseudo-random in [0, 1). Math.random() would produce different
 * values on the server and the client and break hydration, so particle layout
 * is derived from the index instead.
 */
function rand(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

const COLORS = ["text-amber-200", "text-amber-300", "text-white", "text-cyan-200"];

/** Radial burst of sparkles, anchored on the centre of its parent. */
export function SparkleBurst({ count = 14 }: { count?: number }) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        // Golden angle keeps the spray evenly distributed rather than clumped.
        const angle = i * 137.508 * (Math.PI / 180);
        const distance = 34 + rand(i + 1) * 40;
        return {
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance,
          size: 6 + rand(i + 9) * 8,
          delay: rand(i + 3) * 1.6,
          duration: 1.3 + rand(i + 5) * 0.9,
          color: COLORS[i % COLORS.length],
        };
      }),
    [count]
  );

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {particles.map((p, i) => (
        <motion.span
          key={i}
          className={`absolute left-1/2 top-1/2 ${p.color}`}
          style={{ marginLeft: -p.size / 2, marginTop: -p.size / 2 }}
          initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
          animate={{
            x: [0, p.x],
            y: [0, p.y],
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
            rotate: [0, 160],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            repeatDelay: 0.7,
            ease: "easeOut",
          }}
        >
          <SparkleIcon style={{ width: p.size, height: p.size }} />
        </motion.span>
      ))}
    </div>
  );
}

/** Ambient twinkles drifting up across the whole card. */
export function SparkleField({ count = 22 }: { count?: number }) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: rand(i + 21) * 100,
        top: 12 + rand(i + 37) * 82,
        size: 5 + rand(i + 53) * 9,
        delay: rand(i + 71) * 3.4,
        duration: 2.4 + rand(i + 89) * 2.2,
        drift: (rand(i + 101) - 0.5) * 26,
        color: COLORS[i % COLORS.length],
      })),
    [count]
  );

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p, i) => (
        <motion.span
          key={i}
          className={`absolute ${p.color}`}
          style={{ left: `${p.left}%`, top: `${p.top}%` }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.95, 0],
            scale: [0.3, 1, 0.3],
            y: [0, -34],
            x: [0, p.drift],
            rotate: [0, 120],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            repeatDelay: rand(i + 113) * 2.2,
            ease: "easeInOut",
          }}
        >
          <SparkleIcon style={{ width: p.size, height: p.size }} />
        </motion.span>
      ))}
    </div>
  );
}
