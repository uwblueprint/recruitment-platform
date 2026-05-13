import { useTheme } from "@mui/material";
import { useContext } from "react";
import { ApplicationDTO } from "@/types";
import { PanelLayout } from "@/components/layouts/PanelLayout";
import { ReviewPageLayout } from "../layouts/ReviewPageLayout";
import { BACK_TO_HOME_HREF, ReviewStage } from "../constants";
import { ReportConflictButton } from "../common/ReportConflictButton";
import { ReviewSetScoresContext } from "../ReviewContext";
import { ReviewScoreInput } from "../common/ReviewScoreInput";
import { ReviewStageHeader } from "../common/ReviewStageHeader";
import { REVIEW_PFSG_SCORING_CRITERIA } from "../rubricConstants";
import { ReviewScores } from "../types";
import { ReviewAnswers } from "./ReviewAnswers";
import { ReviewRubric } from "./ReviewRubric";

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
  const shortAnswers = application?.shortQuestionAnswers ?? [];
  const secondShortAnswer = shortAnswers[1];
  const questions = secondShortAnswer ? [secondShortAnswer.question] : [];
  const answers = secondShortAnswer ? [secondShortAnswer.response] : [];
  const theme = useTheme();
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
        <div
          className="w-full shrink-0"
          style={{
            height: "1px",
            background: theme.palette.background.default,
          }}
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
