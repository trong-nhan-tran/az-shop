"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { getColumns } from "./columns-flash-sale";
import { DataTable } from "@/app/admin/_components/features/data-table";

import FlashSaleItemTable from "./table-flash-sale-item";

import { deleteFlashSale, getAllFlashSales } from "@/apis";
import { FlashSaleType } from "@/schemas";
import { useSearchParamsState } from "@/hooks/useSearchParamsState";

import { useConfirmModal } from "@/app/admin/_hooks/use-confirm-modal";
import { useFlashSaleFormModal } from "./form-flash-sale";

const FlashSaleTable = () => {
  const queryClient = useQueryClient();
  const { params, setParam, setFilterParams } = useSearchParamsState({
    search: "",
    page: 1,
    pageSize: 10,
  });

  const [searchInput, setSearchInput] = useState(params.search);

  const { openModal: openFlashSaleFormModal } = useFlashSaleFormModal();
  const { openModal: openConfirmModal, closeModal: closeConfirmModal } =
    useConfirmModal();

  const { data: Response, isLoading } = useQuery({
    queryKey: ["flash-sales", params.search, params.page, params.pageSize],
    queryFn: () =>
      getAllFlashSales({
        page: params.page,
        pageSize: params.pageSize,
      }),
  });

  // Delete mutations
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteFlashSale(id),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ["flash-sales"] });
        toast.success("Đã xoá flash sale");
      } else {
        toast.error("Xóa thất bại");
      }
    },
    onError: () => toast.error("Có lỗi xảy ra"),
    onSettled: () => closeConfirmModal(),
  });

  const handleSearchChange = (value: string) => setSearchInput(value);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilterParams({ search: searchInput });
  };

  const columns = getColumns({
    onEdit: (item: FlashSaleType) =>
      openFlashSaleFormModal({
        flashSale: item,
        isEditMode: true,
        onSuccess: () =>
          queryClient.invalidateQueries({ queryKey: ["flash-sales"] }),
      }),
    onDelete: (item: FlashSaleType) =>
      openConfirmModal({
        title: "Xác nhận",
        description: `Xoá flash sale "${item.name}"?`,
        onConfirm: () => deleteMutation.mutate(item.id.toString()),
      }),
  });

  const data = Response?.data || [];
  const total = Response?.pagination?.total || 0;
  const totalPages = Response?.pagination?.totalPages || 1;

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        loading={isLoading}
        tableName="Flash Sale"
        toggleSidebar={true}
        showSearch={true}
        showColumnToggle={true}
        searchValue={searchInput}
        onSearchChange={handleSearchChange}
        onSearch={handleSearch}
        searchPlaceholder="Tìm kiếm flash sale..."
        onAdd={() => {
          openFlashSaleFormModal({
            flashSale: null,
            isEditMode: false,
            onSuccess: () =>
              queryClient.invalidateQueries({ queryKey: ["flash-sales"] }),
          });
        }}
        addButtonName="Thêm flash sale"
        expandedContent={(row) => (
          <FlashSaleItemTable
            flashSaleName={row.original.name || ""}
            flashSaleId={row.original.id}
            onSuccess={() =>
              queryClient.invalidateQueries({ queryKey: ["flash-sales"] })
            }
            isExpanded={true}
          />
        )}
        // Pagination props
        showPagination={true}
        currentPage={params.page}
        totalPages={totalPages}
        pageSize={params.pageSize}
        total={total}
        onPageChange={(page) => setParam("page", page)}
        onPageSizeChange={(size) => setFilterParams({ pageSize: size })}
      />
    </>
  );
};

export default FlashSaleTable;
