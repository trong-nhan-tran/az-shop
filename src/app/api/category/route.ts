import { NextRequest } from "next/server";
import { categoryService } from "@/services";
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
    const includeFeaturedItems =
      searchParams.get("includeFeaturedItems") === "true";
    const whereClause: any = {};

    if (keyword && keyword.trim() !== "") {
      whereClause.name = {
        contains: keyword.trim(),
        mode: "insensitive",
      };
    }

    // Pass the pagination parameters to the service
    const result = await categoryService.getAll(whereClause, {
      page,
      pageSize,
      orderBy: {
        order_number: "asc",
      },
      include: {
        subcategories: true,
        banners: {
          orderBy: { order_number: "asc" },
        },
        featured_items: includeFeaturedItems
          ? {
              include: {
                product_variants: true,
              },
              orderBy: { order_number: "asc" },
            }
          : false,
      },
    });

    return toNextResponse(result);
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
    const formData = await request.formData();
    const jsonData = formData.get("data");
    const data = jsonData ? JSON.parse(jsonData.toString()) : {};

    const thumbnailFile = formData.get("thumbnailFile") as File | null;

    const result = await categoryService.create(data, thumbnailFile);

    return toNextResponse(result);
  } catch (error: unknown) {
    console.log("Lỗi danh mục POST:", error);
    return toNextResponse(internalServerErrorResponse());
  }
}
