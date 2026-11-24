import { skipToken, useQuery } from "@apollo/client/react";
import { CanReviewApplicantDocument } from "@/graphql/typeUtils";

/** Uses the same server assignment rule as review reads and mutations. */
export default function useCanReviewApplicant(applicantRecordId?: string) {
  return useQuery(
    CanReviewApplicantDocument,
    applicantRecordId
      ? {
          variables: { applicantRecordId },
          fetchPolicy: "no-cache",
          context: { refreshAuth: true },
        }
      : skipToken
  );
}
