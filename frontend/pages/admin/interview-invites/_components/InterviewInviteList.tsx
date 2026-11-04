import type { InterviewInviteResult } from "@/graphql/typeUtils";
import { InterviewInviteRow } from "./InterviewInviteRow";

type InterviewInviteListProps = {
  invites: InterviewInviteResult[];
  loading: boolean;
  error?: Error;
  selectedIds: Set<string>;
  onSelect: (id: string, checked: boolean) => void;
};

export const InterviewInviteList = ({
  invites,
  loading,
  error,
  selectedIds,
  onSelect,
}: InterviewInviteListProps) => {
  if (error) {
    return (
      <p role="alert" className="font-source text-sm text-alert-errorText py-4">
        Failed to load interview invites. Please try again.
      </p>
    );
  }

  if (loading) {
    return (
      <p role="status" className="font-source text-sm text-neutral-500 py-4">
        Loading...
      </p>
    );
  }

  if (invites.length === 0) {
    return (
      <p className="font-source text-sm text-neutral-500 py-4">
        No interview groups found.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {invites.map((invite) => (
        <InterviewInviteRow
          key={invite.id}
          invite={invite}
          isSelected={selectedIds.has(invite.id)}
          onSelect={(checked) => onSelect(invite.id, checked)}
        />
      ))}
    </div>
  );
};
