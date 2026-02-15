"use client";
import { ProductVariantType } from "@/schemas";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui-shadcn/badge";

type Props = {
  productVariant: ProductVariantType | null;
};

const ProductVariantCard = ({ productVariant }: Props) => {
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
    listedPrice: number,
  ) => {
    if (listedPrice === 0) return null;
    const percentage = Math.round(
      ((listedPrice - basePrice) / listedPrice) * 100,
    );
    return percentage >= 1 ? percentage : null;
  };
  const percentNumber =
    productVariant?.base_price && productVariant?.listed_price
      ? calculateDiscountPercentage(
          productVariant.base_price,
          productVariant.listed_price,
        )
      : null;
  return (
    <Link
      href={`/san-pham/${productVariant?.slug || ""}`}
      className="bg-white hover:scale-102  shadow-lg dark:bg-neutral-700 block rounded-2xl text-center transform transition-all duration-500 py-6 px-3 relative"
    >
      {percentNumber && (
        <Badge
          variant={"default"}
          className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold z-10 shadow-lg"
        >
          -{percentNumber}%
        </Badge>
      )}

      <div className="relative h-[250px] flex items-center justify-center">
        <Image
          src={productVariant?.thumbnail || ""}
          alt={productVariant?.name || "Product Image"}
          width={250}
          height={250}
        />
      </div>

      <h2 className="mt-4 font-medium line-clamp-2 h-12 overflow-hidden">
        {productVariant?.name}
      </h2>
      <div className="flex flex-col sm:flex-row items-center justify-center min-h-12">
        <span className="font-bold text-red-600 dark:text-red-400">
          {productVariant?.base_price
            ? formatPrice(productVariant.base_price)
            : "Chưa có giá"}
        </span>
        <span>
          {productVariant?.base_price !== productVariant?.listed_price && (
            <span className="line-through text-gray-400 ml-2 text-sm">
              {productVariant?.listed_price
                ? formatPrice(productVariant.listed_price)
                : ""}
            </span>
          )}
        </span>
      </div>
    </Link>
  );
};

export default ProductVariantCard;
