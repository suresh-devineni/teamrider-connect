
import React from "react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { MapPin } from "lucide-react";

const Map = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      <main className="pt-24 px-4 pb-20">
        <Card className="p-6 h-[calc(100vh-250px)] flex flex-col items-center justify-center">
          <MapPin className="w-12 h-12 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-center">Map View Coming Soon</h2>
          <p className="text-gray-500 text-center mt-2">
            We're working on adding an interactive map to help you track your rides.
          </p>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
};

export default Map;
