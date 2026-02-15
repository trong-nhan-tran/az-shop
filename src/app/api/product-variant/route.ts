import { NextRequest } from "next/server";
import { productVariantService } from "@/services";
import {
  internalServerErrorResponse,
  toNextResponse,
} from "@/libs/helper-response";
import { authService } from "@/services/service-auth";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const categorySlug = searchParams.get("categorySlug");
    const keyword = searchParams.get("keyword")?.toLowerCase().trim();
    const categoryId = searchParams.get("categoryId");
    const productId = searchParams.get("productId");
    const page = searchParams.get("page") as string;
    const pageSize = searchParams.get("pageSize") as string;

    const sortField = searchParams.get("sortField") || "created_at";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const whereClause: any = {};
    const orderBy: Record<string, "asc" | "desc"> = {
      [sortField]: sortOrder as "asc" | "desc",
    };

    if (categorySlug) {
      whereClause.OR = [
        {
          products: {
            is: {
              subcategories: {
                slug: categorySlug,
              },
            },
          },
        },
        {
          products: {
            is: {
              subcategories: {
                is: {
                  categories: {
                    slug: categorySlug,
                  },
                },
              },
            },
          },
        },
      ];
    }

    if (keyword) {
      whereClause.name = {
        contains: keyword,
        mode: "insensitive", // Case-insensitive search
      };
    }
    if (categoryId) {
      whereClause.products = {
        subcategories: {
          category_id: +categoryId,
        },
      };
    }
    if (productId) {
      whereClause.product_id = +productId;
    }

    return toNextResponse(
      await productVariantService.getAll(whereClause, {
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        orderBy,
        include: {
          products: {
            select: {
              id: true,
              name: true,
              subcategory_id: true,
              subcategories: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  category_id: true,
                  categories: {
                    select: {
                      id: true,
                      name: true,
                      slug: true,
                    },
                  },
                },
              },
            },
          },
        },
      })
    );
  } catch (error: unknown) {
    console.error("Lỗi phiên bản sản phẩm GET:", error);
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

    return toNextResponse(
      await productVariantService.create(data, thumbnailFile)
    );
  } catch (error: unknown) {
    return toNextResponse(internalServerErrorResponse());
  }
}
