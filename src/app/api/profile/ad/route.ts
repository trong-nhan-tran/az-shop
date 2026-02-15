import { NextRequest } from "next/server";
import { profileService } from "@/services";
import {
  internalServerErrorResponse,
  toNextResponse,
} from "@/libs/helper-response";
import { authService } from "@/services/service-auth";

export async function GET(request: NextRequest) {
  try {
    const authResponse = await authService.isUser();
    if (!authResponse.success) {
      return toNextResponse(authResponse);
    }

    const { id } = authResponse.data!;

    return toNextResponse(await profileService.getById(id));
  } catch (error: unknown) {
    return toNextResponse(internalServerErrorResponse());
  }
}
