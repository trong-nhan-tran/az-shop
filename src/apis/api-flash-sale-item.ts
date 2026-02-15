import axios from "axios";
import { Response } from "@/libs/helper-response";
import { FlashSaleItemInputType } from "@/schemas";

const API_URL = "/api/flash-sale-item";

const getAuthHeaders = () => {
  return {};
};

export const getAllFlashSaleItems = async (params?: {
  page?: number;
  pageSize?: number;
  flashSaleId?: string;
}): Promise<Response<any[]>> => {
  const queryParams = new URLSearchParams();

  if (params?.page) {
    queryParams.append("page", params.page.toString());
  }
  if (params?.pageSize) {
    queryParams.append("pageSize", params.pageSize.toString());
  }
  if (params?.flashSaleId) {
    queryParams.append("flashSaleId", params.flashSaleId);
  }

  const queryString = queryParams.toString();
  const url = queryString ? `${API_URL}?${queryString}` : API_URL;

  const response = await axios.get<Response<any[]>>(url);
  return response.data;
};

export const getFlashSaleItemById = async (
  id: string
): Promise<Response<any>> => {
  const response = await axios.get<Response<any>>(`${API_URL}/${id}`);
  return response.data;
};

export const createFlashSaleItem = async (
  data: FlashSaleItemInputType
): Promise<Response<any>> => {
  const response = await axios.post<Response<any>>(API_URL, data, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const updateFlashSaleItem = async (
  id: string,
  data: FlashSaleItemInputType
): Promise<Response<any>> => {
  const response = await axios.put<Response<any>>(`${API_URL}/${id}`, data, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const deleteFlashSaleItem = async (
  id: string
): Promise<Response<any>> => {
  const response = await axios.delete<Response<any>>(`${API_URL}/${id}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};
