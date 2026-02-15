import { NextRequest } from "next/server";
import { authService } from "@/services";
import {
  badRequestResponse,
  internalServerErrorResponse,
  toNextResponse,
} from "@/libs/helper-response";

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    if (!id) {
      return toNextResponse(badRequestResponse("Yêu cầu ID"));
    }
    const result = await authService.setAdminRole(id);

    return toNextResponse(result);
  } catch (error) {
    console.error("Lỗi đặt vai trò admin:", error);
    return toNextResponse(internalServerErrorResponse());
  }
}
