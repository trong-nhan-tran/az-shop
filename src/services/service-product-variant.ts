import prisma from "@/libs/prisma";
import { Prisma } from "@prisma/client";
import {
  productVariantInputSchema,
  ProductVariantInputType,
  ProductVariantType,
  ProductVariantWithColorType,
  ProductVariantWithDetailType,
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

export const productVariantService = {
  async create(
    data: ProductVariantInputType,
    thumbnailFile?: File | null
  ): Promise<Response<ProductVariantType | null | string | string[]>> {
    try {
      // Validation
      const validationResult = productVariantInputSchema.safeParse(data);
      if (!validationResult.success) {
        return validationErrorResponse(validationResult.error);
      }

      // File upload if provided
      if (thumbnailFile) {
        const uploadResult = await storageService.upload(
          thumbnailFile,
          "product_variants"
        );
        if (!uploadResult.success) return uploadResult;
        data.thumbnail = uploadResult.data as string;
      }

      // Persist to database - để Prisma tự check unique constraint
      const created = await prisma.product_variants.create({
        data: data,
      });

      return successResponse(
        created,
        "Thêm phiên bản sản phẩm thành công",
        201
      );
    } catch (error: any) {
      // Prisma unique constraint error
      if (error.code === "P2002") {
        return badRequestResponse(
          "Tên hoặc slug phiên bản sản phẩm đã tồn tại"
        );
      }
      console.log("Lỗi thêm phiên bản sản phẩm:", error);
      return internalServerErrorResponse("Lỗi server");
    }
  },

  async update(
    id: string,
    data: ProductVariantInputType,
    thumbnailFile?: File | null
  ): Promise<Response<ProductVariantType | null | string | string[]>> {
    let oldThumbnail: string | null = null;

    try {
      // Validation
      const validationResult = productVariantInputSchema.safeParse(data);
      if (!validationResult.success) {
        return validationErrorResponse(validationResult.error);
      }

      // Get old thumbnail trước khi update
      const existing = await prisma.product_variants.findUnique({
        where: { id: +id },
        select: { thumbnail: true },
      });

      if (!existing) {
        return notFoundResponse("Phiên bản sản phẩm không tồn tại");
      }

      oldThumbnail = existing.thumbnail;

      // File upload if provided
      if (thumbnailFile) {
        const uploadResponse = await storageService.upload(
          thumbnailFile,
          "product_variants"
        );
        if (!uploadResponse.success) return uploadResponse;
        data.thumbnail = uploadResponse.data as string;
      }

      // Update in database - Prisma sẽ check unique constraint và existence
      const updated = await prisma.product_variants.update({
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

      return successResponse(updated, "Cập nhật phiên bản sản phẩm thành công");
    } catch (error: any) {
      // Prisma record not found error
      if (error.code === "P2025") {
        return notFoundResponse("Phiên bản sản phẩm không tồn tại");
      }
      // Prisma unique constraint error
      if (error.code === "P2002") {
        return badRequestResponse(
          "Tên hoặc slug phiên bản sản phẩm đã tồn tại"
        );
      }
      console.log("Lỗi cập nhật phiên bản sản phẩm:", error);
      return internalServerErrorResponse();
    }
  },

  async delete(id: string): Promise<Response<ProductVariantType | null>> {
    try {
      // Get thumbnail trước khi xóa
      const existing = await prisma.product_variants.findUnique({
        where: { id: +id },
        select: { thumbnail: true },
      });

      if (!existing) {
        return notFoundResponse("Phiên bản sản phẩm không tồn tại");
      }

      // Delete from database
      const deleted = await prisma.product_variants.delete({
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

      return successResponse(deleted, "Xóa phiên bản sản phẩm thành công");
    } catch (error: any) {
      // Prisma record not found error
      if (error.code === "P2025") {
        return notFoundResponse("Phiên bản sản phẩm không tồn tại");
      }
      console.log("Lỗi xóa phiên bản sản phẩm:", error);
      return internalServerErrorResponse();
    }
  },

  async getAll(
    where: Prisma.product_variantsWhereInput = {},
    options: {
      page?: number;
      pageSize?: number;
      orderBy?: Prisma.product_variantsOrderByWithRelationInput;
      include?: Prisma.product_variantsInclude;
    } = {}
  ): Promise<Response<ProductVariantType[] | null>> {
    try {
      const { page = 1, pageSize, orderBy, include } = options;
      const skip = pageSize ? (page - 1) * pageSize : undefined;

      const [data, total] = await Promise.all([
        prisma.product_variants.findMany({
          where,
          skip,
          take: pageSize,
          orderBy,
          include,
        }),
        prisma.product_variants.count({ where }),
      ]);

      const totalPages = pageSize ? Math.ceil(total / pageSize) : 1;

      return successResponse(
        data,
        "Lấy phiên bản sản phẩm thành công",
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
      console.log("Lỗi lấy phiên bản sản phẩm:", error);
      return internalServerErrorResponse();
    }
  },

  async getById(
    id: string,
    include?: Prisma.product_variantsInclude
  ): Promise<Response<ProductVariantType | null>> {
    try {
      const result = await prisma.product_variants.findUnique({
        where: { id: Number(id) },
        include,
      });

      if (!result) {
        return notFoundResponse("Phiên bản sản phẩm không tồn tại");
      }

      return successResponse(result, "Lấy phiên bản sản phẩm thành công");
    } catch (error) {
      console.log("Lỗi lấy phiên bản sản phẩm:", error);
      return internalServerErrorResponse();
    }
  },

  async getBySlug(
    slug: string
  ): Promise<Response<ProductVariantWithDetailType | null>> {
    try {
      const result = await prisma.product_variants.findUnique({
        where: { slug },
        include: {
          products: {
            include: { product_variants: true },
          },
          product_items: {
            include: { product_colors: true },
          },
        },
      });

      if (!result) {
        return notFoundResponse("Phiên bản sản phẩm không tồn tại");
      }

      return successResponse(result, "Lấy phiên bản sản phẩm thành công");
    } catch (error) {
      console.log("Lỗi lấy phiên bản sản phẩm:", error);
      return internalServerErrorResponse();
    }
  },

  async getAllByProductId(
    productId: number
  ): Promise<Response<ProductVariantWithColorType[] | null>> {
    try {
      const result = await prisma.product_variants.findMany({
        where: { product_id: productId },
        include: {
          product_items: {
            include: { product_colors: true },
          },
        },
      });

      return successResponse(
        result,
        `Lấy tất cả phiên bản của sản phẩm có ID ${productId} thành công`
      );
    } catch (error) {
      console.log("Lỗi lấy phiên bản sản phẩm:", error);
      return internalServerErrorResponse();
    }
  },

  async getAllByCategorySlug(
    slug: string,
    options: {
      page?: number;
      pageSize?: number;
      orderBy?: Prisma.product_variantsOrderByWithRelationInput;
      include?: Prisma.product_variantsInclude;
    } = {}
  ): Promise<Response<ProductVariantType[] | null>> {
    try {
      const { page = 1, pageSize, orderBy, include } = options;
      const skip = pageSize ? (page - 1) * pageSize : undefined;
      const where: Prisma.product_variantsWhereInput = {
        OR: [
          {
            products: {
              subcategories: {
                slug,
              },
            },
          },
          {
            products: {
              subcategories: {
                categories: {
                  slug,
                },
              },
            },
          },
        ],
      };

      const [data, total] = await Promise.all([
        prisma.product_variants.findMany({
          where,
          skip,
          take: pageSize,
          orderBy,
          include,
        }),
        prisma.product_variants.count({ where }),
      ]);

      const totalPages = pageSize ? Math.ceil(total / pageSize) : 1;

      return successResponse(
        data,
        "Lấy phiên bản sản phẩm thành công",
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
      console.log("Lỗi lấy phiên bản sản phẩm:", error);
      return internalServerErrorResponse();
    }
  },
};
