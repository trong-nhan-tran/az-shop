"use client";

import React from "react";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getColumns } from "./columns-order-item";
import { DataTable } from "@/app/admin/_components/features/data-table";

import { deleteOrderItem } from "@/apis";
import { OrderItemWithDetailType } from "@/schemas";
import { useConfirmModal } from "@/app/admin/_hooks/use-confirm-modal";
import { useOrderItemFormModal } from "./form-order-item";

type Props = {
  orderId: number;
  data: OrderItemWithDetailType[];
  onSuccess: () => void;
};

const OrderItemTable = ({ orderId, data, onSuccess }: Props) => {
  const queryClient = useQueryClient();
  const { openModal: openModalConfirm, closeModal: closeModalConfirm } =
    useConfirmModal();
  const { openModal: openOrderItemModal } = useOrderItemFormModal();

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteOrderItem(id),
    onSuccess: (response) => {
      if (response.success) {
        console.log(response.message);
        toast.success("Đã xoá");
        onSuccess?.();
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
      closeModalConfirm();
    },
  });

  const columns = getColumns({
    onEdit: (item: OrderItemWithDetailType) =>
      openOrderItemModal({
        orderId,
        orderItem: item,
        isEditMode: true,
        onSuccess,
      }),
    onDelete: (item: OrderItemWithDetailType) =>
      openModalConfirm({
        title: "Xác nhận",
        description: `Xoá sản phẩm "${item.product_name}" khỏi đơn hàng?`,
        onConfirm: () => deleteMutation.mutate(item.id.toString()),
      }),
    orderId: orderId,
  });

  return (
    <DataTable
      columns={columns}
      data={data || []}
      loading={false}
      showColumnToggle={true}
      className="rounded-lg"
      tableName={`Chi tiết đơn hàng ${orderId}`}
      onAdd={() =>
        openOrderItemModal({
          orderId,
          orderItem: null,
          isEditMode: false,
          onSuccess,
        })
      }
      addButtonName="Thêm sản phẩm"
      showPagination={false}
    />
  );
};

export default OrderItemTable;
