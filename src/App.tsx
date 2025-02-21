
import React from "react";
import { Toaster } from "@/components/ui/sonner";
import { TenantProvider } from "@/contexts/TenantContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Index from "./pages/Index";
import Profile from "./pages/Profile";
import Map from "./pages/Map";
import Classifieds from "./pages/Classifieds";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TenantProvider>
          <BrowserRouter>
            <SidebarProvider>
              <div className="min-h-screen flex w-full">
                <AppSidebar />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/map" element={<Map />} />
                    <Route path="/classifieds" element={<Classifieds />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
              </div>
            </SidebarProvider>
          </BrowserRouter>
          <Toaster />
        </TenantProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
