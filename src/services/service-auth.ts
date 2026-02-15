import { createClient } from "@/libs/supabase/supabase-server";
import { createClient as createAdminClient } from "@/libs/supabase/supabase-admin-server";
import { loginSchema, registerSchema } from "@/schemas/schema-auth";
import { User } from "@supabase/supabase-js";
import {
  successResponse,
  Response,
  internalServerErrorResponse,
  unauthorizedResponse,
  forbiddenResponse,
  validationErrorResponse,
  badRequestResponse,
} from "@/libs/helper-response";

export const authService = {
  async loginWithEmailPassword(input: {
    email: string;
    password: string;
  }): Promise<Response<User | null>> {
    const validationResult = loginSchema.safeParse(input);
    if (!validationResult.success) {
      return validationErrorResponse(validationResult.error);
    }
    try {
      const supabase = await createClient();
      const { data, error } = await supabase.auth.signInWithPassword(input);

      if (error) {
        console.log("Lỗi đăng nhập:", error);
        return unauthorizedResponse("Email hoặc mật khẩu không đúng");
      }

      return successResponse(data.user);
    } catch (error) {
      console.log("Lỗi đăng nhập:", error);
      return internalServerErrorResponse();
    }
  },
  async signUpWithEmailPassword(input: {
    email: string;
    password: string;
    confirmPassword: string;
  }): Promise<Response<null>> {
    try {
      const validationResult = registerSchema.safeParse(input);
      if (!validationResult.success) {
        return validationErrorResponse(validationResult.error);
      }
      console.log("Đăng ký với input:", input);
      const supabase = await createClient();

      const { error } = await supabase.auth.signUp({
        email: input.email,
        password: input.password,
      });

      if (error) {
        if (error.code === "user_already_exists") {
          return badRequestResponse("Email đã được sử dụng");
        }

        console.error("Signup error:", error);
        return internalServerErrorResponse("Đăng ký thất bại");
      }

      return successResponse(
        null,
        "Đăng ký thành công. Vui lòng kiểm tra email để xác nhận tài khoản",
      );
    } catch (err) {
      console.error("Signup exception:", err);
      return internalServerErrorResponse();
    }
  },
  async logout(): Promise<Response<null>> {
    try {
      const supabase = await createClient();
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.log("Lỗi đăng xuất:", error);
        return internalServerErrorResponse("Đăng xuất thất bại");
      }

      return successResponse(null, "Đăng xuất thành công");
    } catch (error) {
      console.log("Lỗi đăng xuất:", error);
      return internalServerErrorResponse();
    }
  },

  async isUser(): Promise<Response<User | null>> {
    try {
      const supabase = await createClient();
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.log("Lỗi lấy thông tin người dùng:", error);
        return internalServerErrorResponse();
      }
      if (!user) return unauthorizedResponse();

      return successResponse(user);
    } catch (error) {
      console.log("Chưa xác thực:", error);
      return internalServerErrorResponse();
    }
  },
  async isAdmin(): Promise<Response<User | boolean | null | any>> {
    try {
      const userResponse = await this.isUser();
      if (!userResponse.success || !userResponse.data) {
        return userResponse;
      }

      const role = userResponse.data.app_metadata?.role;
      if (role !== "admin") {
        return forbiddenResponse();
      }
      return successResponse(true, "Người dùng là admin");
    } catch (error) {
      console.log("Lỗi kiểm tra quyền admin:", error);
      return internalServerErrorResponse();
    }
  },
  async setAdminRole(userId: string): Promise<Response<any | null>> {
    try {
      const supabase = await createAdminClient();
      const { data, error } = await supabase.auth.admin.updateUserById(userId, {
        app_metadata: { role: "admin" },
      });

      if (error) {
        console.log("Lỗi đặt vai trò admin:", error);
        return internalServerErrorResponse("Đặt vai trò admin thất bại");
      }

      return successResponse(data.user, "Đặt vai trò admin thành công");
    } catch (error) {
      console.log("Lỗi đặt vai trò admin:", error);
      return internalServerErrorResponse();
    }
  },
  async getProfile(): Promise<Response<any | null>> {
    try {
      const supabase = await createClient();
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        console.log("Lỗi lấy thông tin người dùng:", error);
        return internalServerErrorResponse();
      }
      if (!user) {
        return unauthorizedResponse();
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.log("Lỗi lấy hồ sơ người dùng:", profileError);
        return internalServerErrorResponse();
      }

      return successResponse(profile);
    } catch (error) {
      console.log("Lỗi lấy hồ sơ người dùng:", error);
      return internalServerErrorResponse();
    }
  },
};
