import { z } from "zod";
import { Prisma, flash_sale_items } from "@prisma/client";

export type FlashSaleItemType = flash_sale_items;
export type FlashSaleItemWithDetailType = Prisma.flash_sale_itemsGetPayload<{
  include: {
    product_items: {
      include: {
        product_variants: true;
        product_colors: true;
      };
    };
  };
}>;

export const flashSaleItemInputSchema = z.object({
  flash_sale_id: z.number().int().min(1, "ID khuyến mãi không được để trống"),
  product_item_id: z.number().int().min(1, "Mã sản phẩm không được để trống"),
  sale_price: z.number().int().min(1, "Giá khuyến mãi không được để trống"),
  quantity: z.number().int().min(1, "Số lượng không được để trống"),
});
export type FlashSaleItemInputType = z.infer<typeof flashSaleItemInputSchema>;
