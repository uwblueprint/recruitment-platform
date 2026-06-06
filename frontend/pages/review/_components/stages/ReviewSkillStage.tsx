import { Button } from "@/components/common/Button";
import { PanelLayout } from "@/components/layouts/PanelLayout";
import { ReviewedApplicantRecordWithReviewerResult } from "@/graphql/typeUtils";
import { ReactNode, useContext } from "react";
import { ReviewScoreInput } from "../common/ReviewScoreInput";
import { ReviewerScoresList } from "../common/ReviewerScoresList";
import { ReviewStage } from "../constants";
import { ReviewPageLayout } from "../layouts/ReviewPageLayout";
import { ReviewSetScoresContext } from "../ReviewContext";
import { REVIEW_SKL_SCORING_CRITERIA } from "../rubricConstants";
import { ReviewAnswers } from "../common/ReviewAnswers";
import { ReviewStageProps } from "./ReviewInfoStage";
import { ReviewRubric } from "../common/ReviewRubric";
import { EditIcon } from "@/components/icons/edit.icon";


const ResumeLink = ({ resumeLink }: { resumeLink: string }) => {
  return (
    <div className="flex flex-col gap-8">
      <Button
        className="mr-2 justify-self-end"
        size="sm"
        variant="secondary"
        href={resumeLink}
      >
        <div className="flex justify-center items-center gap-2">
          <EditIcon className="w-4 h-4 text-blue"/> View
          Candidate Resume
        </div>
      </Button>
    </div>
  );
};

type Props = ReviewStageProps & {
  header: ReactNode;
  viewOnly?: boolean;
  reviewers?: ReviewedApplicantRecordWithReviewerResult[];
};

export const ReviewSkillStage = ({
  name,
  application,
  scores,
  header,
  viewOnly = false,
  reviewers = [],
}: Props) => {
  const updateScore = useContext(ReviewSetScoresContext);
  const resumeLink = application?.resumeUrl;

  const roleSpecificStr = application?.roleSpecificQuestions[0];
  const roleSpecificStrJSON = roleSpecificStr
    ? JSON.parse(roleSpecificStr)
    : [];
  const questionsData = roleSpecificStrJSON[0]?.questions || [];

  const questions = questionsData.map(
    (item: { question?: string; response?: string | string[] }) =>
      item.question || "",
  );
  const answers = questionsData.flatMap(
    (item: { question?: string; response?: string | string[] }) => {
      if (Array.isArray(item.response)) {
        return [item.response.join(", ")];
      } else {
        return item.response;
      }
    },
  );

  return (
    <ReviewPageLayout
      currentStage={ReviewStage.SKL}
      scores={scores}
      viewOnly={viewOnly}
    >
      <PanelLayout
        header={header}
        title="Skill"
        subtitle={`${name}'s Application`}
      >
        <div className="mt-6 h-px w-full shrink-0 bg-neutral-200" />
        {resumeLink ? <ResumeLink resumeLink={resumeLink} /> : null}
        <ReviewAnswers questions={questions} answers={answers} />
      </PanelLayout>
      <PanelLayout
        borderLeft
        title="Scoring for Skill (SKILL)"
        titleVariant="medium"
        variant="white"
      >
        <ReviewRubric
          scoringCriteria={REVIEW_SKL_SCORING_CRITERIA}
          scores={scores}
          currentStage={ReviewStage.SKL}
        />
        {viewOnly ? (
          <ReviewerScoresList reviewers={reviewers} field="skill" />
        ) : (
          <div className="flex items-center gap-3">
            <ReviewScoreInput
              id="skl-score"
              value={scores[ReviewStage.SKL] || ""}
              min={1}
              max={5}
              placeholder={`Enter ${name}'s score`}
              ariaLabel="Skill score"
              onChange={(v) => updateScore?.(ReviewStage.SKL, v)}
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
