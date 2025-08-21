"use client";
import Image from "next/image";
import clsx from "clsx";

interface IconMessageProps {
  iconSrc?: string;
  message: string;
  className?: string;
  iconSize?: number;
}

export function IconMessage({
  iconSrc = "/empty-box.svg",
  message,
  className,
  iconSize = 56,
}: IconMessageProps) {
  return (
    <div className={clsx("flex items-center gap-4", className)}>
      <span aria-hidden className="inline-flex items-center justify-center">
        <Image
          alt="Empty"
          className="opacity-80"
          height={iconSize}
          src={iconSrc}
          width={iconSize}
        />
      </span>
      <p className="font-semibold text-base">{message}</p>
    </div>
  );
}
