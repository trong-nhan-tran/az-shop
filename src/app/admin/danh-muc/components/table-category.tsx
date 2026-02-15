"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { getColumns } from "./columns-category";
import { DataTable } from "@/app/admin/_components/features/data-table";

import { deleteCategory, getAllCategories } from "@/apis";
import { CategoryWithSubType } from "@/schemas";
import { useSearchParamsState } from "@/hooks/useSearchParamsState";
import { useConfirmModal } from "@/app/admin/_hooks/use-confirm-modal";
import { useCategoryFormModal } from "./form-category";
import BannerTable from "./table-banner";
import SubcategoryTable from "./table-subcategory";
import FeaturedItemTable from "./table-featured-item";

const CategoryTable = () => {
  const queryClient = useQueryClient();
  const { params, setParam, setFilterParams } = useSearchParamsState({
    search: "",
    page: 1,
    pageSize: 10,
  });

  // Local state for search input
  const [searchInput, setSearchInput] = useState(params.search);
  const [isOpenBannerModal, setIsOpenBannerModal] = useState(false);
  const [isOpenFeaturedItemModal, setIsOpenFeaturedItemModal] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryWithSubType | null>(null);

  // Use Zustand stores
  const { openModal: openModalConfirm, closeModal: closeModalConfirm } =
    useConfirmModal();
  const { editCategory, addNewCategory } = useCategoryFormModal();

  // Query for fetching
  const { data: Response, isLoading } = useQuery({
    queryKey: ["categories", params.search, params.page, params.pageSize],
    queryFn: () =>
      getAllCategories({
        keyword: params.search,
        page: params.page,
        pageSize: params.pageSize,
      }),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCategory(id),
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

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilterParams({ search: searchInput });
  };

  const handleEdit = (item: CategoryWithSubType) => {
    editCategory(item);
  };

  const handleAddNew = () => {
    addNewCategory();
  };

  const handleDelete = (item: CategoryWithSubType) => {
    openModalConfirm({
      title: "Xác nhận",
      description: `Xoá danh mục "${item.name}"?`,
      onConfirm: () => deleteMutation.mutate(item.id.toString()),
    });
  };

  const handlePageChange = (newPage: number) => {
    setParam("page", newPage);
  };

  const handlePageSizeChange = (newSize: number) => {
    setFilterParams({ pageSize: newSize });
  };

  const handleOpenBannerModal = (category: CategoryWithSubType) => {
    setSelectedCategory(category);
    setIsOpenBannerModal(true);
  };

  const handleCloseBannerModal = () => {
    setSelectedCategory(null);
    setIsOpenBannerModal(false);
  };

  const handleOpenFeaturedItemModal = (category: CategoryWithSubType) => {
    setSelectedCategory(category);
    setIsOpenFeaturedItemModal(true);
  };

  const handleCloseFeaturedItemModal = () => {
    setSelectedCategory(null);
    setIsOpenFeaturedItemModal(false);
  };

  const columns = getColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
    onOpenBannerModal: handleOpenBannerModal,
    onOpenFeaturedItemModal: handleOpenFeaturedItemModal,
  });

  const data = Response?.data || [];
  const total = Response?.pagination?.total || 0;
  const totalPages = Response?.pagination?.totalPages || 1;

  return (
    <div className="flex flex-col h-full">
      {selectedCategory && (
        <BannerTable
          categoryId={selectedCategory.id}
          open={isOpenBannerModal}
          onClose={handleCloseBannerModal}
          categoryName={selectedCategory.name}
        />
      )}
      {selectedCategory && (
        <FeaturedItemTable
          categoryId={selectedCategory.id}
          open={isOpenFeaturedItemModal}
          onClose={handleCloseFeaturedItemModal}
          categoryName={selectedCategory.name}
        />
      )}

      <DataTable
        columns={columns}
        data={data}
        loading={isLoading}
        tableName="Danh Mục"
        toggleSidebar={true}
        showSearch={true}
        showColumnToggle={true}
        searchValue={searchInput}
        onSearchChange={handleSearchChange}
        onSearch={handleSearch}
        searchPlaceholder="Tìm kiếm danh mục..."
        onAdd={handleAddNew}
        addButtonName="Thêm danh mục"
        expandedContent={(row) => (
          <SubcategoryTable
            parentCategoryId={row.original.id.toString()}
            subcategories={row.original.subcategories || []}
            parentCategoryName={row.original.name}
          />
        )}
        showPagination={true}
        currentPage={params.page}
        totalPages={totalPages}
        pageSize={params.pageSize}
        total={total}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        pageSizeOptions={[10, 20, 50, 100]}
      />
    </div>
  );
};

export default CategoryTable;
