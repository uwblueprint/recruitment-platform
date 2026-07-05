import { useState } from "react";
import { Tab, Tabs } from "@mui/material";
import { InterviewInvite } from "./types";
import { InterviewInviteRow } from "./InterviewInviteRow";

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
      <div className="border-b-2 border-neutral-200">
        <Tabs
          value={activeTab}
          onChange={(_, v: TabValue) => setActiveTab(v)}
          TabIndicatorProps={{ style: { backgroundColor: "#0573E8" } }}
          sx={{ minHeight: "unset" }}
        >
          <Tab
            value="ready"
            disableRipple
            label={
              <div className="flex flex-col items-start text-left pb-2 gap-0">
                <span
                  className={`font-source font-medium text-base leading-6 ${activeTab === "ready" ? "text-neutral-800" : "text-neutral-500"}`}
                >
                  Ready for Invite
                </span>
                <span
                  className={`font-source font-semibold text-xs ${activeTab === "ready" ? "text-blue" : "text-neutral-500"}`}
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
                  className={`font-source font-medium text-base leading-6 ${activeTab === "sent" ? "text-neutral-800" : "text-neutral-500"}`}
                >
                  Invites Sent
                </span>
                <span
                  className={`font-source font-semibold text-xs ${activeTab === "sent" ? "text-blue" : "text-neutral-500"}`}
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
          <div className="relative flex items-center h-9 w-[251px] border border-neutral-200 rounded bg-white">
            <svg
              className="absolute left-2 text-neutral-500"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                stroke="#9f9f9f"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <input
              type="text"
              placeholder="Search interviewer"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-full pl-9 pr-2 font-source text-sm text-neutral-800 placeholder-neutral-500 bg-transparent outline-none"
            />
          </div>

          <button className="flex items-center gap-2 h-9 px-2 py-1 border border-neutral-200 rounded bg-white font-source text-base text-neutral-800">
            Filters
            <svg width="18" height="13" viewBox="0 0 18 13" fill="none">
              <line x1="0" y1="1" x2="18" y2="1" stroke="#252525" strokeWidth="1.5" />
              <line x1="3" y1="6.5" x2="15" y2="6.5" stroke="#252525" strokeWidth="1.5" />
              <line x1="6" y1="12" x2="12" y2="12" stroke="#252525" strokeWidth="1.5" />
            </svg>
          </button>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 items-center">
          <button
            onClick={handleSelectAll}
            className="h-[38px] px-4 py-2 rounded-[20px] border-2 border-blue font-source text-base text-blue bg-white hover:bg-blue-50 transition-colors"
          >
            {allSelected ? "Deselect All" : "Select All"}
          </button>
          <button className="flex items-center gap-2 h-[38px] px-4 py-2 rounded-[24px] bg-blue font-source text-base text-white hover:bg-blue-600 transition-colors">
            Send interview emails
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
              <path
                d="M20 4H4C2.9 4 2 4.9 2 6v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
                fill="white"
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
