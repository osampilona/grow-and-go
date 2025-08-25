"use client";

import { Tab } from "@headlessui/react";
import { ReactNode, useState } from "react";

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
  tabClassName?: (selected: boolean) => string | string;
  defaultIndex?: number;
  selectedIndex?: number;
  onChange?: (index: number) => void;
};

export default function InfoTabs({
  items,
  className,
  listClassName,
  panelsClassName,
  tabClassName,
  defaultIndex = 0,
  selectedIndex,
  onChange,
}: InfoTabsProps) {
  const [internalIndex, setInternalIndex] = useState(defaultIndex);

  const idx = typeof selectedIndex === "number" ? selectedIndex : internalIndex;
  const handleChange = (i: number) => {
    if (onChange) onChange(i);
    if (typeof selectedIndex !== "number") setInternalIndex(i);
  };

  const baseTabClass = (selected: boolean) =>
    `-mb-px py-2 text-sm font-semibold uppercase outline-none border-b-2 cursor-pointer select-none ${selected ? "border-foreground text-foreground" : "border-transparent text-foreground/60 hover:text-foreground"}`;

  return (
    <div className={className}>
      <Tab.Group selectedIndex={idx} onChange={handleChange}>
        <Tab.List
          className={
            listClassName ?? "flex gap-8 border-b border-default-200 dark:border-slate-700"
          }
        >
          {items.map((t) => (
            <Tab
              key={t.key}
              className={({ selected }) =>
                tabClassName
                  ? typeof tabClassName === "function"
                    ? tabClassName(selected)
                    : tabClassName
                  : baseTabClass(selected)
              }
            >
              {t.label}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className={panelsClassName ?? "mt-4"}>
          {items.map((t) => (
            <Tab.Panel key={t.key}>{t.content}</Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
