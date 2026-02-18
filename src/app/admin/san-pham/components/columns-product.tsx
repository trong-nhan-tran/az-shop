import { ProductWithDetailType, ProductVariantType } from "@/schemas";
import { ColumnDef } from "@tanstack/react-table";
import { ButtonWithTooltip } from "@/app/admin/_components/ui/button-with-tooltip";
import {
  SquarePen,
  Trash,
  ChevronDown,
  ChevronRight,
  ArrowUpDown,
  Palette,
} from "lucide-react";
import { Button } from "@/components/ui-shadcn/button";

export const getColumns = ({
  onEdit,
  onDelete,
  onOpenColorModal,
}: {
  onEdit: (product: ProductWithDetailType) => void;
  onDelete: (product: ProductWithDetailType) => void;
  onOpenColorModal: (product: ProductWithDetailType) => void;
}): ColumnDef<ProductWithDetailType>[] => {
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
      cell: ({ row }) => {
        return (
          <div className="flex items-center">
            <span className="whitespace-nowrap font-sm text-foreground">
              {row.original.id}
            </span>
          </div>
        );
      },
    },
    {
      id: "Sản phẩm",
      accessorKey: "name",
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
      cell: ({ row }) => (
        <div className="flex items-center">
          <span className="whitespace-nowrap font-medium text-foreground">
            {row.original.name}
          </span>
        </div>
      ),
    },
    {
      id: "Danh mục",
      accessorKey: "subcategories",
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
        <div className="flex items-center">
          <span className="text-foreground whitespace-nowrap text-sm">
            {row.original.subcategories?.name}
          </span>
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
            tooltip="Màu sắc"
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              onOpenColorModal(row.original);
            }}
          >
            <Palette />
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
};
