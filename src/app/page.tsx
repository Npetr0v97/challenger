import { redirect } from "next/navigation";
import LoginForm from "@/components/LoginForm";
import { currentRole } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await currentRole()) redirect("/challenges");
  return <LoginForm />;
}
