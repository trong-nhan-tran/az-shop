"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getColumns } from "./columns-banner";
import { DataTable } from "@/app/admin/_components/features/data-table";

import FormModal from "./form-banner";
import SimpleModal from "@/app/admin/_components/features/simple-modal";

import { deleteBanner, getAllBanners } from "@/apis";
import { BannerType } from "@/schemas";
import { useConfirmModal } from "@/app/admin/_hooks/use-confirm-modal";

type Props = {
  categoryId: number;
  open: boolean;
  onClose: () => void;
  categoryName?: string;
};

const BannerTable = ({ categoryId, open, onClose, categoryName }: Props) => {
  const queryClient = useQueryClient();

  const [isOpenForm, setIsOpenForm] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<BannerType | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const { openModal: openModalConfirm, closeModal: closeModalConfirm } =
    useConfirmModal();
  const { data: Response, isLoading } = useQuery({
    queryKey: ["banners", categoryId],
    queryFn: () =>
      getAllBanners({
        categoryId: categoryId.toString(),
      }),
  });

  const banners: BannerType[] = Response?.data || [];
  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteBanner(id),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ["banners", categoryId] });
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

  const handleEdit = (item: BannerType) => {
    setItemToEdit(item);
    setIsEditMode(true);
    setIsOpenForm(true);
  };

  const handleAddNew = () => {
    setItemToEdit(null);
    setIsEditMode(false);
    setIsOpenForm(true);
  };

  const handleDelete = (item: BannerType) => {
    openModalConfirm({
      title: "Xác nhận",
      description: `Xoá banner #${item.id}?`,
      onConfirm: () => deleteMutation.mutate(item.id.toString()),
    });
  };

  const columns = getColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

  return (
    <SimpleModal
      open={open}
      title="Danh Sách Banner"
      onClose={onClose}
      className="max-w-7xl bg-card"
    >
      <FormModal
        open={isOpenForm}
        setOpen={setIsOpenForm}
        itemToEdit={itemToEdit}
        categoryId={categoryId}
        onSuccess={() =>
          queryClient.invalidateQueries({ queryKey: ["banners", categoryId] })
        }
        editMode={isEditMode}
      />

      <DataTable
        columns={columns}
        data={banners}
        loading={isLoading}
        showColumnToggle={true}
        className="p-0"
        tableName={`Danh Mục ${categoryName}`}
        onAdd={handleAddNew}
        addButtonName="Thêm danh mục con"
      />
    </SimpleModal>
  );
};

export default BannerTable;
