"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { OrderType, OrderInputType, orderInputSchema } from "@/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui-shadcn/form";
import CustomInput from "@/components/ui-shared/input-custom";
import SelectWithSearch from "@/components/ui-shared/select-with-search";

import { useAddressStore } from "@/stores/province-ward-store";
import FormActions from "@/app/admin/_components/features/form-actions";
import { RadioGroup, RadioGroupItem } from "@/components/ui-shadcn/radio-group";
import { Label } from "@/components/ui-shadcn/label";
import { cn } from "@/libs/utils";
import SimpleModal from "@/app/admin/_components/features/simple-modal";
import { createOrder, updateOrder } from "@/apis";

interface Props {
  order: OrderType | null;
  onSuccess?: () => void;
  editMode?: boolean;
  setOpen: (open: boolean) => void;
  open: boolean;
}

const DEFAULT_VALUES: OrderInputType = {
  customer_name: "",
  customer_phone: "",
  street: "",
  province: "",
  ward: "",
  status_id: 1,
};

const OrderForm = ({
  order,
  onSuccess,
  editMode = false,
  setOpen,
  open,
}: Props) => {
  const [initialAddressLoaded, setInitialAddressLoaded] = useState(false);

  // Use the address store
  const {
    provinces,
    currentWards,
    fetchAddressData,
    getWardsForProvince,
    clearWards,
    isLoading: isAddressLoading,
  } = useAddressStore();

  // Form initialization
  const form = useForm<OrderInputType>({
    resolver: zodResolver(orderInputSchema),
    defaultValues: DEFAULT_VALUES,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: OrderInputType) => createOrder(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success(response.message || "Tạo đơn hàng thành công");
        setOpen(false);
        onSuccess?.();
      } else {
        toast.error(response.message || "Lỗi tạo đơn hàng");
      }
    },
    onError: (error) => {
      console.error("Error creating order:", error);
      toast.error("Lỗi server");
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: OrderInputType }) =>
      updateOrder(id, data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success(response.message || "Cập nhật đơn hàng thành công");
        onSuccess?.();
      } else {
        toast.error(response.message || "Lỗi cập nhật đơn hàng");
      }
    },
    onError: (error) => {
      console.error("Error updating order:", error);
      toast.error("Lỗi server");
    },
  });

  // Load address data on component mount
  useEffect(() => {
    fetchAddressData();
  }, [fetchAddressData]);

  // Load wards if province is already selected (from persisted data)
  useEffect(() => {
    if (provinces.length > 0) {
      const currentProvince = form.getValues().province;
      if (currentProvince) {
        getWardsForProvince(currentProvince);
      }
    }
  }, [provinces, form, getWardsForProvince]);

  // Handle province change
  const handleProvinceChange = (provinceId: string) => {
    // Clear ward selection when province changes
    form.setValue("ward", "");
    clearWards();

    // Load wards for selected province (now synchronous)
    if (provinceId) {
      getWardsForProvince(provinceId);
    }
  };

  const statusOptions = [
    {
      value: 1,
      label: "Đang chờ",
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      value: 2,
      label: "Đã xác nhận",
      color: "bg-blue-100 text-blue-800",
    },
    {
      value: 3,
      label: "Đã giao",
      color: "bg-green-100 text-green-800",
    },
  ];

  // Load address data when editing an order
  useEffect(() => {
    setInitialAddressLoaded(false);

    if (editMode && order) {
      form.reset({
        customer_name: order.customer_name || "",
        customer_phone: order.customer_phone || "",
        street: order.street || "",
        province: order.province || "",
        ward: order.ward || "",
        status_id: order.status_id || 1,
      });

      // If editing and province exists, load wards directly
      if (order.province) {
        getWardsForProvince(order.province);
      }

      setInitialAddressLoaded(true);
    } else if (!editMode || !order) {
      form.reset(DEFAULT_VALUES);
      clearWards();
      setInitialAddressLoaded(true);
    }
  }, [
    editMode,
    order,
    provinces.length,
    form,
    getWardsForProvince,
    clearWards,
  ]);

  const onSubmit = async (data: OrderInputType) => {
    if (editMode && order) {
      updateMutation.mutate({ id: order.id.toString(), data });
    } else {
      createMutation.mutate(data);
    }
  };

  // Combine loading states
  const isFormDisabled =
    createMutation.isPending ||
    updateMutation.isPending ||
    isAddressLoading ||
    !initialAddressLoaded;

  return (
    <SimpleModal
      open={open}
      onClose={() => setOpen(false)}
      title={
        editMode
          ? `Sửa đơn hàng ${order?.id ? `#${order.id}` : ""}`
          : "Thêm đơn hàng"
      }
      className="max-w-4xl bg-card"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <CustomInput
              control={form.control}
              name="customer_name"
              label="Tên khách hàng"
              placeholder="Nhập tên khách hàng"
              disabled={isFormDisabled}
              isRequired
            />

            <CustomInput
              control={form.control}
              name="customer_phone"
              label="Số điện thoại"
              placeholder="Nhập số điện thoại"
              disabled={isFormDisabled}
              isRequired
            />
          </div>

          {/* Updated address fields for 2-level structure */}
          <div className="flex flex-col sm:flex-row gap-3">
            <SelectWithSearch
              control={form.control}
              name="province"
              label="Tỉnh/Thành phố"
              options={provinces}
              title="Chọn tỉnh/thành phố"
              placeholder="Chọn tỉnh/thành phố"
              disabled={isFormDisabled}
              onChange={(value) => handleProvinceChange(value)}
              className="w-full"
              isRequired
            />

            <SelectWithSearch
              control={form.control}
              name="ward"
              label="Phường/Xã"
              options={currentWards}
              title="Chọn phường/xã"
              placeholder="Chọn phường/xã"
              disabled={isFormDisabled || !form.getValues().province}
              className="w-full"
              isRequired
            />
          </div>

          <CustomInput
            control={form.control}
            name="street"
            label="Số nhà, tên đường"
            placeholder="Số nhà, tên đường"
            disabled={isFormDisabled}
            isRequired
          />

          <div className="space-y-2">
            <Label>Trạng thái đơn hàng</Label>
            <FormField
              control={form.control}
              name="status_id"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value.toString()}
                      className="grid grid-cols-1 sm:grid-cols-3 gap-3"
                      disabled={isFormDisabled}
                    >
                      {statusOptions.map((option) => (
                        <div key={option.value}>
                          <RadioGroupItem
                            value={option.value.toString()}
                            id={option.value.toString()}
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor={option.value.toString()}
                            className={cn(
                              "flex items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer",
                              option.color
                            )}
                          >
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormActions
            onCancel={() => setOpen(false)}
            loading={createMutation.isPending || updateMutation.isPending}
            className="mt-4"
          />
        </form>
      </Form>
    </SimpleModal>
  );
};

export default OrderForm;
