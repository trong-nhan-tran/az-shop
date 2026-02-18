"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { create } from "zustand";

import {
  FlashSaleItemType,
  flashSaleItemInputSchema,
  FlashSaleItemInputType,
} from "@/schemas";
import {
  createFlashSaleItem,
  updateFlashSaleItem,
  getAllProductItems,
} from "@/apis";

import { Form } from "@/components/ui-shadcn/form";
import CustomInput from "@/components/ui-shared/input-custom";
import SelectWithSearch from "@/components/ui-shared/select-with-search";
import FormActions from "@/app/admin/_components/features/form-actions";
import SimpleModal from "@/app/admin/_components/features/simple-modal";

const DEFAULT_VALUES: FlashSaleItemInputType = {
  flash_sale_id: 0,
  product_item_id: 0,
  sale_price: 0,
  quantity: 0,
};

// Component
type FlashSaleItemFormProps = {
  flashSaleItem?: FlashSaleItemType | null;
  onSuccess?: (data: FlashSaleItemType) => void;
  editMode?: boolean;
  open?: boolean;
  setOpen?: (open: boolean) => void;
  flashSaleId?: string;
};

export const FlashSaleItemForm = ({
  flashSaleItem,
  onSuccess,
  editMode = false,
  open = false,
  setOpen = () => {},
  flashSaleId,
}: FlashSaleItemFormProps) => {
  const form = useForm<FlashSaleItemInputType>({
    resolver: zodResolver(flashSaleItemInputSchema),
    defaultValues: DEFAULT_VALUES,
  });

  // Fetch product items
  const { data: productItemsData, isLoading: loadingProductItems } = useQuery({
    queryKey: ["product-items"],
    queryFn: () => getAllProductItems(),
    enabled: open,
  });

  const productItems = productItemsData?.data || [];

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: FlashSaleItemInputType) => createFlashSaleItem(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Thêm sản phẩm flash sale thành công");
        setOpen(false);
        onSuccess?.(response.data);
      } else {
        toast.error(response.message || "Lỗi thêm sản phẩm flash sale");
      }
    },
    onError: () => {
      toast.error("Lỗi server");
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: FlashSaleItemInputType }) =>
      updateFlashSaleItem(id, data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Cập nhật sản phẩm flash sale thành công");
        setOpen(false);
        onSuccess?.(response.data);
      } else {
        toast.error(response.message || "Lỗi cập nhật sản phẩm flash sale");
      }
    },
    onError: () => {
      toast.error("Lỗi server");
    },
  });

  useEffect(() => {
    if (flashSaleItem && editMode) {
      form.reset({
        flash_sale_id: flashSaleItem.flash_sale_id,
        product_item_id: flashSaleItem.product_item_id,
        sale_price: flashSaleItem.sale_price,
        quantity: flashSaleItem.quantity,
      });
    } else {
      form.reset({
        ...DEFAULT_VALUES,
        flash_sale_id: flashSaleId ? parseInt(flashSaleId) : 0,
      });
    }
  }, [flashSaleItem, form, editMode, flashSaleId]);

  // Transform product items for select
  const productItemOptions = productItems.map((item) => ({
    value: String(item.id),
    label: `${item.product_variants?.name} - ${
      item.product_colors?.color_name
    } - ${new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(item.price || 0)}`,
  }));

  const onSubmit = async (data: FlashSaleItemInputType) => {
    if (editMode && flashSaleItem) {
      updateMutation.mutate({
        id: String(flashSaleItem.id),
        data,
      });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <SimpleModal
      open={open}
      onClose={() => setOpen(false)}
      title={editMode ? "Sửa sản phẩm flash sale" : "Thêm sản phẩm flash sale"}
      className="max-w-2xl bg-card"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-3 overflow-hidden"
        >
          <div className="space-y-3 mt-1">
            <SelectWithSearch
              control={form.control}
              name="product_item_id"
              label="Sản phẩm"
              options={productItemOptions}
              isNumeric={true}
              title="Chọn sản phẩm"
              className="w-full"
              disabled={loadingProductItems}
              isRequired={true}
            />

            <div className="grid grid-cols-2 gap-4">
              <CustomInput
                control={form.control}
                name="sale_price"
                label="Giá khuyến mãi"
                placeholder="Nhập giá khuyến mãi"
                type="number"
                isRequired={true}
              />

              <CustomInput
                control={form.control}
                name="quantity"
                label="Số lượng"
                placeholder="Nhập số lượng"
                type="number"
                isRequired={true}
              />
            </div>
          </div>

          <FormActions
            loading={createMutation.isPending || updateMutation.isPending}
            onCancel={() => setOpen(false)}
          />
        </form>
      </Form>
    </SimpleModal>
  );
};

// Hook
interface FlashSaleItemFormModalState {
  isOpen: boolean;
  flashSaleId: string;
  flashSaleItem: FlashSaleItemType | null;
  isEditMode: boolean;
  onSuccess?: () => void;
  openModal: (params: {
    flashSaleId: string;
    flashSaleItem?: FlashSaleItemType | null;
    isEditMode?: boolean;
    onSuccess?: () => void;
  }) => void;
  closeModal: () => void;
}

export const useFlashSaleItemFormModal = create<FlashSaleItemFormModalState>(
  (set) => ({
    isOpen: false,
    flashSaleId: "",
    flashSaleItem: null,
    isEditMode: false,
    onSuccess: undefined,
    openModal: ({
      flashSaleId,
      flashSaleItem = null,
      isEditMode = false,
      onSuccess,
    }) =>
      set({
        isOpen: true,
        flashSaleId,
        flashSaleItem,
        isEditMode,
        onSuccess,
      }),
    closeModal: () =>
      set({
        isOpen: false,
        flashSaleId: "",
        flashSaleItem: null,
        isEditMode: false,
        onSuccess: undefined,
      }),
  })
);

// Provider
export default function FlashSaleItemFormProvider() {
  const {
    isOpen,
    flashSaleId,
    flashSaleItem,
    isEditMode,
    onSuccess,
    closeModal,
  } = useFlashSaleItemFormModal();

  return (
    <FlashSaleItemForm
      open={isOpen}
      setOpen={(open) => !open && closeModal()}
      flashSaleId={flashSaleId}
      flashSaleItem={flashSaleItem}
      editMode={isEditMode}
      onSuccess={onSuccess}
    />
  );
}

// Named exports for individual use
export { FlashSaleItemFormProvider };
