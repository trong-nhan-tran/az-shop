import { NextRequest } from "next/server";
import { bannerService } from "@/services";
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
    return toNextResponse(
      await bannerService.getById(id, { categories: true })
    );
  } catch (error: unknown) {
    return toNextResponse(internalServerErrorResponse());
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
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

    let data: any = {};
    let desktopFile: File | null = null;
    let mobileFile: File | null = null;

    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const jsonData = formData.get("data");
      data = jsonData ? JSON.parse(jsonData.toString()) : {};
    } else {
      const body = await request.json();
      data = body.data || {};
    }

    return toNextResponse(
      await bannerService.update(id, data, desktopFile, mobileFile)
    );
  } catch (error: unknown) {
    console.error("Lỗi banner PUT:", error);
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
    return toNextResponse(await bannerService.delete(id));
  } catch (error: unknown) {
    return toNextResponse(internalServerErrorResponse());
  }
}
