import { Card } from "@/components/ui-shadcn/card";
import LoginForm from "../_components/login-form";
import Link from "next/link";

export const metadata = {
  title: "Đăng nhập | AZ Shop",
  description: "Chào mừng bạn quay trở lại!",
};
export default function Page() {
  return (
    <div className="flex items-center justify-center py-4 sm:py-10">
      <Card className="w-full max-w-md p-8 bg-white shadow-xl rounded-2xl border-0">
        <div>
          <h1 className="text-center text-2xl font-semibold text-gray-900">
            Đăng nhập
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Chào mừng bạn quay trở lại!
          </p>
        </div>
        <LoginForm />
        <div className="flex justify-between text-sm text-blue-600 font-medium">
          <Link
            href={"/dang-ky"}
            className="relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full"
          >
            Đăng ký ngay
          </Link>
          <Link
            href={"/quen-mat-khau"}
            className="relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full"
          >
            Quên mật khẩu
          </Link>
        </div>
      </Card>
    </div>
  );
}
