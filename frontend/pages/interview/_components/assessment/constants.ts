import { SkillCategory } from "@/graphql/typeUtils";
import { SkillCategoryEnum } from "@/types/review";

// Mirror of backend `INTERVIEW_NOTES_*` in
// `backend/typescript/constants/interviewNotes.ts`. Duplicated (not shared)
// because the two sides don't have a common package — the dropzone uses
// these to reject obviously-bad files locally without a round trip, but the
// backend is still the trust boundary. Keep in sync.

export const INTERVIEW_NOTES_MAX_BYTES = 25 * 1024 * 1024;

export const INTERVIEW_NOTES_ACCEPTED_MIME_TYPE = "application/pdf";

export const INTERVIEW_NOTES_ACCEPTED_EXTENSION = ".pdf";

export const INTERVIEW_NOTES_DROPZONE_ACCEPT: Record<string, string[]> = {
  [INTERVIEW_NOTES_ACCEPTED_MIME_TYPE]: [INTERVIEW_NOTES_ACCEPTED_EXTENSION],
};

export const MIN_INTERVIEW_SCORE = 1;
export const MAX_INTERVIEW_SCORE = 5;

export const INTERVIEW_SCORE_FIELDS = [
  { key: "passionFSG", label: "Passion for Social Good" },
  { key: "teamPlayer", label: "Team Player" },
  { key: "desireToLearn", label: "Drive to Learn" },
  { key: "skill", label: "Skill" },
] as const;

export type ScoreKey = (typeof INTERVIEW_SCORE_FIELDS)[number]["key"];

export const MAX_TOTAL_INTERVIEW_SCORE =
  INTERVIEW_SCORE_FIELDS.length * MAX_INTERVIEW_SCORE;

export const SKILL_CATEGORY_OPTIONS: {
  value: SkillCategory;
  label: string;
}[] = Object.entries(SkillCategoryEnum).map(([value, label]) => ({
  value: value as SkillCategory,
  label,
}));

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
