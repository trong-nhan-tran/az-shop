import prisma from "@/libs/prisma";
import { Prisma } from "@prisma/client";
import { authService } from "./service-auth";
import {
  updateProfileSchema,
  UpdateProfileInputType,
  ProfileType,
} from "@/schemas";
import {
  successResponse,
  Response,
  validationErrorResponse,
  notFoundResponse,
  internalServerErrorResponse,
  badRequestResponse,
} from "@/libs/helper-response";

export const profileService = {
  async update(
    id: string,
    data: UpdateProfileInputType,
  ): Promise<Response<ProfileType | null | string | string[]>> {
    try {
      const validationResult = updateProfileSchema.safeParse(data);
      if (!validationResult.success) {
        return validationErrorResponse(validationResult.error);
      }

      const updated = await prisma.profiles.update({
        where: { id: id },
        data: validationResult.data,
      });

      return successResponse(updated, "Cập nhật người dùng thành công");
    } catch (error: any) {
      // Prisma record not found error
      if (error.code === "P2025") {
        return notFoundResponse("người dùng không tồn tại");
      }
      // Prisma unique constraint error
      if (error.code === "P2002") {
        return badRequestResponse("Email người dùng đã tồn tại");
      }
      console.log("Lỗi cập nhật người dùng:", error);
      return internalServerErrorResponse();
    }
  },

  async getAll(
    where: Prisma.profilesWhereInput = {},
    options: {
      page?: number;
      pageSize?: number;
      orderBy?: Prisma.profilesOrderByWithRelationInput;
      include?: Prisma.profilesInclude;
    } = {},
  ): Promise<Response<ProfileType[] | null>> {
    try {
      const { page = 1, pageSize, orderBy, include } = options;
      const skip = pageSize ? (page - 1) * pageSize : undefined;

      const [data, total] = await Promise.all([
        prisma.profiles.findMany({
          where,
          skip,
          take: pageSize,
          orderBy,
          include,
        }),
        prisma.profiles.count({ where }),
      ]);

      const totalPages = pageSize ? Math.ceil(total / pageSize) : 1;

      return successResponse(
        data,
        "Lấy người dùng thành công",
        200,
        pageSize
          ? {
              page,
              pageSize,
              total,
              totalPages,
            }
          : undefined,
      );
    } catch (error) {
      console.log("Lỗi lấy người dùng:", error);
      return internalServerErrorResponse();
    }
  },

  async getById(
    id: string,
    include?: Prisma.profilesInclude,
  ): Promise<Response<ProfileType | null>> {
    try {
      const result = await prisma.profiles.findUnique({
        where: { id: id },
        include,
      });

      if (!result) {
        return notFoundResponse("người dùng không tồn tại");
      }

      return successResponse(result, "Lấy người dùng thành công");
    } catch (error) {
      console.log("Lỗi lấy người dùng:", error);
      return internalServerErrorResponse();
    }
  },
  async getProfileCurrentCustomer(): Promise<Response<ProfileType | null>> {
    try {
      const authUser = await authService.isUser();
      if (!authUser.data) {
        return internalServerErrorResponse("Lỗi xác thực người dùng");
      }

      const result = await prisma.profiles.findUnique({
        where: { id: authUser.data.id },
        include: {
          orders: true,
        },
      });

      if (!result) {
        return notFoundResponse("người dùng không tồn tại");
      }

      return successResponse(result, "Lấy người dùng thành công");
    } catch (error) {
      console.log("Lỗi lấy người dùng:", error);
      return internalServerErrorResponse();
    }
  },
};
