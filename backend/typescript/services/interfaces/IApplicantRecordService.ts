import {
  ApplicantRecordDTO,
  BulkUpdateApplicantRecordDTO,
  CreateApplicantRecordDTO,
  UpdateApplicantRecordDTO,
} from "../../types";

interface IApplicantRecordService {
  /**
   * Get applicant record associated with id
   * @param id applicant record id
   * @returns the ApplicantRecordDTO
   * @throws Error if applicant record retrieval fails
   */
  getApplicantRecordById(id: string): Promise<ApplicantRecordDTO>;

  /**
   * Create an applicant record
   * @param applicantRecord the applicant record to be created
   * @returns the created ApplicantRecordDTO
   * @throws Error if applicant record creation fails
   */
  createApplicantRecord(
    applicantRecord: CreateApplicantRecordDTO,
  ): Promise<ApplicantRecordDTO>;

  /**
   * Update an applicant record
   * @param id applicant record id
   * @param applicantRecord the applicant record to be updated
   * @returns the updated ApplicantRecordDTO
   * @throws Error if applicant record update fails
   */
  updateApplicantRecord(
    id: string,
    applicantRecord: UpdateApplicantRecordDTO,
  ): Promise<ApplicantRecordDTO>;

  /**
   * Delete an applicant record associated with id
   * @param id applicant record id
   * @returns the deleted ApplicantRecordDTO
   * @throws Error if applicant record deletion fails
   */
  deleteApplicantRecordById(id: string): Promise<ApplicantRecordDTO>;

  /**
   * Bulk create applicant records
   * @param applicantRecords the applicant records to be created
   * @returns the array of created ApplicantRecordDTOs
   * @throws Error if applicant record bulk creation fails
   */
  bulkCreateApplicantRecords(
    applicantRecords: CreateApplicantRecordDTO[],
  ): Promise<ApplicantRecordDTO[]>;

  /**
   * Bulk update applicant records
   * @param applicantRecords the applicant records to be updated
   * @returns the array of updated ApplicantRecordDTOs
   * @throws Error if applicant record bulk update fails
   */
  bulkUpdateApplicantRecords(
    applicantRecords: BulkUpdateApplicantRecordDTO[],
  ): Promise<ApplicantRecordDTO[]>;
}

export default IApplicantRecordService;
