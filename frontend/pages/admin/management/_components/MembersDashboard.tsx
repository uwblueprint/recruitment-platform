import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { DashboardTable } from "@/components/dashboard/table/DashboardTable";

export type Member = {
  id: string;
  name: string;
  role: string;
  team: string;
  joined: string;
  status: string;
};

const MEMBER_COLUMNS: ColumnDef<Member, unknown>[] = [
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
];

type MembersTableProps = {
  members: Member[];
};

export const MembersTable = ({ members }: MembersTableProps) => {
  const [pageNumber, setPageNumber] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const currentPage = Math.min(
    pageNumber,
    Math.max(1, Math.ceil(members.length / resultsPerPage))
  );
  const startIndex = (currentPage - 1) * resultsPerPage;

  return (
    <DashboardTable
      data={members.slice(startIndex, startIndex + resultsPerPage)}
      columns={MEMBER_COLUMNS}
      getRowId={(member) => member.id}
      rowSelection={{}}
      onRowSelectionChange={() => {}}
      emptyMessage="No members found."
      pagination={{
        pageNumber: currentPage,
        resultsPerPage,
        canGoNext: startIndex + resultsPerPage < members.length,
        onPageChange: setPageNumber,
        onResultsPerPageChange: (value) => {
          setResultsPerPage(value);
          setPageNumber(1);
        },
      }}
    />
  );
};
