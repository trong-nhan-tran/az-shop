import { NextRequest } from "next/server";
import { profileService } from "@/services";
import {
  badRequestResponse,
  internalServerErrorResponse,
  toNextResponse,
} from "@/libs/helper-response";
import { authService } from "@/services/service-auth";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return toNextResponse(badRequestResponse("Yêu cầu ID"));
    }
    return toNextResponse(await profileService.getById(id));
  } catch (error: unknown) {
    return toNextResponse(internalServerErrorResponse());
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const authResponse = await authService.isAdmin();
  if (!authResponse.success) {
    return toNextResponse(authResponse);
  }

  try {
    const { id } = await context.params;

    if (!id) {
      return toNextResponse(badRequestResponse("Yêu cầu ID"));
    }

    const body = await request.json();
    const data = body.data || body;

    return toNextResponse(await profileService.update(id, data));
  } catch (error: unknown) {
    return toNextResponse(internalServerErrorResponse());
  }
}
