import type { TeamStatus, TeamsDashboardFilters } from "@/types/teamsDashboard";
import { filterMockTeams, refetchMockTeams } from "./mocks/teamsDashboard";

/** Replace the mock body with the teams query when its operation is available. */
export default function useTeamsDashboard(
  status: TeamStatus,
  filters?: TeamsDashboardFilters
) {
  const teams = filterMockTeams(status);
  return {
    data: filterMockTeams(status, filters),
    count: teams.length,
    filterOptions: teams.map((team) => ({ label: team.name, value: team.id })),
    loading: false,
    error: undefined as Error | undefined,
    refetch: refetchMockTeams,
  };
}
