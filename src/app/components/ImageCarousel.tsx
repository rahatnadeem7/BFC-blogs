"use client";
import React, { useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import Image from "next/image";

export default function ImageCarousel({ images }: { images: string[] }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
  });

  const goToSlide = (idx: number) => {
    instanceRef.current?.moveToIdx(idx);
  };

  return (
    <div className="relative">
      {/* Carousel */}
      <div
        ref={sliderRef}
        className="keen-slider rounded-2xl overflow-hidden shadow-2xl aspect-video mb-4"
      >
        {images.map((src, idx) => (
          <div
            className="keen-slider__slide flex items-center justify-center bg-gray-100"
            key={idx}
          >
            <Image
              width={800}
              height={450}
              src={src}
              alt={`Slide ${idx + 1}`}
              className="w-full h-full object-cover max-w-full max-h-full"
            />
          </div>
        ))}
      </div>

      {/* Arrows */}
      <button
        className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow hover:bg-white z-10"
        onClick={() => instanceRef.current?.prev()}
        aria-label="Previous"
        style={{ display: images.length > 1 ? "block" : "none" }}
      >
        &#8592;
      </button>
      <button
        className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow hover:bg-white z-10"
        onClick={() => instanceRef.current?.next()}
        aria-label="Next"
        style={{ display: images.length > 1 ? "block" : "none" }}
      >
        &#8594;
      </button>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-2">
        {images.map((_, idx) => (
          <button
            key={idx}
            className={`w-3 h-3 rounded-full ${
              currentSlide === idx ? "bg-blue-600" : "bg-gray-300"
            } transition-colors`}
            onClick={() => goToSlide(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
