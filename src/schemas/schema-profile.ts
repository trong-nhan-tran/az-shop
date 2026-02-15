import { z } from "zod";
import { profiles, Prisma } from "@prisma/client";
export type ProfileType = profiles;
export type ProfileWithOrderType = Prisma.profilesGetPayload<{
  include: {
    orders: {
      include: {
        order_items: true;
      };
    };
  };
}>;
export const updateProfileSchema = z.object({
  name: z.string().min(1, "Tên không được để trống").optional(),
  avatar_url: z.string().url().nullable().optional(),
  phone: z.string().length(10, "Số điện thoại phải có 10 chữ số").optional(),
  address: z.string().max(255, "Địa chỉ quá dài").optional(),
});

export const updatePasswordSchema = z
  .object({
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
  });

export type UpdateProfileInputType = z.infer<typeof updateProfileSchema>;
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;
