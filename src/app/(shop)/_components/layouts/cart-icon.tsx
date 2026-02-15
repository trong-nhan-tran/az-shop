"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCartQuantityStore } from "@/stores/store-cart-quantity";
import { useQuery } from "@tanstack/react-query";
import { getTotalQuantity } from "@/apis";
import { useAuthStatus } from "@/hooks/useAuthStatus";
import toast from "react-hot-toast";

const CartIcon = () => {
  const { isLoggedIn, isChecking } = useAuthStatus();
  const { totalQuantity, setTotalQuantity } = useCartQuantityStore();
  const {
    data: totalQuantityResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["total-quantity"],
    queryFn: () => getTotalQuantity(),
    enabled: isLoggedIn && !isChecking,
  });

  if (error) {
    console.error("Lỗi tải giỏ hàng:", error.message);
    toast.error("Lỗi tải giỏ hàng");
  }
  useEffect(() => {
    if (totalQuantityResponse?.data) {
      setTotalQuantity(totalQuantityResponse.data);
    }
  }, [totalQuantityResponse?.data, setTotalQuantity]);

  return (
    <Link href="/gio-hang" className="relative">
      <svg viewBox="0 0 14 44" width="16" xmlns="http://www.w3.org/2000/svg">
        <path d="m11.3535 16.0283h-1.0205a3.4229 3.4229 0 0 0 -3.333-2.9648 3.4229 3.4229 0 0 0 -3.333 2.9648h-1.02a2.1184 2.1184 0 0 0 -2.117 2.1162v7.7155a2.1186 2.1186 0 0 0 2.1162 2.1167h8.707a2.1186 2.1186 0 0 0 2.1168-2.1167v-7.7155a2.1184 2.1184 0 0 0 -2.1165-2.1162zm-4.3535-1.8652a2.3169 2.3169 0 0 1 2.2222 1.8652h-4.4444a2.3169 2.3169 0 0 1 2.2222-1.8652zm5.37 11.6969a1.0182 1.0182 0 0 1 -1.0166 1.0171h-8.7069a1.0182 1.0182 0 0 1 -1.0165-1.0171v-7.7155a1.0178 1.0178 0 0 1 1.0166-1.0166h8.707a1.0178 1.0178 0 0 1 1.0164 1.0166z"></path>
      </svg>

      {totalQuantity > 0 && (
        <span className="absolute top-5.5 left-2 bg-black text-white text-[10px] rounded-full h-3.5 w-3.5 flex items-center justify-center">
          {totalQuantity > 99 ? "99+" : totalQuantity}
        </span>
      )}
    </Link>
  );
};

export default CartIcon;
