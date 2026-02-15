"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getColumns } from "./columns-product-color";
import { DataTable } from "@/app/admin/_components/features/data-table";
import SimpleModal from "@/app/admin/_components/features/simple-modal";

import { deleteProductColor, getAllProductColors } from "@/apis";
import { ProductColorType } from "@/schemas";
import { useConfirmModal } from "@/app/admin/_hooks/use-confirm-modal";
import { useProductColorFormModal } from "./form-product-color";

type Props = {
  productId: number;
  open: boolean;
  onClose: () => void;
  productName?: string;
};

const ProductColorTable = ({
  productId,
  open,
  onClose,
  productName,
}: Props) => {
  const queryClient = useQueryClient();
  const { openModal: openModalConfirm, closeModal: closeModalConfirm } =
    useConfirmModal();
  const { openModal: openProductColorFormModal } = useProductColorFormModal();
  const {
    data: Response,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["product-colors", productId],
    queryFn: () => getAllProductColors({ productId: productId.toString() }),
    enabled: open && !!productId,
  });

  if (error) {
    toast.error("Lỗi server khi tải màu sắc sản phẩm");
    console.error(error);
  }
  const data = Response?.data || [];

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteProductColor(id),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({
          queryKey: ["product-colors", productId],
        });
        toast.success("Đã xoá màu sắc");
      } else {
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
    onEdit: (item: ProductColorType) => {
      openProductColorFormModal({
        productId: productId.toString(),
        itemToEdit: item,
        isEditMode: true,
        onSuccess: () =>
          queryClient.invalidateQueries({
            queryKey: ["product-colors", productId],
          }),
      });
    },
    onDelete: (item: ProductColorType) => {
      openModalConfirm({
        title: "Xác nhận",
        description: `Xoá màu "${item.color_name}" của sản phẩm "${productName}"?`,
        onConfirm: () => deleteMutation.mutate(item.id.toString()),
      });
    },
  });

  return (
    <SimpleModal
      open={open}
      title="Danh Sách Màu Sắc"
      onClose={onClose}
      className="max-w-6xl bg-white"
    >
      <DataTable
        columns={columns}
        data={data || []}
        loading={isLoading}
        showColumnToggle={true}
        className="p-0"
        tableName={productName}
        onAdd={() => {
          openProductColorFormModal({
            productId: productId.toString(),
            itemToEdit: null,
            isEditMode: false,
            onSuccess: () =>
              queryClient.invalidateQueries({
                queryKey: ["product-colors", productId],
              }),
          });
        }}
        addButtonName="Thêm màu sắc"
      />
    </SimpleModal>
  );
};

export default ProductColorTable;
