"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { ChatSidebar } from "./chat-sidebar";

export default function EquipmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useQuery(api.functions.user.get);
  const serverId = user?.server;
  return (
    <SidebarProvider>
      {serverId && <ChatSidebar id={serverId} />}
      {children}
    </SidebarProvider>
  );
}
