import prisma from "@/libs/prisma";
import { Prisma } from "@prisma/client";
import {
  flashSaleItemInputSchema,
  FlashSaleItemInputType,
  FlashSaleItemType,
} from "@/schemas";
import {
  successResponse,
  Response,
  validationErrorResponse,
  notFoundResponse,
  internalServerErrorResponse,
} from "@/libs/helper-response";

export const flashSaleItemService = {
  async create(
    data: FlashSaleItemInputType
  ): Promise<Response<FlashSaleItemType | null>> {
    try {
      const validationResult = flashSaleItemInputSchema.safeParse(data);
      if (!validationResult.success) {
        return validationErrorResponse(validationResult.error);
      }
      const created = await prisma.flash_sale_items.create({
        data: validationResult.data,
      });

      return successResponse(
        created,
        "Thêm sản phẩm flash sale thành công",
        201
      );
    } catch (error: any) {
      console.log("Lỗi thêm sản phẩm flash sale:", error);
      return internalServerErrorResponse();
    }
  },

  async update(
    id: string,
    data: FlashSaleItemInputType
  ): Promise<Response<FlashSaleItemType | null>> {
    try {
      const validationResult = flashSaleItemInputSchema.safeParse(data);
      if (!validationResult.success) {
        return validationErrorResponse(validationResult.error);
      }

      const updated = await prisma.flash_sale_items.update({
        where: { id: +id },
        data: validationResult.data,
      });

      return successResponse(
        updated,
        "Cập nhật sản phẩm flash sale thành công"
      );
    } catch (error: any) {
      // Prisma record not found error
      if (error.code === "P2025") {
        return notFoundResponse("sản phẩm flash sale không tồn tại");
      }
      // Prisma unique constraint error

      console.log("Lỗi cập nhật sản phẩm flash sale:", error);
      return internalServerErrorResponse();
    }
  },

  async delete(id: string): Promise<Response<FlashSaleItemType | null>> {
    try {
      const deleted = await prisma.flash_sale_items.delete({
        where: { id: +id },
      });

      return successResponse(deleted, "Xóa sản phẩm flash sale thành công");
    } catch (error: any) {
      // Prisma record not found error
      if (error.code === "P2025") {
        return notFoundResponse("sản phẩm flash sale không tồn tại");
      }
      console.log("Lỗi xóa sản phẩm flash sale:", error);
      return internalServerErrorResponse();
    }
  },

  async getAll(
    where: Prisma.flash_sale_itemsWhereInput = {},
    options: {
      page?: number;
      pageSize?: number;
      orderBy?: Prisma.flash_sale_itemsOrderByWithRelationInput;
      include?: Prisma.flash_sale_itemsInclude;
    } = {}
  ): Promise<Response<FlashSaleItemType[] | null>> {
    try {
      const { page = 1, pageSize, orderBy, include } = options;
      const skip = pageSize ? (page - 1) * pageSize : undefined;

      const [data, total] = await Promise.all([
        prisma.flash_sale_items.findMany({
          where,
          skip,
          take: pageSize,
          orderBy,
          include,
        }),
        prisma.flash_sale_items.count({ where }),
      ]);

      const totalPages = pageSize ? Math.ceil(total / pageSize) : 1;

      return successResponse(
        data,
        "Lấy sản phẩm flash sale thành công",
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
      console.log("Lỗi lấy sản phẩm flash sale:", error);
      return internalServerErrorResponse();
    }
  },

  async getById(
    id: string,
    include?: Prisma.flash_sale_itemsInclude
  ): Promise<Response<FlashSaleItemType | null>> {
    try {
      const result = await prisma.flash_sale_items.findUnique({
        where: { id: Number(id) },
        include,
      });

      if (!result) {
        return notFoundResponse("sản phẩm flash sale không tồn tại");
      }

      return successResponse(result, "Lấy sản phẩm flash sale thành công");
    } catch (error) {
      console.log("Lỗi lấy sản phẩm flash sale:", error);
      return internalServerErrorResponse();
    }
  },
};
