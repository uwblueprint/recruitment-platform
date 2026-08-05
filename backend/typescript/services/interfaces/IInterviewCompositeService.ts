import {
  InterviewDelegationDTO,
  InterviewDashboardRowDTO,
  InterviewDashboardSidePanelDTO,
  InterviewedApplicantsDTO,
  InterviewPairingsDTO,
  UserDTO,
} from "../../types";

interface IInterviewCompositeService {
  /**
   * Fetches paginated applicants for the admin interview dashboard.
   */
  getInterviewDashboard(
    pageNumber: number,
    resultsPerPage: number,
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
}

export default IInterviewCompositeService;
