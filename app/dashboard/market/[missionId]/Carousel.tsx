"use client";
import clsx from "clsx";
import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "react-feather";

function Carousel({ imageUrls }: { imageUrls: string[] }) {
  const [currIndex, setCurrIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  function prevSlide() {
    setIsLoading(true);
    const newIndex = currIndex == 0 ? imageUrls.length - 1 : currIndex - 1;
    setCurrIndex(newIndex);
  }
  function nextSlide() {
    setIsLoading(true);
    const newIndex = currIndex == imageUrls.length - 1 ? 0 : currIndex + 1;
    setCurrIndex(newIndex);
  }

  return (
    <div className="flex h-full w-full items-center">
      <button
        className={clsx(
          "flex hover:text-v-success dark:hover:text-v-success-light",
          {
            invisible: imageUrls.length <= 1,
          },
        )}
        onClick={prevSlide}
      >
        <ChevronLeft size={48} />
      </button>

      <figure aria-label="mission-images" className="relative h-full w-full">
        <span
          className={clsx(
            "loading loading-spinner loading-lg absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
            { hidden: !isLoading },
          )}
        ></span>
        <Image
          className="rounded-xl object-cover"
          src={imageUrls[currIndex]}
          sizes="100%"
          fill
          alt="Mission Images"
          quality={70}
          onLoad={() => setIsLoading(false)}
        />
      </figure>

      <button
        className={clsx(
          "flex hover:text-v-success dark:hover:text-v-success-light",
          {
            invisible: imageUrls.length <= 1,
          },
        )}
        onClick={nextSlide}
      >
        <ChevronRight size={48} />
      </button>
    </div>
  );
}

export default Carousel;
