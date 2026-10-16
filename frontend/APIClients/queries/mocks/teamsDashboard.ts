import type {
  ManagementTeam,
  TeamsDashboardFilters,
  TeamStatus,
} from "@/types/teamsDashboard";
import { MOCK_MEMBERS } from "./membersDashboard";

const activeNames = [
  "Extend-A-Family",
  "Better Angels",
  "Humane Society",
  "Leukemia & Lymphoma Society",
  "Marillac Place",
  "Internal Tools",
];
const archivedNames = [
  "Community Connect",
  "Food Access",
  "Volunteer Hub",
  "Youth Outreach",
  "Neighbourhood Network",
  "Learning Together",
  "Community Care",
];

// Fictional rosters, kept separate from the UI like the members dashboard mocks.
export const MOCK_TEAMS: ManagementTeam[] = [
  ...activeNames.map((name) => ({ name, status: "Active" as const })),
  ...archivedNames.map((name) => ({ name, status: "Archived" as const })),
].map(({ name, status }, index) => ({
  id: `mock-team-${index + 1}`,
  name,
  status,
  members: MOCK_MEMBERS.map((member, memberIndex) => ({
    ...member,
    id: `mock-team-${index + 1}-${member.id}`,
    team: name,
    termsOnProject: ["3+", "2", "1"][memberIndex % 3],
    status: status === "Active" ? "Active" : "Not Active",
  })),
}));

export const filterMockTeams = (
  status: TeamStatus,
  filters?: TeamsDashboardFilters
) => {
  const search = filters?.search?.trim().toLowerCase() ?? "";
  return MOCK_TEAMS.filter(
    (team) =>
      team.status === status &&
      (!filters?.teams?.length || filters.teams.includes(team.id)) &&
      (team.name.toLowerCase().includes(search) ||
        team.members.some((member) =>
          member.name.toLowerCase().includes(search)
        ))
  );
};

export const refetchMockTeams = async () => undefined;
