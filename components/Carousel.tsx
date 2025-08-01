"use client";

import { useState, useCallback, useRef, memo } from "react";

interface CarouselProps {
  images: string[];
  alt: string;
  className?: string;
  blurredBackground?: boolean;
}

const Carousel = memo(function Carousel({ 
  images, 
  alt, 
  className = "",
  blurredBackground = false
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const imagesLength = images.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % imagesLength);
  }, [imagesLength]);

  const prevSlide = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + imagesLength) % imagesLength);
  }, [imagesLength]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!touchStartX.current || !touchEndX.current) return;
    
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }

    touchStartX.current = 0;
    touchEndX.current = 0;
  }, [nextSlide, prevSlide]);

  if (imagesLength === 0) return null;

  const currentImage = images[currentIndex];
  const hasMultipleImages = imagesLength > 1;

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Single image display with smooth transition */}
      <div className="w-full h-full relative">
        {blurredBackground && (
          <>
            {/* Blurred background */}
            <img
              key={`bg-${currentIndex}`}
              src={currentImage}
              alt=""
              className="absolute inset-0 w-full h-full object-cover blur-xl scale-110 opacity-50 transition-opacity duration-300"
              aria-hidden="true"
            />
            
            {/* Main image - centered in container */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <img
                key={`main-${currentIndex}`}
                src={currentImage}
                alt={`${alt} ${currentIndex + 1}`}
                className="max-w-full max-h-full object-contain transition-opacity duration-300"
              />
            </div>
          </>
        )}
        
        {!blurredBackground && (
          /* Cover image - fills container completely */
          <img
            key={`cover-${currentIndex}`}
            src={currentImage}
            alt={`${alt} ${currentIndex + 1}`}
            className="w-full h-full object-cover transition-opacity duration-300"
          />
        )}
      </div>

      {/* Navigation arrows - only show if more than 1 image */}
      {hasMultipleImages && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-background/70 backdrop-blur-sm shadow-md border border-divider transition hover:bg-background/90 z-20"
            aria-label="Previous image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-foreground">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-background/70 backdrop-blur-sm shadow-md border border-divider transition hover:bg-background/90 z-20"
            aria-label="Next image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-foreground">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </>
      )}

      {/* Dots indicator - only show if more than 1 image */}
      {hasMultipleImages && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? 'bg-background shadow-md scale-110'
                  : 'bg-background/50 hover:bg-background/70'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
});

export default Carousel;
