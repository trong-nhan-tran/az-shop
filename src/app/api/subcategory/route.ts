import { NextRequest } from "next/server";
import { subcategoryService } from "@/services";
import {
  internalServerErrorResponse,
  toNextResponse,
} from "@/libs/helper-response";
import { authService } from "@/services/service-auth";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const keyword = searchParams.get("keyword");
    const page = searchParams.get("page") as string;
    const pageSize = searchParams.get("pageSize") as string;

    const whereClause: any = {};

    if (keyword && keyword.trim() !== "") {
      whereClause.name = {
        contains: keyword.trim(),
        mode: "insensitive",
      };
    }

    // Pass the pagination parameters to the service
    const result = await subcategoryService.getAll(whereClause, {
      page: page ? parseInt(page) : undefined,
      pageSize: pageSize ? parseInt(pageSize) : undefined,
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
    const body = await request.json();
    console.log("body", body);
    const result = await subcategoryService.create(body);
    return toNextResponse(result);
  } catch (error: unknown) {
    return toNextResponse(internalServerErrorResponse());
  }
}
