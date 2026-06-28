import { SkillCategory } from "@/graphql/typeUtils";
import { SkillCategoryEnum } from "@/types/review";

// Note: there are two `SkillCategory` types in the repo — the GraphQL enum
// (wire format: "JUNIOR" | "INTERMEDIATE" | "SENIOR") and a display-string
// alias in `types/review.ts` ("Junior" | "Intermediate" | "Senior"). The
// score form sends the wire format to the backend so we import that one,
// and reuse `SkillCategoryEnum`'s mapping data only as the value→label
// source for the dropdown.

// =========================================================================
// Notes upload
// =========================================================================
// Mirror of backend `INTERVIEW_NOTES_*` in
// `backend/typescript/constants/interviewNotes.ts`. Duplicated (not shared)
// because the two sides don't have a common package — the dropzone uses
// these to reject obviously-bad files locally without a round trip, but the
// backend is still the trust boundary. Keep in sync.

/** Maximum size of a single uploaded notes PDF, in bytes. */
export const INTERVIEW_NOTES_MAX_BYTES = 25 * 1024 * 1024;

/** Only mimetype accepted for interview notes uploads. */
export const INTERVIEW_NOTES_ACCEPTED_MIME_TYPE = "application/pdf";

/** Only file extension accepted. */
export const INTERVIEW_NOTES_ACCEPTED_EXTENSION = ".pdf";

/**
 * react-dropzone `accept` config, derived from the two constants above so
 * the mimetype and extension can't drift apart.
 */
export const INTERVIEW_NOTES_DROPZONE_ACCEPT: Record<string, string[]> = {
  [INTERVIEW_NOTES_ACCEPTED_MIME_TYPE]: [INTERVIEW_NOTES_ACCEPTED_EXTENSION],
};

// =========================================================================
// Score sheet
// =========================================================================

// --- Per-field range ---
// Single source of truth for the 1–5 score range. Wire `<ScoreInput>` min/max
// and any future server-side range validator off these so the client and
// backend rules can't drift.

export const MIN_INTERVIEW_SCORE = 1;
export const MAX_INTERVIEW_SCORE = 5;

// --- Score categories ---
// Source of truth for the 4 score keys + their user-facing labels. The
// interview ScoresPanel consumes this. Note: `ReviewEndStage.tsx` currently
// re-declares the same rows with a conflicting "Desire to Learn" label —
// that's a separate cleanup ticket; consolidate when touching review code.

export const INTERVIEW_SCORE_FIELDS = [
  { key: "passionFSG", label: "Passion for Social Good" },
  { key: "teamPlayer", label: "Team Player" },
  { key: "desireToLearn", label: "Drive to Learn" },
  { key: "skill", label: "Skill" },
] as const;

export type ScoreKey = (typeof INTERVIEW_SCORE_FIELDS)[number]["key"];

/** Derived: max-possible cumulative score across all categories. */
export const MAX_TOTAL_INTERVIEW_SCORE =
  INTERVIEW_SCORE_FIELDS.length * MAX_INTERVIEW_SCORE;

// --- Skill category dropdown ---
// Derived from the existing `SkillCategoryEnum` in `types/review.ts` so the
// enum keys and display labels can't drift apart.

export const SKILL_CATEGORY_OPTIONS: {
  value: SkillCategory;
  label: string;
}[] = Object.entries(SkillCategoryEnum).map(([value, label]) => ({
  value: value as SkillCategory,
  label,
}));

// --- Score form state ---
// Lives here (not in ScoresPanel.tsx) because the assessment page/provider
// also constructs and validates this shape — the panel is purely UI.

export type ScoreFormState = {
  [K in ScoreKey]: number | "";
} & {
  skillCategory: SkillCategory | "";
  comments: string;
};

export const EMPTY_SCORE_FORM: ScoreFormState = {
  ...(Object.fromEntries(
    INTERVIEW_SCORE_FIELDS.map(({ key }) => [key, "" as const]),
  ) as { [K in ScoreKey]: number | "" }),
  skillCategory: "",
  comments: "",
};

export function isScoreFormComplete(form: ScoreFormState): boolean {
  return (
    INTERVIEW_SCORE_FIELDS.every(({ key }) => typeof form[key] === "number") &&
    form.skillCategory !== ""
  );
}
