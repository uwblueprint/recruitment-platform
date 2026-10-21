import { useState } from "react";
import type {
  FilterCategory,
  SelectedFilters,
} from "@/components/dashboard/filters";
import { InterviewGroupStatus } from "@/graphql/typeUtils";
import useInterviewInvites from "@/APIClients/queries/useInterviewInvites";
import useInterviewInvitesCounts from "@/APIClients/queries/useInterviewInvitesCounts";
import usePositions from "@/APIClients/queries/usePositions";

export default function useInterviewInviteList() {
  const [activeTab, updateActiveTab] = useState<string>("ready");
  const [searchQuery, updateSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [requestedPage, setRequestedPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(10);

  const resetPagination = () => {
    setRequestedPage(1);
    setSelectedIds(new Set());
  };

  const setActiveTab = (tab: string) => {
    updateActiveTab(tab);
    resetPagination();
  };

  const setSearchQuery = (query: string) => {
    updateSearchQuery(query);
    resetPagination();
  };

  const handlePageChange = (page: number) => {
    setRequestedPage(page);
    setSelectedIds(new Set());
  };

  const handleResultsPerPageChange = (size: number) => {
    setResultsPerPage(size);
    resetPagination();
  };

  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({});
  const { data, previousData, loading, error } = useInterviewInvites({
    pageNumber: requestedPage,
    resultsPerPage,
    status: activeTab === "ready"
      ? [InterviewGroupStatus.AvailabilityPending, InterviewGroupStatus.ReadyToInterview]
      : [InterviewGroupStatus.InvitesSent],
    filters: { search: searchQuery, positions: selectedFilters.interviewType ?? [] },
  });
  const { counts, error: countsError } = useInterviewInvitesCounts();
  const { data: positions, error: positionsError } = usePositions({ isArchived: false });
  const visibleInvites = error ? [] : data ?? (loading ? previousData : undefined) ?? [];
  const filterCategories: FilterCategory[] = [
    {
      key: "interviewType",
      label: "Interview Type",
      options: (positions ?? []).map(({ title }) => ({ value: title, label: title })),
    },
  ];

  const handleFilterChange = (categoryKey: string, values: string[]) => {
    resetPagination();
    setSelectedFilters((previous) => ({ ...previous, [categoryKey]: values }));
  };

  const handleFilterRemove = (categoryKey: string, value: string) => {
    resetPagination();
    setSelectedFilters((previous) => ({
      ...previous,
      [categoryKey]: (previous[categoryKey] ?? []).filter(
        (item) => item !== value
      ),
    }));
  };

  const visibleSelectedIds = new Set(
    visibleInvites.filter((invite) => selectedIds.has(invite.id)).map((invite) => invite.id)
  );
  const allSelected =
    visibleInvites.length > 0 &&
    visibleInvites.every((i) => visibleSelectedIds.has(i.id));

  const handleSelectAll = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        visibleInvites.forEach((i) => next.delete(i.id));
      } else {
        visibleInvites.forEach((i) => next.add(i.id));
      }
      return next;
    });
  };

  const toggleSelect = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  };

  return {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    selectedIds: visibleSelectedIds,
    readyCount: counts?.ready,
    sentCount: counts?.sent,
    loading,
    error: error ?? countsError ?? positionsError,
    visibleInvites,
    pagination: {
      pageNumber: requestedPage,
      resultsPerPage,
      canGoNext: !loading && !error && visibleInvites.length === resultsPerPage,
      onPageChange: handlePageChange,
      onResultsPerPageChange: handleResultsPerPageChange,
    },
    allSelected,
    handleSelectAll,
    toggleSelect,
    filterCategories,
    selectedFilters,
    handleFilterChange,
    handleFilterRemove,
  };
}
