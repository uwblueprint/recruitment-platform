import { Transaction } from "sequelize";
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
    reviewerId: string,
  ): Promise<ReviewedApplicantRecordDTO>;

  /**
   * Creates a single reviewed applicant record entry
   * @Param createReviewedApplicantRecordDTO data to create reviewed applicant record
   * @Param transaction optional sequelize transaction
   */
  createReviewedApplicantRecord(
    reviewedApplicantRecord: CreateReviewedApplicantRecordDTO,
    transaction?: Transaction,
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
   * @Param transaction optional sequelize transaction
   */
  deleteReviewedApplicantRecordByPk(
    applicantRecordId: string,
    reviewerId: string,
    transaction?: Transaction,
  ): Promise<ReviewedApplicantRecordDTO>;

  /**
   * Updates the review content and/or status of a ReviewedApplicantRecord
   * Also updates the combined score in the ApplicantRecord table
   * @Param updateReviewedApplicantRecordDTO data to update reviewed applicant record
   */
  updateReviewedApplicantRecord(
    applicantRecordId: string,
    reviewerId: string,
    reviewedApplicantRecord: UpdateReviewedApplicantRecordDTO,
  ): Promise<ReviewedApplicantRecordDTO>;

  /**
   * Reassigns a reviewer for a given applicant record
   * @param applicantRecordId the ID of the applicant record to update reviewer
   * @param oldReviewerId the ID of the reviewer to replace
   * @param newReviewerId the ID of the new reviewer
   */
  reassignReviewer(
    applicantRecordId: string,
    oldReviewerId: string,
    newReviewerId: string,
  ): Promise<ReviewedApplicantRecordDTO>;
}

export default IReviewApplicantRecordService;
