import {
  InterviewDelegationDTO,
  InterviewDashboardRowDTO,
  InterviewInviteDTO,
  InterviewedApplicantsDTO,
  InterviewNotesDTO,
  InterviewPairingsDTO,
  UserDTO,
} from "../../types";
import { CreateFirebaseFileDTO } from "../../types/firebaseFile";

interface IInterviewCompositeService {
  /**
   * Fetches paginated applicants for the admin interview dashboard.
   */
  getInterviewDashboard(
    pageNumber: number,
    resultsPerPage: number,
  ): Promise<InterviewDashboardRowDTO[]>;

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
   * Fetches all interview groups with their interviewers and interviewees for the admin interview invites page.
   */
  getInterviewInvites(): Promise<InterviewInviteDTO[]>;

  /**
   * Upload (or replace) the PDF interview notes for an interviewed applicant
   * record. If a previous file exists, it is deleted from storage + DB after
   * the new file is successfully attached. Best-effort cleanup: cleanup
   * failures are logged but do not fail the mutation.
   * @throws if the file is not a PDF.
   * @param interviewedApplicantRecordId the InterviewedApplicantRecord PK.
   * @param upload file metadata including the local temp path and uploader id.
   */
  uploadInterviewNotes(
    interviewedApplicantRecordId: string,
    upload: CreateFirebaseFileDTO,
  ): Promise<InterviewNotesDTO>;
}

export default IInterviewCompositeService;
