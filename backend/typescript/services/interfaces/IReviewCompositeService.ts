import {
  ApplicantRecordWithReviewersDTO,
  DashboardView,
  ReviewDashboardRowDTO,
  ReviewDashboardSidePanelDTO,
  ReviewDashboardSortBy,
  ReviewedApplicantRecordDTO,
  ReviewedApplicantsDTO,
} from "../../types";

interface IReviewCompositeService {
  /**
   * Fetches the applicant record along with all of its reviewers (with the
   * reviewer's user info attached to each reviewed applicant record).
   * @param applicantRecordId the ID of the applicant record
   */
  getReviewedApplicantRecordsByApplicantRecordId(
    applicantRecordId: string,
  ): Promise<ApplicantRecordWithReviewersDTO>;

  /**
   * Fetches information about all the applicants assigned to a user to review
   * @param userId the id of the user that the viewer is interested in
   * @returns an array of ReviewedApplicantsDTO objects
   */
  getReviewedApplicantsByUserId(
    userId: string,
  ): Promise<ReviewedApplicantsDTO[]>;
  /**
   * Pagination-supporting viewing of the virtual review dashboard
   * @Param page the page the viewer is on
   * @Param resultsPerPage the number of results per page
   * @Param sortBy the field to sort results by
   * @Param sortAscending whether to sort ascending; defaults to true
   */
  getReviewDashboard(
    page: number,
    resultsPerPage: number,
    sortBy?: ReviewDashboardSortBy,
    sortAscending?: boolean,
    view?: DashboardView,
  ): Promise<ReviewDashboardRowDTO[]>;

  /**
   * Assigns each user to an applicant record to review, and
   * returns the newly created ReviewedApplicantRecords
   * @Param positions the list of positions the algorithm should run on
   */
  delegateReviewers(positions: string[]): Promise<ReviewedApplicantRecordDTO[]>;

  /**
   * Fetch data that can fill out the review dashboard side panel for an applicant
   * @Param applicantId the ID of the applicant
   */
  getReviewDashboardSidePanel(
    applicantId: string,
  ): Promise<ReviewDashboardSidePanelDTO>;
}

export default IReviewCompositeService;
