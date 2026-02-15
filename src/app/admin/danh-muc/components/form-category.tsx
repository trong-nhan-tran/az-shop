"use client";

import { toast } from "react-hot-toast";
import { create } from "zustand";
import {
  CategoryInputType,
  categoryInputSchema,
  CategoryType,
} from "@/schemas";
import { generateSlug } from "@/libs/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCategory, updateCategory } from "@/apis";
import { Form } from "@/components/ui-shadcn/form";
import { useEffect, useState } from "react";
import CustomInput from "@/components/ui-shared/input-custom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import FormActions from "@/app/admin/_components/features/form-actions";
import SimpleModal from "@/app/admin/_components/features/simple-modal";
import InputImage from "@/app/admin/_components/ui/input-image";

const DEFAULT_VALUES: CategoryInputType = {
  name: "",
  slug: "",
  thumbnail: "",
  order_number: undefined,
};

// Component
type CategoryFormProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  itemToEdit?: CategoryType | null;
  onSuccess?: () => void;
  editMode?: boolean;
};

export const CategoryForm = ({
  open,
  setOpen,
  itemToEdit,
  onSuccess,
  editMode = false,
}: CategoryFormProps) => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const createMutation = useMutation({
    mutationFn: (data: FormData) => createCategory(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Đã thêm");
        setOpen(false);
        queryClient.invalidateQueries({ queryKey: ["categories"] });
        onSuccess?.();
      } else {
        toast.error("Lỗi thêm.");
      }
    },
    onError: () => {
      toast.error("Lỗi server");
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      updateCategory(id, data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Đã cập nhật");
        setOpen(false);
        queryClient.invalidateQueries({ queryKey: ["categories"] });
        onSuccess?.();
      } else {
        toast.error("Lỗi cập nhật.");
      }
    },
    onError: () => {
      toast.error("Lỗi server");
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const form = useForm<CategoryInputType>({
    resolver: zodResolver(categoryInputSchema),
    defaultValues: DEFAULT_VALUES,
  });

  useEffect(() => {
    if (open) {
      form.reset(
        editMode && itemToEdit
          ? {
              name: itemToEdit.name || "",
              slug: itemToEdit.slug || "",
              order_number: itemToEdit.order_number,
              thumbnail: itemToEdit.thumbnail || "",
            }
          : DEFAULT_VALUES
      );
      setThumbnailFile(null);
    }
  }, [open, editMode, itemToEdit, form]);

  const onSubmit = async (data: CategoryInputType) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("data", JSON.stringify(data));
    if (thumbnailFile) {
      formData.append("thumbnailFile", thumbnailFile);
    }

    if (editMode && itemToEdit) {
      updateMutation.mutate({ id: itemToEdit.id.toString(), data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleNameChange = (value: string) => {
    form.setValue("name", value);
    form.setValue("slug", generateSlug(value));
  };

  const handleThumbnailChange = (file: File | null) => {
    setThumbnailFile(file);
  };

  return (
    <SimpleModal
      open={open}
      onClose={() => setOpen(false)}
      title={
        editMode ? `Sửa danh mục "${itemToEdit?.name || ""}"` : `Thêm danh mục`
      }
      className="max-w-lg bg-white"
    >
      <Form {...form}>
        <form
          id="category-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className=""
        >
          <div className="space-y-3 mt-2">
            <InputImage
              control={form.control}
              name="thumbnail"
              label="Thumbnail"
              onFileChange={handleThumbnailChange}
              folder="categories"
              size="w-52 h-52"
            />
            <CustomInput
              control={form.control}
              name="name"
              label="Tên danh mục"
              placeholder="Nhập tên danh mục"
              onChange={(e) => handleNameChange(e.target.value)}
              disabled={loading}
            />
            <CustomInput
              control={form.control}
              name="slug"
              label="Slug ID"
              placeholder="Nhập slug"
              disabled={loading}
            />
            <CustomInput
              control={form.control}
              type="number"
              name="order_number"
              label="Số thứ tự"
              placeholder="Nhập số thứ tự"
            />
          </div>
          <FormActions
            loading={loading}
            onCancel={() => setOpen(false)}
            className="mt-4"
          />
        </form>
      </Form>
    </SimpleModal>
  );
};

// Hook
interface CategoryFormModalState {
  isOpen: boolean;
  category: CategoryType | null;
  isEditMode: boolean;
  onSuccess?: () => void;
  openModal: (props?: {
    category?: CategoryType | null;
    isEditMode?: boolean;
    onSuccess?: () => void;
  }) => void;
  closeModal: () => void;
  editCategory: (category: CategoryType) => void;
  addNewCategory: () => void;
}

export const useCategoryFormModal = create<CategoryFormModalState>((set) => ({
  isOpen: false,
  category: null,
  isEditMode: false,
  onSuccess: undefined,
  openModal: (props) =>
    set({
      isOpen: true,
      category: props?.category || null,
      isEditMode: props?.isEditMode || false,
      onSuccess: props?.onSuccess,
    }),
  closeModal: () =>
    set({
      isOpen: false,
      category: null,
      isEditMode: false,
      onSuccess: undefined,
    }),
  editCategory: (category) =>
    set({
      isOpen: true,
      category,
      isEditMode: true,
    }),
  addNewCategory: () =>
    set({
      isOpen: true,
      category: null,
      isEditMode: false,
    }),
}));

// Provider
export default function CategoryFormProvider() {
  const { isOpen, category, isEditMode, onSuccess, closeModal } =
    useCategoryFormModal();

  return (
    <CategoryForm
      open={isOpen}
      setOpen={(open) => !open && closeModal()}
      itemToEdit={category}
      onSuccess={onSuccess}
      editMode={isEditMode}
    />
  );
}

// Named exports for individual use
export { CategoryFormProvider };
