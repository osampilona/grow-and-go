"use client";

import { Fragment, ReactNode, memo, useMemo } from "react";
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
  /** Background color for the active tab (any valid CSS color, e.g. "#2B7FFF") */
  tabColor?: string;
  /** Text color for the active tab (any valid CSS color, e.g. "#111827"). Defaults to white when tabColor is set and this is not provided. */
  tabTextColor?: string;
  /** When true (default), inactive panels are unmounted to avoid extra work. */
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
  tabColor,
  tabTextColor,
  unmountInactivePanels: _unmountInactivePanels = true,
  defaultIndex = 0,
  selectedIndex,
  onChange,
}: InfoTabsProps) {
  // If controlled, use selectedIndex; otherwise, let Tab.Group manage state
  const controlledProps = useMemo(() => {
    if (typeof selectedIndex === "number") {
      return { selectedIndex, onChange };
    }

    return { defaultIndex, onChange };
  }, [selectedIndex, defaultIndex, onChange]);

  // Default styling
  const defaultTabListCls =
    "relative flex w-full md:w-fit gap-3 bg-gray-50 dark:bg-[#2A1A3C] rounded-3xl p-2 overflow-x-auto";
  const tabListCls = listClassName ?? defaultTabListCls;

  const defaultPanelCls = "bg-gray-50 dark:bg-[#2A1A3C] rounded-3xl p-4";
  const panelCls = panelsClassName ?? defaultPanelCls;

  // Pre-computed class segments
  const baseTabCls =
    "relative z-10 py-2 px-4 text-sm font-semibold uppercase outline-none cursor-pointer select-none rounded-3xl transition-colors whitespace-nowrap";
  const selectedTabCls = "shadow";
  const unselectedTabCls = "text-foreground/60 hover:text-foreground";
  const getTabClassName = (selected: boolean) =>
    [baseTabCls, selected ? selectedTabCls : unselectedTabCls].join(" ");

  // Memoize style object to avoid recreating per render
  const getSelectedStyle = useMemo(() => {
    if (!(tabColor || tabTextColor)) return undefined;

    return (selected: boolean): React.CSSProperties | undefined =>
      selected
        ? {
            ...(tabColor ? { backgroundColor: tabColor } : {}),
            ...(tabTextColor ? { color: tabTextColor } : { color: "#fff" }),
            transition: "background-color 320ms, color 320ms",
          }
        : undefined;
  }, [tabColor, tabTextColor]);

  return (
    <div className={className}>
      <Tab.Group {...controlledProps}>
        <Tab.List className={tabListCls}>
          {items.map((t) => (
            <Tab key={t.key} as={Fragment}>
              {({ selected }) => (
                <button
                  className={getTabClassName(selected)}
                  style={getSelectedStyle?.(selected)}
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

export default memo(InfoTabs);
