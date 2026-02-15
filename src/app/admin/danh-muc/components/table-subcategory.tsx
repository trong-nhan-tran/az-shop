"use client";

import React from "react";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getColumns } from "./columns-subcategory";
import { DataTable } from "@/app/admin/_components/features/data-table";

import { deleteSubcategory } from "@/apis";
import { SubcategoryType } from "@/schemas";
import { useConfirmModal } from "@/app/admin/_hooks/use-confirm-modal";
import { useSubcategoryFormModal } from "./form-subcategory";
import { useClientPagination } from "@/app/admin/_hooks/use-client-table-pagination";
import { on } from "events";

type Props = {
  parentCategoryId: string;
  subcategories: SubcategoryType[];
  parentCategoryName?: string;
};

const SubcategoryTable = ({
  parentCategoryId,
  subcategories,
  parentCategoryName,
}: Props) => {
  const queryClient = useQueryClient();
  const { openModal: openModalConfirm, closeModal: closeModalConfirm } =
    useConfirmModal();
  const { openModal: openSubcategoryForm } = useSubcategoryFormModal();

  // Use client pagination
  const {
    currentPage,
    pageSize,
    paginatedData,
    total,
    totalPages,
    setCurrentPage,
    setPageSize,
  } = useClientPagination({
    data: subcategories || [],
    initialPageSize: 5,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteSubcategory(id),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ["categories"] });
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
    onEdit: (item: SubcategoryType) =>
      openSubcategoryForm({
        subcategory: item,
        isEditMode: true,
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
      }),
    onDelete: (item: SubcategoryType) =>
      openModalConfirm({
        title: "Xác nhận",
        description: `Xoá danh mục con "${item.name}"?`,
        onConfirm: () => deleteMutation.mutate(item.id.toString()),
      }),
  });

  return (
    <DataTable
      columns={columns}
      data={paginatedData}
      loading={false}
      showColumnToggle={true}
      className="rounded-lg"
      tableName={parentCategoryName}
      onAdd={() =>
        openSubcategoryForm({
          parentCategoryId: parseInt(parentCategoryId),
          isEditMode: false,
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
          },
        })
      }
      addButtonName="Thêm danh mục con"
      showPagination={true}
      currentPage={currentPage}
      totalPages={totalPages}
      pageSize={pageSize}
      total={total}
      onPageChange={setCurrentPage}
      onPageSizeChange={setPageSize}
      pageSizeOptions={[5, 10, 20]}
    />
  );
};

export default SubcategoryTable;
