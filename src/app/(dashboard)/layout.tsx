"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { RedirectToSignIn } from "@clerk/nextjs";
import { Authenticated, Unauthenticated } from "convex/react";
import { MainSidebar } from "./main-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Authenticated>
        <SidebarProvider defaultOpen={false}>
          <SidebarTrigger className="relative top-4 left-4 md:hidden" />
          <MainSidebar />
          {children}
        </SidebarProvider>
      </Authenticated>
      <Unauthenticated>
        <RedirectToSignIn></RedirectToSignIn>
      </Unauthenticated>
    </>
  );
}
