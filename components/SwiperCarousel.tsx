"use client";

import { memo, useState, useCallback, useRef, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCreative, Navigation, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/effect-creative";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../styles/swiper-carousel.css";

interface SwiperCarouselProps {
  images: { src: string; alt: string }[];
  className?: string;
  imageClassName?: string;
  // Navigation style can be 'arrows' or 'counter'
  // 'arrows' shows navigation arrows, 'counter' shows a counter indicator
  // 'arrows' is the default style and has arrows only for lg screen
  // 'counter' is useful for showing the current slide out of total slides
  navigationStyle?: 'arrows' | 'counter';
  creativeEffect?: 'default' | 'slide-rotate' | 'depth-slide' | 'rotate-3d' | 'scale-rotate' | 'book-flip';
  onImageClick?: (index: number) => void;
}

const SwiperCarousel = memo(function SwiperCarousel({ 

  images,
  className = "",
  imageClassName = "",
  navigationStyle = "arrows",
  creativeEffect = "default",
  onImageClick,
}: SwiperCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const imagesLength = useMemo(() => images.length, [images]);
  const swiperRef = useRef<SwiperType | null>(null);
  const uniqueId = useRef(`swiper-${Math.random().toString(36).substr(2, 9)}`);

  // Cleanup swiperRef on unmount (defensive, Swiper handles this but best practice)
  // No event listeners, but clear ref
  // useEffect not strictly needed, but shown for best practice
  // useEffect(() => () => { swiperRef.current = null; }, []);

  if (imagesLength === 0) return null;

  const handleSlideChange = useCallback((swiper: SwiperType) => {
    setActiveIndex(swiper.realIndex);
  }, []);

  // Memoize creativeEffects object so it's not recreated every render
  const creativeEffects = useMemo(() => ({
    default: {
      prev: { shadow: true, translate: [0, 0, -400] },
      next: { translate: ["100%", 0, 0] },
    },
    "slide-rotate": {
      prev: { shadow: true, translate: ["-125%", 0, -800], rotate: [0, 0, -90] },
      next: { shadow: true, translate: ["125%", 0, -800], rotate: [0, 0, 90] },
    },
    "depth-slide": {
      prev: { shadow: true, translate: ["-20%", 0, -1] },
      next: { translate: ["100%", 0, 0] },
    },
    "rotate-3d": {
      prev: { shadow: true, translate: [0, 0, -800], rotate: [180, 0, 0] },
      next: { shadow: true, translate: [0, 0, -800], rotate: [-180, 0, 0] },
    },
    "scale-rotate": {
      prev: { shadow: true, translate: ["-120%", 0, -500] },
      next: { shadow: true, translate: ["120%", 0, -500] },
    },
    "book-flip": {
      prev: { shadow: true, origin: "left center", translate: ["-5%", 0, -200], rotate: [0, 100, 0] },
      next: { origin: "right center", translate: ["5%", 0, -200], rotate: [0, -100, 0] },
    },
  }), []);

  // Memoize swiperConfig for stable reference
  const swiperConfig = useMemo(() => ({
    modules: [EffectCreative, Navigation, Pagination],
    effect: "creative" as const,
    creativeEffect: creativeEffects[creativeEffect],
    grabCursor: true,
    loop: imagesLength > 1,
    speed: 600,
    onSlideChange: handleSlideChange,
    onSwiper: (swiper: SwiperType) => {
      swiperRef.current = swiper;
    },
    navigation:
      navigationStyle === "arrows" && imagesLength > 1
        ? {
            nextEl: `.${uniqueId.current}-next`,
            prevEl: `.${uniqueId.current}-prev`,
          }
        : false,
    pagination:
      navigationStyle === "arrows" && imagesLength > 1
        ? {
            el: ".swiper-pagination",
            clickable: true,
            bulletClass: "swiper-pagination-bullet",
            bulletActiveClass: "swiper-pagination-bullet-active",
            dynamicBullets: true,
            dynamicMainBullets: 5,
          }
        : false,
  }), [creativeEffect, creativeEffects, imagesLength, navigationStyle, handleSlideChange]);

  return (
    <div
      className={`relative overflow-hidden swiper-carousel-container bg-transparent ${
        navigationStyle === "counter" ? "counter-style" : ""
      } ${className}`}
      style={{background: 'transparent'}}
    >
      <Swiper {...swiperConfig} style={{background: 'transparent'}}>
        {images.map((img, idx) => (
          <SwiperSlide key={idx} className="h-full w-full flex items-center justify-center bg-transparent" style={{background: 'transparent'}}>
            <div className="w-full h-full relative flex items-center justify-center bg-transparent" style={{background: 'transparent'}}>
              <img
                src={img.src}
                alt={img.alt}
                className={imageClassName || "w-full h-full object-cover"}
                loading="lazy"
                onClick={() => onImageClick && onImageClick(idx)}
              />
            </div>
          </SwiperSlide>
        ))}
        {/* Counter indicator - only show if more than 1 image and counter style */}
        {imagesLength > 1 && navigationStyle === "counter" && (
          <div className="absolute bottom-3 right-3 px-2 py-1 rounded-full bg-white/60 backdrop-blur-md text-black text-xs font-medium z-20 swiper-counter">
            {activeIndex + 1} / {imagesLength}
          </div>
        )}
        {/* Counter indicator for arrows style, only on screens smaller than lg */}
        {imagesLength > 1 && navigationStyle === "arrows" && (
          <div className="absolute bottom-3 right-3 px-2 py-1 rounded-full bg-white/60 backdrop-blur-md text-black text-xs font-medium z-20 swiper-counter lg:hidden">
            {activeIndex + 1} / {imagesLength}
          </div>
        )}
        {/* Pagination for arrows style, only on lg and up screens */}
        {imagesLength > 1 && navigationStyle === "arrows" && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 hidden lg:flex">
            <div className="swiper-pagination" />
          </div>
        )}
      </Swiper>
      {/* Swiper navigation arrows - only show if arrows style and more than 1 image */}
      {imagesLength > 1 && navigationStyle === "arrows" && (
        <div className="hidden lg:flex absolute inset-0 pointer-events-none">
          <button
            className={`swiper-button-prev ${uniqueId.current}-prev pointer-events-auto`}
            aria-label="Previous image"
            onClick={(e) => {
              e.stopPropagation();
              swiperRef.current?.slidePrev();
            }}
            onTouchStart={(e) => {
              e.stopPropagation();
              swiperRef.current?.slidePrev();
            }}
          />
          <button
            className={`swiper-button-next ${uniqueId.current}-next pointer-events-auto`}
            aria-label="Next image"
            onClick={(e) => {
              e.stopPropagation();
              swiperRef.current?.slideNext();
            }}
            onTouchStart={(e) => {
              e.stopPropagation();
              swiperRef.current?.slideNext();
            }}
          />
        </div>
      )}
    </div>
  );
});

export default SwiperCarousel;
