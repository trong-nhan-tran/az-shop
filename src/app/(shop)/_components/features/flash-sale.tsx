"use client";
import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import ArrowCarousel from "./arrow-carousel";
import ProductFlashSaleCard from "./product-flash-sale-card";
import { useQuery } from "@tanstack/react-query";
import { getActiveFlashSale } from "@/apis";
import { FlashSaleWithDetailType } from "@/schemas";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
``;
type Props = {};

const FlashSale = (props: Props) => {
  const swiperRef = useRef<SwiperType | null>(null);
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Fetch active flash sale
  const { data: flashSaleResponse, isLoading } = useQuery({
    queryKey: ["active-flash-sale"],
    queryFn: getActiveFlashSale,
    refetchInterval: 60000, // Refetch every minute
  });

  const flashSale: FlashSaleWithDetailType | null =
    flashSaleResponse?.data || null;
  const flashSaleItems = flashSale?.flash_sale_items || [];

  // Calculate countdown
  useEffect(() => {
    if (!flashSale?.end_at) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const endTime = new Date(flashSale.end_at).getTime();
      const difference = endTime - now;

      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [flashSale]);

  // Don't render if no flash sale or no items
  if (!flashSale || flashSaleItems.length === 0) {
    return null;
  }

  // Format time to 2 digits
  const formatTime = (time: number) => time.toString().padStart(2, "0");

  // Calculate time range display
  const getTimeRange = () => {
    if (!flashSale.start_at || !flashSale.end_at) return "";

    const start = new Date(flashSale.start_at);
    const end = new Date(flashSale.end_at);

    return `${start.getHours()}:${formatTime(
      start.getMinutes()
    )} - ${end.getHours()}:${formatTime(end.getMinutes())}`;
  };

  if (isLoading) {
    return (
      <div className="md:mx-auto w-full md:max-w-5/6 bg-gradient-to-r from-amber-100 to-blue-300 my-4 relative rounded-2xl pb-4">
        <div className="flex items-center justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="md:mx-auto w-full md:max-w-5/6 bg-gradient-to-r from-amber-100 to-blue-300 my-4 relative rounded-2xl pb-4">
      <div className="flex flex-col md:flex-row items-center justify-between px-4 py-2 space-y-4 md:space-y-0">
        <Image
          src="/images/flash_sale/flash_sale.png"
          alt="flash_sale"
          width={400}
          height={400}
          className="object-cover"
        />

        <div className="font-semibold text-xl text-center">
          <h2>KẾT THÚC TRONG</h2>
          <span className="flex items-center justify-center space-x-1">
            <label className="bg-black py-1 px-2 text-white rounded-lg">
              {formatTime(timeLeft.hours)}
            </label>
            <span>:</span>
            <label className="bg-black py-1 px-2 text-white rounded-lg">
              {formatTime(timeLeft.minutes)}
            </label>
            <span>:</span>
            <label className="bg-black py-1 px-2 text-white rounded-lg">
              {formatTime(timeLeft.seconds)}
            </label>
          </span>
        </div>

        <div className="font-semibold text-xl text-center">
          <h2 className="uppercase">đang diễn ra</h2>
          <span>{getTimeRange()}</span>
        </div>
        <div className="font-semibold text-xl text-center">
          <h2 className="uppercase">Ngày mai</h2>
          <span>{getTimeRange()}</span>
        </div>
      </div>

      <div className="relative mx-4">
        <Swiper
          modules={[Autoplay, Navigation]}
          spaceBetween={10}
          slidesPerView={5}
          slidesPerGroup={5}
          loop={flashSaleItems.length > 5}
          speed={2000}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          className="w-full"
          onBeforeInit={(swiper) => {
            swiperRef.current = swiper;
          }}
          breakpoints={{
            320: { slidesPerView: 2, slidesPerGroup: 2 },
            640: { slidesPerView: 2, slidesPerGroup: 2 },
            768: { slidesPerView: 3, slidesPerGroup: 3 },
            1024: { slidesPerView: 4, slidesPerGroup: 4 },
            1280: { slidesPerView: 5, slidesPerGroup: 5 },
          }}
        >
          {flashSaleItems.map((item) => (
            <SwiperSlide key={item.id} className="my-5">
              <ProductFlashSaleCard flashSaleItem={item} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {flashSaleItems.length > 1 && (
        <ArrowCarousel
          leftClassName="top-[65%] md:top-1/2 -left-2 md:-left-16 z-10"
          rightClassName="top-[65%] md:top-1/2 -right-2 md:-right-16 z-10"
          onPrevClick={() => swiperRef.current?.slidePrev()}
          onNextClick={() => swiperRef.current?.slideNext()}
        />
      )}
    </div>
  );
};

export default FlashSale;
