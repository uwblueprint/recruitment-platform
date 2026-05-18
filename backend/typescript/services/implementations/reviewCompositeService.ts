import Applicant from "../../models/applicant.model";
import ApplicantRecord from "../../models/applicantRecord.model";
import ReviewedApplicantRecord from "../../models/reviewedApplicantRecord.model";
import { ReviewedApplicantsDTO } from "../../types";
import { getErrorMessage } from "../../utilities/errorUtils";
import logger from "../../utilities/logger";
import IReviewCompositeService from "../interfaces/IReviewCompositeService";

const Logger = logger(__filename);

function toDTO(
  reviewedApplicantRecord: ReviewedApplicantRecord,
): ReviewedApplicantsDTO {
  return {
    applicantRecordId: reviewedApplicantRecord.applicant_record_id,
    reviewStatus: reviewedApplicantRecord.status,
    applicantFirstName:
      reviewedApplicantRecord.applicant_record.applicant.first_name,
    applicantLastName:
      reviewedApplicantRecord.applicant_record.applicant.last_name,
  };
}

class ReviewCompositeService implements IReviewCompositeService {
  /* eslint-disable class-methods-use-this */

  async getReviewedApplicantsByUserId(
    userId: string,
  ): Promise<ReviewedApplicantsDTO[]> {
    try {
      const reviewedApplicants = await ReviewedApplicantRecord.findAll({
        where: { reviewer_id: Number(userId) },
        include: [
          {
            model: ApplicantRecord,
            include: [
              {
                model: Applicant,
                attributes: ["id", "first_name", "last_name"],
              },
            ],
          },
        ],
        attributes: ["applicant_record_id", "status"],
      });
      return reviewedApplicants.map(toDTO);
    } catch (error: unknown) {
      Logger.error(
        `Failed to get reviewed applicants by user id. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    }
  }
}

export default ReviewCompositeService;
