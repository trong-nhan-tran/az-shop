import axios from "axios";
import { Response } from "@/libs/helper-response";
import { ProductItemInputType } from "@/schemas";

const API_URL = "/api/product-item";

const getAuthHeaders = () => {
  return {};
};

export const getAllProductItems = async (params?: {
  productVariantId?: string;
  page?: number;
  pageSize?: number;
  productId?: string;
}): Promise<Response<any[]>> => {
  const queryParams = new URLSearchParams();
  if (params?.productVariantId) {
    queryParams.append("productVariantId", params.productVariantId);
  }

  if (params?.productId) {
    queryParams.append("productId", params.productId);
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

export const getProductItemById = async (
  id: string
): Promise<Response<any>> => {
  const response = await axios.get<Response<any>>(`${API_URL}/${id}`);
  return response.data;
};

export const createProductItem = async (
  data: ProductItemInputType
): Promise<Response<any>> => {
  const response = await axios.post<Response<any>>(API_URL, data, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const updateProductItem = async (
  id: string,
  data: ProductItemInputType
): Promise<Response<any>> => {
  const response = await axios.put<Response<any>>(`${API_URL}/${id}`, data, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const deleteProductItem = async (id: string): Promise<Response<any>> => {
  const response = await axios.delete<Response<any>>(`${API_URL}/${id}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};
