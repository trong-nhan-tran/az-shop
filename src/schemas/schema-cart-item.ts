import { z } from "zod";
import { cart_items, Prisma } from "@prisma/client";

export type CartItemType = cart_items;

export type CartItemWithDetailType = Prisma.cart_itemsGetPayload<{
  include: {
    product_items: {
      include: {
        product_variants: true;
        product_colors: true;
      };
    };
  };
}>;

export const cartItemInputSchema = z.object({
  profile_id: z.string().uuid("ID user không hợp lệ"),
  product_item_id: z.number().int("ID sản phẩm không hợp lệ"),
  quantity: z.number().int().min(1, "Số lượng phải lớn hơn hoặc bằng 1"),
});

export type CartItemInputType = z.infer<typeof cartItemInputSchema>;
