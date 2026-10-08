import type { ColumnDef } from "@tanstack/react-table";
import type { Member } from "@/types/membersDashboard";
import {
  MemberActionsCell,
  type MemberActionCallbacks,
} from "./MemberActionsCell";
import { MemberStatusCell } from "./MemberStatusCell";

export const createMembersDashboardColumns = ({
  onEdit,
  onDelete,
}: MemberActionCallbacks = {}): ColumnDef<Member, unknown>[] => [
  {
    accessorKey: "name",
    header: "Name",
    enableSorting: false,
    cell: ({ row }) => (
      <span className="underline underline-offset-2">{row.original.name}</span>
    ),
  },
  { accessorKey: "role", header: "Role", enableSorting: false },
  { accessorKey: "team", header: "Team", enableSorting: false },
  { accessorKey: "joined", header: "Joined", enableSorting: false },
  {
    accessorKey: "status",
    header: "Status",
    enableSorting: false,
    cell: ({ row }) => <MemberStatusCell status={row.original.status} />,
  },
  {
    id: "actions",
    header: "",
    size: 112,
    enableSorting: false,
    cell: ({ row }) => (
      <MemberActionsCell
        member={row.original}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    ),
  },
];
