import { useMemo } from "react";
import { useQuery } from "@apollo/client/react";
import {
  MembersDashboardSidePanelDocument,
  type MembersDashboardSidePanelResult,
} from "@/graphql/typeUtils";
import type { MemberSidePanelDetails } from "@/types/membersDashboard";
import { toMember } from "./useMembersDashboard";

const toSidePanelDetails = (
  result: MembersDashboardSidePanelResult,
): MemberSidePanelDetails => ({
  ...toMember(result),
  pastTeams: result.pastTeams.map(({ team, role, term }) => ({
    team: team ?? "Unassigned",
    role,
    term,
  })),
});

export default function useMembersDashboardSidePanel(memberId?: string) {
  const { data, loading, error, refetch } = useQuery(
    MembersDashboardSidePanelDocument,
    {
      variables: { userId: memberId ?? "" },
      skip: !memberId, // panel closed → no request
      fetchPolicy: "network-only",
      context: { refreshAuth: true },
    },
  );
  const details = useMemo(
    () => data && toSidePanelDetails(data.membersDashboardSidePanel),
    [data],
  );
  return { data: details, loading, error, refetch };
}
