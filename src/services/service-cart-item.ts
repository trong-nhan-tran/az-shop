import prisma from "@/libs/prisma";
import { Prisma } from "@prisma/client";
import {
  cartItemInputSchema,
  CartItemInputType,
  CartItemType,
  CartItemWithDetailType,
} from "@/schemas";
import {
  successResponse,
  Response,
  validationErrorResponse,
  notFoundResponse,
  internalServerErrorResponse,
} from "@/libs/helper-response";

export const cartItemService = {
  async addToCart(
    data: CartItemInputType,
  ): Promise<Response<CartItemType | null | string | string[]>> {
    try {
      const validationResult = cartItemInputSchema.safeParse(data);
      if (!validationResult.success) {
        return validationErrorResponse(validationResult.error);
      }

      const result = await prisma.cart_items.upsert({
        where: {
          product_item_id_profile_id: {
            profile_id: data.profile_id,
            product_item_id: data.product_item_id,
          },
        },
        update: {
          quantity: { increment: data.quantity },
        },
        create: data,
      });

      return successResponse(result, "Thêm vào giỏ hàng thành công");
    } catch (error: any) {
      console.log("Lỗi thêm vào giỏ hàng:", error);
      return internalServerErrorResponse();
    }
  },

  async updateQuantity(
    data: CartItemInputType,
  ): Promise<Response<CartItemType | null | string | string[]>> {
    try {
      const validationResult = cartItemInputSchema.safeParse(data);
      if (!validationResult.success) {
        return validationErrorResponse(validationResult.error);
      }

      const result = await prisma.cart_items.upsert({
        where: {
          product_item_id_profile_id: {
            profile_id: data.profile_id,
            product_item_id: data.product_item_id,
          },
        },
        update: {
          quantity: data.quantity,
        },
        create: {
          profile_id: data.profile_id,
          product_item_id: data.product_item_id,
          quantity: data.quantity,
        },
      });

      return successResponse("Cập nhật số lượng thành công");
    } catch (error: any) {
      console.log("Lỗi cập nhật số lượng:", error);
      return internalServerErrorResponse();
    }
  },

  async delete(
    id: number,
    profile_id: string,
  ): Promise<Response<CartItemType | null>> {
    try {
      const deleted = await prisma.cart_items.delete({
        where: {
          id,
        },
      });

      return successResponse(deleted, "Xóa giỏ hàng thành công");
    } catch (error: any) {
      // Prisma record not found error
      if (error.code === "P2025") {
        return notFoundResponse("Sản phẩm không có trong giỏ hàng");
      }
      console.log("Lỗi xóa giỏ hàng:", error);
      return internalServerErrorResponse();
    }
  },

  async getAll(
    where: Prisma.cart_itemsWhereInput = {},
    options: {
      page?: number;
      pageSize?: number;
      orderBy?: Prisma.cart_itemsOrderByWithRelationInput;
      include?: Prisma.cart_itemsInclude;
    } = {},
  ): Promise<Response<CartItemType[] | null>> {
    try {
      const { page = 1, pageSize, orderBy, include } = options;
      const skip = pageSize ? (page - 1) * pageSize : undefined;

      const [data, total] = await Promise.all([
        prisma.cart_items.findMany({
          where,
          skip,
          take: pageSize,
          orderBy,
          include,
        }),
        prisma.cart_items.count({ where }),
      ]);

      const totalPages = pageSize ? Math.ceil(total / pageSize) : 1;

      return successResponse(
        data,
        "Lấy giỏ hàng thành công",
        200,
        pageSize
          ? {
              page,
              pageSize,
              total,
              totalPages,
            }
          : undefined,
      );
    } catch (error) {
      console.log("Lỗi lấy giỏ hàng:", error);
      return internalServerErrorResponse();
    }
  },

  async getCartForUser(
    profile_id: string,
  ): Promise<Response<CartItemWithDetailType[] | null>> {
    try {
      const result = await prisma.cart_items.findMany({
        where: { profile_id },
        include: {
          product_items: {
            include: {
              product_variants: true,
              product_colors: true,
            },
          },
        },
      });

      return successResponse(result, "Lấy giỏ hàng thành công");
    } catch (error) {
      console.log("Lỗi lấy giỏ hàng:", error);
      return internalServerErrorResponse();
    }
  },

  async getById(
    id: number,
    include?: Prisma.cart_itemsInclude,
  ): Promise<Response<CartItemType | null>> {
    try {
      const result = await prisma.cart_items.findUnique({
        where: {
          id,
        },
        include,
      });

      if (!result) {
        return notFoundResponse("Sản phẩm không có trong giỏ hàng");
      }

      return successResponse(result, "Lấy giỏ hàng thành công");
    } catch (error) {
      console.log("Lỗi lấy giỏ hàng:", error);
      return internalServerErrorResponse();
    }
  },
  async getTotalQuantity(profile_id: string): Promise<Response<number | null>> {
    try {
      const result = await prisma.cart_items.aggregate({
        where: { profile_id },
        _sum: {
          quantity: true,
        },
      });

      const total = result._sum.quantity || 0;

      return successResponse(total, "Lấy tổng số lượng giỏ hàng thành công");
    } catch (error) {
      console.log("Lỗi lấy tổng số lượng giỏ hàng:", error);
      return internalServerErrorResponse();
    }
  },

  async clearCart(profile_id: string): Promise<Response<null>> {
    try {
      await prisma.cart_items.deleteMany({
        where: { profile_id },
      });

      return successResponse(null, "Xóa giỏ hàng thành công");
    } catch (error) {
      console.log("Lỗi xóa giỏ hàng:", error);
      return internalServerErrorResponse();
    }
  },
};
