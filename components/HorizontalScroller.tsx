"use client";
import { ReactNode } from "react";

export function HorizontalScroller({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={
        "flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory [-webkit-overflow-scrolling:touch] " +
        className
      }
    >
      {children}
    </div>
  );
}
