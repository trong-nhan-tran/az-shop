import { NextRequest } from "next/server";
import { orderItemService } from "@/services";
import {
  internalServerErrorResponse,
  toNextResponse,
} from "@/libs/helper-response";
import { authService } from "@/services/service-auth";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const orderId = searchParams.get("orderId");
    const productItemId = searchParams.get("productItemId");
    const page = searchParams.get("page")
      ? parseInt(searchParams.get("page") as string)
      : undefined;
    const pageSize = searchParams.get("pageSize")
      ? parseInt(searchParams.get("pageSize") as string)
      : undefined;

    const whereClause: any = {};

    if (orderId) {
      whereClause.order_id = parseInt(orderId);
    }

    if (productItemId) {
      whereClause.product_item_id = parseInt(productItemId);
    }

    return toNextResponse(
      await orderItemService.getAll(whereClause, {
        page: page ? page : undefined,
        pageSize: pageSize ? pageSize : undefined,
        include: {
          product_items: true,
        },
      })
    );
  } catch (error: unknown) {
    return toNextResponse(internalServerErrorResponse());
  }
}

export async function POST(request: NextRequest) {
  // Check admin rights
  const authResponse = await authService.isAdmin();
  if (!authResponse.success) {
    return toNextResponse(authResponse);
  }

  try {
    const body = await request.json();
    console.log("body", body);
    return toNextResponse(await orderItemService.create(body));
  } catch (error: unknown) {
    return toNextResponse(internalServerErrorResponse());
  }
}
