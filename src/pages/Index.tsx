
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { LocationSelector } from "@/components/LocationSelector";
import { RideToggle } from "@/components/RideToggle";
import { RideCard } from "@/components/RideCard";
import { mockRides } from "@/data/mockRides";

const Index = () => {
  const [activeTab, setActiveTab] = useState<"offer" | "request">("offer");
  const [selectedLocation, setSelectedLocation] = useState<"from" | "to" | null>(null);

  const handleTabChange = async (tab: "offer" | "request") => {
    await Haptics.impact({ style: ImpactStyle.Light });
    setActiveTab(tab);
  };

  const handleRideAction = async () => {
    await Haptics.impact({ style: ImpactStyle.Medium });
  };

  const handleLocationSelect = async (type: "from" | "to") => {
    await Haptics.impact({ style: ImpactStyle.Light });
    setSelectedLocation(type);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      <main className="pt-24 px-4 pb-20">
        <LocationSelector onLocationSelect={handleLocationSelect} />
        <RideToggle activeTab={activeTab} onTabChange={handleTabChange} />

        <ScrollArea className="h-[calc(100vh-430px)]">
          <div className="space-y-4">
            {mockRides.map((ride) => (
              <RideCard 
                key={ride.id} 
                ride={ride}
                type={activeTab} 
                onAction={handleRideAction}
              />
            ))}
          </div>
        </ScrollArea>
      </main>

      <BottomNav />
    </div>
  );
};

export default Index;
