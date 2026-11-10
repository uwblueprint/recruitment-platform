import useReviewApplication from "../_components/hooks/useReviewApplication";
import { ProtectedApplication } from "@/components/contexts/ProtectedApplication";
import { ProtectedRoute } from "@/components/contexts/ProtectedRoute";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { ReviewStageHeader } from "../_components/common/ReviewStageHeader";
import { BACK_TO_HOME_HREF, ReviewStage } from "../_components/constants";
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
import { Role } from "@/graphql/__generated__/types";

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
  const applicantRecordId = router.isReady
    ? getApplicantRecordId(router.query)
    : null;
  const { application, reviewersData, loading, error } =
    useReviewApplication(applicantRecordId);
  const reviewers = reviewersData?.reviewedApplicantRecords ?? [];
  const combinedReviewScore =
    reviewersData?.applicantRecord.combinedReviewScore ?? null;
  const applicantName = application
    ? `${application.firstName} ${application.lastName}`
    : "Applicant";

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
    <ProtectedRoute allowedRoles={[Role.Admin, Role.User]}>
      <ProtectedApplication>
        <ReviewViewPage />
      </ProtectedApplication>
    </ProtectedRoute>
  );
};

export default ReviewView;
