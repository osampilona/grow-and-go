"use client";

import { useState, useCallback } from "react";

interface CarouselProps {
  images: string[];
  alt: string;
  className?: string;
}

export default function Carousel({ images, alt, className = "" }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % images.length);
  }, [images.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  if (images.length === 0) return null;

  console.log('Carousel rendering:', { images, currentIndex, currentImage: images[currentIndex] });

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Single image display */}
      <div className="w-full h-full relative">
        {/* Blurred background */}
        <img
          key={`bg-${currentIndex}`}
          src={images[currentIndex]}
          alt=""
          className="absolute inset-0 w-full h-full object-cover blur-xl scale-110 opacity-50"
          aria-hidden="true"
        />
        
        {/* Main image */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <img
            key={`main-${currentIndex}`}
            src={images[currentIndex]}
            alt={`${alt} ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain"
          />
        </div>
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
