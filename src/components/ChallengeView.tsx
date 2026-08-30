"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useMemo, useState } from "react";
import AddSessionDialog from "@/components/AddSessionDialog";
import AppHeader from "@/components/AppHeader";
import { ChevronLeftIcon } from "@/components/Icons";
import RequirementCard from "@/components/RequirementCard";
import RewardCard from "@/components/RewardCard";
import SessionsDrawer from "@/components/SessionsDrawer";
import { CHALLENGE, REQUIREMENTS } from "@/lib/challenge";
import type { Role, SessionType, TrainingSession } from "@/lib/types";

/** Newest training day first, ties broken by when the request came in. */
function sortSessions(sessions: TrainingSession[]): TrainingSession[] {
  return [...sessions].sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? 1 : -1;
    return a.requestedAt < b.requestedAt ? 1 : -1;
  });
}

export default function ChallengeView({
  role,
  initialSessions,
}: {
  role: Role;
  initialSessions: TrainingSession[];
}) {
  const [sessions, setSessions] = useState(() => sortSessions(initialSessions));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [addType, setAddType] = useState<SessionType | null>(null);

  const isChallenger = role === "challenger";

  const stats = useMemo(() => {
    const byType = (type: SessionType) => sessions.filter((s) => s.type === type);
    return REQUIREMENTS.map((requirement) => {
      const mine = byType(requirement.type);
      return {
        requirement,
        approved: mine.filter((s) => s.status === "approved").length,
        requested: mine.filter((s) => s.status === "requested").length,
      };
    });
  }, [sessions]);

  const pendingCount = useMemo(
    () => sessions.filter((s) => s.status === "requested").length,
    [sessions]
  );

  function handleCreated(session: TrainingSession) {
    setSessions((current) => sortSessions([...current, session]));
    setDrawerOpen(true);
  }

  function handleUpdated(session: TrainingSession) {
    setSessions((current) =>
      current.map((item) => (item.id === session.id ? session : item))
    );
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-8 sm:py-12">
      <AppHeader
        role={role}
        onOpenSessions={() => setDrawerOpen(true)}
        pendingCount={role === "gm" ? pendingCount : 0}
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mt-10"
      >
        <Link
          href="/challenges"
          className="inline-flex items-center gap-1 text-sm text-white/40 transition hover:text-white/80"
        >
          <ChevronLeftIcon className="size-4" />
          All challenges
        </Link>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
          {CHALLENGE.title}
        </h1>
        <p className="mt-2 text-sm text-white/50">
          {CHALLENGE.tagline} Deadline {CHALLENGE.deadline}.
        </p>
      </motion.div>

      <section className="mt-10">
        <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
          The requirements
        </h2>

        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          {stats.map((entry, index) => (
            <RequirementCard
              key={entry.requirement.type}
              index={index}
              requirement={entry.requirement}
              approved={entry.approved}
              requested={entry.requested}
              canAdd={isChallenger}
              onAdd={() => setAddType(entry.requirement.type)}
            />
          ))}
        </div>
      </section>

      <div className="mt-6">
        <RewardCard
          title={CHALLENGE.reward.title}
          description={CHALLENGE.reward.description}
          bars={stats.map((entry) => ({
            type: entry.requirement.type,
            label: entry.requirement.label,
            done: entry.approved,
            target: entry.requirement.target,
          }))}
        />
      </div>

      <p className="mt-8 text-center text-xs text-white/25">
        {isChallenger
          ? "Requested sessions wait for the general manager to approve them."
          : "Approve or decline requested sessions from the panel above."}
      </p>

      {isChallenger && (
        <AddSessionDialog
          /* Keyed so each opening starts from a clean date pick. */
          key={addType ?? "closed"}
          type={addType}
          sessions={sessions}
          onClose={() => setAddType(null)}
          onCreated={handleCreated}
        />
      )}

      <SessionsDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sessions={sessions}
        role={role}
        onUpdated={handleUpdated}
      />
    </main>
  );
}
