"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { create } from "zustand";
import { useQuery } from "@tanstack/react-query";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui-shadcn/form";
import SimpleModal from "@/app/admin/_components/features/simple-modal";
import { createProductItem, updateProductItem } from "@/apis";
import { getAllProductColors } from "@/apis/api-product-color";
import {
  ProductItemInputType,
  ProductItemWithDetails,
  ProductVariantType,
} from "@/schemas";
import { productItemInputSchema } from "@/schemas/schema-product-item";
import CustomInput from "@/components/ui-shared/input-custom";
import FormActions from "@/app/admin/_components/features/form-actions";
import RadioColor from "./radio-product-color";
import { Switch } from "@/components/ui-shadcn/switch";
import { Label } from "@/components/ui-shadcn/label";

// Component
type ProductItemFormProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSuccess?: () => void;
  editMode?: boolean;
  itemToEdit?: ProductItemWithDetails | null;
  existingItems?: ProductItemWithDetails[];
  productVariant: ProductVariantType;
};

export const ProductItemForm = ({
  open,
  setOpen,
  onSuccess,
  editMode = false,
  itemToEdit,
  existingItems = [],
  productVariant,
}: ProductItemFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [useBasePrice, setUseBasePrice] = useState(false);

  // Fetch product colors
  const {
    data: colorsResponse,
    isLoading: isLoadingColors,
    error: colorsError,
  } = useQuery({
    queryKey: ["product-colors", productVariant?.product_id],
    queryFn: () =>
      getAllProductColors({ productId: productVariant.product_id?.toString() }),
    enabled: open && !!productVariant.product_id,
  });

  const productColors = colorsResponse?.data || [];

  const form = useForm<ProductItemInputType>({
    resolver: zodResolver(productItemInputSchema),
    defaultValues: {
      product_color_id: 0,
      product_variant_id: +productVariant?.id,
      is_available: false,
      price: 0,
    },
  });

  const disabledColorIds = useMemo(() => {
    return existingItems
      .filter((item) => {
        if (editMode && itemToEdit && item.id === itemToEdit.id) {
          return false;
        }
        return true;
      })
      .map((item) => item.product_color_id)
      .filter(Boolean) as number[];
  }, [existingItems, editMode, itemToEdit]);

  useEffect(() => {
    if (itemToEdit && editMode) {
      form.reset({
        product_color_id: itemToEdit.product_color_id || 0,
        product_variant_id: +productVariant?.id,
        is_available: itemToEdit.is_available || false,
        price: itemToEdit.price || 0,
      });
    } else {
      form.reset({
        product_color_id: 0,
        product_variant_id: +productVariant?.id,
        is_available: false,
        price: 0,
      });
    }
    setUseBasePrice(false);
  }, [itemToEdit, editMode, form, open, productVariant]);

  // Handle base price toggle
  const handleBasePriceToggle = (checked: boolean) => {
    setUseBasePrice(checked);
    if (checked && productVariant?.base_price) {
      form.setValue("price", productVariant.base_price);
    } else if (!checked) {
      form.setValue("price", 0);
    }
  };

  const onSubmit = async (data: ProductItemInputType) => {
    setIsSubmitting(true);

    try {
      const isDuplicate = existingItems.some((item) => {
        if (editMode && itemToEdit && item.id === itemToEdit.id) {
          return false;
        }
        return item.product_color_id === data.product_color_id;
      });

      if (isDuplicate) {
        toast.error("Màu này đã được thêm cho phiên bản này!");
        return;
      }

      let response;
      if (editMode && itemToEdit) {
        response = await updateProductItem(String(itemToEdit.id), data);
      } else {
        response = await createProductItem(data);
      }

      if (response.success) {
        toast.success(
          response.message ||
            (editMode
              ? "Cập nhật phân loại thành công"
              : "Thêm phân loại thành công")
        );
        setOpen(false);
        onSuccess?.();
      } else {
        toast.error(
          response.message ||
            (editMode ? "Lỗi cập nhật phân loại" : "Lỗi thêm phân loại")
        );
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SimpleModal
      open={open}
      onClose={() => setOpen(false)}
      title={
        editMode
          ? `Sửa phân loại của "${productVariant?.name}"`
          : `Thêm phân loại cho "${productVariant?.name}"`
      }
      className="max-w-xl bg-white"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <RadioColor
            control={form.control}
            name="product_color_id"
            label="Chọn màu sắc"
            options={productColors}
            disabledValues={disabledColorIds}
            isRequired={true}
          />

          <FormField
            control={form.control}
            name="is_available"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trạng thái</FormLabel>
                <FormControl>
                  <div className="w-full p-3 border border-gray-200 rounded-md bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isLoadingColors}
                          className={`data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-red-500 ${
                            field.value
                              ? "data-[state=checked]:border-green-600"
                              : "data-[state=unchecked]:border-red-500"
                          }`}
                        />
                        <div className="flex flex-col">
                          <Label
                            className={`text-sm font-medium ${
                              field.value ? "text-green-700" : "text-red-700"
                            }`}
                          >
                            {field.value ? "Còn hàng" : "Hết hàng"}
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          <div className="grid grid-cols-12 gap-3 items-end">
            <div className="col-span-8">
              <CustomInput
                control={form.control}
                name="price"
                label="Giá bán"
                placeholder="Nhập giá bán"
                type="number"
                isRequired={true}
                disabled={isLoadingColors || useBasePrice}
              />
            </div>

            <div className="col-span-4">
              <div className="bg-white border border-gray-200 rounded-md p-2 h-fit">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="use-base-price"
                    checked={useBasePrice}
                    onCheckedChange={handleBasePriceToggle}
                    disabled={isLoadingColors || !productVariant?.base_price}
                  />
                  <div className="flex-1">
                    <Label
                      htmlFor="use-base-price"
                      className="text-xs font-medium text-gray-700"
                    >
                      Lấy từ phiên bản
                    </Label>
                    {productVariant?.base_price && (
                      <div className="text-xs text-green-600 font-medium">
                        {productVariant.base_price.toLocaleString("vi-VN")}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <FormActions
            loading={isSubmitting || isLoadingColors}
            onCancel={() => setOpen(false)}
          />
        </form>
      </Form>
    </SimpleModal>
  );
};

// Hook
interface ProductItemFormModalState {
  isOpen: boolean;
  itemToEdit: ProductItemWithDetails | null;
  isEditMode: boolean;
  existingItems: ProductItemWithDetails[];
  productVariant?: ProductVariantType;
  onSuccess?: () => void;
  openModal: (params: {
    itemToEdit?: ProductItemWithDetails | null;
    isEditMode?: boolean;
    existingItems: ProductItemWithDetails[];
    onSuccess?: () => void;
    productVariant: ProductVariantType | undefined;
  }) => void;
  closeModal: () => void;
}

export const useProductItemFormModal = create<ProductItemFormModalState>(
  (set) => ({
    isOpen: false,
    itemToEdit: null,
    isEditMode: false,
    existingItems: [],
    onSuccess: undefined,

    productVariant: undefined,
    openModal: ({
      itemToEdit = null,
      isEditMode = false,
      existingItems,
      onSuccess,
      productVariant = undefined,
    }) =>
      set({
        isOpen: true,
        itemToEdit,
        isEditMode,
        existingItems,
        onSuccess,
        productVariant,
      }),
    closeModal: () =>
      set({
        isOpen: false,
        itemToEdit: null,
        isEditMode: false,
        existingItems: [],
        onSuccess: undefined,
        productVariant: undefined,
      }),
  })
);

// Provider
export default function ProductItemFormProvider() {
  const {
    isOpen,
    itemToEdit,
    isEditMode,
    existingItems,
    onSuccess,
    closeModal,
    productVariant,
  } = useProductItemFormModal();

  return (
    <ProductItemForm
      open={isOpen}
      setOpen={(open) => !open && closeModal()}
      itemToEdit={itemToEdit}
      editMode={isEditMode}
      existingItems={existingItems}
      onSuccess={onSuccess}
      productVariant={productVariant!}
    />
  );
}

// Named exports for individual use
export { ProductItemFormProvider };
