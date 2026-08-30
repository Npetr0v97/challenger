export default function DatabaseNotice({ message }: { message: string }) {
  return (
    <div className="glass rounded-2xl border-rose-300/25 p-6">
      <h2 className="text-base font-semibold text-rose-200">
        Can&apos;t reach the database
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-white/60">
        Set <code className="font-mono text-white/80">MONGODB_URI</code> in{" "}
        <code className="font-mono text-white/80">.env.local</code> locally, or in
        your Vercel project&apos;s environment variables, then reload.
      </p>
      <p className="mt-3 font-mono text-xs leading-relaxed text-rose-300/70">
        {message}
      </p>
    </div>
  );
}
