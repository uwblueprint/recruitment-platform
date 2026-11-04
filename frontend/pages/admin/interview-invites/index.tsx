import { useState } from "react";
import { NextPageWithLayout } from "../../_app";
import { getAdminLayout } from "@/components/layouts/AdminLayout";
import { InterviewInviteList } from "./_components/InterviewInviteList";

import { Tabs } from "@/components/dashboard/common/Tabs";
import { DashboardTablePagination } from "@/components/dashboard/table/DashboardTablePagination";
import { InterviewGroupStatus } from "@/graphql/typeUtils";
import useInterviewUnmatchedApplicants from "@/APIClients/queries/useInterviewUnmatchedApplicants";
import useInterviewInvitesCounts from "@/APIClients/queries/useInterviewInvitesCounts";
import { UnmatchedApplicantsList } from "./_components/UnmatchedApplicantsList";
import { InterviewInviteToolbar } from "./_components/InterviewInviteToolbar";
import useInterviewInviteList from "./_components/hooks/useInterviewInviteList";

const InterviewInvites: NextPageWithLayout = () => {
  const [activeTab, setActiveTab] = useState("ready");
  const list = useInterviewInviteList(
    activeTab === "ready"
      ? [InterviewGroupStatus.AvailabilityPending, InterviewGroupStatus.ReadyToInterview]
      : [InterviewGroupStatus.InvitesSent]
  );
  const unmatched = useInterviewUnmatchedApplicants();
  const unmatchedCount = unmatched.data?.reduce(
    (count, group) => count + group.applicants.length,
    0
  );
  const { counts, error: countsError } = useInterviewInvitesCounts({
    filters: list.filters,
  });
  const error = list.error ?? countsError;

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-white">
      <main className="flex flex-col items-start gap-5 flex-1 self-stretch px-6 py-3">
        <h1 className="font-poppins font-semibold text-[28px] text-blue leading-[1.4]">
          Interview invite Dashboard
        </h1>

        <div className="w-full flex flex-col gap-4">
          <Tabs
            activeView={activeTab}
            onViewChange={(tab) => {
              setActiveTab(tab);
              list.resetPagination();
            }}
            tabs={[
              {
                view: "unmatched",
                label: "Unmatched Applicants",
                count: unmatchedCount,
                unit: { singular: "Applicant", plural: "Applicants" },
              },
              {
                view: "ready",
                label: "Ready for Invite",
                count: counts?.ready,
                unit: { singular: "Entry", plural: "Entries" },
              },
              {
                view: "sent",
                label: "Invites Sent",
                count: counts?.sent,
                unit: { singular: "Entry", plural: "Entries" },
              },
            ]}
            selectedCount={activeTab === "unmatched" ? undefined : list.selectedIds.size}
          />
          {activeTab === "unmatched" ? (
            <UnmatchedApplicantsList
              groups={unmatched.data ?? []}
              loading={unmatched.loading}
              error={unmatched.error}
            />
          ) : (
            <>
              <InterviewInviteToolbar
                search={{ value: list.searchQuery, onChange: list.setSearchQuery }}
                filters={{
                  categories: list.filterCategories,
                  selected: list.selectedFilters,
                  onChange: list.handleFilterChange,
                  onRemove: list.handleFilterRemove,
                }}
                bulkActions={{
                  selectedCount: list.selectedIds.size,
                  allSelected: list.allSelected,
                  selectAllDisabled: list.visibleInvites.length === 0,
                  disabled: list.loading || !!error,
                  onSelectAll: list.handleSelectAll,
                }}
              />
              <InterviewInviteList
                invites={list.visibleInvites}
                loading={list.loading}
                error={error}
                selectedIds={list.selectedIds}
                onSelect={list.toggleSelect}
              />
              <DashboardTablePagination pagination={list.pagination} />
            </>
          )}
        </div>
      </main>
    </div>
  );
};

InterviewInvites.getLayout = getAdminLayout;

export default InterviewInvites;
