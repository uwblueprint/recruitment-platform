import { createContext } from "react";
import { ReviewStage } from "./constants";

export const ReviewSetStageContext = createContext<
  null | ((newValue: ReviewStage) => void)
>(null);

export const ReviewSetScoresContext = createContext<
  null | ((newKey: ReviewStage, newValue: number) => void)
>(null);

export const UpdateReviewedApplicantRecordContext = createContext<null | {
  update: (onCompleted: () => void) => void;
  loading: boolean;
  error?: { message: string };
  reset: () => void;
}>(null);
