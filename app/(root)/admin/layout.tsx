import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="bg-gray-50 w-full p-3">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
