import { z } from "zod";
import { featured_items, Prisma } from "@prisma/client";

export type FeaturedItemType = featured_items;
export type FeaturedItemWithDetailsType = Prisma.featured_itemsGetPayload<{
  include: {
    product_variants: true;
  };
  orderBy: { order_number: "asc" };
}>;

export const featuredItemInputSchema = z.object({
  product_variant_id: z.number().int().optional().nullable(),
  category_id: z.number().int().optional().nullable(),
  order_number: z.number().int().optional().nullable(),
});

export type FeaturedItemInputType = z.infer<typeof featuredItemInputSchema>;
