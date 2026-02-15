"use client";
import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import ProductItemCard from "./product-card";
import ArrowButtons from "./arrow-carousel";
import { FeaturedItemWithDetailsType } from "@/schemas";

import "swiper/css";
import Link from "next/link";

type Props = {
  name?: string;
  featuredItems?: FeaturedItemWithDetailsType[];
  href?: string;
};

const ProductSlider = ({
  name = "Sản phẩm",
  featuredItems = [],
  href = "",
}: Props) => {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <div className="lg:max-w-7xl m-auto mt-10 relative px-3">
      <div className=" flex justify-center items-center">
        <Link className="text-2xl text-center group" href={href || "#"}>
          <span className="px-4 py-3 rounded-full bg-white inline-flex items-center justify-center transition-all duration-300 hover:scale-105 cursor-pointer">
            <i className="mr-2 mb-0.5 bi bi-apple text-xl transition-transform duration-300 group-hover:-translate-x-0.5" />
            <span className="text-xl font-medium">{name}</span>
            <i className="bi bi-chevron-right ml-2 text-lg transition-transform duration-300 group-hover:translate-x-0.5 mt-0.5"></i>
          </span>
        </Link>
      </div>

      <div className="mt-10 relative">
        <Swiper
          className="w-full"
          spaceBetween={10}
          slidesPerView={2}
          slidesPerGroup={2}
          speed={500}
          preventInteractionOnTransition={false}
          onBeforeInit={(swiper) => {
            swiperRef.current = swiper;
          }}
          // Responsive breakpoints
          breakpoints={{
            320: { slidesPerView: 2, slidesPerGroup: 2, spaceBetween: 10 },
            640: { slidesPerView: 2, slidesPerGroup: 2, spaceBetween: 10 },
            1024: { slidesPerView: 3, slidesPerGroup: 3, spaceBetween: 10 },
            1280: { slidesPerView: 4, slidesPerGroup: 4, spaceBetween: 10 },
          }}
        >
          {featuredItems.map((product, index) => (
            <SwiperSlide className="p-1 sm:p-2" key={product?.id || index}>
              {product ? (
                <ProductItemCard
                  productVariant={product.product_variants || null}
                />
              ) : (
                <div className="h-[300px] bg-gray-100 animate-pulse rounded-lg"></div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
        <ArrowButtons
          leftClassName="top-1/2 -left-4 sm:-left-16 z-10"
          rightClassName="top-1/2 -right-4 sm:-right-16 z-10"
          onPrevClick={() => swiperRef.current?.slidePrev()}
          onNextClick={() => swiperRef.current?.slideNext()}
        />
      </div>
    </div>
  );
};

export default ProductSlider;
