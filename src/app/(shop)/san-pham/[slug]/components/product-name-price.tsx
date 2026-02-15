import { formatPrice } from "@/libs/utils";
import SelectOption from "./select-option";
import { ProductVariantType } from "@/schemas";

type ProductNamePriceProps = {
  name: string;
  currentPrice: number;
  listedPrice: number;
  percentNumber: number | null;

};

const ProductNamePrice = ({
  name,
  currentPrice,
  listedPrice,
  percentNumber,

}: ProductNamePriceProps) => {
  return (
    <>
      <h1 className="font-bold text-xl sm:text-2xl lg:text-3xl leading-tight">
        {name}
      </h1>

      {/* Price Section */}
      <div className="mt-3 sm:mt-4 flex flex-wrap items-center gap-2 sm:gap-3">
        <span className="text-xl sm:text-2xl font-bold text-red-600">
          {formatPrice(currentPrice)}
        </span>
        {listedPrice > currentPrice && (
          <span className="line-through text-gray-400 text-base sm:text-lg">
            {formatPrice(listedPrice)}
          </span>
        )}
        {percentNumber && (
          <span className="bg-red-500 text-white px-2 py-1 rounded-full text-sm font-semibold shadow-sm">
            -{percentNumber}%
          </span>
        )}
      </div>

    </>
  );
};

export default ProductNamePrice;
