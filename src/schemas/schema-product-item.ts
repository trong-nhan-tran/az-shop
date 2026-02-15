import { z } from "zod";
import { Prisma, product_items } from "@prisma/client";

export type ProductItemType = product_items;

export type ProductItemWithDetails = Prisma.product_itemsGetPayload<{
  include: {
    product_colors: true;
    // product_variants: true;
  };
}>;

export const productItemInputSchema = z.object({
  product_color_id: z.number(),
  product_variant_id: z.number(),
  is_available: z.boolean().default(false).describe("Trạng thái không hợp lệ"),
  price: z.number().min(0, "Giá bán không được âm"),
});

export type ProductItemInputType = z.infer<typeof productItemInputSchema>;
