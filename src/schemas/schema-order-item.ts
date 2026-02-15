import { z } from "zod";
import { Prisma, order_items } from "@prisma/client";
import { Thumb } from "@radix-ui/react-switch";
import { th } from "date-fns/locale";

export type OrderItemType = order_items;
export type OrderItemWithDetailType = Prisma.order_itemsGetPayload<{
  include: {
    product_items: true;
  };
}>;

export const orderItemInputRequestSchema = z.object({
  id: z.number().optional(),
  order_id: z.coerce.number().int().min(1, "ID đơn hàng không được để trống"),
  product_item_id: z
    .number()
    .int()
    .min(1, "Mã sản phẩm con không được để trống"),
  quantity: z.coerce.number().int().min(1, "Số lượng không được để trống"),
});
export const orderItemInputSchema = z.object({
  order_id: z
    .number()
    .int()
    .min(1, "ID đơn hàng không được để trống")
    .optional(),
  product_item_id: z
    .number()
    .int()
    .min(1, "Mã sản phẩm  con không được để trống"),
  quantity: z.number().int().min(1, "Số lượng không được để trống"),
  product_name: z.string().min(1, "Tên sản phẩm không được để trống"),
  color_name: z.string().min(1, "Tên màu sắc không được để trống"),
  variant: z.string().min(1, "Tên phiên bản không được để trống"),
  price: z.number().min(0, "Giá mua không được để trống"),
  thumbnail: z.string().min(1, "Ảnh đại diện không được để trống"),
});
export type OrderItemInputRequestType = z.infer<
  typeof orderItemInputRequestSchema
>;

export type OrderItemInputType = z.infer<typeof orderItemInputSchema>;
