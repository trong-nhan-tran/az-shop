"use client";

import { SidebarAdmin } from "@/app/admin/_components/layouts/sidebar-admin";
import { SidebarInset, SidebarProvider } from "@/components/ui-shadcn/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, useState } from "react";

const ConfirmModalProvider = lazy(
  () => import("@/app/admin/_providers/confirm-modal-provider"),
);

export default function AdminManagerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );
  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <SidebarAdmin />
        <SidebarInset className="bg-white">{children}</SidebarInset>
        <ConfirmModalProvider />
      </SidebarProvider>
    </QueryClientProvider>
  );
}
