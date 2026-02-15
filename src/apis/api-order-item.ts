import axios from "axios";
import { Response } from "@/libs/helper-response";
import { OrderItemInputRequestType } from "@/schemas";

const API_URL = "/api/order-item";

const getAuthHeaders = () => {
  return {};
};

export const getAllOrderItems = async (params?: {
  orderId?: string;
  productItemId?: string;
  page?: number;
  pageSize?: number;
}): Promise<Response<any[]>> => {
  const queryParams = new URLSearchParams();
  if (params?.orderId) {
    queryParams.append("orderId", params.orderId);
  }
  if (params?.productItemId) {
    queryParams.append("productItemId", params.productItemId);
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

export const getOrderItemById = async (id: string): Promise<Response<any>> => {
  const response = await axios.get<Response<any>>(`${API_URL}/${id}`);
  return response.data;
};

export const createOrderItem = async (
  data: OrderItemInputRequestType
): Promise<Response<any>> => {
  const response = await axios.post<Response<any>>(API_URL, data, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const updateOrderItem = async (
  id: string,
  data: OrderItemInputRequestType
): Promise<Response<any>> => {
  const response = await axios.put<Response<any>>(`${API_URL}/${id}`, data, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const deleteOrderItem = async (id: string): Promise<Response<any>> => {
  const response = await axios.delete<Response<any>>(`${API_URL}/${id}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const getOrderItemsByOrderId = async (
  orderId: string
): Promise<Response<any[]>> => {
  return getAllOrderItems({ orderId });
};
