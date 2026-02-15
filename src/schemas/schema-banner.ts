import { z } from "zod";
import { banners, Prisma } from "@prisma/client";

export type BannerType = banners;
export type BannerWithDetailType = Prisma.bannersGetPayload<{
  include: {
    categories: true;
  };
}>;

export const bannerInputSchema = z.object({
  desktop_image: z.string().url("URL không hợp lệ"), // Updated
  mobile_image: z.string().url("URL không hợp lệ").optional().nullable(), // Updated
  category_id: z.number().int().optional().nullable(),
  direct_link: z.string().optional().nullable(),
  order_number: z.number().int(),
});

export type BannerInputType = z.infer<typeof bannerInputSchema>;
