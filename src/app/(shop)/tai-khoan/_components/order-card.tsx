import { OrderWithDetailType } from "@/schemas";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import Image from "next/image";
import { Badge } from "@/components/ui-shadcn/badge";
import { Button } from "@/components/ui-shadcn/button";
import { Separator } from "@/components/ui-shadcn/separator";
import { Package } from "lucide-react";

const formatCurrency = (amount: number | any) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(Number(amount));
};

const getOrderStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-500 hover:bg-yellow-600";
    case "confirmed":
      return "bg-blue-500 hover:bg-blue-600";
    case "completed":
      return "bg-green-500 hover:bg-green-600";
    case "canceled":
      return "bg-red-500 hover:bg-red-600";
    default:
      return "bg-gray-500";
  }
};

const getPaymentStatusInfo = (status: string) => {
  switch (status) {
    case "paid":
      return { label: "Đã thanh toán", color: "text-green-600" };
    case "unpaid":
      return { label: "Chưa thanh toán", color: "text-yellow-600" };
    case "failed":
      return { label: "Thất bại", color: "text-red-600" };
    default:
      return { label: status, color: "text-gray-600" };
  }
};

const translateOrderStatus = (status: string) => {
  const map: Record<string, string> = {
    pending: "Chờ xử lý",
    confirmed: "Đã xác nhận",
    completed: "Hoàn thành",
    canceled: "Đã hủy",
  };
  return map[status] || status;
};

const translatePaymentMethod = (method: string) => {
  const map: Record<string, string> = {
    cod: "COD",
    momo: "Ví MoMo",
  };
  return map[method] || method;
};

interface OrderHistoryCardProps {
  order: OrderWithDetailType;
}

export const OrderHistoryCard = ({ order }: OrderHistoryCardProps) => {
  return (
    <div className="w-full rounded-xl border border-gray-50 bg-white shadow-sm">
      <div className="flex border-b px-4 py-2 items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center font-semibold text-sm gap-2">
            <span>
              {format(new Date(order.created_at), "dd / MM / yyyy", {
                locale: vi,
              })}
            </span>

            <span className=" text-gray-900">#DH{order.id}</span>
          </div>
        </div>

        <Badge
          className={`${getOrderStatusColor(order.order_status)} text-white border-none px-3 py-1`}
        >
          {translateOrderStatus(order.order_status)}
        </Badge>
      </div>

      <div className="p-4 space-y-4">
        {order.order_items.map((item) => (
          <div key={item.id} className="flex gap-4 items-start">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden">
              {item.thumbnail ? (
                <Image
                  src={item.thumbnail}
                  alt={item.product_name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-400">
                  <Package size={24} />
                </div>
              )}
            </div>

            <div className="flex flex-1 flex-col justify-between min-h-20">
              <div>
                <h4 className="font-medium text-gray-900 line-clamp-2">
                  {item.product_name}
                </h4>
                <div className="mt-1 flex flex-wrap gap-2 text-sm text-gray-500">
                  {item.variant && (
                    <Badge variant={"secondary"}>{item.variant}</Badge>
                  )}
                  {item.color_name && (
                    <Badge variant={"secondary"}>{item.color_name}</Badge>
                  )}
                </div>
              </div>

              <div className="mt-2 flex items-center justify-between">
                <Badge variant={"ghost"}>x{item.quantity}</Badge>
                <span className="font-medium text-gray-900">
                  {formatCurrency(item.price)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Separator />

      <div className="flex items-center justify-between px-4 py-2">
        <Button variant={"outline"} size="default">
          Xem chi tiết
        </Button>
        <div className="flex gap-2 items-baseline">
          <span className="text-md text-gray-600">Thành tiền:</span>
          <span className="text-lg font-semibold text-primary">
            {formatCurrency(order.total_amount)}
          </span>
        </div>
      </div>
    </div>
  );
};
