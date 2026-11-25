import { skipToken, useQuery } from "@apollo/client/react";
import { CanAccessInterviewDocument } from "@/graphql/typeUtils";

/** Shares the backend membership rule used by interview reads and updates. */
export default function useCanAccessInterview(applicantRecordId?: string) {
  return useQuery(
    CanAccessInterviewDocument,
    applicantRecordId
      ? {
          variables: { applicantRecordId },
          fetchPolicy: "no-cache",
          context: { refreshAuth: true },
        }
      : skipToken
  );
}
