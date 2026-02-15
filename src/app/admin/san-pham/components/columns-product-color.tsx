import { ProductColorType } from "@/schemas";
import { ColumnDef } from "@tanstack/react-table";
import { ButtonWithTooltip } from "@/app/admin/_components/ui/button-with-tooltip";
import { Trash, SquarePen, ArrowUpDown } from "lucide-react";
import Image from "next/image";

export const getColumns = ({
  onEdit,
  onDelete,
}: {
  onEdit: (item: ProductColorType) => void;
  onDelete: (item: ProductColorType) => void;
}): ColumnDef<ProductColorType>[] => [
  {
    id: "ID",
    header: "ID",
    accessorKey: "id",
    cell: ({ row }) => (
      <span className="whitespace-nowrap font-medium text-gray-900">
        {row.original.id}
      </span>
    ),
  },
  {
    id: "Tên màu sắc",
    header: ({ column }) => {
      return (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center hover:text-blue-400 cursor-pointer w-fit"
        >
          <span>Tên màu sắc</span>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      );
    },
    accessorKey: "color_name",
    cell: ({ row }) => (
      <span className="whitespace-nowrap font-medium">
        {row.original.color_name || "N/A"}
      </span>
    ),
  },
  {
    id: "Ảnh đại diện",
    header: "Ảnh đại diện",
    accessorKey: "thumbnail",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {row.original.thumbnail && (
          <Image
            src={row.original.thumbnail}
            alt={row.original.color_name || ""}
            className="border p-0.5 rounded-sm object-cover"
            width={100}
            height={100}
            loading="lazy"
          />
        )}
      </div>
    ),
  },
  {
    id: "Danh sách ảnh",
    header: "Danh sách ảnh",
    accessorKey: "images",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {row.original.images && row.original.images.length > 0 ? (
          <div className="flex items-center gap-2 overflow-x-auto">
            {row.original.images.map((imgUrl, index) => (
              <Image
                key={index}
                src={imgUrl}
                alt={row.original.color_name || ""}
                className="border p-0.5 rounded-sm object-cover"
                width={100}
                height={100}
                loading="lazy"
              />
            ))}
          </div>
        ) : (
          <span className="text-gray-500">Không có ảnh</span>
        )}
      </div>
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
