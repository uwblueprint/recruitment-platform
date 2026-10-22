import { useQuery } from "@apollo/client/react";
import {
  ProjectsDocument,
  type ProjectsQuery,
  type ProjectsQueryVariables,
} from "@/graphql/typeUtils";

export default function useProjects(
  { isArchived }: ProjectsQueryVariables = {},
) {
  const { data, loading, error, refetch } = useQuery<
    ProjectsQuery,
    ProjectsQueryVariables
  >(ProjectsDocument, {
    variables: { isArchived },
    fetchPolicy: "cache-first",
    context: { refreshAuth: true },
  });

  const projects = data?.projects;
  const queryError =
    error ??
    (!loading && !projects ? new Error("No projects returned") : undefined);

  return {
    data: !loading && !queryError ? projects : undefined,
    loading,
    error: queryError,
    refetch,
  };
}
