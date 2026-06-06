import { ReactElement } from "react";
import { ReviewedApplicantRecordWithReviewerResult } from "@/graphql/typeUtils";

export type ReviewDimensionField =
  | "passionFSG"
  | "teamPlayer"
  | "desireToLearn"
  | "skill";

interface Props {
  reviewers: ReviewedApplicantRecordWithReviewerResult[];
  field: ReviewDimensionField;
}

export function ReviewerScoresList({
  reviewers,
  field,
}: Props): ReactElement {
  return (
    <div className="flex w-full flex-col items-end gap-[10px]">
      {reviewers.length === 0 ? (
        <p className="font-poppins text-xl font-medium leading-[1.4] text-blue">
          No reviewers assigned
        </p>
      ) : (
        reviewers.map(({ reviewer, review }) => {
          const score = review?.[field];
          return (
            <p
              key={reviewer.id}
              className="whitespace-nowrap font-poppins text-xl font-medium leading-[1.4] text-blue"
            >
              {reviewer.firstName} {reviewer.lastName}&rsquo;s Score:{" "}
              {score != null ? `${score}/5` : "—/5"}
            </p>
          );
        })
      )}
    </div>
  );
}
