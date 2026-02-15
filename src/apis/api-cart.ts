import axios from "axios";
import { Response } from "@/libs/helper-response";
import { CartItemInputType, CartItemWithDetailType } from "@/schemas";

const API_URL = "/api/cart-item";

const getAuthHeaders = () => {
  return {};
};

export const getCartForUser = async (): Promise<
  Response<CartItemWithDetailType[]>
> => {
  const response = await axios.get<Response<CartItemWithDetailType[]>>(
    `${API_URL}/get-cart-user`,
  );
  return response.data;
};

export const addCartItem = async (data: {
  product_item_id: number;
  quantity: number;
}): Promise<Response<CartItemWithDetailType>> => {
  const response = await axios.post<Response<CartItemWithDetailType>>(
    `${API_URL}/add-cart-item`,
    data,
    {
      headers: getAuthHeaders(),
    },
  );
  return response.data;
};

export const updateQuantity = async (data: {
  product_item_id: number;
  quantity: number;
}): Promise<Response<any>> => {
  const response = await axios.post<Response<any>>(
    `${API_URL}/update-quantity`,
    data,
    {
      headers: getAuthHeaders(),
    },
  );
  return response.data;
};

export const deleteCartItem = async (id: number): Promise<Response<any>> => {
  const response = await axios.delete<Response<any>>(
    `${API_URL}/delete-cart-item/${id}`,
    {
      headers: getAuthHeaders(),
    },
  );
  return response.data;
};

export const getTotalQuantity = async (): Promise<Response<number>> => {
  const response = await axios.get<Response<number>>(
    `${API_URL}/get-total-quantity`,
    {
      headers: getAuthHeaders(),
    },
  );
  return response.data;
};
