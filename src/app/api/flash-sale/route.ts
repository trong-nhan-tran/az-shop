import { NextRequest } from "next/server";
import { flashSaleService } from "@/services";
import {
  internalServerErrorResponse,
  toNextResponse,
} from "@/libs/helper-response";
import { authService } from "@/services/service-auth";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const keyword = searchParams.get("keyword")?.toLowerCase().trim();
    const page = searchParams.get("page")
      ? parseInt(searchParams.get("page") as string)
      : 1;
    const pageSize = searchParams.get("pageSize")
      ? parseInt(searchParams.get("pageSize") as string)
      : 10;
    const sortField = searchParams.get("sortField") || "created_at";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const includeDetails = searchParams.get("includeDetails") === "true";

    const whereClause: any = {};
    const orderBy: Record<string, "asc" | "desc"> = {
      [sortField]: sortOrder as "asc" | "desc",
    };

    if (keyword) {
      whereClause.name = {
        contains: keyword,
        mode: "insensitive",
      };
    }

    return toNextResponse(
      await flashSaleService.getAll(whereClause, {
        page,
        pageSize,
        orderBy,
        include: {
          flash_sale_items: includeDetails
            ? {
                include: {
                  product_items: {
                    include: { product_variants: true, product_colors: true },
                  },
                },
              }
            : false,
        },
      })
    );
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
    const body = await request.json();
    const data = body.data || body;

    return toNextResponse(await flashSaleService.create(data));
  } catch (error: unknown) {
    return toNextResponse(internalServerErrorResponse());
  }
}
