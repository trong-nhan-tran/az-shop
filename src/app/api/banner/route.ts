import { NextRequest } from "next/server";
import { bannerService } from "@/services";
import {
  internalServerErrorResponse,
  toNextResponse,
} from "@/libs/helper-response";
import { authService } from "@/services/service-auth";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const categorySlug = searchParams.get("categorySlug");
    const categoryId = searchParams.get("categoryId");

    const keyword = searchParams.get("keyword");
    const page = searchParams.get("page") as string;
    const pageSize = searchParams.get("pageSize") as string;

    const whereClause: any = {};

    if (keyword && keyword.trim() !== "") {
      whereClause.OR = [
        {
          categories: {
            name: {
              contains: keyword.trim(),
              mode: "insensitive",
            },
          },
        },
        {
          direct_link: {
            contains: keyword.trim(),
            mode: "insensitive",
          },
        },
      ];
    }

    if (categorySlug) {
      if (whereClause.OR) {
        whereClause.OR.forEach((condition: any) => {
          if (condition.categories) {
            condition.categories.slug = categorySlug;
          } else {
            condition.categories = { slug: categorySlug };
          }
        });
      } else {
        whereClause.categories = {
          slug: categorySlug,
        };
      }
    }
    if (categoryId) {
      whereClause.categories = {
        id: parseInt(categoryId),
      };
    }

    const result = await bannerService.getAll(whereClause, {
      page: page ? parseInt(page) : undefined,
      pageSize: pageSize ? parseInt(pageSize) : undefined,
      include: {
        categories: true,
      },
    });
    return toNextResponse(result);
  } catch (error: unknown) {
    return toNextResponse(internalServerErrorResponse());
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check admin rights
    const authResponse = await adminAuthMiddleware(request);
    if (authResponse) return authResponse;
    const formData = await request.formData();
    const jsonData = formData.get("data");
    const data = jsonData ? JSON.parse(jsonData.toString()) : {};

    const desktopFile = formData.get("desktopFile") as File | null;
    const mobileFile = formData.get("mobileFile") as File | null;

    const result = await bannerService.create(data, desktopFile, mobileFile);

    return toNextResponse(result);
  } catch (error: unknown) {
    console.log("Lỗi banner POST:", error);
    return toNextResponse(internalServerErrorResponse());
  }
}
