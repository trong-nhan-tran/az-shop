import { NextRequest } from "next/server";
import { storageService } from "@/services/service-storage";
import { authService } from "@/services/service-auth";
import {
  badRequestResponse,
  internalServerErrorResponse,
  toNextResponse,
} from "@/libs/helper-response";

export async function POST(request: NextRequest) {
  // Check admin rights
  const authResponse = await authService.isAdmin();
  if (!authResponse.success) {
    return toNextResponse(authResponse);
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return toNextResponse(badRequestResponse("Yêu cầu file để tải lên"));
    }

    return toNextResponse(await storageService.upload(file, "editor-images"));
  } catch (error: unknown) {
    console.log("Lỗi upload POST", error);
    return toNextResponse(internalServerErrorResponse());
  }
}

export async function DELETE(request: NextRequest) {
  // Check admin rights
  const authResponse = await authService.isAdmin();
  if (!authResponse.success) {
    return toNextResponse(authResponse);
  }

  try {
    const { url } = await request.json();

    if (!url) {
      return toNextResponse(badRequestResponse("Yêu cầu URL để xóa"));
    }

    const path = storageService.extractPathFromUrl(url);
    if (!path) {
      return toNextResponse(badRequestResponse("URL không hợp lệ"));
    }
    return toNextResponse(await storageService.delete(path));
  } catch (error: unknown) {
    console.log("Lỗi upload DELETE", error);
    return toNextResponse(internalServerErrorResponse());
  }
}
