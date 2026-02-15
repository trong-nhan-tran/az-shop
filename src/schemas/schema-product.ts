import { z } from "zod";
import { products, Prisma } from "@prisma/client";

export type ProductType = products;
export type ProductWithDetailType = Prisma.productsGetPayload<{
  include: {
    subcategories: true;
    product_colors: true;
    product_variants: true;
    product_items: {
      include: {
        product_colors: true;
        product_variants: true;
      };
    };
  };
}>;
export type ProductCardType = Prisma.productsGetPayload<{
  include: {
    product_colors: true;
  };
}>;

export const productInputSchema = z.object({
  name: z.string().min(1, "Tên không được để trống"),
  description: z.string().optional(),
  subcategory_id: z.number().int().optional(),
});

export type ProductInputType = z.infer<typeof productInputSchema>;
