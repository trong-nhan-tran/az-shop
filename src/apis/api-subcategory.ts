import axios from "axios";
import { Response } from "@/libs/helper-response";
import { SubcategoryInputType } from "@/schemas";

const API_URL = "/api/subcategory";

const getAuthHeaders = () => {
  return {};
};

export const getAllSubcategories = async (params?: {
  page?: number;
  pageSize?: number;
}): Promise<Response<any[]>> => {
  const queryParams = new URLSearchParams();

  if (params?.page) {
    queryParams.append("page", params.page.toString());
  }
  if (params?.pageSize) {
    queryParams.append("pageSize", params.pageSize.toString());
  }

  const queryString = queryParams.toString();
  const url = queryString ? `${API_URL}?${queryString}` : API_URL;

  const response = await axios.get<Response<any[]>>(url);
  return response.data;
};

export const getSubcategoryById = async (
  id: string
): Promise<Response<any>> => {
  const response = await axios.get<Response<any>>(`${API_URL}/${id}`);
  return response.data;
};

export const createSubcategory = async (
  data: SubcategoryInputType
): Promise<Response<any>> => {
  const response = await axios.post<Response<any>>(API_URL, data, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const updateSubcategory = async (
  id: string,
  data: SubcategoryInputType
): Promise<Response<any>> => {
  const response = await axios.put<Response<any>>(`${API_URL}/${id}`, data, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const deleteSubcategory = async (id: string): Promise<Response<any>> => {
  const response = await axios.delete<Response<any>>(`${API_URL}/${id}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};
