import { Button } from "@/components/common/Button";
import { LongLeftIcon } from "@/components/icons/long-left.icon";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactElement, useContext, useState } from "react";
import { BACK_TO_HOME_HREF, REVIEW_STAGES, ReviewStage } from "../constants";
import { ReviewSetStageContext } from "../ReviewContext";
import { ReviewEndData, ReviewScores } from "../types";
import { getApplicantRecordId } from "../utils";

const STAGE_RATING_FIELDS: [ReviewStage, string][] = [
  [ReviewStage.PFSG, "passionFSG"],
  [ReviewStage.TP, "teamPlayer"],
  [ReviewStage.D2L, "desireToLearn"],
  [ReviewStage.SKL, "skill"],
];

interface Props {
  currentStage: ReviewStage;
  scores: ReviewScores;
  endData?: ReviewEndData;
  onValidate?: () => boolean;
}

export const ReviewStepper = ({
  currentStage,
  scores,
  endData,
  onValidate,
}: Props): ReactElement | null => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const setStage = useContext(ReviewSetStageContext);

  const currentStageIndex = REVIEW_STAGES.indexOf(currentStage);

  const nextStage =
    currentStageIndex < REVIEW_STAGES.length - 1
      ? REVIEW_STAGES[currentStageIndex + 1]
      : ReviewStage.END_SUCCESS;

  const previousStage = REVIEW_STAGES[Math.max(currentStageIndex - 1, 0)];

  const isButtonDisabled =
    currentStage !== ReviewStage.INFO &&
    currentStage !== ReviewStage.END_SUCCESS &&
    !(scores[currentStage] > 0 && scores[currentStage] <= 5);

  if (!router.isReady) return null;
  if (currentStage === ReviewStage.END_SUCCESS) return null;

  const applicantRecordId = getApplicantRecordId(router.query);

  const updateAllData = () => {
    const ratingPromises = STAGE_RATING_FIELDS.map(([stage, field]) => {});

    const {
      comments = "",
      skillsCategory = "",
      secondChoiceRole = "",
    } = endData ?? {};

    return Promise.all([...ratingPromises, {}]);
  };

  return (
    <div className="border-t border-semantic-border-light bg-white px-6 py-4">
      <div className="flex flex-nowrap items-center justify-end gap-3">
        {currentStageIndex === 0 ? (
          <Link
            href={BACK_TO_HOME_HREF}
            className="inline-flex w-fit shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full border-2 border-blue bg-white px-4 py-2 font-source text-base font-normal leading-[1.4] text-blue no-underline hover:border-blue hover:bg-sky-100 hover:text-blue hover:opacity-90"
          >
            <LongLeftIcon />
            Back to home
          </Link>
        ) : null}
        {currentStageIndex > 0 ? (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setStage?.(previousStage)}
            className="shrink-0 whitespace-nowrap !px-4 !py-2 hover:border-blue hover:bg-sky-100 hover:text-blue"
          >
            Previous section
          </Button>
        ) : null}
        {currentStage === ReviewStage.END ? (
          <Button
            size="sm"
            disabled={isSubmitting || !endData?.skillsCategory}
            className="shrink-0 whitespace-nowrap !px-4 !py-2 hover:border-transparent hover:bg-sky-400 disabled:opacity-60"
            onClick={async () => {
              if (onValidate && !onValidate()) {
                return;
              }

              setIsSubmitting(true);
              try {
                await updateAllData();
                setStage?.(ReviewStage.END_SUCCESS);
              } catch (error) {
                console.error("Failed to submit review data:", error);
                alert("Failed to submit review. Please try again.");
              } finally {
                setIsSubmitting(false);
              }
            }}
          >
            {isSubmitting ? "Submitting..." : "Finish"}
          </Button>
        ) : (
          <Button
            size="sm"
            disabled={isButtonDisabled}
            onClick={() => setStage?.(nextStage)}
            className="shrink-0 whitespace-nowrap !px-4 !py-2 hover:border-transparent hover:bg-sky-400 disabled:opacity-60"
          >
            Save & Continue
          </Button>
        )}
      </div>
    </div>
  );
};
