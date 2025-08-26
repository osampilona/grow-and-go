"use client";

import { Tabs, Tab as HeroTab } from "@heroui/react";
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
  unmountInactivePanels: _unmountInactivePanels = true,
  defaultIndex = 0,
  selectedIndex,
  onChange,
}: InfoTabsProps) {
  const [internalIndex, setInternalIndex] = useState(defaultIndex);

  const idx = typeof selectedIndex === "number" ? selectedIndex : internalIndex;

  // Keys mapping helpers
  const keys = useMemo(() => items.map((t) => t.key), [items]);
  const indexToKey = useCallback(
    (i: number | undefined) => (i != null ? keys[i] : undefined),
    [keys]
  );
  const keyToIndex = useCallback(
    (k: React.Key | null | undefined) => (k != null ? Math.max(0, keys.indexOf(String(k))) : 0),
    [keys]
  );

  const selectedKey = indexToKey(idx);
  const defaultSelectedKey = indexToKey(defaultIndex);

  const handleSelectionChange = useCallback(
    (key: React.Key) => {
      const i = keyToIndex(key);

      onChange?.(i);
      if (typeof selectedIndex !== "number") setInternalIndex(i);
    },
    [keyToIndex, onChange, selectedIndex]
  );

  const baseTabClass = useCallback(
    (selected: boolean) =>
      `p-2 text-sm font-semibold uppercase outline-none cursor-pointer select-none rounded-2xl transition-colors ${
        selected
          ? "bg-default-100 text-foreground shadow-sm dark:bg-slate-800/60"
          : "text-foreground/60 hover:text-foreground"
      }`,
    []
  );

  // Map styling props to HeroUI Tabs classNames where possible
  const classNames = useMemo(
    () => ({
      tabList: listClassName ?? "flex gap-3",
      panel: panelsClassName,
    }),
    [listClassName, panelsClassName]
  );

  return (
    <Tabs
      aria-label="Information Tabs"
      className={className}
      classNames={classNames as any}
      defaultSelectedKey={defaultSelectedKey}
      selectedKey={selectedKey}
      // HeroUI unmounts panels by default; we emulate previous API by toggling the internal state only
      onSelectionChange={handleSelectionChange}
    >
      {items.map((t, i) => (
        <HeroTab
          key={t.key}
          className={
            typeof tabClassName === "function"
              ? tabClassName(i === idx)
              : tabClassName || baseTabClass(i === idx)
          }
          title={t.label}
        >
          <div className="normal-case font-normal">{t.content}</div>
        </HeroTab>
      ))}
    </Tabs>
  );
}

export default memo(InfoTabs);
