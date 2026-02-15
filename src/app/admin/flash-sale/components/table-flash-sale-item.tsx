"use client";

import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getColumns } from "./columns-flash-sale-item";
import { DataTable } from "@/app/admin/_components/features/data-table";

import { useConfirmModal } from "@/app/admin/_hooks/use-confirm-modal";
import { useFlashSaleItemFormModal } from "./form-flash-sale-item";
import { deleteFlashSaleItem, getAllFlashSaleItems } from "@/apis";
import { FlashSaleItemWithDetailType } from "@/schemas";
import { useClientPagination } from "@/app/admin/_hooks/use-client-table-pagination";

type Props = {
  flashSaleName: string;
  flashSaleId: number;
  onSuccess: () => void;
  isExpanded: boolean;
};

const FlashSaleItemTable = ({
  flashSaleName,
  flashSaleId,
  onSuccess,
  isExpanded,
}: Props) => {
  const queryClient = useQueryClient();

  const { openModal: openConfirmModal, closeModal: closeConfirmModal } =
    useConfirmModal();
  const { openModal: openFlashSaleItemFormModal } = useFlashSaleItemFormModal();

  const { data: itemsResponse, isLoading } = useQuery({
    queryKey: ["flash-sale-items", flashSaleId],
    queryFn: () =>
      getAllFlashSaleItems({ flashSaleId: flashSaleId.toString() }),
    enabled: isExpanded && !!flashSaleId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const data = itemsResponse?.data || [];
  const {
    currentPage,
    pageSize,
    paginatedData,
    total,
    totalPages,
    setCurrentPage,
    setPageSize,
  } = useClientPagination({
    data: data || [],
    initialPageSize: 5,
  });
  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteFlashSaleItem(id),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Đã xoá sản phẩm flash sale");
        queryClient.invalidateQueries({
          queryKey: ["flash-sale-items", flashSaleId],
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
    onEdit: (item: FlashSaleItemWithDetailType) => {
      openFlashSaleItemFormModal({
        flashSaleId: flashSaleId.toString(),
        flashSaleItem: item,
        isEditMode: true,
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["flash-sale-items", flashSaleId],
          });
          onSuccess();
        },
      });
    },
    onDelete: (item: FlashSaleItemWithDetailType) => {
      openConfirmModal({
        title: "Xác nhận",
        description: `Xoá sản phẩm khỏi flash sale?`,
        onConfirm: () => deleteMutation.mutate(item.id.toString()),
      });
    },
  });

  return (
    <DataTable
      columns={columns}
      data={paginatedData}
      loading={isLoading}
      showColumnToggle={true}
      className="rounded-lg"
      tableName={flashSaleName}
      onAdd={() => {
        openFlashSaleItemFormModal({
          flashSaleId: flashSaleId.toString(),
          flashSaleItem: null,
          isEditMode: false,
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ["flash-sale-items", flashSaleId],
            });
            onSuccess();
          },
        });
      }}
      addButtonName="Thêm sản phẩm"
      showPagination={true}
      currentPage={currentPage}
      totalPages={totalPages}
      pageSize={pageSize}
      total={total}
      pageSizeOptions={[5, 10, 20]}
      onPageChange={setCurrentPage}
      onPageSizeChange={setPageSize}
    />
  );
};

export default FlashSaleItemTable;
