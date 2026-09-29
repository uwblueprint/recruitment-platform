import useApplication from "@/APIClients/queries/useApplication";
import useReviewedApplicantRecordsByApplicantRecordId from "@/APIClients/queries/useReviewedApplicantRecordsByApplicantRecordId";
import { ApplicantRecordWithReviewersResult, ApplicationResult } from "@/graphql/typeUtils";
import { ApplicationDTO } from "@/types";


const toReviewApplication = (
  data: ApplicationResult,
  record: ApplicantRecordWithReviewersResult
): ApplicationDTO => {
  return {
    ...data,
    id: Number(data.id),
    firstChoiceRole: record.applicantRecord.position ?? "",
    secondChoiceRole: "",
    secondChoiceStatus: "",
    timestamp: BigInt(0),
    shortAnswerQuestions: data.shortAnswerQuestions.map(
      ({ question, answer }) => ({ question, response: answer })
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
  const applicationQuery = useApplication(applicantRecordId ?? undefined);
  const recordQuery = useReviewedApplicantRecordsByApplicantRecordId(
    applicantRecordId ?? undefined,
    // Keep the review form mounted while a successful save refreshes reviewers.
    { notifyOnNetworkStatusChange: false }
  );
  const loading = applicationQuery.loading || recordQuery.loading;
  const error = applicationQuery.error ?? recordQuery.error;
  const data = applicationQuery.data;
  const record = recordQuery.data;
  const ready = !!applicantRecordId && !loading && !error && !!data && !!record;

  return {
    application: ready ? toReviewApplication(data, record) : undefined,
    reviewersData: ready ? record : undefined,
    loading,
    error,
  };
}
