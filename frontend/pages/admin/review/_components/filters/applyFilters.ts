import type { ReviewDashboardResult } from "@/graphql/typeUtils";
import type { SelectedFilters } from "@/components/dashboard/filters";

import { REVIEW_FILTER_CATEGORY_KEYS } from "./constants";

const SCORE_RANGE_PREDICATES: Record<string, (score: number | null) => boolean> = {
  gte_25: (score) => score !== null && score > 25,
  "20_25": (score) => score !== null && score >= 20 && score <= 25,
  "15_20": (score) => score !== null && score >= 15 && score < 20,
  lt_15: (score) => score !== null && score < 15,
};

// Skill Category / Year / Bookmarked are intentionally not filtered here: the
// current reviewDashboard query doesn't return skillCategory, academicYear, or
// isApplicantFlagged, so there's no data on the row to filter against yet.
// Their menu/chip UI is wired up so it's ready once the backend adds those fields.
export const filterReviewDashboardRows = (
  rows: ReviewDashboardResult[],
  selected: SelectedFilters,
): ReviewDashboardResult[] => {
  const positions = selected[REVIEW_FILTER_CATEGORY_KEYS.POSITION] ?? [];
  const applicationStatuses = selected[REVIEW_FILTER_CATEGORY_KEYS.APPLICATION_STATUS] ?? [];
  const scoreRanges = selected[REVIEW_FILTER_CATEGORY_KEYS.SCORE_RANGE] ?? [];

  return rows.filter((row) => {
    if (positions.length > 0 && !positions.includes(row.position)) {
      return false;
    }
    if (
      applicationStatuses.length > 0 &&
      !applicationStatuses.includes(row.applicationStatus)
    ) {
      return false;
    }
    if (scoreRanges.length > 0) {
      const matchesRange = scoreRanges.some((rangeKey) =>
        SCORE_RANGE_PREDICATES[rangeKey]?.(row.totalScore),
      );
      if (!matchesRange) {
        return false;
      }
    }
    return true;
  });
};
