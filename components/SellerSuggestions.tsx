"use client";

import type { FeedItem } from "@/data/mock/feed";

import { useEffect, useMemo } from "react";

import ProductMiniCard from "./ProductMiniCard";

import { mockFeed } from "@/data/mock/feed";
import { useFeedStore } from "@/stores/feedStore";
import { useSessionStore } from "@/stores/userStore";

export type SellerSuggestionsProps = {
  product: FeedItem;
  className?: string;
};

// Simple util: get items of a seller (excluding one id)
function getSellerItems(sellerId: string, excludeId?: string, max = 6) {
  const list = mockFeed.filter((i) => i.user.userId === sellerId && i.id !== excludeId);

  return list.slice(0, max);
}

// Find similar items by category/brand (excluding current seller)
function getSimilarItems(item: FeedItem, max = 6) {
  const { categoryId, brand, id, user } = item;
  const sameCategory = mockFeed.filter(
    (i) => i.categoryId === categoryId && i.id !== id && i.user.userId !== user.userId
  );
  const byBrand = brand
    ? sameCategory.filter((i) => i.brand && i.brand.toLowerCase() === brand.toLowerCase())
    : [];
  const merged = [...byBrand, ...sameCategory].filter((v, idx, arr) => arr.indexOf(v) === idx);

  return merged.slice(0, max);
}

// Grid item extracted to `ProductMiniCard` for reuse across pages.

export default function SellerSuggestions({ product, className }: SellerSuggestionsProps) {
  // In a real app, these would come from backend/user profile. For now allow overriding via store.
  // Select only the specific slice we need to avoid re-renders when unrelated sellers change
  const tier = useSessionStore((s) => s.sellerTiers[product.user.userId]) ?? "freemium";
  // We still load feed (mock) once so similar logic has data
  const loadFeed = useFeedStore((s) => s.loadFeed);
  const feedItemsLength = useFeedStore((s) => s.items.length);

  useEffect(() => {
    if (feedItemsLength === 0) {
      void loadFeed();
    }
  }, [feedItemsLength, loadFeed]);

  // New logic (uniform cases)
  const sellerItems = useMemo(
    () => getSellerItems(product.user.userId, product.id, 6),
    [product.user.userId, product.id]
  );
  const similar = useMemo(() => getSimilarItems(product, 6), [product]);
  const sellerHasMore = sellerItems.length > 0;

  // Case 2: freemium & has more -> blended list
  const blended = useMemo(() => {
    if (tier === "freemium" && sellerHasMore) return [...sellerItems, ...similar];

    return [];
  }, [tier, sellerHasMore, sellerItems, similar]);

  return (
    <div className={className}>
      <div className="rounded-xl border border-default-200 bg-default-50 dark:bg-slate-800/40 p-4 space-y-5">
        {/* Case 1: No more items from this seller (any tier) */}
        {!sellerHasMore && (
          <div className="space-y-4">
            <p className="font-semibold text-sm">No more items from this seller</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {similar.map((it) => (
                <ProductMiniCard key={it.id} item={it} />
              ))}
              {similar.length === 0 && (
                <div className="text-sm text-foreground/60">No similar items found.</div>
              )}
            </div>
          </div>
        )}

        {/* Case 2: Freemium & has more (blended, unlabeled) */}
        {tier === "freemium" && sellerHasMore && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {blended.map((it) => (
                <ProductMiniCard key={it.id} item={it} />
              ))}
            </div>
          </div>
        )}

        {/* Case 3: Premium & has more (clearly separated) */}
        {tier === "premium" && sellerHasMore && (
          <div className="space-y-8">
            <div className="space-y-3">
              <p className="font-semibold text-sm">More from {product.user.name}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {sellerItems.map((it) => (
                  <ProductMiniCard key={it.id} item={it} />
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <p className="font-semibold text-sm">Similar items from other sellers</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {similar.map((it) => (
                  <ProductMiniCard key={it.id} item={it} />
                ))}
                {similar.length === 0 && (
                  <div className="text-sm text-foreground/60">No similar items found.</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
