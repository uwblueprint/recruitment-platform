import type { ReviewDashboardSidePanelReviewDetail } from "@/graphql/typeUtils";

import { SidePanelSkillCategoryChip } from "./SidePanelSkillCategoryChip";

type SidePanelReviewerColumnProps = {
  /** Zero-based reviewer index; rendered as "Reviewer {index + 1}". */
  index: number;
  detail?: ReviewDashboardSidePanelReviewDetail;
};

const EMPTY_VALUE = "-";

const formatScore = (score: number | null | undefined) =>
  score === null || score === undefined ? EMPTY_VALUE : String(score);

const SCORE_LABEL = "font-semibold text-blue-900";

export const SidePanelReviewerColumn = ({
  index,
  detail,
}: SidePanelReviewerColumnProps) => {
  const review = detail?.review;
  const reviewerName = detail?.reviewer
    ? `${detail.reviewer.firstName} ${detail.reviewer.lastName}`
    : EMPTY_VALUE;

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-2.5 font-source text-sm text-neutral-800">
      <dl className="flex flex-col gap-2.5">
        <ScoreRow label={`Reviewer ${index + 1}`} value={reviewerName} />
        <ScoreRow label="PFSG" value={formatScore(review?.passionFSG)} />
        <ScoreRow label="Team Player" value={formatScore(review?.teamPlayer)} />
        <ScoreRow label="D2L" value={formatScore(review?.desireToLearn)} />
        <ScoreRow label="Skill" value={formatScore(review?.skill)} />
        <div className="flex items-center gap-2.5">
          <dt className={`w-[131px] shrink-0 ${SCORE_LABEL}`}>Skill Category</dt>
          <dd>
            {review?.skillCategory ? (
              <SidePanelSkillCategoryChip category={review.skillCategory} />
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
