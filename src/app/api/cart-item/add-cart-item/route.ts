import { NextRequest } from "next/server";
import { cartItemService } from "@/services";
import {
  internalServerErrorResponse,
  toNextResponse,
} from "@/libs/helper-response";
import { authService } from "@/services/service-auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const authResponse = await authService.isUser();
    if (!authResponse.success || !authResponse.data) {
      return toNextResponse(authResponse);
    }

    const profile_id = authResponse.data.id;
    const result = await cartItemService.addToCart({
      profile_id,
      product_item_id: +body.product_item_id,
      quantity: +body.quantity,
    });
    return toNextResponse(result);
  } catch (error: unknown) {
    return toNextResponse(internalServerErrorResponse());
  }
}
