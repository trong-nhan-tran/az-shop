"use client";

import Image from "next/image";
import { ProductItemWithDetails } from "@/schemas";

type SelectColorProps = {
  colors: ProductItemWithDetails[];
  currentProductItem: ProductItemWithDetails | null;
  setSelectedProductItem: (item: ProductItemWithDetails | null) => void;
};

const SelectColor = ({
  colors = [],
  currentProductItem,
  setSelectedProductItem,
}: SelectColorProps) => {
  if (!colors || colors.length === 0) {
    return null;
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="mt-4 sm:mt-5">
      <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">
        Màu sắc
      </h2>
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        {colors.map((item) => (
          <div
            key={item.id}
            className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg cursor-pointer
              border-2 transition-all hover:shadow-md
              ${
                currentProductItem?.id === item.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300"
              }`}
            title={item?.product_colors?.color_name || "Màu sắc"}
            onClick={() => setSelectedProductItem(item)}
          >
            {item?.product_colors?.thumbnail && (
              <div className="shrink-0">
                <Image
                  src={item?.product_colors?.thumbnail || ""}
                  alt={item?.product_colors?.color_name || ""}
                  width={40}
                  height={40}
                  className="object-cover rounded sm:w-12 sm:h-12"
                />
              </div>
            )}

            <div className="flex flex-col gap-0 min-w-0 flex-1">
              <span className="font-medium sm:font-semibold capitalize text-sm sm:text-base truncate">
                {item?.product_colors?.color_name}
              </span>
              <span className="text-sm sm:text-base text-gray-600">
                {formatPrice(item?.price || 0)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectColor;
