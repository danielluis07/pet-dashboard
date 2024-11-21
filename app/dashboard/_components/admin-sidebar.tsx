import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { House, LayoutGrid, Dog, Tag } from "lucide-react";
import { LogOutBtn } from "@/components/auth/log-out-btn";

const items = [
  {
    url: "/dashboard",
    icon: House,
    label: "Home",
  },
  {
    url: "/dashboard/pets",
    icon: Dog,
    label: "Pets",
  },
  {
    url: "/dashboard/categories",
    icon: LayoutGrid,
    label: "Categories",
  },
  {
    url: "/dashboard/products",
    icon: Tag,
    label: "Products",
  },
];

export function AdminSidebar() {
  return (
    <Sidebar>
      <div>
        <h1 className="text-lg font-bold text-center p-5">PetShop Dashboard</h1>
      </div>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <LogOutBtn />
        <p className="text-[10px] text-gray-500 text-center">
          © 2024 MedFind. Todos os direitos reservados.
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
