import type { ReviewDashboardSidePanelReviewDetail } from "@/graphql/typeUtils";

import { DashboardStatusChip, SKILL_CATEGORY_OPTIONS } from "../common";

type SidePanelReviewerColumnProps = {
  /** Zero-based reviewer index; rendered as "Reviewer {index + 1}". */
  index: number;
  detail?: ReviewDashboardSidePanelReviewDetail;
};

const EMPTY_VALUE = "-";

const formatScore = (score: number | undefined) =>
  score === undefined ? EMPTY_VALUE : String(score);

const SCORE_LABEL = "font-semibold text-blue-900";

export const SidePanelReviewerColumn = ({
  index,
  detail,
}: SidePanelReviewerColumnProps) => {
  // GraphQL nulls are converted to undefined here so the rest of the component
  // only deals in the undefined convention used by optional props.
  const review = detail?.review ?? undefined;
  const reviewerName = detail?.reviewer
    ? `${detail.reviewer.firstName} ${detail.reviewer.lastName}`
    : EMPTY_VALUE;

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-2.5 font-source text-sm text-neutral-800">
      <dl className="flex flex-col gap-2.5">
        <ScoreRow label={`Reviewer ${index + 1}`} value={reviewerName} />
        <ScoreRow label="PFSG" value={formatScore(review?.passionFSG ?? undefined)} />
        <ScoreRow
          label="Team Player"
          value={formatScore(review?.teamPlayer ?? undefined)}
        />
        <ScoreRow
          label="D2L"
          value={formatScore(review?.desireToLearn ?? undefined)}
        />
        <ScoreRow label="Skill" value={formatScore(review?.skill ?? undefined)} />
        <div className="flex items-center gap-2.5">
          <dt className={`w-[131px] shrink-0 ${SCORE_LABEL}`}>Skill Category</dt>
          <dd>
            {review?.skillCategory ? (
              // Read-only: no onChange, so selecting an option is a no-op.
              <DashboardStatusChip
                value={review.skillCategory}
                options={SKILL_CATEGORY_OPTIONS}
              />
            ) : (
              EMPTY_VALUE
            )}
          </dd>
        </div>
        <div className="flex items-start gap-2.5">
          <dt className={`w-[131px] shrink-0 ${SCORE_LABEL}`}>
            Reviewer Comments
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
