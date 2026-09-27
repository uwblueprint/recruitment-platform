import { client } from "@/client";
import BaseAPIClient from "./BaseAPIClient";
import {
  InterviewedApplicantRecordByApplicantRecordIdDocument,
  InterviewNotesDocument,
  SubmitInterviewScoresDocument,
  UploadInterviewNotesDocument,
  type InterviewedApplicantRecordByApplicantRecordIdQuery,
  type InterviewedApplicantRecordByApplicantRecordIdQueryVariables,
  type InterviewNotesQuery,
  type InterviewNotesQueryVariables,
  type SubmitInterviewScoresMutation,
  type SubmitInterviewScoresMutationVariables,
  type UploadInterviewNotesMutation,
  type UploadInterviewNotesMutationVariables,
  type InterviewedApplicantRecordResult,
  type InterviewNotesResult,
  type SubmitInterviewScoresResult,
  type UploadInterviewNotesResult,
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
    } catch (error) {
      const message =
        error instanceof Error ? error.message : String(error);
      console.error("getInterviewedApplicantRecordByApplicantRecordId failed:", error);
      throw new Error(`Failed to get interviewed applicant record: ${message}`);
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
    } catch (error) {
      const message =
        error instanceof Error ? error.message : String(error);
      console.error("submitInterviewScores failed:", error);
      throw new Error(`Failed to submit interview scores: ${message}`);
    }
  }

  /**
   * Fetch the currently-attached interview notes file for a record. Returns
   * `null` when no file has been uploaded yet — callers should treat that as
   * the empty/idle state rather than an error.
   */
  static async getInterviewNotes(
    interviewedApplicantRecordId: string,
  ): Promise<InterviewNotesResult | null> {
    await BaseAPIClient.handleAuthRefresh();

    try {
      const { data } = await client.query<
        InterviewNotesQuery,
        InterviewNotesQueryVariables
      >({
        query: InterviewNotesDocument,
        variables: { interviewedApplicantRecordId },
        fetchPolicy: "network-only",
      });
      return data?.interviewNotes ?? null;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error("getInterviewNotes failed:", error);
      throw new Error(`Failed to get interview notes: ${message}`);
    }
  }

  /**
   * Upload (or replace) the interview notes PDF for a record. The backend
   * deletes the previously-attached file on success; failures leave the
   * existing file untouched. The `file` is sent as a graphql multipart upload
   * via `apollo-upload-client` (configured in `client.ts`).
   */
  static async uploadInterviewNotes(
    interviewedApplicantRecordId: string,
    file: File,
  ): Promise<UploadInterviewNotesResult> {
    await BaseAPIClient.handleAuthRefresh();

    try {
      const { data } = await client.mutate<
        UploadInterviewNotesMutation,
        UploadInterviewNotesMutationVariables
      >({
        mutation: UploadInterviewNotesDocument,
        variables: { interviewedApplicantRecordId, file },
        // The upload link expects multipart, not deduped against an in-flight
        // request — disable any caching for this op.
        fetchPolicy: "no-cache",
      });

      if (!data?.uploadInterviewNotes) {
        throw new Error("No data returned");
      }
      return data.uploadInterviewNotes;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error("uploadInterviewNotes failed:", error);
      throw new Error(`Failed to upload interview notes: ${message}`);
    }
  }
}

export default InterviewAssessmentAPIClient;
