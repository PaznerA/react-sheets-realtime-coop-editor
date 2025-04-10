import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  useSidebar
} from "@/components/ui/sidebar";
import { Home, FileSpreadsheet, Settings, Info, Github, ListOrdered } from "lucide-react";

export const AppSidebar: React.FC = () => {
  const location = useLocation();
  const { isMobile, openMobile, setOpenMobile } = useSidebar();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Zavírá mobilní menu po kliknutí na položku (pro lepší UX)
  const handleMobileItemClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-2">
        <h2 className="text-xl font-bold">Sheet Editor</h2>
        <p className="text-xs text-muted-foreground">Správa tabulkových dat</p>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/")} onClick={handleMobileItemClick}>
              <Link to="/">
                <Home />
                <span>Projekty</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/editor") || location.pathname.startsWith("/editor/")} onClick={handleMobileItemClick}>
              <Link to="/editor">
                <FileSpreadsheet />
                <span>Editor</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/enums")} onClick={handleMobileItemClick}>
              <Link to="/enums">
                <ListOrdered />
                <span>Enums</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/settings")} onClick={handleMobileItemClick}>
              <Link to="/settings">
                <Settings />
                <span>Nastavení</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      
      <SidebarFooter className="px-4 py-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span> 2023 Sheet Editor</span>
          <div className="flex space-x-2">
            <a href="#" className="hover:text-foreground">
              <Info className="h-4 w-4" />
            </a>
            <a href="#" className="hover:text-foreground">
              <Github className="h-4 w-4" />
            </a>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
