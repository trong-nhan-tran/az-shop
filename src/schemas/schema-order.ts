import { z } from "zod";
import { Prisma, orders } from "@prisma/client";
import { orderItemInputSchema } from "./schema-order-item";

export type OrderType = orders;
export type OrderWithDetailType = Prisma.ordersGetPayload<{
  include: {
    order_items: true;
  };
}>;

export const orderInputSchema = z.object({
  customer_name: z.string().min(1, "Họ tên là bắt buộc"),
  customer_phone: z.string().min(1, "Số điện thoại là bắt buộc"),
  address: z.string().min(1, "Địa chỉ là bắt buộc"),
  order_status: z
    .enum(["pending", "confirmed", "completed", "canceled"])
    .default("pending"),
  payment_method: z.enum(["cod", "momo"]).default("cod").default("cod"),
  payment_status: z.enum(["paid", "unpaid", "failed"]).default("unpaid"),
});
export const orderInputSchemaBackend = z.object({
  profile_id: z.string().min(1, "ID người dùng là bắt buộc"),
  customer_name: z.string().min(1, "Họ tên là bắt buộc"),
  customer_phone: z.string().min(1, "Số điện thoại là bắt buộc"),
  address: z.string().min(1, "Địa chỉ là bắt buộc"),
  order_status: z
    .enum(["pending", "confirmed", "completed", "canceled"])
    .default("pending"),
  payment_method: z.enum(["cod", "momo"]).default("cod").default("cod"),
  payment_status: z.enum(["paid", "unpaid", "failed"]).default("unpaid"),
});

export type OrderInputType = z.infer<typeof orderInputSchema>;
export type OrderInputTypeBackend = z.infer<typeof orderInputSchemaBackend>;
