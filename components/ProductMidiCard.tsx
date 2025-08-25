"use client";

import type { FeedItem } from "@/data/mock/feed";

import Link from "next/link";
import { memo } from "react";
import { IoCheckmark } from "react-icons/io5";

import SwiperCarousel from "./SwiperCarousel";

export interface ProductMidiCardProps {
  item: FeedItem;
  selected?: boolean;
  onToggle?: () => void; // toggle selection (used in bundle)
  className?: string;
}

// A mid-sized product card inspired by the provided design mock.
// - Rounded image container with subtle shadow
// - Top-right favorite heart
// - Pagination dots (based on images length)
// - Title & emphasized price
// - Bottom-right circular arrow button (navigates to product)
// - Optional selectable state for bundle UI
const ProductMidiCard = memo(function ProductMidiCard({
  item,
  selected = false,
  onToggle,
  className = "",
}: ProductMidiCardProps) {
  return (
    <div className={`relative rounded-3xl p-2 ${className}`}>
      {/* Entire card navigates to product */}
      <Link
        aria-label={`Open ${item.title}`}
        className={`group relative block w-72 shrink-0 rounded-3xl overflow-hidden shadow-sm transition-all focus:outline-none ${
          selected ? "ring-2 ring-warning shadow-md" : "ring-1 ring-default-200"
        }`}
        href={`/products/${item.id}`}
      >
        <div className="relative bg-white/70 dark:bg-slate-900/50 rounded-3xl">
          {/* Image carousel (same component as Card.tsx) */}
          <div className="relative">
            <SwiperCarousel
              className="w-full h-48 rounded-2xl"
              creativeEffect="scale-rotate"
              imageClassName="object-cover"
              images={item.images.map((src, idx) => ({
                src,
                alt: `${item.title} image ${idx + 1}`,
              }))}
              navigationStyle="arrows"
            />
            {/* Selection badge (top-right) */}
            {onToggle && (
              <button
                aria-label={selected ? "Remove from bundle" : "Add to bundle"}
                aria-pressed={selected}
                className={`absolute right-3 top-3 z-20 inline-flex h-7 w-7 items-center justify-center rounded-full border text-xs font-bold shadow-sm ${
                  selected
                    ? "bg-foreground text-background border-foreground"
                    : "bg-background/90 text-foreground/70 border-default-300"
                }`}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggle?.();
                }}
              >
                {selected ? <IoCheckmark /> : ""}
              </button>
            )}
          </div>

          {/* Text content */}
          <div className="px-3 pb-4 pt-2">
            <div className="truncate text-base font-medium text-foreground">{item.title}</div>
            <div className="text-xl font-bold text-warning">{item.price}</div>
          </div>
        </div>
      </Link>
    </div>
  );
});

export default ProductMidiCard;
