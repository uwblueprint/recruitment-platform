import useInterviewGroup from "@/APIClients/queries/useInterviewGroup";
import useInterviewersByGroupId from "@/APIClients/queries/useInterviewersByGroupId";
import useInterviewedApplicantsByUserId from "@/APIClients/queries/useInterviewedApplicantsByUserId";

export default function useInterviewGroupDetails(
  groupId: string,
  userId?: string
) {
  const groupQuery = useInterviewGroup(userId ? groupId : undefined);
  const interviewersQuery = useInterviewersByGroupId(
    userId ? groupId : undefined
  );
  const applicantsQuery = useInterviewedApplicantsByUserId(
    groupId ? userId : undefined
  );
  const isLoading =
    groupQuery.loading || interviewersQuery.loading || applicantsQuery.loading;
  const isMember =
    !!userId &&
    !!interviewersQuery.data?.some((member) => member.id === userId);
  const error =
    !!userId &&
    (!!groupQuery.error ||
      !!interviewersQuery.error ||
      !!applicantsQuery.error ||
      (!isLoading && !isMember));
  const ready = !!userId && !isLoading && !error;
  const group = ready ? groupQuery.data : undefined;
  const partner = ready
    ? interviewersQuery.data?.find((member) => member.id !== userId) ?? null
    : null;
  const applicantNames = ready
    ? applicantsQuery.data
        ?.map(
          (applicant) =>
            `${applicant.applicantFirstName} ${applicant.applicantLastName}`
        )
        .join(", ") ?? ""
    : "";
  return { group, partner, applicantNames, isLoading, error };
}
