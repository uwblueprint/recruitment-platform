import { skipToken, useQuery } from "@apollo/client/react";
import {
  ApplicationDocument,
  ReviewedApplicantRecordsByApplicantRecordIdDocument,
  type ApplicationResult,
  type ApplicationQuery,
  type ApplicationQueryVariables,
  type ReviewedApplicantRecordsByApplicantRecordIdQuery,
  type ReviewedApplicantRecordsByApplicantRecordIdQueryVariables,
  type ApplicantRecordWithReviewersResult,
} from "@/graphql/typeUtils";
import type { ApplicationDTO } from "@/types";

export function toReviewApplication(
  data: ApplicationResult,
  record: ApplicantRecordWithReviewersResult,
): ApplicationDTO {
  return {
    ...data,
    id: Number(data.id),
    firstChoiceRole: record.applicantRecord.position ?? "",
    secondChoiceRole: "",
    secondChoiceStatus: "",
    timestamp: BigInt(0),
    shortAnswerQuestions: data.shortAnswerQuestions.map(
      ({ question, answer }) => ({ question, response: answer }),
    ),
    roleSpecificQuestions: [
      JSON.stringify([
        {
          questions: data.roleSpecificQuestions.map(({ question, answer }) => ({
            question,
            response: answer,
          })),
        },
      ]),
    ],
  };
}

export default function useReviewApplication(applicantRecordId: string | null) {
  const options =
    applicantRecordId === null
      ? skipToken
      : {
          variables: { applicantRecordId },
          fetchPolicy: "network-only" as const,
          context: { refreshAuth: true },
        };
  const applicationQuery = useQuery<
    ApplicationQuery,
    ApplicationQueryVariables
  >(ApplicationDocument, options);
  const recordQuery = useQuery<
    ReviewedApplicantRecordsByApplicantRecordIdQuery,
    ReviewedApplicantRecordsByApplicantRecordIdQueryVariables
  >(
    ReviewedApplicantRecordsByApplicantRecordIdDocument,
    options === skipToken
      ? skipToken
      : {
          ...options,
          // Keep the form mounted while a successful save refreshes reviewer data.
          notifyOnNetworkStatusChange: false,
        },
  );

  // skipToken retains previous data; never expose it without a current ID.
  if (applicantRecordId === null) {
    return {
      application: undefined,
      reviewersData: undefined,
      loading: false,
      error: undefined,
    };
  }

  const loading = applicationQuery.loading || recordQuery.loading;
  const data = applicationQuery.data?.application;
  const record = recordQuery.data?.reviewedApplicantRecordsByApplicantRecordId;
  const error =
    applicationQuery.error ??
    recordQuery.error ??
    (!loading && (!data || !record)
      ? new Error("No application data returned")
      : undefined);

  return {
    application:
      !loading && !error && data && record
        ? toReviewApplication(data, record)
        : undefined,
    reviewersData: !loading && !error ? record : undefined,
    loading,
    error,
  };
}
