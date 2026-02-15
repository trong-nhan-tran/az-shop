import axios from "axios";
import { Response } from "@/libs/helper-response";
import { FlashSaleInputType } from "@/schemas";

const API_URL = "/api/flash-sale";

const getAuthHeaders = () => {
  return {};
};

export const getAllFlashSales = async (params?: {
  page?: number;
  pageSize?: number;
  includeDetails?: boolean;
}): Promise<Response<any[]>> => {
  const queryParams = new URLSearchParams();

  if (params?.page) {
    queryParams.append("page", params.page.toString());
  }
  if (params?.pageSize) {
    queryParams.append("pageSize", params.pageSize.toString());
  }
  if (params?.includeDetails) {
    queryParams.append("includeDetails", params.includeDetails.toString());
  }

  const queryString = queryParams.toString();
  const url = queryString ? `${API_URL}?${queryString}` : API_URL;

  const response = await axios.get<Response<any[]>>(url);
  return response.data;
};

export const getFlashSaleById = async (id: string): Promise<Response<any>> => {
  const response = await axios.get<Response<any>>(`${API_URL}/${id}`);
  return response.data;
};

export const createFlashSale = async (
  data: FlashSaleInputType
): Promise<Response<any>> => {
  const response = await axios.post<Response<any>>(API_URL, data, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const updateFlashSale = async (
  id: string,
  data: FlashSaleInputType
): Promise<Response<any>> => {
  const response = await axios.put<Response<any>>(`${API_URL}/${id}`, data, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const deleteFlashSale = async (id: string): Promise<Response<any>> => {
  const response = await axios.delete<Response<any>>(`${API_URL}/${id}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const getActiveFlashSale = async (): Promise<Response<any>> => {
  const response = await axios.get<Response<any>>(`${API_URL}/active`);
  return response.data;
};
