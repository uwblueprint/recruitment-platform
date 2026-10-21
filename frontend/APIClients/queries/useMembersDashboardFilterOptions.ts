import type {
  MemberEditableField,
  MembersDashboardFilterOptions,
} from "@/types/membersDashboard";
import { MOCK_MEMBERS, refetchMockMembers } from "./mocks/membersDashboard";

const optionsFor = (key: MemberEditableField) =>
  [...new Set(MOCK_MEMBERS.map((member) => member[key]))]
    .sort()
    .map((value) => ({ value, label: value }));
const data: MembersDashboardFilterOptions = {
  roles: optionsFor("role"),
  teams: optionsFor("team"),
  statuses: optionsFor("status"),
};

// Replace with useQuery following useReviewDashboardFilterOptions once available.
export default function useMembersDashboardFilterOptions() {
  return {
    data,
    loading: false,
    error: undefined as Error | undefined,
    refetch: refetchMockMembers,
  };
}
