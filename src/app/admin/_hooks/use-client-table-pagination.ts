import { useState, useMemo } from "react";

interface UseClientPaginationProps<T> {
  data: T[];
  initialPageSize?: number;
}

export function useClientPagination<T>({
  data,
  initialPageSize = 10,
}: UseClientPaginationProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, pageSize]);

  const total = data.length;
  const totalPages = Math.ceil(total / pageSize);

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page
  };

  return {
    currentPage,
    pageSize,
    paginatedData,
    total,
    totalPages,
    setCurrentPage,
    setPageSize: handlePageSizeChange,
  };
}
