"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { getColumns } from "./columns-news";
import { DataTable } from "@/app/admin/_components/features/data-table";

import FormModal from "./form-news";

import { deleteNewsFeed, getAllNewsFeeds } from "@/apis";
import { NewsFeedType } from "@/schemas";
import { useSearchParamsState } from "@/hooks/useSearchParamsState";

import { useConfirmModal } from "@/app/admin/_hooks/use-confirm-modal";

const NewsTable = () => {
  const queryClient = useQueryClient();
  const { params, setParam, setFilterParams } = useSearchParamsState({
    search: "",
    page: 1,
    pageSize: 10,
  });

  const [searchInput, setSearchInput] = useState(params.search);
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<NewsFeedType | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const { openModal: openConfirmModal, closeModal: closeConfirmModal } =
    useConfirmModal();

  const { data: Response, isLoading } = useQuery({
    queryKey: ["news-feeds", params.search, params.page, params.pageSize],
    queryFn: () =>
      getAllNewsFeeds({
        keyword: params.search,
        page: params.page,
        pageSize: params.pageSize,
      }),
  });

  // Delete mutations
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNewsFeed(id),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ["news-feeds"] });
        toast.success("Đã xoá");
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

  const handleEdit = (item: NewsFeedType) => {
    setItemToEdit(item);
    setIsEditMode(true);
    setIsOpenForm(true);
  };

  const handleAddNew = () => {
    setItemToEdit(null);
    setIsEditMode(false);
    setIsOpenForm(true);
  };

  const columns = getColumns({
    onEdit: handleEdit,
    onDelete: (item: NewsFeedType) =>
      openConfirmModal({
        title: "Xác nhận",
        description: `Xoá tin tức "${item.title}"?`,
        onConfirm: () => deleteMutation.mutate(item.id.toString()),
      }),
  });

  const data = Response?.data || [];
  const total = Response?.pagination?.total || 0;
  const totalPages = Response?.pagination?.totalPages || 1;

  return (
    <>
      <FormModal
        open={isOpenForm}
        setOpen={setIsOpenForm}
        news={itemToEdit}
        onSuccess={() =>
          queryClient.invalidateQueries({ queryKey: ["news-feeds"] })
        }
        editMode={isEditMode}
      />

      <DataTable
        columns={columns}
        data={data}
        loading={isLoading}
        tableName="Tin tức"
        toggleSidebar={true}
        showSearch={true}
        showColumnToggle={true}
        searchValue={searchInput}
        onSearchChange={handleSearchChange}
        onSearch={handleSearch}
        searchPlaceholder="Tìm kiếm tin tức..."
        onAdd={handleAddNew}
        addButtonName="Thêm tin tức"
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

export default NewsTable;
