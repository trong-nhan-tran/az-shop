import prisma from "@/libs/prisma";
import { Prisma } from "@prisma/client";
import { productInputSchema, ProductInputType, ProductType } from "@/schemas";
import {
  successResponse,
  Response,
  validationErrorResponse,
  notFoundResponse,
  internalServerErrorResponse,
  badRequestResponse,
} from "@/libs/helper-response";

export const productService = {
  async create(
    data: ProductInputType
  ): Promise<Response<ProductType | null | string | string[]>> {
    try {
      const validationResult = productInputSchema.safeParse(data);
      if (!validationResult.success) {
        return validationErrorResponse(validationResult.error);
      }
      const created = await prisma.products.create({
        data: validationResult.data,
      });

      return successResponse(created, "Thêm dòng sản phẩm thành công", 201);
    } catch (error: any) {
      if (error.code === "P2002") {
        return badRequestResponse("Tên dòng sản phẩm đã tồn tại");
      }
      console.log("Lỗi thêm dòng sản phẩm:", error);
      return internalServerErrorResponse();
    }
  },

  async update(
    id: string,
    data: ProductInputType
  ): Promise<Response<ProductType | null | string | string[]>> {
    try {
      const validationResult = productInputSchema.safeParse(data);
      if (!validationResult.success) {
        return validationErrorResponse(validationResult.error);
      }

      const updated = await prisma.products.update({
        where: { id: +id },
        data: validationResult.data,
      });

      return successResponse(updated, "Cập nhật dòng sản phẩm thành công");
    } catch (error: any) {
      // Prisma record not found error
      if (error.code === "P2025") {
        return notFoundResponse("Dòng sản phẩm không tồn tại");
      }
      // Prisma unique constraint error
      if (error.code === "P2002") {
        return badRequestResponse("Tên dòng sản phẩm đã tồn tại");
      }
      console.log("Lỗi cập nhật dòng sản phẩm:", error);
      return internalServerErrorResponse();
    }
  },

  async delete(id: string): Promise<Response<ProductType | null>> {
    try {
      const deleted = await prisma.products.delete({
        where: { id: +id },
      });

      return successResponse(deleted, "Xóa dòng sản phẩm thành công");
    } catch (error: any) {
      // Prisma record not found error
      if (error.code === "P2025") {
        return notFoundResponse("Dòng sản phẩm không tồn tại");
      }
      console.log("Lỗi xóa dòng sản phẩm:", error);
      return internalServerErrorResponse();
    }
  },

  async getAll(
    where: Prisma.productsWhereInput = {},
    options: {
      page?: number;
      pageSize?: number;
      orderBy?: Prisma.productsOrderByWithRelationInput;
      include?: Prisma.productsInclude;
    } = {}
  ): Promise<Response<ProductType[] | null>> {
    try {
      const { page = 1, pageSize, orderBy, include } = options;
      const skip = pageSize ? (page - 1) * pageSize : undefined;

      const [data, total] = await Promise.all([
        prisma.products.findMany({
          where,
          skip,
          take: pageSize,
          orderBy,
          include,
        }),
        prisma.products.count({ where }),
      ]);

      const totalPages = pageSize ? Math.ceil(total / pageSize) : 1;

      return successResponse(
        data,
        "Lấy dòng sản phẩm thành công",
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
      console.log("Lỗi lấy dòng sản phẩm:", error);
      return internalServerErrorResponse();
    }
  },

  async getById(
    id: string,
    include?: Prisma.productsInclude
  ): Promise<Response<ProductType | null>> {
    try {
      const result = await prisma.products.findUnique({
        where: { id: Number(id) },
        include,
      });

      if (!result) {
        return notFoundResponse("Dòng sản phẩm không tồn tại");
      }

      return successResponse(result, "Lấy dòng sản phẩm thành công");
    } catch (error) {
      console.log("Lỗi lấy dòng sản phẩm:", error);
      return internalServerErrorResponse();
    }
  },
};
