"use client";

import { Button } from "@/components/ui-shadcn/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui-shadcn/select";
import { X, Palette, Layers } from "lucide-react";
import { ProductColorType, ProductVariantType } from "@/schemas";
import Image from "next/image";

type ProductItemFiltersProps = {
  productColors: ProductColorType[];
  productVariants: ProductVariantType[];
  selectedColorId: string;
  selectedVariantId: string;
  onColorChange: (colorId: string) => void;
  onVariantChange: (variantId: string) => void;
  onResetFilters: () => void;
};

export const ProductItemFilters = ({
  productColors,
  productVariants,
  selectedColorId,
  selectedVariantId,
  onColorChange,
  onVariantChange,
  onResetFilters,
}: ProductItemFiltersProps) => {
  return (
    <div className="flex items-center gap-3">
      {/* Color Filter */}
      <Select value={selectedColorId} onValueChange={onColorChange}>
        <SelectTrigger>
          <SelectValue placeholder="Chọn màu" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">
            <div className="flex items-center gap-2">
              <Palette />
              <span>Màu</span>
            </div>
          </SelectItem>
          {productColors.map((color) => (
            <SelectItem
              key={color.id}
              value={color.id.toString()}
              className="flex items-center gap-2"
            >
              <Image
                src={color.thumbnail || ""}
                alt={color.color_name}
                width={28}
                height={28}
              />
              <span>{color.color_name}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Variant Filter */}
      <Select value={selectedVariantId} onValueChange={onVariantChange}>
        <SelectTrigger>
          <SelectValue placeholder="Chọn phiên bản" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">
            <div className="flex items-center gap-2">
              <Layers />
              <span>Phiên bản</span>
            </div>
          </SelectItem>
          {productVariants.map((variant) => (
            <SelectItem
              key={variant.id}
              value={variant.id.toString()}
              className="flex items-center gap-2"
            >
              <Layers />
              <span className="font-semibold">
                {variant.variant ? variant.variant : "Đơn"}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Reset button */}
      <Button
        variant="outline"
        onClick={onResetFilters}
        className="text-gray-600 hover:text-gray-800"
      >
        <X size={14} />
        Bỏ lọc
      </Button>
    </div>
  );
};
