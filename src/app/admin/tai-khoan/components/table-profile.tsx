"use client";

import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { DataTable } from "@/app/admin/_components/features/data-table";
import { getAllProfiles } from "@/apis";
import { ProfileType } from "@/schemas";
import { getColumns } from "./columns-profile";
import FormProfile from "./form-profile";
import { useSearchParamsState } from "@/hooks/useSearchParamsState";

const ProfileTable = () => {
  const queryClient = useQueryClient();
  const { params, setParam, setFilterParams } = useSearchParamsState({
    search: "",
    page: 1,
    pageSize: 10,
  });

  const [searchInput, setSearchInput] = useState(params.search);
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<ProfileType | null>(null);

  const { data: Response, isLoading } = useQuery({
    queryKey: ["profiles", params.search, params.page, params.pageSize],
    queryFn: () =>
      getAllProfiles({
        keyword: params.search,
        page: params.page,
        pageSize: params.pageSize,
        sortBy: { created_at: "desc" },
      }),
  });

  const handleSearchChange = (value: string) => setSearchInput(value);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilterParams({ search: searchInput });
  };

  const handleEdit = (item: ProfileType) => {
    setItemToEdit(item);
    setIsOpenForm(true);
  };

  const columns = getColumns({
    onEdit: handleEdit,
  });

  const data = Response?.data || [];
  const total = Response?.pagination?.total || 0;
  const totalPages = Response?.pagination?.totalPages || 1;

  return (
    <>
      <FormProfile
        open={isOpenForm}
        setOpen={setIsOpenForm}
        profile={itemToEdit}
        onSuccess={() =>
          queryClient.invalidateQueries({ queryKey: ["profiles"] })
        }
      />

      <DataTable
        columns={columns}
        data={data}
        loading={isLoading}
        tableName="Tài Khoản"
        toggleSidebar={true}
        showSearch={true}
        showColumnToggle={true}
        searchValue={searchInput}
        onSearchChange={handleSearchChange}
        onSearch={handleSearch}
        searchPlaceholder="Tìm kiếm tài khoản..."
        // Không có onAdd và addButtonName vì không có chức năng thêm
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

export default ProfileTable;
