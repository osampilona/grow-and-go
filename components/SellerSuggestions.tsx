"use client";

import type { FeedItem } from "@/data/mock/feed";

import { useEffect, useMemo, useState } from "react";

// Local components
import Pagination from "./Pagination";
import ProductMiniCard from "./ProductMiniCard";
import Card from "./Card";
import { CardContainer } from "./CardContainer";
import { HorizontalScroller } from "./HorizontalScroller";
import { IconMessage } from "./IconMessage";

// Internal modules
import { mockFeed } from "@/data/mock/feed";
import { useFeedStore } from "@/stores/feedStore";
import { useSessionStore } from "@/stores/userStore";

export type SellerSuggestionsProps = {
  product: FeedItem;
  className?: string;
};

// --- Indexed lookup (built once per items array identity) ---
let _lastRef: FeedItem[] | null = null;
let _sellerIndex: Record<string, FeedItem[]> = {};
let _categoryIndex: Record<string, FeedItem[]> = {};
let _categoryBrandIndex: Record<string, FeedItem[]> = {};

function buildIndexes(items: FeedItem[]) {
  if (items === _lastRef) return;
  _sellerIndex = {};
  _categoryIndex = {};
  _categoryBrandIndex = {};
  for (const it of items) {
    // seller
    (_sellerIndex[it.user.userId] ||= []).push(it);
    // category
    (_categoryIndex[it.categoryId] ||= []).push(it);
    // category+brand
    if (it.brand) {
      const key = it.categoryId + "||" + it.brand.toLowerCase();

      (_categoryBrandIndex[key] ||= []).push(it);
    }
  }
  _lastRef = items;
}

function getSellerItemsIndexed(sellerId: string, excludeId?: string, max = 6) {
  const list = _sellerIndex[sellerId] || [];

  if (!excludeId) return list.slice(0, max);
  const out: FeedItem[] = [];

  for (const it of list) {
    if (it.id === excludeId) continue;
    out.push(it);
    if (out.length === max) break;
  }

  return out;
}

function getSimilarItemsIndexed(item: FeedItem, max = 6) {
  const { categoryId, brand, id, user } = item;
  const key = brand ? categoryId + "||" + brand.toLowerCase() : undefined;
  const brandMatches = key ? _categoryBrandIndex[key] || [] : [];
  const cat = _categoryIndex[categoryId] || [];
  const merged: FeedItem[] = [];
  const pushUnique = (it: FeedItem) => {
    if (it.id === id) return;
    if (it.user.userId === user.userId) return; // exclude same seller
    if (merged.indexOf(it) !== -1) return;
    merged.push(it);
  };

  for (const it of brandMatches) pushUnique(it);
  for (const it of cat) pushUnique(it);

  return merged.slice(0, max);
}

// Grid item extracted to `ProductMiniCard` for reuse across pages.

