import { useState } from "react";
import type {
  FilterCategory,
  SelectedFilters,
} from "@/components/dashboard/filters";
import type { InterviewInviteResult } from "@/graphql/typeUtils";

const READY_STATUSES = new Set(["AVAILABILITY_PENDING", "READY_TO_INTERVIEW"]);

export default function useInterviewInviteList(
  invites: InterviewInviteResult[]
) {
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
  const filterCategories: FilterCategory[] = [
    {
      key: "interviewType",
      label: "Interview Type",
      options: Array.from(new Set(invites.map((invite) => invite.position)))
        .sort()
        .map((value) => ({ value, label: value })),
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

  const readyInvites = invites.filter((i) => READY_STATUSES.has(i.status));
  const sentInvites = invites.filter((i) => !READY_STATUSES.has(i.status));

  const activeInvites = activeTab === "ready" ? readyInvites : sentInvites;
  const filteredInvites = activeInvites.filter((invite) => {
    const matchesSearch = invite.interviewers.some(({ firstName, lastName }) =>
      `${firstName} ${lastName}`
        .toLowerCase()
        .includes(searchQuery.trim().toLowerCase())
    );
    const types = selectedFilters.interviewType ?? [];
    return (
      (!searchQuery.trim() || matchesSearch) &&
      (types.length === 0 || types.includes(invite.position))
    );
  });

  // Keep pagination local until the API supports fetching individual pages.
  const pageCount = Math.max(1, Math.ceil(filteredInvites.length / resultsPerPage));
  const pageNumber = Math.min(requestedPage, pageCount);
  const visibleInvites = filteredInvites.slice(
    (pageNumber - 1) * resultsPerPage,
    pageNumber * resultsPerPage
  );
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
    readyInvites,
    sentInvites,
    visibleInvites,
    pagination: {
      pageNumber,
      resultsPerPage,
      canGoNext: pageNumber < pageCount,
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
