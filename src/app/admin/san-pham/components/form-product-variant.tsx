"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { create } from "zustand";

import {
  ProductVariantType,
  productVariantInputSchema,
  ProductVariantInputType,
} from "@/schemas";
import { createProductVariant, updateProductVariant } from "@/apis";

import { Form } from "@/components/ui-shadcn/form";
import CustomInput from "@/components/ui-shared/input-custom";
import InputImage from "@/app/admin/_components/ui/input-image";
import FormActions from "@/app/admin/_components/features/form-actions";
import { generateSlug } from "@/libs/utils";
import SimpleModal from "@/app/admin/_components/features/simple-modal";

const DEFAULT_VALUES: ProductVariantInputType = {
  name: "",
  slug: "",
  thumbnail: "",
  listed_price: 0,
  base_price: 0,
  product_id: null,
  variant: "",
};

// Component
type ProductVariantFormProps = {
  productVariant?: ProductVariantType | null;
  onSuccess?: (data: ProductVariantType) => void;
  editMode?: boolean;
  open?: boolean;
  setOpen?: (open: boolean) => void;
  productId?: string;
};

export const ProductVariantForm = ({
  productVariant,
  onSuccess,
  editMode = false,
  open = false,
  setOpen = () => {},
  productId,
}: ProductVariantFormProps) => {
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [oldThumbnailUrl, setOldThumbnailUrl] = useState<string | null>(null);

  const form = useForm<ProductVariantInputType>({
    resolver: zodResolver(productVariantInputSchema),
    defaultValues: DEFAULT_VALUES,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: ({
      data,
      file,
    }: {
      data: ProductVariantInputType;
      file: File | null;
    }) => createProductVariant(data, file),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Thêm phiên bản sản phẩm thành công");
        setOpen(false);
        onSuccess?.(response.data);
      } else {
        toast.error(response.message || "Lỗi thêm phiên bản sản phẩm");
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
      file,
      currentUrl,
    }: {
      id: string;
      data: ProductVariantInputType;
      file: File | null;
      currentUrl: string | null;
    }) => updateProductVariant(id, data, file, currentUrl),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Cập nhật phiên bản sản phẩm thành công");
        setOpen(false);
        onSuccess?.(response.data);
      } else {
        toast.error(response.message || "Lỗi cập nhật phiên bản sản phẩm");
      }
    },
    onError: () => {
      toast.error("Lỗi server");
    },
  });

  useEffect(() => {
    if (productVariant && editMode) {
      // Store the original thumbnail URL for potential deletion
      if (productVariant.thumbnail) {
        setOldThumbnailUrl(productVariant.thumbnail);
      }

      form.reset({
        name: productVariant.name,
        slug: productVariant.slug,
        thumbnail: productVariant.thumbnail || "",
        listed_price: productVariant.listed_price || 0,
        base_price: productVariant.base_price || 0,
        product_id: productVariant.product_id,
        variant: productVariant.variant || "",
      });
    } else {
      setOldThumbnailUrl(null);
      form.reset({
        ...DEFAULT_VALUES,
        product_id: productId ? parseInt(productId) : null,
      });
    }
    setThumbnailFile(null);
  }, [productVariant, form, editMode, productId]);

  const handleFileChange = (file: File | null) => {
    setThumbnailFile(file);
  };

  const handleNameChange = (value: string) => {
    form.setValue("name", value);
    form.setValue("slug", generateSlug(value));
  };

  const onSubmit = async (data: ProductVariantInputType) => {
    if (editMode && productVariant) {
      updateMutation.mutate({
        id: String(productVariant.id),
        data,
        file: thumbnailFile,
        currentUrl: oldThumbnailUrl,
      });
    } else {
      createMutation.mutate({
        data,
        file: thumbnailFile,
      });
    }
  };

  return (
    <SimpleModal
      open={open}
      onClose={() => setOpen(false)}
      title={
        editMode ? `Sửa phiên bản "${productVariant?.name}"` : "Thêm phiên bản"
      }
      className="max-w-2xl bg-card"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-3 overflow-hidden"
        >
          <div className="space-y-3 mt-1">
            <InputImage
              control={form.control}
              name="thumbnail"
              label="Ảnh đại diện"
              folder="product-items"
              onFileChange={handleFileChange}
              size="w-[120px] h-[120px]"
            />

            <CustomInput
              control={form.control}
              name="name"
              label="Tên phiên bản sản phẩm"
              placeholder="Nhập tên phiên bản sản phẩm"
              isRequired={true}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full"
            />

            <CustomInput
              control={form.control}
              name="slug"
              label="Slug"
              placeholder="Nhập slug"
              isRequired={true}
              className="w-full"
            />
            <CustomInput
              control={form.control}
              name="variant"
              label="Phiên bản"
              placeholder="Nhập phiên bản"
              isRequired={true}
            />

            <CustomInput
              control={form.control}
              name="listed_price"
              label="Giá niêm yết"
              placeholder="Nhập giá niêm yết sản phẩm"
              type="number"
              isRequired={true}
            />
            <CustomInput
              control={form.control}
              name="base_price"
              label="Giá bán từ"
              placeholder="Nhập giá bán từ sản phẩm"
              type="number"
              isRequired={true}
            />
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
interface ProductVariantFormModalState {
  isOpen: boolean;
  productId: string;
  productVariant: ProductVariantType | null;
  isEditMode: boolean;
  onSuccess?: () => void;
  openModal: (params: {
    productId: string;
    productVariant?: ProductVariantType | null;
    isEditMode?: boolean;
    onSuccess?: () => void;
  }) => void;
  closeModal: () => void;
}

export const useProductVariantFormModal = create<ProductVariantFormModalState>(
  (set) => ({
    isOpen: false,
    productId: "",
    productVariant: null,
    isEditMode: false,
    onSuccess: undefined,
    openModal: ({
      productId,
      productVariant = null,
      isEditMode = false,
      onSuccess,
    }) =>
      set({
        isOpen: true,
        productId,
        productVariant,
        isEditMode,
        onSuccess,
      }),
    closeModal: () =>
      set({
        isOpen: false,
        productId: "",
        productVariant: null,
        isEditMode: false,
        onSuccess: undefined,
      }),
  })
);

// Provider
export default function ProductVariantFormProvider() {
  const {
    isOpen,
    productId,
    productVariant,
    isEditMode,
    onSuccess,
    closeModal,
  } = useProductVariantFormModal();

  return (
    <ProductVariantForm
      open={isOpen}
      setOpen={(open) => !open && closeModal()}
      productId={productId}
      productVariant={productVariant}
      editMode={isEditMode}
      onSuccess={onSuccess}
    />
  );
}

// Named exports for individual use
export { ProductVariantFormProvider };
