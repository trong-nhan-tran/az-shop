import { FlashSaleWithDetailType } from "@/schemas";
import { ColumnDef } from "@tanstack/react-table";
import { ButtonWithTooltip } from "@/app/admin/_components/ui/button-with-tooltip";
import {
  SquarePen,
  Trash,
  ChevronDown,
  ChevronRight,
  ArrowUpDown,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui-shadcn/button";
import { Badge } from "@/components/ui-shadcn/badge";
import { useEffect, useState } from "react";

// Component countdown riêng để handle real-time updates
const CountdownTimer = ({
  startTime,
  endTime,
  isEnabled,
}: {
  startTime: Date | null;
  endTime: Date | null;
  isEnabled: boolean;
}) => {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [status, setStatus] = useState<
    "waiting" | "running" | "ended" | "disabled"
  >("disabled");

  useEffect(() => {
    if (!isEnabled) {
      setStatus("disabled");
      setTimeLeft("Đã tắt");
      return;
    }

    if (!startTime || !endTime) {
      setTimeLeft("Chưa có thời gian");
      return;
    }

    const updateCountdown = () => {
      const now = new Date();

      if (now < startTime) {
        // Chưa bắt đầu - đếm ngược đến thời gian bắt đầu
        const diff = startTime.getTime() - now.getTime();
        setStatus("waiting");
        setTimeLeft(formatTimeDifference(diff));
      } else if (now >= startTime && now <= endTime) {
        // Đang diễn ra - đếm ngược đến thời gian kết thúc
        const diff = endTime.getTime() - now.getTime();
        setStatus("running");
        setTimeLeft(formatTimeDifference(diff));
      } else {
        // Đã kết thúc
        setStatus("ended");
        setTimeLeft("Đã kết thúc");
      }
    };

    // Update immediately
    updateCountdown();

    // Update every second
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [startTime, endTime, isEnabled]);

  const formatTimeDifference = (diff: number): string => {
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const getTextColor = () => {
    switch (status) {
      case "waiting":
        return "text-blue-600";
      case "running":
        return "text-green-600";
      case "ended":
        return "text-red-600";
      default:
        return "text-gray-500";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "waiting":
        return "Bắt đầu sau";
      case "running":
        return "Kết thúc sau";
      case "ended":
        return "Đã kết thúc";
      default:
        return "Đã tắt";
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className={`flex items-center gap-1 text-xs ${getTextColor()}`}>
        <Clock size={12} />
        <span>{getStatusText()}</span>
      </div>
      <div className={`font-mono text-sm font-medium ${getTextColor()}`}>
        {timeLeft}
      </div>
    </div>
  );
};

export const getColumns = ({
  onEdit,
  onDelete,
}: {
  onEdit: (flashSale: FlashSaleWithDetailType) => void;
  onDelete: (flashSale: FlashSaleWithDetailType) => void;
}): ColumnDef<FlashSaleWithDetailType>[] => [
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
    id: "Tên flash sale",
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center hover:text-blue-400 cursor-pointer w-fit"
        >
          <span>Tên flash sale</span>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      );
    },
    cell: ({ row }) => (
      <span className="whitespace-nowrap font-medium text-gray-900">
        {row.original.name}
      </span>
    ),
  },
  {
    id: "Thời gian bắt đầu",
    accessorKey: "start_at", // Changed from start_time to start_at
    header: ({ column }) => {
      return (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center hover:text-blue-400 cursor-pointer w-fit"
        >
          <span>Thời gian bắt đầu</span>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      );
    },
    cell: ({ row }) => {
      const date = row.original.start_at // Changed from start_time to start_at
        ? new Date(row.original.start_at)
        : null;
      return (
        <div className="flex flex-col">
          <span className="text-gray-500 text-sm">
            {date
              ? date.toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
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
  },
  {
    id: "Thời gian kết thúc",
    accessorKey: "end_at", // Changed from end_time to end_at
    header: ({ column }) => {
      return (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center hover:text-blue-400 cursor-pointer w-fit"
        >
          <span>Thời gian kết thúc</span>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      );
    },
    cell: ({ row }) => {
      const date = row.original.end_at // Changed from end_time to end_at
        ? new Date(row.original.end_at)
        : null;
      return (
        <div className="flex flex-col">
          <span className="text-gray-500 text-sm">
            {date
              ? date.toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
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
  },

  {
    id: "Thời gian còn lại",
    header: ({ column }) => (
      <div className="flex items-center justify-center">
        <Clock className="w-4 h-4 mr-1" />
        <span>Thời gian còn lại</span>
      </div>
    ),
    cell: ({ row }) => {
      const startTime = row.original.start_at
        ? new Date(row.original.start_at)
        : null;
      const endTime = row.original.end_at
        ? new Date(row.original.end_at)
        : null;
      const isEnabled = row.original.enable;

      return (
        <CountdownTimer
          startTime={startTime}
          endTime={endTime}
          isEnabled={isEnabled}
        />
      );
    },
  },
  {
    id: "Trạng thái",
    header: "Trạng thái",
    accessorKey: "enable",
    cell: ({ row }) => (
      <Badge
        variant={row.original.enable ? "secondary" : "destructive"}
        className="px-3 py-1 text-sm"
      >
        {row.original.enable ? "Đang bật" : "Đang tắt"}
      </Badge>
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
