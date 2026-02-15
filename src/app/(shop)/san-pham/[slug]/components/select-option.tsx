import Link from "next/link";
import { ProductVariantType } from "@/schemas";

type SelectOptionProps = {
  productVariants: ProductVariantType[];
  currentSlug: string;
};

const SelectOption = ({ productVariants, currentSlug }: SelectOptionProps) => {
  if (!productVariants || productVariants.length <= 1) {
    return null;
  }

  return (
    <div className="mt-4 sm:mt-5">
      <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">
        Phiên bản
      </h2>

      <div className="flex flex-wrap gap-2">
        {productVariants.map((item) => (
          <Link
            key={item.id}
            href={`/san-pham/${item.slug}`}
            title={item.name}
            className={`rounded-lg px-3 sm:px-4 py-2 sm:py-3 border-2
            flex justify-center items-center transition-all hover:shadow-md
            min-w-0 flex-1 sm:flex-none
            ${
              item.slug === currentSlug
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-blue-300"
            }`}
          >
            <div className="text-center">
              <strong className="text-sm sm:text-base block truncate">
                {item.variant}
              </strong>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SelectOption;
