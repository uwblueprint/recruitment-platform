import { useQuery } from "@apollo/client/react";
import { MembersDashboardCountDocument } from "@/graphql/typeUtils";

export default function useMembersDashboardCount() {
  const { data, loading, error, refetch } = useQuery(
    MembersDashboardCountDocument,
    { fetchPolicy: "network-only", context: { refreshAuth: true } },
  );
  return { count: data?.membersDashboardCount, loading, error, refetch };
}
