import { NextRequest } from "next/server";
import { cartItemService } from "@/services";
import {
  internalServerErrorResponse,
  toNextResponse,
} from "@/libs/helper-response";
import { authService } from "@/services/service-auth";

export async function GET(request: NextRequest) {
  try {
    const authResponse = await authService.isUser();
    if (!authResponse.success || !authResponse.data) {
      return toNextResponse(authResponse);
    }

    const profile_id = authResponse.data.id;
    const result = await cartItemService.getCartForUser(profile_id);
    return toNextResponse(result);
  } catch (error: unknown) {
    return toNextResponse(internalServerErrorResponse());
  }
}
