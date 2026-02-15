import { ProductItemWithDetails } from "@/schemas";
import { ColumnDef } from "@tanstack/react-table";
import { ButtonWithTooltip } from "@/app/admin/_components/ui/button-with-tooltip";
import { Trash, SquarePen, ArrowUpDown } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui-shadcn/badge";

export const getColumns = ({
  onEdit,
  onDelete,
}: {
  onEdit: (item: ProductItemWithDetails) => void;
  onDelete: (item: ProductItemWithDetails) => void;
}): ColumnDef<ProductItemWithDetails>[] => [
  {
    id: "ID",
    accessorKey: "id",
    header: "ID",
    enableHiding: true,
    cell: ({ row }) => (
      <span className="whitespace-nowrap font-medium text-gray-900">
        {row.original.id}
      </span>
    ),
  },
  {
    id: "Màu sắc",
    accessorKey: "product_colors.color_name",
    header: ({ column }) => {
      return (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center hover:text-blue-400 cursor-pointer w-fit"
        >
          <span>Màu sắc</span>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      );
    },
    enableHiding: true,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {row.original.product_colors?.thumbnail && (
          <Image
            src={row.original.product_colors.thumbnail}
            alt={row.original.product_colors.color_name || "Product image"}
            className="object-cover rounded-sm border border-gray-200"
            width={48}
            height={48}
            loading="lazy"
          />
        )}
        <span className="whitespace-nowrap text-gray-900">
          {row.original.product_colors?.color_name || "N/A"}
        </span>
      </div>
    ),
  },
  {
    id: "Giá bán",
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center hover:text-blue-400 cursor-pointer w-fit"
        >
          <span>Giá bán</span>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      );
    },
    enableHiding: true,
    cell: ({ row }) => {
      return (
        <span className="whitespace-nowrap font-semibold text-green-600">
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(row.original.price ?? 0)}
        </span>
      );
    },
  },
  {
    id: "Trạng thái",
    accessorKey: "is_available",
    header: ({ column }) => {
      return (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center hover:text-blue-400 cursor-pointer w-fit"
        >
          <span>Trạng thái</span>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      );
    },
    enableHiding: true,
    cell: ({ row }) => (
      <Badge
        variant={row.original.is_available ? "default" : "destructive"}
        className={
          row.original.is_available
            ? "bg-green-100 text-green-800 border-green-200"
            : "bg-red-100 text-red-800 border-red-200"
        }
      >
        {row.original.is_available ? "Còn hàng" : "Hết hàng"}
      </Badge>
    ),
  },
  {
    id: "Đã bán",
    accessorKey: "sale_count",
    header: ({ column }) => {
      return (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center hover:text-blue-400 cursor-pointer w-fit"
        >
          <span>Đã bán</span>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      );
    },
    enableHiding: true,
    cell: ({ row }) => (
      <span className="whitespace-nowrap font-medium text-gray-900">
        {row.original.sold_count ?? 0}
      </span>
    ),
  },
  {
    id: "Ngày thêm",
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center hover:text-blue-400 cursor-pointer w-fit"
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
          tooltip="Chỉnh sửa"
          variant="primary"
          size="icon"
          className="rounded-full"
          onClick={() => onEdit(row.original)}
        >
          <SquarePen />
        </ButtonWithTooltip>
        <ButtonWithTooltip
          type="button"
          tooltip="Xóa"
          variant="destructive"
          size="icon"
          className="rounded-full"
          onClick={() => onDelete(row.original)}
        >
          <Trash />
        </ButtonWithTooltip>
      </div>
    ),
  },
];
