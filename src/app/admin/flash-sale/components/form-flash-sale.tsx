"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { create } from "zustand";

import {
  FlashSaleType,
  flashSaleInputSchema,
  FlashSaleInputType,
} from "@/schemas";
import { createFlashSale, updateFlashSale } from "@/apis";

import { Form } from "@/components/ui-shadcn/form";
import CustomInput from "@/components/ui-shared/input-custom";
import DateTimePicker from "@/components/ui-shared/datetime-picker";
import FormActions from "@/app/admin/_components/features/form-actions";
import SimpleModal from "@/app/admin/_components/features/simple-modal";
import { Checkbox } from "@/components/ui-shadcn/checkbox";
import { Label } from "@/components/ui-shadcn/label";

const DEFAULT_VALUES: FlashSaleInputType = {
  name: "",
  start_at: new Date(),
  end_at: new Date(),
  enable: false,
};

// Component
type FlashSaleFormProps = {
  flashSale?: FlashSaleType | null;
  onSuccess?: (data: FlashSaleType) => void;
  editMode?: boolean;
  open?: boolean;
  setOpen?: (open: boolean) => void;
};

export const FlashSaleForm = ({
  flashSale,
  onSuccess,
  editMode = false,
  open = false,
  setOpen = () => {},
}: FlashSaleFormProps) => {
  const form = useForm<FlashSaleInputType>({
    resolver: zodResolver(flashSaleInputSchema),
    defaultValues: DEFAULT_VALUES,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: FlashSaleInputType) => createFlashSale(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Thêm flash sale thành công");
        setOpen(false);
        onSuccess?.(response.data);
      } else {
        toast.error(response.message || "Lỗi thêm flash sale");
      }
    },
    onError: () => {
      toast.error("Lỗi server");
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: FlashSaleInputType }) =>
      updateFlashSale(id, data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Cập nhật flash sale thành công");
        setOpen(false);
        onSuccess?.(response.data);
      } else {
        toast.error(response.message || "Lỗi cập nhật flash sale");
      }
    },
    onError: () => {
      toast.error("Lỗi server");
    },
  });

  useEffect(() => {
    if (flashSale && editMode) {
      form.reset({
        name: flashSale.name || "",
        // Convert UTC timestamps to local Date objects
        start_at: flashSale.start_at ? new Date(flashSale.start_at) : undefined,
        end_at: flashSale.end_at ? new Date(flashSale.end_at) : undefined,
        enable: flashSale.enable || false,
      });
    } else {
      form.reset(DEFAULT_VALUES);
    }
  }, [flashSale, form, editMode]);

  const onSubmit = async (data: FlashSaleInputType) => {
    // Validate start_at < end_at (both are in local timezone)
    if (data.start_at && data.end_at && data.start_at >= data.end_at) {
      toast.error("Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc");
      return;
    }

    // Validate start_at is in the future
    if (data.start_at && data.start_at <= new Date()) {
      toast.error("Thời gian bắt đầu phải lớn hơn thời gian hiện tại");
      return;
    }

    // Data will be sent as Date objects, Prisma will handle timezone conversion
    if (editMode && flashSale) {
      updateMutation.mutate({
        id: String(flashSale.id),
        data,
      });
    } else {
      createMutation.mutate(data);
    }
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    // Add 1 minute to current time as minimum
    now.setMinutes(now.getMinutes() + 1);

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const getMinEndDateTime = () => {
    const startTime = form.watch("start_at");
    if (startTime) {
      const minEndTime = new Date(startTime);
      minEndTime.setMinutes(minEndTime.getMinutes() + 1);

      const year = minEndTime.getFullYear();
      const month = String(minEndTime.getMonth() + 1).padStart(2, "0");
      const day = String(minEndTime.getDate()).padStart(2, "0");
      const hours = String(minEndTime.getHours()).padStart(2, "0");
      const minutes = String(minEndTime.getMinutes()).padStart(2, "0");

      return `${year}-${month}-${day}T${hours}:${minutes}`;
    }
    return getCurrentDateTime();
  };

  return (
    <SimpleModal
      open={open}
      onClose={() => setOpen(false)}
      title={
        editMode ? `Sửa flash sale "${flashSale?.name}"` : "Thêm flash sale"
      }
      className="max-w-2xl bg-white"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-3 overflow-hidden"
        >
          <div className="space-y-3 mt-1">
            <CustomInput
              control={form.control}
              name="name"
              label="Tên flash sale"
              placeholder="Nhập tên flash sale"
              isRequired={true}
              className="w-full"
            />

            <div className="grid grid-cols-2 gap-4">
              <DateTimePicker
                control={form.control}
                name="start_at"
                label="Thời gian bắt đầu"
                isRequired={true}
                className="w-full"
                min={getCurrentDateTime()}
              />

              <DateTimePicker
                control={form.control}
                name="end_at"
                label="Thời gian kết thúc"
                isRequired={true}
                className="w-full"
                min={getMinEndDateTime()}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="enable"
                checked={form.watch("enable")}
                onCheckedChange={(checked) =>
                  form.setValue("enable", !!checked)
                }
              />
              <Label htmlFor="enable">Kích hoạt flash sale</Label>
            </div>

            {/* Display timezone info */}
            <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
              <strong>Lưu ý:</strong> Thời gian sẽ được lưu theo múi giờ{" "}
              <span className="font-mono">
                {Intl.DateTimeFormat().resolvedOptions().timeZone}
              </span>
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
interface FlashSaleFormModalState {
  isOpen: boolean;
  flashSale: FlashSaleType | null;
  isEditMode: boolean;
  onSuccess?: () => void;
  openModal: (params: {
    flashSale?: FlashSaleType | null;
    isEditMode?: boolean;
    onSuccess?: () => void;
  }) => void;
  closeModal: () => void;
}

export const useFlashSaleFormModal = create<FlashSaleFormModalState>((set) => ({
  isOpen: false,
  flashSale: null,
  isEditMode: false,
  onSuccess: undefined,
  openModal: ({ flashSale = null, isEditMode = false, onSuccess }) =>
    set({
      isOpen: true,
      flashSale,
      isEditMode,
      onSuccess,
    }),
  closeModal: () =>
    set({
      isOpen: false,
      flashSale: null,
      isEditMode: false,
      onSuccess: undefined,
    }),
}));

// Provider
export default function FlashSaleFormProvider() {
  const { isOpen, flashSale, isEditMode, onSuccess, closeModal } =
    useFlashSaleFormModal();

  return (
    <FlashSaleForm
      open={isOpen}
      setOpen={(open) => !open && closeModal()}
      flashSale={flashSale}
      editMode={isEditMode}
      onSuccess={onSuccess}
    />
  );
}

// Named exports for individual use
export { FlashSaleFormProvider };
