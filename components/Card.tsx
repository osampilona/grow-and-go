import { memo, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Avatar, Button, Skeleton } from "@heroui/react";

import SwiperCarousel from "./SwiperCarousel";
import FavoriteToggleButton from "./FavoriteToggleButton";

import { useLikeStore } from "@/stores/likeStore";

export type CardItem = {
  id: string;
  title: string;
  user: {
    userId: string;
    name: string;
    avatar: string;
  };
  price: string;
  rating: number;
  condition: "brand-new" | "like-new" | "very-good" | "good" | "fair";
  images: string[];
};

type CardProps = {
  item: CardItem;
  useSwiper?: boolean;
  swiperEffect?:
    | "default"
    | "slide-rotate"
    | "depth-slide"
    | "rotate-3d"
    | "scale-rotate"
    | "book-flip";
  isLoading?: boolean;
};

const Card = memo(function Card({
  item,
  useSwiper: _useSwiper = true,
  swiperEffect = "scale-rotate",
  isLoading = false,
}: CardProps) {
  const router = useRouter();
  const [showSkeleton, setShowSkeleton] = useState(true);
  // Global like state (used by FavoriteToggleButton, but we keep store access for future UI if needed)

  useLikeStore((s) => !!s.likedIds[item.id]);

  useEffect(() => {
    const timer = setTimeout(() => setShowSkeleton(false), 1000);

    return () => clearTimeout(timer);
  }, []);

  const getConditionLabel = (condition: CardItem["condition"]) => {
    switch (condition) {
      case "brand-new":
        return "Brand New";
      case "like-new":
        return "Like New";
      case "very-good":
        return "Very Good";
      case "good":
        return "Good";
      case "fair":
        return "Fair";
      default:
        return condition;
    }
  };

  const getConditionColor = (condition: CardItem["condition"]) => {
    switch (condition) {
      case "brand-new":
        return "bg-green-100 text-green-700 border-green-300";
      case "like-new":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "very-good":
        return "bg-purple-100 text-purple-700 border-purple-300";
      case "good":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "fair":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  // Handler for card click (excluding avatar/name)
  const handleCardClick = (_e?: React.MouseEvent) => {
    router.push(`/products/${item.id}`);
  };

  // Handler for user click removed (Link handles navigation)

  const handleCardKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleCardClick();
    }
  };

  if (isLoading || showSkeleton) {
    // Custom skeleton layout inspired by HeroUI docs
    return (
      <div className="w-full mx-auto rounded-t-2xl overflow-hidden bg-transparent p-4 space-y-5">
        <Skeleton className="rounded-2xl">
          <div className="h-80 w-full rounded-2xl bg-default-300" />
        </Skeleton>
        <div className="space-y-3">
          <Skeleton className="w-3/5 rounded-lg">
            <div className="h-4 w-3/5 rounded-lg bg-default-200" />
          </Skeleton>
          <Skeleton className="w-4/5 rounded-lg">
            <div className="h-4 w-4/5 rounded-lg bg-default-200" />
          </Skeleton>
          <Skeleton className="w-2/5 rounded-lg">
            <div className="h-4 w-2/5 rounded-lg bg-default-300" />
          </Skeleton>
        </div>
      </div>
    );
  }

  return (
    <button
      aria-label={`Open ${item.title}`}
      className="group w-full mx-auto rounded-t-2xl overflow-hidden bg-transparent cursor-pointer text-left"
      type="button"
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
    >
      <div className="relative">
        <SwiperCarousel
          className="w-full h-80 rounded-2xl"
          creativeEffect={swiperEffect}
          images={item.images.map((src, idx) => ({ src, alt: `${item.title} image ${idx + 1}` }))}
        />
        {/* Condition badge in top left */}
        <span
          className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium backdrop-blur-md z-30 ${getConditionColor(item.condition)}`}
        >
          {getConditionLabel(item.condition)}
        </span>
        {/* Heart button in top right */}
        <FavoriteToggleButton
          ariaLabel="Toggle like"
          className="absolute top-3 right-3 z-30"
          itemId={item.id}
        />
      </div>
      <div className="flex flex-col gap-2 mt-2">
        {/* Title */}
        <h3 className="text-base font-semibold text-foreground truncate">{item.title}</h3>
        {/* User info */}
        <div className="flex items-center justify-between gap-2">
          <Link
            aria-label={`See ${item.user.name}’s profile`}
            className="flex items-center gap-2 cursor-pointer"
            href={`/user/${item.user.userId}`}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Avatar size="sm" src={item.user.avatar} />
            <p className="text-foreground/70 text-sm font-medium">{item.user.name}</p>
          </Link>
          <Button
            disableAnimation
            disableRipple
            aria-label="Add to cart"
            className="inline-flex font-semibold transition-none cta-outline"
            color="default"
            radius="full"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              // TODO: wire to cart store/action when available
            }}
          >
            + Add to cart
          </Button>
        </div>
        {/* Price - moved to bottom */}
        <div className="text-xl font-bold text-foreground">{item.price}</div>
      </div>
    </button>
  );
});

export default Card;
