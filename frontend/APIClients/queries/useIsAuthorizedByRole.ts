import { skipToken, useQuery } from "@apollo/client/react";
import {
  IsAuthorizedByRoleDocument,
  type IsAuthorizedByRoleQuery,
  type IsAuthorizedByRoleQueryVariables,
} from "@/graphql/typeUtils";

export default function useIsAuthorizedByRole(
  accessToken: string | null | undefined,
  roles: IsAuthorizedByRoleQueryVariables["roles"]
) {
  const { data, loading, error, refetch } = useQuery<
    IsAuthorizedByRoleQuery,
    IsAuthorizedByRoleQueryVariables
  >(
    IsAuthorizedByRoleDocument,
    accessToken
      ? {
          variables: { accessToken, roles },
          fetchPolicy: "no-cache",
          context: { refreshAuth: true, useAccessTokenVariable: true },
        }
      : skipToken
  );

  if (!accessToken) {
    return { data: undefined, loading: false, error: undefined, refetch };
  }
  const authorized = data?.isAuthorizedByRole;
  const queryError =
    error ??
    (!loading && authorized == null
      ? new Error("No authorization result returned")
      : undefined);
  return {
    data: !loading && !queryError ? authorized : undefined,
    loading,
    error: queryError,
    refetch,
  };
}
