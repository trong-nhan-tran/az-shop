import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, SquarePen } from "lucide-react";
import { ButtonWithTooltip } from "@/app/admin/_components/ui/button-with-tooltip";
import { ProfileType } from "@/schemas";
import Image from "next/image";
export const getColumns = ({
  onEdit,
}: {
  onEdit: (profile: ProfileType) => void;
}): ColumnDef<ProfileType>[] => {
  return [
    {
      id: "ID",
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => {
        return (
          <div className="flex items-center">
            <span className="whitespace-nowrap font-sm text-gray-900">
              {row.original.id.substring(0, 8)}...
            </span>
          </div>
        );
      },
    },
    {
      id: "Tên",
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center hover:text-blue-400 cursor-pointer w-fit"
          >
            <span>Tên</span>
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </button>
        );
      },
      cell: ({ row }) => (
        <div className="flex gap-2 items-center">
          {row.original.avatar_url && (
            <Image
              src={row.original.avatar_url || ""}
              alt={row.original.name || "Avatar"}
              className="object-cover rounded-md border"
              width={48}
              height={48}
              loading="lazy"
            />
          )}
          <div className="flex flex-col">
            <span className="whitespace-nowrap font-medium text-gray-900">
              {row.original.name}
            </span>
          </div>
        </div>
      ),
    },
    {
      id: "Email",
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center hover:text-blue-400 cursor-pointer w-fit"
          >
            <span>Email</span>
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </button>
        );
      },
      cell: ({ row }) => (
        <div className="flex items-center">
          <span className="text-gray-700 whitespace-nowrap text-sm">
            {row.original.email || "N/A"}
          </span>
        </div>
      ),
    },
    {
      id: "Số điện thoại",
      accessorKey: "phone",
      header: "Số điện thoại",
      cell: ({ row }) => (
        <div className="flex items-center">
          <span className="text-gray-700 whitespace-nowrap text-sm">
            {row.original.phone || "N/A"}
          </span>
        </div>
      ),
    },
    {
      id: "Địa chỉ",
      accessorKey: "address",
      header: "Địa chỉ",
      cell: ({ row }) => (
        <div className="flex items-center">
          <span className="text-gray-700 text-sm line-clamp-2">
            {row.original.address || "N/A"}
          </span>
        </div>
      ),
    },
    {
      id: "Ngày tạo",
      accessorKey: "created_at",
      header: ({ column }) => {
        return (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center hover:text-blue-400 cursor-pointer w-fit"
          >
            <span>Ngày tạo</span>
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
                ? date.toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })
                : "N/A"}
            </span>
            <span className="text-gray-700">
              {date
                ? date.toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })
                : "N/A"}
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
            onClick={(e) => {
              e.stopPropagation();
              onEdit(row.original);
            }}
          >
            <SquarePen />
          </ButtonWithTooltip>
        </div>
      ),
    },
  ];
};
