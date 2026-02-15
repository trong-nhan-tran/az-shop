import { Card } from "@/components/ui-shadcn/card";
import SignUpForm from "../_components/signup-form";
import Link from "next/link";

export const metadata = {
  title: "Đăng ký | AZ Shop",
  description: "Đăng ký để trải nghiệm mua sắm tuyệt vời!",
};
export default function Page() {
  return (
    <div className="flex items-center justify-center py-5">
      <Card className="w-full max-w-md p-8 bg-white shadow-xl rounded-2xl border-0">
        <div>
          <h1 className="text-center text-2xl font-semibold text-gray-900">
            Đăng ký tài khoản
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Tạo tài khoản mới để trải nghiệm mua sắm tuyệt vời!
          </p>
        </div>
        <SignUpForm />
        <div className="flex text-sm justify-between text-blue-600 font-medium">
          <Link
            href={"/dang-nhap"}
            className="relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full"
          >
            Đăng nhập
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
