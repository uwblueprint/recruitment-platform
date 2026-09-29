import useApplication from "@/APIClients/useApplication";
import useReviewedApplicantRecordsByApplicantRecordId from "@/APIClients/useReviewedApplicantRecordsByApplicantRecordId";

export default function useInterviewProfile(applicantRecordId?: string) {
  const applicationQuery = useApplication(applicantRecordId);
  const reviewersQuery =
    useReviewedApplicantRecordsByApplicantRecordId(applicantRecordId);

  const isLoading =
    !!applicantRecordId && (applicationQuery.loading || reviewersQuery.loading);
  const application = applicationQuery.data;
  const record = reviewersQuery.data;
  const hasError =
    !!applicantRecordId &&
    (!!applicationQuery.error ||
      !!reviewersQuery.error ||
      (!isLoading && (!application || !record)));
  // Show the profile only when both operations have completed successfully.
  const ready = !!applicantRecordId && !isLoading && !hasError;

  return {
    application: ready ? application : undefined,
    reviewers: ready ? record?.reviewedApplicantRecords ?? [] : [],
    combinedReviewScore: ready
      ? record?.applicantRecord.combinedReviewScore ?? undefined
      : undefined,
    position: ready ? record?.applicantRecord.position ?? "" : "",
    candidateName:
      ready && application
        ? `${application.firstName} ${application.lastName}`
        : undefined,
    isLoading,
    hasError,
  };
}
