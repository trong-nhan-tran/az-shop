import prisma from "@/libs/prisma";
import { Prisma } from "@prisma/client";
import {
  categoryInputSchema,
  CategoryInputType,
  CategoryType,
  CategoryWithFeaturedItemsType,
  CategoryWithSubType,
} from "@/schemas";
import {
  successResponse,
  Response,
  validationErrorResponse,
  notFoundResponse,
  internalServerErrorResponse,
  badRequestResponse,
} from "@/libs/helper-response";
import { storageService } from "@/services/service-storage";

export const categoryService = {
  async create(
    data: CategoryInputType,
    thumbnailFile?: File | null
  ): Promise<Response<CategoryType | null | string | string[]>> {
    try {
      // Validation
      const validationResult = categoryInputSchema.safeParse(data);
      if (!validationResult.success) {
        return validationErrorResponse(validationResult.error);
      }

      // File upload if provided
      if (thumbnailFile) {
        const uploadResult = await storageService.upload(
          thumbnailFile,
          "categories"
        );
        if (!uploadResult.success) return uploadResult;
        data.thumbnail = uploadResult.data as string;
      }

      // Persist to database - để Prisma tự check unique constraint
      const created = await prisma.categories.create({
        data: data,
      });

      return successResponse(created, "Thêm danh mục thành công", 201);
    } catch (error: any) {
      // Prisma unique constraint error
      if (error.code === "P2002") {
        return badRequestResponse("Tên hoặc slug danh mục đã tồn tại");
      }
      console.log("Lỗi thêm danh mục:", error);
      return internalServerErrorResponse("Lỗi server");
    }
  },

  async update(
    id: string,
    data: CategoryInputType,
    thumbnailFile?: File | null
  ): Promise<Response<CategoryType | null | string | string[]>> {
    let oldThumbnail: string | null = null;

    try {
      // Validation
      const validationResult = categoryInputSchema.safeParse(data);
      if (!validationResult.success) {
        return validationErrorResponse(validationResult.error);
      }

      // Get old thumbnail trước khi update
      const existing = await prisma.categories.findUnique({
        where: { id: +id },
        select: { thumbnail: true },
      });

      if (!existing) {
        return notFoundResponse("Danh mục không tồn tại");
      }

      oldThumbnail = existing.thumbnail;

      // File upload if provided
      if (thumbnailFile) {
        const uploadResponse = await storageService.upload(
          thumbnailFile,
          "categories"
        );
        if (!uploadResponse.success) return uploadResponse;
        data.thumbnail = uploadResponse.data as string;
      }

      // Update in database - Prisma sẽ check unique constraint và existence
      const updated = await prisma.categories.update({
        where: { id: +id },
        data: data,
      });

      // Delete old thumbnail after successful update
      if (thumbnailFile && oldThumbnail && updated) {
        const extractedPath = storageService.extractPathFromUrl(oldThumbnail);
        if (extractedPath) {
          const deleteResult = await storageService.delete(extractedPath);
          if (!deleteResult.success) {
            console.warn("Không thể xóa thumbnail cũ:", extractedPath);
          }
        }
      }

      return successResponse(updated, "Cập nhật danh mục thành công");
    } catch (error: any) {
      // Prisma record not found error
      if (error.code === "P2025") {
        return notFoundResponse("Danh mục không tồn tại");
      }
      // Prisma unique constraint error
      if (error.code === "P2002") {
        return badRequestResponse("Tên hoặc slug danh mục đã tồn tại");
      }
      console.log("Lỗi cập nhật danh mục:", error);
      return internalServerErrorResponse();
    }
  },

  async delete(id: string): Promise<Response<CategoryType | null>> {
    try {
      // Get thumbnail trước khi xóa
      const existing = await prisma.categories.findUnique({
        where: { id: +id },
        select: { thumbnail: true },
      });

      if (!existing) {
        return notFoundResponse("Danh mục không tồn tại");
      }

      // Delete from database
      const deleted = await prisma.categories.delete({
        where: { id: +id },
      });

      // Delete thumbnail after successful delete
      if (existing.thumbnail) {
        const extractedPath = storageService.extractPathFromUrl(
          existing.thumbnail
        );
        if (extractedPath) {
          const deleteResult = await storageService.delete(extractedPath);
          if (!deleteResult.success) {
            console.warn("Không thể xóa thumbnail:", extractedPath);
          }
        }
      }

      return successResponse(deleted, "Xóa danh mục thành công");
    } catch (error: any) {
      // Prisma record not found error
      if (error.code === "P2025") {
        return notFoundResponse("Danh mục không tồn tại");
      }
      console.log("Lỗi xóa danh mục:", error);
      return internalServerErrorResponse();
    }
  },

  async getAll(
    where: Prisma.categoriesWhereInput = {},
    options: {
      page?: number;
      pageSize?: number;
      orderBy?: Prisma.categoriesOrderByWithRelationInput;
      include?: Prisma.categoriesInclude;
    } = {}
  ): Promise<
    Response<CategoryWithFeaturedItemsType[] | CategoryType[] | null>
  > {
    try {
      const { page = 1, pageSize, orderBy, include } = options;
      const skip = pageSize ? (page - 1) * pageSize : undefined;

      const [data, total] = await Promise.all([
        prisma.categories.findMany({
          where,
          skip,
          take: pageSize,
          orderBy,
          include,
        }),
        prisma.categories.count({ where }),
      ]);

      const totalPages = pageSize ? Math.ceil(total / pageSize) : 1;

      return successResponse(
        data,
        "Lấy danh mục thành công",
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
      console.log("Lỗi lấy danh mục:", error);
      return internalServerErrorResponse();
    }
  },

  async getById(
    id: string,
    include?: Prisma.categoriesInclude
  ): Promise<Response<CategoryType | null>> {
    try {
      const result = await prisma.categories.findUnique({
        where: { id: Number(id) },
        include,
      });

      if (!result) {
        return notFoundResponse("Danh mục không tồn tại");
      }

      return successResponse(result, "Lấy danh mục thành công");
    } catch (error) {
      console.log("Lỗi lấy danh mục:", error);
      return internalServerErrorResponse();
    }
  },

  async getBySlug(slug: string): Promise<Response<CategoryWithSubType | null>> {
    try {
      const result = await prisma.categories.findFirst({
        where: {
          OR: [
            {
              slug: slug,
            },
            {
              subcategories: {
                some: { slug: slug },
              },
            },
          ],
        },
        include: {
          subcategories: {
            orderBy: { order_number: "asc" },
          },
        },
      });

      if (!result) {
        return notFoundResponse("Danh mục không tồn tại");
      }

      return successResponse(result, "Lấy danh mục thành công");
    } catch (error) {
      console.log("Lỗi lấy danh mục:", error);
      return internalServerErrorResponse();
    }
  },

  async getAllCategoryWithFeaturedItems(): Promise<
    Response<CategoryWithFeaturedItemsType[] | null>
  > {
    try {
      const data = await prisma.categories.findMany({
        include: {
          featured_items: {
            include: {
              product_variants: true,
            },
            orderBy: { order_number: "asc" },
          },
        },
        orderBy: { order_number: "asc" },
      });

      return successResponse(
        data,
        "Lấy danh mục với sản phẩm nổi bật thành công"
      );
    } catch (error) {
      console.log("Lỗi lấy danh mục với sản phẩm nổi bật:", error);
      return internalServerErrorResponse();
    }
  },
};
