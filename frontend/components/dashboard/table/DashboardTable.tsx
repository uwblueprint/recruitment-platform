import {
  ColumnDef,
  OnChangeFn,
  Row,
  RowSelectionState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { DashboardTablePagination } from "./DashboardTablePagination";

export type DashboardPaginationState = {
  pageNumber: number;
  resultsPerPage: number;
  canGoNext: boolean;
  onPageChange: (pageNumber: number) => void;
  onResultsPerPageChange: (resultsPerPage: number) => void;
};

type DashboardTableProps<TData> = {
  data: TData[];
  columns: ColumnDef<TData, unknown>[];
  getRowId: (row: TData) => string;
  rowSelection: RowSelectionState;
  onRowSelectionChange: OnChangeFn<RowSelectionState>;
  onRowClick?: (row: TData) => void;
  pagination: DashboardPaginationState;
  emptyMessage?: string;
  isLoading?: boolean;
};

export const DashboardTable = <TData,>({
  data,
  columns,
  getRowId,
  rowSelection,
  onRowSelectionChange,
  onRowClick,
  pagination,
  emptyMessage = "No results found.",
  isLoading = false,
}: DashboardTableProps<TData>) => {
  // TanStack Table returns handler functions that React Compiler intentionally skips.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId,
    enableRowSelection: true,
    state: {
      rowSelection,
    },
    onRowSelectionChange,
  });

  const visibleRows = table.getRowModel().rows;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="min-h-0 flex-1 overflow-auto rounded border border-neutral-200 bg-white">
        <table className="w-full min-w-[920px] border-collapse text-left font-source text-sm text-neutral-800">
          <thead className="sticky top-0 z-10 bg-sky-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="h-11 whitespace-nowrap px-4 text-xs font-normal text-neutral-800"
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  className="h-32 px-4 text-center text-neutral-500"
                  colSpan={columns.length}
                >
                  Loading...
                </td>
              </tr>
            ) : visibleRows.length === 0 ? (
              <tr>
                <td
                  className="h-32 px-4 text-center text-neutral-500"
                  colSpan={columns.length}
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              visibleRows.map((row) => (
                <DashboardTableRow
                  key={row.id}
                  row={row}
                  onRowClick={onRowClick}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
      <DashboardTablePagination pagination={pagination} />
    </div>
  );
};

type DashboardTableRowProps<TData> = {
  row: Row<TData>;
  onRowClick?: (row: TData) => void;
};

const DashboardTableRow = <TData,>({
  row,
  onRowClick,
}: DashboardTableRowProps<TData>) => {
  return (
    <tr
      className="h-11 cursor-pointer border-b border-neutral-100 bg-white last:border-b-0 hover:bg-surface-muted"
      onClick={() => onRowClick?.(row.original)}
    >
      {row.getVisibleCells().map((cell) => (
        <td key={cell.id} className="whitespace-nowrap px-4 align-middle">
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </tr>
  );
};
