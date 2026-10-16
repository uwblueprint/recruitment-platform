import { useState } from "react";
import type {
  FilterCategory,
  SelectedFilters,
} from "@/components/dashboard/filters";
import type { InterviewInvite } from "../types";

const READY_STATUSES = new Set(["AVAILABILITY_PENDING", "READY_TO_INTERVIEW"]);

export default function useInterviewInviteList(invites: InterviewInvite[]) {
  const [activeTab, setActiveTab] = useState<string>("ready");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

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
    setSelectedFilters((previous) => ({ ...previous, [categoryKey]: values }));
  };

  const handleFilterRemove = (categoryKey: string, value: string) => {
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

  const allSelected =
    filteredInvites.length > 0 &&
    filteredInvites.every((i) => selectedIds.has(i.id));

  const handleSelectAll = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        filteredInvites.forEach((i) => next.delete(i.id));
      } else {
        filteredInvites.forEach((i) => next.add(i.id));
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
  };
}
