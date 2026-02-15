"use client";

import { Button } from "@/components/ui-shadcn/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomInput from "@/components/ui-shared/input-custom";
import { Form } from "@/components/ui-shadcn/form";
import { orderInputSchema, OrderInputType } from "@/schemas/schema-order";
import BoxContent from "../../_components/layouts/box-content";
import { placeOrder } from "@/apis";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useCartQuantityStore } from "@/stores/store-cart-quantity";
interface CustomerInformationProps {
  onCheckout?: () => void;
  totalPrice?: number;
  discount?: number;
  loading?: boolean;
}

const CustomerInformation = ({
  onCheckout = () => {},
  totalPrice = 0,
  discount = 0,
  loading = false,
}: CustomerInformationProps) => {
  const queryClient = useQueryClient();
  const { resetTotalQuantity } = useCartQuantityStore();
  const form = useForm<OrderInputType>({
    resolver: zodResolver(orderInputSchema),
    defaultValues: {
      customer_name: "",
      customer_phone: "",
      address: "",
    },
  });
  const placeOrderMutation = useMutation({
    mutationFn: (data: OrderInputType) => placeOrder(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Đặt hàng thành công");
        queryClient.invalidateQueries({ queryKey: ["cart"] });
        resetTotalQuantity();
      } else {
        toast.error(response.message || "Đặt hàng thất bại");
      }
    },
    onError: () => {
      console.error("Lỗi đặt hàng");
      toast.error("Lỗi server");
    },
  });
  return (
    <BoxContent>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => {
            placeOrderMutation.mutate(data);
            onCheckout();
          })}
        >
          {/* Customer Information */}
          <div className="mb-6">
            <h2 className="font-bold mb-4 text-xl">Thông tin nhận hàng</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <CustomInput
                  name="customer_name"
                  label="Tên người nhận"
                  placeholder="Nhập tên"
                  control={form.control}
                  className="w-full"
                  isRequired
                  disabled={loading}
                  labelSize="medium"
                />

                <CustomInput
                  name="customer_phone"
                  label="Số điện thoại "
                  placeholder="Nhập số điện thoại"
                  control={form.control}
                  className="w-full"
                  isRequired
                  disabled={loading}
                  labelSize="medium"
                />
              </div>
              <CustomInput
                name="address"
                label="Địa chỉ nhận hàng"
                placeholder="Số nhà, tên đường, phường/xã, tỉnh/thành phố"
                control={form.control}
                className="w-full"
                isRequired
                disabled={loading}
                labelSize="medium"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading || placeOrderMutation.isPending}
            className="w-full h-12 mt-4 bg-blue-500 cursor-pointer disabled:opacity-50 hover:bg-blue-400 transition-all text-base"
          >
            Đặt hàng ngay
          </Button>
        </form>
      </Form>
    </BoxContent>
  );
};

export default CustomerInformation;
