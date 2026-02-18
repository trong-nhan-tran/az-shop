import { CategoryWithSubType } from "@/schemas";
import { ColumnDef } from "@tanstack/react-table";
import { ButtonWithTooltip } from "@/app/admin/_components/ui/button-with-tooltip";
import {
  Trash,
  SquarePen,
  ChevronDown,
  ChevronRight,
  Image as ImageIcon,
  Star,
  ArrowUpDown,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui-shadcn/button";

export const getColumns = ({
  onEdit,
  onDelete,
  onOpenBannerModal,
  onOpenFeaturedItemModal,
}: {
  onEdit: (item: CategoryWithSubType) => void;
  onDelete: (item: CategoryWithSubType) => void;
  onOpenBannerModal: (category: CategoryWithSubType) => void;
  onOpenFeaturedItemModal: (category: CategoryWithSubType) => void;
}): ColumnDef<CategoryWithSubType>[] => [
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
          className="rounded-full hover:bg-accent"
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
      <span className="whitespace-nowrap font-medium text-foreground">
        {row.original.id}
      </span>
    ),
  },
  {
    id: "Danh mục",
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center hover:text-link-hover cursor-pointer w-fit"
        >
          <span>Danh mục</span>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      );
    },
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {row.original.thumbnail && (
          <Image
            src={row.original.thumbnail}
            alt={row.original.name}
            className="border p-0.5 rounded-sm object-cover"
            width={60}
            height={60}
            loading="lazy"
          />
        )}
        <div className="flex flex-col">
          <span className="whitespace-nowrap font-medium text-foreground">
            {row.original.name}
          </span>
        </div>
      </div>
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
          tooltip="Banners"
          variant="outline"
          size="icon"
          className="rounded-full"
          onClick={(e) => {
            e.stopPropagation();
            onOpenBannerModal(row.original);
          }}
        >
          <ImageIcon />
        </ButtonWithTooltip>
        <ButtonWithTooltip
          type="button"
          tooltip="Sản phẩm nổi bật"
          variant="default"
          size="icon"
          className="rounded-full bg-amber-500 hover:bg-amber-600"
          onClick={(e) => {
            e.stopPropagation();
            onOpenFeaturedItemModal(row.original);
          }}
        >
          <Star />
        </ButtonWithTooltip>
        <div className="border-l"></div>
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
