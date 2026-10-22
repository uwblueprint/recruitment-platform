import { useState } from "react";
import { getAdminLayout } from "@/components/layouts/AdminLayout";
import { NextPageWithLayout } from "../../_app";
import { Tab, Tabs } from "@/components/dashboard/common/Tabs";
import useMembersDashboardCount from "@/APIClients/queries/useMembersDashboardCount";
import useTeamsDashboard from "@/APIClients/queries/useTeamsDashboard";
import { TeamsDashboard } from "./_components/TeamsDashboard";
import { MembersDashboard } from "./_components/MembersDashboard";

enum ManagementView {
  MEMBERS = "Members",
  ACTIVE_TEAMS = "Active Teams",
  ARCHIVED_TEAMS = "Archived Teams",
}

const ManagementPage: NextPageWithLayout = () => {
  const { count: memberCount, error: countsError } = useMembersDashboardCount();
  const { count: activeTeamCount } = useTeamsDashboard("Active");
  const { count: archivedTeamCount } = useTeamsDashboard("Archived");
  const [activeView, setActiveView] = useState<ManagementView>(
    ManagementView.MEMBERS
  );

  const handleViewChange = (view: string) => {
    const managementView = Object.values(ManagementView).find(
      (value) => value === view
    );
    if (managementView) {
      setActiveView(managementView);
    }
  };

  const tabs: Tab[] = [
    {
      view: ManagementView.MEMBERS,
      label: "All Members",
      count: countsError ? undefined : memberCount,
      unit: { singular: "Member", plural: "Members" },
    },
    {
      view: ManagementView.ACTIVE_TEAMS,
      label: "Active Teams",
      count: activeTeamCount,
      unit: { singular: "Team", plural: "Teams" },
    },
    {
      view: ManagementView.ARCHIVED_TEAMS,
      label: "Archived Teams",
      count: archivedTeamCount,
      unit: { singular: "Team", plural: "Teams" },
    },
  ];
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-white">
      <main className="flex min-h-0 flex-1 flex-col gap-5 overflow-hidden px-6 py-5">
        <h1 className="font-poppins text-[28px] font-semibold leading-[140%] text-blue">
          User Management
        </h1>
        {countsError ? (
          <p role="alert" className="text-sm text-alert-errorText">
            Failed to load member count.
          </p>
        ) : null}
        <Tabs
          activeView={activeView}
          onViewChange={handleViewChange}
          tabs={tabs}
        />
        {activeView === ManagementView.MEMBERS && <MembersDashboard />}
        {activeView === ManagementView.ACTIVE_TEAMS && (
          <TeamsDashboard key="active" status="Active" />
        )}
        {activeView === ManagementView.ARCHIVED_TEAMS && (
          <TeamsDashboard key="archived" status="Archived" />
        )}
      </main>
    </div>
  );
};

ManagementPage.getLayout = getAdminLayout;

export default ManagementPage;
