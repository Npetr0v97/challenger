# Challenger

A challenge tracker for **Running & Strength '26** — 20 strength sessions and 50 runs
by the end of the year.

Two roles share one screen, separated by which password you log in with:

| | Challenger | General Manager |
|---|---|---|
| See requirements & progress | ✅ | ✅ |
| Request a session (`+ Add session`) | ✅ | — |
| Approve / decline a request | — | ✅ |

## Rules the app enforces

- A **strength** session counts as 20 minutes of strength work.
- A **run** counts above 2 km at a pace under 10:00 min/km.
- A given day can hold at most **one strength and one running** session. A day is
  taken while its session is *requested* or *approved*; declining releases it.
- Once a request is approved or declined it is **final** — the transition is
  filtered on `status: "requested"` server-side, so a double click can't flip it.

Progress bars count **approved** sessions only.

## Environment

Copy `.env.example` to `.env.local` and fill it in:

| Variable | Purpose |
|---|---|
| `MONGODB_URI` | Atlas connection string (Connect → Drivers → Node.js) |
| `MONGODB_DB` | Database name. Optional, defaults to `challenger` |
| `CHALLENGER_PASSWORD` | Password that logs in as the challenger |
| `GM_PASSWORD` | Password that logs in as the general manager |

Passwords are compared **server-side only** (`src/lib/auth.ts`) using a constant-time
digest comparison. They are never sent to the browser and are not `NEXT_PUBLIC_`.
Login stores the password in an `httpOnly` cookie which every request re-checks
against the environment, so a forged cookie is worthless without the password.

## Data model

One `sessions` collection:

```js
{
  challengeId: "running-strength-26",
  type: "strength" | "running",
  date: "2026-09-14",          // local calendar day
  status: "requested" | "approved" | "declined",
  activeKey: "running-strength-26:running:2026-09-14",  // absent once declined
  requestedAt: Date,
  resolvedAt: Date | null,
}
```

`activeKey` carries a **sparse unique index**, so the one-per-day-per-type rule is
enforced by the database rather than only by the UI. Declining `$unset`s the key,
which frees the slot. The index is created lazily on first write — no manual setup.

## Running locally

```bash
npm install
npm run dev
```

## Deploying to Vercel

1. Push to GitHub, then import the repo at [vercel.com/new](https://vercel.com/new).
2. Add all four environment variables under **Settings → Environment Variables**,
   ticked for Production, Preview and Development.
3. In Atlas, **Network Access** must allow `0.0.0.0/0` — Vercel's serverless
   functions have dynamic egress IPs, so there is no stable address to allowlist.
