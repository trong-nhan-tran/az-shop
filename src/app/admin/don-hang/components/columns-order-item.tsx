import { OrderItemWithDetailType } from "@/schemas";
import { ColumnDef } from "@tanstack/react-table";
import { ButtonWithTooltip } from "@/app/admin/_components/ui/button-with-tooltip";
import { Trash, Edit, ArrowUpDown } from "lucide-react";

export const getColumns = ({
  onEdit,
  onDelete,
  orderId,
}: {
  onEdit: (item: OrderItemWithDetailType, orderId: number) => void;
  onDelete: (item: OrderItemWithDetailType) => void;
  orderId: number;
}): ColumnDef<OrderItemWithDetailType>[] => [
  {
    id: "ID",
    accessorKey: "id",
    header: "ID",
    enableHiding: true,
    cell: ({ row }) => (
      <span className="whitespace-nowrap font-medium text-foreground">
        {row.original.id}
      </span>
    ),
  },
  {
    id: "Sản phẩm",
    header: ({ column }) => {
      return (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center hover:text-link-hover cursor-pointer w-fit"
        >
          <span>Sản phẩm</span>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      );
    },
    accessorKey: "product_name",
    enableHiding: true,
    cell: ({ row }) => (
      <span className="font-medium text-foreground">
        {row.original.product_name}
      </span>
    ),
  },
  {
    id: "Màu sắc",
    header: ({ column }) => {
      return (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center hover:text-link-hover cursor-pointer w-fit"
        >
          <span>Màu sắc</span>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      );
    },
    accessorKey: "color_name",
    enableHiding: true,
    cell: ({ row }) => (
      <span className="text-foreground">{row.original.color_name}</span>
    ),
  },
  {
    id: "Tùy chọn",
    header: ({ column }) => {
      return (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center hover:text-link-hover cursor-pointer w-fit"
        >
          <span>Tùy chọn</span>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      );
    },
    accessorKey: "variant",
    enableHiding: true,
    cell: ({ row }) => (
      <div className="text-foreground">
        {row.original.variant || "Không có"}
      </div>
    ),
  },
  {
    id: "Số lượng",
    header: ({ column }) => {
      return (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center hover:text-link-hover cursor-pointer w-fit"
        >
          <span>Số lượng</span>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      );
    },
    accessorKey: "quantity",
    enableHiding: true,
    cell: ({ row }) => (
      <span className="font-medium text-link">{row.original.quantity}</span>
    ),
  },
  {
    id: "Ngày thêm",
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center hover:text-link-hover cursor-pointer w-fit"
        >
          <span>Ngày thêm</span>
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
          <span className="text-muted-foreground text-sm">
            {date
              ? date.toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })
              : ""}
          </span>
          <span className="text-foreground">
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
    id: "Thành tiền",
    header: ({ column }) => {
      return (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center hover:text-link-hover cursor-pointer w-fit"
        >
          <span>Thành tiền</span>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      );
    },
    accessorKey: "total",
    enableHiding: true,
    cell: ({ row }) => (
      <span className="font-bold text-green-700">
        {new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(Number(row.original.price) * row.original.quantity)}
      </span>
    ),
    sortingFn: (rowA, rowB) => {
      const a = (Number(rowA.original.price) || 0) * rowA.original.quantity;
      const b = (Number(rowB.original.price) || 0) * rowB.original.quantity;
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
          onClick={() => onEdit(row.original, orderId)}
        >
          <Edit className="h-4 w-4" />
        </ButtonWithTooltip>
        <ButtonWithTooltip
          type="button"
          tooltip="Xóa"
          variant="destructive"
          size="icon"
          className="rounded-full"
          onClick={() => onDelete(row.original)}
        >
          <Trash className="h-4 w-4" />
        </ButtonWithTooltip>
      </div>
    ),
  },
];
