import { DashboardTableCheckbox } from "@/components/dashboard/table";
import type { ReviewDashboardResult } from "@/graphql/typeUtils";
import type { CellContext, HeaderContext } from "@tanstack/react-table";

export const SelectAllHeader = ({
  table,
}: HeaderContext<ReviewDashboardResult, unknown>) => (
  <DashboardTableCheckbox
    checked={table.getIsAllRowsSelected()}
    indeterminate={table.getIsSomeRowsSelected()}
    onChange={table.getToggleAllRowsSelectedHandler()}
    aria-label="Select all rows"
  />
);

export const SelectRowCell = ({
  row,
}: CellContext<ReviewDashboardResult, unknown>) => (
  <DashboardTableCheckbox
    checked={row.getIsSelected()}
    disabled={!row.getCanSelect()}
    onChange={row.getToggleSelectedHandler()}
    aria-label={`Select ${row.original.firstName} ${row.original.lastName}`}
  />
);
