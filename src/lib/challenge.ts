import type { SessionType } from "./types";

export const CHALLENGE_ID = "running-strength-26";

export interface RequirementSpec {
  type: SessionType;
  label: string;
  target: number;
  unitSingular: string;
  unitPlural: string;
  rule: string;
  accent: string;
}

export const REQUIREMENTS: RequirementSpec[] = [
  {
    type: "strength",
    label: "Strength Training",
    target: 20,
    unitSingular: "session",
    unitPlural: "sessions",
    rule: "A session counts as 20 minutes of strength work.",
    accent: "amber",
  },
  {
    type: "running",
    label: "Running",
    target: 50,
    unitSingular: "run",
    unitPlural: "runs",
    rule: "A run counts above 2 km at a pace under 10:00 min/km.",
    accent: "cyan",
  },
];

export const CHALLENGE = {
  id: CHALLENGE_ID,
  title: "Running & Strength '26",
  tagline: "20 strength sessions. 50 runs. One year.",
  deadline: "December 31, 2026",
  requirements: REQUIREMENTS,
  reward: {
    title: "Reward",
    description: "When the challenge passes, GM will start running again.",
  },
};

export function requirementFor(type: SessionType): RequirementSpec {
  const req = REQUIREMENTS.find((r) => r.type === type);
  if (!req) throw new Error(`Unknown session type: ${type}`);
  return req;
}
