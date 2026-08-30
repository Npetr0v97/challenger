"use client";

import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogoutIcon, TableIcon } from "@/components/Icons";
import type { Role } from "@/lib/types";

const ROLE_LABEL: Record<Role, string> = {
  challenger: "The Challenger",
  gm: "General Manager",
};

export default function AppHeader({
  role,
  onOpenSessions,
  pendingCount = 0,
}: {
  role: Role;
  onOpenSessions?: () => void;
  pendingCount?: number;
}) {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  async function signOut() {
    setSigningOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/");
    router.refresh();
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="flex items-center justify-between gap-3"
    >
      <div className="flex items-center gap-2.5">
        <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_12px] shadow-emerald-400/70" />
        <span className="text-sm font-medium text-white/70">{ROLE_LABEL[role]}</span>
      </div>

      <div className="flex items-center gap-2">
        {onOpenSessions && (
          <motion.button
            type="button"
            onClick={onOpenSessions}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.94 }}
            aria-label="Open sessions"
            className="glass relative flex size-10 items-center justify-center rounded-xl text-white/75 transition hover:text-white"
          >
            <TableIcon className="size-5" />
            {pendingCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 18 }}
                className="absolute -right-1 -top-1 flex min-w-5 items-center justify-center rounded-full bg-amber-400 px-1.5 text-[11px] font-bold text-black"
              >
                {pendingCount}
              </motion.span>
            )}
          </motion.button>
        )}

        <motion.button
          type="button"
          onClick={signOut}
          disabled={signingOut}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.94 }}
          aria-label="Sign out"
          className="glass flex size-10 items-center justify-center rounded-xl text-white/55 transition hover:text-white disabled:opacity-40"
        >
          <LogoutIcon className="size-5" />
        </motion.button>
      </div>
    </motion.header>
  );
}
