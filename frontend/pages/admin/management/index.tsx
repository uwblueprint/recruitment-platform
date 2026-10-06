import { useState } from "react";
import { getAdminLayout } from "@/components/layouts/AdminLayout";
import { NextPageWithLayout } from "../../_app";
import { Tab, Tabs } from "@/components/dashboard/common/Tabs";
import { MembersTable, type Member } from "@/pages/admin/management/_components/MembersDashboard";

// Replace with management member data when the data source is connected.
const members: Member[] = [];

enum ManagementView {
  MEMBERS = "Members",
  ACTIVE_TEAMS = "Active Teams",
  ARCHIVED_PROJECTS = "Archived Projects",
}

const ManagementPage: NextPageWithLayout = () => {
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
      count: members.length,
      unit: { singular: "Member", plural: "Members" },
    },
    {
      view: ManagementView.ACTIVE_TEAMS,
      label: "Active Teams",
      count: 0,
      unit: { singular: "Team", plural: "Teams" },
    },
    {
      view: ManagementView.ARCHIVED_PROJECTS,
      label: "Archived Projects",
      count: 0,
      unit: { singular: "Project", plural: "Projects" },
    },
  ];
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-white">
      <main className="flex min-h-0 flex-1 flex-col gap-5 overflow-hidden px-6 py-5">
        <h1 className="font-poppins text-[28px] font-semibold leading-[140%] text-blue">
          Management
        </h1>
        <Tabs
          activeView={activeView}
          onViewChange={handleViewChange}
          tabs={tabs}
        />
        {activeView === ManagementView.MEMBERS && (
          <div className="min-h-0 flex-1">
            <MembersTable members={members} />
          </div>
        )}
      </main>
    </div>
  );
};

ManagementPage.getLayout = getAdminLayout;

export default ManagementPage;
