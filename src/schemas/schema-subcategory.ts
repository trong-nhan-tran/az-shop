import { z } from "zod";
import { subcategories, Prisma } from "@prisma/client";

export type SubcategoryType = subcategories;

export const subcategoryInputSchema = z.object({
  name: z.string().min(1, "Tên danh mục không được để trống"),
  slug: z.string().min(1, "Slug không được để trống"),
  category_id: z.number().int().optional().nullable(),
  order_number: z.number().int().optional().nullable(),
});

export type SubcategoryInputType = z.infer<typeof subcategoryInputSchema>;
