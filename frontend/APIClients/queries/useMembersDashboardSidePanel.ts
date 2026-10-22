import type { MemberSidePanelDetails } from "@/types/membersDashboard";
import { MOCK_MEMBERS, refetchMockMembers } from "./mocks/membersDashboard";

// Temporary fixture, keyed by member ID like the future member details query.
const MOCK_PAST_TEAMS: MemberSidePanelDetails["pastTeams"] = [
  { team: "Internal Tools", role: "Product Designer", term: "S25" },
  { team: "Design Team", role: "VP of Design", term: "W25" },
  { team: "LLSC", role: "Product Designer", term: "F24" },
];

/** Replace with useQuery once the member details operation is available. */
export default function useMembersDashboardSidePanel(memberId?: string) {
  const member = MOCK_MEMBERS.find(({ id }) => id === memberId);
  return {
    data: member ? { ...member, pastTeams: MOCK_PAST_TEAMS } : undefined,
    loading: false,
    error: memberId && !member ? new Error("Member not found") : undefined,
    refetch: refetchMockMembers,
  };
}
