import { useCallback } from "react";
import { useLazyQuery } from "@apollo/client/react";
import {
  ReviewDashboardCsvDocument,
  type ReviewDashboardCsvQuery,
  type ReviewDashboardCsvQueryVariables,
} from "@/graphql/typeUtils";

export default function useReviewDashboardCSV() {
  // no-cache: the CSV is a one-off download, so there's no reason to keep the
  // whole file in Apollo's cache.
  const [execute, { loading }] = useLazyQuery<
    ReviewDashboardCsvQuery,
    ReviewDashboardCsvQueryVariables
  >(ReviewDashboardCsvDocument, { fetchPolicy: "no-cache" });

  const fetchReviewDashboardCSV = useCallback(async () => {
    const { data } = await execute({ context: { refreshAuth: true } });
    if (!data?.reviewDashboardCSV) {
      throw new Error("No reviewDashboardCSV data returned");
    }
    return data.reviewDashboardCSV;
  }, [execute]);

  return { fetchReviewDashboardCSV, loading };
}
