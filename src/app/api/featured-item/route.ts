import { NextRequest } from "next/server";
import { featuredItemService } from "@/services";
import {
  internalServerErrorResponse,
  toNextResponse,
} from "@/libs/helper-response";
import { authService } from "@/services/service-auth";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const keyword = searchParams.get("keyword");
    const page = searchParams.get("page")
      ? parseInt(searchParams.get("page") as string)
      : 1;
    const pageSize = searchParams.get("pageSize")
      ? parseInt(searchParams.get("pageSize") as string)
      : 10;

    const categoryId = searchParams.get("categoryId");

    const whereClause: any = {};

    if (keyword && keyword.trim() !== "") {
      whereClause.name = {
        contains: keyword.trim(),
        mode: "insensitive",
      };
    }
    if (categoryId) {
      whereClause.category_id = parseInt(categoryId);
    }

    // Pass the pagination parameters to the service
    const result = await featuredItemService.getAll(whereClause, {
      page,
      pageSize,
      include: {
        product_variants: true,
      },
      orderBy: {
        order_number: "asc",
      },
    });

    return toNextResponse(result);
  } catch (error: unknown) {
    console.log("Lỗi sản phẩm nổi bật GET", error);
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
    const result = await featuredItemService.create(body);
    return toNextResponse(result);
  } catch (error: unknown) {
    console.log("Lỗi sản phẩm nổi bật POST", error);
    return toNextResponse(internalServerErrorResponse());
  }
}
