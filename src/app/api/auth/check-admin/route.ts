import { NextRequest } from "next/server";
import { authService } from "@/services";
import {
  internalServerErrorResponse,
  toNextResponse,
} from "@/libs/helper-response";

export async function POST(request: NextRequest) {
  try {
    const result = await authService.isAdmin();

    return toNextResponse(result);
  } catch (error) {
    console.error("Lỗi kiểm tra quyền admin:", error);
    return toNextResponse(internalServerErrorResponse());
  }
}
