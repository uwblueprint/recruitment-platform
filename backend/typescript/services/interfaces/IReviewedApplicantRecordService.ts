import {
  ReviewedApplicantRecordDTO,
  CreateReviewedApplicantRecordDTO,
  UpdateReviewedApplicantRecordDTO,
} from "../../types";

interface IReviewApplicantRecordService {
  /**
   * Gets a single reviewed applicant record by primary key
   * @Param applicantRecordId the ID of the applicant record
   * @Param reviewerId the ID of the reviewer
   */
  getReviewedApplicantRecordByPk(
    applicantRecordId: string,
    reviewerId: number,
  ): Promise<ReviewedApplicantRecordDTO>;

  /**
   * Creates a single reviewed applicant record entry
   * @Param createReviewedApplicantRecordDTO data to create reviewed applicant record
   */
  createReviewedApplicantRecord(
    reviewedApplicantRecord: CreateReviewedApplicantRecordDTO,
  ): Promise<ReviewedApplicantRecordDTO>;

  /**
   * Creates multiple reviewed applicant record entries in bulk
   * @Param createReviewedApplicantRecordDTOs array of data to create reviewed applicant records
   */
  bulkCreateReviewedApplicantRecord(
    reviewedApplicantRecords: CreateReviewedApplicantRecordDTO[],
  ): Promise<ReviewedApplicantRecordDTO[]>;

  /**
   * Deletes a single reviewed applicant record entry
   * @Param applicantRecordId the ID of applicant record to delete
   * @Param reviewerId the ID of the reviewer
   */
  deleteReviewedApplicantRecordByPk(
    applicantRecordId: string,
    reviewerId: number,
  ): Promise<ReviewedApplicantRecordDTO>;

  /**
   * Updates the review content and/or status of a ReviewedApplicantRecord
   * Also updates the combined score in the ApplicantRecord table
   * @Param updateReviewedApplicantRecordDTO data to update reviewed applicant record
   */
  updateReviewedApplicantRecord(
    applicantRecordId: string,
    reviewerId: number,
    reviewedApplicantRecord: UpdateReviewedApplicantRecordDTO,
  ): Promise<ReviewedApplicantRecordDTO>;
}

export default IReviewApplicantRecordService;