export default function SellerSuggestions({ product, className }: SellerSuggestionsProps) {
  // In a real app, these would come from backend/user profile. For now allow overriding via store.
  // Select only the specific slice we need to avoid re-renders when unrelated sellers change
  const tier = useSessionStore((s) => s.sellerTiers[product.user.userId]) ?? "freemium";
  // Subscribe only to a boolean to minimize rerenders
  const feedLoaded = useFeedStore((s) => s.items.length > 0);
  const feedItems = useFeedStore((s) => s.items); // will update once when loaded

  // Lazy load feed if not loaded yet (avoid subscribing to loadFeed function)
  useEffect(() => {
    if (!feedLoaded) void useFeedStore.getState().loadFeed();
  }, [feedLoaded]);

  // Choose active dataset & build indexes when dataset reference changes
  const activeItems = feedLoaded && feedItems.length > 0 ? feedItems : mockFeed;

  buildIndexes(activeItems);

  // New logic (uniform cases)
  const sellerItems = useMemo(
    () => getSellerItemsIndexed(product.user.userId, product.id, Number.MAX_SAFE_INTEGER),
    [product.user.userId, product.id, activeItems]
  );
  const similar = useMemo(() => getSimilarItemsIndexed(product, 6), [product, activeItems]);
  const sellerHasMore = sellerItems.length > 0;

  // Show more/less for seller listings (premium case)
  const INITIAL_SELLER_LISTINGS = 4;
  const [visibleCount, setVisibleCount] = useState(INITIAL_SELLER_LISTINGS);

  useEffect(() => setVisibleCount(INITIAL_SELLER_LISTINGS), [product.user.userId]);
  const visibleSellerItems = sellerItems.slice(0, visibleCount);

  // Case 2: freemium & has more -> blended list
  const blended = useMemo(() => {
    if (tier === "freemium" && sellerHasMore) return [...sellerItems, ...similar];

    return [];
  }, [tier, sellerHasMore, sellerItems, similar]);

  return (
    <div className={className}>
      {/* Case 1 (Premium only): No more items from this seller */}
      {tier === "premium" && !sellerHasMore && (
        <div className="mb-6">
          <CardContainer>
            <p className="font-semibold text-base">No more items from {product.user.name}</p>
            {similar.length > 0 ? (
              <HorizontalScroller>
                {similar.map((it) => (
                  <div key={it.id} className="snap-start shrink-0 w-56">
                    <ProductMiniCard item={it} />
                  </div>
                ))}
              </HorizontalScroller>
            ) : (
              <IconMessage message="No similar items found." />
            )}
          </CardContainer>
        </div>
      )}

      {/* Freemium & no more items: show only similar items list (no blue container) */}
      {tier === "freemium" && !sellerHasMore && (
        <div className="mb-6">
          <CardContainer>
            {similar.length > 0 ? (
              <>
                <p className="font-semibold text-base">You may also like</p>
                <HorizontalScroller>
                  {similar.map((it) => (
                    <div key={it.id} className="snap-start shrink-0 w-56">
                      <ProductMiniCard item={it} />
                    </div>
                  ))}
                </HorizontalScroller>
              </>
            ) : (
              <IconMessage message="No similar items found." />
            )}
          </CardContainer>
        </div>
      )}

      {/* Case 2: Freemium & has more (blended, unlabeled) */}
      {tier === "freemium" && sellerHasMore && (
        <CardContainer>
          <p className="font-semibold text-base">You may also like</p>
          <HorizontalScroller>
            {blended.map((it) => (
              <div key={it.id} className="snap-start shrink-0 w-56">
                <ProductMiniCard item={it} />
              </div>
            ))}
          </HorizontalScroller>
        </CardContainer>
      )}

      {/* Case 3: Premium & has more (separate containers, seller emphasized) */}
      {tier === "premium" && sellerHasMore && (
        <>
          <h2 className="font-semibold">More from {product.user.name}</h2>
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 my-6 mx-0">
              {visibleSellerItems.map((it) => (
                <Card
                  key={it.id}
                  item={{
                    id: it.id,
                    title: it.title,
                    price: it.price,
                    rating: it.sellerRating,
                    condition: it.condition,
                    images: it.images.slice(0, 4),
                    user: {
                      userId: it.user.userId,
                      name: it.user.name,
                      avatar: it.user.avatar,
                    },
                  }}
                />
              ))}
            </div>
            {sellerItems.length > INITIAL_SELLER_LISTINGS && (
              <Pagination
                initial={INITIAL_SELLER_LISTINGS}
                label="listings"
                setVisible={setVisibleCount}
                step={10}
                total={sellerItems.length}
                visible={visibleSellerItems.length}
              />
            )}
            <CardContainer className="md:flex-1 bg-default-50 dark:bg-slate-800/40">
              <p className="font-semibold text-sm">Similar items from other sellers</p>
              {similar.length > 0 ? (
                <HorizontalScroller>
                  {similar.map((it) => (
                    <div key={it.id} className="snap-start shrink-0 w-56">
                      <ProductMiniCard item={it} />
                    </div>
                  ))}
                </HorizontalScroller>
              ) : (
                <IconMessage message="No similar items found." />
              )}
            </CardContainer>
          </div>
        </>
      )}
    </div>
  );
}
