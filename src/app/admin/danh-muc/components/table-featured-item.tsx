"use client";

import React from "react";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getColumns } from "./columns-featured-item";
import { DataTable } from "@/app/admin/_components/features/data-table";

import FeaturedItemFormProvider, {
  useFeaturedItemFormModal,
} from "./form-featured-item";
import SimpleModal from "@/app/admin/_components/features/simple-modal";

import { deleteFeaturedItem, getAllFeaturedItems } from "@/apis";
import { FeaturedItemWithDetailsType } from "@/schemas";
import { useConfirmModal } from "@/app/admin/_hooks/use-confirm-modal";
import { useClientPagination } from "@/app/admin/_hooks/use-client-table-pagination";

type Props = {
  categoryId: number;
  open: boolean;
  onClose: () => void;
  categoryName?: string;
};

const FeaturedItemTable = ({
  categoryId,
  open,
  onClose,
  categoryName,
}: Props) => {
  const queryClient = useQueryClient();

  const { openModal: openFormFeaturedItemModal } = useFeaturedItemFormModal();
  const { openModal: openModalConfirm, closeModal: closeModalConfirm } =
    useConfirmModal();

  const { data: Response, isLoading } = useQuery({
    queryKey: ["featured-items", categoryId],
    queryFn: () =>
      getAllFeaturedItems({
        categoryId: categoryId,
      }),
  });

  const featuredItems: FeaturedItemWithDetailsType[] = Response?.data || [];
  const {
    currentPage,
    pageSize,
    paginatedData,
    total,
    totalPages,
    setCurrentPage,
    setPageSize,
  } = useClientPagination({
    data: featuredItems || [],
    initialPageSize: 5,
  });
  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteFeaturedItem(id),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({
          queryKey: ["featured-items", categoryId],
        });
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
      closeModalConfirm();
    },
  });

  const columns = getColumns({
    onEdit: (item: FeaturedItemWithDetailsType) =>
      openFormFeaturedItemModal({
        featuredItem: item,
        parentCategoryId: categoryId,
        isEditMode: true,
        featuredItems: featuredItems,
        onSuccess: () =>
          queryClient.invalidateQueries({
            queryKey: ["featured-items", categoryId],
          }),
      }),
    onDelete: (item: FeaturedItemWithDetailsType) =>
      openModalConfirm({
        title: "Xác nhận",
        description: `Xoá sản phẩm nổi bật #${item.id}?`,
        onConfirm: () => deleteMutation.mutate(item.id.toString()),
      }),
  });

  return (
    <SimpleModal
      open={open}
      title="Danh Sách Sản Phẩm Nổi Bật"
      onClose={onClose}
      className="max-w-7xl bg-card"
    >
      <FeaturedItemFormProvider />
      <DataTable
        columns={columns}
        data={paginatedData}
        loading={isLoading}
        showColumnToggle={true}
        className="p-0"
        tableName={`Danh Mục ${categoryName}`}
        onAdd={() =>
          openFormFeaturedItemModal({
            parentCategoryId: categoryId,
            featuredItems: featuredItems,
            isEditMode: false,
            onSuccess: () =>
              queryClient.invalidateQueries({
                queryKey: ["featured-items", categoryId],
              }),
          })
        }
        addButtonName="Thêm sản phẩm nổi bật"
        showPagination={true}
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        total={total}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        pageSizeOptions={[5, 10, 20]}
      />
    </SimpleModal>
  );
};

export default FeaturedItemTable;
