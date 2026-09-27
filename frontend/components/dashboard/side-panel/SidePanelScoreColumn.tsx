import type { ReviewDashboardSidePanelReviewDetail } from "@/graphql/typeUtils";

import { DashboardStatusChip, SKILL_CATEGORY_OPTIONS } from "../common";

type SidePanelScoreColumnProps = {
  label: string;
  name: string;
  scores?: Omit<
    NonNullable<ReviewDashboardSidePanelReviewDetail["review"]>,
    "skillCategory"
  > | null;
  skillCategory?: NonNullable<
    ReviewDashboardSidePanelReviewDetail["review"]
  >["skillCategory"];
  showSkillCategory?: boolean;
  commentsLabel?: string;
};

const EMPTY_VALUE = "-";

const formatScore = (score: number | undefined) =>
  score === undefined ? EMPTY_VALUE : String(score);

const SCORE_LABEL = "font-semibold text-blue-900";

export const SidePanelScoreColumn = ({
  label,
  name,
  scores: review,
  skillCategory,
  showSkillCategory = false,
  commentsLabel = "Comments",
}: SidePanelScoreColumnProps) => {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-2.5 font-source text-sm text-neutral-800">
      <dl className="flex flex-col gap-2.5">
        <ScoreRow label={label} value={name} />
        <ScoreRow
          label="PFSG"
          value={formatScore(review?.passionFSG ?? undefined)}
        />
        <ScoreRow
          label="Team Player"
          value={formatScore(review?.teamPlayer ?? undefined)}
        />
        <ScoreRow
          label="D2L"
          value={formatScore(review?.desireToLearn ?? undefined)}
        />
        <ScoreRow
          label="Skill"
          value={formatScore(review?.skill ?? undefined)}
        />
        {showSkillCategory ? (
          <div className="flex items-center gap-2.5">
            <dt className={`w-[131px] shrink-0 ${SCORE_LABEL}`}>
              Skill Category
            </dt>
            <dd>
              {skillCategory ? (
                // Read-only: no onChange, so selecting an option is a no-op.
                <DashboardStatusChip
                  value={skillCategory}
                  options={SKILL_CATEGORY_OPTIONS}
                />
              ) : (
                EMPTY_VALUE
              )}
            </dd>
          </div>
        ) : null}
        <div className="flex items-start gap-2.5">
          <dt className={`w-[131px] shrink-0 ${SCORE_LABEL}`}>
            {commentsLabel}
          </dt>
          <dd className="min-w-0 flex-1">{review?.comments || EMPTY_VALUE}</dd>
        </div>
      </dl>
    </div>
  );
};

const ScoreRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center gap-2.5">
    <dt className={`w-[131px] shrink-0 ${SCORE_LABEL}`}>{label}</dt>
    <dd>{value}</dd>
  </div>
);
