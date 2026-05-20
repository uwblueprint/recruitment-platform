import { PanelLayout } from "@/components/layouts/PanelLayout";
import { ApplicationDTO } from "@/types";
import { useContext } from "react";
import { ReportConflictButton } from "../common/ReportConflictButton";
import { ReviewScoreInput } from "../common/ReviewScoreInput";
import { ReviewStageHeader } from "../common/ReviewStageHeader";
import { BACK_TO_HOME_HREF, ReviewStage } from "../constants";
import { ReviewPageLayout } from "../layouts/ReviewPageLayout";
import { ReviewSetScoresContext } from "../ReviewContext";
import { REVIEW_PFSG_SCORING_CRITERIA } from "../rubricConstants";
import { ReviewScores } from "../types";
import { ReviewAnswers } from "../common/ReviewAnswers";
import { ReviewRubric } from "../common/ReviewRubric";

export interface Props {
  name: string;
  application: ApplicationDTO | undefined;
  scores: ReviewScores;
  onReportConflict?: () => void;
}

export const ReviewPassionForSocialGoodStage = ({
  name,
  application,
  scores,
  onReportConflict,
}: Props) => {
  const updateScore = useContext(ReviewSetScoresContext);
  const shortAnswers = application?.shortAnswerQuestions ?? [];
  const secondShortAnswer = shortAnswers[1];
  const questions = secondShortAnswer ? [secondShortAnswer.question] : [];
  const answers = secondShortAnswer ? [secondShortAnswer.response] : [];
  return (
    <ReviewPageLayout currentStage={ReviewStage.PFSG} scores={scores}>
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
        title="Passion for Social Good"
        subtitle={`${name}'s Application`}
      >
        <div className="mt-6 h-px w-full shrink-0 bg-[#C4C4C4]" />
        <ReviewAnswers questions={questions} answers={answers} />
      </PanelLayout>
      <PanelLayout
        borderLeft
        title="Scoring for Passion for Social Good (PFSG)"
        titleVariant="medium"
        variant="white"
      >
        <ReviewRubric
          scoringCriteria={REVIEW_PFSG_SCORING_CRITERIA}
          scores={scores}
          currentStage={ReviewStage.PFSG}
        />
        <div className="flex items-center gap-3">
          <ReviewScoreInput
            id="pfsg-score"
            value={scores[ReviewStage.PFSG] || ""}
            min={1}
            max={5}
            placeholder={`Enter ${name}'s score`}
            ariaLabel="Passion for social good score"
            onChange={(v) => updateScore?.(ReviewStage.PFSG, v)}
          />
          <span className="text-xl leading-none text-red-500">
            *
          </span>
        </div>
      </PanelLayout>
    </ReviewPageLayout>
  );
};
