import useUpdateReviewedApplicantRecord from "@/APIClients/useUpdateReviewedApplicantRecord";
import useReviewApplication from "@/APIClients/useReviewApplication";
import ReviewPageAPIClient from "@/APIClients/ReviewPageAPIClient";
import { useAuthenticatedUser } from "@/components/contexts/AuthUserContext";
import { ProtectedApplication } from "@/components/contexts/ProtectedApplication";
import { ProtectedRoute } from "@/components/contexts/ProtectedRoute";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { ReportConflictButton } from "../_components/common/ReportConflictButton";
import { ReviewStageHeader } from "../_components/common/ReviewStageHeader";
import { BACK_TO_HOME_HREF, ReviewStage } from "../_components/constants";
import { ReportConflictDialogue } from "../_components/dialogues/ReportConflictDialogue";
import { ReportConflictSuccessDialogue } from "../_components/dialogues/ReportConflictSuccessDialogue";
import {
  UpdateReviewedApplicantRecordContext,
  ReviewSetScoresContext,
  ReviewSetStageContext,
} from "../_components/ReviewContext";
import { ReviewDriveToLearnStage } from "../_components/stages/ReviewDriveToLearnStage";
import { ReviewEndStage } from "../_components/stages/ReviewEndStage";
import { ReviewEndSuccessStage } from "../_components/stages/ReviewEndSuccessStage";
import { ReviewInfoStage } from "../_components/stages/ReviewInfoStage";
import { ReviewPassionForSocialGoodStage } from "../_components/stages/ReviewPassionForSocialGoodStage";
import { ReviewSkillStage } from "../_components/stages/ReviewSkillStage";
import { ReviewTeamPlayerStage } from "../_components/stages/ReviewTeamPlayerStage";
import { ReviewEndData, ReviewScores } from "../_components/types";
import { getApplicantRecordId } from "../_components/utils";

const initialScores: ReviewScores = {
  [ReviewStage.INFO]: 0,
  [ReviewStage.PFSG]: 0,
  [ReviewStage.TP]: 0,
  [ReviewStage.D2L]: 0,
  [ReviewStage.SKL]: 0,
  [ReviewStage.END]: 0,
  [ReviewStage.END_SUCCESS]: 0,
};

