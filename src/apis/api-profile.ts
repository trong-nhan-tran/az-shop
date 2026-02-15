import axios from "axios";
import { Response } from "@/libs/helper-response";
import {
  ProfileType,
  ProfileWithOrderType,
  UpdateProfileInputType,
} from "@/schemas";

const API_URL = "/api/profile";

const getAuthHeaders = () => {
  return {};
};

export const getAllProfiles = async (params?: {
  keyword?: string;
  page?: number;
  pageSize?: number;
  sortBy?: Record<string, "asc" | "desc">;
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

  if (params?.sortBy) {
    // Convert sort object to string
    Object.entries(params.sortBy).forEach(([field, order]) => {
      queryParams.append("sortField", field);
      queryParams.append("sortOrder", order);
    });
  }

  const queryString = queryParams.toString();
  const url = queryString ? `${API_URL}?${queryString}` : API_URL;

  const response = await axios.get<Response<any[]>>(url);
  return response.data;
};

export const getProfileById = async (id: string): Promise<Response<any>> => {
  const response = await axios.get<Response<any>>(`${API_URL}/${id}`);
  return response.data;
};
export const getProfileCustomer = async (): Promise<
  Response<ProfileWithOrderType>
> => {
  const response = await axios.get<Response<ProfileWithOrderType>>(
    `${API_URL}/customer`,
  );
  return response.data;
};
export const getProfileAdmin = async (): Promise<Response<ProfileType>> => {
  const response = await axios.get<Response<any>>(`${API_URL}/ad`);
  return response.data;
};

export const updateProfile = async (
  id: string,
  data: UpdateProfileInputType,
): Promise<Response<any>> => {
  const response = await axios.put<Response<any>>(
    `${API_URL}/${id}`,
    { data },
    {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
    },
  );
  return response.data;
};
