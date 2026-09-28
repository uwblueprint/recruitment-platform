import { Button } from "@/components/common/Button";
import { LongLeftIcon } from "@/components/icons/long-left.icon";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactElement, useContext } from "react";
import { BACK_TO_HOME_HREF, REVIEW_STAGES, ReviewStage } from "../constants";
import { ReviewSetStageContext } from "../ReviewContext";
import { ReviewActions, ReviewEndData, ReviewScores } from "../types";

interface Props {
  currentStage: ReviewStage;
  scores: ReviewScores;
  endData?: ReviewEndData;
  onValidate?: () => boolean;
  viewOnly?: boolean;
  actions?: ReviewActions;
}

export const ReviewStepper = ({
  currentStage,
  scores,
  endData,
  onValidate,
  viewOnly = false,
  actions,
}: Props): ReactElement | null => {
  const isUpdating = actions?.isUpdating ?? false;
  const router = useRouter();
  const setStage = useContext(ReviewSetStageContext);

  const currentStageIndex = REVIEW_STAGES.indexOf(currentStage);

  const nextStage =
    currentStageIndex < REVIEW_STAGES.length - 1
      ? REVIEW_STAGES[currentStageIndex + 1]
      : ReviewStage.END_SUCCESS;

  const previousStage = REVIEW_STAGES[Math.max(currentStageIndex - 1, 0)];

  const isButtonDisabled =
    !viewOnly &&
    currentStage !== ReviewStage.INFO &&
    currentStage !== ReviewStage.END_SUCCESS &&
    !(scores[currentStage] > 0 && scores[currentStage] <= 5);

  if (!router.isReady) return null;
  if (currentStage === ReviewStage.END_SUCCESS) return null;

  return (
    <div className="border-t border-neutral-200 bg-white px-6 py-4">
      <div className="flex justify-end items-center gap-3 flex-nowrap">
        {currentStageIndex === 0 && (
          <Link
            href={BACK_TO_HOME_HREF}
            className="font-source no-underline inline-flex justify-center items-center gap-2 w-fit cursor-pointer shrink-0 hover:opacity-90 rounded-full py-2 px-4 border-2 border-blue bg-white text-blue text-base font-normal leading-[1.4] hover:bg-sky-100 hover:border-blue hover:text-blue"
          >
            <LongLeftIcon />
            Back to home
          </Link>
        )}
        {currentStageIndex > 0 && (
          <Button
            size="sm"
            variant="secondary"
            disabled={isUpdating}
            onClick={() => setStage?.(previousStage)}
            className="shrink-0 whitespace-nowrap !px-4 !py-2 hover:bg-sky-100 hover:border-blue hover:text-blue"
          >
            Previous section
          </Button>
        )}
        {viewOnly ? (
          <Button
            size="sm"
            onClick={() =>
              currentStage === ReviewStage.END
                ? router.push(BACK_TO_HOME_HREF)
                : setStage?.(nextStage)
            }
            className="shrink-0 whitespace-nowrap !px-4 !py-2 hover:bg-sky-400 hover:border-transparent disabled:opacity-60"
          >
            {currentStage === ReviewStage.END ? "Finish" : "Continue"}
          </Button>
        ) : currentStage === ReviewStage.END ? (
          <Button
            size="sm"
            disabled={isUpdating || !endData?.skillsCategory || !actions}
            className="shrink-0 whitespace-nowrap !px-4 !py-2 hover:bg-sky-400 hover:border-transparent disabled:opacity-60"
            onClick={() => {
              if (onValidate && !onValidate()) {
                return;
              }
              actions?.onFinish(() => setStage?.(ReviewStage.END_SUCCESS));
            }}
          >
            {isUpdating ? "Submitting..." : "Finish"}
          </Button>
        ) : (
          <Button
            size="sm"
            disabled={isButtonDisabled || isUpdating || !actions}
            onClick={() => actions?.onContinue(() => setStage?.(nextStage))}
            className="shrink-0 whitespace-nowrap !px-4 !py-2 hover:bg-sky-400 hover:border-transparent disabled:opacity-60"
          >
            {isUpdating ? "Saving..." : "Save & Continue"}
          </Button>
        )}
      </div>
    </div>
  );
};
