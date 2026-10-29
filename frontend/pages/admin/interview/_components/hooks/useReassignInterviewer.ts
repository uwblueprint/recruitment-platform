import useUsersByPosition from "@/APIClients/queries/useUsersByPosition";
import useReassignInterviewerMutation from "@/APIClients/mutations/useReassignInterviewer";
import {
  InterviewDashboardSidePanelDocument,
  type UsersByPositionResult,
} from "@/graphql/typeUtils";

type InterviewerUser = NonNullable<UsersByPositionResult[number]>;

export default function useReassignInterviewer(
  position: string,
  assignedInterviewerIds: string[],
) {
  const usersQuery = useUsersByPosition(position);
  const users = usersQuery.data;
  const usersError = !!usersQuery.error;
  const { mutate, loading, error } = useReassignInterviewerMutation();

  const reassignInterviewer = (
    applicantRecordId: string,
    oldInterviewerId: string,
    newInterviewerId: string,
    onCompleted: () => void,
  ): void => {
    if (
      loading ||
      !users?.some(
        (user) =>
          user &&
          !user.isArchived &&
          user.id === newInterviewerId &&
          !assignedInterviewerIds.includes(user.id),
      )
    )
      return;
    void mutate({
      variables: { applicantRecordId, oldInterviewerId, newInterviewerId },
      refetchQueries: [InterviewDashboardSidePanelDocument],
      awaitRefetchQueries: true,
      onCompleted: (result) => {
        if (result.reassignInterviewer) onCompleted();
      },
    });
  };

  return {
    users:
      !usersQuery.loading && !usersError && users
        ? users
            .filter((user): user is InterviewerUser => user !== null)
            .filter(
              (user) =>
                !user.isArchived && !assignedInterviewerIds.includes(user.id),
            )
            .sort((left, right) =>
              `${left.firstName} ${left.lastName}`
                .toLowerCase()
                .localeCompare(
                  `${right.firstName} ${right.lastName}`.toLowerCase(),
                ),
            )
        : [],
    isLoadingUsers: usersQuery.loading,
    usersError,
    reassignInterviewer,
    isSubmitting: loading,
    updateError: error,
  };
}
