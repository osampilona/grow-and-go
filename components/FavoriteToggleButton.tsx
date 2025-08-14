"use client";

import { memo } from "react";
import clsx from "clsx";

import { useLikeStore } from "@/stores/likeStore";
import { ENABLE_FAVORITES_SYNC } from "@/utils/featureFlags";

export type FavoriteToggleButtonProps = {
  itemId: string;
  className?: string;
  filledIconClassName?: string;
  outlineIconClassName?: string;
  ariaLabel?: string;
  stopPropagation?: boolean;
  disabled?: boolean;
};

const FavoriteToggleButton = memo(function FavoriteToggleButton({
  itemId,
  className,
  filledIconClassName = "w-6 h-6 text-red-500",
  outlineIconClassName = "w-6 h-6 text-black",
  ariaLabel = "Toggle like",
  stopPropagation = true,
  disabled = false,
}: FavoriteToggleButtonProps) {
  const liked = useLikeStore((s) => !!s.likedIds[itemId]);
  const toggleLike = useLikeStore((s) => s.toggleLike);
  const isDisabled = disabled || !itemId;

  return (
    <button
      aria-disabled={isDisabled}
      aria-label={ariaLabel}
      className={clsx(
        "p-1.5 rounded-full bg-white/60 backdrop-blur-md shadow-md border border-divider transition hover:bg-white/80 heart-button",
        { "opacity-50 cursor-not-allowed": isDisabled },
        className
      )}
      type="button"
      onClick={async (e) => {
        if (isDisabled) return;
        if (stopPropagation) e.stopPropagation();
        const wasLiked = liked;

        toggleLike(itemId); // optimistic
        try {
          if (ENABLE_FAVORITES_SYNC) {
            await fetch("/api/favorites", {
              method: wasLiked ? "DELETE" : "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id: itemId }),
            });
          }
        } catch {
          // revert on error
          toggleLike(itemId);
        }
      }}
    >
      {liked ? (
        <svg
          className={filledIconClassName}
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M11.645 20.91l-.007-.003-.022-.01a15.247 15.247 0 01-.383-.173 25.18 25.18 0 01-4.244-2.533C4.688 16.27 2.25 13.614 2.25 10.5 2.25 7.42 4.67 5 7.75 5c1.6 0 3.204.658 4.25 1.856A5.748 5.748 0 0116.25 5c3.08 0 5.5 2.42 5.5 5.5 0 3.114-2.438 5.77-4.739 7.69a25.175 25.175 0 01-4.244 2.533 15.247 15.247 0 01-.383.173l-.022.01-.007.003a.75.75 0 01-.586 0z" />
        </svg>
      ) : (
        <svg
          className={outlineIconClassName}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16.5 3.75a5.25 5.25 0 00-4.5 2.472A5.25 5.25 0 007.5 3.75 5.25 5.25 0 003 9c0 7.25 9 11.25 9 11.25s9-4 9-11.25a5.25 5.25 0 00-5.25-5.25z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
});

export default FavoriteToggleButton;
