import axios from "axios";
import { Response } from "@/libs/helper-response";
import { LoginInputType, RegisterInputType } from "@/schemas/schema-auth";

const API_URL = "/api/auth";

const getAuthHeaders = () => {
  return {};
};

export const signInWithEmail = async (
  data: LoginInputType
): Promise<Response<any>> => {
  const response = await axios.post<Response<any>>(`${API_URL}/signin`, data, {
    headers: getAuthHeaders(),
    validateStatus: () => true, // Don't throw on any status code
  });
  return response.data;
};

export const signUpWithEmail = async (
  data: RegisterInputType
): Promise<Response<any>> => {
  const response = await axios.post<Response<any>>(`${API_URL}/signup`, data, {
    headers: getAuthHeaders(),
    validateStatus: () => true, // Don't throw on any status code
  });
  return response.data;
};

export const logOut = async (): Promise<Response<any>> => {
  const response = await axios.post<Response<any>>(
    `${API_URL}/logout`,
    {},
    {
      headers: getAuthHeaders(),
      validateStatus: () => true, // Don't throw on any status code
    }
  );
  return response.data;
};
