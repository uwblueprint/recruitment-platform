import { useCallback } from "react";
import type { ApolloCache } from "@apollo/client";
import { useApolloClient, useMutation } from "@apollo/client/react";
import {
  ArchiveProjectDocument,
  TeamsDashboardDocument,
  type ArchiveProjectMutation,
  type ArchiveProjectMutationVariables,
  type TeamsDashboardQuery,
} from "@/graphql/typeUtils";

const activeTeamsVariables = { isArchived: false };
const archivedTeamsVariables = { isArchived: true };

const byProjectName = (
  left: { projectName: string },
  right: { projectName: string },
) => left.projectName.localeCompare(right.projectName);

const moveTeamToArchivedCache = (
  cache: ApolloCache,
  projectId: string,
): boolean => {
  const active = cache.readQuery<TeamsDashboardQuery>({
    query: TeamsDashboardDocument,
    variables: activeTeamsVariables,
  });
  const archived = cache.readQuery<TeamsDashboardQuery>({
    query: TeamsDashboardDocument,
    variables: archivedTeamsVariables,
  });

  if (!active || !archived) {
    return false;
  }

  const team = active.teamsDashboard.find((item) => item.id === projectId);
  if (!team) {
    return archived.teamsDashboard.some((item) => item.id === projectId);
  }

  cache.writeQuery({
    query: TeamsDashboardDocument,
    variables: activeTeamsVariables,
    data: {
      teamsDashboard: active.teamsDashboard.filter(
        (item) => item.id !== projectId,
      ),
    },
  });
  cache.writeQuery({
    query: TeamsDashboardDocument,
    variables: archivedTeamsVariables,
    data: {
      teamsDashboard: [
        ...archived.teamsDashboard.filter((item) => item.id !== projectId),
        { ...team, isArchived: true },
      ].sort(byProjectName),
    },
  });
  return true;
};

export default function useArchiveProject() {
  const client = useApolloClient();
  const [mutate, { loading, error }] = useMutation<
    ArchiveProjectMutation,
    ArchiveProjectMutationVariables
  >(ArchiveProjectDocument, {
    context: { refreshAuth: true },
    onError: () => {},
  });

  const archiveProject = useCallback(
    async (id: string) => {
      let moved = false;
      try {
        const result = await mutate({
          variables: { id },
          update(cache, { data }) {
            const projectId = data?.archiveProject.id ?? id;
            moved = moveTeamToArchivedCache(cache, projectId);
          },
        });
        if (result.data?.archiveProject && !moved) {
          await client.refetchQueries({ include: [TeamsDashboardDocument] });
        }
      } catch {
        // The mutation error is exposed through the hook's error state.
      }
    },
    [client, mutate],
  );

  return { archiveProject, loading, error };
}
