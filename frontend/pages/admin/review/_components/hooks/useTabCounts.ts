import { useEffect, useState } from "react";
import { DashboardView } from "@/graphql/typeUtils";
import type { ReviewDashboardResult } from "@/graphql/typeUtils";

const useTabCounts = (
  rows: ReviewDashboardResult[],
  isLoading: boolean,
  activeView: DashboardView,
): Record<DashboardView, number> => {
  const [tabCounts, setTabCounts] = useState<Record<DashboardView, number>>({
    [DashboardView.All]: 0,
    [DashboardView.Shortlisted]: 0,
    [DashboardView.Conflicts]: 0,
  });

  useEffect(() => {
    if (!isLoading) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTabCounts((prev) => ({ ...prev, [activeView]: rows.length }));
    }
  }, [rows, isLoading, activeView]);

  return tabCounts;
};

export default useTabCounts;
