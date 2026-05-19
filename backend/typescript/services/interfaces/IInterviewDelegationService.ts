import {
  CreateInterviewDelegationDTO,
  InterviewDelegationDTO,
  UpdateInterviewDelegationDTO,
} from "../../types";

interface IInterviewDelegationService {
  /**
   * Creates a new interview delegation record assigning an interviewer to an interviewed applicant.
   * @param interviewedApplicantRecordId FK to the interviewed applicant record
   * @param interviewerId FK to the user assigned as interviewer
   * @param groupId FK to the interview group this delegation belongs to
   */
  createInterviewDelegation(
    interviewDelegation: CreateInterviewDelegationDTO,
  ): Promise<InterviewDelegationDTO>;

  /**
   * Updates an existing interview delegation's conflict status.
   * @param interviewedApplicantRecordId FK to the interviewed applicant record
   * @param interviewerId FK to the interviewer
   * @param interviewDelegation fields to update (interviewHasConflict only)
   */
  updateInterviewDelegation(
    interviewedApplicantRecordId: string,
    interviewerId: string,
    interviewDelegation: UpdateInterviewDelegationDTO,
  ): Promise<InterviewDelegationDTO>;

  /**
   * Fetches a single interview delegation record.
   * @param interviewedApplicantRecordId FK to the interviewed applicant record
   * @param interviewerId FK to the interviewer
   */
  getInterviewDelegation(
    interviewedApplicantRecordId: string,
    interviewerId: string,
  ): Promise<InterviewDelegationDTO>;

  /**
   * Deletes a single interview delegation record.
   * @param interviewedApplicantRecordId FK to the interviewed applicant record
   * @param interviewerId FK to the interviewer
   */
  deleteInterviewDelegation(
    interviewedApplicantRecordId: string,
    interviewerId: string,
  ): Promise<InterviewDelegationDTO>;

  /**
   * Bulk creates interview delegation records, used when running the delegations algorithm.
   * @param delegations Array of interviewedApplicantRecordId and interviewerId tuples
   */
  bulkCreateInterviewDelegations(
    delegations: CreateInterviewDelegationDTO[],
  ): Promise<InterviewDelegationDTO[]>;
}

export default IInterviewDelegationService;
