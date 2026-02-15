"use client";
import { FlashSaleItemWithDetailType } from "@/schemas";
import Link from "next/link";
import Image from "next/image";

type Props = {
  flashSaleItem: FlashSaleItemWithDetailType;
};

const ProductFlashSaleCard = ({ flashSaleItem }: Props) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };
  const calculateDiscountPercentage = (
    basePrice: number,
    listedPrice: number
  ) => {
    if (listedPrice === 0) return null;
    const percentage = Math.round(
      ((listedPrice - basePrice) / listedPrice) * 100
    );
    return percentage >= 1 ? percentage : null;
  };
  const percentNumber =
    flashSaleItem?.product_items?.product_variants &&
    flashSaleItem?.product_items.product_variants.listed_price
      ? calculateDiscountPercentage(
          flashSaleItem.sale_price,
          flashSaleItem.product_items.product_variants.listed_price
        )
      : null;
  return (
    <Link
      href={`/san-pham/${
        flashSaleItem?.product_items?.product_variants?.slug || ""
      }`}
      className="bg-white hover:scale-103 dark:bg-neutral-700 block rounded-2xl text-center transform transition-all duration-500 py-6 px-3 relative"
    >
      {percentNumber && (
        <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10 shadow-lg">
          -{percentNumber}%
        </div>
      )}

      <div className="relative h-[250px] flex items-center justify-center">
        <Image
          src={flashSaleItem?.product_items?.product_colors?.thumbnail || ""}
          alt={
            flashSaleItem?.product_items?.product_variants?.name ||
            "Product Image"
          }
          width={250}
          height={250}
        />
      </div>

      <h2 className="mt-4 font-medium line-clamp-2 h-12 overflow-hidden">
        {flashSaleItem?.product_items?.product_variants?.name || "Tên sản phẩm"}
      </h2>
      <div className="flex flex-col  items-center justify-center min-h-[48px]">
        <span className="font-bold text-amber-500">
          {flashSaleItem?.sale_price
            ? formatPrice(flashSaleItem.sale_price)
            : "Chưa có giá"}
        </span>
        <span>
          {flashSaleItem?.sale_price !==
            flashSaleItem?.product_items?.product_variants?.listed_price && (
            <span className="line-through text-gray-400 ml-2 text-sm">
              {flashSaleItem?.product_items?.product_variants?.listed_price
                ? formatPrice(
                    flashSaleItem.product_items.product_variants.listed_price
                  )
                : ""}
            </span>
          )}
        </span>
      </div>
      <div className="mt-4 relative">
        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-5 overflow-hidden relative">
          <div
            className="bg-linear-to-r from-yellow-400 to-yellow-500 h-5 rounded-full transition-all duration-300"
            style={{
              width: `${
                flashSaleItem?.quantity
                  ? Math.min(
                      (((flashSaleItem.quantity || 0) -
                        (flashSaleItem.sold_quantity || 0)) /
                        flashSaleItem.quantity) *
                        100,
                      100
                    )
                  : 0
              }%`,
            }}
          />
          <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-gray-700 dark:text-white z-10">
            Còn lại{" "}
            {(flashSaleItem?.quantity || 0) -
              (flashSaleItem?.sold_quantity || 0)}
            /{flashSaleItem?.quantity || 0}
          </span>
        </div>
        <i className="bi bi-fire text-red-500 text-2xl absolute left-0 top-2 -translate-y-1/2 z-10"></i>
      </div>
    </Link>
  );
};

export default ProductFlashSaleCard;
