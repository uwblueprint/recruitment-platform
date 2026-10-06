import type { ColumnDef } from "@tanstack/react-table";
import type { Member } from "@/types/membersDashboard";
import Edit from "@mui/icons-material/Edit";
import DeleteOutline from "@mui/icons-material/DeleteOutline";

export const MEMBERS_DASHBOARD_COLUMNS: ColumnDef<Member, unknown>[] = [
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
    cell: ({ row }) => (
      <span className="inline-flex h-7 min-w-[112px] items-center justify-center rounded bg-neutral-100 px-4 text-xs text-neutral-800">
        {row.original.status}
      </span>
    ),
  },
  {
    id: "actions",
    header: "",
    size: 112,
    enableSorting: false,
    cell: ({ row }) => (
      <div className="pointer-events-none flex items-center justify-end gap-2 opacity-0 transition-opacity group-hover:pointer-events-auto group-hover:opacity-100 [&:has(:focus-visible)]:pointer-events-auto [&:has(:focus-visible)]:opacity-100">
        {/* Action behavior will be connected when editing/deletion is implemented. */}
        <button
          type="button"
          aria-label={`Edit ${row.original.name}`}
          title="Edit member"
          onClick={(event) => event.stopPropagation()}
          className="flex h-8 w-8 items-center justify-center rounded text-blue hover:bg-blue-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue"
        >
          <Edit sx={{ fontSize: 22 }} />
        </button>
        <button
          type="button"
          aria-label={`Delete ${row.original.name}`}
          title="Delete member"
          onClick={(event) => event.stopPropagation()}
          className="flex h-8 w-8 items-center justify-center rounded text-blue hover:bg-blue-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue"
        >
          <DeleteOutline sx={{ fontSize: 22 }} />
        </button>
      </div>
    ),
  },
];
