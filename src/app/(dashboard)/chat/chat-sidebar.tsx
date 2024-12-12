"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useMutation, useQuery } from "convex/react";
import { TrashIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { CreateChat } from "./create-chat";

export function ChatSidebar({ id }: { id: Id<"servers"> }) {
  const pathname = usePathname();
  const server = useQuery(api.functions.server.get, { id: id });
  const channels = useQuery(api.functions.channels.list, { id: id });
  const removeChannel = useMutation(api.functions.channels.remove);
  const router = useRouter();

  const handleChannelDelete = async (id: Id<"channels">) => {
    try {
      if (server) {
        router.push(`/chat/${server?.defaultChannelId}`);
      }
      await removeChannel({ id });
      toast.success("Channel deleted");
    } catch (error) {
      toast.error("Failed to delete channel", {
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  };
  return (
    <Sidebar className="left-12">
      <SidebarHeader className="flex flex-row justify-between">
        {server?.name}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Chats</SidebarGroupLabel>
          <CreateChat serverId={id} />
          <SidebarGroupContent>
            <SidebarMenu>
              {channels?.map((channel) => (
                <SidebarMenuItem key={channel._id}>
                  <SidebarMenuButton
                    isActive={pathname === `/chat/${channel._id}`}
                    asChild
                  >
                    <Link href={`/chat/${channel._id}`}>{channel.name}</Link>
                  </SidebarMenuButton>
                  {server?.defaultChannelId !== channel._id && (
                    <SidebarMenuAction
                      onClick={() => handleChannelDelete(channel._id)}
                    >
                      <TrashIcon />
                    </SidebarMenuAction>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>{/* <Voice serverId={id} /> */}</SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}
