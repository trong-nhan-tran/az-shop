import { z } from "zod";
import { product_variants, Prisma } from "@prisma/client";

export type ProductVariantWithProductItemType =
  Prisma.product_variantsGetPayload<{
    include: {
      product_items: {
        include: {
          product_colors: true;
        };
      };
    };
  }>;

export type ProductVariantWithColorType = Prisma.product_variantsGetPayload<{
  include: {
    product_items: {
      include: {
        product_colors: true;
      };
    };
  };
}>;
export type ProductVariantWithDetailType = Prisma.product_variantsGetPayload<{
  include: {
    products: {
      include: {
        product_variants: true;
      };
    };
    product_items: {
      include: {
        product_colors: true;
      };
    };
  };
}>;

export const productVariantInputSchema = z.object({
  name: z.string().min(1, "Tên phiên bản không được để trống"),
  thumbnail: z.string().optional(),
  base_price: z.number().min(0, "Giá bán không được âm"),
  listed_price: z.number().min(0, "Giá niêm yết không được âm"),
  slug: z.string().min(1, "Slug không được để trống"),
  product_id: z.number().int().optional().nullable(),
  variant: z.string().optional(),
});

export type ProductVariantInputType = z.infer<typeof productVariantInputSchema>;

export type ProductVariantType = product_variants;
