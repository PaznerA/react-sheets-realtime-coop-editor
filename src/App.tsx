
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/Sidebar";
import Index from "./pages/Index";
import Projects from "./pages/Projects";
import Editor from "./pages/Editor";
import Enums from "./pages/Enums";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { SidebarInset } from "@/components/ui/sidebar";
import { EnumProvider } from "./contexts/EnumContext";
import { SpacetimeProvider } from "./module_bindings/client";
import { SPACETIME_CONFIG } from "./config/spaceTimeConfig";

const queryClient = new QueryClient();

// Konfigurace pro SpacetimeDB
const spacetimeConfig = {
  host: SPACETIME_CONFIG.HOST || "localhost",
  port: SPACETIME_CONFIG.PORT || 8080,
  namespace: SPACETIME_CONFIG.MODULE_NAME || "spacetime-sheets"
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SpacetimeProvider
      host={`http://${spacetimeConfig.host}:${spacetimeConfig.port}`}
      namespace={spacetimeConfig.namespace}
    >
      <TooltipProvider>
        <EnumProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <SidebarProvider>
              <div className="flex min-h-screen w-full flex-col md:flex-row">
                <AppSidebar />
                <SidebarInset className="bg-gray-50 flex-1 overflow-hidden">
                  {/* Burger menu pro mobilní verzi */}
                  <div className="sticky top-0 p-2 z-50 md:hidden bg-white border-b">
                    <SidebarTrigger className="h-9 w-9" />
                  </div>
                  <Routes>
                    <Route path="/" element={<Projects />} />
                    <Route path="/editor" element={<Editor />} />
                    <Route path="/editor/:projectId" element={<Editor />} />
                    <Route path="/enums" element={<Enums />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </SidebarInset>
              </div>
            </SidebarProvider>
          </BrowserRouter>
        </EnumProvider>
      </TooltipProvider>
    </SpacetimeProvider>
  </QueryClientProvider>
);

export default App;
