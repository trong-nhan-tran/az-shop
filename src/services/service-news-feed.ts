import prisma from "@/libs/prisma";
import { Prisma } from "@prisma/client";
import { newFeedInputSchema, NewsFeedInputType, NewsFeedType } from "@/schemas";
import {
  successResponse,
  Response,
  validationErrorResponse,
  notFoundResponse,
  internalServerErrorResponse,
  badRequestResponse,
} from "@/libs/helper-response";
import { storageService } from "./service-storage";

export const newsFeedService = {
  async create(
    data: NewsFeedInputType,
    thumbnailFile?: File | null
  ): Promise<Response<NewsFeedType | null | string | string[]>> {
    try {
      console.log("Service create - data:", data);
      console.log("Service create - thumbnailFile:", thumbnailFile);

      // Validation
      const validationResult = newFeedInputSchema.safeParse(data);
      if (!validationResult.success) {
        console.log("Validation error:", validationResult.error.errors);
        return validationErrorResponse(validationResult.error);
      }

      // Kiểm tra xem có file hoặc URL thumbnail
      if (!thumbnailFile && !data.thumbnail) {
        return badRequestResponse("Vui lòng chọn ảnh đại diện");
      }

      // File upload if provided
      if (thumbnailFile) {
        const uploadResult = await storageService.upload(
          thumbnailFile,
          "news_feeds"
        );
        if (!uploadResult.success) return uploadResult;
        data.thumbnail = uploadResult.data as string;
      }

      // Persist to database - để Prisma tự check unique constraint
      const created = await prisma.news_feeds.create({
        data: data,
      });

      return successResponse(created, "Thêm tin tức thành công", 201);
    } catch (error: any) {
      // Prisma unique constraint error
      if (error.code === "P2002") {
        return badRequestResponse("Tên hoặc slug tin tức đã tồn tại");
      }
      console.error("Lỗi thêm tin tức:", error);
      return internalServerErrorResponse("Lỗi server");
    }
  },

  async update(
    id: string,
    data: NewsFeedInputType,
    thumbnailFile?: File | null
  ): Promise<Response<NewsFeedType | null | string | string[]>> {
    let oldThumbnail: string | null = null;

    try {
      // Validation
      const validationResult = newFeedInputSchema.safeParse(data);
      if (!validationResult.success) {
        return validationErrorResponse(validationResult.error);
      }

      // Get old thumbnail trước khi update
      const existing = await prisma.news_feeds.findUnique({
        where: { id: +id },
        select: { thumbnail: true },
      });

      if (!existing) {
        return notFoundResponse("tin tức không tồn tại");
      }

      oldThumbnail = existing.thumbnail;

      // File upload if provided
      if (thumbnailFile) {
        const uploadResponse = await storageService.upload(
          thumbnailFile,
          "news_feeds"
        );
        if (!uploadResponse.success) return uploadResponse;
        data.thumbnail = uploadResponse.data as string;
      }

      // Update in database - Prisma sẽ check unique constraint và existence
      const updated = await prisma.news_feeds.update({
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

      return successResponse(updated, "Cập nhật tin tức thành công");
    } catch (error: any) {
      // Prisma record not found error
      if (error.code === "P2025") {
        return notFoundResponse("tin tức không tồn tại");
      }
      // Prisma unique constraint error
      if (error.code === "P2002") {
        return badRequestResponse("Tên hoặc slug tin tức đã tồn tại");
      }
      console.log("Lỗi cập nhật tin tức:", error);
      return internalServerErrorResponse();
    }
  },

  async delete(id: string): Promise<Response<NewsFeedType | null>> {
    try {
      // Get thumbnail trước khi xóa
      const existing = await prisma.news_feeds.findUnique({
        where: { id: +id },
        select: { thumbnail: true },
      });

      if (!existing) {
        return notFoundResponse("tin tức không tồn tại");
      }

      // Delete from database
      const deleted = await prisma.news_feeds.delete({
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

      return successResponse(deleted, "Xóa tin tức thành công");
    } catch (error: any) {
      // Prisma record not found error
      if (error.code === "P2025") {
        return notFoundResponse("tin tức không tồn tại");
      }
      console.log("Lỗi xóa tin tức:", error);
      return internalServerErrorResponse();
    }
  },

  async getAll(
    where: Prisma.news_feedsWhereInput = {},
    options: {
      page?: number;
      pageSize?: number;
      orderBy?: Prisma.news_feedsOrderByWithRelationInput;
    } = {}
  ): Promise<Response<NewsFeedType[] | null>> {
    try {
      const { page = 1, pageSize, orderBy } = options;
      const skip = pageSize ? (page - 1) * pageSize : undefined;

      const [data, total] = await Promise.all([
        prisma.news_feeds.findMany({
          where,
          skip,
          take: pageSize,
          orderBy,
        }),
        prisma.news_feeds.count({ where }),
      ]);

      const totalPages = pageSize ? Math.ceil(total / pageSize) : 1;

      return successResponse(
        data,
        "Lấy tin tức thành công",
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
      console.log("Lỗi lấy tin tức:", error);
      return internalServerErrorResponse();
    }
  },

  async getById(id: string): Promise<Response<NewsFeedType | null>> {
    try {
      const result = await prisma.news_feeds.findUnique({
        where: { id: Number(id) },
      });

      if (!result) {
        return notFoundResponse("Tin tức không tồn tại");
      }

      return successResponse(result, "Lấy tin tức thành công");
    } catch (error) {
      console.log("Lỗi lấy tin tức:", error);
      return internalServerErrorResponse();
    }
  },

  async getBySlug(slug: string): Promise<Response<NewsFeedType | null>> {
    try {
      const result = await prisma.news_feeds.findUnique({
        where: { slug },
      });

      if (!result) {
        return notFoundResponse("Tin tức không tồn tại");
      }

      return successResponse(result, "Lấy tin tức thành công");
    } catch (error) {
      console.log("Lỗi lấy tin tức:", error);
      return internalServerErrorResponse();
    }
  },
};
