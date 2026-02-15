import { ProductVariantWithProductItemType } from "@/schemas";
import { ColumnDef } from "@tanstack/react-table";
import { ButtonWithTooltip } from "@/app/admin/_components/ui/button-with-tooltip";
import {
  SquarePen,
  Trash,
  ChevronDown,
  ChevronRight,
  ArrowUpDown,
} from "lucide-react";
import { Button } from "@/components/ui-shadcn/button";
import { Badge } from "@/components/ui-shadcn/badge";
import Image from "next/image";

export const getColumns = ({
  onEdit,
  onDelete,
}: {
  onEdit: (variant: ProductVariantWithProductItemType) => void;
  onDelete: (variant: ProductVariantWithProductItemType) => void;
}): ColumnDef<ProductVariantWithProductItemType>[] => [
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
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <span className="whitespace-nowrap font-medium text-gray-900">
        {row.original.id}
      </span>
    ),
  },
  {
    id: "Tên phiên bản sản phẩm",
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center hover:text-blue-400 cursor-pointer w-fit"
        >
          <span>Tên phiên bản sản phẩm</span>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      );
    },
    cell: ({ row }) => (
      <div className="flex gap-2 items-center">
        {row.original.thumbnail && (
          <Image
            src={row.original.thumbnail}
            alt={row.original.name}
            className="object-cover rounded-sm border"
            width={48}
            height={48}
            loading="lazy"
          />
        )}
        <div className="flex flex-col">
          <span className="whitespace-nowrap font-medium text-gray-900">
            {row.original.name}
          </span>
          <span className="text-xs text-gray-500">{row.original.slug}</span>
        </div>
      </div>
    ),
  },
  {
    id: "Phiên bản",
    accessorKey: "variant",
    header: ({ column }) => {
      return (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center hover:text-blue-400 cursor-pointer w-fit"
        >
          <span>Phiên bản</span>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      );
    },
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="whitespace-nowrap font-medium text-gray-900">
          {row.original.variant || "Sản phẩm đơn"}
        </span>
      </div>
    ),
  },
  {
    id: "Giá niêm yết",
    accessorKey: "listed_price",
    header: ({ column }) => {
      return (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center hover:text-blue-400 cursor-pointer w-fit"
        >
          <span>Giá niêm yết</span>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      );
    },
    enableHiding: true,
    cell: ({ row }) => {
      return (
        <span className="whitespace-nowrap font-semibold text-gray-700">
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(row.original.listed_price ?? 0)}
        </span>
      );
    },
  },
  {
    id: "Giá bán từ",
    accessorKey: "base_price",
    header: ({ column }) => {
      return (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center hover:text-blue-400 cursor-pointer w-fit"
        >
          <span>Giá bán từ</span>
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
          }).format(row.original.base_price ?? 0)}
        </span>
      );
    },
  },
  {
    id: "Trạng thái",
    header: "Trạng thái",
    cell: ({ row }) => {
      const hasAvailableItems =
        row.original.product_items?.some((item) => item.is_available) || false;

      return (
        <Badge
          variant={hasAvailableItems ? "default" : "destructive"}
          className={
            hasAvailableItems
              ? "bg-green-100 text-green-800 border-green-200"
              : "bg-red-100 text-red-800 border-red-200"
          }
        >
          {hasAvailableItems ? "Còn hàng" : "Hết hàng"}
        </Badge>
      );
    },
  },
  {
    id: "Đã bán",
    header: "Đã bán",
    cell: ({ row }) => {
      const totalSold =
        row.original.product_items?.reduce(
          (sum, item) => sum + (item.sold_count || 0),
          0
        ) || 0;
      return (
        <span className="whitespace-nowrap font-medium text-gray-900">
          {totalSold}
        </span>
      );
    },
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
          onClick={(e) => {
            e.stopPropagation();
            onEdit(row.original);
          }}
        >
          <SquarePen />
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
          <Trash />
        </ButtonWithTooltip>
      </div>
    ),
  },
];
