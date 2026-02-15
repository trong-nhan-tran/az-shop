import { OrderType, OrderWithDetailType } from "@/schemas";
import { ColumnDef } from "@tanstack/react-table";
import { ButtonWithTooltip } from "@/app/admin/_components/ui/button-with-tooltip";
import {
  Trash,
  SquarePen,
  ChevronDown,
  ChevronRight,
  Plus,
  ArrowUpDown,
} from "lucide-react";
import { Badge } from "@/components/ui-shadcn/badge";
import { useAddressStore } from "@/stores/province-ward-store";
import { Button } from "@/components/ui-shadcn/button";

const getStatusBadge = (status: string) => {
  switch (status) {
    case "đang chờ":
      return (
        <Badge
          variant="outline"
          className="bg-yellow-100 border-yellow-300 text-yellow-800"
        >
          Đang chờ
        </Badge>
      );
    case "đang giao":
      return (
        <Badge
          variant="outline"
          className="bg-blue-100 border-blue-300 text-blue-800"
        >
          Đang giao
        </Badge>
      );
    case "đã giao":
      return (
        <Badge
          variant="outline"
          className="bg-green-100 border-green-300 text-green-800"
        >
          Đã giao
        </Badge>
      );
    case "đã hủy":
      return (
        <Badge
          variant="outline"
          className="bg-red-100 border-red-300 text-red-800"
        >
          Đã hủy
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export const getColumns = ({
  onEdit,
  onDelete,
  onAddNewOrderItem,
}: {
  onEdit: (item: OrderType) => void;
  onDelete: (item: OrderType) => void;
  onAddNewOrderItem: (orderId: number) => void;
}): ColumnDef<OrderWithDetailType>[] => {
  // Get functions from store
  const { getProvinceName, getWardName } = useAddressStore.getState();

  return [
    {
      accessorKey: "expand",
      header: "",
      enableHiding: false,
      cell: ({ row }) => {
        const isExpanded = row.getIsExpanded();
        return (
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              row.toggleExpanded();
            }}
            className="rounded-full hover:bg-gray-200"
          >
            {isExpanded ? <ChevronDown /> : <ChevronRight />}
          </Button>
        );
      },
    },
    {
      id: "ID",
      header: "ID",
      accessorKey: "id",
      enableHiding: true,
      cell: ({ row }) => (
        <span className="whitespace-nowrap font-medium text-gray-900">
          {row.original.id}
        </span>
      ),
    },
    {
      id: "Khách hàng",
      header: ({ column }) => {
        return (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center hover:text-blue-400 cursor-pointer w-fit"
          >
            <span>Khách hàng</span>
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </button>
        );
      },
      accessorKey: "customer_name",
      enableHiding: true,
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">
            {row.original.customer_name}
          </span>
          <span className="text-sm text-gray-500">
            {row.original.customer_phone}
          </span>
        </div>
      ),
    },
    {
      id: "Địa chỉ",
      header: "Địa chỉ",
      accessorKey: "street",
      enableHiding: true,
      cell: ({ row }) => (
        <div className="flex flex-col max-w-[200px]">
          <span className="text-gray-700 line-clamp-2">
            {row.original.street}
          </span>
          <span className="text-sm text-gray-500">
            {row.original.ward ? getWardName(row.original.ward) : "Không có"},{" "}
            {row.original.province
              ? getProvinceName(row.original.province)
              : "Không có"}
          </span>
        </div>
      ),
    },
    {
      id: "Số sản phẩm",
      header: ({ column }) => {
        return (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center hover:text-blue-400 cursor-pointer w-fit"
          >
            <span>Số sản phẩm</span>
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </button>
        );
      },
      accessorKey: "order_items",
      enableHiding: true,
      cell: ({ row }) => {
        const total =
          row.original.order_items?.reduce(
            (sum, item) => sum + Number(item.quantity),
            0
          ) || 0;

        return (
          <span className="whitespace-nowrap font-medium text-blue-600">
            {total} sản phẩm
          </span>
        );
      },
      sortingFn: (rowA, rowB) => {
        const a =
          rowA.original.order_items?.reduce(
            (sum, item) => sum + Number(item.quantity),
            0
          ) || 0;
        const b =
          rowB.original.order_items?.reduce(
            (sum, item) => sum + Number(item.quantity),
            0
          ) || 0;
        return a - b;
      },
    },
    {
      id: "Tổng tiền",
      header: ({ column }) => {
        return (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center hover:text-blue-400 cursor-pointer w-fit"
          >
            <span>Tổng tiền</span>
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </button>
        );
      },
      accessorKey: "total",
      enableHiding: true,
      cell: ({ row }) => {
        const total =
          row.original.order_items?.reduce(
            (sum, item) => sum + Number(item.price) * Number(item.quantity),
            0
          ) || 0;

        return (
          <span className="whitespace-nowrap font-semibold text-green-600">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(total)}
          </span>
        );
      },
      sortingFn: (rowA, rowB) => {
        const a =
          rowA.original.order_items?.reduce(
            (sum, item) => sum + Number(item.price) * Number(item.quantity),
            0
          ) || 0;
        const b =
          rowB.original.order_items?.reduce(
            (sum, item) => sum + Number(item.price) * Number(item.quantity),
            0
          ) || 0;
        return a - b;
      },
    },
    {
      id: "Trạng thái",
      header: "Trạng thái",
      accessorKey: "order_statuses.name",
      enableHiding: true,
      cell: ({ row }) =>
        getStatusBadge(row.original.order_statuses?.name || ""),
    },
    {
      id: "Ngày đặt hàng",
      accessorKey: "created_at",
      header: ({ column }) => {
        return (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center hover:text-blue-400 cursor-pointer w-fit"
          >
            <span>Ngày đặt hàng</span>
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </button>
        );
      },
      cell: ({ row }) => {
        const date = row.original.created_at
          ? new Date(row.original.created_at)
          : null;
        return (
          <div className="flex flex-col">
            <span className="text-gray-500 text-sm">
              {date
                ? date.toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })
                : ""}
            </span>
            <span className="text-gray-700">
              {date
                ? date.toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })
                : ""}
            </span>
          </div>
        );
      },
      sortingFn: (rowA, rowB) => {
        const a = rowA.original.created_at
          ? new Date(rowA.original.created_at).getTime()
          : 0;
        const b = rowB.original.created_at
          ? new Date(rowB.original.created_at).getTime()
          : 0;
        return a - b;
      },
    },
    {
      id: "actions",
      header: "Thao tác",
      enableHiding: false,
      cell: ({ row }) => (
        <div className="flex gap-2">
          <ButtonWithTooltip
            type="button"
            tooltip="Sửa"
            variant="primary"
            size="icon"
            className="rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(row.original);
            }}
          >
            <SquarePen className="h-4 w-4" />
          </ButtonWithTooltip>
          <ButtonWithTooltip
            type="button"
            tooltip="Xóa"
            variant="destructive"
            size="icon"
            className="rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(row.original);
            }}
          >
            <Trash className="h-4 w-4" />
          </ButtonWithTooltip>
        </div>
      ),
    },
  ];
};
