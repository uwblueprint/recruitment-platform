import { useQuery } from "@apollo/client/react";
import {
  PositionsDocument,
  type PositionsQuery,
  type PositionsQueryVariables,
} from "@/graphql/typeUtils";

export default function usePositions(
  { isArchived }: PositionsQueryVariables = {},
) {
  const { data, loading, error, refetch } = useQuery<
    PositionsQuery,
    PositionsQueryVariables
  >(PositionsDocument, {
    variables: { isArchived },
    fetchPolicy: "cache-first",
    context: { refreshAuth: true },
  });

  const positions = data?.positions;
  const queryError =
    error ??
    (!loading && !positions ? new Error("No positions returned") : undefined);

  return {
    data: !loading && !queryError ? positions : undefined,
    loading,
    error: queryError,
    refetch,
  };
}
