import { FeaturedItemWithDetailsType } from "@/schemas";
import { ColumnDef } from "@tanstack/react-table";
import { ButtonWithTooltip } from "@/app/admin/_components/ui/button-with-tooltip";
import { Trash, SquarePen, ArrowUpDown } from "lucide-react";
import Image from "next/image";

export const getColumns = ({
  onEdit,
  onDelete,
}: {
  onEdit: (item: FeaturedItemWithDetailsType) => void;
  onDelete: (item: FeaturedItemWithDetailsType) => void;
}): ColumnDef<FeaturedItemWithDetailsType>[] => [
  {
    id: "ID",
    header: "ID",
    accessorKey: "id",
    cell: ({ row }) => (
      <span className="whitespace-nowrap font-medium text-foreground">
        {row.original.id}
      </span>
    ),
  },
  {
    id: "Sản phẩm nổi bật",
    header: "Sản phẩm nổi bật",
    accessorKey: "name",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {row.original.product_variants?.thumbnail && (
          <Image
            src={row.original.product_variants?.thumbnail || ""}
            alt={row.original.product_variants?.name || "N/A"}
            className="border p-0.5 rounded-sm object-cover"
            width={50}
            height={50}
            loading="lazy"
          />
        )}
        <div className="flex flex-col">
          <span className="whitespace-nowrap font-medium text-foreground">
            {row.original.product_variants?.name || "N/A"}
          </span>
        </div>
      </div>
    ),
  },
  {
    id: "Giá niêm yết",
    accessorKey: "product_variants.listed_price",
    header: ({ column }) => {
      return (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center hover:text-link-hover cursor-pointer w-fit"
        >
          <span>Giá niêm yết</span>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      );
    },
    enableHiding: true,
    cell: ({ row }) => {
      return (
        <span className="whitespace-nowrap font-semibold text-foreground">
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(row.original.product_variants?.listed_price ?? 0)}
        </span>
      );
    },
  },
  {
    id: "Giá bán từ",
    accessorKey: "product_variants.base_price",
    header: ({ column }) => {
      return (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center hover:text-link-hover cursor-pointer w-fit"
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
          }).format(row.original.product_variants?.base_price ?? 0)}
        </span>
      );
    },
  },
  {
    id: "Số thứ tự",
    header: ({ column }) => {
      return (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center hover:text-link-hover cursor-pointer w-fit"
        >
          <span>Số thứ tự</span>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      );
    },
    accessorKey: "order_number",
    cell: ({ row }) => (
      <span className="text-foreground">{row.original.order_number}</span>
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
    header: "Thao tác",
    id: "actions",
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
