import {
  INTERVIEW_SCORE_FIELDS,
  MAX_INTERVIEW_SCORE,
  MAX_TOTAL_INTERVIEW_SCORE,
  MIN_INTERVIEW_SCORE,
  SKILL_CATEGORY_OPTIONS,
  type ScoreFormState,
  type ScoreKey,
} from "./constants";
import { SkillCategory } from "@/graphql/typeUtils";
import { ReviewScoreInput } from "@/components/common/ReviewScoreInput";

function computeTotal(form: ScoreFormState): number {
  return INTERVIEW_SCORE_FIELDS.reduce((sum, { key }) => {
    const v = form[key];
    return sum + (typeof v === "number" ? v : 0);
  }, 0);
}

interface ScoresPanelProps {
  form: ScoreFormState;
  onChange: (form: ScoreFormState) => void;
}

export const ScoresPanel = ({ form, onChange }: ScoresPanelProps) => {
  const total = computeTotal(form);

  const setScore = (key: ScoreKey, value: number | "") => {
    onChange({ ...form, [key]: value });
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Page title */}
      <div>
        <h2 className="font-poppins text-[28px] font-semibold leading-[140%] text-neutral-800">
          Score Candidate
        </h2>
        <p className="mt-1 font-poppins text-sm leading-[140%] text-neutral-500">
          During or after the interview, discuss scores with your interview
          partner and submit them below.
        </p>
      </div>

      {/* Score sheet card */}
      <div className="rounded-lg border border-neutral-200 bg-white">
        {/* Card header */}
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
          <span className="font-poppins text-base font-semibold text-blue">
            Score sheet
          </span>
        </div>

        {/* Score rows */}
        <div className="divide-y divide-neutral-200">
          {INTERVIEW_SCORE_FIELDS.map(({ key, label }) => (
            <div
              key={key}
              className="flex items-center justify-between px-6 py-4"
            >
              <span className="font-poppins text-sm text-neutral-800">
                {label}
              </span>
              <ReviewScoreInput
                id={key}
                value={form[key]}
                min={MIN_INTERVIEW_SCORE}
                max={MAX_INTERVIEW_SCORE}
                placeholder="Enter score"
                ariaLabel={`${label} score`}
                onChange={(v) => setScore(key, v === 0 ? "" : v)}
                className="w-40"
              />
            </div>
          ))}

          {/* Skill category row */}
          <div className="flex items-center justify-between px-6 py-4">
            <span className="font-poppins text-sm text-neutral-800">
              Skill Category
            </span>
            <select
              value={form.skillCategory}
              onChange={(e) =>
                onChange({
                  ...form,
                  skillCategory: e.target.value as SkillCategory | "",
                })
              }
              className="w-40 rounded border border-neutral-200 px-3 py-2 font-poppins text-sm text-neutral-800 focus:border-blue focus:outline-none focus:ring-1 focus:ring-blue"
            >
              <option value="" disabled>
                Select
              </option>
              {SKILL_CATEGORY_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Total score */}
        <div className="flex items-center justify-between border-t border-neutral-200 px-6 py-4">
          <span className="font-poppins text-sm font-semibold text-neutral-800">
            Total Score
          </span>
          <span className="font-poppins text-sm font-semibold text-blue">
            {total}/{MAX_TOTAL_INTERVIEW_SCORE}
          </span>
        </div>
      </div>

      {/* Comments */}
      <div className="flex flex-col gap-3">
        <h3 className="font-poppins text-xl font-semibold text-blue">
          Comments
        </h3>
        <textarea
          value={form.comments}
          onChange={(e) => onChange({ ...form, comments: e.target.value })}
          placeholder="Leave Comments here"
          rows={5}
          className="w-full resize-none rounded-lg border border-neutral-200 px-4 py-3 font-poppins text-sm text-neutral-800 placeholder:text-neutral-200 focus:border-blue focus:outline-none focus:ring-1 focus:ring-blue"
        />
      </div>
    </div>
  );
};
