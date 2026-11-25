import { useMemo } from "react";
import { useQuery } from "@apollo/client/react";
import {
  TeamsDashboardDocument,
  type TeamsDashboardQuery,
  type TeamsDashboardQueryVariables,
} from "@/graphql/typeUtils";
import type {
  ManagementTeam,
  TeamMember,
  TeamStatus,
  TeamsDashboardFilters,
} from "@/types/teamsDashboard";
import formatJoinedTerm from "@/utils/formatJoinedTerm";

type TeamsDashboardTeam = TeamsDashboardQuery["teamsDashboard"][number];
type TeamsDashboardMember = TeamsDashboardTeam["members"][number];

const toMember = (
  member: TeamsDashboardMember,
  teamName: string,
): TeamMember => ({
  id: member.id,
  name: `${member.firstName} ${member.lastName}`,
  firstName: member.firstName,
  lastName: member.lastName,
  role: member.role ?? "—",
  team: teamName,
  joined: member.joined ? formatJoinedTerm(member.joined) : "—",
  status: member.isArchived ? "Not Active" : "Active",
  termsOnProject: member.termsOnProject,
});

const toTeam = (team: TeamsDashboardTeam): ManagementTeam => ({
  id: team.id,
  name: team.projectName,
  status: team.isArchived ? "Archived" : "Active",
  members: team.members.map((member) => toMember(member, team.projectName)),
});

const filterTeams = (
  teams: ManagementTeam[],
  filters?: TeamsDashboardFilters,
) => {
  const search = filters?.search?.trim().toLowerCase() ?? "";
  return teams.filter(
    (team) =>
      (!filters?.teams?.length || filters.teams.includes(team.id)) &&
      (team.name.toLowerCase().includes(search) ||
        team.members.some((member) =>
          member.name.toLowerCase().includes(search),
        )),
  );
};

export default function useTeamsDashboard(
  status: TeamStatus,
  filters?: TeamsDashboardFilters,
) {
  const { data, loading, error, refetch } = useQuery<
    TeamsDashboardQuery,
    TeamsDashboardQueryVariables
  >(TeamsDashboardDocument, {
    variables: { isArchived: status === "Archived" },
    fetchPolicy: "network-only",
    context: { refreshAuth: true },
  });

  const teams = useMemo(
    () => data?.teamsDashboard.map(toTeam) ?? [],
    [data],
  );
  const filteredTeams = useMemo(
    () => filterTeams(teams, filters),
    [teams, filters],
  );
  return {
    data: error ? [] : filteredTeams,
    count: teams.length,
    filterOptions: teams.map((team) => ({ label: team.name, value: team.id })),
    loading,
    error,
    refetch,
  };
}
