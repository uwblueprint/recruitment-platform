import { useState } from "react";
import { DashboardView } from "@/graphql/typeUtils";
import type { ReviewDashboardResult } from "@/graphql/typeUtils";

const useTabCounts = (
  rows: ReviewDashboardResult[],
  isLoading: boolean,
  activeView: DashboardView
): Record<DashboardView, number> => {
  const [tabCounts, setTabCounts] = useState<Record<DashboardView, number>>({
    [DashboardView.All]: 0,
    [DashboardView.Shortlisted]: 0,
    [DashboardView.Conflicts]: 0,
  });

  if (!isLoading && tabCounts[activeView] !== rows.length) {
    const nextCounts = { ...tabCounts, [activeView]: rows.length };
    setTabCounts(nextCounts);
    return nextCounts;
  }

  return tabCounts;
};

export default useTabCounts;
