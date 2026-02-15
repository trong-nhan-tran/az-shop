import { NextRequest } from "next/server";
import { flashSaleService } from "@/services";
import {
  internalServerErrorResponse,
  toNextResponse,
} from "@/libs/helper-response";

export async function GET(request: NextRequest) {
  try {
    return toNextResponse(await flashSaleService.getActiveFlashSale());
  } catch (error: unknown) {
    return toNextResponse(internalServerErrorResponse());
  }
}
