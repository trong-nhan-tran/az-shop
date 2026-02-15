import { NextRequest } from "next/server";
import { authService } from "@/services";
import {
  internalServerErrorResponse,
  toNextResponse,
} from "@/libs/helper-response";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("body------------", body);
    const { email, password } = body;

    const result = await authService.loginWithEmailPassword({
      email,
      password,
    });

    return toNextResponse(result);
  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
    return toNextResponse(internalServerErrorResponse());
  }
}
