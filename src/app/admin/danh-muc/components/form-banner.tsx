"use client";

import { toast } from "react-hot-toast";
import { BannerInputType, bannerInputSchema, BannerType } from "@/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createBanner, updateBanner } from "@/apis";
import { Form } from "@/components/ui-shadcn/form";
import { useEffect, useState } from "react";
import CustomInput from "@/components/ui-shared/input-custom";
import SimpleModal from "@/app/admin/_components/features/simple-modal";
import InputImage from "@/app/admin/_components/ui/input-image";
import FormActions from "@/app/admin/_components/features/form-actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  itemToEdit?: BannerType | null;
  onSuccess?: () => void;
  editMode?: boolean;
  categoryId: number;
};

const DEFAULT_VALUES: BannerInputType = {
  desktop_image: "",
  mobile_image: "",
  direct_link: "",
  category_id: null,
  order_number: 0,
};

const BannerFormModal = ({
  open,
  setOpen,
  itemToEdit,
  onSuccess,
  editMode = false,
  categoryId,
}: Props) => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [desktopFile, setDesktopFile] = useState<File | null>(null);
  const [mobileFile, setMobileFile] = useState<File | null>(null);

  const createMutation = useMutation({
    mutationFn: ({
      data,
      desktopFile,
      mobileFile,
    }: {
      data: BannerInputType;
      desktopFile: File | null;
      mobileFile: File | null;
    }) => createBanner(data, desktopFile, mobileFile),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Đã thêm");
        setOpen(false);
        queryClient.invalidateQueries({ queryKey: ["banners"] });
        onSuccess?.();
      } else {
        toast.error("Lỗi thêm");
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
    mutationFn: ({
      id,
      data,
      desktopFile,
      mobileFile,
      oldDesktopImage,
      oldMobileImage,
    }: {
      id: string;
      data: BannerInputType;
      desktopFile: File | null;
      mobileFile: File | null;
      oldDesktopImage: string | null;
      oldMobileImage: string | null;
    }) =>
      updateBanner(
        id,
        data,
        desktopFile,
        mobileFile,
        oldDesktopImage,
        oldMobileImage
      ),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Đã cập nhật");
        setOpen(false);
        queryClient.invalidateQueries({ queryKey: ["banners"] });
        onSuccess?.();
      } else {
        toast.error("Lỗi cập nhật");
      }
    },
    onError: () => {
      toast.error("Lỗi server");
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const form = useForm<BannerInputType>({
    resolver: zodResolver(bannerInputSchema),
    defaultValues: {
      ...DEFAULT_VALUES,
      category_id: categoryId,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset(
        editMode && itemToEdit
          ? {
              desktop_image: itemToEdit.desktop_image || "",
              mobile_image: itemToEdit.mobile_image || "",
              direct_link: itemToEdit.direct_link || "",
              category_id: itemToEdit.category_id || categoryId,
              order_number: itemToEdit.order_number || 0,
            }
          : {
              ...DEFAULT_VALUES,
              category_id: categoryId,
            }
      );
      setDesktopFile(null);
      setMobileFile(null);
    }
  }, [open, editMode, itemToEdit, form, categoryId]);

  const onSubmit = async (data: BannerInputType) => {
    setLoading(true);
    if (editMode && itemToEdit) {
      updateMutation.mutate({
        id: itemToEdit.id.toString(),
        data,
        desktopFile,
        mobileFile,
        oldDesktopImage: itemToEdit.desktop_image,
        oldMobileImage: itemToEdit.mobile_image,
      });
    } else {
      createMutation.mutate({
        data,
        desktopFile,
        mobileFile,
      });
    }
  };

  const handleDesktopChange = (file: File | null) => {
    setDesktopFile(file);
  };

  const handleMobileChange = (file: File | null) => {
    setMobileFile(file);
  };

  return (
    <SimpleModal
      open={open}
      onClose={() => setOpen(false)}
      title={editMode ? `Sửa banner "#${itemToEdit?.id}"` : "Thêm banner"}
      className="max-w-3xl bg-white"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <InputImage
            control={form.control}
            name="desktop_image"
            label="Desktop Banner"
            onFileChange={handleDesktopChange}
            folder="banners"
            size="w-full"
          />

          <InputImage
            control={form.control}
            name="mobile_image"
            label="Mobile Banner"
            onFileChange={handleMobileChange}
            folder="banners"
            size="w-80 h-80"
          />

          <CustomInput
            control={form.control}
            name="direct_link"
            label="Link chuyển hướng"
            placeholder="Nhập link chuyển hướng khi click vào banner"
            disabled={loading}
          />
          <CustomInput
            control={form.control}
            name="order_number"
            label="Thứ tự hiển thị"
            type="number"
            placeholder="Nhập số thứ tự hiển thị"
            disabled={loading}
          />
          <FormActions
            loading={loading}
            onCancel={() => setOpen(false)}
            className="mt-4"
          ></FormActions>
        </form>
      </Form>
    </SimpleModal>
  );
};

export default BannerFormModal;
