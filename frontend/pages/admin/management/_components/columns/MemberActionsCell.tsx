import DeleteOutline from "@mui/icons-material/DeleteOutline";
import type { Member } from "@/types/membersDashboard";

export type MemberActionCallbacks = {
  onDelete?: (member: Member) => void;
};

type MemberActionsCellProps = MemberActionCallbacks & {
  member: Member;
};

export const MemberActionsCell = ({
  member,
  onDelete,
}: MemberActionsCellProps) => (
  <div className="pointer-events-none flex items-center justify-end gap-2 opacity-0 transition-opacity group-hover:pointer-events-auto group-hover:opacity-100 [&:has(:focus-visible)]:pointer-events-auto [&:has(:focus-visible)]:opacity-100">
    <button
      type="button"
      aria-label={`Delete ${member.name}`}
      title="Delete member"
      onClick={(event) => {
        event.stopPropagation();
        onDelete?.(member);
      }}
      className="flex h-8 w-8 items-center justify-center rounded text-blue hover:bg-blue-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue"
    >
      <DeleteOutline sx={{ fontSize: 22 }} />
    </button>
  </div>
);
