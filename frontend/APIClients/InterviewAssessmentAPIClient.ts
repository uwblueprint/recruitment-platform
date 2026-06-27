import { client } from "@/client";
import BaseAPIClient from "./BaseAPIClient";
import {
  InterviewedApplicantRecordByApplicantRecordIdDocument,
  SubmitInterviewScoresDocument,
  type InterviewedApplicantRecordByApplicantRecordIdQuery,
  type InterviewedApplicantRecordByApplicantRecordIdQueryVariables,
  type SubmitInterviewScoresMutation,
  type SubmitInterviewScoresMutationVariables,
  type InterviewedApplicantRecordResult,
  type SubmitInterviewScoresResult,
  type InterviewInput,
} from "@/graphql/typeUtils";

class InterviewAssessmentAPIClient {
  static async getInterviewedApplicantRecordByApplicantRecordId(
    applicantRecordId: string,
  ): Promise<InterviewedApplicantRecordResult> {
    await BaseAPIClient.handleAuthRefresh();

    try {
      const { data } = await client.query<
        InterviewedApplicantRecordByApplicantRecordIdQuery,
        InterviewedApplicantRecordByApplicantRecordIdQueryVariables
      >({
        query: InterviewedApplicantRecordByApplicantRecordIdDocument,
        variables: { applicantRecordId },
        fetchPolicy: "network-only",
      });

      if (!data?.interviewedApplicantRecordByApplicantRecordId) {
        throw new Error("No data returned");
      }

      return data.interviewedApplicantRecordByApplicantRecordId;
    } catch {
      throw new Error("Failed to get interviewed applicant record");
    }
  }

  static async submitInterviewScores(
    id: string,
    interviewJson: InterviewInput,
  ): Promise<SubmitInterviewScoresResult> {
    await BaseAPIClient.handleAuthRefresh();

    try {
      const { data } = await client.mutate<
        SubmitInterviewScoresMutation,
        SubmitInterviewScoresMutationVariables
      >({
        mutation: SubmitInterviewScoresDocument,
        variables: { id, interviewJson },
      });

      if (!data?.submitInterviewScores) {
        throw new Error("No data returned");
      }

      return data.submitInterviewScores;
    } catch {
      throw new Error("Failed to submit interview scores");
    }
  }
}

export default InterviewAssessmentAPIClient;
