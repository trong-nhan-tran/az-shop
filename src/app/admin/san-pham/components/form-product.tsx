"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { useMutation, useQuery } from "@tanstack/react-query";

import {
  SubcategoryType,
  ProductType,
  ProductInputType,
  productInputSchema,
} from "@/schemas";
import { createProduct, updateProduct, getAllSubcategories } from "@/apis";

import RichTextEditor from "../../_components/text-editor/rich-text-editor";
import FormActions from "@/app/admin/_components/features/form-actions";

import { Form } from "@/components/ui-shadcn/form";

import CustomInput from "@/components/ui-shared/input-custom";
import { Label } from "@radix-ui/react-label";
import SelectWithSearch from "@/components/ui-shared/select-with-search";
import SimpleModal from "@/app/admin/_components/features/simple-modal";

type Props = {
  product?: ProductType | null;
  onSuccess?: () => void;
  editMode?: boolean;
  open?: boolean;
  setOpen?: (open: boolean) => void;
};

const DEFAULT_VALUES: ProductInputType = {
  name: "",
  subcategory_id: undefined,
  description: "",
};

export default function GeneralInfo({
  product,
  onSuccess,
  editMode = false,
  open = false,
  setOpen = () => {},
}: Props) {
  const [loading, setLoading] = useState(false);

  const form = useForm<ProductInputType>({
    resolver: zodResolver(productInputSchema),
    defaultValues: DEFAULT_VALUES,
  });

  // Fetch parent categories using tanstack-query
  const { data: subcategoryData, isLoading: loadingSubcategory } = useQuery({
    queryKey: ["subcategories"],
    queryFn: () => getAllSubcategories(),
    enabled: open, // Only fetch when modal is open
  });

  const subcategory: SubcategoryType[] = subcategoryData?.data || [];

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: ProductInputType) => createProduct(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Thêm sản phẩm thành công");
        setOpen(false);
        onSuccess?.();
      } else {
        console.error("Error creating product:", response.error);
        toast.error("Lỗi thêm sản phẩm");
      }
    },
    onError: (error) => {
      console.error("Error creating product:", error);
      toast.error("Lỗi server");
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ProductInputType }) =>
      updateProduct(id, data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Cập nhật sản phẩm thành công");
        setOpen(false);
        onSuccess?.();
      } else {
        console.error("Error updating product:", response.error);
        toast.error("Lỗi cập nhật sản phẩm");
      }
    },
    onError: (error) => {
      console.error("Error updating product:", error);
      toast.error("Lỗi server");
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  useEffect(() => {
    if (product && editMode) {
      form.reset({
        name: product.name,
        subcategory_id: product.subcategory_id || undefined,
        description: product.description || "",
      });
    } else {
      form.reset(DEFAULT_VALUES);
    }
  }, [product, form, editMode]);

  // Transform categories for the select component
  const subcategoryOptions = subcategory.map((subcategory) => ({
    value: String(subcategory.id),
    label: subcategory.name || "",
  }));

  const onSubmit = async (data: ProductInputType) => {
    setLoading(true);

    if (editMode && product) {
      updateMutation.mutate({
        id: product.id.toString(),
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
      title={
        editMode
          ? `Sửa sản phẩm "${product?.name ? `${product.name}` : ""}"`
          : "Thêm sản phẩm"
      }
      className="max-w-3xl bg-white"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-3 overflow-hidden"
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-row gap-4">
              <CustomInput
                control={form.control}
                name="name"
                label="Tên sản phẩm"
                placeholder="Nhập tên sản phẩm"
                isRequired={true}
              />

              <SelectWithSearch
                control={form.control}
                name="subcategory_id"
                label="Danh mục"
                options={subcategoryOptions}
                isNumeric={true}
                title="Chọn danh mục"
                className="w-full"
                disabled={loadingSubcategory}
              />
            </div>

            <div className="w-full">
              <Label className="text-sm font-medium">Mô tả sản phẩm</Label>
              <RichTextEditor
                value={form.watch("description") || ""}
                onChange={(content) => form.setValue("description", content)}
                placeholder="Nhập mô tả sản phẩm..."
              />
            </div>
          </div>

          <FormActions loading={loading} onCancel={() => setOpen(false)} />
        </form>
      </Form>
    </SimpleModal>
  );
}
