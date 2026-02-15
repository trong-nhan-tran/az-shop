"use client";

import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getColumns } from "./columns-product-item";
import { DataTable } from "@/app/admin/_components/features/data-table";

import { useConfirmModal } from "@/app/admin/_hooks/use-confirm-modal";
import { useProductItemFormModal } from "./form-product-item";
import { deleteProductItem } from "@/apis";
import { ProductItemWithDetails, ProductVariantType } from "@/schemas";

type Props = {
  productVariant: ProductVariantType;
  productItems: ProductItemWithDetails[];
  onSuccess: () => void;
};

const ProductItemTable = ({
  productVariant,
  productItems,
  onSuccess,
}: Props) => {
  const queryClient = useQueryClient();

  const { openModal: openConfirmModal, closeModal: closeConfirmModal } =
    useConfirmModal();
  const { openModal: openProductItemFormModal } = useProductItemFormModal();

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteProductItem(id),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Đã xoá phân loại");
        onSuccess?.();
      } else {
        toast.error("Xóa thất bại");
      }
    },
    onError: () => toast.error("Có lỗi xảy ra"),
    onSettled: () => closeConfirmModal(),
  });

  const columns = getColumns({
    onEdit: (item: ProductItemWithDetails) => {
      openProductItemFormModal({
        itemToEdit: item,
        isEditMode: true,
        existingItems: productItems,
        onSuccess,
        productVariant: productVariant,
      });
    },
    onDelete: (item: ProductItemWithDetails) => {
      openConfirmModal({
        title: "Xác nhận",
        description: `Xoá phân loại màu "${item.product_colors?.color_name}"?`,
        onConfirm: () => deleteMutation.mutate(item.id.toString()),
      });
    },
  });

  return (
    <DataTable
      columns={columns}
      data={productItems || []}
      loading={false}
      showColumnToggle={true}
      className="rounded-lg"
      tableName={productVariant.name}
      onAdd={() => {
        openProductItemFormModal({
          itemToEdit: null,
          isEditMode: false,
          existingItems: productItems,
          productVariant: productVariant,
          onSuccess,
        });
      }}
      addButtonName="Thêm phân loại màu"
      showPagination={false}
    />
  );
};

export default ProductItemTable;
