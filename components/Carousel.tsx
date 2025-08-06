"use client";

import { useState, useCallback, useRef, memo } from "react";

interface CarouselProps {
  images: string[];
  alt: string;
  className?: string;
  blurredBackground?: boolean;
  navigationStyle?: 'arrows' | 'counter';
}

const Carousel = memo(function Carousel({ 
  images, 
  alt, 
  className = "",
  blurredBackground = false,
  navigationStyle = 'arrows'
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const mouseStartX = useRef<number>(0);
  const mouseEndX = useRef<number>(0);
  const isDragging = useRef<boolean>(false);
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

  // Mouse drag handlers for desktop
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    mouseStartX.current = e.clientX;
    isDragging.current = true;
    e.preventDefault(); // Prevent text selection during drag
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) return;
    mouseEndX.current = e.clientX;
  }, []);

  const handleMouseUp = useCallback(() => {
    if (!isDragging.current || !mouseStartX.current) return;
    
    const distance = mouseStartX.current - mouseEndX.current;
    const isLeftDrag = distance > 50;
    const isRightDrag = distance < -50;

    if (isLeftDrag) {
      nextSlide();
    } else if (isRightDrag) {
      prevSlide();
    }

    mouseStartX.current = 0;
    mouseEndX.current = 0;
    isDragging.current = false;
  }, [nextSlide, prevSlide]);

  const handleMouseLeave = useCallback(() => {
    // Reset drag state if mouse leaves the carousel area
    isDragging.current = false;
    mouseStartX.current = 0;
    mouseEndX.current = 0;
  }, []);

  if (imagesLength === 0) return null;

  const currentImage = images[currentIndex];
  const hasMultipleImages = imagesLength > 1;

  return (
    <div 
      className={`relative overflow-hidden ${className} ${isDragging.current ? 'cursor-grabbing' : 'cursor-grab'}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      style={{ userSelect: 'none' }} // Prevent text selection during drag
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

      {/* Navigation arrows - only show if more than 1 image and arrows style */}
      {hasMultipleImages && navigationStyle === 'arrows' && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/70 backdrop-blur-sm shadow-md border border-divider transition hover:bg-white/90 z-20"
            aria-label="Previous image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-black">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/70 backdrop-blur-sm shadow-md border border-divider transition hover:bg-white/90 z-20"
            aria-label="Next image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-black">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </>
      )}

      {/* Counter indicator - only show if more than 1 image and counter style */}
      {hasMultipleImages && navigationStyle === 'counter' && (
        <div className="absolute bottom-3 right-3 px-2 py-1 rounded-full bg-white/60 backdrop-blur-md text-black text-xs font-medium z-20">
          {currentIndex + 1} / {imagesLength}
        </div>
      )}

      {/* Dots indicator - only show if more than 1 image and arrows style */}
      {hasMultipleImages && navigationStyle === 'arrows' && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? 'bg-white shadow-md scale-110'
                  : 'bg-white/50 hover:bg-white/70'
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
