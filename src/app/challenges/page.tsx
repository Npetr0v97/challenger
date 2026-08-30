import { redirect } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import ChallengeCard from "@/components/ChallengeCard";
import DatabaseNotice from "@/components/DatabaseNotice";
import { currentRole } from "@/lib/auth";
import { CHALLENGE, REQUIREMENTS } from "@/lib/challenge";
import { countApproved, tryListSessions } from "@/lib/sessions";

export const dynamic = "force-dynamic";

export default async function ChallengesPage() {
  const role = await currentRole();
  if (!role) redirect("/");

  const result = await tryListSessions();
  const sessions = result.ok ? result.sessions : [];

  const progress = REQUIREMENTS.map((requirement) => ({
    type: requirement.type,
    label: requirement.label,
    done: countApproved(sessions, requirement.type),
    target: requirement.target,
  }));

  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-8 sm:py-12">
      <AppHeader role={role} />

      <section className="mt-12">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
          Active challenges
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Pick your battle
        </h1>
      </section>

      {!result.ok && (
        <div className="mt-8">
          <DatabaseNotice message={result.message} />
        </div>
      )}

      <section className="mt-8 grid gap-5">
        <ChallengeCard
          href={`/challenges/${CHALLENGE.id}`}
          title={CHALLENGE.title}
          tagline={CHALLENGE.tagline}
          deadline={CHALLENGE.deadline}
          progress={progress}
        />
      </section>
    </main>
  );
}
