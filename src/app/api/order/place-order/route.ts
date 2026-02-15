import { NextRequest } from "next/server";
import {
  internalServerErrorResponse,
  toNextResponse,
  notFoundResponse,
} from "@/libs/helper-response";
import { authService } from "@/services/service-auth";
import { cartItemService } from "@/services/service-cart-item";
import { orderService } from "@/services/service-order";
import { CartItemWithDetailType, OrderItemInputType } from "@/schemas";

export async function POST(request: NextRequest) {
  try {
    const authResponse = await authService.isUser();
    if (!authResponse.success) {
      return toNextResponse(authResponse);
    }
    const profile_id = authResponse.data?.id;
    if (!profile_id) {
      return toNextResponse(internalServerErrorResponse());
    }

    const cartItemResponse = await cartItemService.getCartForUser(profile_id);
    if (!cartItemResponse.success || !cartItemResponse.data) {
      return toNextResponse(cartItemResponse);
    }

    const cartItems = cartItemResponse.data;

    if (cartItems.length === 0) {
      return toNextResponse(
        notFoundResponse("Giỏ hàng trống, không thể đặt hàng"),
      );
    }

    const body = await request.json();

    const orderItems: OrderItemInputType[] = cartItems.map(
      (item: CartItemWithDetailType) => ({
        product_item_id: item.product_item_id,
        quantity: item.quantity,
        product_name: item.product_items?.product_variants?.name || "",
        color_name: item.product_items?.product_colors?.color_name || "",
        variant: item.product_items?.product_variants?.variant || "",
        price: item.product_items?.price || 0,
        thumbnail: item.product_items?.product_colors?.thumbnail || "",
      }),
    );

    const orderResponse = await orderService.create({
      order: {
        customer_name: body.customer_name,
        customer_phone: body.customer_phone,
        address: body.address,
        profile_id: profile_id,
        order_status: body.order_status,
        payment_method: body.payment_method,
        payment_status: body.payment_status,
      },
      orderItems: orderItems,
    });

    if (orderResponse.success) {
      await cartItemService.clearCart(profile_id);
    }

    return toNextResponse(orderResponse);
  } catch (error: unknown) {
    console.error("Lỗi đặt hàng:", error);
    return toNextResponse(internalServerErrorResponse());
  }
}
