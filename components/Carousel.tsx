"use client";

import { useState, useCallback, useRef, useEffect } from "react";

interface CarouselProps {
  images: string[];
  alt: string;
  className?: string;
}

export default function Carousel({ images, alt, className = "" }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % images.length);
  }, [images.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + images.length) % images.length);
  }, [images.length]);

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

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    touchStartX.current = e.clientX;
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (touchStartX.current) {
      touchEndX.current = e.clientX;
    }
  }, []);

  const handleMouseUp = useCallback(() => {
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

  if (images.length === 0) return null;

  // Debug log
  console.log('Carousel images:', images);
  console.log('Current index:', currentIndex);

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Image container with transform for smooth transitions */}
      <div 
        className="flex transition-transform duration-300 ease-out"
        style={{ 
          transform: `translateX(-${currentIndex * 100}%)`,
          width: `${images.length * 100}%`,
          height: "100%",
        }}
      >
        {images.map((src, index) => (
          <div
            key={index}
            className="w-full h-full flex-shrink-0 relative overflow-hidden"
            style={{ width: `${100 / images.length}%` }}
          >
            {/* Blurred background for all images - fills entire container */}
            <img
              src={src}
              alt=""
              className="absolute inset-0 w-full h-full object-cover blur-xl scale-110 opacity-50"
              loading="eager"
              aria-hidden="true"
            />
            
            {/* Main image - centered in container */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <img
                src={src}
                alt={`${alt} ${index + 1}`}
                className="max-w-full max-h-full object-contain"
                loading="eager"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Navigation arrows - only show if more than 1 image */}
      {images.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/70 dark:bg-black/70 backdrop-blur-sm shadow-md border border-white/40 dark:border-black/40 transition hover:bg-white/90 dark:hover:bg-black/90 z-20"
            aria-label="Previous image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-gray-700 dark:text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/70 dark:bg-black/70 backdrop-blur-sm shadow-md border border-white/40 dark:border-black/40 transition hover:bg-white/90 dark:hover:bg-black/90 z-20"
            aria-label="Next image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-gray-700 dark:text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </>
      )}

      {/* Dots indicator - only show if more than 1 image */}
      {images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? 'bg-white dark:bg-white shadow-md scale-110'
                  : 'bg-white/50 dark:bg-white/50 hover:bg-white/70 dark:hover:bg-white/70'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
