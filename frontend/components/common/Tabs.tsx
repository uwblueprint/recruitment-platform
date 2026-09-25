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
  <div className="mt-8 flex gap-8">
    {tabs.map((tab) => {
      const active = tab === activeTab;
      return (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`flex flex-col items-start border-b-2 pb-3 transition-colors ${
            active
              ? "border-blue text-blue"
              : "border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-800"
          }`}
        >
          <span className="font-inter text-[16px] font-medium leading-6 tracking-normal">
            {tab}
          </span>
          {counts && (
            <span className="font-source text-[12px] font-semibold leading-none tracking-normal">
              {counts[tab] ?? 0} {countLabel}
            </span>
          )}
        </button>
      );
    })}
  </div>
);

export default Tabs;
