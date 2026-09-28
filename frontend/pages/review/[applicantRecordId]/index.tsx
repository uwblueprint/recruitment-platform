import ReviewPageAPIClient from "@/APIClients/ReviewPageAPIClient";
import { useAuthenticatedUser } from "@/components/contexts/AuthUserContext";
import { ProtectedApplication } from "@/components/contexts/ProtectedApplication";
import { ProtectedRoute } from "@/components/contexts/ProtectedRoute";
import { ApplicationDTO, AuthStatus } from "@/types";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ReportConflictButton } from "../_components/common/ReportConflictButton";
import { ReviewStageHeader } from "../_components/common/ReviewStageHeader";
import {
  BACK_TO_HOME_HREF,
  ReviewStage,
} from "../_components/constants";
import { ReportConflictDialogue } from "../_components/dialogues/ReportConflictDialogue";
import { ReportConflictSuccessDialogue } from "../_components/dialogues/ReportConflictSuccessDialogue";
import {
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
  const [application, setApplication] = useState<ApplicationDTO>();
  const [authStatus, setAuthStatus] = useState<AuthStatus>({
    loading: true,
    isAuthorized: false,
  });
  const [endData, setEndData] = useState<ReviewEndData>({
    comments: "",
    skillsCategory: "",
    secondChoiceRole: "",
  });
  const [scores, setScores] = useState<ReviewScores>(initialScores);
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
  const applicantName = application
    ? `${application.firstName} ${application.lastName}`
    : "Applicant";

  const authenticatedUser = useAuthenticatedUser();
  const reviewerName = authenticatedUser
    ? authenticatedUser.firstName
    : "Reviewer";

  const updateScores = (key: ReviewStage, value: number) => {
    setScores((prev) => {
      if (isNaN(value) || value < 0 || value > 5) {
        return prev;
      }
      return { ...prev, [key]: value };
    });
  };

  useEffect(() => {
    if (applicantRecordId === null) return;
    let cancelled = false;
    const fetchApplication = async () => {
      try {
        const [data, record] = await Promise.all([
          ReviewPageAPIClient.getApplication(applicantRecordId),
          ReviewPageAPIClient.getReviewedApplicantRecordsByApplicantRecordId(
            applicantRecordId,
          ),
        ]);
        if (cancelled) return;
        setApplication({
          ...data,
          id: Number(data.id),
          firstChoiceRole: record.applicantRecord.position ?? "",
          secondChoiceRole: "",
          secondChoiceStatus: "",
          timestamp: BigInt(0),
          shortAnswerQuestions: data.shortAnswerQuestions.map(
            ({ question, answer }) => ({ question, response: answer }),
          ),
          roleSpecificQuestions: [
            JSON.stringify([
              {
                questions: data.roleSpecificQuestions.map(
                  ({ question, answer }) => ({ question, response: answer }),
                ),
              },
            ]),
          ],
        });
      } catch (error) {
        if (cancelled) return;
        console.error("Failed to fetch application:", error);
        setApplication(undefined);
      }
    };
    fetchApplication();
    return () => {
      cancelled = true;
    };
  }, [applicantRecordId]);

  if (!router.isReady) return null;

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
    } catch (error) {
      setReportConflictHasErrored(true);
    }
  };

  const onReportConflictSuccessClose = () => {
    setReportConflictSuccessDialogueOpen(false);
    router.push(BACK_TO_HOME_HREF);
  };

  return (
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
