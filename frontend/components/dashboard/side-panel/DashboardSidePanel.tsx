import Drawer from "@mui/material/Drawer";
import { ReactNode } from "react";

type DashboardSidePanelProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children?: ReactNode;
};

export const DashboardSidePanel = ({
  open,
  onClose,
  title = "Applicant details",
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
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
        {children ?? (
          <div className="h-full rounded border border-dashed border-neutral-200" />
        )}
      </div>
    </aside>
  </Drawer>
);
