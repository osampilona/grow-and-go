"use client";

import { Tab } from "@headlessui/react";
import { memo, ReactNode, useCallback, useMemo, useState } from "react";

export type InfoTabItem = {
  key: string;
  label: string;
  content: ReactNode;
};

type InfoTabsProps = {
  items: InfoTabItem[];
  className?: string;
  listClassName?: string;
  panelsClassName?: string;
  tabClassName?: string | ((selected: boolean) => string);
  /**
   * When true (default), inactive panels are unmounted to avoid extra work.
   * Set to false if you need state preserved across tabs.
   */
  unmountInactivePanels?: boolean;
  defaultIndex?: number;
  selectedIndex?: number;
  onChange?: (index: number) => void;
};

function InfoTabs({
  items,
  className,
  listClassName,
  panelsClassName,
  tabClassName,
  unmountInactivePanels = true,
  defaultIndex = 0,
  selectedIndex,
  onChange,
}: InfoTabsProps) {
  const [internalIndex, setInternalIndex] = useState(defaultIndex);

  const idx = typeof selectedIndex === "number" ? selectedIndex : internalIndex;
  const handleChange = useCallback(
    (i: number) => {
      onChange?.(i);
      if (typeof selectedIndex !== "number") setInternalIndex(i);
    },
    [onChange, selectedIndex]
  );

  const baseTabClass = useCallback(
    (selected: boolean) =>
      `-mb-px py-2 text-sm font-semibold uppercase outline-none border-b-2 cursor-pointer select-none ${selected ? "border-foreground text-foreground" : "border-transparent text-foreground/60 hover:text-foreground"}`,
    []
  );

  const computedListClass = useMemo(
    () => listClassName ?? "flex gap-8 border-b border-default-200 dark:border-slate-700",
    [listClassName]
  );

  return (
    <div className={className}>
      <Tab.Group selectedIndex={idx} onChange={handleChange}>
        <Tab.List className={computedListClass}>
          {items.map((t) => (
            <Tab
              key={t.key}
              className={({ selected }) =>
                typeof tabClassName === "function"
                  ? tabClassName(selected)
                  : tabClassName || baseTabClass(selected)
              }
            >
              {t.label}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className={panelsClassName ?? "mt-4"}>
          {items.map((t) => (
            <Tab.Panel key={t.key} unmount={!!unmountInactivePanels}>
              {t.content}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}

export default memo(InfoTabs);
