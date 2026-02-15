import prisma from "@/libs/prisma";
import { Prisma } from "@prisma/client";
import {
  productColorInputSchema,
  ProductColorInputType,
  ProductColorType,
} from "@/schemas";
import {
  successResponse,
  Response,
  validationErrorResponse,
  notFoundResponse,
  internalServerErrorResponse,
} from "@/libs/helper-response";
import { storageService } from "@/services/service-storage";

export const productColorService = {
  async create(
    data: ProductColorInputType,
    thumbnailFile?: File | null,
    imageFiles?: File[] | null
  ): Promise<Response<ProductColorType | null | string | string[]>> {
    try {
      // Validation
      const validationResult = productColorInputSchema.safeParse(data);
      if (!validationResult.success) {
        return validationErrorResponse(validationResult.error);
      }

      // Upload thumbnail if provided
      if (thumbnailFile) {
        const uploadResult = await storageService.upload(
          thumbnailFile,
          "product_colors/thumbnails"
        );
        if (!uploadResult.success) return uploadResult;
        data.thumbnail = uploadResult.data as string;
      }

      // Upload images if provided
      if (imageFiles && imageFiles.length > 0) {
        const imageUrls: string[] = [];

        for (const imageFile of imageFiles) {
          const uploadResult = await storageService.upload(
            imageFile,
            "product_colors/images"
          );

          if (!uploadResult.success) {
            // Cleanup uploaded files on error
            if (data.thumbnail) {
              const extractedPath = storageService.extractPathFromUrl(
                data.thumbnail
              );
              if (extractedPath) {
                await storageService.delete(extractedPath);
              }
            }
            for (const url of imageUrls) {
              const extractedPath = storageService.extractPathFromUrl(url);
              if (extractedPath) {
                await storageService.delete(extractedPath);
              }
            }
            return uploadResult;
          }

          imageUrls.push(uploadResult.data as string);
        }

        data.images = [...(data.images || []), ...imageUrls];
      }

      // Persist to database
      const created = await prisma.product_colors.create({
        data: data,
      });

      return successResponse(created, "Thêm màu sản phẩm thành công", 201);
    } catch (error: any) {
      // Cleanup uploaded files on error
      if (data.thumbnail) {
        const extractedPath = storageService.extractPathFromUrl(data.thumbnail);
        if (extractedPath) {
          await storageService.delete(extractedPath);
        }
      }
      if (data.images) {
        for (const url of data.images) {
          const extractedPath = storageService.extractPathFromUrl(url);
          if (extractedPath) {
            await storageService.delete(extractedPath);
          }
        }
      }

      console.log("Lỗi thêm màu sản phẩm:", error);
      return internalServerErrorResponse("Lỗi server");
    }
  },

  async update(
    id: string,
    data: ProductColorInputType,
    thumbnailFile?: File | null,
    imageFiles?: File[] | null,
    removedImageUrls?: string[] | null
  ): Promise<Response<ProductColorType | null | string | string[]>> {
    let oldThumbnail: string | null = null;
    let oldImages: string[] = [];
    let newThumbnail: string | null = null;
    let newImages: string[] = [];

    try {
      // Validation
      const validationResult = productColorInputSchema.safeParse(data);
      if (!validationResult.success) {
        return validationErrorResponse(validationResult.error);
      }

      // Get old data before update
      const existing = await prisma.product_colors.findUnique({
        where: { id: +id },
        select: { thumbnail: true, images: true },
      });

      if (!existing) {
        return notFoundResponse("Màu sản phẩm không tồn tại");
      }

      oldThumbnail = existing.thumbnail;
      oldImages = existing.images || [];

      // Upload new thumbnail if provided
      if (thumbnailFile) {
        const uploadResult = await storageService.upload(
          thumbnailFile,
          "product-colors/thumbnails"
        );
        if (!uploadResult.success) return uploadResult;
        newThumbnail = uploadResult.data as string;
        data.thumbnail = newThumbnail;
      }

      // Upload new images if provided
      if (imageFiles && imageFiles.length > 0) {
        for (const imageFile of imageFiles) {
          const uploadResult = await storageService.upload(
            imageFile,
            "product-colors/images"
          );

          if (!uploadResult.success) {
            // Cleanup new uploaded files on error
            if (newThumbnail) {
              const extractedPath =
                storageService.extractPathFromUrl(newThumbnail);
              if (extractedPath) {
                await storageService.delete(extractedPath);
              }
            }
            for (const url of newImages) {
              const extractedPath = storageService.extractPathFromUrl(url);
              if (extractedPath) {
                await storageService.delete(extractedPath);
              }
            }
            return uploadResult;
          }

          newImages.push(uploadResult.data as string);
        }
      }

      // Remove deleted images from the images array
      let updatedImages = data.images || [];
      if (removedImageUrls && removedImageUrls.length > 0) {
        updatedImages = updatedImages.filter(
          (url) => !removedImageUrls.includes(url)
        );
      }

      // Add new uploaded images
      if (newImages.length > 0) {
        updatedImages = [...updatedImages, ...newImages];
      }

      data.images = updatedImages;

      // Update in database
      const updated = await prisma.product_colors.update({
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

      // Delete removed images after successful update
      if (removedImageUrls && removedImageUrls.length > 0 && updated) {
        for (const url of removedImageUrls) {
          const extractedPath = storageService.extractPathFromUrl(url);
          if (extractedPath) {
            const deleteResult = await storageService.delete(extractedPath);
            if (!deleteResult.success) {
              console.warn("Không thể xóa ảnh cũ:", extractedPath);
            }
          }
        }
      }

      return successResponse(updated, "Cập nhật màu sản phẩm thành công");
    } catch (error: any) {
      // Cleanup new uploaded files on error
      if (newThumbnail) {
        const extractedPath = storageService.extractPathFromUrl(newThumbnail);
        if (extractedPath) {
          await storageService.delete(extractedPath);
        }
      }
      for (const url of newImages) {
        const extractedPath = storageService.extractPathFromUrl(url);
        if (extractedPath) {
          await storageService.delete(extractedPath);
        }
      }

      // Prisma record not found error
      if (error.code === "P2025") {
        return notFoundResponse("Màu sản phẩm không tồn tại");
      }
      console.log("Lỗi cập nhật màu sản phẩm:", error);
      return internalServerErrorResponse();
    }
  },

  async delete(id: string): Promise<Response<ProductColorType | null>> {
    try {
      // Get data before delete
      const existing = await prisma.product_colors.findUnique({
        where: { id: +id },
        select: { thumbnail: true, images: true },
      });

      if (!existing) {
        return notFoundResponse("Màu sản phẩm không tồn tại");
      }

      // Delete from database
      const deleted = await prisma.product_colors.delete({
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

      // Delete all images after successful delete
      if (existing.images && existing.images.length > 0) {
        for (const url of existing.images) {
          const extractedPath = storageService.extractPathFromUrl(url);
          if (extractedPath) {
            const deleteResult = await storageService.delete(extractedPath);
            if (!deleteResult.success) {
              console.warn("Không thể xóa ảnh:", extractedPath);
            }
          }
        }
      }

      return successResponse(deleted, "Xóa màu sản phẩm thành công");
    } catch (error: any) {
      // Prisma record not found error
      if (error.code === "P2025") {
        return notFoundResponse("Màu sản phẩm không tồn tại");
      }
      console.log("Lỗi xóa màu sản phẩm:", error);
      return internalServerErrorResponse();
    }
  },

  async getAll(
    where: Prisma.product_colorsWhereInput = {},
    options: {
      page?: number;
      pageSize?: number;
      orderBy?: Prisma.product_colorsOrderByWithRelationInput;
      include?: Prisma.product_colorsInclude;
    } = {}
  ): Promise<Response<ProductColorType[] | null>> {
    try {
      const { page = 1, pageSize, orderBy, include } = options;
      const skip = pageSize ? (page - 1) * pageSize : undefined;

      const [data, total] = await Promise.all([
        prisma.product_colors.findMany({
          where,
          skip,
          take: pageSize,
          orderBy,
          include,
        }),
        prisma.product_colors.count({ where }),
      ]);

      const totalPages = pageSize ? Math.ceil(total / pageSize) : 1;

      return successResponse(
        data,
        "Lấy màu sản phẩm thành công",
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
      console.log("Lỗi lấy màu sản phẩm:", error);
      return internalServerErrorResponse();
    }
  },

  async getById(
    id: string,
    include?: Prisma.product_colorsInclude
  ): Promise<Response<ProductColorType | null>> {
    try {
      const result = await prisma.product_colors.findUnique({
        where: { id: +id },
        include,
      });

      if (!result) {
        return notFoundResponse("Màu sản phẩm không tồn tại");
      }

      return successResponse(result, "Lấy màu sản phẩm thành công");
    } catch (error) {
      console.log("Lỗi lấy màu sản phẩm:", error);
      return internalServerErrorResponse();
    }
  },
};
