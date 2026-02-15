import { z } from "zod";

export const dashboardStatsSchema = z.object({
  totalCategories: z.number(),
  totalProducts: z.number(),
  totalProductItems: z.number(),
  totalOrders: z.number(),
  totalRevenue: z.number(),
  recentOrders: z.array(
    z.object({
      id: z.number(),
      customer_name: z.string(),
      customer_phone: z.string(),
      created_at: z.string(),
      status: z.string(),
      total: z.number(),
      items_count: z.number(),
    })
  ),
  topProducts: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      sale_count: z.number(),
      thumbnail: z.string().nullable(),
      price: z.number(),
    })
  ),
  ordersByStatus: z.array(
    z.object({
      status: z.string(),
      count: z.number(),
    })
  ),
  revenueByMonth: z.array(
    z.object({
      month: z.string(),
      revenue: z.number(),
    })
  ),
});

export type DashboardStatsType = z.infer<typeof dashboardStatsSchema>;
