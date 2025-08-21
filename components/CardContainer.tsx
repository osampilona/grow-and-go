"use client";
import { ReactNode } from "react";
import clsx from "clsx";

interface CardContainerProps {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}

export function CardContainer({ children, className, padded = true }: CardContainerProps) {
  return (
    <div
      className={clsx(
        "rounded-xl border border-default-200 bg-white dark:bg-slate-800/60",
        padded && "p-4 space-y-4",
        className
      )}
    >
      {children}
    </div>
  );
}
