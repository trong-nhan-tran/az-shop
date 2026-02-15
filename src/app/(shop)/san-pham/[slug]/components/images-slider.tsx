"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import ArrowButtons from "@/app/(shop)/_components/features/arrow-carousel";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/thumbs";

type Props = {
  images?: string[];
  alt: string;
};

const ImageSlider = ({ images = [], alt }: Props) => {
  // Reference to Swiper instance
  const swiperRef = useRef<SwiperType | null>(null);
  const thumbsSwiperRef = useRef<SwiperType | null>(null);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  // Enable loop only if there are enough slides
  const enableLoop = images.length > 1;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full">
        <Swiper
          modules={[Pagination, Thumbs]}
          spaceBetween={0}
          slidesPerView={1}
          loop={enableLoop}
          thumbs={{
            swiper:
              thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
          }}
          className="w-full mb-3 rounded-xl"
          onBeforeInit={(swiper) => {
            swiperRef.current = swiper;
          }}
        >
          {images.map((item) => (
            <SwiperSlide key={item}>
              <Image
                src={item}
                alt={alt}
                width={500}
                height={500}
                className="w-full"
              />
            </SwiperSlide>
          ))}
          <ArrowButtons
            leftClassName="top-1/2 left-1 z-10"
            rightClassName="top-1/2 right-1 z-10"
            onPrevClick={() => swiperRef.current?.slidePrev()}
            onNextClick={() => swiperRef.current?.slideNext()}
          />
        </Swiper>

        <div className="mt-4 relative flex justify-center">
          <Swiper
            onSwiper={setThumbsSwiper}
            modules={[Navigation, Thumbs]}
            spaceBetween={10}
            slidesPerView="auto"
            freeMode={true}
            watchSlidesProgress={true}
            className="thumbs-swiper"
            onBeforeInit={(swiper) => {
              thumbsSwiperRef.current = swiper;
            }}
          >
            {images.map((item) => (
              <SwiperSlide key={item} className="cursor-pointer !w-auto">
                <div className="transition-all duration-300 h-full">
                  <Image
                    src={item}
                    alt={`Thumbnail ${alt}`}
                    width={70}
                    height={70}
                    className="rounded-lg border hover:border-blue-500 transition-all duration-300"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          {images.length > 6 && (
            <ArrowButtons
              leftClassName="top-1/2 -left-4 z-10 shadow-lg rounded-full px-2 py-1 transition-all duration-300"
              rightClassName="top-1/2 -right-4 z-10 shadow-lg rounded-full px-2 py-1 transition-all duration-300"
              onPrevClick={() => thumbsSwiperRef.current?.slidePrev()}
              onNextClick={() => thumbsSwiperRef.current?.slideNext()}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageSlider;
