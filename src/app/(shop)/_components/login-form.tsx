"use client";
import CustomInput from "@/components/ui-shared/input-custom";
import { Form } from "@/components/ui-shadcn/form";
import { useForm } from "react-hook-form";
import { loginSchema, LoginInputType } from "@/schemas/schema-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInWithEmail } from "@/apis";
import { useRouter } from "next/navigation";
import { FieldSeparator } from "@/components/ui-shadcn/field";
import Image from "next/image";
import toast from "react-hot-toast";
import { createClient } from "@/libs/supabase/supabase-client";

export default function LoginForm() {
  const router = useRouter();
  const supabase = createClient();
  const form = useForm<LoginInputType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
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

  const onSubmit = async (data: LoginInputType) => {
    try {
      const response = await signInWithEmail(data);
      console.log("Đăng nhập response:", response);
      if (response && response.success) {
        toast.success("Đăng nhập thành công!");
        router.push("/");
      } else {
        toast.error(response.message || "Đăng nhập thất bại");
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      toast.error("Đăng nhập thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
        <div className="space-y-4">
          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
          >
            Đăng nhập
          </button>
          <FieldSeparator className="mb-4 ">Hoặc tiếp tục với</FieldSeparator>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={loginWithGoogle}
              className="flex justify-center w-full py-3 px-4 bg-gray-50 shadow hover:bg-gray-100 rounded-md"
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
