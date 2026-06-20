import { useState } from "react";
import { InterviewInvite } from "./types";
import { InterviewInviteRow } from "./InterviewInviteRow";

type InterviewInviteListProps = {
  invites: InterviewInvite[];
};

export const InterviewInviteList = ({ invites }: InterviewInviteListProps) => {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const toggleSelect = (id: number, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      checked ? next.add(id) : next.delete(id);
      return next;
    });
  };

  return (
    <div className="w-full flex flex-col gap-3">
      {invites.map((invite) => (
        <InterviewInviteRow
          key={invite.id}
          invite={invite}
          isSelected={selectedIds.has(invite.id)}
          onSelect={(checked) => toggleSelect(invite.id, checked)}
        />
      ))}
    </div>
  );
};
