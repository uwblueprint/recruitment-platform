import { skipToken, useQuery } from "@apollo/client/react";
import {
  UsersByPositionDocument,
  type UsersByPositionQuery,
  type UsersByPositionQueryVariables,
} from "@/graphql/typeUtils";

export default function useUsersByPosition(position?: string) {
  const { data, loading, error, refetch } = useQuery<
    UsersByPositionQuery,
    UsersByPositionQueryVariables
  >(
    UsersByPositionDocument,
    position
      ? {
          variables: { position },
          fetchPolicy: "network-only",
          context: { refreshAuth: true },
        }
      : skipToken
  );
  if (!position)
    return { data: undefined, loading: false, error: undefined, refetch };
  const users = data?.usersByPosition;
  const queryError =
    error ?? (!loading && !users ? new Error("No users returned") : undefined);
  return {
    data: !loading && !queryError ? users : undefined,
    loading,
    error: queryError,
    refetch,
  };
}
