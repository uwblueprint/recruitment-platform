import {
  Interview,
  InterviewDelegationDTO,
  InterviewedApplicantRecordDTO,
  InterviewedApplicantsDTO,
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
}

export default IInterviewCompositeService;
