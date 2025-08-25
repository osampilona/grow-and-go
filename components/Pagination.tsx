"use client";

import { Button } from "@heroui/react";

type PaginationProps = {
  total: number;
  visible: number;
  setVisible: (n: number) => void;
  initial: number;
  step?: number;
  label?: string; // e.g. "listings", "reviews"
  showCountText?: boolean;
};

/**
 * Reusable incremental pagination control.
 * - Clicking "Show more" reveals `step` more items until all are visible.
 * - When all are visible, the button switches to "Show less" and collapses to `initial`.
 */
export default function Pagination({
  total,
  visible,
  setVisible,
  initial,
  step = 10,
  label = "items",
  showCountText = true,
}: PaginationProps) {
  if (total <= initial) return null;

  const atEnd = visible >= total;
  const next = () => setVisible(atEnd ? initial : Math.min(visible + step, total));

  return (
    <div className="flex flex-col items-center gap-2">
      {showCountText && (
        <span className="text-sm text-foreground/60">
          Showing {Math.min(visible, total)} of {total}
        </span>
      )}
      <Button radius="full" size="sm" variant="bordered" onPress={next}>
        {atEnd ? `Show less ${label}` : `Show more ${label}`}
      </Button>
    </div>
  );
}
