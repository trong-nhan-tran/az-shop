"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui-shadcn/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
};

const Pagination = ({ currentPage, totalPages }: PaginationProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showPages = 5;

    if (totalPages <= showPages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 my-8">
      {/* First Page */}
      <Button
        variant="outline"
        size="icon"
        asChild
        disabled={currentPage === 1}
        className="disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {currentPage === 1 ? (
          <span className="cursor-not-allowed">
            <ChevronsLeft className="h-4 w-4" />
          </span>
        ) : (
          <Link href={createPageURL(1)}>
            <ChevronsLeft className="h-4 w-4" />
          </Link>
        )}
      </Button>

      {/* Previous Page */}
      <Button
        variant="outline"
        size="icon"
        asChild
        disabled={currentPage === 1}
        className="disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {currentPage === 1 ? (
          <span className="cursor-not-allowed">
            <ChevronLeft className="h-4 w-4" />
          </span>
        ) : (
          <Link href={createPageURL(currentPage - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        )}
      </Button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {getPageNumbers().map((page, index) => {
          if (page === "...") {
            return (
              <span key={`ellipsis-${index}`} className="px-3 py-2">
                ...
              </span>
            );
          }

          const pageNumber = page as number;
          const isActive = pageNumber === currentPage;

          return (
            <Button
              key={pageNumber}
              variant={"outline"}
              size="icon"
              asChild={!isActive}
              disabled={isActive}
              className={
                isActive
                  ? "cursor-default bg-blue-500! text-white disabled:opacity-100"
                  : ""
              }
            >
              {isActive ? (
                <span>{pageNumber}</span>
              ) : (
                <Link href={createPageURL(pageNumber)}>{pageNumber}</Link>
              )}
            </Button>
          );
        })}
      </div>

      {/* Next Page */}
      <Button
        variant="outline"
        size="icon"
        asChild
        disabled={currentPage === totalPages}
        className="disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {currentPage === totalPages ? (
          <span className="cursor-not-allowed">
            <ChevronRight className="h-4 w-4" />
          </span>
        ) : (
          <Link href={createPageURL(currentPage + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </Button>

      {/* Last Page */}
      <Button
        variant="outline"
        size="icon"
        asChild
        disabled={currentPage === totalPages}
        className="disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {currentPage === totalPages ? (
          <span className="cursor-not-allowed">
            <ChevronsRight className="h-4 w-4" />
          </span>
        ) : (
          <Link href={createPageURL(totalPages)}>
            <ChevronsRight className="h-4 w-4" />
          </Link>
        )}
      </Button>
    </div>
  );
};

export default Pagination;
