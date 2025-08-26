"use client";

import type { FeedItem } from "@/data/mock/feed";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@heroui/react";

import ProductMidiCard from "./ProductMidiCard";

import { mockFeed } from "@/data/mock/feed";
import { useFeedStore } from "@/stores/feedStore";
import { parsePrice } from "@/utils/pricing";

type BundleDealProps = {
  product: FeedItem;
  className?: string;
  /** Visual color theme for the container. Defaults to 'yellow' */
  variant?: "yellow" | "blue" | "green";
};

// Simple bundle logic: if current item has bundleDeal=true, try to find
// up to 2 more items from the same seller that also have bundleDeal=true.
// If none, don't render.
export default function BundleDeal({
  product,
  className = "",
  variant = "yellow",
}: BundleDealProps) {
  const feedLoaded = useFeedStore((s) => s.items.length > 0);
  const feedItems = useFeedStore((s) => s.items);

  useEffect(() => {
    if (!feedLoaded) void useFeedStore.getState().loadFeed();
  }, [feedLoaded]);

  const items = feedLoaded && feedItems.length > 0 ? feedItems : mockFeed;

  const candidates = useMemo(() => {
    if (!product.bundleDeal) return [] as FeedItem[];
    // Same seller, bundleDeal=true, exclude current
    const sameSeller = items.filter(
      (it) => it.user.userId === product.user.userId && it.bundleDeal && it.id !== product.id
    );

    // Return all eligible items; UI is horizontally scrollable to handle many
    return sameSeller;
  }, [items, product]);

  // Selected state (default select only the current product; user can add more)
  const [selectedIds, setSelectedIds] = useState<string[]>([product.id]);

  useEffect(() => {
    setSelectedIds([product.id]);
  }, [product.id, candidates]);

  const allItems: FeedItem[] = [product, ...candidates];

  const toggle = (id: string) => {
    setSelectedIds((prev) => {
      // Ensure at least the main product stays selected
      if (id === product.id) return prev;

      return prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
    });
  };

  const { subtotal, discountAmount, total, selectedCount } = useMemo(() => {
    const selected = allItems.filter((it) => selectedIds.includes(it.id));
    const sum = selected.reduce((acc, it) => acc + parsePrice(it.price), 0);
    // Apply 15% only when bundling more than one item
    const eligible = selected.length >= 2;
    const disc = eligible ? Math.round(sum * 0.15) : 0;

    return {
      subtotal: sum,
      discountAmount: disc,
      total: sum - disc,
      selectedCount: selected.length,
    };
  }, [allItems, selectedIds]);

  // Basic currency formatter for DKK
  const formatDKK = (v: number) =>
    `DKK ${v.toLocaleString("da-DK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const showUI = product.bundleDeal && candidates.length > 0;

  if (!showUI) return null;

  // Map variant to Tailwind classes
  const variantClasses =
    variant === "blue"
      ? "border-blue-200 bg-blue-50 dark:bg-blue-900/20"
      : variant === "green"
        ? "border-green-200 bg-green-50 dark:bg-green-900/20"
        : "border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20";

  return (
    <>
      <h3 className="text-base font-semibold">Bundle deal available</h3>
      <div className={`rounded-2xl border ${variantClasses} p-3 sm:p-4 lg:p-5 ${className}`}>
        <div className="flex flex-col gap-3 lg:gap-4">
          <div className="grid grid-cols-1 gap-3 lg:gap-4 md:grid-cols-[1fr_auto] lg:grid-cols-[1fr_19rem] md:items-center">
            {/* Items row: column on small screens, horizontal scroll on lg+ */}
            <div className="flex flex-col lg:flex-row items-stretch gap-3 lg:gap-4 p-1 overflow-x-hidden lg:overflow-x-auto max-w-full">
              {allItems.map((it, idx) => (
                <div
                  key={it.id}
                  className="flex w-full flex-col lg:flex-row items-center gap-2 lg:gap-3"
                >
                  <ProductMidiCard
                    className="w-full lg:min-w-[18rem]"
                    item={it}
                    selected={selectedIds.includes(it.id)}
                    onToggle={() => toggle(it.id)}
                  />
                  {/* Plus sign between, except after last */}
                  {idx < allItems.length - 1 && (
                    <span className="block w-full text-center my-0 lg:w-auto lg:inline-block select-none text-2xl font-bold text-foreground/40">
                      +
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Summary column */}
            <div className="flex flex-col items-stretch gap-2 md:items-end">
              <div className="text-right text-sm">
                <div className="text-foreground/70">Subtotal: {formatDKK(subtotal)}</div>
                <div className="text-success font-medium">
                  Discount (15%): -{formatDKK(discountAmount)}
                </div>
                <div className="text-lg font-semibold">Total price: {formatDKK(total)}</div>
              </div>
              <Button
                disableAnimation
                disableRipple
                className="self-end font-bold px-8 uppercase cta-solid"
                color="default"
                radius="full"
                size="lg"
                onPress={() => {
                  // Minimal stub action; replace with real cart integration later.
                  alert(`Added ${selectedCount} item(s) to cart for ${formatDKK(total)}`);
                }}
              >
                ADD SELECTED TO CART
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
