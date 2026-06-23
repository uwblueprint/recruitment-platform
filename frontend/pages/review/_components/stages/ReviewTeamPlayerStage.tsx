import { PanelLayout } from "@/components/layouts/PanelLayout";
import { ApplicationDTO } from "@/types";
import { ReviewedApplicantRecordWithReviewerResult } from "@/graphql/typeUtils";
import { useContext } from "react";
import { ReportConflictButton } from "../common/ReportConflictButton";
import { ReviewScoreInput } from "../common/ReviewScoreInput";
import { ReviewStageHeader } from "../common/ReviewStageHeader";
import { ReviewerScoresList } from "../common/ReviewerScoresList";
import { BACK_TO_HOME_HREF, ReviewStage } from "../constants";
import { ReviewPageLayout } from "../layouts/ReviewPageLayout";
import { ReviewSetScoresContext } from "../ReviewContext";
import { REVIEW_TP_SCORING_CRITERIA } from "../rubricConstants";
import { ReviewScores } from "../types";
import { ReviewAnswers } from "../common/ReviewAnswers";
import { ReviewRubric } from "../common/ReviewRubric";

interface Props {
  name: string;
  application: ApplicationDTO | undefined;
  scores: ReviewScores;
  onReportConflict?: () => void;
  viewOnly?: boolean;
  reviewers?: ReviewedApplicantRecordWithReviewerResult[];
}

export const ReviewTeamPlayerStage = ({
  name,
  application,
  scores,
  onReportConflict,
  viewOnly = false,
  reviewers = [],
}: Props) => {
  const updateScore = useContext(ReviewSetScoresContext);
  const shortAnswers = application?.shortAnswerQuestions ?? [];
  const thirdShortAnswer = shortAnswers[2];
  const questions = thirdShortAnswer ? [thirdShortAnswer.question] : [];
  const answers = thirdShortAnswer ? [thirdShortAnswer.response] : [];
  const reviewerScores = reviewers.map(
    ({ reviewer, reviewedApplicantRecord }) => ({
      reviewer,
      score: reviewedApplicantRecord.review?.teamPlayer ?? null,
    }),
  );
  const { TP } = ReviewStage;
  return (
    <ReviewPageLayout currentStage={TP} scores={scores} viewOnly={viewOnly}>
      <PanelLayout
        header={
          <ReviewStageHeader
            backHref={BACK_TO_HOME_HREF}
            right={
              viewOnly ? null : (
                <ReportConflictButton
                  name={name}
                  showQuestion
                  onClick={onReportConflict}
                />
              )
            }
          />
        }
        title="Team Player"
        subtitle={`${name}'s Application`}
      >
        <div className="mt-6 h-px w-full shrink-0 bg-neutral-200" />
        <ReviewAnswers questions={questions} answers={answers} />
      </PanelLayout>
      <PanelLayout
        borderLeft
        title="Scoring for Team Player (TEAM)"
        titleVariant="medium"
        variant="white"
      >
        <ReviewRubric
          scoringCriteria={REVIEW_TP_SCORING_CRITERIA}
          scores={scores}
          currentStage={TP}
        />
        <div className="h-px w-full shrink-0 bg-neutral-200" />
        {viewOnly ? (
          <ReviewerScoresList scores={reviewerScores} />
        ) : (
          <div className="flex items-center gap-3">
            <ReviewScoreInput
              id="tp-score"
              value={scores[TP] || ""}
              min={1}
              max={5}
              placeholder={`Enter ${name}'s score`}
              ariaLabel="Team player score"
              onChange={(v) => updateScore?.(TP, v)}
            />
            <span
              className="text-xl leading-none text-red-500"
            >
              *
            </span>
          </div>
        )}
      </PanelLayout>
    </ReviewPageLayout>
  );
};
