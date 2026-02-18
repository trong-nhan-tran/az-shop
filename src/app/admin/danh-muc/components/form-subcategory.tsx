"use client";

import { toast } from "react-hot-toast";
import { create } from "zustand";
import {
  SubcategoryInputType,
  subcategoryInputSchema,
  SubcategoryType,
} from "@/schemas";
import { generateSlug } from "@/libs/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createSubcategory, updateSubcategory } from "@/apis";
import { Form } from "@/components/ui-shadcn/form";
import { useEffect, useState } from "react";
import CustomInput from "@/components/ui-shared/input-custom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import FormActions from "@/app/admin/_components/features/form-actions";
import SimpleModal from "@/app/admin/_components/features/simple-modal";

const DEFAULT_VALUES: SubcategoryInputType = {
  name: "",
  slug: "",
  category_id: undefined,
  order_number: undefined,
};

// Component
type SubcategoryFormProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  itemToEdit?: SubcategoryType | null;
  parentCategoryId?: number | null;
  onSuccess?: () => void;
  editMode?: boolean;
};

export const SubcategoryForm = ({
  open,
  setOpen,
  itemToEdit,
  parentCategoryId,
  onSuccess,
  editMode = false,
}: SubcategoryFormProps) => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createSubcategory,
    onSuccess: (response) => {
      if (response.success) {
        console.log(response.message);
        toast.success("Đã thêm");
        setOpen(false);
        queryClient.invalidateQueries({ queryKey: ["categories"] });
        queryClient.invalidateQueries({ queryKey: ["subcategories"] });
        onSuccess?.();
      } else {
        console.log(response.message);
        toast.error("Lỗi thêm.");
      }
    },
    onError: (error) => {
      console.error("Error creating subcategory:", error);
      toast.error("Lỗi server");
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: SubcategoryInputType }) =>
      updateSubcategory(id, data),
    onSuccess: (response) => {
      if (response.success) {
        console.log(response.message);
        toast.success("Đã cập nhật");
        setOpen(false);
        queryClient.invalidateQueries({ queryKey: ["categories"] });
        queryClient.invalidateQueries({ queryKey: ["subcategories"] });
        onSuccess?.();
      } else {
        console.log(response.message);
        toast.error("Lỗi cập nhật.");
      }
    },
    onError: (error) => {
      console.error("Error updating subcategory:", error);
      toast.error("Lỗi server");
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const form = useForm<SubcategoryInputType>({
    resolver: zodResolver(subcategoryInputSchema),
    defaultValues: {
      ...DEFAULT_VALUES,
      category_id: parentCategoryId,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset(
        editMode && itemToEdit
          ? {
              name: itemToEdit.name || "",
              slug: itemToEdit.slug || "",
              category_id: itemToEdit.category_id,
              order_number:
                itemToEdit.order_number !== null
                  ? Number(itemToEdit.order_number)
                  : undefined,
            }
          : {
              ...DEFAULT_VALUES,
              category_id: parentCategoryId,
            }
      );
    }
  }, [open, editMode, itemToEdit, form, parentCategoryId]);

  const onSubmit = async (data: SubcategoryInputType) => {
    setLoading(true);
    if (editMode && itemToEdit) {
      updateMutation.mutate({ id: itemToEdit.id.toString(), data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleNameChange = (value: string) => {
    form.setValue("name", value);
    form.setValue("slug", generateSlug(value));
  };

  const title = editMode
    ? `Sửa danh mục con "${itemToEdit?.name || ""}"`
    : "Thêm danh mục con";

  return (
    <SimpleModal
      open={open}
      onClose={() => setOpen(false)}
      title={title}
      className="max-w-lg bg-card"
    >
      <Form {...form}>
        <form
          id="subcategory-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className=""
        >
          <div className="space-y-3 mt-2">
            <CustomInput
              control={form.control}
              name="name"
              label="Tên danh mục con"
              placeholder="Nhập tên danh mục con"
              className="col-span-1"
              onChange={(e) => handleNameChange(e.target.value)}
              disabled={loading}
            />
            <CustomInput
              control={form.control}
              name="slug"
              label="Slug ID"
              placeholder="Nhập slug"
              className="col-span-1"
              disabled={loading}
            />
            <CustomInput
              control={form.control}
              type="number"
              name="order_number"
              label="Số thứ tự"
              placeholder="Nhập số thứ tự"
              className="col-span-1"
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
interface SubcategoryFormModalState {
  isOpen: boolean;
  subcategory: SubcategoryType | null;
  parentCategoryId: number | null;
  isEditMode: boolean;
  onSuccess?: () => void;
  openModal: (props?: {
    subcategory?: SubcategoryType | null;
    parentCategoryId?: number | null;
    isEditMode?: boolean;
    onSuccess?: () => void;
  }) => void;
  closeModal: () => void;
}

export const useSubcategoryFormModal = create<SubcategoryFormModalState>(
  (set) => ({
    isOpen: false,
    subcategory: null,
    parentCategoryId: null,
    isEditMode: false,
    onSuccess: undefined,
    openModal: (props) =>
      set({
        isOpen: true,
        subcategory: props?.subcategory || null,
        parentCategoryId: props?.parentCategoryId || null,
        isEditMode: props?.isEditMode || false,
        onSuccess: props?.onSuccess,
      }),
    closeModal: () =>
      set({
        isOpen: false,
        subcategory: null,
        parentCategoryId: null,
        isEditMode: false,
        onSuccess: undefined,
      }),
  })
);

// Provider
export default function SubcategoryFormProvider() {
  const {
    isOpen,
    subcategory,
    parentCategoryId,
    isEditMode,
    onSuccess,
    closeModal,
  } = useSubcategoryFormModal();

  return (
    <SubcategoryForm
      open={isOpen}
      setOpen={(open) => !open && closeModal()}
      itemToEdit={subcategory}
      parentCategoryId={parentCategoryId}
      onSuccess={onSuccess}
      editMode={isEditMode}
    />
  );
}

// Named exports for individual use
export { SubcategoryFormProvider };
