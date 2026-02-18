"use client";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  Bold,
  ClassicEditor,
  Essentials,
  Image,
  ImageCaption,
  ImageToolbar,
  ImageUpload,
  ImageStyle,
  ImageResize,
  Italic,
  Heading,
  Link,
  List,
  Paragraph,
  Table,
  TableToolbar,
  TableProperties,
  TableCellProperties,
  Undo,
  FontSize,
  FontFamily,
  FontColor,
  FontBackgroundColor,
  Alignment,
  Autoformat,
  BlockQuote,
  Code,
  CodeBlock,
  HorizontalLine,
  Indent,
  IndentBlock,
  MediaEmbed,
  RemoveFormat,
  Strikethrough,
  Subscript,
  Superscript,
  Underline,
  TodoList,
  Highlight,
  SpecialCharacters,
  SpecialCharactersEssentials,
} from "ckeditor5";
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";

import { extractImageUrlsFromDescription } from "@/libs/utils";
import { uploadImage, deleteImage } from "@/apis/api-storage";

import "ckeditor5/ckeditor5.css";

interface CKEditorWrapperProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

// Custom upload adapter
class SupabaseUploadAdapter {
  private loader;

  constructor(loader: any) {
    this.loader = loader;
  }

  async upload() {
    try {
      const file = await this.loader.file;

      // Sử dụng API đã tạo
      const result = await uploadImage(file);

      if (!result.success) {
        throw new Error(result.message || "Failed to upload image");
      }

      // Show success toast
      toast.success("Tải ảnh lên thành công!");

      // Return the URL for CKEditor
      return {
        default: result.data,
      };
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Không thể tải ảnh lên. Vui lòng thử lại.");
      throw error;
    }
  }

  abort() {
    // Implement abort if needed
  }
}

// Plugin function to integrate the adapter
function SupabaseUploadAdapterPlugin(editor: any) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader: any) => {
    return new SupabaseUploadAdapter(loader);
  };
}

export default function CKEditorWrapper({
  value,
  onChange,
  placeholder = "Nhập nội dung...",
}: CKEditorWrapperProps) {
  const [previousImageUrls, setPreviousImageUrls] = useState<string[]>([]);

  useEffect(() => {
    const initialImageUrls = extractImageUrlsFromDescription(value);
    setPreviousImageUrls(initialImageUrls);
  }, [value]);

  const handleEditorChange = async (event: any, editor: any) => {
    const newContent = editor.getData();
    const newImageUrls = extractImageUrlsFromDescription(newContent);

    // Tìm các ảnh đã bị xóa
    const removedUrls = previousImageUrls.filter(
      (url) => !newImageUrls.includes(url),
    );

    // Xóa các ảnh đã bị remove khỏi editor
    if (removedUrls.length > 0) {
      removedUrls.forEach(async (url) => {
        try {
          await deleteImage(url);
          toast.success("Đã xóa ảnh không sử dụng");
        } catch (error) {
          console.error("Error deleting image:", error);
        }
      });
    }

    setPreviousImageUrls(newImageUrls);
    onChange(newContent);
  };

  return (
    <div className="rich-text-editor pointer-event:auto text-black">
      <CKEditor
        editor={ClassicEditor}
        data={value}
        config={{
          licenseKey: "GPL",
          placeholder,
          plugins: [
            Essentials,
            Autoformat,
            Bold,
            Italic,
            Underline,
            Strikethrough,
            Subscript,
            Superscript,
            Code,
            Paragraph,
            Heading,
            BlockQuote,
            CodeBlock,
            FontFamily,
            FontSize,
            FontColor,
            FontBackgroundColor,
            Highlight,
            Alignment,
            Indent,
            IndentBlock,
            Link,
            List,
            TodoList,
            RemoveFormat,
            Table,
            TableToolbar,
            TableProperties,
            TableCellProperties,
            Image,
            ImageUpload,
            ImageToolbar,
            ImageCaption,
            ImageStyle,
            ImageResize,
            MediaEmbed,
            HorizontalLine,
            SpecialCharacters,
            SpecialCharactersEssentials,
            Undo,
          ],
          extraPlugins: [SupabaseUploadAdapterPlugin],
          toolbar: [
            "undo",
            "redo",
            "|",
            "heading",
            "|",
            "fontFamily",
            "fontSize",
            "fontColor",
            "fontBackgroundColor",
            "|",
            "bold",
            "italic",
            "underline",
            "strikethrough",
            "subscript",
            "superscript",
            "code",
            "removeFormat",
            "|",
            "alignment",
            "|",
            "bulletedList",
            "numberedList",
            "todoList",
            "outdent",
            "indent",
            "|",
            "link",
            "uploadImage",
            "insertTable",
            "mediaEmbed",
            "blockQuote",
            "codeBlock",
            "horizontalLine",
            "specialCharacters",
            "|",
            "highlight",
          ],
          image: {
            toolbar: [
              "imageTextAlternative",
              "toggleImageCaption",
              "imageStyle:inline",
              "imageStyle:block",
              "imageStyle:side",
            ],
          },
          table: {
            contentToolbar: [
              "tableColumn",
              "tableRow",
              "mergeTableCells",
              "tableProperties",
              "tableCellProperties",
            ],
          },
        }}
        onChange={handleEditorChange}
      />
    </div>
  );
}
