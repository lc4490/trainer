import { SidebarProvider } from "@/components/ui/sidebar";

export default function EquipmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SidebarProvider>{children}</SidebarProvider>;
}
