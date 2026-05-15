import { PanelLayout } from "@/components/layouts/PanelLayout";
import { neutral, red } from "@/constants/palette";
import { ApplicationDTO } from "@/types";
import { useContext } from "react";
import { ReportConflictButton } from "../common/ReportConflictButton";
import { ReviewScoreInput } from "../common/ReviewScoreInput";
import { ReviewStageHeader } from "../common/ReviewStageHeader";
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
}

export const ReviewTeamPlayerStage = ({
  name,
  application,
  scores,
  onReportConflict,
}: Props) => {
  const updateScore = useContext(ReviewSetScoresContext);
  const shortAnswers = application?.shortAnswerQuestions ?? [];
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
                  <div
                className="mt-6 w-full shrink-0"
                style={{ height: "1px", background: "#C4C4C4" }}
              />
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
            className="text-xl leading-none"
            style={{ color: red[500] }}
          >
            *
          </span>
        </div>
      </PanelLayout>
    </ReviewPageLayout>
  );
};
