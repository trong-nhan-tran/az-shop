"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { getColumns } from "./columns-order";
import { DataTable } from "@/app/admin/_components/features/data-table";

import FormModal from "./form-order";
import OrderItemTable from "./table-order-item";

import { deleteOrder, getAllOrders } from "@/apis";
import { OrderType } from "@/schemas";
import { useSearchParamsState } from "@/hooks/useSearchParamsState";

import { useConfirmModal } from "@/app/admin/_hooks/use-confirm-modal";
import { useOrderItemFormModal } from "./form-order-item";

const OrderTable = () => {
  const queryClient = useQueryClient();
  const { params, setParam, setFilterParams } = useSearchParamsState({
    search: "",
    page: 1,
    pageSize: 10,
  });

  // Local state for search input
  const [searchInput, setSearchInput] = useState(params.search);

  // Form states
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<OrderType | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const { openModal, closeModal } = useConfirmModal();
  const { openModal: openOrderItemModal } = useOrderItemFormModal();

  // Query for fetching
  const { data: Response, isLoading } = useQuery({
    queryKey: ["orders", params.search, params.page, params.pageSize],
    queryFn: () =>
      getAllOrders({
        keyword: params.search,
        page: params.page,
        pageSize: params.pageSize,
      }),
  });

  // Update itemToEdit when data changes
  useEffect(() => {
    if (itemToEdit && Response?.data) {
      const updatedOrder = Response.data.find((p) => p.id === itemToEdit.id);
      if (updatedOrder) {
        setItemToEdit(updatedOrder);
      }
    }
  }, [Response?.data, itemToEdit]);

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteOrder(id),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ["orders"] });
        console.log(response.message);
        toast.success("Đã xoá");
      } else {
        console.log(response.message);
        toast.error("Xóa thất bại");
      }
    },
    onError: (error) => {
      console.error(error);
      toast.error("Có lỗi xảy ra");
    },
    onSettled: () => {
      closeModal();
    },
  });

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilterParams({ search: searchInput });
  };

  const handleEdit = (item: OrderType) => {
    setItemToEdit(item);
    setIsEditMode(true);
    setIsOpenForm(true);
  };

  const handleAddNew = () => {
    setItemToEdit(null);
    setIsEditMode(false);
    setIsOpenForm(true);
  };

  const handleDelete = (item: OrderType) => {
    openModal({
      title: "Xác nhận",
      description: `Xoá đơn hàng "#${item.id}"?`,
      onConfirm: () => deleteMutation.mutate(item.id.toString()),
    });
  };

  const onAddNewOrderItem = (orderId: number) => {
    openOrderItemModal({
      orderId,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["orders"] }),
    });
  };

  const columns = getColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
    onAddNewOrderItem: onAddNewOrderItem,
  });

  const data = Response?.data || [];
  const total = Response?.pagination?.total || 0;
  const totalPages = Response?.pagination?.totalPages || 1;

  return (
    <>
      <FormModal
        open={isOpenForm}
        setOpen={setIsOpenForm}
        order={itemToEdit}
        onSuccess={() =>
          queryClient.invalidateQueries({ queryKey: ["orders"] })
        }
        editMode={isEditMode}
      />

      <DataTable
        columns={columns}
        data={data}
        loading={isLoading}
        tableName="Đơn Hàng"
        toggleSidebar={true}
        showSearch={true}
        showColumnToggle={true}
        searchValue={searchInput}
        onSearchChange={handleSearchChange}
        onSearch={handleSearch}
        searchPlaceholder="Tìm kiếm đơn hàng..."
        onAdd={handleAddNew}
        addButtonName="Thêm đơn hàng"
        expandedContent={(row) => (
          <OrderItemTable
            data={row.original.order_items}
            orderId={row.original.id}
            onSuccess={() =>
              queryClient.invalidateQueries({ queryKey: ["orders"] })
            }
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
        pageSizeOptions={[10, 20, 50, 100]}
      />
    </>
  );
};

export default OrderTable;
