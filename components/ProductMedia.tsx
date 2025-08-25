"use client";

import clsx from "clsx";

import FavoriteToggleButton from "@/components/FavoriteToggleButton";
import SwiperCarousel from "@/components/SwiperCarousel";

type ProductMediaProps = {
  productId: string;
  productTitle: string;
  images: string[];
  onImageClick?: () => void;
  className?: string; // optional wrapper override
  showFavorite?: boolean; // show heart toggle (default true)
  frameColorClass?: string; // outer wrapper background utility (default bg-blue-500)
  innerColorClass?: string; // inner container background utility (default same as frame)
};

export default function ProductMedia({
  productId,
  productTitle,
  images,
  onImageClick,
  className,
  showFavorite = true,
  frameColorClass = "bg-blue-500",
  innerColorClass,
}: ProductMediaProps) {
  const prepared = images.map((src, idx) => ({
    src,
    alt: `${productTitle} image ${idx + 1}`,
  }));

  const resolvedInnerColor = innerColorClass || frameColorClass;
  const wrapperClass = clsx(
    "flex items-center justify-center rounded-3xl w-full p-4 sm:p-8",
    frameColorClass,
    className
  );

  return (
    <div className={wrapperClass}>
      <div
        className={clsx(
          "relative w-full h-80 lg:h-[28rem] aspect-square lg:aspect-auto rounded-2xl overflow-hidden flex items-center justify-center",
          resolvedInnerColor
        )}
      >
        {showFavorite && (
          <FavoriteToggleButton
            stopPropagation
            ariaLabel="Toggle like"
            className="absolute top-3 right-3 z-30"
            itemId={productId}
          />
        )}
        <SwiperCarousel
          className="w-full h-full rounded-2xl"
          images={prepared}
          onImageClick={onImageClick}
        />
      </div>
    </div>
  );
}
