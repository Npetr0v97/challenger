"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { LockIcon, SpinnerIcon } from "@/components/Icons";

export default function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  // Bumped on every rejection so the shake animation replays even when the
  // message itself is unchanged.
  const [shake, setShake] = useState(0);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setError(null);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data.error ?? "That password doesn't work.");
        setShake((n) => n + 1);
        setPending(false);
        return;
      }
      router.replace("/challenges");
      router.refresh();
    } catch {
      setError("Couldn't reach the server. Try again.");
      setShake((n) => n + 1);
      setPending(false);
    }
  }

  return (
    <main className="flex min-h-dvh items-center justify-center px-5 py-16">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 26 }}
        className="w-full max-w-sm"
      >
        <motion.div
          key={shake}
          animate={shake ? { x: [0, -10, 9, -6, 4, 0] } : undefined}
          transition={{ duration: 0.42 }}
          className="glass bloom rounded-3xl p-8"
        >
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.12, type: "spring", stiffness: 260, damping: 18 }}
            className="mb-6 flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5"
          >
            <LockIcon className="size-5 text-white/70" />
          </motion.div>

          <h1 className="text-2xl font-semibold tracking-tight">Challenger</h1>
          <p className="mt-1.5 text-sm text-white/50">
            Enter your password to open the challenge.
          </p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-3">
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              autoFocus
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                if (error) setError(null);
              }}
              placeholder="Password"
              className="w-full rounded-xl border border-white/12 bg-black/30 px-4 py-3 text-[15px] outline-none transition placeholder:text-white/25 focus:border-white/35 focus:bg-black/45"
            />

            <motion.button
              type="submit"
              disabled={pending || password.length === 0}
              whileHover={{ scale: pending ? 1 : 1.015 }}
              whileTap={{ scale: pending ? 1 : 0.985 }}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-[15px] font-semibold text-black transition disabled:cursor-not-allowed disabled:opacity-40"
            >
              {pending && <SpinnerIcon className="size-4" />}
              {pending ? "Checking" : "Enter"}
            </motion.button>
          </form>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 14 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="overflow-hidden text-center text-sm text-rose-300"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </main>
  );
}
