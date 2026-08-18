import { DashboardView } from "@/graphql/typeUtils";

type Tab = {
  view: DashboardView;
  label: string;
  count: number;
};

type DashboardTabsProps = {
  activeView: DashboardView;
  onViewChange: (view: DashboardView) => void;
  counts: Record<DashboardView, number>;
  selectedCount: number;
  onClearAll: () => void;
};

export const DashboardTabs = ({
  activeView,
  onViewChange,
  counts,
  selectedCount,
  onClearAll,
}: DashboardTabsProps) => {
  const tabs: Tab[] = [
    { view: DashboardView.All, label: "All Applicants", count: counts[DashboardView.All] },
    { view: DashboardView.Shortlisted, label: "Shortlisted", count: counts[DashboardView.Shortlisted] },
    { view: DashboardView.Conflicts, label: "Conflicts", count: counts[DashboardView.Conflicts] },
  ];

  return (
    <div className="flex items-end justify-between border-b border-neutral-200">
      <div className="flex gap-6">
        {tabs.map((tab) => {
          const isActive = activeView === tab.view;
          return (
            <button
              key={tab.view}
              type="button"
              onClick={() => onViewChange(tab.view)}
              className={`flex flex-col pb-2 text-left focus:outline-none ${
                isActive ? "border-b-2 border-blue" : ""
              }`}
            >
              <span
                className={`text-sm font-semibold ${
                  isActive ? "text-black" : "text-neutral-500"
                }`}
              >
                {tab.label}
              </span>
              <span
                className={`text-xs font-medium ${
                  isActive ? "text-blue" : "text-neutral-400"
                }`}
              >
                {tab.count} {tab.count === 1 ? "Entry" : "Entries"}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-3 pb-2">
        <span className="text-sm text-neutral-500">{selectedCount} selected</span>
        <button
          type="button"
          onClick={onClearAll}
          className="text-sm text-neutral-500 hover:text-black"
        >
          Clear all
        </button>
      </div>
    </div>
  );
};
