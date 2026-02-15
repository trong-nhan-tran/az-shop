import { NextRequest } from "next/server";
import { productVariantService } from "@/services";
import {
  badRequestResponse,
  internalServerErrorResponse,
  toNextResponse,
} from "@/libs/helper-response";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    if (!slug) {
      return toNextResponse(badRequestResponse("Yêu cầu slug"));
    }

    return toNextResponse(
      await productVariantService.getBySlug(slug, {
        products: true,
        product_items: {
          include: { product_colors: true },
        },
      })
    );
  } catch (error: unknown) {
    return toNextResponse(internalServerErrorResponse());
  }
}
