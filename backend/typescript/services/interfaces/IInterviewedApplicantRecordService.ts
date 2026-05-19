import {
  CreateInterviewedApplicantRecordDTO,
  InterviewedApplicantRecordDTO,
  UpdateInterviewedApplicantRecordDTO,
} from "../../types";

interface IInterviewedApplicantRecordsService {
  /**
   * Gets a single interviewed applicant record by ID
   * @Param id the ID of the interviewed applicant record to get
   */
  getInterviewedApplicantRecordById(
    id: string,
  ): Promise<InterviewedApplicantRecordDTO>;

  /**
   * Creates a single interviewed applicant record
   * @Param interviewedApplicantRecord the interviewed applicant record to create
   */
  createInterviewedApplicantRecord(
    interviewedApplicantRecord: CreateInterviewedApplicantRecordDTO,
  ): Promise<InterviewedApplicantRecordDTO>;

  /**
   * Updates a single interviewed applicant record
   * @Param id the ID of the interviewed applicant record to update
   * @Param interviewedApplicantRecord the fields to update
   */
  updateInterviewedApplicantRecord(
    id: string,
    interviewedApplicantRecord: UpdateInterviewedApplicantRecordDTO,
  ): Promise<InterviewedApplicantRecordDTO>;

  /**
   * Deletes a single interviewed applicant record
   * @Param id the ID of the interviewed applicant record to delete
   */
  deleteInterviewedApplicantRecordById(
    id: string,
  ): Promise<InterviewedApplicantRecordDTO>;
}

export default IInterviewedApplicantRecordsService;
