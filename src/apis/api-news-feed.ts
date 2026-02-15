import axios from "axios";
import { Response } from "@/libs/helper-response";
import { NewsFeedInputType, NewsFeedType } from "@/schemas";

const API_URL = "/api/news-feed";

const getAuthHeaders = () => {
  return {};
};

export const getAllNewsFeeds = async (params?: {
  keyword?: string;
  page?: number;
  pageSize?: number;
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

  const queryString = queryParams.toString();
  const url = queryString ? `${API_URL}?${queryString}` : API_URL;

  const { data } = await axios.get<Response<NewsFeedType[]>>(url);
  return data;
};

export const getNewsFeedById = async (id: string): Promise<Response<any>> => {
  const response = await axios.get<Response<any>>(`${API_URL}/${id}`);
  return response.data;
};
export const createNewsFeed = async (
  data: NewsFeedInputType,
  thumbnailFile?: File | null
): Promise<Response<any>> => {
  console.log("createNewsFeed - data:", data);
  console.log("createNewsFeed - thumbnailFile:", thumbnailFile);

  const formData = new FormData();
  formData.append("data", JSON.stringify(data));
  if (thumbnailFile) {
    formData.append("thumbnailFile", thumbnailFile);
  }

  // Debug FormData
  console.log("FormData entries------:");
  for (let pair of formData.entries()) {
    console.log(pair[0], pair[1]);
  }

  const response = await axios.post<Response<any>>(API_URL, formData, {
    headers: {
      ...getAuthHeaders(),
    },
  });

  return response.data;
};

export const updateNewsFeed = async (
  id: string,
  data: NewsFeedInputType,
  thumbnailFile?: File | null,
  oldThumbnailUrl?: string | null
): Promise<Response<any>> => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(data));
  if (thumbnailFile) {
    formData.append("thumbnailFile", thumbnailFile);
  }
  if (oldThumbnailUrl) {
    formData.append("oldThumbnailUrl", oldThumbnailUrl);
  }

  const response = await axios.put<Response<any>>(
    `${API_URL}/${id}`,
    formData,
    {
      headers: {
        ...getAuthHeaders(),
      },
    }
  );

  return response.data;
};

export const deleteNewsFeed = async (id: string): Promise<Response<any>> => {
  const response = await axios.delete<Response<any>>(`${API_URL}/${id}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};
