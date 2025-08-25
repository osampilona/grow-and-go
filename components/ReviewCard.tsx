"use client";

import type { Review } from "@/types/seller";

import Link from "next/link";
import { Avatar } from "@heroui/react";

type Props = {
  review: Review;
};

function Star({ filled }: { filled: boolean }) {
  return (
    <svg
      aria-hidden
      className={`h-4 w-4 ${filled ? "text-yellow-500" : "text-foreground/30"}`}
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.175 0l-3.38 2.455c-.784.57-1.838-.197-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.049 9.393c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.966z" />
    </svg>
  );
}

export default function ReviewCard({ review }: Props) {
  const date = new Date(review.createdAt);
  const dateStr = isNaN(date.getTime())
    ? review.createdAt
    : date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });

  return (
    <article className="rounded-2xl border border-default-200/60 bg-content1 p-4 flex flex-col gap-3">
      <div className="flex items-start gap-3">
        <Avatar alt={review.reviewer.name} size="sm" src={review.reviewer.avatar} />
        <div className="flex-1">
          <div className="flex items-center justify-between gap-2">
            <div className="font-semibold">{review.reviewer.name}</div>
            <time className="text-foreground/60 text-xs">{dateStr}</time>
          </div>
          <div className="mt-1 flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} filled={i < Math.round(review.rating)} />
            ))}
            <span className="ml-1 text-xs text-foreground/60">{review.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
      <p className="text-sm leading-relaxed text-foreground/90">{review.comment}</p>
      {review.itemId && (
        <div>
          <Link
            className="text-sm text-primary hover:underline"
            href={`/products/${review.itemId}`}
          >
            View item
          </Link>
        </div>
      )}
    </article>
  );
}
