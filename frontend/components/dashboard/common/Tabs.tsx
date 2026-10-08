type Unit = {
  singular: string;
  plural: string;
}

export type Tab = {
  view: string;
  label: string;
  count: number | undefined;
  unit: Unit;
};

type TabsProps = {
  activeView: string;
  onViewChange: (view: string) => void;
  selectedCount?: number;
  onClearAll?: () => void;
  tabs?: Tab[]; // Optional prop to allow for custom tabs
};

export const Tabs = ({
  activeView,
  onViewChange,
  selectedCount,
  onClearAll,
  tabs = [],
}: TabsProps) => {


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
                className="font-inter text-base font-medium not-italic leading-6 text-[#5A5A5A] [font-feature-settings:'liga'_off,'clig'_off]"
              >
                {tab.label}
              </span>
              <span
                className="font-source text-xs font-semibold not-italic leading-[normal] text-[#5A5A5A]"
              >
                {tab.count === undefined
                  ? "—"
                  : `${tab.count} ${tab.count === 1 ? tab.unit.singular : tab.unit.plural}`}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-3 pb-2 text-right font-source text-base font-normal not-italic leading-[140%] text-[#767676] [font-feature-settings:'liga'_off,'clig'_off]">
        {selectedCount !== undefined ? <span>{selectedCount} selected</span> : null}
        
        {onClearAll ? (

           <button
          type="button"
          onClick={onClearAll}
          className="text-right hover:text-black"
        >
          Clear all
        </button>
        ) : null}
        

      </div>
    </div>
  );
};
