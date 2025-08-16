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
};

export default function ProductMedia({
  productId,
  productTitle,
  images,
  onImageClick,
  className,
}: ProductMediaProps) {
  const prepared = images.map((src, idx) => ({
    src,
    alt: `${productTitle} image ${idx + 1}`,
  }));

  const wrapperClass = clsx(
    "flex items-center justify-center bg-blue-500 rounded-3xl w-full p-4 sm:p-8",
    className
  );

  return (
    <div className={wrapperClass}>
      <div className="relative w-full h-80 lg:h-[28rem] aspect-square lg:aspect-auto rounded-2xl overflow-hidden flex items-center justify-center bg-blue-500">
        <FavoriteToggleButton
          stopPropagation
          ariaLabel="Toggle like"
          className="absolute top-3 right-3 z-30"
          itemId={productId}
        />
        <SwiperCarousel
          className="w-full h-full rounded-2xl"
          images={prepared}
          onImageClick={onImageClick}
        />
      </div>
    </div>
  );
}
