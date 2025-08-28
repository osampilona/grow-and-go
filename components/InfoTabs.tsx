"use client";

import { Fragment, ReactNode } from "react";
import { Tab } from "@headlessui/react";

export type InfoTabItem = {
  key: string;
  label: string;
  content: ReactNode;
};

export type InfoTabsProps = {
  items: InfoTabItem[];
  className?: string;
  listClassName?: string;
  panelsClassName?: string;
  tabClassName?: string | ((selected: boolean) => string);
  /** Background color for the active tab (any valid CSS color, e.g. "#2B7FFF") */
  tabColor?: string;
  /** When true (default), inactive panels are unmounted to avoid extra work. */
  unmountInactivePanels?: boolean;
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
  tabColor,
  unmountInactivePanels: _unmountInactivePanels = true,
  defaultIndex = 0,
  selectedIndex,
  onChange,
}: InfoTabsProps) {
  // If controlled, use selectedIndex; otherwise, let Tab.Group manage state
  const controlledProps =
    typeof selectedIndex === "number" ? { selectedIndex, onChange } : { defaultIndex, onChange };

  // Default styling
  const defaultTabListCls =
    "relative flex w-full md:w-fit gap-3 bg-gray-50 dark:bg-[#2A1A3C] rounded-3xl p-2 overflow-x-auto";
  const tabListCls = listClassName ?? defaultTabListCls;

  const defaultPanelCls = "bg-gray-50 dark:bg-[#2A1A3C] rounded-3xl p-4";
  const panelCls = panelsClassName ?? defaultPanelCls;

  // Function to generate tab className
  const getTabClassName = (selected: boolean) => {
    if (typeof tabClassName === "function") return tabClassName(selected);
    if (typeof tabClassName === "string") return tabClassName;

    return [
      "relative z-10 py-2 px-4 text-sm font-semibold uppercase outline-none cursor-pointer select-none rounded-3xl transition-colors whitespace-nowrap",
      selected ? "shadow" : "text-foreground/60 hover:text-foreground",
    ].join(" ");
  };

  return (
    <div className={className}>
      <Tab.Group {...controlledProps}>
        <Tab.List className={tabListCls}>
          {items.map((t, i) => (
            <Tab key={t.key} as={Fragment}>
              {({ selected }) => (
                <button
                  className={getTabClassName(selected)}
                  style={
                    selected && tabColor
                      ? {
                          backgroundColor: tabColor,
                          color: "#fff",
                          transition: "background-color 320ms, color 320ms",
                        }
                      : undefined
                  }
                  type="button"
                >
                  {t.label}
                </button>
              )}
            </Tab>
          ))}
        </Tab.List>
        <div className="mt-3">
          <Tab.Panels>
            {items.map((t) => (
              <Tab.Panel key={t.key} className={panelCls} unmount={_unmountInactivePanels}>
                <div className="normal-case font-normal">{t.content}</div>
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </div>
      </Tab.Group>
    </div>
  );
}
