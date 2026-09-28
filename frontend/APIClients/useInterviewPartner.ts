import { skipToken, useQuery } from "@apollo/client/react";
import {
  InterviewedPairingsByUserIdDocument,
  InterviewedApplicantsByUserIdDocument,
  type InterviewedPairingsByUserIdQuery,
  type InterviewedPairingsByUserIdQueryVariables,
  type InterviewedApplicantsByUserIdQuery,
  type InterviewedApplicantsByUserIdQueryVariables,
} from "@/graphql/typeUtils";

export default function useInterviewPartner(userId: string | null | undefined) {
  const pairingsQuery = useQuery<
    InterviewedPairingsByUserIdQuery,
    InterviewedPairingsByUserIdQueryVariables
  >(
    InterviewedPairingsByUserIdDocument,
    userId
      ? {
          variables: { userId },
          fetchPolicy: "network-only",
          context: { refreshAuth: true },
        }
      : skipToken
  );

  // Skipped queries retain previous data; only derive a current user's partner.
  const partner =
    userId && !pairingsQuery.loading && !pairingsQuery.error
      ? pairingsQuery.data?.interviewedPairingsByUserId
          .flatMap((pairing) => pairing.groupMembers)
          .find((member) => member.id !== userId)
      : undefined;

  const applicantsQuery = useQuery<
    InterviewedApplicantsByUserIdQuery,
    InterviewedApplicantsByUserIdQueryVariables
  >(
    InterviewedApplicantsByUserIdDocument,
    partner
      ? {
          variables: { userId: partner.id },
          fetchPolicy: "network-only",
          context: { refreshAuth: true },
        }
      : skipToken
  );
  const interviewingNames =
    partner && !applicantsQuery.loading && !applicantsQuery.error
      ? applicantsQuery.data?.interviewedApplicantsByUserId.map(
          (applicant) =>
            `${applicant.applicantFirstName} ${applicant.applicantLastName}`
        ) ?? []
      : [];

  return { partner, interviewingNames };
}
