import { notFound, redirect } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import ChallengeView from "@/components/ChallengeView";
import DatabaseNotice from "@/components/DatabaseNotice";
import { currentRole } from "@/lib/auth";
import { CHALLENGE_ID } from "@/lib/challenge";
import { tryListSessions } from "@/lib/sessions";

export const dynamic = "force-dynamic";

export default async function ChallengePage({
  params,
}: PageProps<"/challenges/[id]">) {
  const role = await currentRole();
  if (!role) redirect("/");

  const { id } = await params;
  if (id !== CHALLENGE_ID) notFound();

  const result = await tryListSessions();
  if (!result.ok) {
    return (
      <main className="mx-auto w-full max-w-3xl px-5 py-8 sm:py-12">
        <AppHeader role={role} />
        <div className="mt-10">
          <DatabaseNotice message={result.message} />
        </div>
      </main>
    );
  }

  return <ChallengeView role={role} initialSessions={result.sessions} />;
}
