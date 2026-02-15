import { NextRequest } from "next/server";
import { productColorService } from "@/services";
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
  const { id } = await context.params;
  if (!id) {
    return toNextResponse(badRequestResponse("Yêu cầu ID"));
  }
  const result = await productColorService.getById(id);
  return toNextResponse(result);
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
    const formData = await request.formData();
    const jsonData = formData.get("data");
    const data = jsonData ? JSON.parse(jsonData.toString()) : {};
    const thumbnailFile = formData.get("thumbnailFile") as File | null;
    const imageFiles = formData.getAll("imageFiles") as File[];
    const removedImageUrls = formData.getAll("removedImageUrls") as
      | string[]
      | null;

    return toNextResponse(
      await productColorService.update(
        id,
        data,
        thumbnailFile,
        imageFiles,
        removedImageUrls,
      ),
    );
  } catch (error: unknown) {
    return toNextResponse(internalServerErrorResponse());
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  // Check admin rights
  const authResponse = await authService.isAdmin();
  if (!authResponse.success) {
    return toNextResponse(authResponse);
  }

  try {
    const { id } = await context.params;
    if (!id) {
      return toNextResponse(badRequestResponse("Yêu cầu ID"));
    }

    return toNextResponse(await productColorService.delete(id));
  } catch (error: unknown) {
    return toNextResponse(internalServerErrorResponse());
  }
}
