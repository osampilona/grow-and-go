"use client";

import { Tabs, Tab as HeroTab } from "@heroui/react";
import { memo, ReactNode, useCallback, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

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
  // Page-themed name by palette: use "blue" or "yellow" and we'll map to Tabs colors.
  themeKey?: "blue" | "yellow";
  // Optional Tabs variant; defaults to "solid" for pill-style colored tab.
  variant?: "solid" | "bordered" | "light" | "underlined" | "secondary" | "flat" | "ghost";
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
  themeKey,
  variant = "solid",
  unmountInactivePanels: _unmountInactivePanels = true,
  defaultIndex = 0,
  selectedIndex,
  onChange,
}: InfoTabsProps) {
  const pathname = usePathname();
  const [internalIndex, setInternalIndex] = useState(defaultIndex);

  const idx = typeof selectedIndex === "number" ? selectedIndex : internalIndex;

  // Auto color by route when not provided
  const autoColor = useMemo(() => {
    if (!pathname) return undefined;
    if (pathname.startsWith("/user/")) return "warning" as const;
    if (pathname.startsWith("/products/")) return "primary" as const;

    return undefined;
  }, [pathname]);
  const THEME_TO_COLOR: Record<"yellow" | "blue", "warning" | "primary"> = {
    yellow: "warning",
    blue: "primary",
  };
  const themeMapped = themeKey ? THEME_TO_COLOR[themeKey] : undefined;
  const tabsColor = themeMapped ?? autoColor ?? "default";

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
      `p-2 text-sm font-semibold uppercase outline-none cursor-pointer select-none rounded-3xl transition-colors ${
        selected ? "" : "text-foreground/60 hover:text-foreground"
      }`,
    []
  );

  // Map styling props to HeroUI Tabs classNames where possible
  const classNames = useMemo(
    () => ({
      tabList: listClassName ?? "flex gap-3 bg-gray-50 dark:bg-[#2A1A3C] rounded-3xl p-2",
      panel: panelsClassName ?? "bg-gray-50 dark:bg-[#2A1A3C] rounded-3xl p-4 ",
    }),
    [listClassName, panelsClassName]
  );

  return (
    <Tabs
      aria-label="Information Tabs"
      className={className}
      classNames={classNames as any}
      color={tabsColor as any}
      defaultSelectedKey={defaultSelectedKey}
      radius="full"
      selectedKey={selectedKey}
      variant={variant as any}
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
