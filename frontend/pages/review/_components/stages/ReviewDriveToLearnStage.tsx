import { useContext } from "react";
import { ApplicationDTO } from "@/types";
import { BACK_TO_HOME_HREF, ReviewStage } from "../constants";
import { ReportConflictButton } from "../common/ReportConflictButton";
import { ReviewSetScoresContext } from "../ReviewContext";
import { ReviewScoreInput } from "../common/ReviewScoreInput";
import { ReviewStageHeader } from "../common/ReviewStageHeader";
import { REVIEW_D2L_SCORING_CRITERIA } from "../rubricConstants";
import { ReviewScores } from "../types";
import { ReviewAnswers } from "./ReviewAnswers";
import { ReviewRubric } from "./ReviewRubric";
import { ReviewPageLayout } from "../layouts/ReviewPageLayout";
import { PanelLayout } from "@/components/layouts/PanelLayout";
import { useTheme } from "@mui/material";

interface Props {
  name: string;
  application: ApplicationDTO | undefined;
  scores: ReviewScores;
  onReportConflict?: () => void;
}

export const ReviewDriveToLearnStage = ({
  name,
  application,
  scores,
  onReportConflict,
}: Props) => {
  const updateScore = useContext(ReviewSetScoresContext);
  const shortAnswers = application?.shortQuestionAnswers ?? [];
  const fourthShortAnswer = shortAnswers[3];
  const questions = fourthShortAnswer ? [fourthShortAnswer.question] : [];
  const answers = fourthShortAnswer ? [fourthShortAnswer.response] : [];
  const theme = useTheme();
  return (
    <ReviewPageLayout currentStage={ReviewStage.D2L} scores={scores}>
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
        title="Drive to Learn"
        subtitle={`${name}'s Application`}
      >
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
        <div
          className="w-full shrink-0 height-[1px]"
          style={{
            background: theme.palette.background.default,
          }}
        />
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
          <span
            className="text-xl leading-none"
            style={{ color: theme.palette.error.main }}
          >
            *
          </span>
        </div>
      </PanelLayout>
    </ReviewPageLayout>
  );
};
