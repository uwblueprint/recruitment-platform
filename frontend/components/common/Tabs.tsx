type TabsProps<T extends string> = {
  tabs: readonly T[];
  activeTab: T;
  onChange: (tab: T) => void;
  counts?: Partial<Record<T, number>>;
  countLabel?: string;
};

const Tabs = <T extends string>({
  tabs,
  activeTab,
  onChange,
  counts,
  countLabel = "applications",
}: TabsProps<T>) => (
  <div className="mt-8 flex gap-8 border-b border-neutral-200">
    {tabs.map((tab) => {
      const active = tab === activeTab;
      return (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`flex flex-col items-start pb-3 transition-colors ${
            active
              ? "border-b-2 border-blue text-blue"
              : "text-neutral-500 hover:text-neutral-800"
          }`}
        >
          <span className="font-poppins text-sm font-semibold">{tab}</span>
          {counts && (
            <span className="font-source text-xs">
              {counts[tab] ?? 0} {countLabel}
            </span>
          )}
        </button>
      );
    })}
  </div>
);

export default Tabs;
