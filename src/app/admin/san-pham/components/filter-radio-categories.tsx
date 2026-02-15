"use client";

import React from "react";
import Image from "next/image";
import { useCategoryStore } from "@/stores/category-store";
import { Grid3X3 } from "lucide-react";

interface CategoriesFilterItemProps {
  selectedCategoryId?: string | null;
  onCategoryChange: (categoryId: string | null) => void;
}

const CategoriesFilterItem: React.FC<CategoriesFilterItemProps> = ({
  selectedCategoryId,
  onCategoryChange,
}) => {
  const categories = useCategoryStore((state) => state.categories);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2 bg-white p-2 border-b w-full">
      <div
        onClick={() => onCategoryChange(null)}
        className={`flex w-full rounded-md items-center gap-3 cursor-pointer pl-3 border transition-all duration-200 ${
          !selectedCategoryId
            ? "border-blue-500 bg-blue-50 shadow-md"
            : "border-gray-200 bg-white hover:bg-gray-50 hover:border-blue-400"
        }`}
      >
        <Grid3X3 width={28} height={28} />
        <div className="text-sm font-medium">Tất cả danh mục</div>
      </div>

      {categories
        .filter((category) => category.slug !== "home")
        .map((category) => (
          <div
            key={category.id}
            onClick={() => onCategoryChange(category.id.toString())}
            className={`flex w-full pl-3 rounded-md items-center gap-3 cursor-pointer border transition-all duration-200 ${
              selectedCategoryId === category.id.toString()
                ? "border-blue-500 bg-blue-50 shadow-md"
                : "border-gray-200 bg-white hover:bg-gray-50 hover:border-blue-400"
            }`}
          >
            <div className="overflow-hidden  flex items-center justify-center">
              <Image
                src={category.thumbnail || ""}
                alt={category.name}
                width={50}
                height={50}
                className="object-cover"
              />
            </div>
            <div className="text-sm">{category.name}</div>
          </div>
        ))}
    </div>
  );
};

export default CategoriesFilterItem;
