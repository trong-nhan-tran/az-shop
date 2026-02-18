import { SubcategoryType } from "@/schemas";
import { ColumnDef } from "@tanstack/react-table";
import { ButtonWithTooltip } from "@/app/admin/_components/ui/button-with-tooltip";
import { Trash, SquarePen, ArrowUpDown } from "lucide-react";

export const getColumns = ({
  onEdit,
  onDelete,
}: {
  onEdit: (row: SubcategoryType) => void;
  onDelete: (row: SubcategoryType) => void;
}): ColumnDef<SubcategoryType>[] => [
  {
    id: "ID",
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <span className="whitespace-nowrap font-medium text-foreground">
        {row.original.id}
      </span>
    ),
  },
  {
    id: "Danh mục con",
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center hover:text-link-hover cursor-pointer w-fit"
        >
          <span>Danh mục con</span>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      );
    },
    cell: ({ row }) => (
      <span className="whitespace-nowrap font-medium text-foreground">
        {row.original.name}
      </span>
    ),
  },
  {
    id: "Slug",
    accessorKey: "slug",
    header: "Slug",
    cell: ({ row }) => (
      <span className="text-foreground">{row.original.slug}</span>
    ),
  },
  {
    id: "Số thứ tự",
    accessorKey: "order_number",
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
