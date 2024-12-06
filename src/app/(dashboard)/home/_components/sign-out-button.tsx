import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { SignOutButton } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";

export function SignOut() {
  const user = useQuery(api.functions.user.get);
  return (
    <div className="w-10">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton className="flex items-center">
            <Avatar className="size-6">
              <AvatarImage src={user?.image} />
              <AvatarFallback>{user?.username[0]}</AvatarFallback>
            </Avatar>
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem asChild>
            <SignOutButton />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
