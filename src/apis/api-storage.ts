import axios from "axios";
import { Response } from "@/libs/helper-response";
import { NewsFeedInputType, NewsFeedType } from "@/schemas";

const API_URL = "/api/storage";

const getAuthHeaders = () => {
  return {};
};

export const uploadImage = async (
  file?: File | null
): Promise<Response<any>> => {
  const formData = new FormData();
  if (file) {
    formData.append("file", file);
  }

  const response = await axios.post<Response<any>>(API_URL, formData, {
    headers: {
      ...getAuthHeaders(),
    },
  });

  return response.data;
};

export const deleteImage = async (url: string): Promise<Response<any>> => {
  const response = await axios.delete<Response<any>>(API_URL, {
    headers: {
      ...getAuthHeaders(),
    },
    data: { url },
  });

  return response.data;
};
