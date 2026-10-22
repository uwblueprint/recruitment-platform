import { DashboardTablePagination } from "@/components/dashboard/table/DashboardTablePagination";
import { Tabs } from "@/components/dashboard/common/Tabs";
import { InterviewInviteRow } from "./InterviewInviteRow";
import { InterviewInviteToolbar } from "./InterviewInviteToolbar";

import useInterviewInviteList from "./hooks/useInterviewInviteList";

type InterviewInviteListProps = {
  onSendInterviewEmails?: (selectedIds: string[]) => void;
  bulkActionsDisabled?: boolean;
};

export const InterviewInviteList = ({
  onSendInterviewEmails,
  bulkActionsDisabled,
}: InterviewInviteListProps) => {
  const {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    selectedIds,
    readyCount,
    sentCount,
    loading,
    error,
    visibleInvites,
    pagination,
    allSelected,
    handleSelectAll,
    toggleSelect,
    filterCategories,
    selectedFilters,
    handleFilterChange,
    handleFilterRemove,
  } = useInterviewInviteList();

  return (
    <div className="w-full flex flex-col gap-4">
      <Tabs
        activeView={activeTab}
        onViewChange={setActiveTab}
        tabs={[
          {
            view: "unmatched",
            label: "Unmatched Applicants",
            count: undefined,
            unit: { singular: "Applicant", plural: "Applicants" },
          },
          {
            view: "ready",
            label: "Ready for Invite",
            count: readyCount,
            unit: { singular: "Entry", plural: "Entries" },
          },
          {
            view: "sent",
            label: "Invites Sent",
            count: sentCount,
            unit: { singular: "Entry", plural: "Entries" },
          },
        ]}
        selectedCount={activeTab === "unmatched" ? undefined : selectedIds.size}
      />

      {activeTab !== "unmatched" && (
        <>
          <InterviewInviteToolbar
            search={{ value: searchQuery, onChange: setSearchQuery }}
            filters={{
              categories: filterCategories,
              selected: selectedFilters,
              onChange: handleFilterChange,
              onRemove: handleFilterRemove,
            }}
            bulkActions={{
              selectedCount: selectedIds.size,
              allSelected,
              selectAllDisabled: visibleInvites.length === 0,
              disabled: bulkActionsDisabled || loading || !!error,
              onSelectAll: handleSelectAll,
              onSendInterviewEmails: onSendInterviewEmails
                ? () => onSendInterviewEmails(Array.from(selectedIds))
                : undefined,
            }}
          />

          {/* List */}
          <div className="flex flex-col gap-3">
            {error ? (
              <p role="alert" className="text-sm text-alert-errorText py-4">
                Failed to load interview invites. Please try again.
              </p>
            ) : loading ? (
              <p
                role="status"
                className="font-source text-sm text-neutral-500 py-4"
              >
                Loading...
              </p>
            ) : (
              visibleInvites.map((invite) => (
                <InterviewInviteRow
                  key={invite.id}
                  invite={invite}
                  isSelected={selectedIds.has(invite.id)}
                  onSelect={(checked) => toggleSelect(invite.id, checked)}
                />
              ))
            )}
            {!loading && !error && visibleInvites.length === 0 && (
              <p className="font-source text-sm text-neutral-500 py-4">
                No interview groups found.
              </p>
            )}
          </div>

          <DashboardTablePagination pagination={pagination} />
        </>
      )}
    </div>
  );
};
