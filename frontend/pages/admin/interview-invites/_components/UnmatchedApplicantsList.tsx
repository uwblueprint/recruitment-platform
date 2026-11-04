import { useState } from "react";
import { Button } from "@/components/common/Button";
import type { InterviewUnmatchedApplicantsResult } from "@/graphql/typeUtils";
import { UnmatchedApplicantsRow } from "./UnmatchedApplicantsRow";

type UnmatchedApplicantsListProps = {
  groups: InterviewUnmatchedApplicantsResult[];
  loading: boolean;
  error?: Error;
};

export const UnmatchedApplicantsList = ({
  groups,
  loading,
  error,
}: UnmatchedApplicantsListProps) => {
  const [selectedPositions, setSelectedPositions] = useState<Set<string>>(
    new Set()
  );
  const allSelected =
    groups.length > 0 &&
    groups.every(({ position }) => selectedPositions.has(position));
  const selectedCount = groups.reduce(
    (count, group) =>
      count +
      (selectedPositions.has(group.position) ? group.applicants.length : 0),
    0
  );

  if (error) {
    return (
      <p role="alert" className="font-source text-sm text-alert-errorText py-4">
        Failed to load unmatched applicants.
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

  if (groups.length === 0) {
    return (
      <p className="font-source text-sm text-neutral-500 py-4">
        No unmatched applicants found.
      </p>
    );
  }

  return (
    <>
      <div className="flex items-center justify-end gap-3">
        <span
          className="font-source text-sm text-neutral-500"
          aria-live="polite"
        >
          {selectedCount} selected
        </span>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() =>
            setSelectedPositions(
              allSelected
                ? new Set()
                : new Set(groups.map(({ position }) => position))
            )
          }
        >
          {allSelected ? "Deselect all" : "Select all"}
        </Button>
      </div>
      <div className="flex flex-col gap-3">
        {groups.map((group) => (
          <UnmatchedApplicantsRow
            key={group.position}
            group={group}
            isSelected={selectedPositions.has(group.position)}
            onSelect={(checked) =>
              setSelectedPositions((previous) => {
                const next = new Set(previous);
                if (checked) next.add(group.position);
                else next.delete(group.position);
                return next;
              })
            }
          />
        ))}
      </div>
    </>
  );
};
