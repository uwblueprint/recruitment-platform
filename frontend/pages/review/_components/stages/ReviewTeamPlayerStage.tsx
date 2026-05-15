import { PanelLayout } from "@/components/layouts/PanelLayout";
import { ApplicationDTO } from "@/types";
import { useContext } from "react";
import { ReportConflictButton } from "../common/ReportConflictButton";
import { ReviewScoreInput } from "../common/ReviewScoreInput";
import { ReviewStageHeader } from "../common/ReviewStageHeader";
import { BACK_TO_HOME_HREF, ReviewStage } from "../constants";
import { ReviewPageLayout } from "../layouts/ReviewPageLayout";
import { REVIEW_TP_SCORING_CRITERIA } from "../rubricConstants";
import { ReviewSetScoresContext } from "../ReviewContext";
import { ReviewScores } from "../types";
import { ReviewAnswers } from "./ReviewAnswers";
import { ReviewRubric } from "./ReviewRubric";

interface Props {
  name: string;
  application: ApplicationDTO | undefined;
  scores: ReviewScores;
  onReportConflict?: () => void;
}

export const ReviewTeamPlayerStage = ({
  name,
  application,
  scores,
  onReportConflict,
}: Props) => {
  const updateScore = useContext(ReviewSetScoresContext);
  const shortAnswers = application?.shortQuestionAnswers ?? [];
  const thirdShortAnswer = shortAnswers[2];
  const questions = thirdShortAnswer ? [thirdShortAnswer.question] : [];
  const answers = thirdShortAnswer ? [thirdShortAnswer.response] : [];
  const { TP } = ReviewStage;

  return (
    <ReviewPageLayout currentStage={TP} scores={scores}>
      <PanelLayout
        header={
          <ReviewStageHeader
            backHref={BACK_TO_HOME_HREF}
            right={
              <ReportConflictButton
                name={name}
                showQuestion
                onClick={onReportConflict}
              />
            }
          />
        }
        title="Team Player"
        subtitle={`${name}'s Application`}
      >
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
        <div className="h-px w-full shrink-0 bg-white" />
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
          <span className="text-xl leading-none text-semantic-state-error">*</span>
        </div>
      </PanelLayout>
    </ReviewPageLayout>
  );
};
