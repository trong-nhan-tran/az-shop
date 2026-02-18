"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";

import { NewsFeedInputType, NewsFeedType, newFeedInputSchema } from "@/schemas";
import { createNewsFeed, updateNewsFeed } from "@/apis";

import RichTextEditor from "../../_components/text-editor/rich-text-editor";
import FormActions from "@/app/admin/_components/features/form-actions";

import { Form } from "@/components/ui-shadcn/form";

import CustomInput from "@/components/ui-shared/input-custom";
import { Label } from "@radix-ui/react-label";
import SimpleModal from "@/app/admin/_components/features/simple-modal";
import InputImage from "@/app/admin/_components/ui/input-image";

type Props = {
  news?: NewsFeedType | null;
  onSuccess?: () => void;
  editMode?: boolean;
  open?: boolean;
  setOpen?: (open: boolean) => void;
};

const DEFAULT_VALUES: NewsFeedInputType = {
  title: "",
  slug: "",
  thumbnail: "",
  content: "",
};

export default function FormNews({
  news,
  onSuccess,
  editMode = false,
  open = false,
  setOpen = () => {},
}: Props) {
  const [loading, setLoading] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [oldThumbnailUrl, setOldThumbnailUrl] = useState<string | null>(null);
  const form = useForm<NewsFeedInputType>({
    resolver: zodResolver(newFeedInputSchema),
    defaultValues: DEFAULT_VALUES,
    mode: "onSubmit",
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: ({
      data,
      file,
    }: {
      data: NewsFeedInputType;
      file: File | null;
    }) => createNewsFeed(data, file),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Thêm tin tức thành công");
        setOpen(false);
        onSuccess?.();
      } else {
        toast.error(response.message || "Lỗi thêm tin tức");
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
      data: NewsFeedInputType;
      file: File | null;
      currentUrl: string | null;
    }) => updateNewsFeed(id, data, file, currentUrl),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Cập nhật tin tức thành công");
        setOpen(false);
        onSuccess?.();
      } else {
        toast.error(response.message || "Lỗi cập nhật tin tức");
      }
    },
    onError: () => {
      toast.error("Lỗi server");
    },
  });

  useEffect(() => {
    if (open) {
      if (news && editMode) {
        // Store the original thumbnail URL for potential deletion
        if (news.thumbnail) {
          setOldThumbnailUrl(news.thumbnail);
        }

        form.reset({
          title: news.title,
          slug: news.slug,
          thumbnail: news.thumbnail || "",
          content: news.content || "",
        });
      } else {
        setOldThumbnailUrl(null);
        form.reset(DEFAULT_VALUES);
      }
      setThumbnailFile(null);
    }
  }, [news, form, editMode, open]);
  const handleFileChange = (file: File | null) => {
    setThumbnailFile(file);
  };
  const onSubmit = async (data: NewsFeedInputType) => {
    console.log("Form onSubmit - data:", data);
    console.log("Form onSubmit - thumbnailFile:", thumbnailFile);

    if (editMode && news) {
      updateMutation.mutate({
        id: String(news.id),
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
        editMode
          ? `Sửa tin tức "${news?.title ? `${news.title}` : ""}"`
          : "Thêm tin tức"
      }
      className="max-w-5xl bg-card"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-3 overflow-hidden"
        >
          <div className="flex flex-col gap-4">
            <CustomInput
              control={form.control}
              name="title"
              label="Tiêu đề tin tức"
              placeholder="Nhập tiêu đề tin tức"
              isRequired={true}
            />
            <CustomInput
              control={form.control}
              name="slug"
              label="Slug SEO"
              placeholder="Nhập slug tin tức"
              isRequired={true}
            />

            <InputImage
              control={form.control}
              name="thumbnail"
              label="Ảnh đại diện"
              folder="news_feeds"
              onFileChange={handleFileChange}
              size="w-[500px]"
            />

            <div className="w-full">
              <Label className="text-sm font-medium">Nội dung tin tức</Label>
              <RichTextEditor
                value={form.watch("content") || ""}
                onChange={(content) => form.setValue("content", content)}
                placeholder="Nhập nội dung tin tức..."
              />
            </div>
          </div>

          <FormActions loading={loading} onCancel={() => setOpen(false)} />
        </form>
      </Form>
    </SimpleModal>
  );
}
