import { AdminCommentsByApplicantRecordIdDocument } from "@/graphql/typeUtils";

export const refreshAdminComments = (applicantRecordId?: string | null) => ({
  awaitRefetchQueries: true,
  refetchQueries: applicantRecordId
    ? [
        {
          query: AdminCommentsByApplicantRecordIdDocument,
          variables: { applicantRecordId },
          context: { refreshAuth: true },
        },
      ]
    : [],
});
