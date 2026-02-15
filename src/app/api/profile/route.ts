import { NextRequest } from "next/server";
import { profileService } from "@/services";
import {
  internalServerErrorResponse,
  toNextResponse,
} from "@/libs/helper-response";
import { authService } from "@/services/service-auth";

export async function GET(request: NextRequest) {
  const authResponse = await authService.isAdmin();
  if (!authResponse.success) {
    return toNextResponse(authResponse);
  }
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
      await profileService.getAll(whereClause, {
        page,
        pageSize,
        orderBy,
      }),
    );
  } catch (error: unknown) {
    return toNextResponse(internalServerErrorResponse());
  }
}
