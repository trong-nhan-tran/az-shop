import { NextRequest } from "next/server";
import { cartItemService } from "@/services";
import {
  badRequestResponse,
  internalServerErrorResponse,
  toNextResponse,
} from "@/libs/helper-response";
import { authService } from "@/services/service-auth";

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    if (!id) {
      return toNextResponse(badRequestResponse("Yêu cầu ID"));
    }
    const authResponse = await authService.isUser();
    if (!authResponse.success) {
      return toNextResponse(authResponse);
    }
    const profile_id = authResponse.data?.id;
    return toNextResponse(await cartItemService.delete(+id, profile_id!));
  } catch (error: unknown) {
    return toNextResponse(internalServerErrorResponse());
  }
}
