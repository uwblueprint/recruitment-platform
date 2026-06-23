import {
  Interview,
  InterviewDelegationDTO,
  InterviewedApplicantRecordDTO,
  InterviewedApplicantsDTO,
  InterviewNotesDTO,
  InterviewPairingsDTO,
  UserDTO,
} from "../../types";

interface IInterviewCompositeService {
  /**
   * Delegates interviewers to interview applicants.
   */
  delegateInterviewers(positions: string[]): Promise<InterviewDelegationDTO[]>;
  /**
   * Fetches information about all the applicants assigned to a user to interview.
   * @param userId the id of the interviewer
   */
  getInterviewedApplicantsByUserId(
    userId: string,
  ): Promise<InterviewedApplicantsDTO[]>;

  /**
   * Fetches interview pairing group information for an interviewer.
   * @param userId the id of the interviewer
   */
  getInterviewedPairingsByUserId(
    userId: string,
  ): Promise<InterviewPairingsDTO[]>;

  /**
   * Returns distinct interviewers assigned to an interview group (by delegation rows).
   * @param groupId the interview group id
   */
  getInterviewersByGroupId(groupId: string): Promise<UserDTO[]>;

  /**
   * Submits interview scores for an interviewed applicant record.
   * Delegates to the generic updateInterviewedApplicantRecord service.
   * @param interviewedApplicantRecordId the ID of the interviewed applicant record
   * @param scores the interview scores to submit
   */
  submitInterviewScores(
    interviewedApplicantRecordId: string,
    scores: Interview,
  ): Promise<InterviewedApplicantRecordDTO>;

  /**
   * Fetch the interview notes attached to an interviewed applicant record.
   * Returns null if no notes file has been uploaded yet.
   * @param interviewedApplicantRecordId the InterviewedApplicantRecord PK.
   */
  getInterviewNotesByInterviewedApplicantRecordId(
    interviewedApplicantRecordId: string,
  ): Promise<InterviewNotesDTO | null>;

  /**
   * Upload (or replace) the PDF interview notes for an interviewed applicant
   * record. If a previous file exists, it is deleted from storage + DB after
   * the new file is successfully attached. Best-effort cleanup: cleanup
   * failures are logged but do not fail the mutation.
   * @throws if the file is not a PDF.
   * @param interviewedApplicantRecordId the InterviewedApplicantRecord PK.
   * @param uploadedUserId the id of the user performing the upload.
   * @param upload local-disk metadata for the streamed-in file.
   */
  uploadInterviewNotes(
    interviewedApplicantRecordId: string,
    uploadedUserId: number,
    upload: {
      localFilePath: string;
      originalFileName: string;
      sizeBytes: number;
      contentType: string;
    },
  ): Promise<InterviewNotesDTO>;
}

export default IInterviewCompositeService;
