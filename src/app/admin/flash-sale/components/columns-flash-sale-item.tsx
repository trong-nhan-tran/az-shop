import { FlashSaleItemWithDetailType } from "@/schemas";
import { ColumnDef } from "@tanstack/react-table";
import { ButtonWithTooltip } from "@/app/admin/_components/ui/button-with-tooltip";
import { SquarePen, Trash, ArrowUpDown } from "lucide-react";
import Image from "next/image";

export const getColumns = ({
  onEdit,
  onDelete,
}: {
  onEdit: (flashSaleItem: FlashSaleItemWithDetailType) => void;
  onDelete: (flashSaleItem: FlashSaleItemWithDetailType) => void;
}): ColumnDef<FlashSaleItemWithDetailType>[] => [
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
    id: "Sản phẩm",
    accessorKey: "product_items.product_variants.name",
    header: "Sản phẩm",
    cell: ({ row }) => {
      const productItem = row.original.product_items;
      return (
        <div className="flex items-center gap-2">
          <Image
            src={productItem?.product_colors?.thumbnail || ""}
            alt={productItem?.product_colors?.color_name || "Product Image"}
            width={50}
            height={50}
          />
          <span className="flex flex-col gap-1 ">
            <span className="whitespace-nowrap font-medium text-gray-900">
              {productItem?.product_variants?.name}
            </span>
            <span className="text-gray-700">
              {productItem?.product_colors?.color_name}
            </span>
          </span>
        </div>
      );
    },
  },
  {
    id: "Giá niêm yết",
    header: "Giá niêm yết",
    accessorKey: "product_items.product_variants.listed_price",
    cell: ({ row }) => {
      const originalPrice =
        row.original.product_items?.product_variants?.listed_price || 0;
      return (
        <span className="whitespace-nowrap font-medium text-gray-700">
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(originalPrice)}
        </span>
      );
    },
  },
  {
    id: "Giá bán",
    header: "Giá bán",
    accessorKey: "product_items.price",
    cell: ({ row }) => {
      const originalPrice = row.original.product_items?.price || 0;
      return (
        <span className="whitespace-nowrap font-medium text-gray-700">
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(originalPrice)}
        </span>
      );
    },
  },

  {
    id: "Giá khuyến mãi",
    accessorKey: "sale_price",
    header: ({ column }) => {
      return (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center hover:text-blue-400 cursor-pointer w-fit"
        >
          <span>Giá khuyến mãi</span>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      );
    },
    cell: ({ row }) => {
      const originalPrice = row.original.product_items?.price || 0;
      const salePrice = row.original.sale_price;
      const discount =
        originalPrice > 0
          ? ((originalPrice - salePrice) / originalPrice) * 100
          : 0;

      return (
        <span className="whitespace-nowrap font-semibold text-amber-400">
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(row.original?.sale_price || 0)}
          <span className="whitespace-nowrap font-medium ml-2 text-green-600">
            -{discount.toFixed(0)}%
          </span>
        </span>
      );
    },
  },

  {
    id: "Số lượng",
    accessorKey: "quantity",
    header: ({ column }) => {
      return (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center hover:text-blue-400 cursor-pointer w-fit"
        >
          <span>Số lượng</span>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      );
    },
    cell: ({ row }) => (
      <span className="whitespace-nowrap font-medium text-gray-900">
        {row.original.quantity}
      </span>
    ),
  },
  {
    id: "Đã bán",
    accessorKey: "sold_quantity",
    header: "Đã bán",
    cell: ({ row }) => (
      <span className="whitespace-nowrap font-medium text-gray-900">
        {row.original.sold_quantity || 0}
      </span>
    ),
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
