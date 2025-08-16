"use client";

import type { FeedItem } from "@/data/mock/feed";

import { memo } from "react";
import { Skeleton } from "@heroui/react";
import Link from "next/link";
import Image from "next/image";

// Reusable mini product card used in suggestion grids, carousels, etc.
// Keeps layout stable (fixed image size) and truncates long titles.
// Extend via props later (e.g. badge, actions, analytics) without touching callers.
export interface ProductMiniCardProps {
  item: FeedItem;
  className?: string;
  hrefOverride?: string; // allow custom destination (e.g. tracking wrapper or variant page)
  prefetch?: boolean; // can disable prefetch when rendering many cards
}

// HeroUI skeleton variant matching card layout
export function ProductMiniCardSkeleton({
  className = "",
  prefetch = false,
}: {
  className?: string;
  prefetch?: boolean;
}) {
  return (
    <div
      aria-busy="true"
      aria-label="Loading product"
      className={`flex gap-3 items-center rounded-2xl p-2 ${className}`}
      data-prefetch={prefetch ? true : undefined}
    >
      <Skeleton className="w-16 h-16 rounded-xl" />
      <div className="flex-1 min-w-0 space-y-2">
        <Skeleton className="h-3 w-32 rounded" />
        <Skeleton className="h-3 w-20 rounded" />
      </div>
    </div>
  );
}

export const ProductMiniCard = memo(function ProductMiniCard({
  item,
  className = "",
  hrefOverride,
  prefetch = false,
}: ProductMiniCardProps) {
  return (
    <Link
      className={`flex gap-3 items-center rounded-2xl p-2 hover:bg-default-100 dark:hover:bg-slate-800/60 ${className}`}
      href={hrefOverride || `/products/${item.id}`}
      prefetch={prefetch}
    >
      <Image
        alt={item.title}
        className="w-16 h-16 rounded-xl object-cover"
        height={64}
        src={item.images[0]}
        width={64}
      />
      <div className="min-w-0">
        <div className="truncate font-semibold">{item.title}</div>
        <div className="text-sm text-foreground/70">{item.price}</div>
      </div>
    </Link>
  );
});

export default ProductMiniCard;
