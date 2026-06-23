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
import { REVIEW_D2L_SCORING_CRITERIA } from "../rubricConstants";
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

export const ReviewDriveToLearnStage = ({
  name,
  application,
  scores,
  onReportConflict,
  viewOnly = false,
  reviewers = [],
}: Props) => {
  const updateScore = useContext(ReviewSetScoresContext);
  const shortAnswers = application?.shortAnswerQuestions ?? [];
  const fourthShortAnswer = shortAnswers[3];
  const questions = fourthShortAnswer ? [fourthShortAnswer.question] : [];
  const answers = fourthShortAnswer ? [fourthShortAnswer.response] : [];
  const reviewerScores = reviewers.map(
    ({ reviewer, reviewedApplicantRecord }) => ({
      reviewer,
      score: reviewedApplicantRecord.review?.desireToLearn ?? null,
    }),
  );
  return (
    <ReviewPageLayout
      currentStage={ReviewStage.D2L}
      scores={scores}
      viewOnly={viewOnly}
    >
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
        title="Drive to Learn"
        subtitle={`${name}'s Application`}
      >
        <div className="mt-6 h-px w-full shrink-0 bg-neutral-200" />
        <ReviewAnswers questions={questions} answers={answers} />
      </PanelLayout>
      <PanelLayout
        borderLeft
        title="Scoring for Drive to Learn (LEARN)"
        titleVariant="medium"
        variant="white"
      >
        <ReviewRubric
          scoringCriteria={REVIEW_D2L_SCORING_CRITERIA}
          scores={scores}
          currentStage={ReviewStage.D2L}
        />
        <div className="h-px w-full shrink-0 bg-neutral-200" />
        {viewOnly ? (
          <ReviewerScoresList scores={reviewerScores} />
        ) : (
          <div className="flex items-center gap-3">
            <ReviewScoreInput
              id="d2l-score"
              value={scores[ReviewStage.D2L] || ""}
              min={1}
              max={5}
              placeholder={`Enter ${name}'s score`}
              ariaLabel="Drive to learn score"
              onChange={(v) => updateScore?.(ReviewStage.D2L, v)}
            />
            <span className="text-xl leading-none text-red-500">
              *
            </span>
          </div>
        )}
      </PanelLayout>
    </ReviewPageLayout>
  );
};
