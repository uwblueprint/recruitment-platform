import type { DashboardPaginationState } from "./DashboardTable";

type DashboardTablePaginationProps = {
  pagination: DashboardPaginationState;
};

const RESULTS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

export const DashboardTablePagination = ({
  pagination,
}: DashboardTablePaginationProps) => {
  const {
    pageNumber,
    resultsPerPage,
    canGoNext,
    onPageChange,
    onResultsPerPageChange,
  } = pagination;

  return (
    <div className="flex h-11 shrink-0 items-center justify-between bg-white text-sm text-neutral-800">
      <label className="flex items-center gap-2">
        <span>Show Results</span>
        <select
          className="h-8 rounded border-neutral-200 py-1 pl-2 pr-8 text-sm text-neutral-800 focus:border-blue focus:ring-blue"
          value={resultsPerPage}
          onChange={(event) => {
            onResultsPerPageChange(Number(event.target.value));
          }}
        >
          {RESULTS_PER_PAGE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <div className="flex items-center gap-4">
        <button
          aria-label="Previous page"
          className="flex h-8 w-8 items-center justify-center rounded text-lg text-neutral-700 disabled:cursor-not-allowed disabled:text-neutral-200"
          disabled={pageNumber === 1}
          onClick={() => onPageChange(pageNumber - 1)}
          type="button"
        >
          ‹
        </button>
        <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-sky text-blue">
          {pageNumber}
        </span>
        <button
          aria-label="Next page"
          className="flex h-8 w-8 items-center justify-center rounded text-lg text-neutral-700 disabled:cursor-not-allowed disabled:text-neutral-200"
          disabled={!canGoNext}
          onClick={() => onPageChange(pageNumber + 1)}
          type="button"
        >
          ›
        </button>
      </div>
    </div>
  );
};
