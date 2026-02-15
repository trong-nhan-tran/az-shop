"use client";

import { toast } from "react-hot-toast";
import { create } from "zustand";
import {
  FeaturedItemInputType,
  featuredItemInputSchema,
  FeaturedItemType,
  ProductVariantType,
} from "@/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createFeaturedItem,
  getAllProductVariants,
  updateFeaturedItem,
} from "@/apis";
import { Form } from "@/components/ui-shadcn/form";
import { useEffect, useState } from "react";
import CustomInput from "@/components/ui-shared/input-custom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import FormActions from "@/app/admin/_components/features/form-actions";
import SimpleModal from "@/app/admin/_components/features/simple-modal";
import SelectWithSearch from "@/components/ui-shared/select-with-search";

const DEFAULT_VALUES: FeaturedItemInputType = {
  product_variant_id: undefined,
  category_id: undefined,
  order_number: undefined,
};

// Component
type FeaturedItemFormProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  itemToEdit?: FeaturedItemType | null;
  parentCategoryId?: number | null;
  onSuccess?: () => void;
  editMode?: boolean;
  featuredItems?: FeaturedItemType[];
};

export const FeaturedItemForm = ({
  open,
  setOpen,
  itemToEdit,
  parentCategoryId,
  onSuccess,
  editMode = false,
  featuredItems = [],
}: FeaturedItemFormProps) => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  // Query for fetching
  const { data: productVariantData, isLoading } = useQuery({
    queryKey: ["product_variants", parentCategoryId],
    queryFn: () =>
      getAllProductVariants({
        categoryId: parentCategoryId ? String(parentCategoryId) : undefined,
      }),
    enabled: open, // Only fetch when modal is open
  });

  const productVariants: ProductVariantType[] = productVariantData?.data || [];
  const productVariantOptions = productVariants
    .filter((productVariant) => {
      // Keep the current item being edited in the options
      if (editMode && itemToEdit?.product_variant_id === productVariant.id) {
        return true;
      }
      // Filter out items that are already in the featuredItems list
      return !featuredItems.some(
        (item) => item.product_variant_id === productVariant.id
      );
    })
    .map((productVariant) => ({
      value: String(productVariant.id),
      label: productVariant.name || "",
    }));

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createFeaturedItem,
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Đã thêm");
        setOpen(false);
        onSuccess?.();
      } else {
        toast.error("Lỗi thêm.");
      }
    },
    onError: (error) => {
      console.error("Error creating featured item:", error);
      toast.error("Lỗi server");
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: FeaturedItemInputType }) =>
      updateFeaturedItem(id, data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Đã cập nhật");
        setOpen(false);
        onSuccess?.();
      } else {
        toast.error("Lỗi cập nhật.");
      }
    },
    onError: (error) => {
      console.error("Error updating featured item:", error);
      toast.error("Lỗi server");
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const form = useForm<FeaturedItemInputType>({
    resolver: zodResolver(featuredItemInputSchema),
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
              product_variant_id: itemToEdit.product_variant_id,
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

  const onSubmit = async (data: FeaturedItemInputType) => {
    setLoading(true);
    if (editMode && itemToEdit) {
      updateMutation.mutate({ id: itemToEdit.id.toString(), data });
    } else {
      createMutation.mutate(data);
    }
  };

  const title = editMode
    ? `Sửa sản phẩm nổi bật "${itemToEdit?.id || ""}"`
    : "Thêm sản phẩm nổi bật";

  return (
    <SimpleModal
      open={open}
      onClose={() => setOpen(false)}
      title={title}
      className="max-w-lg bg-white"
    >
      <Form {...form}>
        <form id="featured-item-form" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-3 mt-2">
            <SelectWithSearch
              control={form.control}
              options={productVariantOptions}
              name="product_variant_id"
              label="Sản phẩm"
              placeholder={isLoading ? "Đang tải..." : "Chọn sản phẩm"}
              title="Chọn sản phẩm"
              isRequired
              className="col-span-1"
              disabled={loading}
              isNumeric
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
interface FeaturedItemFormModalState {
  isOpen: boolean;
  featuredItem: FeaturedItemType | null;
  parentCategoryId: number | null;
  isEditMode: boolean;
  featuredItems: FeaturedItemType[];
  onSuccess?: () => void;
  openModal: (props?: {
    featuredItem?: FeaturedItemType | null;
    parentCategoryId?: number | null;
    isEditMode?: boolean;
    featuredItems?: FeaturedItemType[];
    onSuccess?: () => void;
  }) => void;
  closeModal: () => void;
}

export const useFeaturedItemFormModal = create<FeaturedItemFormModalState>(
  (set) => ({
    isOpen: false,
    featuredItem: null,
    parentCategoryId: null,
    isEditMode: false,
    featuredItems: [],
    onSuccess: undefined,
    openModal: (props) =>
      set({
        isOpen: true,
        featuredItem: props?.featuredItem || null,
        parentCategoryId: props?.parentCategoryId || null,
        isEditMode: props?.isEditMode || false,
        featuredItems: props?.featuredItems || [],
        onSuccess: props?.onSuccess,
      }),
    closeModal: () =>
      set({
        isOpen: false,
        featuredItem: null,
        parentCategoryId: null,
        isEditMode: false,
        featuredItems: [],
        onSuccess: undefined,
      }),
  })
);

// Provider
export default function FeaturedItemFormProvider() {
  const {
    isOpen,
    featuredItem,
    parentCategoryId,
    isEditMode,
    featuredItems,
    onSuccess,
    closeModal,
  } = useFeaturedItemFormModal();

  return (
    <FeaturedItemForm
      open={isOpen}
      setOpen={(open) => !open && closeModal()}
      itemToEdit={featuredItem}
      parentCategoryId={parentCategoryId}
      editMode={isEditMode}
      featuredItems={featuredItems}
      onSuccess={onSuccess}
    />
  );
}

// Named exports for individual use
export { FeaturedItemFormProvider };
