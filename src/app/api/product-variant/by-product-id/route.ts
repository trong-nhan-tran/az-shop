import { NextRequest } from "next/server";
import { productVariantService } from "@/services";
import {
  badRequestResponse,
  internalServerErrorResponse,
  toNextResponse,
} from "@/libs/helper-response";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return toNextResponse(badRequestResponse("Yêu cầu ID sản phẩm"));
    }

    return toNextResponse(
      await productVariantService.getAllByProductId(+productId)
    );
  } catch (error: unknown) {
    console.error("Lỗi sản phẩm con GET:", error);
    return toNextResponse(internalServerErrorResponse());
  }
}
