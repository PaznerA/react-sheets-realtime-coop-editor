
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/Sidebar";
import Index from "./pages/Index";
import Projects from "./pages/Projects";
import Editor from "./pages/Editor";
import Enums from "./pages/Enums";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { SidebarInset } from "@/components/ui/sidebar";
import { EnumProvider } from "./contexts/EnumContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <EnumProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SidebarProvider>
            <div className="flex min-h-screen w-full">
              <AppSidebar />
              <SidebarInset className="bg-gray-50">
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
  </QueryClientProvider>
);

export default App;
