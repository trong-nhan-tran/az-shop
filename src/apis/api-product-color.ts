import axios from "axios";
import { Response } from "@/libs/helper-response";
import { ProductColorInputType } from "@/schemas";

const API_URL = "/api/product-color";

const getAuthHeaders = () => {
  return {};
};

export const getAllProductColors = async (params?: {
  keyword?: string;
  limit?: number;
  productId?: string;
}): Promise<Response<any[]>> => {
  const queryParams = new URLSearchParams();
  if (params?.keyword) {
    queryParams.append("keyword", params.keyword);
  }
  if (params?.limit) {
    queryParams.append("limit", params.limit.toString());
  }
  if (params?.productId) {
    queryParams.append("productId", params.productId);
  }

  const queryString = queryParams.toString();
  const url = queryString ? `${API_URL}?${queryString}` : API_URL;

  const response = await axios.get<Response<any[]>>(url);
  return response.data;
};

export const getProductColorById = async (
  id: string
): Promise<Response<any>> => {
  const response = await axios.get<Response<any>>(`${API_URL}/${id}`);
  return response.data;
};

export const createProductColor = async (
  data: ProductColorInputType,
  thumbnailFile?: File | null,
  additionalImages?: File[] | null
): Promise<Response<any>> => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(data));
  if (thumbnailFile) {
    formData.append("thumbnailFile", thumbnailFile);
  }
  if (additionalImages) {
    additionalImages.forEach((file) =>
      formData.append("additionalImages", file)
    );
  }

  const response = await axios.post<Response<any>>(API_URL, formData, {
    headers: {
      ...getAuthHeaders(),
    },
  });

  return response.data;
};

export const updateProductColor = async (
  id: string,
  data: ProductColorInputType,
  thumbnailFile?: File | null,
  oldThumbnailUrl?: string | null,
  additionalImages?: File[] | null,
  removedImageUrls?: string[] | null
): Promise<Response<any>> => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(data));
  if (thumbnailFile) {
    formData.append("thumbnailFile", thumbnailFile);
  }
  if (oldThumbnailUrl) {
    formData.append("oldThumbnailUrl", oldThumbnailUrl);
  }
  if (additionalImages) {
    additionalImages.forEach((file) =>
      formData.append("additionalImages", file)
    );
  }
  if (removedImageUrls) {
    removedImageUrls.forEach((url) => formData.append("removedImageUrls", url));
  }

  const response = await axios.put<Response<any>>(
    `${API_URL}/${id}`,
    formData,
    {
      headers: {
        ...getAuthHeaders(),
      },
    }
  );

  return response.data;
};

export const deleteProductColor = async (
  id: string
): Promise<Response<any>> => {
  const response = await axios.delete<Response<any>>(`${API_URL}/${id}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};
