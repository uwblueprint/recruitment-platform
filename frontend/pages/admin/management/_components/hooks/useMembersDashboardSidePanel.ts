import useMembersDashboardSidePanelData from "@/APIClients/queries/useMembersDashboardSidePanel";

export default function useMembersDashboardSidePanel(memberId?: string) {
  const { data, loading, error, refetch } =
    useMembersDashboardSidePanelData(memberId);
  return { details: data, isLoading: loading, error: !!error, refetch };
}
