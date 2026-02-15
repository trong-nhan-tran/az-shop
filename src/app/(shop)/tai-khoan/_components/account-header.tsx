"use client";

import { Mail, Phone, MapPin, User2, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { ProfileWithOrderType } from "@/schemas";
import { createClient } from "@/libs/supabase/supabase-client";
import { useCartQuantityStore } from "@/stores/store-cart-quantity";
import { Button } from "@/components/ui-shadcn/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui-shadcn/avatar";
import BoxContent from "../../_components/layouts/box-content";
import { toast } from "react-hot-toast";
import { getProfileCustomer } from "@/apis/api-profile";
import { useQuery } from "@tanstack/react-query";
type Props = {
  enabled: boolean;
};

const AccountInformation = ({ enabled }: Props) => {
  const { data, isPending, error } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfileCustomer,
    enabled: enabled,
  });
  const profile: ProfileWithOrderType | undefined = data?.data;
  if (error) {
    console.error("Lỗi tải thông tin cá nhân:", error.message);
    toast.error(error.message || "Lỗi tải thông tin cá nhân");
  }
  const router = useRouter();
  const supabase = createClient();
  const { resetTotalQuantity } = useCartQuantityStore();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    resetTotalQuantity();
    router.push("/");
  };

  return (
    <BoxContent>
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-xl">Tài khoản</h2>
        <Button
          onClick={handleLogout}
          variant="outline"
          className="cursor-pointer"
        >
          <LogOut />
          Đăng xuất
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 rounded-md">
            <AvatarImage src={profile?.avatar_url || ""} alt="Avatar" />
            <AvatarFallback className="rounded-md">
              <User2 className="text-gray-600" size={20} />
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase">
              Họ Tên
            </p>
            <p>{profile?.name || "Chưa cập nhật"}</p>
          </div>
        </div>
        {/* Email */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
            <Mail className="text-blue-600" size={20} />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase">
              E-mail
            </p>
            <p>{profile?.email || "Chưa cập nhật"}</p>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
            <Phone className="text-green-600" size={20} />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase">
              Số điện thoại
            </p>
            <p>{profile?.phone || "Chưa cập nhật"}</p>
          </div>
        </div>

        {/* Address */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
            <MapPin className="text-purple-600" size={20} />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase">
              Địa chỉ
            </p>
            <p>{profile?.address || "Chưa cập nhật"}</p>
          </div>
        </div>
      </div>
      <div className="flex gap-4">
        <Button
          size={"lg"}
          className="cursor-pointer flex-1 bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          Cập nhật thông tin
        </Button>
        <Button
          variant="outline"
          onClick={() => {}}
          size={"lg"}
          className="cursor-pointer flex-1"
        >
          Đổi mật khẩu
        </Button>
      </div>
    </BoxContent>
  );
};

export default AccountInformation;
