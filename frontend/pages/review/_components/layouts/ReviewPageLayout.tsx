import { ReactNode } from "react";
import { ReviewStage } from "../constants";
import { ReviewProgressHeader } from "../common/ReviewProgressHeader";
import { ReviewStepper } from "../common/ReviewStepper";
import { ReviewActions, ReviewEndData, ReviewScores } from "../types";
import { SplitPanelLayout } from "@/components/layouts/SplitPageLayout";

interface ReviewPageLayoutProps {
  currentStage: ReviewStage;
  scores: ReviewScores;
  endData?: ReviewEndData;
  onValidate?: () => boolean;
  children: ReactNode;
  viewOnly?: boolean;
  actions?: ReviewActions;
}

export const ReviewPageLayout = ({
  currentStage,
  scores,
  endData,
  onValidate,
  children,
  viewOnly = false,
  actions,
}: ReviewPageLayoutProps) => {
  return (
    <SplitPanelLayout
      header={<ReviewProgressHeader currentStage={currentStage} />}
      footer={
        <ReviewStepper
          actions={actions}
          currentStage={currentStage}
          scores={scores}
          endData={endData}
          onValidate={onValidate}
          viewOnly={viewOnly}
        />
      }
    >
      {children}
    </SplitPanelLayout>
  );
};
