import { DashboardView } from "@/graphql/typeUtils";

type Unit = {
  singular: string;
  plural: string;
}

export type DashboardTab = {
  view: DashboardView;
  label: string;
  count: number | undefined;
  unit: Unit;
};

type DashboardTabsProps = {
  activeView: DashboardView;
  onViewChange: (view: DashboardView) => void;
  selectedCount?: number;
  onClearAll: () => void;
  tabs?: DashboardTab[]; // Optional prop to allow for custom tabs
};

export const DashboardTabs = ({
  activeView,
  onViewChange,
  selectedCount,
  onClearAll,
  tabs = [],
}: DashboardTabsProps) => {


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
                {tab.count === undefined
                  ? "—"
                  : `${tab.count} ${tab.count === 1 ? tab.unit.singular : tab.unit.plural}`}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-3 pb-2">
        {selectedCount !== undefined ? <span className="text-sm text-neutral-500">{selectedCount} selected</span> : null}
        
        {onClearAll ? (

           <button
          type="button"
          onClick={onClearAll}
          className="text-sm text-neutral-500 hover:text-black"
        >
          Clear all
        </button>
        ) : null}
        

      </div>
    </div>
  );
};
