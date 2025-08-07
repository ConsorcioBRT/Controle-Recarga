import {
  Building2,
  BusFront,
  Cable,
  ChevronUp,
  LayoutDashboard,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Image from "next/image";

// Menu items
const items = [
  {
    title: "Dashboard",
    url: "/admin/", // mude aqui para sua rota real
    icon: LayoutDashboard,
  },
  {
    title: "Eletroposto",
    url: "/admin/eletroposto",
    icon: Cable,
  },
  {
    title: "Usuários",
    url: "/admin/usuarios",
    icon: User,
  },
  {
    title: "Veículos",
    url: "/admin/veiculos",
    icon: BusFront,
  },
  {
    title: "Consorciada",
    url: "/admin/consorciada",
    icon: Building2,
  },
  {
    title: "Configurações",
    url: "/admin/configuracao",
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar className="w-64">
      <SidebarContent>
        <SidebarGroup>
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem className="flex items-center justify-center">
                <Image
                  src="/image/brtgo_logo.jpg"
                  alt="Logo"
                  width={100}
                  height={100}
                  className="rounded-full"
                />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarSeparator className="mb-5" />
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="hover:bg-gray-200 h-12">
                    <Link
                      href={item.url}
                      className="flex items-center gap-2 text-sm"
                    >
                      <item.icon className="w-12 h-12" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="h-20 bg-gray-100">
                <SidebarMenuButton>
                  <Avatar>
                    <AvatarImage
                      src="https://github.com/leerob.png"
                      alt="@leerob"
                    />
                    <AvatarFallback>LR</AvatarFallback>
                  </Avatar>{" "}
                  <div className="flex flex-col items-start">
                    <h1 className="font-bold">Username</h1>{" "}
                    <span className="text-xs">email@email.com</span>
                  </div>
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuLabel className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage
                      src="https://github.com/leerob.png"
                      alt="@leerob"
                    />
                    <AvatarFallback>LR</AvatarFallback>
                  </Avatar>{" "}
                  <div className="flex flex-col items-start">
                    <h1 className="font-bold">Username</h1>{" "}
                    <span className="text-xs">email@email.com</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <Link href="/admin/configuracao">
                    <DropdownMenuItem className="flex items-center justify-between">
                      Configurações
                      <Settings />
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center justify-between">
                  Log out
                  <LogOut />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
