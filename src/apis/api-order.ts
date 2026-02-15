import axios from "axios";
import { Response } from "@/libs/helper-response";
import { OrderInputType } from "@/schemas";
import { Or } from "@prisma/client/runtime/library";

const API_URL = "/api/order";

const getAuthHeaders = () => {
  return {};
};

export const getAllOrders = async (params?: {
  status?: string;
  keyword?: string;
  page?: number;
  pageSize?: number;
}): Promise<Response<any[]>> => {
  const queryParams = new URLSearchParams();
  if (params?.status) {
    queryParams.append("status", params.status);
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

  const queryString = queryParams.toString();
  const url = queryString ? `${API_URL}?${queryString}` : API_URL;

  const response = await axios.get<Response<any[]>>(url);
  return response.data;
};

export const getOrderById = async (id: string): Promise<Response<any>> => {
  const response = await axios.get<Response<any>>(`${API_URL}/${id}`);
  return response.data;
};

export const createOrder = async (
  data: OrderInputType,
): Promise<Response<any>> => {
  const response = await axios.post<Response<any>>(API_URL, data);
  return response.data;
};

export const updateOrder = async (
  id: string,
  data: OrderInputType,
): Promise<Response<any>> => {
  const response = await axios.put<Response<any>>(`${API_URL}/${id}`, data, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const deleteOrder = async (id: string): Promise<Response<any>> => {
  const response = await axios.delete<Response<any>>(`${API_URL}/${id}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const placeOrder = async (
  data: OrderInputType,
): Promise<Response<any>> => {
  const response = await axios.post<Response<any>>(
    `${API_URL}/place-order`,
    data,
    {
      headers: getAuthHeaders(),
    },
  );
  return response.data;
};

export const getOrderHistory = async (): Promise<Response<any[]>> => {
  const response = await axios.get<Response<any[]>>(
    `${API_URL}/get-order-history`,
    {
      headers: getAuthHeaders(),
    },
  );
  return response.data;
};
