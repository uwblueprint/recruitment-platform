import useUsersByPosition from "@/APIClients/useUsersByPosition";
import useReassignReviewerMutation from "@/APIClients/useReassignReviewer";
import {
  ReviewedApplicantRecordsByApplicantRecordIdDocument,
  ReviewDashboardSidePanelDocument,
  type UsersByPositionResult,
} from "@/graphql/typeUtils";

type ReviewerUser = NonNullable<UsersByPositionResult[number]>;

export default function useReassignReviewer(
  position: string,
  currentReviewerId: string
) {
  const usersQuery = useUsersByPosition(position);
  const users = usersQuery.data;
  const usersError = !!usersQuery.error;
  const { mutate, loading, error } = useReassignReviewerMutation();

  const reassignReviewer = (
    applicantRecordId: string,
    oldReviewerId: string,
    newReviewerId: string,
    onCompleted: () => void
  ): void => {
    if (
      loading ||
      !users?.some(
        (user) =>
          user &&
          !user.isArchived &&
          user.id === newReviewerId &&
          user.id !== currentReviewerId
      )
    )
      return;
    void mutate({
      variables: { applicantRecordId, oldReviewerId, newReviewerId },
      // Refresh mounted detail views; the page callback refreshes dashboard rows and IDs.
      refetchQueries: [
        ReviewedApplicantRecordsByApplicantRecordIdDocument,
        ReviewDashboardSidePanelDocument,
      ],
      awaitRefetchQueries: true,
      onCompleted: (result) => {
        if (result.reassignReviewer) onCompleted();
      },
    });
  };

  return {
    users:
      !usersQuery.loading && !usersError && users
        ? users
            .filter((user): user is ReviewerUser => user !== null)
            .filter((user) => !user.isArchived && user.id !== currentReviewerId)
            .sort((left, right) =>
              `${left.firstName} ${left.lastName}`
                .toLowerCase()
                .localeCompare(
                  `${right.firstName} ${right.lastName}`.toLowerCase()
                )
            )
        : [],
    isLoadingUsers: usersQuery.loading,
    usersError,
    reassignReviewer,
    isSubmitting: loading,
    updateError: error,
  };
}
