"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { create } from "zustand";

import {
  ProductColorInputTypeFrontend,
  ProductColorInputType,
  ProductColorType,
  productColorInputSchemaFrontend,
} from "@/schemas";
import { createProductColor, updateProductColor } from "@/apis";

import FormActions from "@/app/admin/_components/features/form-actions";
import { Form } from "@/components/ui-shadcn/form";
import SimpleModal from "@/app/admin/_components/features/simple-modal";
import CustomInput from "@/components/ui-shared/input-custom";
import InputImage from "@/app/admin/_components/ui/input-image";
import InputImageMultiple from "@/app/admin/_components/ui/input-image-multiple";

// Hook
interface ProductColorFormModalState {
  isOpen: boolean;
  productId: string;
  itemToEdit: ProductColorType | null;
  isEditMode: boolean;
  onSuccess?: () => void;
  openModal: (params: {
    productId: string;
    itemToEdit?: ProductColorType | null;
    isEditMode?: boolean;
    onSuccess?: () => void;
  }) => void;
  closeModal: () => void;
}

export const useProductColorFormModal = create<ProductColorFormModalState>(
  (set) => ({
    isOpen: false,
    productId: "",
    itemToEdit: null,
    isEditMode: false,
    onSuccess: undefined,
    openModal: ({
      productId,
      itemToEdit = null,
      isEditMode = false,
      onSuccess,
    }) =>
      set({
        isOpen: true,
        productId,
        itemToEdit,
        isEditMode,
        onSuccess,
      }),
    closeModal: () =>
      set({
        isOpen: false,
        productId: "",
        itemToEdit: null,
        isEditMode: false,
        onSuccess: undefined,
      }),
  })
);

// Component
type ColorImagesFormProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSuccess?: () => void;
  editMode?: boolean;
  productId: string;
  itemToEdit?: ProductColorType | null;
};

const DEFAULT_VALUES: ProductColorInputTypeFrontend = {
  color_name: "",
  thumbnail: "",
  images: [],
  product_id: 0,
};

export const ColorImagesForm = ({
  open,
  setOpen,
  onSuccess,
  editMode = false,
  productId,
  itemToEdit,
}: ColorImagesFormProps) => {
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [removedImageUrls, setRemovedImageUrls] = useState<string[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);

  const form = useForm<ProductColorInputTypeFrontend>({
    resolver: zodResolver(productColorInputSchemaFrontend),
    defaultValues: DEFAULT_VALUES,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: ({
      data,
      thumbnailFile,
      additionalImages,
    }: {
      data: ProductColorInputType;
      thumbnailFile: File | null;
      additionalImages: File[] | null;
    }) => createProductColor(data, thumbnailFile, additionalImages),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Thêm màu sắc thành công");
        setOpen(false);
        onSuccess?.();
      } else {
        toast.error(response.message || "Lỗi thêm màu sắc");
      }
    },
    onError: () => {
      toast.error("Lỗi server");
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
      thumbnailFile,
      oldThumbnailUrl,
      additionalImages,
      removedImageUrls,
    }: {
      id: string;
      data: ProductColorInputType;
      thumbnailFile: File | null;
      oldThumbnailUrl: string | null;
      additionalImages: File[] | null;
      removedImageUrls: string[] | null;
    }) =>
      updateProductColor(
        id,
        data,
        thumbnailFile,
        oldThumbnailUrl,
        additionalImages,
        removedImageUrls
      ),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Cập nhật màu sắc thành công");
        setOpen(false);
        onSuccess?.();
      } else {
        toast.error(response.message || "Lỗi cập nhật màu sắc");
      }
    },
    onError: () => {
      toast.error("Lỗi server");
    },
  });

  useEffect(() => {
    if (open) {
      if (editMode && itemToEdit) {
        form.reset({
          color_name: itemToEdit.color_name,
          thumbnail: itemToEdit.thumbnail || "",
          images:
            itemToEdit.images?.map((url) => ({
              url,
              isNew: false,
            })) || [],
          product_id: itemToEdit.product_id,
        });
      } else {
        form.reset({
          ...DEFAULT_VALUES,
          product_id: parseInt(productId),
        });
      }
      setThumbnailFile(null);
      setRemovedImageUrls([]);
      setNewImageFiles([]);
    }
  }, [open, editMode, itemToEdit, form, productId]);

  const onSubmit = (data: ProductColorInputTypeFrontend) => {
    const existingImageUrls = data.images
      .filter((img) => !img.isNew)
      .map((img) => img.url);

    const imagesToUpload = newImageFiles;

    if (editMode && itemToEdit) {
      updateMutation.mutate({
        id: String(itemToEdit.id),
        data: { ...data, images: existingImageUrls },
        thumbnailFile,
        oldThumbnailUrl: itemToEdit.thumbnail || null,
        additionalImages: imagesToUpload.length > 0 ? imagesToUpload : null,
        removedImageUrls: removedImageUrls.length > 0 ? removedImageUrls : null,
      });
    } else {
      createMutation.mutate({
        data: { ...data, images: existingImageUrls },
        thumbnailFile,
        additionalImages: imagesToUpload.length > 0 ? imagesToUpload : null,
      });
    }
  };

  return (
    <SimpleModal
      open={open}
      onClose={() => setOpen(false)}
      title={
        editMode ? `Sửa màu sắc "${itemToEdit?.color_name}"` : "Thêm màu sắc"
      }
      className="max-w-xl bg-card"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <CustomInput
            control={form.control}
            name="color_name"
            label="Tên màu sắc"
            placeholder="Nhập tên màu sắc"
            isRequired
          />

          <InputImage
            control={form.control}
            name="thumbnail"
            label="Ảnh đại diện"
            onFileChange={setThumbnailFile}
            folder="color-thumbnails"
            size="w-[170px] h-[170px]"
          />

          <InputImageMultiple
            control={form.control}
            name="images"
            label="Danh sách ảnh"
            onFilesChange={setNewImageFiles}
            onRemovedUrls={setRemovedImageUrls}
            folder="color-images"
          />

          <FormActions
            loading={updateMutation.isPending || createMutation.isPending}
            onCancel={() => setOpen(false)}
          />
        </form>
      </Form>
    </SimpleModal>
  );
};

// Provider
export default function ProductColorFormProvider() {
  const { isOpen, productId, itemToEdit, isEditMode, onSuccess, closeModal } =
    useProductColorFormModal();

  return (
    <ColorImagesForm
      open={isOpen}
      setOpen={(open) => !open && closeModal()}
      productId={productId}
      itemToEdit={itemToEdit}
      editMode={isEditMode}
      onSuccess={onSuccess}
    />
  );
}

// Named exports for individual use
export { ProductColorFormProvider };
