"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui-shadcn/select";
import { useCategoryStore } from "@/stores/category-store";
import Image from "next/image";
import { LayoutGrid } from "lucide-react";

interface CategoriesFilterSelectProps {
  selectedCategoryId?: string | null;
  onCategoryChange: (categoryId: string) => void;
}

const CategoriesFilterSelect: React.FC<CategoriesFilterSelectProps> = ({
  selectedCategoryId,
  onCategoryChange,
}) => {
  const categories = useCategoryStore((state) => state.categories);

  const filteredCategories = categories.filter(
    (category) => category.slug !== "home"
  );

  return (
    <Select
      value={selectedCategoryId || "all"}
      onValueChange={onCategoryChange}
    >
      <SelectTrigger>
        <SelectValue placeholder="Chọn danh mục" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">
          <div className="flex items-center gap-2">
            <LayoutGrid />
            <span>Danh mục</span>
          </div>
        </SelectItem>
        {filteredCategories.map((category) => (
          <SelectItem key={category.id} value={category.id.toString()}>
            <div className="flex items-center gap-2">
              <Image
                src={category.thumbnail || ""}
                alt={category.name}
                width={32}
                height={32}
                className="rounded-sm object-cover"
              />
              <span>{category.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CategoriesFilterSelect;
