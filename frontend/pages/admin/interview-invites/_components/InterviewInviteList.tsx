import { Tabs } from "@/components/dashboard/common/Tabs";
import type { InterviewInviteResult } from "@/graphql/typeUtils";
import { InterviewInviteRow } from "./InterviewInviteRow";
import { InterviewInviteToolbar } from "./InterviewInviteToolbar";

import useInterviewInviteList from "./hooks/useInterviewInviteList";

type InterviewInviteListProps = {
  invites: InterviewInviteResult[];
  onSendInterviewEmails?: (selectedIds: string[]) => void;
  bulkActionsDisabled?: boolean;
};

export const InterviewInviteList = ({
  invites,
  onSendInterviewEmails,
  bulkActionsDisabled,
}: InterviewInviteListProps) => {
  const {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    selectedIds,
    readyInvites,
    sentInvites,
    filteredInvites,
    allSelected,
    handleSelectAll,
    toggleSelect,
    filterCategories,
    selectedFilters,
    handleFilterChange,
    handleFilterRemove,
  } = useInterviewInviteList(invites);

  return (
    <div className="w-full flex flex-col gap-4">
      <Tabs
        activeView={activeTab}
        onViewChange={setActiveTab}
        tabs={[
          {
            view: "ready",
            label: "Ready for Invite",
            count: readyInvites.length,
            unit: { singular: "Entry", plural: "Entries" },
          },
          {
            view: "sent",
            label: "Invites Sent",
            count: sentInvites.length,
            unit: { singular: "Entry", plural: "Entries" },
          },
        ]}
        selectedCount={selectedIds.size}
      />

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
          selectAllDisabled: filteredInvites.length === 0,
          disabled: bulkActionsDisabled,
          onSelectAll: handleSelectAll,
          onSendInterviewEmails: onSendInterviewEmails
            ? () => onSendInterviewEmails(Array.from(selectedIds))
            : undefined,
        }}
      />

      {/* List */}
      <div className="flex flex-col gap-3">
        {filteredInvites.map((invite) => (
          <InterviewInviteRow
            key={invite.id}
            invite={invite}
            isSelected={selectedIds.has(invite.id)}
            onSelect={(checked) => toggleSelect(invite.id, checked)}
          />
        ))}
        {filteredInvites.length === 0 && (
          <p className="font-source text-sm text-neutral-500 py-4">
            No interview groups found.
          </p>
        )}
      </div>
    </div>
  );
};
