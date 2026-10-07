import {
  InterviewDelegationDTO,
  DashboardView,
  InterviewDashboardCountsDTO,
  InterviewDashboardFilters,
  InterviewDashboardRowDTO,
  InterviewDashboardSidePanelDTO,
  InterviewDashboardSortBy,
  InterviewInviteDTO,
  InterviewedApplicantsDTO,
  InterviewNotesDTO,
  InterviewPairingsDTO,
  UserDTO,
} from "../../types";
import { CreateFirebaseFileDTO } from "../../types/firebaseFile";

interface IInterviewCompositeService {
  getInterviewDashboardCounts(
    filters?: InterviewDashboardFilters,
  ): Promise<InterviewDashboardCountsDTO>;

  /**
   * Fetches paginated applicants for the admin interview dashboard.
   * @Param pageNumber the page the viewer is on
   * @Param resultsPerPage the number of results per page
   * @Param sortBy the dashboard column to sort results by
   * @Param sortAscending whether to sort ascending; defaults to true
   * @Param view the dashboard tab to restrict results to
   * @Param filters search text and filter menu selections to narrow results by
   */
  getInterviewDashboard(
    pageNumber: number,
    resultsPerPage: number,
    sortBy?: InterviewDashboardSortBy,
    sortAscending?: boolean,
    view?: DashboardView,
    filters?: InterviewDashboardFilters,
  ): Promise<InterviewDashboardRowDTO[]>;

  /**
   * Fetches the details shown in the admin interview dashboard side panel.
   * @param applicantRecordId the id of the applicant record to display
   */
  getInterviewDashboardSidePanel(
    applicantRecordId: string,
  ): Promise<InterviewDashboardSidePanelDTO>;

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
