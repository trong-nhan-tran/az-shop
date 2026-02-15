import { NextRequest } from "next/server";
import { productItemService } from "@/services";
import {
  internalServerErrorResponse,
  toNextResponse,
} from "@/libs/helper-response";
import { authService } from "@/services/service-auth";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const productId = searchParams.get("productId");
    const keyword = searchParams.get("keyword");
    const page = searchParams.get("page")
      ? parseInt(searchParams.get("page") as string)
      : undefined;
    const pageSize = searchParams.get("pageSize")
      ? parseInt(searchParams.get("pageSize") as string)
      : undefined;

    const whereClause: any = {};

    if (productId) {
      whereClause.product_id = parseInt(productId);
    }

    if (keyword && keyword.trim() !== "") {
      whereClause.name = {
        contains: keyword.trim(),
        mode: "insensitive",
      };
    }

    return toNextResponse(
      await productItemService.getAll(whereClause, {
        page: page ? page : undefined,
        pageSize: pageSize ? pageSize : undefined,
        include: {
          product_colors: true,
          product_variants: true,
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
    return toNextResponse(await productItemService.create(body));
  } catch (error: unknown) {
    return toNextResponse(internalServerErrorResponse());
  }
}
