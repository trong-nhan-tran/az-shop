"use client";

import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getColumns } from "./columns-product-variant";
import { DataTable } from "@/app/admin/_components/features/data-table";
import ProductItemTable from "./table-product-item";

import { useConfirmModal } from "@/app/admin/_hooks/use-confirm-modal";
import { useProductVariantFormModal } from "./form-product-variant";
import { deleteProductVariant, getAllProductVariantsByProductId } from "@/apis";
import { ProductVariantWithProductItemType, ProductColorType } from "@/schemas";

type Props = {
  productName: string;
  productId: number;
  productColors: ProductColorType[];
  onSuccess: () => void;
  isExpanded: boolean;
};

const ProductVariantTable = ({
  productName,
  productId,
  productColors,
  onSuccess,
  isExpanded,
}: Props) => {
  const queryClient = useQueryClient();

  const { openModal: openConfirmModal, closeModal: closeConfirmModal } =
    useConfirmModal();
  const { openModal: openProductVariantFormModal } =
    useProductVariantFormModal();

  const { data: variantsResponse, isLoading } = useQuery({
    queryKey: ["product-variants", productId],
    queryFn: () => getAllProductVariantsByProductId(productId.toString()),
    enabled: isExpanded && !!productId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const data = variantsResponse?.data || [];

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteProductVariant(id),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Đã xoá phiên bản");
        queryClient.invalidateQueries({
          queryKey: ["product-variants", productId],
        });
        onSuccess();
      } else {
        toast.error("Xóa thất bại");
      }
    },
    onError: () => toast.error("Có lỗi xảy ra"),
    onSettled: () => closeConfirmModal(),
  });

  const columns = getColumns({
    onEdit: (variant: ProductVariantWithProductItemType) => {
      openProductVariantFormModal({
        productId: productId.toString(),
        productVariant: variant,
        isEditMode: true,
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["product-variants", productId],
          });
          onSuccess();
        },
      });
    },
    onDelete: (variant: ProductVariantWithProductItemType) => {
      openConfirmModal({
        title: "Xác nhận",
        description: `Xoá phiên bản "${variant.variant || variant.name}"?`,
        onConfirm: () => deleteMutation.mutate(variant.id.toString()),
      });
    },
  });

  return (
    <DataTable
      columns={columns}
      data={data}
      loading={isLoading}
      showColumnToggle={true}
      className="rounded-lg"
      tableName={productName}
      onAdd={() => {
        openProductVariantFormModal({
          productId: productId.toString(),
          productVariant: null,
          isEditMode: false,
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ["product-variants", productId],
            });
            onSuccess();
          },
        });
      }}
      addButtonName="Thêm phiên bản"
      expandedContent={(row) => (
        <ProductItemTable
          productVariant={row.original}
          productItems={row.original.product_items || []}
          onSuccess={() => {
            queryClient.invalidateQueries({
              queryKey: ["product-variants", productId],
            });
            onSuccess();
          }}
        />
      )}
      getRowCanExpand={(row) => (row.original.product_items?.length || 0) > 0}
      showPagination={true}
      currentPage={1}
      totalPages={1}
      pageSize={10}
      total={data.length}
      pageSizeOptions={[5, 10, 20]}
    />
  );
};

export default ProductVariantTable;
