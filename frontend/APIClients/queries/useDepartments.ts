import { useQuery } from "@apollo/client/react";
import {
  DepartmentsDocument,
  type DepartmentsQuery,
  type DepartmentsQueryVariables,
} from "@/graphql/typeUtils";

export default function useDepartments() {
  const { data, loading, error, refetch } = useQuery<
    DepartmentsQuery,
    DepartmentsQueryVariables
  >(DepartmentsDocument, {
    fetchPolicy: "cache-first",
    context: { refreshAuth: true },
  });

  const departments = data?.departments;
  const queryError =
    error ??
    (!loading && !departments
      ? new Error("No departments returned")
      : undefined);

  return {
    data: !loading && !queryError ? departments : undefined,
    loading,
    error: queryError,
    refetch,
  };
}
