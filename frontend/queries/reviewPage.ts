import { gql } from "@apollo/client";

export const REPORT_REVIEW_CONFLICT_MUTATION = gql`    mutation reportReviewConflict(
      $applicantRecordId: String!
      $reviewerId: Int!
    ) {
      reportReviewConflict(
        applicantRecordId: $applicantRecordId
        reviewerId: $reviewerId
      ) {
        applicantRecordId
        reviewerId
        status
        score
        reviewerHasConflict
      }
    }`