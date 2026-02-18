"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { create } from "zustand";

import {
  OrderItemInputRequestType,
  OrderItemWithDetailType,
  orderItemInputRequestSchema,
} from "@/schemas";
import { createOrderItem, updateOrderItem, getAllProductItems } from "@/apis";

import { Form } from "@/components/ui-shadcn/form";
import CustomInput from "@/components/ui-shared/input-custom";
import SelectWithSearch from "@/components/ui-shared/select-with-search";
import FormActions from "@/app/admin/_components/features/form-actions";
import SimpleModal from "@/app/admin/_components/features/simple-modal";

const DEFAULT_VALUES: OrderItemInputRequestType = {
  order_id: 0,
  product_item_id: 0,
  quantity: 1,
};

// Component
type OrderItemFormProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSuccess?: () => void;
  isEdit?: boolean;
  orderId: number;
  itemToEdit?: OrderItemWithDetailType | null;
};

export const OrderItemForm = ({
  open,
  setOpen,
  onSuccess,
  isEdit = false,
  orderId,
  itemToEdit,
}: OrderItemFormProps) => {
  const [selectedProductItem, setSelectedProductItem] = useState<any>(null);
  const [availableColors, setAvailableColors] = useState<
    { value: string; label: string }[]
  >([]);

  // Form setup with validation
  const form = useForm<OrderItemInputRequestType>({
    resolver: zodResolver(orderItemInputRequestSchema),
    defaultValues: {
      ...DEFAULT_VALUES,
      order_id: orderId,
    },
  });

  // Fetch product items using tanstack-query
  const { data: productItemsResponse, isLoading: loadingProducts } = useQuery({
    queryKey: ["productItems"],
    queryFn: () => getAllProductItems({ pageSize: 100 }),
    enabled: open, // Only fetch when the modal is open
  });

  // Transform product items for the select component using useMemo
  const productItemOptions = useMemo(() => {
    if (!productItemsResponse?.data) return [];
    return productItemsResponse.data.map((item: any) => ({
      value: item.id.toString(),
      label: `${item.product_variants.name} ${
        item.product_variants.variant || ""
      } - ${
        item.product_colors.color_name || "No Color"
      } - ${item.price.toLocaleString()} VND`,
      data: item,
    }));
  }, [productItemsResponse?.data]);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: OrderItemInputRequestType) => createOrderItem(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success(
          response.message || "Thêm sản phẩm vào đơn hàng thành công"
        );
        setOpen(false);
        onSuccess?.();
      } else {
        toast.error(response.message || "Lỗi thêm sản phẩm vào đơn hàng");
      }
    },
    onError: (error) => {
      console.error("Error creating order item:", error);
      toast.error("Lỗi server");
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: OrderItemInputRequestType;
    }) => updateOrderItem(id, data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success(
          response.message || "Cập nhật sản phẩm trong đơn hàng thành công"
        );
        setOpen(false);
        onSuccess?.();
      } else {
        toast.error(response.message || "Lỗi cập nhật sản phẩm trong đơn hàng");
      }
    },
    onError: (error) => {
      console.error("Error updating order item:", error);
      toast.error("Lỗi server");
    },
  });

  // Handle editing an existing order item
  useEffect(() => {
    if (!open) return;

    if (itemToEdit && isEdit) {
      // Find the product item in our loaded list
      const productItem = productItemOptions.find(
        (item) => item.value === itemToEdit.product_item_id?.toString()
      );

      if (productItem?.data) {
        setSelectedProductItem(productItem.data);
      }

      form.reset({
        order_id: itemToEdit.order_id || orderId,
        product_item_id: Number(itemToEdit.product_item_id) || undefined,
        quantity: itemToEdit.quantity,
      });
    } else {
      form.reset({
        ...DEFAULT_VALUES,
        order_id: orderId,
      });
      setSelectedProductItem(null);
      setAvailableColors([]);
    }
  }, [open, itemToEdit, isEdit, orderId, form, productItemOptions]);

  const onSubmit = async (data: OrderItemInputRequestType) => {
    if (isEdit && itemToEdit && itemToEdit.id) {
      updateMutation.mutate({ id: itemToEdit?.id.toString(), data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <SimpleModal
      open={open}
      onClose={() => setOpen(false)}
      title={
        isEdit
          ? `Sửa sản phẩm "${itemToEdit?.id}" trong đơn hàng #${orderId}`
          : `Thêm sản phẩm vào đơn hàng #${orderId}`
      }
      className="max-w-2xl bg-card"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <SelectWithSearch
            control={form.control}
            name="product_item_id"
            label="Sản phẩm"
            options={productItemOptions}
            title="Chọn sản phẩm"
            placeholder="Tìm kiếm sản phẩm..."
            isRequired
            disabled={loadingProducts}
            isNumeric={true}
          />

          <div className="sm:flex-row flex flex-col gap-3">
            <CustomInput
              control={form.control}
              name="quantity"
              label="Số lượng"
              placeholder="Nhập số lượng"
              type="number"
              isRequired
            />
          </div>

          <FormActions
            loading={
              createMutation.isPending ||
              updateMutation.isPending ||
              loadingProducts
            }
            onCancel={() => setOpen(false)}
          />
        </form>
      </Form>
    </SimpleModal>
  );
};

// Hook
interface OrderItemFormModalState {
  isOpen: boolean;
  orderId: number;
  orderItem: OrderItemWithDetailType | null;
  isEditMode: boolean;
  onSuccess?: () => void;
  openModal: (params: {
    orderId: number;
    orderItem?: OrderItemWithDetailType | null;
    isEditMode?: boolean;
    onSuccess?: () => void;
  }) => void;
  closeModal: () => void;
}

export const useOrderItemFormModal = create<OrderItemFormModalState>((set) => ({
  isOpen: false,
  orderId: 0,
  orderItem: null,
  isEditMode: false,
  onSuccess: undefined,
  openModal: ({ orderId, orderItem = null, isEditMode = false, onSuccess }) =>
    set({
      isOpen: true,
      orderId,
      orderItem,
      isEditMode,
      onSuccess,
    }),
  closeModal: () =>
    set({
      isOpen: false,
      orderId: 0,
      orderItem: null,
      isEditMode: false,
      onSuccess: undefined,
    }),
}));

// Provider
export default function OrderItemFormProvider() {
  const { isOpen, orderId, orderItem, isEditMode, onSuccess, closeModal } =
    useOrderItemFormModal();

  return (
    <OrderItemForm
      open={isOpen}
      setOpen={(open) => !open && closeModal()}
      orderId={orderId}
      itemToEdit={orderItem}
      isEdit={isEditMode}
      onSuccess={onSuccess}
    />
  );
}

// Named exports for individual use
export { OrderItemFormProvider };
