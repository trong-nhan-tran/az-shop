import axios from "axios";
import { Response } from "@/libs/helper-response";
import { ProductVariantInputType } from "@/schemas";

const API_URL = "/api/product-variant";

const getAuthHeaders = () => {
  return {};
};

export const getAllProductVariants = async (params?: {
  keyword?: string;
  page?: number;
  productId?: string;
  categoryId?: string;
  pageSize?: number;
  categorySlug?: string;
  sortBy?: Record<string, "asc" | "desc">;
}): Promise<Response<any[]>> => {
  const queryParams = new URLSearchParams();
  if (params?.keyword) {
    queryParams.append("keyword", params.keyword);
  }
  if (params?.page) {
    queryParams.append("page", params.page.toString());
  }
  if (params?.pageSize) {
    queryParams.append("pageSize", params.pageSize.toString());
  }
  if (params?.productId) {
    queryParams.append("productId", params.productId);
  }
  if (params?.categoryId) {
    queryParams.append("categoryId", params.categoryId);
  }
  if (params?.categorySlug) {
    queryParams.append("categorySlug", params.categorySlug);
  }
  if (params?.sortBy) {
    // Convert sort object to string
    Object.entries(params.sortBy).forEach(([field, order]) => {
      queryParams.append("sortField", field);
      queryParams.append("sortOrder", order);
    });
  }
  const queryString = queryParams.toString();
  const url = queryString ? `${API_URL}?${queryString}` : API_URL;

  const response = await axios.get<Response<any[]>>(url);
  return response.data;
};

export const getAllProductVariantsByProductId = async (
  productId: string
): Promise<Response<any[]>> => {
  const url = `${API_URL}/by-product-id?productId=${productId}`;

  const response = await axios.get<Response<any[]>>(url);
  return response.data;
};

export const getProductVariantById = async (
  id: string
): Promise<Response<any>> => {
  const response = await axios.get<Response<any>>(`${API_URL}/${id}`);
  return response.data;
};

export const getProductVariantBySlug = async (
  slug: string
): Promise<Response<any>> => {
  const response = await axios.get<Response<any>>(`${API_URL}/by-slug/${slug}`);
  return response.data;
};

export const createProductVariant = async (
  data: ProductVariantInputType,
  thumbnailFile?: File | null
): Promise<Response<any>> => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(data));
  if (thumbnailFile) {
    formData.append("thumbnailFile", thumbnailFile);
  }

  const response = await axios.post<Response<any>>(API_URL, formData, {
    headers: {
      ...getAuthHeaders(),
    },
  });

  return response.data;
};

export const updateProductVariant = async (
  id: string,
  data: ProductVariantInputType,
  thumbnailFile?: File | null,
  oldThumbnailUrl?: string | null
): Promise<Response<any>> => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(data));
  if (thumbnailFile) {
    formData.append("thumbnailFile", thumbnailFile);
  }
  if (oldThumbnailUrl) {
    formData.append("oldThumbnailUrl", oldThumbnailUrl);
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

export const deleteProductVariant = async (
  id: string
): Promise<Response<any>> => {
  const response = await axios.delete<Response<any>>(`${API_URL}/${id}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};
