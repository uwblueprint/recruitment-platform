import { useState } from "react";
import type { InterviewInvite } from "../types";

const READY_STATUSES = new Set(["AVAILABILITY_PENDING", "READY_TO_INTERVIEW"]);

export default function useInterviewInviteList(invites: InterviewInvite[]) {
  const [activeTab, setActiveTab] = useState<string>("ready");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const readyInvites = invites.filter((i) => READY_STATUSES.has(i.status));
  const sentInvites = invites.filter((i) => !READY_STATUSES.has(i.status));

  const activeInvites = activeTab === "ready" ? readyInvites : sentInvites;
  const filteredInvites = searchQuery.trim()
    ? activeInvites.filter((i) =>
        i.interviewers.some((name) =>
          name.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      )
    : activeInvites;

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
  };
}
