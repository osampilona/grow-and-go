"use client";

import type { FeedItem } from "@/data/mock/feed";

import { memo, useEffect, useMemo } from "react";
import { Button } from "@heroui/react";

import ProductMiniCard from "./ProductMiniCard";

import { mockFeed } from "@/data/mock/feed";
import { useFeedStore } from "@/stores/feedStore";
import { useFollowingStore, useSessionStore } from "@/stores/userStore";

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

// (Legacy) Pill component removed after style-guide redesign.

const FollowButton = memo(function FollowButton({
  sellerId,
  label,
  followingLabel,
}: {
  sellerId: string;
  label?: string;
  followingLabel?: string;
}) {
  const isFollowing = useFollowingStore((s) => s.isFollowing(sellerId));
  const follow = useFollowingStore((s) => s.follow);
  const unfollow = useFollowingStore((s) => s.unfollow);

  const commonProps = {
    disableAnimation: true as const,
    disableRipple: true as const,
    className: "inline-flex font-semibold transition-none cta-outline",
    color: "default" as const,
    radius: "full" as const,
    size: "sm" as const,
  };

  return isFollowing ? (
    <Button
      {...commonProps}
      aria-label={followingLabel || "Unfollow seller"}
      onClick={() => unfollow(sellerId)}
    >
      {followingLabel || "Following"}
    </Button>
  ) : (
    <Button {...commonProps} aria-label={label || "Follow seller"} onClick={() => follow(sellerId)}>
      {label || "Follow"}
    </Button>
  );
});

// Grid item extracted to `ProductMiniCard` for reuse across pages.

export default function SellerSuggestions({ product, className }: SellerSuggestionsProps) {
  // In a real app, these would come from backend/user profile. For now allow overriding via store.
  // Select only the specific slice we need to avoid re-renders when unrelated sellers change
  const tier = useSessionStore((s) => s.sellerTiers[product.user.userId]) ?? "freemium";
  const sellerProfile = useSessionStore((s) => s.sellerProfiles[product.user.userId]);

  // Ensure feed is available if needed later (we can show loaders if we fetch async)
  const loadFeed = useFeedStore((s) => s.loadFeed);
  const feedItemsLength = useFeedStore((s) => s.items.length);

  useEffect(() => {
    if (feedItemsLength === 0) {
      void loadFeed();
    }
  }, [feedItemsLength, loadFeed]);

  // Branching logic
  const sellerItems = useMemo(
    () => (tier === "premium" ? getSellerItems(product.user.userId, product.id, 6) : []),
    [tier, product.user.userId, product.id]
  );
  const similar = useMemo(
    () => (tier === "freemium" ? getSimilarItems(product, 6) : []),
    [tier, product]
  );
  const sellerHasMore = sellerItems.length > 0;

  return (
    <div className={className}>
      {/* Freemium case */}
      {tier === "freemium" && (
        <div className="space-y-6">
          <div className="rounded-xl border border-default-200 bg-default-50 dark:bg-slate-800/40 p-4 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-top gap-3">
                <div aria-hidden className="shrink-0 text-2xl">
                  🛍️
                </div>
                <div className="min-w-0">
                  <p className="font-semibold leading-tight">Similar items from other sellers</p>
                  <p className="text-xs text-foreground/60 mt-0.5">
                    Follow {product.user.name.split(" ")[0]} to catch new listings early
                  </p>
                </div>
              </div>
              <FollowButton
                label={`Follow ${product.user.name.split(" ")[0]}`}
                sellerId={product.user.userId}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {similar.map((it) => (
                <ProductMiniCard key={it.id} item={it} />
              ))}
              {similar.length === 0 && (
                <div className="text-sm text-foreground/60">No similar items yet.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Premium case always shows style guide */}
      {tier === "premium" && (
        <div className="space-y-6">
          {/* Style Guide always shown */}
          <div className="rounded-xl border border-default-200 bg-default-50 dark:bg-slate-800/40 p-4 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-top gap-3">
                <div aria-hidden className="shrink-0 text-2xl">
                  🧸
                </div>
                <div className="min-w-0">
                  <p className="font-semibold leading-tight">
                    {product.user.name}&apos;s Style Guide
                    <span className="ml-2 align-middle text-[10px] tracking-wide font-semibold bg-amber-400/90 text-black px-2 py-0.5 rounded-full">
                      PREMIUM
                    </span>
                  </p>
                  <p className="text-xs text-foreground/60 mt-0.5">
                    Follow {product.user.name.split(" ")[0]} to get inspired by their style
                  </p>
                </div>
              </div>
              <FollowButton
                label={`Follow ${product.user.name.split(" ")[0]}`}
                sellerId={product.user.userId}
              />
            </div>

            {/* More from seller (now inside container, above narrative) */}
            {sellerHasMore && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {sellerItems.map((it) => (
                  <ProductMiniCard key={it.id} item={it} />
                ))}
              </div>
            )}
            {sellerProfile ? (
              <div className="space-y-3">
                <div className="bg-default-100/60 dark:bg-slate-800/60 rounded-lg p-3">
                  <div className="font-semibold text-sm mb-1">
                    Based on {product.user.name}&apos;s style:
                  </div>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    {sellerProfile.preferences.styleKeywords.length > 0 && (
                      <li>
                        Style: {sellerProfile.preferences.styleKeywords.slice(0, 6).join(", ")}
                      </li>
                    )}
                    {sellerProfile.preferences.preferredMaterials.length > 0 && (
                      <li>
                        Materials:
                        {sellerProfile.preferences.preferredMaterials.slice(0, 5).join(", ")}
                      </li>
                    )}
                    {sellerProfile.preferences.favoriteBrands.length > 0 && (
                      <li>
                        Brands: {sellerProfile.preferences.favoriteBrands.slice(0, 5).join(", ")}
                      </li>
                    )}
                    {sellerProfile.preferences.designOrientation?.length ? (
                      <li>
                        Orientation:
                        {sellerProfile.preferences.designOrientation.slice(0, 4).join(", ")}
                      </li>
                    ) : null}
                    {sellerProfile.preferences.valueFocus?.length ? (
                      <li>Focus: {sellerProfile.preferences.valueFocus.slice(0, 4).join(", ")}</li>
                    ) : null}
                  </ul>
                </div>
                {sellerProfile.preferences.insights?.[0] && (
                  <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm flex gap-2">
                    <span aria-hidden>💡</span>
                    <span className="leading-snug">{sellerProfile.preferences.insights[0]}</span>
                  </div>
                )}
                <div className="flex flex-wrap gap-2 text-xs text-foreground/70">
                  {product.smokeFree && (
                    <span className="px-2 py-1 rounded-md bg-default-100">Smoke-free</span>
                  )}
                  {product.petFree && (
                    <span className="px-2 py-1 rounded-md bg-default-100">Pet-free</span>
                  )}
                  {product.perfumeFree && (
                    <span className="px-2 py-1 rounded-md bg-default-100">Perfume-free</span>
                  )}
                  {product.bundleDeal && (
                    <span className="px-2 py-1 rounded-md bg-default-100">Bundle deal</span>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-sm text-foreground/60">No style profile available yet.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
