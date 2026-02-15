import axios from "axios";
import { Response } from "@/libs/helper-response";
import { CategoryWithSubType } from "@/schemas";

const API_URL = "/api/category";

const getAuthHeaders = () => {
  return {};
};

export const getAllCategories = async (params?: {
  keyword?: string;
  page?: number;
  pageSize?: number;
  includeFeaturedItems?: boolean;
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
  if (params?.includeFeaturedItems) {
    queryParams.append("includeFeaturedItems", "true");
  }

  const queryString = queryParams.toString();
  const url = queryString ? `${API_URL}?${queryString}` : API_URL;

  const { data } = await axios.get<Response<CategoryWithSubType[]>>(url);
  return data;
};

export const getCategoryById = async (id: string): Promise<Response<any>> => {
  const response = await axios.get<Response<any>>(`${API_URL}/${id}`);
  return response.data;
};

export const createCategory = async (
  data: FormData
): Promise<Response<any>> => {
  const response = await axios.post<Response<any>>(API_URL, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateCategory = async (
  id: string,
  data: FormData
): Promise<Response<any>> => {
  const response = await axios.put<Response<any>>(`${API_URL}/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const deleteCategory = async (id: string): Promise<Response<any>> => {
  const response = await axios.delete<Response<any>>(`${API_URL}/${id}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};
