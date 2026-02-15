import { NextRequest } from "next/server";
import { orderService } from "@/services";
import {
  internalServerErrorResponse,
  toNextResponse,
} from "@/libs/helper-response";
import { authService } from "@/services/service-auth";

export async function GET(request: NextRequest) {
  try {
    const authResponse = await authService.isUser();
    if (!authResponse.success) {
      return toNextResponse(authResponse);
    }
    const profile_id = authResponse.data?.id;
    if (!profile_id) {
      return toNextResponse(internalServerErrorResponse());
    }

    return toNextResponse(
      await orderService.getAll(
        {
          profile_id: profile_id,
        },
        {
          include: {
            order_items: true,
          },
        },
      ),
    );
  } catch (error: unknown) {
    return toNextResponse(internalServerErrorResponse());
  }
}
