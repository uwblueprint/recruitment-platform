import { ReactElement } from "react";

import { ChevronIcon } from "@/components/icons/chevron.icon";

type DashboardSortIndicatorProps = {
  /** Matches TanStack's `column.getIsSorted()`: false when unsorted. */
  sorted: false | "asc" | "desc";
  onSortAscending: () => void;
  onSortDescending: () => void;
};

/**
 * Sort control in the dashboard table header (Figma node 6292:47116): a 20px
 * circle holding stacked chevrons in Near Black. Both chevrons show while the
 * column is unsorted; picking a direction fades the inactive one.
 *
 * Each chevron is its own button filling half the circle, so the whole top half
 * sorts ascending and the whole bottom half descending — the glyphs alone are
 * only ~5px tall, far too small to hit. The paddings keep the chevrons at the
 * designed 4.227px inset and 2.09px apart despite the split hit areas.
 */
export const DashboardSortIndicator = ({
  sorted,
  onSortAscending,
  onSortDescending,
}: DashboardSortIndicatorProps): ReactElement => (
  <span className="flex h-5 w-5 shrink-0 flex-col rounded-full bg-neutral-100 text-neutral-800">
    <button
      type="button"
      aria-label="Sort ascending"
      onClick={onSortAscending}
      className="flex flex-1 items-end justify-center pb-[1.045px] hover:text-blue"
    >
      <ChevronIcon
        direction="up"
        className={sorted === "desc" ? "opacity-30" : undefined}
      />
    </button>
    <button
      type="button"
      aria-label="Sort descending"
      onClick={onSortDescending}
      className="flex flex-1 items-start justify-center pt-[1.045px] hover:text-blue"
    >
      <ChevronIcon
        direction="down"
        className={sorted === "asc" ? "opacity-30" : undefined}
      />
    </button>
  </span>
);
