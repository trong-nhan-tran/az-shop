"use client";

import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui-shadcn/form";
import { Button } from "@/components/ui-shadcn/button";
import { Input } from "@/components/ui-shadcn/input";
import { Trash2, Plus } from "lucide-react";
import Image from "next/image";
import React, { useEffect } from "react";
import { Label } from "@/components/ui-shadcn/label";
import { cn } from "@/libs/utils";
import { useFieldArray, Control } from "react-hook-form";

type ImageFieldValue = {
  url: string;
  file?: File;
  isNew?: boolean;
};

type Props = {
  name: string;
  label: string;
  control: Control<any>;
  className?: string;
  folder?: string;
  onFilesChange?: (files: File[]) => void;
  onRemovedUrls?: (urls: string[]) => void;
  accept?: string;
  size?: string;
};

const InputImageMultiple = (props: Props) => {
  const { fields, append, remove } = useFieldArray({
    control: props.control,
    name: props.name,
  });

  const handleImagesSelect = (files: FileList) => {
    const fileArray = Array.from(files);
    fileArray.forEach((file) => {
      const previewUrl = URL.createObjectURL(file);
      append({
        url: previewUrl,
        file: file,
        isNew: true,
      });
    });

    if (props.onFilesChange) {
      const allFiles = fields
        .filter((field: any) => field.file)
        .map((field: any) => field.file)
        .concat(fileArray);
      props.onFilesChange(allFiles);
    }
  };

  const handleRemoveImage = (index: number) => {
    const removedField = fields[index] as unknown as ImageFieldValue;
    if (
      !removedField.isNew &&
      removedField.url &&
      !removedField.url.startsWith("blob:")
    ) {
      if (props.onRemovedUrls) {
        props.onRemovedUrls([removedField.url]);
      }
    }

    remove(index);

    if (props.onFilesChange) {
      const remainingFiles = fields
        .filter((_, i) => i !== index)
        .filter((field: any) => field.file)
        .map((field: any) => field.file);
      props.onFilesChange(remainingFiles);
    }
  };

  useEffect(() => {
    return () => {
      fields.forEach((field: any) => {
        if (field.url && field.url.startsWith("blob:")) {
          URL.revokeObjectURL(field.url);
        }
      });
    };
  }, [fields]);

  return (
    <FormItem className={cn("gap-0", props.className)}>
      <FormLabel>{props.label}</FormLabel>
      <FormControl>
        <div className="bg-muted p-2 rounded-lg mt-1 w-full gap-2 flex flex-wrap justify-around">
          <Label
            htmlFor={`image-upload-multiple-${props.name}`}
            className={cn(
              "flex flex-col w-[100px] h-[100px] items-center justify-center rounded-md cursor-pointer border bg-card",
              props.size,
            )}
          >
            <div className="flex flex-col items-center justify-center p-2 text-center">
              <Plus className="h-6 w-6 mb-1 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Thêm ảnh</p>
            </div>
            <Input
              id={`image-upload-multiple-${props.name}`}
              type="file"
              accept={props.accept || "image/*"}
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleImagesSelect(e.target.files);
                }
              }}
            />
          </Label>
          {fields.map((field, index) => {
            const imageField = field as unknown as ImageFieldValue;
            return (
              <div
                key={field.id}
                className={cn(
                  "relative group overflow-hidden border rounded-md w-[100px] h-[100px] bg-card",
                  props.size,
                )}
              >
                <Image
                  src={imageField.url}
                  alt={`Image ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => handleRemoveImage(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};

export default InputImageMultiple;
