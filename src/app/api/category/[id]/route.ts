import { NextRequest } from "next/server";
import { categoryService } from "@/services";
import {
  badRequestResponse,
  internalServerErrorResponse,
  toNextResponse,
} from "@/libs/helper-response";
import { authService } from "@/services/service-auth";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    if (!id) {
      return toNextResponse(badRequestResponse("Yêu cầu ID"));
    }
    return toNextResponse(await categoryService.getById(id));
  } catch (error: unknown) {
    return toNextResponse(internalServerErrorResponse());
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
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

    const formData = await request.formData();
    const jsonData = formData.get("data");
    const data = jsonData ? JSON.parse(jsonData.toString()) : {};

    const thumbnailFile = formData.get("thumbnailFile") as File | null;

    return toNextResponse(
      await categoryService.update(id, data, thumbnailFile)
    );
  } catch (error: unknown) {
    console.log("Lỗi danh mục PUT:", error);
    return toNextResponse(internalServerErrorResponse());
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
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
    return toNextResponse(await categoryService.delete(id));
  } catch (error: unknown) {
    return toNextResponse(internalServerErrorResponse());
  }
}
