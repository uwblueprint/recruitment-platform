import useInterviewApplication from "@/APIClients/queries/useInterviewApplication";
import useInterviewReviewDetails from "@/APIClients/queries/useInterviewReviewDetails";

export default function useInterviewProfile(applicantRecordId?: string) {
  const applicationQuery = useInterviewApplication(applicantRecordId);
  const reviewersQuery =
    useInterviewReviewDetails(applicantRecordId);

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
