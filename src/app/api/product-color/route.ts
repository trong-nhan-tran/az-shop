import { NextRequest } from "next/server";
import { productColorService } from "@/services";
import {
  internalServerErrorResponse,
  toNextResponse,
} from "@/libs/helper-response";
import { authService } from "@/services/service-auth";

export async function GET(request: NextRequest) {
  // GET doesn't require admin rights
  try {
    const searchParams = request.nextUrl.searchParams;
    const productId = searchParams.get("productId");

    const whereClause: any = {};
    if (productId) {
      whereClause.product_id = parseInt(productId);
    }

    return toNextResponse(await productColorService.getAll(whereClause, {}));
  } catch (error: unknown) {
    return toNextResponse(internalServerErrorResponse());
  }
}

export async function POST(request: NextRequest) {
  const authResponse = await authService.isAdmin();
  if (!authResponse.success) {
    return toNextResponse(authResponse);
  }

  try {
    const formData = await request.formData();
    const jsonData = formData.get("data");
    const data = jsonData ? JSON.parse(jsonData.toString()) : {};
    const thumbnailFile = formData.get("thumbnailFile") as File | null;
    const imageFiles = formData.getAll("imageFiles") as File[];

    return toNextResponse(
      await productColorService.create(data, thumbnailFile, imageFiles)
    );
  } catch (error: unknown) {
    return toNextResponse(internalServerErrorResponse());
  }
}
