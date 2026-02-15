"use client";
import Image from "next/image";
import { X } from "lucide-react";
import { formatPrice } from "@/libs/utils";
import Link from "next/link";
import { CartItemWithDetailType } from "@/schemas/schema-cart-item";
import { updateQuantity, deleteCartItem } from "@/apis";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useCartQuantityStore } from "@/stores/store-cart-quantity";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui-shadcn/select";
interface CartItemProps {
  item: CartItemWithDetailType;
}

const CartItem = ({ item }: CartItemProps) => {
  const queryClient = useQueryClient();
  const { incrementQuantity, decrementQuantity } = useCartQuantityStore();
  const updateQuantityMutation = useMutation({
    mutationFn: (data: {
      product_item_id: number;
      quantity: number;
      oldQuantity: number;
    }) =>
      updateQuantity({
        product_item_id: data.product_item_id,
        quantity: data.quantity,
      }),
    onSuccess: (response, variables) => {
      if (response.success) {
        toast.success("Cập nhật số lượng thành công");
        queryClient.invalidateQueries({ queryKey: ["cart"] });
        const quantityDiff = variables.quantity - variables.oldQuantity;
        if (quantityDiff > 0) {
          incrementQuantity(quantityDiff);
        } else if (quantityDiff < 0) {
          decrementQuantity(Math.abs(quantityDiff));
        }
      } else {
        toast.error(response.message || "Cập nhật số lượng thất bại");
      }
    },
    onError: () => {
      console.error("Lỗi cập nhật số lượng");
      toast.error("Lỗi server");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (data: { id: number; itemQuantity: number }) =>
      deleteCartItem(data.id),
    onSuccess: (response, variables) => {
      if (response.success) {
        toast.success("Xóa sản phẩm thành công");
        queryClient.invalidateQueries({ queryKey: ["cart"] });
        decrementQuantity(variables.itemQuantity || 0);
      } else {
        toast.error(response.message || "Xóa sản phẩm thất bại");
      }
    },
    onError: () => {
      console.error("Lỗi xóa sản phẩm");
      toast.error("Lỗi server");
    },
  });
  return (
    <div className="bg-white rounded-xl p-4 relative shadow-md border border-gray-50">
      <button
        onClick={() =>
          deleteMutation.mutate({ id: item.id, itemQuantity: item.quantity })
        }
        className="absolute top-3 right-3 cursor-pointer text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full p-1 transition-all duration-200 z-10"
        aria-label="Remove item"
      >
        <X size={20} />
      </button>

      <div className="flex gap-3">
        {/* Product Image */}
        <div className="shrink-0 w-24 h-24 relative rounded-lg overflow-hidden border border-gray-100">
          <Image
            src={
              item.product_items.product_colors.thumbnail || "/placeholder.png"
            }
            alt={item.product_items.product_colors.color_name}
            width={100}
            height={100}
            className="object-cover w-full h-full"
          />
        </div>

        {/* Product Info */}
        <div className="flex-1 flex flex-col min-w-0">
          <div>
            <Link
              href={`/san-pham/${item.product_items.product_variants.slug}`}
              className="font-medium hover:text-blue-600 capitalize transition-colors wrap-break-word"
            >
              {item.product_items.product_variants.name}
            </Link>
            <div>
              <span className="text-sm text-gray-700 capitalize">
                {item.product_items.product_colors.color_name}
              </span>
            </div>
            <div className="mt-1">
              <span className="font-semibold text-red-500">
                {formatPrice(item.product_items.price)}
              </span>
            </div>
            <div className="mt-1 flex items-center gap-2 flex-wrap">
              {/* {item.product_items.is_flash_sale && (
                <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-red-500 text-white rounded-md">
                  ⚡ Flash Sale
                </span>
              )} */}
              {!item.product_items.is_available && (
                <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-gray-500 text-white rounded-md">
                  Hết hàng
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Quantity Select - Positioned at right side, aligned to bottom */}
        <div className="shrink-0 flex items-end">
          <Select
            value={item.quantity.toString()}
            onValueChange={(value) => {
              const newQuantity = parseInt(value);
              updateQuantityMutation.mutate({
                product_item_id: item.product_items.id,
                quantity: newQuantity,
                oldQuantity: item.quantity,
              });
            }}
            disabled={!item.product_items.is_available}
          >
            <SelectTrigger size="sm">
              <SelectValue placeholder="SL" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
