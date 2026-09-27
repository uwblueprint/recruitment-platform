import type { ReviewDashboardSidePanelReviewDetail } from "@/graphql/typeUtils";
import {
  DashboardStatusChip,
  SKILL_CATEGORY_OPTIONS,
} from "@/components/dashboard/common";

type ReviewScoreColumnProps = {
  index: number;
  detail?: ReviewDashboardSidePanelReviewDetail;
};

export const ReviewScoreColumn = ({
  index,
  detail,
}: ReviewScoreColumnProps) => {
  const review = detail?.review;
  const name = detail?.reviewer
    ? `${detail.reviewer.firstName} ${detail.reviewer.lastName}`
    : "-";
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-2.5 font-source text-sm text-neutral-800">
      <dl className="flex flex-col gap-2.5">
        <ScoreRow label={`Reviewer ${index + 1}`} value={name} />
        <ScoreRow label="PFSG" value={review?.passionFSG} />
        <ScoreRow label="Team Player" value={review?.teamPlayer} />
        <ScoreRow label="D2L" value={review?.desireToLearn} />
        <ScoreRow label="Skill" value={review?.skill} />
        <div className="flex items-center gap-2.5">
          <dt className="w-[131px] shrink-0 font-semibold text-blue-900">
            Skill Category
          </dt>
          <dd>
            {review?.skillCategory ? (
              <DashboardStatusChip
                value={review.skillCategory}
                options={SKILL_CATEGORY_OPTIONS}
              />
            ) : (
              "-"
            )}
          </dd>
        </div>
        <div className="flex items-start gap-2.5">
          <dt className="w-[131px] shrink-0 font-semibold text-blue-900">
            Reviewer Comments
          </dt>
          <dd className="min-w-0 flex-1">{review?.comments || "-"}</dd>
        </div>
      </dl>
    </div>
  );
};

const ScoreRow = ({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) => (
  <div className="flex items-center gap-2.5">
    <dt className="w-[131px] shrink-0 font-semibold text-blue-900">{label}</dt>
    <dd>{value ?? "-"}</dd>
  </div>
);
