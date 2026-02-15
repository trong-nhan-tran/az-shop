import axios from "axios";
import { Response } from "@/libs/helper-response";
import { ProductInputType } from "@/schemas";

const API_URL = "/api/product";

const getAuthHeaders = () => {
  return {};
};

export const getAllProducts = async (params?: {
  categorySlug?: string;
  keyword?: string;
  page?: number;
  pageSize?: number;
  sortBy?: Record<string, "asc" | "desc">;
  categoryId?: string;
}): Promise<Response<any[]>> => {
  const queryParams = new URLSearchParams();

  if (params?.categorySlug) {
    queryParams.append("categorySlug", params.categorySlug);
  }
  if (params?.keyword) {
    queryParams.append("keyword", params.keyword);
  }
  if (params?.page) {
    queryParams.append("page", params.page.toString());
  }
  if (params?.pageSize) {
    queryParams.append("pageSize", params.pageSize.toString());
  }
  if (params?.categoryId) {
    queryParams.append("categoryId", params.categoryId);
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

export const getProductById = async (id: string): Promise<Response<any>> => {
  const response = await axios.get<Response<any>>(`${API_URL}/${id}`);
  return response.data;
};

export const createProduct = async (
  data: ProductInputType
): Promise<Response<any>> => {
  const response = await axios.post<Response<any>>(
    API_URL,
    { data },
    {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const updateProduct = async (
  id: string,
  data: ProductInputType
): Promise<Response<any>> => {
  const response = await axios.put<Response<any>>(
    `${API_URL}/${id}`,
    { data },
    {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const deleteProduct = async (id: string): Promise<Response<any>> => {
  const response = await axios.delete<Response<any>>(`${API_URL}/${id}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};
