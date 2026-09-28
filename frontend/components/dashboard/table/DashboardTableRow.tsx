import { Row, flexRender } from "@tanstack/react-table";

type DashboardTableRowProps<TData> = {
  row: Row<TData>;
  onRowClick?: (row: TData) => void;
};

export const DashboardTableRow = <TData,>({
  row,
  onRowClick,
}: DashboardTableRowProps<TData>) => (
  <tr
    className="h-11 cursor-pointer border-b border-neutral-100 bg-white even:bg-neutral-50 last:border-b-0 hover:bg-blue-50"
    onClick={() => onRowClick?.(row.original)}
  >
    {row.getVisibleCells().map((cell) => (
      <td key={cell.id} className="whitespace-nowrap px-4 align-middle">
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </td>
    ))}
  </tr>
);
