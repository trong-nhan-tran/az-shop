import { z } from "zod";
import { Prisma, news_feeds } from "@prisma/client";
import { Thumb } from "@radix-ui/react-switch";

export type NewsFeedType = news_feeds;

export const newFeedInputSchema = z.object({
  title: z.string().min(1, "Tiêu đề không được để trống"),
  slug: z.string().min(1, "Slug không được để trống"),
  thumbnail: z.string().min(1, "Ảnh đại diện không được để trống"),
  content: z.string().min(1, "Nội dung không được để trống"),
});

export type NewsFeedInputType = z.infer<typeof newFeedInputSchema>;
