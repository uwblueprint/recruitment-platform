import {
  InterviewDelegationDTO,
  InterviewDashboardRowDTO,
  InterviewDashboardSortBy,
  InterviewedApplicantsDTO,
  InterviewPairingsDTO,
  UserDTO,
} from "../../types";

interface IInterviewCompositeService {
  /**
   * Fetches paginated applicants for the admin interview dashboard.
   * @Param pageNumber the page the viewer is on
   * @Param resultsPerPage the number of results per page
   * @Param sortBy the dashboard column to sort results by
   * @Param sortAscending whether to sort ascending; defaults to true
   */
  getInterviewDashboard(
    pageNumber: number,
    resultsPerPage: number,
    sortBy?: InterviewDashboardSortBy,
    sortAscending?: boolean,
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
}

export default IInterviewCompositeService;
