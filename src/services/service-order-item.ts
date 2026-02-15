import prisma from "@/libs/prisma";
import { Prisma } from "@prisma/client";
import {
  orderItemInputSchema,
  orderItemInputRequestSchema,
  OrderItemInputType,
  OrderItemInputRequestType,
  OrderItemType,
} from "@/schemas";
import {
  successResponse,
  Response,
  validationErrorResponse,
  notFoundResponse,
  internalServerErrorResponse,
} from "@/libs/helper-response";

export const orderItemService = {
  async create(
    data: OrderItemInputRequestType
  ): Promise<Response<OrderItemType | null>> {
    try {
      const validationRequestResult =
        orderItemInputRequestSchema.safeParse(data);
      if (!validationRequestResult.success) {
        return validationErrorResponse(validationRequestResult.error);
      }
      const productItem = await prisma.product_items.findUnique({
        where: { id: +data.product_item_id },
        include: {
          product_colors: true,
          product_variants: true,
        },
      });

      if (!productItem) {
        return notFoundResponse("Sản phẩm con không tồn tại");
      }

      const orderItemData: OrderItemInputType = {
        order_id: data.order_id,
        product_item_id: data.product_item_id,
        quantity: data.quantity,
        price: productItem.price,
        color_name: productItem.product_colors.color_name,
        product_name: productItem.product_variants.name,
        variant: productItem.product_variants.variant,
      };
      const validationResult = orderItemInputSchema.safeParse(orderItemData);
      if (!validationResult.success) {
        return validationErrorResponse(validationResult.error);
      }
      const created = await prisma.order_items.create({
        data: validationResult.data,
      });

      return successResponse(created, "Thêm đơn hàng con thành công", 201);
    } catch (error: any) {
      console.log("Lỗi thêm đơn hàng con:", error);
      return internalServerErrorResponse();
    }
  },

  async update(
    id: string,
    data: OrderItemInputRequestType
  ): Promise<Response<OrderItemType | null | string | string[]>> {
    try {
      const validationRequestResult =
        orderItemInputRequestSchema.safeParse(data);
      if (!validationRequestResult.success) {
        return validationErrorResponse(validationRequestResult.error);
      }

      const productItem = await prisma.product_items.findUnique({
        where: { id: +data.product_item_id },
        include: {
          product_colors: true,
          product_variants: true,
        },
      });

      if (!productItem) {
        return notFoundResponse("Sản phẩm con không tồn tại");
      }

      const orderItemData: OrderItemInputType = {
        order_id: data.order_id,
        product_item_id: data.product_item_id,
        quantity: data.quantity,
        price: productItem.price,
        color_name: productItem.product_colors.color_name,
        product_name: productItem.product_variants.name,
        variant: productItem.product_variants.variant,
      };

      const validationResult = orderItemInputSchema.safeParse(orderItemData);
      if (!validationResult.success) {
        return validationErrorResponse(validationResult.error);
      }

      const updated = await prisma.order_items.update({
        where: { id: +id },
        data: validationResult.data,
      });

      return successResponse(updated, "Cập nhật đơn hàng con thành công");
    } catch (error: any) {
      // Prisma record not found error
      if (error.code === "P2025") {
        return notFoundResponse("đơn hàng con không tồn tại");
      }
      console.log("Lỗi cập nhật đơn hàng con:", error);
      return internalServerErrorResponse();
    }
  },

  async delete(id: string): Promise<Response<OrderItemType | null>> {
    try {
      const deleted = await prisma.order_items.delete({
        where: { id: +id },
      });

      return successResponse(deleted, "Xóa đơn hàng con thành công");
    } catch (error: any) {
      // Prisma record not found error
      if (error.code === "P2025") {
        return notFoundResponse("đơn hàng con không tồn tại");
      }
      console.log("Lỗi xóa đơn hàng con:", error);
      return internalServerErrorResponse();
    }
  },

  async getAll(
    where: Prisma.order_itemsWhereInput = {},
    options: {
      page?: number;
      pageSize?: number;
      orderBy?: Prisma.order_itemsOrderByWithRelationInput;
      include?: Prisma.order_itemsInclude;
    } = {}
  ): Promise<Response<OrderItemType[] | null>> {
    try {
      const { page = 1, pageSize, orderBy, include } = options;
      const skip = pageSize ? (page - 1) * pageSize : undefined;

      const [data, total] = await Promise.all([
        prisma.order_items.findMany({
          where,
          skip,
          take: pageSize,
          orderBy,
          include,
        }),
        prisma.order_items.count({ where }),
      ]);

      const totalPages = pageSize ? Math.ceil(total / pageSize) : 1;

      return successResponse(
        data,
        "Lấy đơn hàng con thành công",
        200,
        pageSize
          ? {
              page,
              pageSize,
              total,
              totalPages,
            }
          : undefined
      );
    } catch (error) {
      console.log("Lỗi lấy đơn hàng con:", error);
      return internalServerErrorResponse();
    }
  },

  async getById(
    id: string,
    include?: Prisma.order_itemsInclude
  ): Promise<Response<OrderItemType | null>> {
    try {
      const result = await prisma.order_items.findUnique({
        where: { id: Number(id) },
        include,
      });

      if (!result) {
        return notFoundResponse("đơn hàng con không tồn tại");
      }

      return successResponse(result, "Lấy đơn hàng con thành công");
    } catch (error) {
      console.log("Lỗi lấy đơn hàng con:", error);
      return internalServerErrorResponse();
    }
  },
};
