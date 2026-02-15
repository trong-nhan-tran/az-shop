import prisma from "@/libs/prisma";
import { Prisma } from "@prisma/client";
import {
  orderInputSchema,
  orderInputSchemaBackend,
  OrderInputType,
  OrderInputTypeBackend,
  OrderItemInputType,
  OrderType,
} from "@/schemas";
import {
  successResponse,
  Response,
  validationErrorResponse,
  notFoundResponse,
  internalServerErrorResponse,
} from "@/libs/helper-response";
import { da } from "date-fns/locale";
export const orderService = {
  async create(data: {
    order: OrderInputTypeBackend;
    orderItems: OrderItemInputType[];
  }): Promise<Response<OrderType | null | string | string[]>> {
    try {
      const validationResult = orderInputSchemaBackend.safeParse(data.order);
      if (!validationResult.success) {
        return validationErrorResponse(validationResult.error);
      }
      const totalAmount = data.orderItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );

      const created = await prisma.orders.create({
        data: {
          ...data.order,
          total_amount: totalAmount,
          order_items: {
            create: data.orderItems,
          },
        },
        include: {
          order_items: true,
        },
      });

      return successResponse(created, "Thêm đơn hàng thành công", 201);
    } catch (error: any) {
      console.log("Lỗi thêm đơn hàng:", error);
      return internalServerErrorResponse();
    }
  },

  async update(
    id: string,
    data: OrderInputType,
  ): Promise<Response<OrderType | null | string | string[]>> {
    try {
      const validationResult = orderInputSchema.safeParse(data);
      if (!validationResult.success) {
        return validationErrorResponse(validationResult.error);
      }

      const updated = await prisma.orders.update({
        where: { id: +id },
        data: validationResult.data,
      });

      return successResponse(updated, "Cập nhật đơn hàng thành công");
    } catch (error: any) {
      // Prisma record not found error
      if (error.code === "P2025") {
        return notFoundResponse("đơn hàng không tồn tại");
      }
      // Prisma unique constraint error

      console.log("Lỗi cập nhật đơn hàng:", error);
      return internalServerErrorResponse();
    }
  },

  async delete(id: string): Promise<Response<OrderType | null>> {
    try {
      const deleted = await prisma.orders.delete({
        where: { id: +id },
      });

      return successResponse(deleted, "Xóa đơn hàng thành công");
    } catch (error: any) {
      // Prisma record not found error
      if (error.code === "P2025") {
        return notFoundResponse("đơn hàng không tồn tại");
      }
      console.log("Lỗi xóa đơn hàng:", error);
      return internalServerErrorResponse();
    }
  },

  async getAll(
    where: Prisma.ordersWhereInput = {},
    options: {
      page?: number;
      pageSize?: number;
      orderBy?: Prisma.ordersOrderByWithRelationInput;
      include?: Prisma.ordersInclude;
    } = {},
  ): Promise<Response<OrderType[] | null>> {
    try {
      const { page = 1, pageSize, orderBy, include } = options;
      const skip = pageSize ? (page - 1) * pageSize : undefined;

      const [data, total] = await Promise.all([
        prisma.orders.findMany({
          where,
          skip,
          take: pageSize,
          orderBy,
          include,
        }),
        prisma.orders.count({ where }),
      ]);

      const totalPages = pageSize ? Math.ceil(total / pageSize) : 1;

      return successResponse(
        data,
        "Lấy đơn hàng thành công",
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
      console.log("Lỗi lấy đơn hàng:", error);
      return internalServerErrorResponse();
    }
  },

  async getById(
    id: string,
    include?: Prisma.ordersInclude,
  ): Promise<Response<OrderType | null>> {
    try {
      const result = await prisma.orders.findUnique({
        where: { id: Number(id) },
        include,
      });

      if (!result) {
        return notFoundResponse("đơn hàng không tồn tại");
      }

      return successResponse(result, "Lấy đơn hàng thành công");
    } catch (error) {
      console.log("Lỗi lấy đơn hàng:", error);
      return internalServerErrorResponse();
    }
  },
};
