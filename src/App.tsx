
import React from "react";
import { Toaster } from "@/components/ui/sonner";
import { TenantProvider } from "@/contexts/TenantContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
            <main className="min-h-screen w-full">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/map" element={<Map />} />
                <Route path="/classifieds" element={<Classifieds />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </BrowserRouter>
          <Toaster />
        </TenantProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
