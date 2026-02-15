"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/libs/utils";
import { CategoryWithSubType } from "@/schemas";

type Props = {
  currentSort: string;
  categoryWithSub?: CategoryWithSubType;
};

const FilterSort = ({ currentSort, categoryWithSub }: Props) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createSortURL = (sortValue: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", sortValue);
    params.delete("page");
    return `${pathname}?${params.toString()}`;
  };

  const options = [
    { value: "newest", label: "Mới nhất" },
    { value: "best-selling", label: "Bán chạy" },
    { value: "price-asc", label: "Giá thấp đến cao" },
    { value: "price-desc", label: "Giá cao đến thấp" },
  ];

  return (
    <div className="">
      <div className="bg-white rounded-2xl px-4 sm:px-6 py-3">
        <div className="flex flex-col gap-3">
          {/* Filter Section */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div className="text-sm font-medium text-gray-700 whitespace-nowrap mr-3.5">
              Sắp xếp
            </div>
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 w-full sm:w-auto">
              {options.map((option) => {
                const isActive = currentSort === option.value;
                return (
                  <Link
                    key={option.value}
                    href={createSortURL(option.value)}
                    className={cn(
                      "flex items-center justify-center w-full sm:w-[140px] px-3 py-1.5 text-sm font-medium rounded-lg border cursor-pointer transition-all",
                      "hover:bg-gray-50 hover:border-gray-300",
                      isActive
                        ? "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
                        : "bg-white",
                    )}
                  >
                    {option.label}
                  </Link>
                );
              })}
            </div>
          </div>
          {categoryWithSub && categoryWithSub?.subcategories?.length > 0 && (
            <div className="border-t border-gray-200" />
          )}
          {/* Category Filter Section */}
          {categoryWithSub && categoryWithSub?.subcategories?.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <div className="text-sm font-medium text-gray-700 whitespace-nowrap">
                Danh Mục
              </div>
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 w-full sm:w-auto">
                <Link
                  href={`/danh-muc/${categoryWithSub.slug}`}
                  className={cn(
                    "flex items-center justify-center w-full sm:min-w-[140px] sm:w-auto px-3 py-1.5 text-sm font-medium rounded-lg border cursor-pointer transition-all bg-white",
                    "hover:bg-gray-50 hover:border-gray-300",
                    pathname === `/danh-muc/${categoryWithSub.slug}` &&
                      "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100",
                  )}
                >
                  Tất cả
                </Link>

                {categoryWithSub.subcategories.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/danh-muc/${item.slug}`}
                    className={cn(
                      "flex items-center justify-center w-full sm:min-w-[140px] sm:w-auto px-3 py-1.5 text-sm font-medium rounded-lg border cursor-pointer transition-all bg-white",
                      "hover:bg-gray-50 hover:border-gray-300",
                      pathname === `/danh-muc/${item.slug}` &&
                        "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100",
                    )}
                  >
                    {item.name || ""}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterSort;
