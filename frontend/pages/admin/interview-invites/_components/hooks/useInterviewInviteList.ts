import { useState } from "react";
import type {
  FilterCategory,
  SelectedFilters,
} from "@/components/dashboard/filters";
import type { InterviewGroupStatus } from "@/graphql/typeUtils";
import useInterviewInvites from "@/APIClients/queries/useInterviewInvites";
import usePositions from "@/APIClients/queries/usePositions";

export default function useInterviewInviteList(status: InterviewGroupStatus[]) {
  const [searchQuery, updateSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [requestedPage, setRequestedPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(10);

  const resetPagination = () => {
    setRequestedPage(1);
    setSelectedIds(new Set());
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
  const filters = { search: searchQuery, positions: selectedFilters.interviewType ?? [] };
  const { data, previousData, loading, error } = useInterviewInvites({
    pageNumber: requestedPage,
    resultsPerPage,
    status,
    filters,
  });
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

  // Fresh results reset selection, including after a background refetch.
  const [previousInvites, setPreviousInvites] = useState(data);
  if (data !== previousInvites) {
    setPreviousInvites(data);
    setSelectedIds(new Set());
  }

  const allSelected =
    visibleInvites.length > 0 &&
    visibleInvites.every((i) => selectedIds.has(i.id));

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
    resetPagination,
    filters,
    searchQuery,
    setSearchQuery,
    selectedIds,
    loading,
    error: error ?? positionsError,
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
