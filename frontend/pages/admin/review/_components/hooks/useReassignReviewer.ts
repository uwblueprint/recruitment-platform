import { useMutation, useQuery } from "@apollo/client/react";
import {
  UsersByPositionDocument,
  type UsersByPositionQuery,
  type UsersByPositionQueryVariables,
  type UsersByPositionResult,
  ReassignReviewerDocument,
  type ReassignReviewerMutation,
  type ReassignReviewerMutationVariables,
} from "@/graphql/typeUtils";

type ReviewerUser = NonNullable<UsersByPositionResult[number]>;

export default function useReassignReviewer(
  position: string,
  currentReviewerId: string
) {
  const usersQuery = useQuery<
    UsersByPositionQuery,
    UsersByPositionQueryVariables
  >(UsersByPositionDocument, {
    variables: { position },
    fetchPolicy: "network-only",
    context: { refreshAuth: true },
  });
  const users = usersQuery.data?.usersByPosition;
  const usersError = !!usersQuery.error || (!usersQuery.loading && !users);

  const [mutate, { data, called, loading, error }] = useMutation<
    ReassignReviewerMutation,
    ReassignReviewerMutationVariables
  >(ReassignReviewerDocument, {
    context: { refreshAuth: true },
    // Apollo exposes failures through `error`; event handlers need no catch.
    onError: () => {},
  });

  const reassignReviewer = (
    applicantRecordId: string,
    oldReviewerId: string,
    newReviewerId: string,
    onCompleted: () => void
  ): void => {
    void mutate({
      variables: { applicantRecordId, oldReviewerId, newReviewerId },
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
    updateError:
      error ??
      (called && !loading && !data?.reassignReviewer
        ? new Error("No reassigned reviewer returned")
        : undefined),
  };
}
