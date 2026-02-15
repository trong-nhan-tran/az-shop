"use client";

import {
  BarChart3,
  ShoppingCart,
  TabletSmartphone,
  LayoutGrid,
  Zap,
  Newspaper,
  User,
} from "lucide-react";

import { NavMain } from "@/components/ui-shadcn/nav-main";
import { NavUser } from "@/components/ui-shadcn/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui-shadcn/sidebar";
import { getProfileAdmin } from "@/apis";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";

const adminNavData = {
  navMain: [
    {
      title: "Trang Chủ",
      url: "/admin",
      icon: BarChart3,
    },
    {
      title: "Đơn Hàng",
      url: "/admin/don-hang",
      icon: ShoppingCart,
    },
    {
      title: "Danh Mục",
      url: "/admin/danh-muc",
      icon: LayoutGrid,
    },
    {
      title: "Sản Phẩm",
      url: "/admin/san-pham",
      icon: TabletSmartphone,
    },
    {
      title: "Flash Sale",
      url: "/admin/flash-sale",
      icon: Zap,
    },
    {
      title: "Tài Khoản",
      url: "/admin/tai-khoan",
      icon: User,
    },
    {
      title: "Tin Tức",
      url: "/admin/tin-tuc",
      icon: Newspaper,
    },
  ],
};

export function SidebarAdmin({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { data: Response, isLoading } = useQuery({
    queryKey: ["profile-admin"],
    queryFn: () => getProfileAdmin(),
  });

  return (
    <Sidebar
      className=" bg-white" // 192px = w-48
      collapsible="icon"
      variant="floating"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className="hover:bg-transparent hover:text-current hover:shadow-none"
            >
              <Link href="#">
                <div className="flex aspect-square size-8 items-center justify-center  text-sidebar-foreground">
                  <Image
                    src="/images/logo3.png"
                    alt="Logo"
                    width={30}
                    height={30}
                  />
                </div>
                <div className="font-semibold text-lg">ADMIN PANEL</div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={adminNavData.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser profile={Response?.data} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
