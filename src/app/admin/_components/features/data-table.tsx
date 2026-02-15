"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  ColumnFiltersState,
  getExpandedRowModel,
  ExpandedState,
  Row,
  VisibilityState,
} from "@tanstack/react-table";
import { useState } from "react";
import React from "react";
import { ChevronDown, Columns, Plus } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui-shadcn/table";
import { Button } from "@/components/ui-shadcn/button";
import { Input } from "@/components/ui-shadcn/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui-shadcn/dropdown-menu";
import { cn } from "@/libs/utils";
import { SidebarTrigger } from "../../../../components/ui-shadcn/sidebar";
import { Pagination } from "./pagination";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading?: boolean;
  emptyMessage?: string;
  expandedContent?: (row: Row<TData>) => React.ReactNode;
  getRowCanExpand?: (row: Row<TData>) => boolean;
  className?: string;
  showColumnToggle?: boolean;
  onAdd?: () => void;
  addButtonName?: string;
  tableName?: string;
  childrenHeader?: React.ReactNode;
  toggleSidebar?: boolean;
  // Search functionality
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onSearch?: (e: React.FormEvent) => void;
  searchPlaceholder?: string;
  showSearch?: boolean;

  // Pagination props
  currentPage?: number;
  totalPages?: number;
  pageSize?: number;
  total?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  showPagination?: boolean;
  pageSizeOptions?: number[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
  className,
  loading,
  emptyMessage = "Không có dữ liệu",
  expandedContent,
  getRowCanExpand,
  showColumnToggle = false,
  onAdd,
  addButtonName,
  tableName,
  childrenHeader,
  toggleSidebar = false,
  searchValue = "",
  onSearchChange,
  onSearch,
  searchPlaceholder = "Tìm kiếm...",
  showSearch = false,
  currentPage = 1,
  totalPages = 1,
  pageSize = 10,
  total = 0,
  onPageChange,
  onPageSizeChange,
  showPagination = false,
  pageSizeOptions = [10, 20, 50, 100],
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onExpandedChange: setExpanded,
    onColumnVisibilityChange: setColumnVisibility,
    getRowCanExpand: getRowCanExpand || (() => true),
    state: {
      sorting,
      columnFilters,
      expanded,
      columnVisibility,
    },
  });

  const hasSearch = showSearch && onSearchChange && onSearch;

  return (
    <div className={cn("bg-white px-4 py-2", className)}>
      {/* Header with tableName and controls */}
      {(tableName ||
        showColumnToggle ||
        onAdd ||
        childrenHeader ||
        hasSearch ||
        toggleSidebar) && (
        <div className="pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Left side - Title and Sidebar Trigger */}
            <div className="flex items-center gap-2">
              {toggleSidebar && (
                <SidebarTrigger className="size-4" size="icon" />
              )}
              {tableName && (
                <h2 className="font-semibold text-gray-800 text-lg">
                  {tableName}
                </h2>
              )}
            </div>

            {/* Right side - Controls */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Search Box */}
              {hasSearch && (
                <form onSubmit={onSearch} className="relative">
                  <Input
                    placeholder={searchPlaceholder}
                    className="w-[240px] sm:w-[300px] h-9 rounded-md pr-10 bg-white border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                    value={searchValue}
                    onChange={(e) => onSearchChange(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    <i className="bi bi-search text-lg"></i>
                  </button>
                </form>
              )}

              {/* Custom children header */}
              {childrenHeader}

              {/* Column Toggle */}
              {showColumnToggle && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <Columns /> Cột <ChevronDown />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {table
                      .getAllColumns()
                      .filter((column) => column.getCanHide())
                      .map((column) => {
                        return (
                          <DropdownMenuCheckboxItem
                            key={column.id}
                            className="capitalize"
                            checked={column.getIsVisible()}
                            onCheckedChange={(value) =>
                              column.toggleVisibility(!!value)
                            }
                          >
                            {column.id}
                          </DropdownMenuCheckboxItem>
                        );
                      })}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* Add Button */}
              {onAdd && (
                <Button
                  variant="outline"
                  className="bg-green-500 hover:bg-green-600 text-white border-green-500 hover:border-green-600 transition-all duration-200 shadow-sm hover:shadow-md"
                  title={addButtonName}
                  onClick={onAdd}
                >
                  <Plus />
                  Thêm
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="rounded-lg border">
        <Table>
          <TableHeader className="border-b">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
                    <span className="text-gray-600">Đang tải dữ liệu...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <React.Fragment key={row.id}>
                  <TableRow
                    data-state={row.getIsSelected() && "selected"}
                    className="hover:bg-blue-50"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                  {row.getIsExpanded() && expandedContent && (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="p-0">
                        <div className="p-2 bg-gray-100 relative">
                          {expandedContent(row)}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-12 text-center"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {showPagination && onPageChange && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          total={total}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          pageSizeOptions={pageSizeOptions}
        />
      )}
    </div>
  );
}
