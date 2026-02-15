import { NextRequest } from "next/server";
import { newsFeedService } from "@/services";
import {
  internalServerErrorResponse,
  toNextResponse,
} from "@/libs/helper-response";
import { authService } from "@/services/service-auth";
import { Prisma } from "@prisma/client";

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
    const whereClause: Prisma.news_feedsWhereInput = {};
    if (keyword && keyword.trim() !== "") {
      whereClause.title = {
        contains: keyword.trim(),
        mode: "insensitive",
      };
    }

    return toNextResponse(
      await newsFeedService.getAll(whereClause, {
        page,
        pageSize,
        orderBy: {
          created_at: "asc",
        },
      }),
    );
  } catch (error: unknown) {
    console.log("Lỗi Tin tức GET:", error);
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
    console.log("jsonData", jsonData);
    const data = jsonData ? JSON.parse(jsonData.toString()) : {};
    console.log("Parsed data:", data);

    const thumbnailFile = formData.get("thumbnailFile") as File | null;
    console.log("thumbnailFile:", thumbnailFile ? thumbnailFile.name : "null");

    const result = await newsFeedService.create(data, thumbnailFile);
    console.log("Result:", result);

    return toNextResponse(result);
  } catch (error: unknown) {
    console.log("Lỗi danh mục POST:", error);
    return toNextResponse(internalServerErrorResponse());
  }
}
