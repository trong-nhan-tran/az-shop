"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui-shadcn/dialog";
import LoginForm from "../login-form";
import SignUpForm from "../signup-form";
import Link from "next/link";
import { useAuthStatus } from "@/hooks/useAuthStatus";

export function AccountIcon() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const { isLoggedIn, isChecking } = useAuthStatus();

  const handleClick = () => {
    if (isChecking) return; // Don't do anything while checking

    if (isLoggedIn) {
      router.push("/tai-khoan");
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <i
        className="bi bi-person text-xl cursor-pointer hover:opacity-70 transition-opacity"
        onClick={handleClick}
      />

      {/* Only render modal when user is not logged in and modal needs to be opened */}
      {!isLoggedIn && isModalOpen && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="bg-white sm:max-w-md">
            <DialogHeader className="items-center text-center">
              <DialogTitle className="text-2xl font-semibold">
                {mode === "login" ? "Đăng nhập" : "Đăng ký tài khoản"}
              </DialogTitle>
              <DialogDescription>
                {mode === "login"
                  ? "Chào mừng bạn quay trở lại!"
                  : "Tạo tài khoản mới để trải nghiệm mua sắm tuyệt vời!"}
              </DialogDescription>
            </DialogHeader>
            <div>{mode === "login" ? <LoginForm /> : <SignUpForm />}</div>
            <div className="text-center text-sm">
              {mode === "login" ? (
                <div className="flex justify-between text-blue-600 font-medium">
                  <button
                    onClick={() => setMode("signup")}
                    className="relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full"
                  >
                    Đăng ký ngay
                  </button>
                  <Link
                    href={"/quen-mat-khau"}
                    className="relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full"
                  >
                    Quên mật khẩu
                  </Link>
                </div>
              ) : (
                <div className="flex justify-between text-blue-600 font-medium">
                  <button
                    onClick={() => setMode("login")}
                    className="relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full"
                  >
                    Đăng nhập
                  </button>
                  <Link
                    href={"/quen-mat-khau"}
                    className="relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full"
                  >
                    Quên mật khẩu
                  </Link>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
