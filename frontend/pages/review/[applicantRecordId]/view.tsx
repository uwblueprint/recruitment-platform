import ReviewPageAPIClient from "@/APIClients/ReviewPageAPIClient";
import { ProtectedApplication } from "@/components/contexts/ProtectedApplication";
import { ProtectedRoute } from "@/components/contexts/ProtectedRoute";
import {
  ApplicantRecordWithReviewersResult,
  ApplicationResult,
} from "@/graphql/typeUtils";
import { ApplicationDTO } from "@/types";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ReviewStageHeader } from "../_components/common/ReviewStageHeader";
import {
  BACK_TO_HOME_HREF,
  ReviewStage,
} from "../_components/constants";
import {
  ReviewSetScoresContext,
  ReviewSetStageContext,
} from "../_components/ReviewContext";
import { ReviewDriveToLearnStage } from "../_components/stages/ReviewDriveToLearnStage";
import { ReviewEndStage } from "../_components/stages/ReviewEndStage";
import { ReviewInfoStage } from "../_components/stages/ReviewInfoStage";
import { ReviewPassionForSocialGoodStage } from "../_components/stages/ReviewPassionForSocialGoodStage";
import { ReviewSkillStage } from "../_components/stages/ReviewSkillStage";
import { ReviewTeamPlayerStage } from "../_components/stages/ReviewTeamPlayerStage";
import { ReviewEndData, ReviewScores } from "../_components/types";
import { getApplicantRecordId } from "../_components/utils";

const toApplicationDTO = (
  remote: ApplicationResult,
  firstChoiceRole: string,
): ApplicationDTO => ({
  id: Number(remote.id),
  academicOrCoop: remote.academicOrCoop,
  academicYear: remote.academicYear,
  email: remote.email,
  firstChoiceRole,
  firstName: remote.firstName,
  heardFrom: remote.heardFrom,
  lastName: remote.lastName,
  locationPreference: remote.locationPreference,
  program: remote.program,
  pronouns: remote.pronouns,
  pronounsSpecified: remote.pronounsSpecified,
  resumeUrl: remote.resumeUrl,
  roleSpecificQuestions: remote.roleSpecificQuestions.map((q) =>
    JSON.stringify(q),
  ),
  secondChoiceRole: "",
  shortAnswerQuestions: remote.shortAnswerQuestions.map(
    ({ question, answer }) => ({ question, response: answer }),
  ),
  status: remote.status,
  secondChoiceStatus: "",
  term: remote.term,
  timesApplied: remote.timesApplied,
  timestamp: BigInt(0),
});

const initialScores: ReviewScores = {
  [ReviewStage.INFO]: 0,
  [ReviewStage.PFSG]: 0,
  [ReviewStage.TP]: 0,
  [ReviewStage.D2L]: 0,
  [ReviewStage.SKL]: 0,
  [ReviewStage.END]: 0,
  [ReviewStage.END_SUCCESS]: 0,
};

const initialEndData: ReviewEndData = {
  comments: "",
  skillsCategory: "",
  secondChoiceRole: "",
};

const ReviewViewPage: NextPage = () => {
  const router = useRouter();
  const [stage, setStage] = useState<ReviewStage>(ReviewStage.INFO);
  const [application, setApplication] = useState<ApplicationDTO>();
  const [reviewersData, setReviewersData] =
    useState<ApplicantRecordWithReviewersResult | null>(null);

  const reviewers = reviewersData?.reviewedApplicantRecords ?? [];
  const combinedReviewScore = reviewersData?.applicantRecord.combinedReviewScore;
  const position = reviewersData?.applicantRecord.position ?? "";

  const applicantRecordId = router.isReady
    ? getApplicantRecordId(router.query)
    : null;
  const applicantName = application
    ? `${application.firstName} ${application.lastName}`
    : "Applicant";

  useEffect(() => {
    if (applicantRecordId === null) return;
    const fetchApplication = async () => {
      try {
        const data = await ReviewPageAPIClient.getApplication(applicantRecordId);
        setApplication(toApplicationDTO(data, position));
      } catch (error) {
        console.error("Failed to fetch application:", error);
        setApplication(undefined);
      }
    };
    fetchApplication();
  }, [applicantRecordId, position]);

  useEffect(() => {
    if (applicantRecordId === null) return;
    const fetchReviewers = async () => {
      try {
        const data =
          await ReviewPageAPIClient.getReviewedApplicantRecordsByApplicantRecordId(
            applicantRecordId,
          );
        setReviewersData(data);
      } catch (error) {
        console.error("Failed to fetch reviewer records:", error);
        setReviewersData(null);
      }
    };
    fetchReviewers();
  }, [applicantRecordId]);

  if (!router.isReady) return null;

  const getReviewStage = () => {
    switch (stage) {
      case ReviewStage.INFO:
        return (
          <ReviewInfoStage
            name={applicantName}
            application={application}
            scores={initialScores}
            viewOnly
          />
        );
      case ReviewStage.PFSG:
        return (
          <ReviewPassionForSocialGoodStage
            name={applicantName}
            application={application}
            scores={initialScores}
            viewOnly
            reviewers={reviewers}
          />
        );
      case ReviewStage.TP:
        return (
          <ReviewTeamPlayerStage
            name={applicantName}
            application={application}
            scores={initialScores}
            viewOnly
            reviewers={reviewers}
          />
        );
      case ReviewStage.D2L:
        return (
          <ReviewDriveToLearnStage
            name={applicantName}
            application={application}
            scores={initialScores}
            viewOnly
            reviewers={reviewers}
          />
        );
      case ReviewStage.SKL:
        return (
          <ReviewSkillStage
            name={applicantName}
            application={application}
            scores={initialScores}
            viewOnly
            reviewers={reviewers}
            header={<ReviewStageHeader backHref={BACK_TO_HOME_HREF} />}
          />
        );
      case ReviewStage.END:
      default:
        return (
          <ReviewEndStage
            name={applicantName}
            reviewerName=""
            scores={initialScores}
            endData={initialEndData}
            setEndData={() => undefined}
            viewOnly
            reviewers={reviewers}
            combinedReviewScore={combinedReviewScore}
          />
        );
    }
  };

  return (
    <ReviewSetScoresContext.Provider value={null}>
      <ReviewSetStageContext.Provider value={setStage}>
        {getReviewStage()}
      </ReviewSetStageContext.Provider>
    </ReviewSetScoresContext.Provider>
  );
};

const ReviewView: NextPage = () => {
  return (
    <ProtectedRoute allowedRoles={["Admin"]}>
      <ProtectedApplication>
        <ReviewViewPage />
      </ProtectedApplication>
    </ProtectedRoute>
  );
};

export default ReviewView;
