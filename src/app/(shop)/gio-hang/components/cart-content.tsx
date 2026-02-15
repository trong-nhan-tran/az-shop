"use client";
import CartItem from "./cart-item";
import { formatPrice } from "@/libs/utils";
import CartEmpty from "./cart-empty";
import CustomerInformation from "./customer-information";
import { useQuery } from "@tanstack/react-query";
import { getCartForUser } from "@/apis";
import { useAuthStatus } from "@/hooks/useAuthStatus";
import toast from "react-hot-toast";
import LoadingCart from "./loading-cart";
import BoxContent from "../../_components/layouts/box-content";

type Props = {};

const CartContent = (props: Props) => {
  const { isLoggedIn, isChecking } = useAuthStatus();
  const {
    data: cartListResponse,
    error,
    isPending,
  } = useQuery({
    queryKey: ["cart"],
    queryFn: () => getCartForUser(),
    enabled: isLoggedIn && !isChecking,
  });
  if (error) {
    console.error("Lỗi tải giỏ hàng:", error.message);
    toast.error("Lỗi tải giỏ hàng");
  }

  if (isChecking || isPending) {
    return <LoadingCart />;
  }

  if (
    !isLoggedIn ||
    !cartListResponse?.data ||
    cartListResponse.data.length === 0
  ) {
    return <CartEmpty />;
  }
  const getTotalPrice = () => {
    if (!cartListResponse?.data) return 0;
    return cartListResponse.data.reduce((total, item) => {
      return total + item.quantity * item.product_items.price;
    }, 0);
  };
  if (cartListResponse?.success && cartListResponse?.data) {
    return (
      <>
        <BoxContent>
          <h2 className="font-bold mb-4 text-xl">Giỏ hàng</h2>
          <div className="space-y-4">
            {cartListResponse?.data?.map((item) => (
              <CartItem key={item.product_item_id} item={item} />
            ))}
          </div>
          <div className="mt-3 text-lg border-gray-200 flex justify-between font-semibold">
            <span>Tổng tiền</span>
            <span className="text-red-500">{formatPrice(getTotalPrice())}</span>
          </div>
        </BoxContent>
        <CustomerInformation />
      </>
    );
  }

  return <CartEmpty />;
};

export default CartContent;
