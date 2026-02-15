import { BannerType } from "@/schemas";
import { ColumnDef } from "@tanstack/react-table";
import { ButtonWithTooltip } from "@/app/admin/_components/ui/button-with-tooltip";
import { Trash, SquarePen, ArrowUpDown } from "lucide-react";
import Image from "next/image";

export const getColumns = ({
  onEdit,
  onDelete,
}: {
  onEdit: (item: BannerType) => void;
  onDelete: (item: BannerType) => void;
}): ColumnDef<BannerType>[] => [
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
    id: "Ảnh desktop",
    header: "Ảnh desktop",
    accessorKey: "desktop_image",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {row.original.desktop_image && (
          <Image
            src={row.original.desktop_image}
            alt={row.original.desktop_image}
            className="object-cover"
            width={1920}
            height={500}
          />
        )}
      </div>
    ),
  },
  {
    id: "Ảnh mobile",
    header: "Ảnh mobile",
    accessorKey: "mobile_image",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 w-[180px]">
        {row.original.mobile_image && (
          <Image
            src={row.original.mobile_image}
            alt={row.original.mobile_image}
            className="object-cover"
            width={768}
            height={400}
          />
        )}
      </div>
    ),
  },

  {
    id: "Link chuyển hướng",
    header: "Link chuyển hướng",
    accessorKey: "direct_link",
    cell: ({ row }) => (
      <span className="text-gray-700">{row.original.direct_link}</span>
    ),
  },
  {
    id: "Thứ tự hiển thị",
    header: "Thứ tự hiển thị",
    accessorKey: "order_number",
    cell: ({ row }) => (
      <span className="text-gray-700">{row.original.order_number}</span>
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
