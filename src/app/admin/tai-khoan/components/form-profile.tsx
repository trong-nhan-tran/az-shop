"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { updateProfile } from "@/apis";
import {
  ProfileType,
  UpdateProfileInputType,
  updateProfileSchema,
} from "@/schemas";
import { Form } from "@/components/ui-shadcn/form";
import CustomInput from "@/components/ui-shared/input-custom";
import FormActions from "@/app/admin/_components/features/form-actions";
import SimpleModal from "@/app/admin/_components/features/simple-modal";

type Props = {
  profile?: ProfileType | null;
  onSuccess?: () => void;
  open?: boolean;
  setOpen?: (open: boolean) => void;
};

const DEFAULT_VALUES: UpdateProfileInputType = {
  name: "",
  phone: "",
  address: "",
  avatar_url: "",
};

export default function FormProfile({
  profile,
  onSuccess,
  open = false,
  setOpen = () => {},
}: Props) {
  const [loading, setLoading] = useState(false);

  const form = useForm<UpdateProfileInputType>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: DEFAULT_VALUES,
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProfileInputType }) =>
      updateProfile(id, data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Cập nhật tài khoản thành công");
        setOpen(false);
        onSuccess?.();
      } else {
        console.error("Error updating profile:", response.error);
        toast.error("Lỗi cập nhật tài khoản");
      }
    },
    onError: (error) => {
      console.error("Error updating profile:", error);
      toast.error("Lỗi server");
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        name: profile.name || "",
        phone: profile.phone || "",
        address: profile.address || "",
        avatar_url: profile.avatar_url || "",
      });
    } else {
      form.reset(DEFAULT_VALUES);
    }
  }, [profile, form]);

  const onSubmit = async (data: UpdateProfileInputType) => {
    if (!profile) {
      toast.error("Không tìm thấy tài khoản");
      return;
    }

    setLoading(true);
    updateMutation.mutate({
      id: profile.id,
      data,
    });
  };

  return (
    <SimpleModal
      open={open}
      onClose={() => setOpen(false)}
      title={`Sửa tài khoản "${profile?.name || profile?.email || ""}"`}
      className="max-w-3xl bg-card"
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
                label="Tên người dùng"
                placeholder="Nhập tên người dùng"
              />

              <CustomInput
                control={form.control}
                name="phone"
                label="Số điện thoại"
                placeholder="Nhập số điện thoại"
              />
            </div>

            <CustomInput
              control={form.control}
              name="address"
              label="Địa chỉ"
              placeholder="Nhập địa chỉ"
            />

            <CustomInput
              control={form.control}
              name="avatar_url"
              label="URL Avatar"
              placeholder="Nhập URL avatar"
            />
          </div>

          <FormActions loading={loading} onCancel={() => setOpen(false)} />
        </form>
      </Form>
    </SimpleModal>
  );
}
