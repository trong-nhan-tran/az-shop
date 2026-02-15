import prisma from "@/libs/prisma";
import { Prisma } from "@prisma/client";
import {
  featuredItemInputSchema,
  FeaturedItemInputType,
  FeaturedItemType,
  FeaturedItemWithDetailsType,
} from "@/schemas";
import {
  successResponse,
  Response,
  validationErrorResponse,
  notFoundResponse,
  internalServerErrorResponse,
} from "@/libs/helper-response";

export const featuredItemService = {
  async create(
    data: FeaturedItemInputType
  ): Promise<Response<FeaturedItemType | null | string | string[]>> {
    try {
      const validationResult = featuredItemInputSchema.safeParse(data);
      if (!validationResult.success) {
        return validationErrorResponse(validationResult.error);
      }
      const created = await prisma.featured_items.create({
        data: validationResult.data,
      });

      return successResponse(created, "Thêm sản phẩm nổi bật thành công", 201);
    } catch (error: any) {
      console.log("Lỗi thêm sản phẩm nổi bật:", error);
      return internalServerErrorResponse();
    }
  },

  async update(
    id: string,
    data: FeaturedItemInputType
  ): Promise<Response<FeaturedItemType | null | string | string[]>> {
    try {
      const validationResult = featuredItemInputSchema.safeParse(data);
      if (!validationResult.success) {
        return validationErrorResponse(validationResult.error);
      }

      const updated = await prisma.featured_items.update({
        where: { id: +id },
        data: validationResult.data,
      });

      return successResponse(updated, "Cập nhật sản phẩm nổi bật thành công");
    } catch (error: any) {
      // Prisma record not found error
      if (error.code === "P2025") {
        return notFoundResponse("sản phẩm nổi bật không tồn tại");
      }
      // Prisma unique constraint error

      console.log("Lỗi cập nhật sản phẩm nổi bật:", error);
      return internalServerErrorResponse();
    }
  },

  async delete(id: string): Promise<Response<FeaturedItemType | null>> {
    try {
      const deleted = await prisma.featured_items.delete({
        where: { id: +id },
      });

      return successResponse(deleted, "Xóa sản phẩm nổi bật thành công");
    } catch (error: any) {
      // Prisma record not found error
      if (error.code === "P2025") {
        return notFoundResponse("sản phẩm nổi bật không tồn tại");
      }
      console.log("Lỗi xóa sản phẩm nổi bật:", error);
      return internalServerErrorResponse();
    }
  },

  async getAll(
    where: Prisma.featured_itemsWhereInput = {},
    options: {
      page?: number;
      pageSize?: number;
      orderBy?: Prisma.featured_itemsOrderByWithRelationInput;
      include?: Prisma.featured_itemsInclude;
    } = {}
  ): Promise<Response<FeaturedItemType[] | null>> {
    try {
      const { page = 1, pageSize, orderBy, include } = options;
      const skip = pageSize ? (page - 1) * pageSize : undefined;

      const [data, total] = await Promise.all([
        prisma.featured_items.findMany({
          where,
          skip,
          take: pageSize,
          orderBy,
          include,
        }),
        prisma.featured_items.count({ where }),
      ]);

      const totalPages = pageSize ? Math.ceil(total / pageSize) : 1;

      return successResponse(
        data,
        "Lấy sản phẩm nổi bật thành công",
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
      console.log("Lỗi lấy sản phẩm nổi bật:", error);
      return internalServerErrorResponse();
    }
  },

  async getById(
    id: string,
    include?: Prisma.featured_itemsInclude
  ): Promise<Response<FeaturedItemType | null>> {
    try {
      const result = await prisma.featured_items.findUnique({
        where: { id: Number(id) },
        include,
      });

      if (!result) {
        return notFoundResponse("sản phẩm nổi bật không tồn tại");
      }

      return successResponse(result, "Lấy sản phẩm nổi bật thành công");
    } catch (error) {
      console.log("Lỗi lấy sản phẩm nổi bật:", error);
      return internalServerErrorResponse();
    }
  },
};
