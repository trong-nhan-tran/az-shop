import { z } from "zod";
import { categories, Prisma } from "@prisma/client";

export type CategoryType = categories;
export type CategoryWithChildrenType = Prisma.categoriesGetPayload<{
  include: {
    subcategories: true;
    banners: true;
    featured_items: {
      include: {
        product_variants: true;
      };
    };
  };
}>;
export type CategoryWithSubType = Prisma.categoriesGetPayload<{
  include: {
    subcategories: true;
  };
}>;

export type CategoryWithFeaturedItemsType = Prisma.categoriesGetPayload<{
  include: {
    featured_items: {
      include: {
        product_variants: true;
      };
    };
  };
}>;

export const categoryInputSchema = z.object({
  thumbnail: z.string().url("URL không hợp lệ").optional().nullable(),
  name: z.string().min(1, "Tên danh mục không được để trống"),
  slug: z.string().min(1, "Slug không được để trống"),
  order_number: z.number().int().optional().nullable(),
});

export type CategoryInputType = z.infer<typeof categoryInputSchema>;
