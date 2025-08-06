"use client";

import { memo, useState, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCreative, Navigation, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/effect-creative";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../styles/swiper-carousel.css";

interface SwiperCarouselProps {
  images: string[];
  alt: string;
  className?: string;
  blurredBackground?: boolean;
  navigationStyle?: 'arrows' | 'counter';
  creativeEffect?: 'default' | 'slide-rotate' | 'depth-slide' | 'rotate-3d' | 'scale-rotate' | 'book-flip';
}

const SwiperCarousel = memo(function SwiperCarousel({ 
  images, 
  alt, 
  className = "",
  blurredBackground = false,
  navigationStyle = 'arrows',
  creativeEffect = 'default'
}: SwiperCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const imagesLength = images.length;

  if (imagesLength === 0) return null;

  const handleSlideChange = useCallback((swiper: SwiperType) => {
    setActiveIndex(swiper.realIndex);
  }, []);

  // Creative effect configurations based on SwiperJS demos
  const creativeEffects = {
    default: {
      prev: {
        shadow: true,
        translate: [0, 0, -400],
      },
      next: {
        translate: ['100%', 0, 0]
      }
    },
    'slide-rotate': {
      prev: {
        shadow: true,
        translate: ['-125%', 0, -800],
        rotate: [0, 0, -90],
      },
      next: {
        shadow: true,
        translate: ['125%', 0, -800],
        rotate: [0, 0, 90]
      }
    },
    'depth-slide': {
      prev: {
        shadow: true,
        translate: ['-20%', 0, -1],
      },
      next: {
        translate: ['100%', 0, 0]
      }
    },
    'rotate-3d': {
      prev: {
        shadow: true,
        translate: [0, 0, -800],
        rotate: [180, 0, 0],
      },
      next: {
        shadow: true,
        translate: [0, 0, -800],
        rotate: [-180, 0, 0]
      }
    },
    'scale-rotate': {
      prev: {
        shadow: true,
        translate: ['-120%', 0, -500],
      },
      next: {
        shadow: true,
        translate: ['120%', 0, -500]
      }
    },
    'book-flip': {
      prev: {
        shadow: true,
        origin: 'left center',
        translate: ['-5%', 0, -200],
        rotate: [0, 100, 0],
      },
      next: {
        origin: 'right center',
        translate: ['5%', 0, -200],
        rotate: [0, -100, 0],
      }
    }
  };

  const swiperConfig = {
    modules: [EffectCreative, Navigation, Pagination],
    effect: 'creative' as const,
    creativeEffect: creativeEffects[creativeEffect],
    grabCursor: true,
    loop: imagesLength > 1,
    speed: 600,
    onSlideChange: handleSlideChange,
    // Navigation arrows
    navigation: navigationStyle === 'arrows' && imagesLength > 1 ? {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    } : false,
    // Pagination dots
    pagination: navigationStyle === 'arrows' && imagesLength > 1 ? {
      el: '.swiper-pagination',
      clickable: true,
      bulletClass: 'swiper-pagination-bullet',
      bulletActiveClass: 'swiper-pagination-bullet-active',
    } : false,
  };

  return (
    <div className={`relative overflow-hidden swiper-carousel-container ${navigationStyle === 'counter' ? 'counter-style' : ''} ${className}`}>
      <Swiper {...swiperConfig}>
        {images.map((image, index) => (
          <SwiperSlide key={index} className="h-full w-full">
            <div className="w-full h-full relative">
              {blurredBackground && (
                <>
                  {/* Blurred background */}
                  <img
                    src={image}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover blur-xl scale-110 opacity-50"
                    aria-hidden="true"
                  />
                  
                  {/* Main image - centered in container */}
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <img
                      src={image}
                      alt={`${alt} ${index + 1}`}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                </>
              )}
              
              {!blurredBackground && (
                <img
                  src={image}
                  alt={`${alt} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </SwiperSlide>
        ))}

        {/* Counter indicator - only show if more than 1 image and counter style */}
        {imagesLength > 1 && navigationStyle === 'counter' && (
          <div className="absolute bottom-3 right-3 px-2 py-1 rounded-full bg-white/60 backdrop-blur-md text-black text-xs font-medium z-20 swiper-counter">
            {activeIndex + 1} / {imagesLength}
          </div>
        )}
      </Swiper>
    </div>
  );
});

export default SwiperCarousel;
