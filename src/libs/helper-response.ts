import { ZodError } from "zod";
import { NextResponse } from "next/server";

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface ValidationError {
  [field: string]: string[];
}

export interface Response<T = any> {
  success: boolean;
  data?: T;
  message: string;
  pagination?: Pagination;
  error?: ValidationError;
  status: number;
}

export function successResponse<T>(
  data: T,
  message: string = "Thành công",
  status: number = 200,
  pagination?: Pagination
): Response<T> {
  return {
    success: true,
    data,
    ...(pagination && { pagination }),
    message,
    status,
  };
}

export function validationErrorResponse(
  zodError: ZodError,
  message: string = "Dữ liệu không hợp lệ"
): Response<null> {
  const errors: ValidationError = {};

  zodError.errors.forEach((err) => {
    const field = err.path.join(".");
    if (!errors[field]) {
      errors[field] = [];
    }
    errors[field].push(err.message);
  });

  return {
    success: false,
    message,
    error: errors,
    status: 400,
  };
}

export function badRequestResponse(
  message: string = "Yêu cầu không hợp lệ"
): Response<null> {
  return {
    success: false,
    message,
    status: 400,
  };
}

export function internalServerErrorResponse(
  message: string = "Lỗi server"
): Response<null> {
  return {
    success: false,
    message,
    status: 500,
  };
}

export function notFoundResponse(
  message: string = "Không tìm thấy"
): Response<null> {
  return {
    success: false,
    message,
    status: 404,
  };
}

export function unauthorizedResponse(
  message: string = "Chưa xác thực"
): Response<null> {
  return {
    success: false,
    message,
    status: 401,
  };
}

export function forbiddenResponse(
  message: string = "Không có quyền truy cập"
): Response<null> {
  return {
    success: false,
    message,
    status: 403,
  };
}

export function toNextResponse<T>(response: Response<T>) {
  return NextResponse.json(response, { status: response.status });
}
