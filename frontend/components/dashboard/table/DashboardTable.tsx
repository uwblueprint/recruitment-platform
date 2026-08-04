import {
  ColumnDef,
  OnChangeFn,
  RowData,
  RowSelectionState,
  SortingState,
  TableMeta,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import ArrowDownward from "@mui/icons-material/ArrowDownward";
import ArrowUpward from "@mui/icons-material/ArrowUpward";
import UnfoldMore from "@mui/icons-material/UnfoldMore";

import { DashboardTablePagination } from "./DashboardTablePagination";
import { DashboardTableRow } from "./DashboardTableRow";

export type DashboardPaginationState = {
  pageNumber: number;
  resultsPerPage: number;
  canGoNext: boolean;
  onPageChange: (pageNumber: number) => void;
  onResultsPerPageChange: (resultsPerPage: number) => void;
};

type DashboardTableProps<TData extends RowData> = {
  data: TData[];
  columns: ColumnDef<TData, unknown>[];
  getRowId: (row: TData) => string;
  rowSelection: RowSelectionState;
  onRowSelectionChange: OnChangeFn<RowSelectionState>;
  onRowClick?: (row: TData) => void;
  meta?: TableMeta<TData>;
  pagination: DashboardPaginationState;
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  emptyMessage?: string;
  isLoading?: boolean;
};

export const DashboardTable = <TData extends RowData>({
  data,
  columns,
  getRowId,
  rowSelection,
  onRowSelectionChange,
  onRowClick,
  meta,
  pagination,
  sorting,
  onSortingChange,
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
    manualSorting: true,
    meta,
    state: {
      rowSelection,
      ...(sorting && { sorting }),
    },
    onRowSelectionChange,
    ...(onSortingChange && { onSortingChange }),
  });

  const visibleRows = table.getRowModel().rows;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="min-h-0 flex-1 overflow-auto rounded border border-neutral-200 bg-white">
        <table className="w-full min-w-[920px] table-fixed border-collapse text-left font-source text-sm text-neutral-800">
          <thead className="sticky top-0 z-10 bg-sky-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="h-11 whitespace-nowrap px-4 text-xs font-normal text-neutral-800"
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder ? null : header.column.getCanSort() ? (
                      <button
                        className="flex w-full items-center justify-between gap-2 hover:text-blue"
                        onClick={header.column.getToggleSortingHandler()}
                        type="button"
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        <span className="text-neutral-400">
                          {header.column.getIsSorted() === "asc" ? (
                            <ArrowUpward sx={{ fontSize: 14 }} />
                          ) : header.column.getIsSorted() === "desc" ? (
                            <ArrowDownward sx={{ fontSize: 14 }} />
                          ) : (
                            <UnfoldMore sx={{ fontSize: 14 }} />
                          )}
                        </span>
                      </button>
                    ) : (
                      flexRender(header.column.columnDef.header, header.getContext())
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
