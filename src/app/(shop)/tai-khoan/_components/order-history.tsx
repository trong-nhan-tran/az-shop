"use client";
import BoxContent from "../../_components/layouts/box-content";
import { OrderWithDetailType } from "@/schemas";
import { Package } from "lucide-react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui-shadcn/tabs";
import { OrderHistoryCard } from "./order-card";
import { Input } from "@/components/ui-shadcn/input";
import { useQuery } from "@tanstack/react-query";
import { getOrderHistory } from "@/apis/api-order";

type Props = {
  enabled: boolean;
};

const OrderHistory = ({ enabled }: Props) => {
  const { data, isPending, error } = useQuery({
    queryKey: ["orderHistory"],
    queryFn: () => getOrderHistory(),
    enabled: enabled,
  });
  const orders: OrderWithDetailType[] | undefined = data?.data;

  if (error) {
    console.error("Lỗi tải lịch sử đơn hàng:", error);
  }
  const getOrdersByStatus = (status: string) => {
    if (status === "all") return orders || [];
    return orders?.filter((order) => order.order_status === status) || [];
  };

  const renderOrderList = (filteredOrders: OrderWithDetailType[]) => {
    if (filteredOrders.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-400 text-sm">Không có đơn hàng</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <OrderHistoryCard key={order.id} order={order} />
        ))}
      </div>
    );
  };

  if (!orders || orders.length === 0) {
    return (
      <BoxContent>
        <div className="flex flex-col items-center justify-center py-20">
          <Package className="w-16 h-16 text-gray-300 mb-3" />
          <p className="text-gray-500">Chưa có đơn hàng</p>
        </div>
      </BoxContent>
    );
  }

  return (
    <BoxContent>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <h2 className="font-bold text-xl">Lịch sử mua hàng</h2>
        <Input className="md:max-w-xs" placeholder="Tìm kiếm đơn hàng"></Input>
      </div>
      <Tabs defaultValue="all" className="md:w-full">
        <TabsList className="w-full h-10! overflow-x-auto overflow-y-hidden justify-start">
          <TabsTrigger value="all" className="shrink-0">
            Tất cả
          </TabsTrigger>
          <TabsTrigger value="pending" className="shrink-0">
            Chờ xác nhận
          </TabsTrigger>
          <TabsTrigger value="confirmed" className="shrink-0">
            Đã xác nhận
          </TabsTrigger>
          <TabsTrigger value="completed" className="shrink-0">
            Hoàn thành
          </TabsTrigger>
          <TabsTrigger value="canceled" className="shrink-0">
            Đã hủy
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">{renderOrderList(orders)}</TabsContent>

        <TabsContent value="pending">
          {renderOrderList(getOrdersByStatus("pending"))}
        </TabsContent>

        <TabsContent value="confirmed">
          {renderOrderList(getOrdersByStatus("confirmed"))}
        </TabsContent>

        <TabsContent value="completed">
          {renderOrderList(getOrdersByStatus("completed"))}
        </TabsContent>

        <TabsContent value="canceled">
          {renderOrderList(getOrdersByStatus("canceled"))}
        </TabsContent>
      </Tabs>
    </BoxContent>
  );
};

export default OrderHistory;
