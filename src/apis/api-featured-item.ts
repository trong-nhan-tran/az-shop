import axios from "axios";
import { Response } from "@/libs/helper-response";
import { FeaturedItemInputType } from "@/schemas";

const API_URL = "/api/featured-item";

const getAuthHeaders = () => {
  return {};
};

export const getAllFeaturedItems = async (params?: {
  page?: number;
  pageSize?: number;
  categoryId?: number;
}): Promise<Response<any[]>> => {
  const queryParams = new URLSearchParams();

  if (params?.page) {
    queryParams.append("page", params.page.toString());
  }
  if (params?.pageSize) {
    queryParams.append("pageSize", params.pageSize.toString());
  }
  if (params?.categoryId) {
    queryParams.append("categoryId", params.categoryId.toString());
  }

  const queryString = queryParams.toString();
  const url = queryString ? `${API_URL}?${queryString}` : API_URL;

  const response = await axios.get<Response<any[]>>(url);
  return response.data;
};

export const getFeaturedItemById = async (
  id: string
): Promise<Response<any>> => {
  const response = await axios.get<Response<any>>(`${API_URL}/${id}`);
  return response.data;
};

export const createFeaturedItem = async (
  data: FeaturedItemInputType
): Promise<Response<any>> => {
  const response = await axios.post<Response<any>>(API_URL, data, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const updateFeaturedItem = async (
  id: string,
  data: FeaturedItemInputType
): Promise<Response<any>> => {
  const response = await axios.put<Response<any>>(`${API_URL}/${id}`, data, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const deleteFeaturedItem = async (
  id: string
): Promise<Response<any>> => {
  const response = await axios.delete<Response<any>>(`${API_URL}/${id}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};
