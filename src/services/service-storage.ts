import { createClient } from "@/libs/supabase/supabase-server";
import {
  Response,
  successResponse,
  internalServerErrorResponse,
  badRequestResponse,
} from "@/libs/helper-response";

export const storageService = {
  createFileName: (originalName: string): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const nameWithoutExt = originalName.split(".").slice(0, -1).join(".");
    const sanitizedName = nameWithoutExt
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-")
      .toLowerCase();

    return `${year}${month}${day}-${hours}${minutes}${seconds}-${sanitizedName}`;
  },
  upload: async (
    files: File | File[],
    folder: string = "products"
  ): Promise<Response<string | string[] | null>> => {
    try {
      const supabase = createClient();
      const filesArray = Array.isArray(files) ? files : [files];

      const uploadResults = await Promise.all(
        filesArray.map(async (file) => {
          const fileName = storageService.createFileName(file.name);
          const fileExt = file.name.split(".").pop();
          const filePath = `${folder}/${fileName}.${fileExt}`;
          const buffer = Buffer.from(await file.arrayBuffer());

          const { error } = await (await supabase).storage
            .from("images")
            .upload(filePath, buffer, {
              contentType: file.type,
              cacheControl: "3600",
              upsert: false,
            });

          if (error) throw error;

          const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
          const publicUrl = `${baseUrl}/storage/v1/object/public/images/${filePath}`;

          return publicUrl;
        })
      );

      const result = Array.isArray(files) ? uploadResults : uploadResults[0];
      return successResponse(result, "Tải lên thành công", 200);
    } catch (error) {
      console.log("Lỗi tải file lên:", error);
      return internalServerErrorResponse();
    }
  },

  delete: async (
    paths: string | string[]
  ): Promise<Response<boolean | any>> => {
    try {
      const supabase = createClient();
      const pathsArray = Array.isArray(paths) ? paths : [paths];

      if (pathsArray.length === 0) {
        return badRequestResponse("Không có đường dẫn để xóa");
      }

      const { error } = await (await supabase).storage
        .from("images")
        .remove(pathsArray);

      if (error) throw error;

      return successResponse(true, "Xóa file thành công", 200);
    } catch (error) {
      console.log("Lỗi xóa file:", error);
      return internalServerErrorResponse();
    }
  },

  extractPathFromUrl: (url: string): string | null => {
    const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const regex = new RegExp(`${baseUrl}/storage/v1/object/public/images/(.+)`);
    const match = url.match(regex);
    const path = match ? match[1] : null;

    return path;
  },
};
