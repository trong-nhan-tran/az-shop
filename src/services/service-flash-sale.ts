import prisma from "@/libs/prisma";
import { Prisma } from "@prisma/client";
import {
  flashSaleInputSchema,
  FlashSaleInputType,
  FlashSaleType,
} from "@/schemas";
import {
  successResponse,
  Response,
  validationErrorResponse,
  notFoundResponse,
  internalServerErrorResponse,
} from "@/libs/helper-response";

export const flashSaleService = {
  async create(
    data: FlashSaleInputType
  ): Promise<Response<FlashSaleType | null>> {
    try {
      const validationResult = flashSaleInputSchema.safeParse(data);
      if (!validationResult.success) {
        return validationErrorResponse(validationResult.error);
      }
      const created = await prisma.flash_sale.create({
        data: validationResult.data,
      });

      return successResponse(created, "Thêm flash sale thành công", 201);
    } catch (error: any) {
      console.log("Lỗi thêm flash sale:", error);
      return internalServerErrorResponse();
    }
  },

  async update(
    id: string,
    data: FlashSaleInputType
  ): Promise<Response<FlashSaleType | null>> {
    try {
      const validationResult = flashSaleInputSchema.safeParse(data);
      if (!validationResult.success) {
        return validationErrorResponse(validationResult.error);
      }

      const updated = await prisma.flash_sale.update({
        where: { id: +id },
        data: validationResult.data,
      });

      return successResponse(updated, "Cập nhật flash sale thành công");
    } catch (error: any) {
      // Prisma record not found error
      if (error.code === "P2025") {
        return notFoundResponse("flash sale không tồn tại");
      }
      // Prisma unique constraint error

      console.log("Lỗi cập nhật flash sale:", error);
      return internalServerErrorResponse();
    }
  },

  async delete(id: string): Promise<Response<FlashSaleType | null>> {
    try {
      const deleted = await prisma.flash_sale.delete({
        where: { id: +id },
      });

      return successResponse(deleted, "Xóa flash sale thành công");
    } catch (error: any) {
      // Prisma record not found error
      if (error.code === "P2025") {
        return notFoundResponse("flash sale không tồn tại");
      }
      console.log("Lỗi xóa flash sale:", error);
      return internalServerErrorResponse();
    }
  },

  async getAll(
    where: Prisma.flash_saleWhereInput = {},
    options: {
      page?: number;
      pageSize?: number;
      orderBy?: Prisma.flash_saleOrderByWithRelationInput;
      include?: Prisma.flash_saleInclude;
    } = {}
  ): Promise<Response<FlashSaleType[] | null>> {
    try {
      const { page = 1, pageSize, orderBy, include } = options;
      const skip = pageSize ? (page - 1) * pageSize : undefined;

      const [data, total] = await Promise.all([
        prisma.flash_sale.findMany({
          where,
          skip,
          take: pageSize,
          orderBy,
          include,
        }),
        prisma.flash_sale.count({ where }),
      ]);

      const totalPages = pageSize ? Math.ceil(total / pageSize) : 1;

      return successResponse(
        data,
        "Lấy flash sale thành công",
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
      console.log("Lỗi lấy flash sale:", error);
      return internalServerErrorResponse();
    }
  },

  async getById(
    id: string,
    include?: Prisma.flash_saleInclude
  ): Promise<Response<FlashSaleType | null>> {
    try {
      const result = await prisma.flash_sale.findUnique({
        where: { id: Number(id) },
        include,
      });

      if (!result) {
        return notFoundResponse("flash sale không tồn tại");
      }

      return successResponse(result, "Lấy flash sale thành công");
    } catch (error) {
      console.log("Lỗi lấy flash sale:", error);
      return internalServerErrorResponse();
    }
  },
  async getActiveFlashSale(): Promise<Response<any>> {
    try {
      const now = new Date();

      const result = await prisma.flash_sale.findFirst({
        where: {
          enable: true,
          start_at: {
            lte: now,
          },
          end_at: {
            gte: now,
          },
        },
        include: {
          flash_sale_items: {
            include: {
              product_items: {
                include: {
                  product_variants: true,
                  product_colors: true,
                },
              },
            },
            orderBy: {
              created_at: "desc",
            },
          },
        },
      });

      if (!result) {
        return successResponse(null, "Không có flash sale đang hoạt động");
      }

      return successResponse(
        result,
        "Lấy flash sale đang hoạt động thành công"
      );
    } catch (error) {
      console.error("Lỗi lấy flash sale đang hoạt động:", error);
      return internalServerErrorResponse();
    }
  },
};
