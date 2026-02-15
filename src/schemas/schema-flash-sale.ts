import { z } from "zod";
import { Prisma, flash_sale } from "@prisma/client";

export type FlashSaleType = flash_sale;
export type FlashSaleWithDetailType = Prisma.flash_saleGetPayload<{
  include: {
    flash_sale_items: {
      include: {
        product_items: {
          include: {
            product_variants: true;
            product_colors: true;
          };
        };
      };
    };
  };
}>;

export const flashSaleInputSchema = z.object({
  name: z.string().min(1, "Tên khuyến mãi không được để trống"),
  start_at: z.coerce
    .date()
    .refine((date) => date instanceof Date && !isNaN(date.getTime()), {
      message: "Thời gian bắt đầu không hợp lệ",
    }),
  end_at: z.coerce
    .date()
    .refine((date) => date instanceof Date && !isNaN(date.getTime()), {
      message: "Thời gian kết thúc không hợp lệ",
    }),
  enable: z.boolean(),
});

export type FlashSaleInputType = z.infer<typeof flashSaleInputSchema>;
