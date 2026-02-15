import { NextRequest } from "next/server";
import { orderService } from "@/services";
import {
  internalServerErrorResponse,
  toNextResponse,
} from "@/libs/helper-response";
import { authService } from "@/services/service-auth";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const keyword = searchParams.get("keyword");
    const page = searchParams.get("page")
      ? parseInt(searchParams.get("page") as string)
      : 1;
    const pageSize = searchParams.get("pageSize")
      ? parseInt(searchParams.get("pageSize") as string)
      : 10;

    const whereClause: any = {};

    if (status) {
      whereClause.status = status;
    }

    if (keyword && keyword.trim() !== "") {
      whereClause.OR = [
        {
          customer_name: {
            contains: keyword.trim(),
            mode: "insensitive",
          },
        },
        {
          customer_phone: {
            contains: keyword.trim(),
            mode: "insensitive",
          },
        },
      ];
    }
    return toNextResponse(
      await orderService.getAll(whereClause, {
        page,
        pageSize,
        include: {
          order_items: true,
        },
      }),
    );
  } catch (error: unknown) {
    return toNextResponse(internalServerErrorResponse());
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    return toNextResponse(await orderService.create(body));
  } catch (error: unknown) {
    return toNextResponse(internalServerErrorResponse());
  }
}
