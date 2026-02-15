import React from "react";
import { Button } from "@/components/ui-shadcn/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui-shadcn/select";
import { MoveRight, Rows } from "lucide-react";
import { Badge } from "@/components/ui-shadcn/badge";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
}

export function Pagination({
  currentPage,
  totalPages,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
}: PaginationProps) {
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // If total pages are less than or equal to maxPagesToShow, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate start and end pages to show around current page
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, startPage + 2);

      // Adjust if at the beginning
      if (currentPage <= 3) {
        startPage = 2;
        endPage = Math.min(totalPages - 1, 4);
      }

      // Adjust if at the end
      if (currentPage >= totalPages - 2) {
        endPage = totalPages - 1;
        startPage = Math.max(2, endPage - 2);
      }

      // Add ellipsis if needed before startPage
      if (startPage > 2) {
        pages.push("...");
      }

      // Add page numbers between start and end
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Add ellipsis if needed after endPage
      if (endPage < totalPages - 1) {
        pages.push("...");
      }

      // Always show last page if there are multiple pages
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="pt-2">
      <div className="flex justify-between items-center gap-3">
        {/* Info section */}
        <div className="flex items-center gap-3">
          <Badge variant="outline" className=" items-center text-sm h-9 pl-1">
            <Badge variant="secondary" className="text-sm rounded-sm">
              {total === 0 ? 0 : (currentPage - 1) * pageSize + 1} <MoveRight />
              {Math.min(currentPage * pageSize, total)}
            </Badge>
            <span className="ml-1">/ {total}</span>
          </Badge>
          {onPageSizeChange && (
            <div className="flex items-center gap-2">
              <Select
                value={pageSize.toString()}
                onValueChange={(value) => onPageSizeChange(Number(value))}
              >
                <SelectTrigger className="border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                  <SelectValue placeholder={`${pageSize}`}>
                    <Rows className="inline" />
                    {pageSize} Dòng
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {pageSizeOptions.map((size) => (
                    <SelectItem
                      key={size}
                      value={size.toString()}
                      className="cursor-pointer hover:bg-gray-100"
                    >
                      <span className="font-medium">{size}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <div className="flex items-center rounded-md overflow-hidden border border-gray-300 h-9">
          {/* Previous button */}
          <Button
            variant="ghost"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!canGoPrevious}
            className={`h-full px-3 border-r rounded-none border-gray-200 ${
              !canGoPrevious
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
            }`}
            title="Trang trước"
          >
            <i className="bi bi-chevron-left" />
          </Button>

          {/* Page numbers */}
          {pageNumbers.map((page, index) => (
            <React.Fragment key={index}>
              {page === "..." ? (
                <span className="h-full px-3 flex items-center justify-center text-gray-500 border-r border-gray-200">
                  &hellip;
                </span>
              ) : (
                <Button
                  variant="ghost"
                  onClick={() => onPageChange(page as number)}
                  className={`h-full min-w-[36px] rounded-none border-r border-gray-200 ${
                    currentPage === page
                      ? "bg-blue-50 text-blue-600 font-medium hover:bg-blue-100"
                      : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                  }`}
                >
                  {page}
                </Button>
              )}
            </React.Fragment>
          ))}

          {/* Next button */}
          <Button
            variant="ghost"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!canGoNext}
            className={`h-full px-3 rounded-none ${
              !canGoNext
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
            }`}
            title="Trang tiếp"
          >
            <i className="bi bi-chevron-right" />
          </Button>
        </div>
      </div>
    </div>
  );
}
