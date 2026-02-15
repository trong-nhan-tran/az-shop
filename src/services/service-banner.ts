import prisma from "@/libs/prisma";
import { Prisma } from "@prisma/client";
import { bannerInputSchema, BannerInputType, BannerType } from "@/schemas";
import {
  successResponse,
  Response,
  validationErrorResponse,
  notFoundResponse,
  internalServerErrorResponse,
} from "@/libs/helper-response";
import { storageService } from "@/services/service-storage";

export const bannerService = {
  async create(
    data: BannerInputType,
    desktopFile?: File | null,
    mobileFile?: File | null
  ): Promise<Response<any>> {
    try {
      // Validation
      const validationResult = bannerInputSchema.safeParse(data);
      if (!validationResult.success) {
        return validationErrorResponse(validationResult.error);
      }

      // Upload desktop image if provided
      if (desktopFile) {
        const uploadResult = await storageService.upload(
          desktopFile,
          "banners"
        );
        if (!uploadResult.success) return uploadResult;
        data.desktop_image = uploadResult.data as string;
      }

      // Upload mobile image if provided
      if (mobileFile) {
        const uploadResult = await storageService.upload(mobileFile, "banners");
        if (!uploadResult.success) {
          // Cleanup desktop image if already uploaded
          if (data.desktop_image) {
            const extractedPath = storageService.extractPathFromUrl(
              data.desktop_image
            );
            if (extractedPath) {
              await storageService.delete(extractedPath);
            }
          }
          return uploadResult;
        }
        data.mobile_image = uploadResult.data as string;
      }

      // Persist to database
      const created = await prisma.banners.create({
        data: data,
      });

      return successResponse(created, "Thêm banner thành công", 201);
    } catch (error: any) {
      // Cleanup uploaded images on error
      if (data.desktop_image) {
        const extractedPath = storageService.extractPathFromUrl(
          data.desktop_image
        );
        if (extractedPath) {
          await storageService.delete(extractedPath);
        }
      }
      if (data.mobile_image) {
        const extractedPath = storageService.extractPathFromUrl(
          data.mobile_image
        );
        if (extractedPath) {
          await storageService.delete(extractedPath);
        }
      }

      console.log("Lỗi thêm banner:", error);
      return internalServerErrorResponse("Lỗi server");
    }
  },

  async update(
    id: string,
    data: BannerInputType,
    desktopFile?: File | null,
    mobileFile?: File | null
  ): Promise<Response<any>> {
    let oldDesktopImage: string | null = null;
    let oldMobileImage: string | null = null;
    let newDesktopImage: string | null = null;
    let newMobileImage: string | null = null;

    try {
      // Validation
      const validationResult = bannerInputSchema.safeParse(data);
      if (!validationResult.success) {
        return validationErrorResponse(validationResult.error);
      }

      // Get old images before update
      const existing = await prisma.banners.findUnique({
        where: { id: +id },
        select: { desktop_image: true, mobile_image: true },
      });

      if (!existing) {
        return notFoundResponse("Banner không tồn tại");
      }

      oldDesktopImage = existing.desktop_image;
      oldMobileImage = existing.mobile_image;

      // Upload desktop image if provided
      if (desktopFile) {
        const uploadResult = await storageService.upload(
          desktopFile,
          "banners"
        );
        if (!uploadResult.success) return uploadResult;
        newDesktopImage = uploadResult.data as string;
        data.desktop_image = newDesktopImage;
      }

      // Upload mobile image if provided
      if (mobileFile) {
        const uploadResult = await storageService.upload(mobileFile, "banners");
        if (!uploadResult.success) {
          // Cleanup new desktop image if already uploaded
          if (newDesktopImage) {
            const extractedPath =
              storageService.extractPathFromUrl(newDesktopImage);
            if (extractedPath) {
              await storageService.delete(extractedPath);
            }
          }
          return uploadResult;
        }
        newMobileImage = uploadResult.data as string;
        data.mobile_image = newMobileImage;
      }

      // Update in database
      const updated = await prisma.banners.update({
        where: { id: +id },
        data: data,
      });

      // Delete old images after successful update
      if (desktopFile && oldDesktopImage && updated) {
        const extractedPath =
          storageService.extractPathFromUrl(oldDesktopImage);
        if (extractedPath) {
          const deleteResult = await storageService.delete(extractedPath);
          if (!deleteResult.success) {
            console.warn("Không thể xóa desktop image cũ:", extractedPath);
          }
        }
      }

      if (mobileFile && oldMobileImage && updated) {
        const extractedPath = storageService.extractPathFromUrl(oldMobileImage);
        if (extractedPath) {
          const deleteResult = await storageService.delete(extractedPath);
          if (!deleteResult.success) {
            console.warn("Không thể xóa mobile image cũ:", extractedPath);
          }
        }
      }

      return successResponse(updated, "Cập nhật banner thành công");
    } catch (error: any) {
      // Cleanup new uploaded images on error
      if (newDesktopImage) {
        const extractedPath =
          storageService.extractPathFromUrl(newDesktopImage);
        if (extractedPath) {
          await storageService.delete(extractedPath);
        }
      }
      if (newMobileImage) {
        const extractedPath = storageService.extractPathFromUrl(newMobileImage);
        if (extractedPath) {
          await storageService.delete(extractedPath);
        }
      }

      // Prisma record not found error
      if (error.code === "P2025") {
        return notFoundResponse("Banner không tồn tại");
      }
      console.log("Lỗi cập nhật banner:", error);
      return internalServerErrorResponse();
    }
  },

  async delete(id: string): Promise<Response<any>> {
    try {
      // Get images before delete
      const existing = await prisma.banners.findUnique({
        where: { id: +id },
        select: { desktop_image: true, mobile_image: true },
      });

      if (!existing) {
        return notFoundResponse("Banner không tồn tại");
      }

      // Delete from database
      const deleted = await prisma.banners.delete({
        where: { id: +id },
      });

      // Delete desktop image after successful delete
      if (existing.desktop_image) {
        const extractedPath = storageService.extractPathFromUrl(
          existing.desktop_image
        );
        if (extractedPath) {
          const deleteResult = await storageService.delete(extractedPath);
          if (!deleteResult.success) {
            console.warn("Không thể xóa desktop image:", extractedPath);
          }
        }
      }

      // Delete mobile image after successful delete
      if (existing.mobile_image) {
        const extractedPath = storageService.extractPathFromUrl(
          existing.mobile_image
        );
        if (extractedPath) {
          const deleteResult = await storageService.delete(extractedPath);
          if (!deleteResult.success) {
            console.warn("Không thể xóa mobile image:", extractedPath);
          }
        }
      }

      return successResponse(deleted, "Xóa banner thành công");
    } catch (error: any) {
      // Prisma record not found error
      if (error.code === "P2025") {
        return notFoundResponse("Banner không tồn tại");
      }
      console.log("Lỗi xóa banner:", error);
      return internalServerErrorResponse();
    }
  },

  async getAll(
    where: Prisma.bannersWhereInput = {},
    options: {
      page?: number;
      pageSize?: number;
      orderBy?: Prisma.bannersOrderByWithRelationInput;
      include?: Prisma.bannersInclude;
    } = {}
  ): Promise<Response<any>> {
    try {
      const { page = 1, pageSize, orderBy, include } = options;
      const skip = pageSize ? (page - 1) * pageSize : undefined;

      const [data, total] = await Promise.all([
        prisma.banners.findMany({
          where,
          skip,
          take: pageSize,
          orderBy,
          include,
        }),
        prisma.banners.count({ where }),
      ]);

      const totalPages = pageSize ? Math.ceil(total / pageSize) : 1;

      return successResponse(
        data,
        "Lấy banner thành công",
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
      console.log("Lỗi lấy banner:", error);
      return internalServerErrorResponse();
    }
  },

  async getById(
    id: string,
    include?: Prisma.bannersInclude
  ): Promise<Response<any>> {
    try {
      const result = await prisma.banners.findUnique({
        where: { id: +id },
        include,
      });

      if (!result) {
        return notFoundResponse("Banner không tồn tại");
      }

      return successResponse(result, "Lấy banner thành công");
    } catch (error) {
      console.log("Lỗi lấy banner:", error);
      return internalServerErrorResponse();
    }
  },

  async getHomeBanners(): Promise<Response<any>> {
    try {
      const result = await prisma.banners.findMany({
        where: {
          categories: {
            slug: "home",
          },
        },
        orderBy: { order_number: "asc" },
      });

      if (!result) {
        return notFoundResponse("Không tìm thấy banner");
      }

      return successResponse(result, "Lấy banner trang chủ thành công");
    } catch (error) {
      console.log("Lỗi lấy banner trang chủ:", error);
      return internalServerErrorResponse();
    }
  },

  async getByCategorySlug(
    categorySlug: string
  ): Promise<Response<BannerType[] | null>> {
    try {
      const result = await prisma.banners.findMany({
        where: {
          OR: [
            {
              categories: {
                slug: categorySlug,
              },
            },
            {
              categories: {
                subcategories: {
                  some: {
                    slug: categorySlug,
                  },
                },
              },
            },
          ],
        },
      });

      if (!result) {
        return notFoundResponse("Không tìm thấy banner");
      }

      return successResponse(result, "Lấy banner theo danh mục thành công");
    } catch (error) {
      console.log("Lỗi lấy banner theo danh mục:", error);
      return internalServerErrorResponse();
    }
  },
};
