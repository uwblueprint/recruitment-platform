import { ReviewDashboardSortBy } from "@/graphql/typeUtils";

export const COLUMN_ID_TO_SORT_BY: Record<string, ReviewDashboardSortBy> = {
  application: ReviewDashboardSortBy.LastName,
  choice: ReviewDashboardSortBy.Choice,
  timesApplied: ReviewDashboardSortBy.TimesApplied,
  reviewer1: ReviewDashboardSortBy.Reviewer_1,
  reviewer2: ReviewDashboardSortBy.Reviewer_2,
  totalScore: ReviewDashboardSortBy.TotalScore,
  applicationStatus: ReviewDashboardSortBy.ApplicationStatus,
};
