import { useState } from "react";
import { Tab, Tabs } from "@mui/material";
import { InterviewInvite } from "./types";
import { InterviewInviteRow } from "./InterviewInviteRow";
import { theme } from "@/styles/Theme";
import { SearchIcon } from "@/components/icons/search.icon";
import { FilterIcon } from "@/components/icons/filter.icon";

const READY_STATUSES = new Set(["AVAILABILITY_PENDING", "READY_TO_INTERVIEW"]);

type TabValue = "ready" | "sent";

type InterviewInviteListProps = {
  invites: InterviewInvite[];
};

export const InterviewInviteList = ({ invites }: InterviewInviteListProps) => {
  const [activeTab, setActiveTab] = useState<TabValue>("ready");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

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

  const toggleSelect = (id: number, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      checked ? next.add(id) : next.delete(id);
      return next;
    });
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Tabs */}
      <div className="relative">
        {/* grey baseline sits at the exact same edge as the MUI indicator */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-neutral-200 z-0" />

        <Tabs
          value={activeTab}
          onChange={(_, v: TabValue) => setActiveTab(v)}
          TabIndicatorProps={{
            style: {
              backgroundColor: theme.colors.B10,
              height: "2px",
              bottom: 0,
              zIndex: 2,
            },
          }}
          sx={{ minHeight: "unset", position: "relative" }}
        >
          <Tab
            value="ready"
            disableRipple
            label={
              <div className="flex flex-col items-start text-left pb-2 gap-0">
                <span
                  className={`font-source font-medium text-base leading-6 ${
                    activeTab === "ready"
                      ? "text-neutral-800"
                      : "text-neutral-500"
                  }`}
                >
                  Ready for Invite
                </span>
                <span
                  className={`font-source font-semibold text-xs ${
                    activeTab === "ready" ? "text-blue" : "text-neutral-500"
                  }`}
                >
                  {readyInvites.length} Entries
                </span>
              </div>
            }
            sx={{
              textTransform: "none",
              minWidth: "unset",
              p: 0,
              pr: 2.5,
              alignItems: "flex-start",
            }}
          />
          <Tab
            value="sent"
            disableRipple
            label={
              <div className="flex flex-col items-start text-left pb-2 gap-0">
                <span
                  className={`font-source font-medium text-base leading-6 ${
                    activeTab === "sent"
                      ? "text-neutral-800"
                      : "text-neutral-500"
                  }`}
                >
                  Invites Sent
                </span>
                <span
                  className={`font-source font-semibold text-xs ${
                    activeTab === "sent" ? "text-blue" : "text-neutral-500"
                  }`}
                >
                  {sentInvites.length} Entries
                </span>
              </div>
            }
            sx={{
              textTransform: "none",
              minWidth: "unset",
              p: 0,
              pr: 2.5,
              alignItems: "flex-start",
            }}
          />
        </Tabs>
      </div>

      {/* Toolbar */}
      <div className="flex justify-between items-center">
        {/* Search + Filters */}
        <div className="flex gap-2 items-center">
          <div className="relative flex items-center h-9 w-[251px] overflow-hidden focus-within:border-blue rounded-[4px] bg-white transition-colors">
            <SearchIcon
              className="absolute left-2"
              style={{ color: theme.colors.C40 }}
            />
            <input
              type="text"
              placeholder="Search interviewer"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-full pl-9 pr-2 font-source text-sm text-neutral-800 bg-transparent outline-none rounded-[4px] border-neutral-200"
            />
          </div>

          <button className="flex items-center gap-2 h-9 px-2 py-1 border border-neutral-200 rounded bg-white font-source text-base text-neutral-800">
            Filters
            <FilterIcon style={{ color: theme.colors.near_black }} />
          </button>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 items-center">
          <button
            onClick={handleSelectAll}
            className="inline-flex h-[38px] items-center justify-center px-4 py-2 rounded-[20px] border-2 border-blue font-source text-base leading-none text-blue bg-white hover:bg-blue-50 transition-colors whitespace-nowrap"
          >
            {allSelected ? "Deselect All" : "Select All"}
          </button>
          <button className="flex items-center gap-2 h-[38px] px-4 py-2 rounded-[24px] bg-blue font-source text-base text-white hover:bg-blue-600 transition-colors">
            Send interview emails
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M20 4H4C2.9 4 2 4.9 2 6v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
                fill={theme.colors.C00}
              />
            </svg>
          </button>
        </div>
      </div>

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
