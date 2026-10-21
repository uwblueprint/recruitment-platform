import type {
  MemberEditableField,
  MembersDashboardFilterOptions,
} from "@/types/membersDashboard";
import { MOCK_MEMBERS } from "./mocks/membersDashboard";
import usePositions from "./usePositions";

const optionsFor = (key: MemberEditableField) =>
  [...new Set(MOCK_MEMBERS.map((member) => member[key]))]
    .sort()
    .map((value) => ({ value, label: value }));
const mockOptions = {
  teams: optionsFor("team"),
  statuses: optionsFor("status"),
};

export default function useMembersDashboardFilterOptions() {
  const { data: positions, loading, error, refetch } = usePositions();
  const data: MembersDashboardFilterOptions = {
    ...mockOptions,
    roles: (positions ?? []).map(({ title }) => ({
      value: title,
      label: title,
    })),
  };

  return {
    data,
    loading,
    error,
    refetch,
  };
}
