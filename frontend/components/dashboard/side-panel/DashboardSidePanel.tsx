import Drawer from "@mui/material/Drawer";
import { ReactNode } from "react";

type DashboardSidePanelPagination = {
  currentIndex: number;
  totalCount: number;
  onPrevious: () => void;
  onNext: () => void;
};

type DashboardSidePanelProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  pagination?: DashboardSidePanelPagination;
  children?: ReactNode;
};

const CollapseIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M11 3.5L5.5 9L11 14.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15 3.5L9.5 9L15 14.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const DashboardSidePanel = ({
  open,
  onClose,
  title = "Applicant details",
  pagination,
  children,
}: DashboardSidePanelProps) => (
  <Drawer
    anchor="right"
    open={open}
    onClose={onClose}
    PaperProps={{
      className: "w-full max-w-[480px]",
    }}
  >
    <aside className="flex h-full flex-col bg-white">
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-neutral-200 px-6">
        {pagination ? (
          <>
            <button
              aria-label="Close side panel"
              className="flex h-8 w-8 items-center justify-center rounded text-neutral-700 hover:bg-surface-muted"
              onClick={onClose}
              type="button"
            >
              <CollapseIcon />
            </button>
            <div className="flex items-center gap-3 font-source text-sm text-neutral-500">
              <button
                aria-label="Previous applicant"
                onClick={pagination.onPrevious}
                disabled={pagination.currentIndex <= 0}
                type="button"
                className="disabled:opacity-30"
              >
                ‹
              </button>
              <span>
                {pagination.currentIndex + 1}/{pagination.totalCount}
              </span>
              <button
                aria-label="Next applicant"
                onClick={pagination.onNext}
                disabled={pagination.currentIndex >= pagination.totalCount - 1}
                type="button"
                className="disabled:opacity-30"
              >
                ›
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="font-poppins text-lg font-semibold leading-none text-neutral-800">
              {title}
            </h2>
            <button
              aria-label="Close side panel"
              className="flex h-8 w-8 items-center justify-center rounded text-2xl leading-none text-neutral-700 hover:bg-surface-muted"
              onClick={onClose}
              type="button"
            >
              ×
            </button>
          </>
        )}
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
        {children ?? (
          <div className="h-full rounded border border-dashed border-neutral-200" />
        )}
      </div>
    </aside>
  </Drawer>
);
