import { skipToken, useQuery } from "@apollo/client/react";
import { CanAccessInterviewGroupDocument } from "@/graphql/typeUtils";

/** Shares the backend membership rule used by group reads and updates. */
export default function useCanAccessInterviewGroup(groupId?: string) {
  return useQuery(
    CanAccessInterviewGroupDocument,
    groupId
      ? {
          variables: { groupId },
          fetchPolicy: "no-cache",
          context: { refreshAuth: true },
        }
      : skipToken
  );
}
