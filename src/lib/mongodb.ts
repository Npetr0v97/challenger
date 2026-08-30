import { MongoClient, type Collection, type Db } from "mongodb";
import type { SessionDoc } from "./types";

declare global {
  // Reused across hot reloads in dev and across warm lambda invocations in
  // production, so we never open more than one pool per process.
  var _challengerMongo: Promise<MongoClient> | undefined;
  var _challengerIndexes: Promise<void> | undefined;
}

function client(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      "MONGODB_URI is not set. Add it to .env.local (or your Vercel project env vars)."
    );
  }
  if (!global._challengerMongo) {
    global._challengerMongo = new MongoClient(uri).connect();
  }
  return global._challengerMongo;
}

export async function getDb(): Promise<Db> {
  return (await client()).db(process.env.MONGODB_DB || "challenger");
}

export async function sessionsCollection(): Promise<Collection<SessionDoc>> {
  const col = (await getDb()).collection<SessionDoc>("sessions");
  if (!global._challengerIndexes) {
    global._challengerIndexes = col
      .createIndex(
        { activeKey: 1 },
        { unique: true, sparse: true, name: "activeKey_unique" }
      )
      .then(() => undefined)
      // A failed index build must not take the whole app down; the route
      // handlers also check for conflicts before inserting.
      .catch(() => undefined);
  }
  await global._challengerIndexes;
  return col;
}
