import axios from "axios";
import { Response } from "@/libs/helper-response";
import { BannerInputType, BannerType } from "@/schemas";

const API_URL = "/api/banner";

const getAuthHeaders = () => {
  return {};
};

export const getAllBanners = async (params?: {
  keyword?: string;
  page?: number;
  pageSize?: number;
  categoryId?: string;
}): Promise<Response<BannerType[]>> => {
  const queryParams = new URLSearchParams();
  if (params?.keyword) {
    queryParams.append("keyword", params.keyword);
  }
  if (params?.page) {
    queryParams.append("page", params.page.toString());
  }
  if (params?.categoryId) {
    queryParams.append("categoryId", params.categoryId);
  }
  if (params?.pageSize) {
    queryParams.append("pageSize", params.pageSize.toString());
  }

  const queryString = queryParams.toString();
  const url = queryString ? `${API_URL}?${queryString}` : API_URL;

  const response = await axios.get<Response<BannerType[]>>(url);
  return response.data;
};

export const getBannerById = async (
  id: string
): Promise<Response<BannerType>> => {
  const { data } = await axios.get<Response<BannerType>>(`${API_URL}/${id}`);
  return data;
};

export const createBanner = async (
  data: BannerInputType,
  desktopFile?: File | null,
  mobileFile?: File | null
): Promise<Response<BannerType>> => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(data));
  if (desktopFile) {
    formData.append("desktopFile", desktopFile);
  }
  if (mobileFile) {
    formData.append("mobileFile", mobileFile);
  }
  const response = await axios.post<Response<BannerType>>(API_URL, formData, {
    headers: {
      ...getAuthHeaders(),
    },
  });

  return response.data;
};

export const updateBanner = async (
  id: string,
  data: BannerInputType,
  desktopFile?: File | null,
  mobileFile?: File | null,
  oldDesktopImage?: string | null,
  oldMobileImage?: string | null
): Promise<Response<BannerType>> => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(data));
  if (desktopFile) {
    formData.append("desktopFile", desktopFile);
  }
  if (mobileFile) {
    formData.append("mobileFile", mobileFile);
  }
  if (oldDesktopImage) {
    formData.append("oldDesktopImage", oldDesktopImage);
  }
  if (oldMobileImage) {
    formData.append("oldMobileImage", oldMobileImage);
  }

  const response = await axios.put<Response<BannerType>>(
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

export const deleteBanner = async (
  id: string
): Promise<Response<BannerType>> => {
  const response = await axios.delete<Response<BannerType>>(
    `${API_URL}/${id}`,
    {
      headers: getAuthHeaders(),
    }
  );
  return response.data;
};