const ReviewsPages: NextPage = () => {
  const router = useRouter();
  const [stage, setStage] = useState<ReviewStage>(ReviewStage.INFO);
  const [endData, setEndData] = useState<ReviewEndData>({
    comments: "",
    skillsCategory: "",
    secondChoiceRole: "",
  });
  const [scoreEdits, setScoreEdits] = useState<{
    applicantRecordId: string | null;
    reviewerId: string | undefined;
    values: Partial<ReviewScores>;
  }>();
  const [reportConflictDialogueOpen, setReportConflictDialogueOpen] =
    useState(false);
  const [
    reportConflictSuccessDialogueOpen,
    setReportConflictSuccessDialogueOpen,
  ] = useState(false);
  const [reportConflictHasErrored, setReportConflictHasErrored] =
    useState(false);

  const applicantRecordId = router.isReady
    ? getApplicantRecordId(router.query)
    : null;
  const { application, reviewersData, loading, error } =
    useReviewApplication(applicantRecordId);
  const applicantName = application
    ? `${application.firstName} ${application.lastName}`
    : "Applicant";

  const authenticatedUser = useAuthenticatedUser();
  const reviewerName = authenticatedUser
    ? authenticatedUser.firstName
    : "Reviewer";

  const reviewerId = authenticatedUser?.id;
  const reviewerRecord = reviewersData?.reviewedApplicantRecords.find(
    ({ reviewer }) => reviewer.id === reviewerId,
  )?.reviewedApplicantRecord;
  const savedReview = reviewerRecord?.review;
  const scores: ReviewScores = {
    ...initialScores,
    [ReviewStage.PFSG]: savedReview?.passionFSG ?? 0,
    [ReviewStage.TP]: savedReview?.teamPlayer ?? 0,
    [ReviewStage.D2L]: savedReview?.desireToLearn ?? 0,
    [ReviewStage.SKL]: savedReview?.skill ?? 0,
    // Keep local edits over query updates, scoped to this applicant and reviewer.
    ...(scoreEdits?.applicantRecordId === applicantRecordId &&
    scoreEdits?.reviewerId === reviewerId
      ? scoreEdits?.values
      : {}),
  };

  const updateScores = (key: ReviewStage, value: number) => {
    if (isNaN(value) || value < 0 || value > 5) return;
    setScoreEdits((prev) => ({
      applicantRecordId,
      reviewerId,
      values: {
        ...(prev?.applicantRecordId === applicantRecordId &&
        prev?.reviewerId === reviewerId
          ? prev?.values
          : {}),
        [key]: value,
      },
    }));
  };

  const {
    updateReviewedApplicantRecord,
    loading: updating,
    error: updateError,
    reset: resetUpdate,
  } = useUpdateReviewedApplicantRecord();

  const updateReview = (onCompleted: () => void) => {
    if (!applicantRecordId || !reviewerId || !reviewerRecord) return;
    // The server checks the latest conflict status and reports mutation errors.
    updateReviewedApplicantRecord(
      applicantRecordId,
      reviewerId,
      {
        passionFSG: scores[ReviewStage.PFSG],
        teamPlayer: scores[ReviewStage.TP],
        desireToLearn: scores[ReviewStage.D2L],
        skill: scores[ReviewStage.SKL],
      },
      onCompleted,
    );
  };

  if (!router.isReady) return null;
  if (applicantRecordId === null || error) {
    return (
      <p role="alert" className="p-8">
        Unable to load this application. Please try again.
      </p>
    );
  }
  if (loading) {
    return (
      <p role="status" className="p-8">
        Loading application…
      </p>
    );
  }

  if (!reviewerId || !reviewerRecord) {
    return (
      <p role="alert" className="p-8">
        No assigned review found for the current user.
      </p>
    );
  }

  const getReviewStage = () => {
    switch (stage) {
      case ReviewStage.INFO:
        return (
          <ReviewInfoStage
            name={applicantName}
            application={application}
            scores={scores}
            onReportConflict={() => setReportConflictDialogueOpen(true)}
          />
        );
      case ReviewStage.PFSG:
        return (
          <ReviewPassionForSocialGoodStage
            name={applicantName}
            application={application}
            scores={scores}
            onReportConflict={() => setReportConflictDialogueOpen(true)}
          />
        );
      case ReviewStage.TP:
        return (
          <ReviewTeamPlayerStage
            name={applicantName}
            application={application}
            scores={scores}
            onReportConflict={() => setReportConflictDialogueOpen(true)}
          />
        );
      case ReviewStage.D2L:
        return (
          <ReviewDriveToLearnStage
            name={applicantName}
            application={application}
            scores={scores}
            onReportConflict={() => setReportConflictDialogueOpen(true)}
          />
        );
      case ReviewStage.SKL:
        return (
          <ReviewSkillStage
            name={applicantName}
            application={application}
            scores={scores}
            header={
              <ReviewStageHeader
                backHref={BACK_TO_HOME_HREF}
                right={
                  <ReportConflictButton
                    name={applicantName}
                    showQuestion
                    onClick={() => setReportConflictDialogueOpen(true)}
                  />
                }
              />
            }
          />
        );
      case ReviewStage.END:
        return (
          <ReviewEndStage
            name={applicantName}
            reviewerName={reviewerName}
            scores={scores}
            endData={endData}
            setEndData={setEndData}
            onReportConflict={() => setReportConflictDialogueOpen(true)}
          />
        );
      case ReviewStage.END_SUCCESS:
      default:
        return <ReviewEndSuccessStage name={applicantName} />;
    }
  };

  const reportConflict = async () => {
    try {
      setReportConflictHasErrored(false);
      if (applicantRecordId == null) {
        throw new Error("Missing applicantRecordId in URL");
      }
      if (authenticatedUser == null) {
        throw new Error("Missing authenticated reviewer ID");
      }
      await ReviewPageAPIClient.reportReviewConflict(
        applicantRecordId,
        authenticatedUser.id,
      );
      setReportConflictDialogueOpen(false);
      setReportConflictSuccessDialogueOpen(true);
    } catch {
      setReportConflictHasErrored(true);
    }
  };

  const onReportConflictSuccessClose = () => {
    setReportConflictSuccessDialogueOpen(false);
    router.push(BACK_TO_HOME_HREF);
  };

  return (
    <UpdateReviewedApplicantRecordContext.Provider
      value={{
        update: updateReview,
        loading: updating,
        error: updateError,
        reset: resetUpdate,
      }}
    >
      <ReviewSetScoresContext.Provider value={updateScores}>
        <ReviewSetStageContext.Provider value={setStage}>
          {getReviewStage()}
          <ReportConflictDialogue
            open={reportConflictDialogueOpen}
            hasError={reportConflictHasErrored}
            onClose={() => setReportConflictDialogueOpen(false)}
            onConfirm={reportConflict}
          />
          <ReportConflictSuccessDialogue
            open={reportConflictSuccessDialogueOpen}
            onClose={onReportConflictSuccessClose}
          />
        </ReviewSetStageContext.Provider>
      </ReviewSetScoresContext.Provider>
    </UpdateReviewedApplicantRecordContext.Provider>
  );
};

const Reviews: NextPage = () => {
  return (
    <ProtectedRoute allowedRoles={["Admin", "User"]}>
      <ProtectedApplication>
        <ReviewsPages />
      </ProtectedApplication>
    </ProtectedRoute>
  );
};

export default Reviews;
