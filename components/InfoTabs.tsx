"use client";

import {
  memo,
  ReactNode,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useLayoutEffect,
} from "react";

import { resolveInfoTabsTheme, type InfoTabsThemeKey } from "@/config/infoTabsThemes";

export type InfoTabItem = {
  key: string;
  label: string;
  content: ReactNode;
};

type PillRect = { left: number; top: number; width: number; height: number };

export type InfoTabsProps = {
  items: InfoTabItem[];
  className?: string;
  listClassName?: string;
  panelsClassName?: string;
  tabClassName?: string | ((selected: boolean) => string);
  /** Theme key to pick colors from the central palette (e.g. "blue", "yellow"). */
  theme?: InfoTabsThemeKey;
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
  theme,
  unmountInactivePanels: _unmountInactivePanels = true,
  defaultIndex = 0,
  selectedIndex,
  onChange,
}: InfoTabsProps) {
  const [internalIndex, setInternalIndex] = useState(defaultIndex);
  const idx = typeof selectedIndex === "number" ? selectedIndex : internalIndex;

  // Resolve colors from theme palette
  const themed = theme ? resolveInfoTabsTheme(theme) : undefined;
  const activeBg = themed?.bg;

  const accentFg = useMemo(() => {
    if (!activeBg) return undefined;
    // Use only theme-provided foreground color

    return themed?.fg;
  }, [activeBg, themed?.fg]);

  // Accessibility ids base
  const idBase = useId();

  const baseTabClass = useCallback(
    (selected: boolean) =>
      `relative z-10 py-2 px-4 text-sm font-semibold uppercase outline-none cursor-pointer select-none rounded-3xl transition-colors ${
        selected ? "" : "text-foreground/60 hover:text-foreground"
      }`,
    []
  );

  // Refs for focus management
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const setIndex = useCallback(
    (i: number) => {
      const next = Math.max(0, Math.min(items.length - 1, i));

      onChange?.(next);
      if (typeof selectedIndex !== "number") setInternalIndex(next);
    },
    [items.length, onChange, selectedIndex]
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft" || e.key === "Home" || e.key === "End") {
        e.preventDefault();

        let next = idx;

        if (e.key === "ArrowRight") next = (idx + 1) % items.length;
        if (e.key === "ArrowLeft") next = (idx - 1 + items.length) % items.length;
        if (e.key === "Home") next = 0;
        if (e.key === "End") next = items.length - 1;

        setIndex(next);

        // focus the next tab button
        const btn = tabRefs.current[next];

        btn?.focus();
        btn?.scrollIntoView?.({ behavior: "smooth", block: "nearest", inline: "nearest" });
      }
    },
    [idx, items.length, setIndex]
  );

  // Sliding pill metrics (active background for selected tab)
  const listRef = useRef<HTMLDivElement | null>(null);
  const [pill, setPill] = useState<PillRect>({ left: 0, top: 0, width: 0, height: 0 });

  const updatePill = useCallback(() => {
    const btn = tabRefs.current[idx];
    const list = listRef.current;

    if (!btn || !list) {
      return;
    }

    // Slight inset so the pill doesn't hug the button edges
    const INSET = 2; // px
    const left = btn.offsetLeft - list.scrollLeft + INSET;
    const top = btn.offsetTop - list.scrollTop + INSET;
    const width = Math.max(0, btn.offsetWidth - INSET * 2);
    const height = Math.max(0, btn.offsetHeight - INSET * 2);

    setPill({ left, top, width, height });
  }, [idx]);

  useLayoutEffect(() => {
    updatePill();
  }, [idx, items.length, updatePill]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handle = () => updatePill();

    window.addEventListener("resize", handle);

    return () => window.removeEventListener("resize", handle);
  }, [updatePill]);

  useEffect(() => {
    const el = listRef.current;

    if (!el) return;

    const handle = () => updatePill();

    el.addEventListener("scroll", handle, { passive: true } as AddEventListenerOptions);

    return () => {
      el.removeEventListener("scroll", handle as EventListener);
    };
  }, [updatePill]);

  const defaultTabListCls =
    "relative flex lg:inline-flex w-full md:w-fit gap-3 bg-gray-50 dark:bg-[#2A1A3C] rounded-3xl p-2 overflow-x-auto lg:overflow-visible";

  const tabListCls = listClassName ?? defaultTabListCls;

  const panelCls = panelsClassName ?? "bg-gray-50 dark:bg-[#2A1A3C] rounded-3xl p-4";

  return (
    <div className={className}>
      <div
        ref={listRef}
        aria-label="Information Tabs"
        aria-orientation="horizontal"
        className={tabListCls}
        role="tablist"
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        {activeBg && pill.width > 0 && (
          <div
            aria-hidden
            className="absolute z-0 rounded-3xl pointer-events-none"
            style={{
              backgroundColor: activeBg,
              left: -0.5,
              top: -0.5,
              width: pill.width,
              height: pill.height,
              transform: `translate(${pill.left}px, ${pill.top}px)`,
              transition:
                "transform 320ms ease-out, width 320ms ease-out, height 320ms ease-out, background-color 320ms ease-out",
              willChange: "transform,width,height,background-color",
            }}
          />
        )}

        {items.map((t, i) => {
          const selected = i === idx;
          const id = `${idBase}-tab-${i}`;
          const panelId = `${idBase}-panel-${i}`;
          const btnClass =
            typeof tabClassName === "function"
              ? tabClassName(selected)
              : tabClassName || baseTabClass(selected);
          const style: React.CSSProperties | undefined =
            selected && accentFg ? { color: accentFg } : undefined;

          return (
            <button
              key={t.key}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              aria-controls={panelId}
              aria-selected={selected}
              className={btnClass}
              id={id}
              role="tab"
              style={style}
              tabIndex={selected ? 0 : -1}
              type="button"
              onClick={() => setIndex(i)}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="mt-3">
        {items.map((t, i) => {
          const selected = i === idx;
          const id = `${idBase}-panel-${i}`;
          const tabId = `${idBase}-tab-${i}`;

          if (_unmountInactivePanels && !selected) return null;

          return (
            <div
              key={t.key}
              aria-labelledby={tabId}
              className={panelCls}
              hidden={!selected}
              id={id}
              role="tabpanel"
            >
              <div className="normal-case font-normal">{t.content}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default memo(InfoTabs);
