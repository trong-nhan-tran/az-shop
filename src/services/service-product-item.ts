import prisma from "@/libs/prisma";
import { Prisma } from "@prisma/client";
import {
  productItemInputSchema,
  ProductItemInputType,
  ProductItemType,
} from "@/schemas";
import {
  successResponse,
  Response,
  validationErrorResponse,
  notFoundResponse,
  internalServerErrorResponse,
  badRequestResponse,
} from "@/libs/helper-response";

export const productItemService = {
  async create(
    data: ProductItemInputType
  ): Promise<Response<ProductItemType | null | string | string[]>> {
    try {
      const validationResult = productItemInputSchema.safeParse(data);
      if (!validationResult.success) {
        return validationErrorResponse(validationResult.error);
      }
      const created = await prisma.product_items.create({
        data: validationResult.data,
      });

      return successResponse(created, "Thêm sản phẩm con thành công", 201);
    } catch (error: any) {
      console.log("Lỗi thêm sản phẩm con:", error);
      return internalServerErrorResponse();
    }
  },

  async update(
    id: string,
    data: ProductItemInputType
  ): Promise<Response<ProductItemType | null | string | string[]>> {
    try {
      const validationResult = productItemInputSchema.safeParse(data);
      if (!validationResult.success) {
        return validationErrorResponse(validationResult.error);
      }

      const updated = await prisma.product_items.update({
        where: { id: +id },
        data: validationResult.data,
      });

      return successResponse(updated, "Cập nhật sản phẩm con thành công");
    } catch (error: any) {
      // Prisma record not found error
      if (error.code === "P2025") {
        return notFoundResponse("sản phẩm con không tồn tại");
      }
      // Prisma unique constraint error

      console.log("Lỗi cập nhật sản phẩm con:", error);
      return internalServerErrorResponse();
    }
  },

  async delete(id: string): Promise<Response<ProductItemType | null>> {
    try {
      const deleted = await prisma.product_items.delete({
        where: { id: +id },
      });

      return successResponse(deleted, "Xóa sản phẩm con thành công");
    } catch (error: any) {
      // Prisma record not found error
      if (error.code === "P2025") {
        return notFoundResponse("sản phẩm con không tồn tại");
      }
      console.log("Lỗi xóa sản phẩm con:", error);
      return internalServerErrorResponse();
    }
  },

  async getAll(
    where: Prisma.product_itemsWhereInput = {},
    options: {
      page?: number;
      pageSize?: number;
      orderBy?: Prisma.product_itemsOrderByWithRelationInput;
      include?: Prisma.product_itemsInclude;
    } = {}
  ): Promise<Response<ProductItemType[] | null>> {
    try {
      const { page = 1, pageSize, orderBy, include } = options;
      const skip = pageSize ? (page - 1) * pageSize : undefined;

      const [data, total] = await Promise.all([
        prisma.product_items.findMany({
          where,
          skip,
          take: pageSize,
          orderBy,
          include,
        }),
        prisma.product_items.count({ where }),
      ]);

      const totalPages = pageSize ? Math.ceil(total / pageSize) : 1;

      return successResponse(
        data,
        "Lấy sản phẩm con thành công",
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
      console.log("Lỗi lấy sản phẩm con:", error);
      return internalServerErrorResponse();
    }
  },

  async getById(
    id: string,
    include?: Prisma.product_itemsInclude
  ): Promise<Response<ProductItemType | null>> {
    try {
      const result = await prisma.product_items.findUnique({
        where: { id: Number(id) },
        include,
      });

      if (!result) {
        return notFoundResponse("sản phẩm con không tồn tại");
      }

      return successResponse(result, "Lấy sản phẩm con thành công");
    } catch (error) {
      console.log("Lỗi lấy sản phẩm con:", error);
      return internalServerErrorResponse();
    }
  },
};
