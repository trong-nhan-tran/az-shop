"use client";
import React, { useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import Link from "next/link";
import ArrowCarousel from "./arrow-carousel";
import { BannerType } from "@/schemas";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import { cn } from "@/libs/utils";

type BannerSliderProps = {
  banners: BannerType[];
  variant?: "home" | "category";
  className?: string;
};

const BannerSlider = ({
  banners,
  variant = "home",
  className = "",
}: BannerSliderProps) => {
  const swiperRef = useRef<SwiperType>(null);

  if (!banners || banners.length === 0) {
    return null;
  }

  const isHome = variant === "home";
  const imageClassName = isHome ? "w-full" : "rounded-2xl";

  return (
    <div className={cn("relative w-full", className)}>
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={banners.length > 1}
        className="w-full"
        onBeforeInit={(swiper) => {
          swiperRef.current = swiper;
        }}
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <Link
              href={banner.direct_link || "#"}
              className={isHome ? "block" : "w-full"}
            >
              {/* Mobile Image */}
              <div className="block md:hidden">
                <Image
                  src={banner.mobile_image || banner.desktop_image}
                  alt="Mobile Banner Image"
                  width={768}
                  height={400}
                  className={imageClassName}
                  priority={true}
                />
              </div>
              {/* Desktop Image */}
              <div className="hidden md:block">
                <Image
                  src={banner.desktop_image}
                  alt="Desktop Banner Image"
                  width={2048}
                  height={1080}
                  className={imageClassName}
                  priority={true}
                />
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      {banners.length > 1 && (
        <ArrowCarousel
          leftClassName="top-1/2 left-5 z-10 absolute"
          rightClassName="top-1/2 right-5 z-10 absolute"
          onPrevClick={() => swiperRef.current?.slidePrev()}
          onNextClick={() => swiperRef.current?.slideNext()}
        />
      )}
    </div>
  );
};

export default BannerSlider;
