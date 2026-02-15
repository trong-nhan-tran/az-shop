import axios from "axios";
import { Response } from "@/libs/helper-response";
import { DashboardStatsType } from "@/schemas/schema-dashboard";

const API_URL = "/api/dashboard";

export const getDashboardStats = async (): Promise<
  Response<DashboardStatsType>
> => {
  const response = await axios.get<Response<DashboardStatsType>>(
    `${API_URL}/stats`
  );
  return response.data;
};
