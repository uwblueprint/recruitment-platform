import { ReactElement } from "react";
import type { ReviewerScore } from "@/types/review";

interface Props {
  scores: ReviewerScore[];
}

export function ReviewerScoresList({ scores }: Props): ReactElement {
  return (
    <div className="flex w-full flex-col items-end gap-[10px]">
      {scores.length === 0 ? (
        <p className="font-poppins text-xl font-medium leading-[1.4] text-blue">
          No reviewers assigned
        </p>
      ) : (
        scores.map(({ reviewer, score }) => (
          <p
            key={reviewer.id}
            className="whitespace-nowrap font-poppins text-xl font-medium leading-[1.4] text-blue"
          >
            {reviewer.firstName} {reviewer.lastName}&rsquo;s Score:{" "}
            {score != null ? `${score}/5` : "—/5"}
          </p>
        ))
      )}
    </div>
  );
}
