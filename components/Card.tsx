import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, Skeleton, Button } from "@heroui/react";
import { memo } from "react";
import SwiperCarousel from "./SwiperCarousel";
import { useLikeStore } from "@/stores/likeStore";
import { ENABLE_FAVORITES_SYNC } from "@/utils/featureFlags";

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
  condition: 'brand-new' | 'like-new' | 'very-good' | 'good' | 'fair';
  images: string[];
};

type CardProps = {
  item: CardItem;
  useSwiper?: boolean;
  swiperEffect?: 'default' | 'slide-rotate' | 'depth-slide' | 'rotate-3d' | 'scale-rotate' | 'book-flip';
  isLoading?: boolean;
};



const Card = memo(function Card({ item, useSwiper = true, swiperEffect = 'scale-rotate', isLoading = false }: CardProps) {
  const router = useRouter();
  const [showSkeleton, setShowSkeleton] = useState(true);
  // Global like state
  const liked = useLikeStore((s) => !!s.likedIds[item.id]);
  const toggleLike = useLikeStore((s) => s.toggleLike);
  useEffect(() => {
    const timer = setTimeout(() => setShowSkeleton(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const getConditionLabel = (condition: CardItem['condition']) => {
    switch (condition) {
      case 'brand-new':
        return 'Brand New';
      case 'like-new':
        return 'Like New';
      case 'very-good':
        return 'Very Good';
      case 'good':
        return 'Good';
      case 'fair':
        return 'Fair';
      default:
        return condition;
    }
  };

  const getConditionColor = (condition: CardItem['condition']) => {
    switch (condition) {
      case 'brand-new':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'like-new':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'very-good':
        return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'good':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'fair':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  // Handler for card click (excluding avatar/name)
  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    router.push(`/products/${item.id}`);
  };

  // Handler for user click
  const handleUserClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/user/${item.user.userId}`);
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
    <div
      className="group w-full mx-auto rounded-t-2xl overflow-hidden bg-transparent cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative">
        <SwiperCarousel 
          images={item.images.map((src, idx) => ({ src, alt: `${item.title} image ${idx + 1}` }))}
          className="w-full h-80 rounded-2xl"
          creativeEffect={swiperEffect}
        />
        {/* Condition badge in top left */}
        <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium backdrop-blur-md z-30 ${getConditionColor(item.condition)}`}>
          {getConditionLabel(item.condition)}
        </div>
        {/* Heart button in top right */}
        <button
          className="absolute top-3 right-3 p-1.5 rounded-full bg-white/60 backdrop-blur-md shadow-md border border-divider transition hover:bg-white/80 z-30"
          onClick={async (e) => {
            e.stopPropagation();
            const wasLiked = liked;
            toggleLike(item.id); // optimistic
            try {
              if (ENABLE_FAVORITES_SYNC) {
                await fetch('/api/favorites', {
                  method: wasLiked ? 'DELETE' : 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ id: item.id }),
                });
              }
            } catch {
              // revert on error
              toggleLike(item.id);
            }
          }}
          aria-label="Toggle like"
        >
          {liked ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-red-500">
              <path d="M11.645 20.91l-.007-.003-.022-.01a15.247 15.247 0 01-.383-.173 25.18 25.18 0 01-4.244-2.533C4.688 16.27 2.25 13.614 2.25 10.5 2.25 7.42 4.67 5 7.75 5c1.6 0 3.204.658 4.25 1.856A5.748 5.748 0 0116.25 5c3.08 0 5.5 2.42 5.5 5.5 0 3.114-2.438 5.77-4.739 7.69a25.175 25.175 0 01-4.244 2.533 15.247 15.247 0 01-.383.173l-.022.01-.007.003a.75.75 0 01-.586 0z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-black">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75a5.25 5.25 0 00-4.5 2.472A5.25 5.25 0 007.5 3.75 5.25 5.25 0 003 9c0 7.25 9 11.25 9 11.25s9-4 9-11.25a5.25 5.25 0 00-5.25-5.25z" />
            </svg>
          )}
        </button>
      </div>
      <div className="flex flex-col gap-2 mt-2">
        {/* Title */}
        <h3 className="text-base font-semibold text-foreground truncate">{item.title}</h3>
        {/* User info */}
        <div className="flex items-center justify-between gap-2">
          <span onClick={handleUserClick} className="flex items-center gap-2 cursor-pointer">
            <Avatar size="sm" src={item.user.avatar} />
            <p className="text-foreground/70 text-sm font-medium">{item.user.name}</p>
          </span>
              <Button
                color="default"
                size="sm"
                radius="full"
                aria-label="Add to cart"
                disableAnimation
                disableRipple
                className="inline-flex font-semibold transition-none cta-outline"
                onClick={(e) => {
                  e.stopPropagation();
                  // TODO: wire to cart store/action when available
                }}
              >
                + Add to cart
              </Button>
        </div>
        {/* Price - moved to bottom */}
        <div className="text-xl font-bold text-foreground">
          {item.price}
        </div>
      </div>
    </div>
  );
});

export default Card;
