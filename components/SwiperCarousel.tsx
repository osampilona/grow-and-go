"use client";

import { memo, useState, useCallback, useRef, useMemo, useEffect, useId } from "react";
import Image from "next/image";
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
  // Optional callback to allow parent to trigger manual updates (e.g., after a modal transition)
  onReady?: (api: { update: () => void; swiper: SwiperType }) => void;
  /** Disable visibility observer / bullet repair logic (mostly for testing) */
  disableVisibilityOptimization?: boolean;
  ariaLabel?: string;
  aspectRatio?: string; // e.g. "16/9"
  keyboard?: boolean;
  showPlaceholder?: boolean;
}

const SwiperCarousel = memo(function SwiperCarousel({ 

  images,
  className = "",
  imageClassName = "",
  navigationStyle = "arrows",
  creativeEffect = "default",
  onImageClick,
  onReady,
  disableVisibilityOptimization = false,
  ariaLabel = "Image carousel",
  aspectRatio,
  keyboard = true,
  showPlaceholder = true,
}: SwiperCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const imagesLength = useMemo(() => images.length, [images]);
  const swiperRef = useRef<SwiperType | null>(null);
  // Stable, SSR-safe id (same on server & client) avoids hydration mismatches vs Math.random()
  const reactId = useId();
  const uniqueId = useMemo(() => `swiper-${reactId.replace(/[:]/g, "-")}`, [reactId]);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [firstLoaded, setFirstLoaded] = useState(!showPlaceholder);

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
    modules: navigationStyle === "arrows" && imagesLength > 1 ? [EffectCreative, Navigation, Pagination] : [EffectCreative],
    effect: "creative" as const,
    creativeEffect: creativeEffects[creativeEffect],
    grabCursor: true,
    loop: imagesLength > 1,
    speed: 600,
  observer: true,
  observeParents: true,
    onSlideChange: handleSlideChange,
    onSwiper: (swiper: SwiperType) => {
      swiperRef.current = swiper;
      // Defer the first update to ensure correct sizing if initially hidden
      requestAnimationFrame(() => {
        swiper.update();
        swiper.pagination?.render();
        swiper.pagination?.update();
        onReady?.({
          update: () => {
            if (!swiperRef.current) return;
            swiperRef.current.update();
            swiperRef.current.pagination?.render();
            swiperRef.current.pagination?.update();
          },
          swiper,
        });
      });
    },
    navigation:
      navigationStyle === "arrows" && imagesLength > 1
        ? {
            nextEl: `.${uniqueId}-next`,
            prevEl: `.${uniqueId}-prev`,
          }
        : false,
    pagination:
      navigationStyle === "arrows" && imagesLength > 1
        ? {
      // Use a unique pagination element per instance to avoid collisions / duplication on remounts
  el: `.${uniqueId}-pagination`,
            clickable: true,
            bulletClass: "swiper-pagination-bullet",
            bulletActiveClass: "swiper-pagination-bullet-active",
            dynamicBullets: true,
            dynamicMainBullets: 5,
          }
        : false,
  }), [creativeEffect, creativeEffects, imagesLength, navigationStyle, handleSlideChange, onReady, uniqueId]);

  // ResizeObserver to keep Swiper layout in sync with container size changes (e.g., modal open animations)
  useEffect(() => {
    if (!swiperRef.current) return;
    const el = swiperRef.current.el as HTMLElement | null;
    if (!el) return;
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(() => {
        if (!swiperRef.current) return;
        swiperRef.current.update();
        swiperRef.current.pagination?.update();
      });
      ro.observe(el);
      return () => ro.disconnect();
    }
  }, [imagesLength]);

  // Visibility + bullet repair logic (replaces former polling interval)
  useEffect(() => {
    if (disableVisibilityOptimization) return;
    const swiper = swiperRef.current;
    if (!swiper) return;
    const el = swiper.el as HTMLElement | null;
    if (!el) return;

    let repaired = false;
    const attemptRepair = () => {
      if (repaired) return;
      const bullets = el.querySelectorAll('.swiper-pagination-bullet');
      if (bullets.length) {
        const first = bullets[0] as HTMLElement;
        if (first.offsetWidth === 0) {
          swiper.update();
          swiper.pagination?.render();
          swiper.pagination?.update();
        }
        repaired = true; // Only attempt once after visible
      }
    };

    // If already visible run immediately
    const rect = el.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      attemptRepair();
      return; // nothing else needed
    }

    // Otherwise observe becoming visible (IntersectionObserver preferred)
    if (typeof IntersectionObserver !== 'undefined') {
      const io = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            attemptRepair();
            io.disconnect();
            break;
          }
        }
      }, { threshold: 0.01 });
      io.observe(el);
      return () => io.disconnect();
    }
  }, [disableVisibilityOptimization]);

  return (
    <div
      ref={rootRef}
      className={`relative overflow-hidden swiper-carousel-container bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 rounded-sm ${navigationStyle === "counter" ? "counter-style" : ""} ${className}`}
      style={{background: 'transparent'}}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      aria-live="off"
      tabIndex={keyboard ? 0 : -1}
      onKeyDown={(e) => {
        if (!keyboard) return;
        if (e.key === 'ArrowRight') { e.preventDefault(); swiperRef.current?.slideNext(); }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); swiperRef.current?.slidePrev(); }
      }}
    >
      {aspectRatio && (
        <div
          aria-hidden="true"
          style={{ position: 'relative', width: '100%', paddingTop: (() => { const p=aspectRatio.split('/'); if(p.length===2){ const w=parseFloat(p[0]); const h=parseFloat(p[1]); if(w>0&&h>0) return `${(h/w)*100}%`; } return '56.25%'; })() }}
        />
      )}
      {showPlaceholder && !firstLoaded && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-gray-200/60 to-gray-300/40 dark:from-slate-700/40 dark:to-slate-600/30 rounded-sm flex items-center justify-center text-xs text-gray-500 dark:text-slate-400">
          Loading images...
        </div>
      )}
      <Swiper {...swiperConfig} style={{background: 'transparent'}}>
        {images.map((img, idx) => (
          <SwiperSlide key={idx} className="h-full w-full flex items-center justify-center bg-transparent" style={{background: 'transparent'}}>
            <div className="w-full h-full relative flex items-center justify-center bg-transparent" style={{background: 'transparent'}}>
              {img.src.startsWith('/') ? (
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 600px"
                  className={imageClassName || "object-cover"}
                  priority={idx === 0}
                  onLoad={() => { if (idx === 0) setFirstLoaded(true); }}
                />
              ) : (
                <img
                  src={img.src}
                  alt={img.alt}
                  className={imageClassName || "w-full h-full object-cover"}
                  loading={idx === 0 ? "eager" : "lazy"}
                  decoding="async"
                  onLoad={() => { if (idx === 0) setFirstLoaded(true); }}
                  onClick={() => onImageClick && onImageClick(idx)}
                />
              )}
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
            <div className={`swiper-pagination ${uniqueId}-pagination`} />
          </div>
        )}
      </Swiper>
      {/* Swiper navigation arrows - only show if arrows style and more than 1 image */}
      {imagesLength > 1 && navigationStyle === "arrows" && (
        <div className="hidden lg:flex absolute inset-0 pointer-events-none">
          <button
            className={`swiper-button-prev ${uniqueId}-prev pointer-events-auto`}
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
            className={`swiper-button-next ${uniqueId}-next pointer-events-auto`}
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
