import { ReviewedApplicantsDTO } from "../../types";

interface IReviewCompositeService {
  /**
   * Fetches information about all the applicants assigned to a user to review
   * @param userId the id of the user that the viewer is interested in
   * @returns an array of ReviewedApplicantsDTO objects
   */
  getReviewedApplicantsByUserId(
    userId: string,
  ): Promise<ReviewedApplicantsDTO[]>;
}

export default IReviewCompositeService;
