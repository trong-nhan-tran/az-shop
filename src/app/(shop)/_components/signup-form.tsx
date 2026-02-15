"use client";
import CustomInput from "@/components/ui-shared/input-custom";
import { Form } from "@/components/ui-shadcn/form";
import { useForm } from "react-hook-form";
import { registerSchema, RegisterInputType } from "@/schemas/schema-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpWithEmail } from "@/apis";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FieldSeparator } from "@/components/ui-shadcn/field";
import { createClient } from "@/libs/supabase/supabase-client";

export default function SignUpForm() {
  const router = useRouter();
  const supabase = createClient();
  const form = useForm<RegisterInputType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });
    if (error) {
      toast.error("Đăng nhập với Google thất bại. Vui lòng thử lại.");
      console.error("Lỗi đăng nhập với Google:", error);
    }
  };
  const loginWithGithub = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });
    if (error) {
      toast.error("Đăng nhập với GitHub thất bại. Vui lòng thử lại.");
      console.error("Lỗi đăng nhập với GitHub:", error);
    }
  };
  const onSubmit = async (data: RegisterInputType) => {
    try {
      const response = await signUpWithEmail(data);
      console.log("Đăng ký response:", response);
      if (response && response.success) {
        toast.success("Đăng ký thành công!");
        router.push("/"); // Redirect to home page on successful login
      } else {
        toast.error(response.message || "Đăng ký thất bại");
      }
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      toast.error("Đăng ký thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <CustomInput
          control={form.control}
          name="full_name"
          label="Họ và tên"
          placeholder="Nguyễn Văn A"
        />
        <CustomInput
          control={form.control}
          name="email"
          label="E-mail"
          placeholder="example@email.com"
        />

        <CustomInput
          control={form.control}
          name="password"
          label="Mật khẩu"
          placeholder="Nhập mật khẩu"
          type="password"
        />
        <CustomInput
          control={form.control}
          name="confirmPassword"
          label="Xác nhận mật khẩu"
          placeholder="Nhập lại mật khẩu"
          type="password"
        />
        <div className="space-y-4">
          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
          >
            Đăng ký ngay
          </button>
          <FieldSeparator className="mb-4 ">Hoặc tiếp tục với</FieldSeparator>
          <div className="flex gap-4">
            <button
              type="button"
              className="flex justify-center w-full py-3 px-4 bg-gray-50 shadow hover:bg-gray-100 rounded-md"
              onClick={loginWithGoogle}
            >
              <Image
                src="/images/logo/google.svg"
                alt="Google"
                width={20}
                height={20}
              />
              <span className="ml-2 text-gray-700">Google</span>
            </button>
            <button
              type="button"
              onClick={loginWithGithub}
              className="w-full flex justify-center py-3 px-4 bg-gray-50 shadow hover:bg-gray-100 rounded-md"
            >
              <Image
                src="/images/logo/github.svg"
                alt="Github"
                width={20}
                height={20}
              />
              <span className="ml-2 text-gray-700">Github</span>
            </button>
          </div>
        </div>
      </form>
    </Form>
  );
}
