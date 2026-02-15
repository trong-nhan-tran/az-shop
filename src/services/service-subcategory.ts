import prisma from "@/libs/prisma";
import { Prisma } from "@prisma/client";
import {
  subcategoryInputSchema,
  SubcategoryInputType,
  SubcategoryType,
} from "@/schemas";
import {
  successResponse,
  Response,
  validationErrorResponse,
  notFoundResponse,
  internalServerErrorResponse,
  badRequestResponse,
} from "@/libs/helper-response";

export const subcategoryService = {
  async create(
    data: SubcategoryInputType
  ): Promise<Response<SubcategoryType | null>> {
    try {
      const validationResult = subcategoryInputSchema.safeParse(data);
      if (!validationResult.success) {
        return validationErrorResponse(validationResult.error);
      }
      const created = await prisma.subcategories.create({
        data: validationResult.data,
      });

      return successResponse(created, "Thêm danh mục con thành công", 201);
    } catch (error: any) {
      if (error.code === "P2002") {
        return badRequestResponse("Tên hoặc slug danh mục con đã tồn tại");
      }
      console.log("Lỗi thêm danh mục con:", error);
      return internalServerErrorResponse();
    }
  },

  async update(
    id: string,
    data: SubcategoryInputType
  ): Promise<Response<SubcategoryType | null>> {
    try {
      const validationResult = subcategoryInputSchema.safeParse(data);
      if (!validationResult.success) {
        return validationErrorResponse(validationResult.error);
      }

      const updated = await prisma.subcategories.update({
        where: { id: +id },
        data: validationResult.data,
      });

      return successResponse(updated, "Cập nhật danh mục con thành công");
    } catch (error: any) {
      // Prisma record not found error
      if (error.code === "P2025") {
        return notFoundResponse("Danh mục con không tồn tại");
      }
      // Prisma unique constraint error
      if (error.code === "P2002") {
        return badRequestResponse("Tên hoặc slug danh mục con đã tồn tại");
      }
      console.log("Lỗi cập nhật danh mục con:", error);
      return internalServerErrorResponse();
    }
  },

  async delete(id: string): Promise<Response<SubcategoryType | null>> {
    try {
      const deleted = await prisma.subcategories.delete({
        where: { id: +id },
      });

      return successResponse(deleted, "Xóa danh mục con thành công");
    } catch (error: any) {
      // Prisma record not found error
      if (error.code === "P2025") {
        return notFoundResponse("Danh mục con không tồn tại");
      }
      console.log("Lỗi xóa danh mục con:", error);
      return internalServerErrorResponse();
    }
  },

  async getAll(
    where: Prisma.subcategoriesWhereInput = {},
    options: {
      page?: number;
      pageSize?: number;
      orderBy?: Prisma.subcategoriesOrderByWithRelationInput;
      include?: Prisma.subcategoriesInclude;
    } = {}
  ): Promise<Response<SubcategoryType[] | null>> {
    try {
      const { page = 1, pageSize, orderBy, include } = options;
      const skip = pageSize ? (page - 1) * pageSize : undefined;

      const [data, total] = await Promise.all([
        prisma.subcategories.findMany({
          where,
          skip,
          take: pageSize,
          orderBy,
          include,
        }),
        prisma.subcategories.count({ where }),
      ]);

      const totalPages = pageSize ? Math.ceil(total / pageSize) : 1;

      return successResponse(
        data,
        "Lấy danh mục con thành công",
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
      console.log("Lỗi lấy danh mục con:", error);
      return internalServerErrorResponse();
    }
  },

  async getById(
    id: string,
    include?: Prisma.subcategoriesInclude
  ): Promise<Response<SubcategoryType | null>> {
    try {
      const result = await prisma.subcategories.findUnique({
        where: { id: Number(id) },
        include,
      });

      if (!result) {
        return notFoundResponse("Danh mục con không tồn tại");
      }

      return successResponse(result, "Lấy danh mục con thành công");
    } catch (error) {
      console.log("Lỗi lấy danh mục con:", error);
      return internalServerErrorResponse();
    }
  },

  async getBySlug(
    slug: string,
    include?: Prisma.subcategoriesInclude
  ): Promise<Response<SubcategoryType | null>> {
    try {
      const result = await prisma.subcategories.findUnique({
        where: { slug: slug },
        include,
      });

      if (!result) {
        return notFoundResponse("Danh mục con không tồn tại");
      }

      return successResponse(result, "Lấy danh mục con thành công");
    } catch (error) {
      console.log("Lỗi lấy danh mục con:", error);
      return internalServerErrorResponse();
    }
  },
};
