import useReviewedApplicantsByUserId from "@/APIClients/useReviewedApplicantsByUserId";
import useInterviewedApplicantsByUserId from "@/APIClients/useInterviewedApplicantsByUserId";
import useInterviewedPairingsByUserId from "@/APIClients/useInterviewedPairingsByUserId";
import { HomeTab, type Tab } from "../constants";

export default function useHomeDashboard(userId?: string) {
  const reviews = useReviewedApplicantsByUserId(userId);
  const interviews = useInterviewedApplicantsByUserId(userId);
  const pairings = useInterviewedPairingsByUserId(userId);

  // Each tab can show its results independently of the other requests.
  const reviewedApplicants = reviews.data ?? [];
  const interviewedApplicants = interviews.data ?? [];
  const interviewedPairings = pairings.data ?? [];
  const tabCounts: Record<Tab, number> = {
    [HomeTab.APPLICATION_REVIEW]: reviewedApplicants.length,
    [HomeTab.INTERVIEW_REVIEW]: interviewedApplicants.length,
    [HomeTab.INTERVIEW_PAIRING]: interviewedPairings.length,
  };
  const tabStates = {
    [HomeTab.APPLICATION_REVIEW]: {
      loading: reviews.loading,
      error: reviews.error,
    },
    [HomeTab.INTERVIEW_REVIEW]: {
      loading: interviews.loading,
      error: interviews.error,
    },
    [HomeTab.INTERVIEW_PAIRING]: {
      loading: pairings.loading,
      error: pairings.error,
    },
  };

  return {
    reviewedApplicants,
    interviewedApplicants,
    interviewedPairings,
    tabCounts,
    tabStates,
    totalApplications:
      reviewedApplicants.length +
      interviewedApplicants.length +
      interviewedPairings.length,
  };
}
