"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { getColumns } from "./columns-product";
import { DataTable } from "@/app/admin/_components/features/data-table";

import FormModal from "./form-product";
import ProductVariantTable from "./table-product-variant";
import ProductColorTable from "./table-product-color";
import CategoriesFilterSelect from "./filter-select-categories";

import { deleteProduct, getAllProducts } from "@/apis";
import { ProductType, ProductWithDetailType } from "@/schemas";
import { useSearchParamsState } from "@/hooks/useSearchParamsState";

import { useConfirmModal } from "@/app/admin/_hooks/use-confirm-modal";

const ProductTable = () => {
  const queryClient = useQueryClient();
  const { params, setParam, setFilterParams } = useSearchParamsState({
    search: "",
    page: 1,
    pageSize: 10,
    categoryId: "",
  });

  const [searchInput, setSearchInput] = useState(params.search);
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<ProductWithDetailType | null>(
    null
  );
  const [isEditMode, setIsEditMode] = useState(false);
  const [isOpenColorModal, setIsOpenColorModal] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<ProductWithDetailType | null>(null);

  const { openModal: openConfirmModal, closeModal: closeConfirmModal } =
    useConfirmModal();

  const { data: Response, isLoading } = useQuery({
    queryKey: [
      "products",
      params.search,
      params.page,
      params.pageSize,
      params.categoryId,
    ],
    queryFn: () =>
      getAllProducts({
        keyword: params.search,
        page: params.page,
        pageSize: params.pageSize,
        categoryId: params.categoryId || undefined,
        sortBy: { created_at: "desc" },
      }),
  });

  // Delete mutations
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ["products"] });
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

  const handleEdit = (item: ProductWithDetailType) => {
    setItemToEdit(item);
    setIsEditMode(true);
    setIsOpenForm(true);
  };

  const handleAddNew = () => {
    setItemToEdit(null);
    setIsEditMode(false);
    setIsOpenForm(true);
  };

  const handleCategoryChange = (categoryId: string) => {
    const newCategoryId = categoryId === "all" ? "" : categoryId;
    setFilterParams({ categoryId: newCategoryId });
  };

  const handleOpenColorModal = (product: ProductWithDetailType) => {
    setSelectedProduct(product);
    setIsOpenColorModal(true);
  };

  const handleCloseColorModal = () => {
    setSelectedProduct(null);
    setIsOpenColorModal(false);
  };

  const columns = getColumns({
    onEdit: handleEdit,
    onDelete: (item: ProductType) =>
      openConfirmModal({
        title: "Xác nhận",
        description: `Xoá sản phẩm "${item.name}"?`,
        onConfirm: () => deleteMutation.mutate(item.id.toString()),
      }),
    onOpenColorModal: handleOpenColorModal,
  });

  const data = Response?.data || [];
  const total = Response?.pagination?.total || 0;
  const totalPages = Response?.pagination?.totalPages || 1;

  return (
    <>
      <FormModal
        open={isOpenForm}
        setOpen={setIsOpenForm}
        product={itemToEdit}
        onSuccess={() =>
          queryClient.invalidateQueries({ queryKey: ["products"] })
        }
        editMode={isEditMode}
      />

      {selectedProduct && (
        <ProductColorTable
          productId={selectedProduct.id}
          open={isOpenColorModal}
          onClose={handleCloseColorModal}
          productName={selectedProduct.name}
        />
      )}

      <DataTable
        columns={columns}
        data={data}
        loading={isLoading}
        tableName="Sản Phẩm"
        toggleSidebar={true}
        showSearch={true}
        showColumnToggle={true}
        searchValue={searchInput}
        onSearchChange={handleSearchChange}
        onSearch={handleSearch}
        searchPlaceholder="Tìm kiếm sản phẩm..."
        onAdd={handleAddNew}
        addButtonName="Thêm sản phẩm"
        childrenHeader={
          <CategoriesFilterSelect
            selectedCategoryId={params.categoryId || null}
            onCategoryChange={handleCategoryChange}
          />
        }
        expandedContent={(row) => (
          <ProductVariantTable
            productName={row.original.name}
            productId={row.original.id}
            productColors={row.original.product_colors}
            onSuccess={() =>
              queryClient.invalidateQueries({ queryKey: ["products"] })
            }
            isExpanded={true}
          />
        )}
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

export default ProductTable;
